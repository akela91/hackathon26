"""
Library Wrapped – offline pre-aggregációs pipeline.

Beolvassa a data/input_datas_<dataset>/<konyvtar>/*.csv.gz állományokat DuckDB-vel,
és apró, előre aggregált JSON fájlokat ír a backend/cache/ mappába, amelyeket
a FastAPI backend statikusan kiszolgál. A cél: a webkérés pillanatában NE
számoljunk semmit – minden nehéz aggregáció itt, offline történik meg.

Használat:
    python pipeline/process_data.py            # a "mini" adaton
    python pipeline/process_data.py full        # a "full" adaton
    python pipeline/process_data.py mini --out backend/cache
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import duckdb

# Windows konzol: kényszerített UTF-8, hogy a magyar ékezetek és a ✓ ne dőljön el.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

# --- Elérési utak -----------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "backend" / "cache"

WEEKDAYS_HU = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"]

# Dokumentumtípus kódok (README alapján)
DOC_TYPE_HU = {
    "B": "Könyv",
    "C": "AV / CD",
    "S": "Periodika / Sorozat",
    "M": "Térkép",
    "D": "Disszertáció",
}


def log(msg: str) -> None:
    print(f"[pipeline] {msg}", flush=True)


def build_base_view(con: duckdb.DuckDBPyConnection, glob_pattern: str) -> int:
    """Létrehoz egy tisztított, típusos `tx` nézetet a nyers CSV-kből."""
    con.execute(
        f"""
        CREATE OR REPLACE VIEW raw AS
        SELECT *, filename AS __file
        FROM read_csv(
            '{glob_pattern}',
            header = true,
            delim = ';',
            quote = '"',
            all_varchar = true,
            filename = true,
            ignore_errors = true
        );
        """
    )

    con.execute(
        """
        CREATE OR REPLACE VIEW tx AS
        SELECT
            "Library"                                          AS library,
            NULLIF(TRIM("Patron ID"), '')                      AS patron_id,
            TRY_CAST("Birth Date" AS DATE)                     AS birth_date,
            NULLIF(TRIM("Patron Class"), '')                   AS patron_class,
            NULLIF(TRIM("Patron City"), '')                    AS patron_city,
            NULLIF(TRIM("Patron ZIP"), '')                     AS patron_zip,
            NULLIF(TRIM("Record ID"), '')                      AS record_id,
            NULLIF(TRIM("Author"), '')                         AS author,
            NULLIF(TRIM("Title"), '')                          AS title,
            NULLIF(TRIM("Publisher"), '')                      AS publisher,
            NULLIF(TRIM("Document Type"), '')                  AS document_type,
            NULLIF(TRIM("ETO"), '')                            AS eto,
            NULLIF(TRIM("Language"), '')                       AS language,
            TRY_CAST("Price" AS DOUBLE)                        AS price,
            NULLIF(TRIM("Theme"), '')                          AS theme,
            COALESCE(TRY_CAST("Renewals" AS INTEGER), 0)       AS renewals,
            COALESCE(TRY_CAST("Notices" AS INTEGER), 0)        AS notices,
            TRY_CAST(REPLACE("Checkout Date", 'Z', '') AS TIMESTAMP) AS checkout_ts,
            regexp_extract(__file, '(\\d{4})\\.csv\\.gz$', 1)  AS file_year
        FROM raw;
        """
    )
    # Idő-érvényes részhalmaz: csak azok a tranzakciók, amelyek Checkout Date-je
    # a fájlnevekben szereplő évekbe esik. Így kiszűrjük a hibás/nagyon régi
    # dátumokat (pl. 2009), amelyek elrondítanák a havi/óra bontású chartokat.
    con.execute(
        """
        CREATE OR REPLACE VIEW txt AS
        SELECT * FROM tx
        WHERE checkout_ts IS NOT NULL
          AND CAST(year(checkout_ts) AS VARCHAR) IN (
              SELECT DISTINCT file_year FROM tx WHERE file_year <> ''
          );
        """
    )
    (n,) = con.execute("SELECT COUNT(*) FROM tx").fetchone()
    return int(n)


def dicts(con: duckdb.DuckDBPyConnection, sql: str) -> list[dict]:
    """Lekérdezés eredménye dict-listaként (oszlopnevekkel)."""
    cur = con.execute(sql)
    cols = [c[0] for c in cur.description]
    return [dict(zip(cols, row)) for row in cur.fetchall()]


def scalar(con: duckdb.DuckDBPyConnection, sql: str):
    row = con.execute(sql).fetchone()
    return row[0] if row else None


# --- Egyes JSON generátorok -------------------------------------------------

def gen_summary(con: duckdb.DuckDBPyConnection, dataset: str) -> dict:
    total_checkouts = int(scalar(con, "SELECT COUNT(*) FROM tx") or 0)
    total_value = scalar(con, "SELECT COALESCE(SUM(price), 0) FROM tx")
    unique_patrons = int(scalar(con, "SELECT COUNT(DISTINCT patron_id) FROM tx") or 0)
    unique_titles = int(scalar(con, "SELECT COUNT(DISTINCT title) FROM tx WHERE title IS NOT NULL") or 0)
    total_renewals = int(scalar(con, "SELECT COALESCE(SUM(renewals), 0) FROM tx") or 0)
    avg_renewals = scalar(con, "SELECT COALESCE(AVG(renewals), 0) FROM tx")

    libraries = [r["library"] for r in dicts(con, "SELECT DISTINCT library FROM tx ORDER BY library")]

    by_year = dicts(
        con,
        """
        SELECT file_year AS year,
               COUNT(*) AS checkouts,
               COALESCE(SUM(price), 0) AS value_huf
        FROM tx
        WHERE file_year <> ''
        GROUP BY file_year
        ORDER BY file_year
        """,
    )

    by_library = dicts(
        con,
        """
        SELECT library,
               COUNT(*) AS checkouts,
               COALESCE(SUM(price), 0) AS value_huf,
               COUNT(DISTINCT patron_id) AS patrons
        FROM tx
        GROUP BY library
        ORDER BY checkouts DESC
        """,
    )

    # Legtöbbször hosszabbított könyvek (összesített Renewals cím szerint)
    top_renewed = dicts(
        con,
        """
        SELECT title,
               any_value(author) AS author,
               SUM(renewals) AS total_renewals,
               COUNT(*) AS checkouts
        FROM tx
        WHERE title IS NOT NULL
        GROUP BY title
        HAVING SUM(renewals) > 0
        ORDER BY total_renewals DESC, checkouts DESC
        LIMIT 10
        """,
    )

    # Legaktívabb időszakok
    busiest_month = dicts(
        con,
        """
        SELECT strftime(checkout_ts, '%Y-%m') AS month, COUNT(*) AS checkouts
        FROM txt
        GROUP BY month ORDER BY checkouts DESC LIMIT 1
        """,
    )
    busiest_weekday = dicts(
        con,
        """
        SELECT (isodow(checkout_ts) - 1) AS weekday, COUNT(*) AS checkouts
        FROM txt
        GROUP BY weekday ORDER BY checkouts DESC LIMIT 1
        """,
    )
    busiest_hour = dicts(
        con,
        """
        SELECT hour(checkout_ts) AS hour, COUNT(*) AS checkouts
        FROM txt
        GROUP BY hour ORDER BY checkouts DESC LIMIT 1
        """,
    )

    monthly = dicts(
        con,
        """
        SELECT strftime(checkout_ts, '%Y-%m') AS month, COUNT(*) AS checkouts
        FROM txt
        GROUP BY month ORDER BY month
        """,
    )

    # Dokumentumtípus megoszlás (bónusz insight)
    by_doc_type = dicts(
        con,
        """
        SELECT document_type AS code, COUNT(*) AS checkouts
        FROM tx WHERE document_type IS NOT NULL
        GROUP BY document_type ORDER BY checkouts DESC LIMIT 8
        """,
    )
    for d in by_doc_type:
        d["label"] = DOC_TYPE_HU.get(d["code"], d["code"])

    # Top nyelvek
    by_language = dicts(
        con,
        """
        SELECT language, COUNT(*) AS checkouts
        FROM tx WHERE language IS NOT NULL
        GROUP BY language ORDER BY checkouts DESC LIMIT 6
        """,
    )

    bw = busiest_weekday[0] if busiest_weekday else None
    if bw is not None:
        bw["label"] = WEEKDAYS_HU[int(bw["weekday"])]

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "dataset": dataset,
        "total_checkouts": total_checkouts,
        "total_value_huf": int(total_value or 0),
        "unique_patrons": unique_patrons,
        "unique_titles": unique_titles,
        "total_renewals": total_renewals,
        "avg_renewals": round(float(avg_renewals or 0), 2),
        "libraries": libraries,
        "by_year": by_year,
        "by_library": by_library,
        "by_doc_type": by_doc_type,
        "by_language": by_language,
        "top_renewed_books": top_renewed,
        "most_active_period": {
            "busiest_month": busiest_month[0] if busiest_month else None,
            "busiest_weekday": bw,
            "busiest_hour": busiest_hour[0] if busiest_hour else None,
        },
        "monthly_checkouts": monthly,
    }


def gen_top_authors_monthly(con: duckdb.DuckDBPyConnection, top_n: int = 10) -> dict:
    top_authors = [
        r["author"]
        for r in dicts(
            con,
            f"""
            SELECT author, COUNT(*) AS c
            FROM tx WHERE author IS NOT NULL
            GROUP BY author ORDER BY c DESC LIMIT {top_n}
            """,
        )
    ]
    if not top_authors:
        return {"months": [], "authors": []}

    months = [
        r["month"]
        for r in dicts(
            con,
            "SELECT DISTINCT strftime(checkout_ts, '%Y-%m') AS month FROM txt ORDER BY month",
        )
    ]
    month_index = {m: i for i, m in enumerate(months)}

    # Egy lekérdezés: szerző x hónap darabszám
    con.execute("CREATE OR REPLACE TEMP TABLE __top_authors(author VARCHAR)")
    con.executemany("INSERT INTO __top_authors VALUES (?)", [(a,) for a in top_authors])

    rows = dicts(
        con,
        """
        SELECT author, strftime(checkout_ts, '%Y-%m') AS month, COUNT(*) AS count
        FROM txt
        WHERE author IN (SELECT author FROM __top_authors)
        GROUP BY author, month
        """,
    )

    per_author: dict[str, list[int]] = {a: [0] * len(months) for a in top_authors}
    for r in rows:
        per_author[r["author"]][month_index[r["month"]]] = int(r["count"])

    authors_out = []
    for a in top_authors:
        data = per_author[a]
        authors_out.append({"author": a, "total": int(sum(data)), "data": data})

    return {"months": months, "authors": authors_out}


def gen_quiz(con: duckdb.DuckDBPyConnection) -> dict:
    top_books = dicts(
        con,
        """
        SELECT title,
               any_value(author) AS author,
               any_value(record_id) AS record_id,
               COUNT(*) AS checkouts
        FROM tx WHERE title IS NOT NULL
        GROUP BY title
        ORDER BY checkouts DESC
        LIMIT 5
        """,
    )

    # Kakukktojások: népszerűségi rangsor "hosszú farkából" vett, determinisztikus minta.
    ranked = dicts(
        con,
        """
        SELECT title,
               any_value(author) AS author,
               COUNT(*) AS checkouts
        FROM tx WHERE title IS NOT NULL AND author IS NOT NULL
        GROUP BY title
        ORDER BY checkouts DESC
        """,
    )
    decoys: list[dict] = []
    # Rangsor 60. helyétől lefelé, minden N-edik cím -> hihető, de nem top elemek.
    pool = ranked[60:] if len(ranked) > 70 else ranked[5:]
    if pool:
        step = max(1, len(pool) // 10)
        for i in range(0, len(pool), step):
            decoys.append(pool[i])
            if len(decoys) >= 10:
                break

    top_authors = dicts(
        con,
        """
        SELECT author, COUNT(*) AS checkouts
        FROM tx WHERE author IS NOT NULL
        GROUP BY author ORDER BY checkouts DESC LIMIT 5
        """,
    )

    return {
        "book_quiz": {"top_books": top_books, "decoys": decoys},
        "author_quiz": {"top_authors": top_authors},
    }


def gen_heatmap_time(con: duckdb.DuckDBPyConnection) -> dict:
    rows = dicts(
        con,
        """
        SELECT (isodow(checkout_ts) - 1) AS weekday,
               hour(checkout_ts) AS hour,
               COUNT(*) AS checkouts
        FROM txt
        GROUP BY weekday, hour
        """,
    )
    matrix = [[0] * 24 for _ in range(7)]
    max_val = 0
    for r in rows:
        wd, hr, c = int(r["weekday"]), int(r["hour"]), int(r["checkouts"])
        matrix[wd][hr] = c
        max_val = max(max_val, c)

    # ApexCharts heatmap-barát formátum
    apex_series = [
        {
            "name": WEEKDAYS_HU[wd],
            "data": [{"x": f"{h:02d}", "y": matrix[wd][h]} for h in range(24)],
        }
        for wd in range(7)
    ]

    return {
        "weekdays": WEEKDAYS_HU,
        "hours": list(range(24)),
        "matrix": matrix,
        "max": max_val,
        "apex_series": apex_series,
    }


def gen_heatmap_geo(con: duckdb.DuckDBPyConnection, limit: int = 40) -> dict:
    by_zip = dicts(
        con,
        f"""
        SELECT patron_zip AS zip,
               mode(patron_city) AS city,
               COUNT(*) AS checkouts,
               COUNT(DISTINCT patron_id) AS patrons
        FROM tx WHERE patron_zip IS NOT NULL
        GROUP BY patron_zip
        ORDER BY checkouts DESC
        LIMIT {limit}
        """,
    )
    by_city = dicts(
        con,
        f"""
        SELECT patron_city AS city,
               COUNT(*) AS checkouts,
               COUNT(DISTINCT patron_id) AS patrons
        FROM tx WHERE patron_city IS NOT NULL
        GROUP BY patron_city
        ORDER BY checkouts DESC
        LIMIT {limit}
        """,
    )
    return {"by_zip": by_zip, "by_city": by_city}


# --- Belépési pont ----------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Library Wrapped pre-aggregációs pipeline")
    parser.add_argument("dataset", nargs="?", default="mini", help="mini vagy full (alap: mini)")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="cache kimeneti mappa")
    parser.add_argument("--data-dir", default=str(ROOT / "data"), help="a data gyökér")
    args = parser.parse_args()

    data_root = Path(args.data_dir)
    src_dir = data_root / f"input_datas_{args.dataset}"
    if not src_dir.exists():
        log(f"HIBA: a forrásmappa nem létezik: {src_dir}")
        return 1

    glob_pattern = (src_dir / "*" / "*.csv.gz").as_posix()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    log(f"Adathalmaz: {args.dataset}")
    log(f"Forrás glob: {glob_pattern}")
    log(f"Kimenet: {out_dir}")

    con = duckdb.connect(database=":memory:")
    con.execute("PRAGMA threads=4")

    log("CSV-k beolvasása és tisztítása...")
    n = build_base_view(con, glob_pattern)
    log(f"Beolvasott tranzakciók: {n:,}")
    if n == 0:
        log("HIBA: 0 sor olvasható be. Ellenőrizd a forrásfájlokat.")
        return 1

    outputs = {
        "summary_stats.json": gen_summary(con, args.dataset),
        "top_authors_monthly.json": gen_top_authors_monthly(con),
        "quiz_data.json": gen_quiz(con),
        "heatmap_time.json": gen_heatmap_time(con),
        "heatmap_geo.json": gen_heatmap_geo(con),
    }

    for fname, payload in outputs.items():
        path = out_dir / fname
        with path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
        size_kb = path.stat().st_size / 1024
        log(f"  ✓ {fname}  ({size_kb:.1f} KB)")

    con.close()
    log("Kész. Minden JSON legenerálva.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
