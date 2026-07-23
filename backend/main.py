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

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

CACHE_DIR = Path(__file__).resolve().parent / "cache"

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

# Memóriacache: (scope, fájlnév) -> tartalom
_CACHE: dict[tuple[str, str], dict] = {}
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


def _load(scope: str, name: str) -> dict:
    """JSON betöltése a `backend/cache/<scope>/<name>` útvonalról, memóriában
    gyorsítótárazva."""
    key = (scope, name)
    if key in _CACHE:
        return _CACHE[key]

    if scope not in _valid_scopes():
        raise HTTPException(
            status_code=404,
            detail=f"Ismeretlen könyvtár scope: '{scope}'. Érvényes értékek: {sorted(_valid_scopes())}",
        )

    path = CACHE_DIR / scope / name
    if not path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"A(z) '{scope}/{name}' cache fájl hiányzik. Futtasd le a pipeline-t.",
        )
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    _CACHE[key] = data
    return data


LibraryParam = Query(default="ALL", description="Könyvtár kódja, vagy 'ALL' az összesített nézethez.")


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

    print(f"[backend] manifest betöltve: scopes={manifest.get('scopes')}")
    for scope in manifest.get("scopes", []):
        scope_dir = CACHE_DIR / scope
        if not scope_dir.exists():
            continue
        for path in scope_dir.glob("*.json"):
            try:
                _load(scope, path.name)
            except HTTPException as exc:
                print(f"[backend] hiba a betöltésekor {scope}/{path.name}: {exc.detail}")
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
def get_summary(library: str = LibraryParam) -> dict:
    """Összefoglaló statisztikák egy adott könyvtárra vagy mindre (ALL)."""
    return _load(library, "summary_stats.json")


@app.get("/api/authors")
def get_authors(library: str = LibraryParam) -> dict:
    """TOP szerzők havi kölcsönzési számai animált chartokhoz."""
    return _load(library, "top_authors_monthly.json")


@app.get("/api/quiz")
def get_quiz(library: str = LibraryParam) -> dict:
    """Kvíz adatok: top könyvek + kakukktojások, top szerzők."""
    return _load(library, "quiz_data.json")


@app.get("/api/heatmaps")
def get_heatmaps(library: str = LibraryParam) -> dict:
    """Idő- és geo-hőtérkép adatok együtt."""
    return {
        "time": _load(library, "heatmap_time.json"),
        "geo": _load(library, "heatmap_geo.json"),
    }


@app.get("/api/heatmaps/time")
def get_heatmap_time(library: str = LibraryParam) -> dict:
    return _load(library, "heatmap_time.json")


@app.get("/api/heatmaps/geo")
def get_heatmap_geo(library: str = LibraryParam) -> dict:
    return _load(library, "heatmap_geo.json")


@app.get("/api/heatmaps/eto-age")
def get_heatmap_eto_age(library: str = LibraryParam) -> dict:
    """Életkor (5 éves bucket) x ETO főosztály kölcsönzési mátrix."""
    return _load(library, "heatmap_eto_age.json")
