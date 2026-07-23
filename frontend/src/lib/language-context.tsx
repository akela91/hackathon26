"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Lang, type Dictionary } from "./dictionaries";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  dict: Dictionary;
  /** Dot-path string lookup (pl. "stats.totalCheckouts"), {{var}} interpolációval. */
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "lw-lang";

function resolve(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      obj
    );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hu");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hu" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  const dict = dictionaries[lang];

  function t(path: string, vars?: Record<string, string | number>): string {
    const val = resolve(dict, path);
    let str = typeof val === "string" ? val : path;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      }
    }
    return str;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
