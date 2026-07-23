"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

interface Props {
  isbn?: string | null;
  title?: string | null;
  /** Tailwind méret/kiegészítő osztályok a burkolóra (aspect-arány 2:3 alapból). */
  className?: string;
  size?: "S" | "M" | "L";
}

/**
 * Könyvborító az ingyenes Open Library Covers API-ból, ISBN alapján.
 * A `?default=false` miatt hiányzó borító esetén 404 jön → onError → elegáns
 * gradiens placeholder (könyv ikon) jelenik meg helyette. Külső kép, ezért
 * sima <img> (nem next/image), lazy betöltéssel.
 */
export default function BookCover({ isbn, title, className = "", size = "M" }: Props) {
  const [errored, setErrored] = useState(false);
  const clean = (isbn || "").replace(/[^0-9Xx]/g, "");
  const showImg = clean.length >= 10 && !errored;

  return (
    <div
      className={`relative aspect-[2/3] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-accent-1/25 to-accent-2/15 ${className}`}
      title={title || undefined}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://covers.openlibrary.org/b/isbn/${clean}-${size}.jpg?default=false`}
          alt={title ? `${title} borító` : "borító"}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-1 text-center">
          <BookOpen className="h-1/3 w-1/3 text-accent-1 opacity-70" />
        </div>
      )}
    </div>
  );
}
