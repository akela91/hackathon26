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
import sys
import time
import urllib.request
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / "backend" / "cache"
COVERS_DIR = ROOT / "frontend" / "public" / "covers"

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


SOURCES = [("google", try_google), ("openlibrary", try_openlibrary)]


def main() -> int:
    parser = argparse.ArgumentParser(description="Könyvborító-cache builder")
    parser.add_argument("--limit", type=int, default=0, help="max ennyi ISBN-t próbál (0 = mind)")
    parser.add_argument("--sleep", type=float, default=0.6, help="szünet a kérések között (s)")
    args = parser.parse_args()

    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    isbns = collect_isbns()
    log(f"Egyedi ISBN a cache-ben: {len(isbns)}")

    todo = [i for i in isbns if not (COVERS_DIR / f"{i}.jpg").exists()]
    if args.limit:
        todo = todo[: args.limit]
    log(f"Már cache-elt: {len(isbns) - len([i for i in isbns if not (COVERS_DIR / f'{i}.jpg').exists()])}, "
        f"letöltendő: {len(todo)}")

    ok, fail = 0, 0
    for isbn in todo:
        got = None
        used = None
        for name, fn in SOURCES:
            got = fn(isbn)
            if got:
                used = name
                break
            time.sleep(args.sleep)
        if got:
            (COVERS_DIR / f"{isbn}.jpg").write_bytes(got)
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
