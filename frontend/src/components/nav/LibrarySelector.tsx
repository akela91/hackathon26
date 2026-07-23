"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLibrary } from "@/lib/library-context";
import { useLanguage } from "@/lib/language-context";

/**
 * Egyszerre PONTOSAN EGY könyvtár vagy MINDEGYIK választható – sosem több.
 * Sok könyvtár (11+) esetén a gombsor vízszintesen görgethető: a szélekre
 * halványulás kerül, és ha van rejtett elem az adott irányban, megjelenik egy
 * chevron gomb, amivel odalapozhatunk. A kiválasztott elem automatikusan
 * láthatóvá görög.
 */
export default function LibrarySelector() {
  const { manifest, selectedLibrary, setSelectedLibrary } = useLibrary();
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, manifest]);

  // A kiválasztott gomb legörgetése a látható területre.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>('[aria-checked="true"]');
    active?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    updateArrows();
  }, [selectedLibrary, updateArrows]);

  if (!manifest || manifest.libraries.length <= 1) return null;

  const options = ["ALL", ...manifest.libraries];

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.6), behavior: "smooth" });
  }

  return (
    <div className="relative flex min-w-0 items-center">
      {/* Bal chevron */}
      {canLeft && (
        <button
          type="button"
          aria-label="◀"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[var(--card-solid)] text-muted shadow-md transition hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollerRef}
        role="radiogroup"
        aria-label={t("librarySelector.ariaLabel")}
        className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 no-scrollbar"
        style={{
          // Halványuló szélek csak ott, ahol van rejtett tartalom.
          maskImage: `linear-gradient(to right, ${canLeft ? "transparent" : "black"} 0, black 28px, black calc(100% - 28px), ${canRight ? "transparent" : "black"} 100%)`,
          WebkitMaskImage: `linear-gradient(to right, ${canLeft ? "transparent" : "black"} 0, black 28px, black calc(100% - 28px), ${canRight ? "transparent" : "black"} 100%)`,
        }}
      >
        {options.map((code) => {
          const active = code === selectedLibrary;
          return (
            <button
              key={code}
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedLibrary(code)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-accent-1 to-accent-2 text-white shadow-lg"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {code === "ALL" ? t("librarySelector.all") : code}
            </button>
          );
        })}
      </div>

      {/* Jobb chevron */}
      {canRight && (
        <button
          type="button"
          aria-label="▶"
          onClick={() => scrollBy(1)}
          className="absolute right-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[var(--card-solid)] text-muted shadow-md transition hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
