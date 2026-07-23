"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import LibrarySelector from "./LibrarySelector";
import YearSelector from "./YearSelector";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import RainbowButton from "./RainbowButton";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-[86rem] items-center gap-3 px-4 py-2.5 sm:px-8">
        <a href="#" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Library Wrapped logó"
            width={36}
            height={36}
            className="rounded-xl"
            priority
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span
              className="text-base font-normal tracking-tight"
              style={{ fontFamily: "var(--font-logo), var(--font-sans), sans-serif" }}
            >
              Library Wrapped
            </span>
            <span className="text-[11px] text-muted">{t("nav.tagline")}</span>
          </span>
        </a>

        <div className="flex flex-1 justify-center overflow-hidden">
          <LibrarySelector />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <RainbowButton />
        </div>
      </div>

      {/* Második, sticky sor: évválasztó — a header aljához rögzítve, szűk
          réssel elválasztva, görgetés után is végig elérhető marad. */}
      <div className="border-t border-white/5 px-4 py-1 sm:px-8">
        <div className="mx-auto flex max-w-[86rem] justify-center">
          <YearSelector />
        </div>
      </div>
    </header>
  );
}
