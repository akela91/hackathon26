"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Props {
  isbn?: string | null;
  title?: string | null;
  author?: string | null;
  className?: string;
}

/**
 * Könyvborító több forrásból, fallback lánccal:
 *   1) lokális cache (/covers/<isbn>.jpg) — a fetch_covers.py tölti fel;
 *   2) backend LIVE végpont (/api/cover?isbn=&title=&author=) — ha nincs lokálisan,
 *      a backend élőben lekéri (ISBN: moly→Google→OL; ha az sincs, cím/szerző
 *      alapján moly-keresés), MEGJELENÍTI és el is MENTI a covers mappába;
 *   3) elegáns gradiens placeholder, ha sehol nincs borító.
 * ISBN nélküli könyveknél (pl. Zseb-Garfield) egyből a 2) cím/szerző ág fut.
 */
export default function BookCover({ isbn, title, author, className = "" }: Props) {
  const clean = (isbn || "").replace(/[^0-9Xx]/g, "").toUpperCase();

  const sources = useMemo(() => {
    const q = new URLSearchParams();
    if (clean.length >= 10) q.set("isbn", clean);
    if (title) q.set("title", title);
    if (author) q.set("author", author);
    const list: string[] = [];
    if (clean.length >= 10) list.push(`/covers/${clean}.jpg`);
    if (clean.length >= 10 || title) list.push(`${API_URL}/api/cover?${q.toString()}`);
    return list;
  }, [clean, title, author]);

  // Melyik forrásnál tartunk; ha túlfut a listán → placeholder.
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  return (
    <div
      className={`relative aspect-[2/3] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-accent-1/25 to-accent-2/15 ${className}`}
      title={title || undefined}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={title ? `${title} borító` : "borító"}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-1">
          <BookOpen className="h-1/3 w-1/3 text-accent-1 opacity-70" />
        </div>
      )}
    </div>
  );
}
