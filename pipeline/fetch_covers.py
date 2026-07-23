"""
Könyvborító-cache builder.

Végigmegy a backend/cache/**/quiz_data.json és summary_stats.json fájlokon,
összegyűjti a megjelenített könyvek EGYEDI ISBN-jeit, és megpróbálja letölteni
a borítót több ingyenes forrásból. Amit egyszer sikerül letölteni, azt lokálisan
elmenti a frontend/public/covers/<isbn>.jpg alá — így render-időben (a
böngészőben) NINCS külső API-hívás és rate limit, a borító mindig azonnal jön.

A script IDEMPOTENS: a már meglévő borítókat kihagyja, tehát bármikor újra
futtatható, és fokozatosan feltölti a cache-t, amikor a hálózat/API elérhető.
A Google "nincs borító" placeholderjét (ismert méret/hash) és a túl kicsi
képeket eldobja, hogy ne kerüljön szemét a cache-be.

Használat:
    python pipeline/fetch_covers.py
    python pipeline/fetch_covers.py --limit 50
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / "backend" / "cache"
COVERS_DIR = ROOT / "frontend" / "public" / "covers"
LIBRI_XML = ROOT / "logo" / "libri_cover.xml"
NS = "{http://bookline.hu/export}"


def norm_isbn(s: str) -> str:
    """ISBN normalizálás egyezéshez: csak számjegyek és X, nagybetűsítve."""
    return re.sub(r"[^0-9Xx]", "", s or "").upper()

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LibraryWrapped/1.0"
MIN_BYTES = 3000  # ennél kisebb kép gyanús (placeholder / 1px)
# A Google Books "image not available" placeholder ismert lenyomatai.
BAD_HASHES = {"d7c21c65fc861fc5128753e9e091b23c"}


def log(msg: str) -> None:
    print(f"[covers] {msg}", flush=True)


def collect_isbns() -> list[str]:
    isbns: set[str] = set()
    if not CACHE_DIR.exists():
        return []
    for path in CACHE_DIR.rglob("quiz_data.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        for b in data.get("book_quiz", {}).get("top_books", []) + data.get("book_quiz", {}).get("decoys", []):
            if b.get("isbn"):
                isbns.add(b["isbn"])
    for path in CACHE_DIR.rglob("summary_stats.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        for b in data.get("top_renewed_books", []):
            if b.get("isbn"):
                isbns.add(b["isbn"])
    return sorted(isbns)


def build_libri_index(needed: set[str]) -> dict[str, str]:
    """A libri_cover.xml egyszeri, streaming (iterparse) beolvasása. Minden
    termékből kigyűjti az ean13 + isbn azonosítókat és a borító URL-t; azokat
    a normalizált ISBN-eket térképezi az URL-re, amelyek szerepelnek a `needed`
    halmazban. 160 MB-os XML → elem-eldobással, alacsony memóriaigénnyel."""
    index: dict[str, str] = {}
    if not LIBRI_XML.exists():
        log(f"FIGYELEM: {LIBRI_XML} nem található – Libri forrás kihagyva.")
        return index
    found = 0
    for _evt, elem in ET.iterparse(str(LIBRI_XML), events=("end",)):
        if elem.tag != f"{NS}product":
            continue
        ids = [norm_isbn(e.text) for e in elem.iter() if e.tag in (f"{NS}ean13", f"{NS}isbn") and e.text]
        img = None
        for res in elem.iter(f"{NS}image"):
            if res.text:
                img = res.text.strip()
                break
        if img:
            for i in ids:
                if i and i in needed and i not in index:
                    index[i] = img
                    found += 1
        elem.clear()  # memória felszabadítása
    log(f"Libri index: {found} egyező ISBN → borító URL a {len(needed)} keresettből.")
    return index


def http_get(url: str, timeout: int = 12) -> tuple[int, bytes, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(), r.headers.get("Content-Type", "")
    except urllib.error.HTTPError as e:  # noqa
        return e.code, b"", ""
    except Exception:  # noqa: BLE001
        return 0, b"", ""


def is_valid_image(data: bytes, content_type: str) -> bool:
    if len(data) < MIN_BYTES:
        return False
    if "image" not in content_type.lower() and not data[:3] == b"\xff\xd8\xff":
        return False
    if hashlib.md5(data).hexdigest() in BAD_HASHES:
        return False
    return True


def try_google(isbn: str) -> bytes | None:
    """Google Books API → imageLinks thumbnail letöltése."""
    status, body, _ = http_get(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&country=HU")
    if status != 200 or not body:
        return None
    try:
        j = json.loads(body)
        items = j.get("items") or []
        if not items:
            return None
        links = items[0].get("volumeInfo", {}).get("imageLinks", {})
        url = links.get("thumbnail") or links.get("smallThumbnail")
        if not url:
            return None
        url = url.replace("http://", "https://").replace("&edge=curl", "")
        s, data, ct = http_get(url)
        return data if s == 200 and is_valid_image(data, ct) else None
    except Exception:  # noqa: BLE001
        return None


def try_openlibrary(isbn: str) -> bytes | None:
    s, data, ct = http_get(f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false")
    return data if s == 200 and is_valid_image(data, ct) else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Könyvborító-cache builder")
    parser.add_argument("--limit", type=int, default=0, help="max ennyi ISBN-t próbál (0 = mind)")
    parser.add_argument("--sleep", type=float, default=0.3, help="szünet a kérések között (s)")
    parser.add_argument("--no-libri", action="store_true", help="Libri XML forrás kihagyása")
    parser.add_argument("--no-web", action="store_true", help="csak Libri (Google/OL kihagyása)")
    args = parser.parse_args()

    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    isbns = collect_isbns()
    log(f"Egyedi ISBN a cache-ben: {len(isbns)}")

    todo = [i for i in isbns if not (COVERS_DIR / f"{i}.jpg").exists()]
    if args.limit:
        todo = todo[: args.limit]
    log(f"Már cache-elt: {len(isbns) - len(todo)}, letöltendő: {len(todo)}")

    # Elsődleges forrás: Libri XML index (csak a szükséges ISBN-ekre építve).
    libri: dict[str, str] = {}
    if not args.no_libri and todo:
        libri = build_libri_index({norm_isbn(i) for i in todo})

    web_sources = [] if args.no_web else [("google", try_google), ("openlibrary", try_openlibrary)]

    ok, fail = 0, 0
    for isbn in todo:
        got = None
        used = None

        # 1) Libri XML (elsődleges) – a magyar kiadásokra a legjobb.
        url = libri.get(norm_isbn(isbn))
        if url:
            s, data, ct = http_get(url)
            if s == 200 and is_valid_image(data, ct):
                got, used = data, "libri"

        # 2) Web fallback (Google Books, Open Library).
        if not got:
            for name, fn in web_sources:
                got = fn(isbn)
                if got:
                    used = name
                    break
                time.sleep(args.sleep)

        if got:
            (COVERS_DIR / f"{norm_isbn(isbn)}.jpg").write_bytes(got)
            ok += 1
            log(f"  ✓ {isbn}  ({used}, {len(got) // 1024} KB)")
        else:
            fail += 1
        time.sleep(args.sleep)

    log(f"Kész. Új borító: {ok}, sikertelen: {fail}. Összes cache-elt: "
        f"{len(list(COVERS_DIR.glob('*.jpg')))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
