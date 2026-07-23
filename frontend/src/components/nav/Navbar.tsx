"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import LibrarySelector from "./LibrarySelector";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-8">
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
            <span className="text-sm font-black">Library Wrapped</span>
            <span className="text-[11px] text-muted">{t("nav.tagline")}</span>
          </span>
        </a>

        <div className="flex flex-1 justify-center overflow-hidden">
          <LibrarySelector />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
