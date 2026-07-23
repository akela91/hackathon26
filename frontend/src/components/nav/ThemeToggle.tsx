"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? t("nav.themeToLight") : t("nav.themeToDark")}
      title={isDark ? t("nav.themeToLight") : t("nav.themeToDark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
