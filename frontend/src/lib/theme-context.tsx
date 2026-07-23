"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light" | "unicorn";

interface ThemeContextValue {
  theme: Theme;
  /** Dark ↔ Light váltás (unicornból is ide tér vissza). */
  toggleTheme: () => void;
  /** Bármely téma közvetlen beállítása (pl. unicorn a szivárvány gombhoz). */
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "lw-theme";

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark" || current === "unicorn") {
      setThemeState(current);
    }
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    apply(next);
  }

  function toggleTheme() {
    // Unicornból mindig a sötétbe lépünk vissza; egyébként dark↔light.
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
