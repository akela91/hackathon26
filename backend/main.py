"""
Library Wrapped – FastAPI backend.

Villámgyors, "buta" kiszolgáló réteg: NEM számol semmit futásidőben, csak a
pipeline által előre legenerált JSON fájlokat olvassa fel és adja vissza.
Az összes JSON-t induláskor a memóriába tölti, így a válaszidő ~0.

A pipeline minden aggregátumot legenerál egyszer az ÖSSZES könyvtárra
("ALL" scope) és egyszer minden egyes könyvtárra külön is. Minden végpont
elfogad egy `?library=` query paramétert (alapértelmezés: "ALL"), aminek
érvényes értéke a manifest.json-ban felsorolt könyvtárkódok egyike, vagy "ALL".
Ez garantálja, hogy a kliens csak PONTOSAN EGY könyvtárat vagy MINDET tud
lekérdezni – több könyvtár egyidejű kiválasztása strukturálisan kizárt.

Indítás a repo gyökeréből:
    python -m uvicorn backend.main:app --reload --port 8000
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import urllib.request
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

BACKEND_DIR = Path(__file__).resolve().parent
CACHE_DIR = BACKEND_DIR / "cache"
# A frontend statikus borító-mappája – ide menti a LIVE lekért borítókat, hogy
# legközelebb már a /covers/<isbn>.jpg statikus útról (rate limit nélkül) jöjjön.
COVERS_DIR = BACKEND_DIR.parent / "frontend" / "public" / "covers"
MOLY_KEY = os.environ.get("MOLY_API_KEY", "3984519dacf4a56618d49a59ff0e40df")
_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LibraryWrapped/1.0"
_BAD_HASHES = {"d7c21c65fc861fc5128753e9e091b23c"}  # Google "no image" placeholder

app = FastAPI(
    title="Library Wrapped API",
    description="Előre aggregált könyvtári statisztikákat kiszolgáló API.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memóriacache: (scope, év, fájlnév) -> tartalom
_CACHE: dict[tuple[str, str, str], dict] = {}
_MANIFEST: dict | None = None


def _load_manifest() -> dict:
    global _MANIFEST
    if _MANIFEST is not None:
        return _MANIFEST
    path = CACHE_DIR / "manifest.json"
    if not path.exists():
        raise HTTPException(
            status_code=503,
            detail="A manifest.json hiányzik. Futtasd le a pipeline-t: python pipeline/process_data.py",
        )
    with path.open("r", encoding="utf-8") as f:
        _MANIFEST = json.load(f)
    return _MANIFEST


def _valid_scopes() -> set[str]:
    return set(_load_manifest().get("scopes", ["ALL"]))


def _valid_years() -> set[str]:
    return {"ALL", *_load_manifest().get("years", [])}


def _load(scope: str, year: str, name: str) -> dict:
    """JSON betöltése a `backend/cache/<scope>/<year>/<name>` útvonalról,
    memóriában gyorsítótárazva. A `year` lehet "ALL" (összes év) vagy egy évszám."""
    key = (scope, year, name)
    if key in _CACHE:
        return _CACHE[key]

    if scope not in _valid_scopes():
        raise HTTPException(
            status_code=404,
            detail=f"Ismeretlen könyvtár scope: '{scope}'. Érvényes: {sorted(_valid_scopes())}",
        )
    if year not in _valid_years():
        raise HTTPException(
            status_code=404,
            detail=f"Ismeretlen év: '{year}'. Érvényes: {sorted(_valid_years())}",
        )

    path = CACHE_DIR / scope / year / name
    if not path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"A(z) '{scope}/{year}/{name}' cache fájl hiányzik. Futtasd le a pipeline-t.",
        )
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    _CACHE[key] = data
    return data


LibraryParam = Query(default="ALL", description="Könyvtár kódja, vagy 'ALL' az összesített nézethez.")
YearParam = Query(default="ALL", description="Évszám (pl. '2024'), vagy 'ALL' az összes évhez.")


@app.on_event("startup")
def warm_cache() -> None:
    """Induláskor előre betölti a manifestet és az összes scope összes JSON-ját."""
    if not CACHE_DIR.exists():
        print(f"[backend] FIGYELEM: a cache mappa nem létezik: {CACHE_DIR}")
        return
    try:
        manifest = _load_manifest()
    except HTTPException as exc:
        print(f"[backend] FIGYELEM: {exc.detail}")
        return

    print(f"[backend] manifest: scopes={manifest.get('scopes')} years={manifest.get('years')}")
    year_opts = ["ALL", *manifest.get("years", [])]
    for scope in manifest.get("scopes", []):
        for year in year_opts:
            sub = CACHE_DIR / scope / year
            if not sub.exists():
                continue
            for path in sub.glob("*.json"):
                try:
                    _load(scope, year, path.name)
                except HTTPException as exc:
                    print(f"[backend] hiba: {scope}/{year}/{path.name}: {exc.detail}")
    print(f"[backend] {len(_CACHE)} cache fájl betöltve.")


@app.get("/")
def root() -> dict:
    return {
        "service": "Library Wrapped API",
        "status": "ok",
        "endpoints": [
            "/api/manifest",
            "/api/summary",
            "/api/quiz",
            "/api/heatmaps",
            "/api/heatmaps/eto-age",
            "/api/authors",
            "/api/health",
        ],
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "loaded_cache_entries": len(_CACHE)}


@app.get("/api/manifest")
def get_manifest() -> dict:
    """Elérhető könyvtárak és scope-ok listája (a library-választóhoz)."""
    return _load_manifest()


@app.get("/api/summary")
def get_summary(library: str = LibraryParam, year: str = YearParam) -> dict:
    """Összefoglaló statisztikák egy adott könyvtárra/évre vagy mindre (ALL)."""
    return _load(library, year, "summary_stats.json")


@app.get("/api/authors")
def get_authors(library: str = LibraryParam, year: str = YearParam) -> dict:
    """TOP szerzők havi kölcsönzési számai animált chartokhoz."""
    return _load(library, year, "top_authors_monthly.json")


@app.get("/api/quiz")
def get_quiz(library: str = LibraryParam, year: str = YearParam) -> dict:
    """Kvíz adatok: top könyvek + kakukktojások, top szerzők."""
    return _load(library, year, "quiz_data.json")


@app.get("/api/heatmaps")
def get_heatmaps(library: str = LibraryParam, year: str = YearParam) -> dict:
    """Idő- és geo-hőtérkép adatok együtt."""
    return {
        "time": _load(library, year, "heatmap_time.json"),
        "geo": _load(library, year, "heatmap_geo.json"),
    }


@app.get("/api/heatmaps/time")
def get_heatmap_time(library: str = LibraryParam, year: str = YearParam) -> dict:
    return _load(library, year, "heatmap_time.json")


@app.get("/api/heatmaps/geo")
def get_heatmap_geo(library: str = LibraryParam, year: str = YearParam) -> dict:
    return _load(library, year, "heatmap_geo.json")


@app.get("/api/heatmaps/eto-age")
def get_heatmap_eto_age(library: str = LibraryParam, year: str = YearParam) -> dict:
    """Életkor (5 éves bucket) x ETO főosztály kölcsönzési mátrix."""
    return _load(library, year, "heatmap_eto_age.json")


# --- Könyvborító LIVE lekérés + cache ---------------------------------------

def _http_get(url: str, timeout: int = 12) -> tuple[int, bytes, str]:
    req = urllib.request.Request(url, headers={"User-Agent": _UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(), r.headers.get("Content-Type", "")
    except Exception:  # noqa: BLE001
        return 0, b"", ""


def _valid_image(data: bytes, content_type: str) -> bool:
    if len(data) < 2000:
        return False
    if "image" not in content_type.lower() and data[:3] != b"\xff\xd8\xff":
        return False
    return hashlib.md5(data).hexdigest() not in _BAD_HASHES


def _fetch_cover_live(isbn: str) -> bytes | None:
    """Élő borító-lekérés: moly.hu → Google Books → Open Library."""
    # 1) moly.hu
    st, body, _ = _http_get(f"https://moly.hu/api/book_by_isbn.json?q={isbn}&key={MOLY_KEY}")
    if st == 200 and body:
        try:
            url = json.loads(body).get("cover")
            if url:
                s, data, ct = _http_get(url)
                if s == 200 and _valid_image(data, ct):
                    return data
        except Exception:  # noqa: BLE001
            pass
    # 2) Google Books
    st, body, _ = _http_get(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&country=HU")
    if st == 200 and body:
        try:
            items = json.loads(body).get("items") or []
            if items:
                links = items[0].get("volumeInfo", {}).get("imageLinks", {})
                url = (links.get("thumbnail") or links.get("smallThumbnail") or "").replace(
                    "http://", "https://"
                ).replace("&edge=curl", "")
                if url:
                    s, data, ct = _http_get(url)
                    if s == 200 and _valid_image(data, ct):
                        return data
        except Exception:  # noqa: BLE001
            pass
    # 3) Open Library
    s, data, ct = _http_get(f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false")
    if s == 200 and _valid_image(data, ct):
        return data
    return None


def _moly_search_cover(title: str, author: str) -> bytes | None:
    """Cím/szerző alapú borító a moly.hu-ról: books.json keresés → első találat
    id → book/{id}.json → cover. Több lekérdezés-variánst próbál (a pontos cím
    után egyszerűsítve), hogy 'egy jó vagy hasonló' borítót találjon."""
    import urllib.parse

    author_norm = re.sub(r"[,]", " ", author or "").strip()
    title = (title or "").strip()
    # A kötőjeles/összetett előtag gyakran elrontja a találatot ("Zseb-Garfield"
    # → "Garfield"), ezért egyszerűsített variánsokat is próbálunk.
    first_word = re.split(r"[\s:–-]+", title)[0] if title else ""
    queries = [
        f"{title} {author_norm}".strip(),
        title,
        f"{first_word} {author_norm}".strip(),
        first_word,
    ]
    seen: set[str] = set()
    for q in queries:
        q = q.strip()
        if not q or q in seen:
            continue
        seen.add(q)
        st, body, _ = _http_get(
            f"https://moly.hu/api/books.json?q={urllib.parse.quote(q)}&key={MOLY_KEY}"
        )
        if st != 200 or not body:
            continue
        try:
            books = json.loads(body).get("books") or []
        except Exception:  # noqa: BLE001
            continue
        for item in books[:3]:
            bid = item.get("id")
            if not bid:
                continue
            st2, body2, _ = _http_get(f"https://moly.hu/api/book/{bid}.json?key={MOLY_KEY}")
            if st2 != 200 or not body2:
                continue
            try:
                bk = json.loads(body2).get("book", {})
            except Exception:  # noqa: BLE001
                continue
            url = bk.get("cover")
            if url:
                s, data, ct = _http_get(url)
                if s == 200 and _valid_image(data, ct):
                    return data
    return None


def _title_key(title: str, author: str) -> str:
    h = hashlib.md5(f"{(title or '').strip()}|{(author or '').strip()}".encode("utf-8")).hexdigest()
    return f"t_{h[:16]}"


@app.get("/api/cover")
def get_cover(isbn: str = "", title: str = "", author: str = "") -> Response:
    """Könyvborító ISBN és/vagy cím+szerző alapján. Sorrend: lokális cache →
    ISBN-alapú élő lekérés (moly → Google → OL) → cím/szerző alapú moly keresés.
    A talált képet elmenti a covers mappába (ISBN-kulcs vagy title-hash), és
    visszaadja. 404, ha sehol nincs borító."""
    clean = re.sub(r"[^0-9Xx]", "", isbn).upper()
    key = clean if len(clean) >= 10 else (_title_key(title, author) if title else "")
    if not key:
        raise HTTPException(status_code=400, detail="Adj meg ISBN-t vagy címet.")

    path = COVERS_DIR / f"{key}.jpg"
    if path.exists():
        return Response(content=path.read_bytes(), media_type="image/jpeg",
                        headers={"Cache-Control": "public, max-age=31536000"})

    data = None
    if len(clean) >= 10:
        data = _fetch_cover_live(clean)
    if not data and title:
        data = _moly_search_cover(title, author)
    if not data:
        raise HTTPException(status_code=404, detail="Nincs borító.")

    try:
        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)  # cache-mentés a következő kérésekhez
    except OSError:
        pass
    return Response(content=data, media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=31536000"})
