"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Props {
  isbn?: string | null;
  title?: string | null;
  className?: string;
  size?: "S" | "M" | "L";
}

/**
 * Könyvborító több forrásból, fallback lánccal:
 *   1) lokális cache (/covers/<isbn>.jpg) — a pipeline/fetch_covers.py tölti fel,
 *      render-időben nincs külső hívás/rate limit;
 *   2) backend LIVE végpont (/api/cover/<isbn>) — ha nincs lokálisan, a backend
 *      élőben lekéri (moly.hu → Google → OL), MEGJELENÍTI és el is MENTI a covers
 *      mappába, így legközelebb már az 1) statikus útról jön;
 *   3) elegáns gradiens placeholder (könyv ikon), ha sehol nincs borító.
 */
export default function BookCover({ isbn, title, className = "" }: Props) {
  const clean = (isbn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  const sources = useMemo(() => {
    if (clean.length < 10) return [] as string[];
    return [`/covers/${clean}.jpg`, `${API_URL}/api/cover/${clean}`];
  }, [clean]);

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
