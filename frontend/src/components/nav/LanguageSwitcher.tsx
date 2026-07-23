"use client";

import { useLanguage } from "@/lib/language-context";
import type { Lang } from "@/lib/dictionaries";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label={t("nav.languageLabel")}
      className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = opt.code === lang;
        return (
          <button
            key={opt.code}
            role="radio"
            aria-checked={active}
            onClick={() => setLang(opt.code)}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
              active
                ? "bg-gradient-to-r from-accent-1 to-accent-2 text-white"
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
