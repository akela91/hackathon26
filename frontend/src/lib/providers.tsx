"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-context";
import { LanguageProvider } from "./language-context";
import { LibraryProvider } from "./library-context";
import UnicornCursor from "@/components/easter-egg/UnicornCursor";

/** Az összes app-szintű kontextust egybefogó wrapper a layout.tsx-hez. */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LibraryProvider>
          {children}
          <UnicornCursor />
        </LibraryProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
