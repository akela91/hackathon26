"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";

interface Props {
  isbn?: string | null;
  title?: string | null;
  className?: string;
  size?: "S" | "M" | "L";
}

/**
 * Könyvborító több forrásból, fallback lánccal:
 *   1) lokális cache (/covers/<isbn>.jpg) — a pipeline/fetch_covers.py tölti fel,
 *      így render-időben nincs külső hívás/rate limit;
 *   2) Open Library élő API (ISBN alapján), ha nincs lokális;
 *   3) elegáns gradiens placeholder (könyv ikon), ha egyik forrás sem ad képet.
 */
export default function BookCover({ isbn, title, className = "", size = "M" }: Props) {
  const clean = (isbn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  const sources = useMemo(() => {
    if (clean.length < 10) return [] as string[];
    return [
      `/covers/${clean}.jpg`,
      `https://covers.openlibrary.org/b/isbn/${clean}-${size}.jpg?default=false`,
    ];
  }, [clean, size]);

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
