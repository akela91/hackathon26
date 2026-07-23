"use client";

import { Sparkles } from "lucide-react";
import { useLibrary } from "@/lib/library-context";
import { useLanguage } from "@/lib/language-context";

/**
 * Év-választó: MIND + minden évszám külön; kattintásra frissül minden adat.
 * A Navbar második (sticky) sorában él, hogy görgetés után is elérhető legyen.
 */
export default function YearSelector() {
  const { manifest, selectedYear, setSelectedYear } = useLibrary();
  const { t } = useLanguage();
  const years = manifest?.years ?? [];

  if (years.length === 0) return null;

  const options = [{ code: "ALL", label: t("hero.allYears") }, ...years.map((y) => ({ code: y, label: y }))];

  return (
    <div
      role="radiogroup"
      aria-label={t("hero.yearSelectorLabel")}
      className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm"
    >
      <Sparkles className="ml-2 mr-1 h-4 w-4 shrink-0 text-accent-3" />
      {options.map((opt) => {
        const active = opt.code === selectedYear;
        return (
          <button
            key={opt.code}
            role="radio"
            aria-checked={active}
            onClick={() => setSelectedYear(opt.code)}
            className={`rounded-full px-3 py-1 font-semibold transition ${
              active
                ? "bg-gradient-to-r from-accent-1 to-accent-2 text-white shadow"
                : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
