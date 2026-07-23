"use client";

import { useLibrary } from "@/lib/library-context";
import { useLanguage } from "@/lib/language-context";

/**
 * Egyszerre PONTOSAN EGY könyvtár vagy MINDEGYIK választható – sosem több.
 * A gombsor (radio-szerű, egyszerre csak egy aktív) strukturálisan kizárja,
 * hogy 2-3 könyvtár egyszerre legyen kijelölve.
 */
export default function LibrarySelector() {
  const { manifest, selectedLibrary, setSelectedLibrary } = useLibrary();
  const { t } = useLanguage();

  if (!manifest || manifest.libraries.length <= 1) return null;

  const options = ["ALL", ...manifest.libraries];

  return (
    <div
      role="radiogroup"
      aria-label={t("librarySelector.ariaLabel")}
      className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 no-scrollbar"
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
  );
}
