"""
Library Wrapped – FastAPI backend.

Villámgyors, "buta" kiszolgáló réteg: NEM számol semmit futásidőben, csak a
pipeline által előre legenerált JSON fájlokat (backend/cache/*.json) olvassa fel
és adja vissza. A JSON-öket induláskor a memóriába tölti, így a válaszidő ~0.

Indítás:
    uvicorn backend.main:app --reload --port 8000
vagy a repo gyökeréből:
    python -m uvicorn backend.main:app --reload --port 8000
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

CACHE_DIR = Path(__file__).resolve().parent / "cache"

app = FastAPI(
    title="Library Wrapped API",
    description="Előre aggregált könyvtári statisztikákat kiszolgáló API.",
    version="1.0.0",
)

# CORS – a Next.js frontend (localhost:3000) és bármely dev origin számára.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Egyszerű memóriacache: fájlnév -> tartalom
_CACHE: dict[str, dict] = {}


def _load(name: str) -> dict:
    """JSON betöltése a cache mappából (memóriában gyorsítótárazva)."""
    if name in _CACHE:
        return _CACHE[name]
    path = CACHE_DIR / name
    if not path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"A(z) '{name}' cache fájl hiányzik. Futtasd le a pipeline-t: python pipeline/process_data.py",
        )
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    _CACHE[name] = data
    return data


@app.on_event("startup")
def warm_cache() -> None:
    """Induláskor előre betölti az összes elérhető cache fájlt."""
    if not CACHE_DIR.exists():
        print(f"[backend] FIGYELEM: a cache mappa nem létezik: {CACHE_DIR}")
        return
    for path in CACHE_DIR.glob("*.json"):
        try:
            _load(path.name)
            print(f"[backend] betöltve: {path.name}")
        except Exception as exc:  # noqa: BLE001
            print(f"[backend] hiba a betöltésekor {path.name}: {exc}")


@app.get("/")
def root() -> dict:
    return {
        "service": "Library Wrapped API",
        "status": "ok",
        "endpoints": ["/api/summary", "/api/quiz", "/api/heatmaps", "/api/authors", "/api/health"],
    }


@app.get("/api/health")
def health() -> dict:
    files = sorted(p.name for p in CACHE_DIR.glob("*.json")) if CACHE_DIR.exists() else []
    return {"status": "ok", "cache_files": files}


@app.get("/api/summary")
def get_summary() -> dict:
    """Összefoglaló statisztikák (summary_stats.json)."""
    return _load("summary_stats.json")


@app.get("/api/authors")
def get_authors() -> dict:
    """TOP szerzők havi kölcsönzési számai animált chartokhoz."""
    return _load("top_authors_monthly.json")


@app.get("/api/quiz")
def get_quiz() -> dict:
    """Kvíz adatok: top könyvek + kakukktojások, top szerzők."""
    return _load("quiz_data.json")


@app.get("/api/heatmaps")
def get_heatmaps() -> dict:
    """Idő- és geo-hőtérkép adatok együtt."""
    return {
        "time": _load("heatmap_time.json"),
        "geo": _load("heatmap_geo.json"),
    }


@app.get("/api/heatmaps/time")
def get_heatmap_time() -> dict:
    return _load("heatmap_time.json")


@app.get("/api/heatmaps/geo")
def get_heatmap_geo() -> dict:
    return _load("heatmap_geo.json")
