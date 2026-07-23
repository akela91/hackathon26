"""
Városok geokódolása a térképdiagramhoz.

Végigmegy a backend/cache/**/heatmap_geo.json fájlokon, összegyűjti az egyedi
településneveket (by_city), geokódolja őket a Nominatim (OpenStreetMap) ingyenes
API-jával, és a koordinátákat visszaírja a JSON-okba (lat/lng a by_city
elemekhez). A koordinátákat egy cache-fájlban (pipeline/city_coords.json) tárolja,
így a script idempotens és újrafuttatáskor csak az új városokat kéri le.

A Nominatim használati szabálya: max ~1 kérés/másodperc + valódi User-Agent.

Használat:
    python pipeline/geocode_geo.py
"""

from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / "backend" / "cache"
COORDS_FILE = Path(__file__).resolve().parent / "city_coords.json"
UA = "LibraryWrapped/1.0 (hackathon; contact: zoltan.erdos@qulto.eu)"


def log(msg: str) -> None:
    print(f"[geocode] {msg}", flush=True)


def geocode(city: str) -> list[float] | None:
    q = urllib.parse.urlencode({"q": f"{city}, Magyarország", "format": "json", "limit": 1, "countrycodes": "hu"})
    url = f"https://nominatim.openstreetmap.org/search?{q}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.load(r)
        if data:
            return [round(float(data[0]["lat"]), 5), round(float(data[0]["lon"]), 5)]
    except Exception:  # noqa: BLE001
        return None
    return None


def main() -> int:
    if not CACHE_DIR.exists():
        log("Nincs backend/cache. Futtasd előbb a process_data.py-t.")
        return 1

    coords: dict[str, list[float]] = {}
    if COORDS_FILE.exists():
        coords = json.loads(COORDS_FILE.read_text(encoding="utf-8"))
    log(f"Betöltött koordináta-cache: {len(coords)} város")

    geo_files = list(CACHE_DIR.rglob("heatmap_geo.json"))
    cities: set[str] = set()
    for gf in geo_files:
        data = json.loads(gf.read_text(encoding="utf-8"))
        for row in data.get("by_city", []):
            if row.get("city"):
                cities.add(row["city"])
    log(f"Egyedi települések: {len(cities)}  ({len(geo_files)} geo fájlból)")

    todo = sorted(c for c in cities if c not in coords)
    log(f"Geokódolandó (új): {len(todo)}")
    ok = 0
    for i, city in enumerate(todo, 1):
        res = geocode(city)
        if res:
            coords[city] = res
            ok += 1
        if i % 25 == 0 or i == len(todo):
            COORDS_FILE.write_text(json.dumps(coords, ensure_ascii=False, indent=1), encoding="utf-8")
            log(f"  {i}/{len(todo)} kész (talált: {ok})")
        time.sleep(1.1)  # Nominatim rate limit

    COORDS_FILE.write_text(json.dumps(coords, ensure_ascii=False, indent=1), encoding="utf-8")

    # Koordináták visszaírása minden geo JSON by_city elemébe.
    written = 0
    for gf in geo_files:
        data = json.loads(gf.read_text(encoding="utf-8"))
        changed = False
        for row in data.get("by_city", []):
            c = coords.get(row.get("city", ""))
            if c and (row.get("lat") != c[0] or row.get("lng") != c[1]):
                row["lat"], row["lng"] = c[0], c[1]
                changed = True
        if changed:
            gf.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            written += 1
    log(f"Kész. Koordináta-cache: {len(coords)}, frissített geo fájl: {written}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
