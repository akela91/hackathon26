"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { Lang } from "@/lib/dictionaries";
import ImageFlash from "@/components/easter-egg/ImageFlash";
import BydBounce from "@/components/easter-egg/BydBounce";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [bydTrigger, setBydTrigger] = useState(0);

  function pick(code: Lang) {
    setLang(code);
    // Kínai választásakor 5 másodpercre felvillan a BYD kép.
    if (code === "zh") setBydTrigger((n) => n + 1);
  }

  return (
    <>
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
              onClick={() => pick(opt.code)}
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
      <ImageFlash src="/byd.jpg" trigger={bydTrigger} durationMs={5000} alt="BYD" variant="zoom-right" />
      {/* A BYD ikon addig pattog, amíg a nyelv kínai. */}
      <BydBounce active={lang === "zh"} />
    </>
  );
}
