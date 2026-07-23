"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

export default function Hero({ summary }: { summary: Summary }) {
  const { t, lang } = useLanguage();

  return (
    <section className="relative flex min-h-[calc(100vh-9.5rem)] flex-col items-center justify-center px-5 text-center sm:min-h-[calc(100vh-7.5rem)]">
      {/* A kiválasztott évet a fejléc sticky második sora mutatja
          (nav/YearSelector.tsx) — itt duplikálva már nem jelenítjük meg. */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <Image
          src="/logo.png"
          alt="Library Wrapped logó"
          width={196}
          height={196}
          priority
          className="mb-5 h-[152px] w-[152px] rounded-3xl shadow-lg sm:h-[196px] sm:w-[196px]"
        />
        <h1 className="text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl">
          <span className="gradient-text">{t("hero.titleLine1")}</span>
          <br />
          <span className="text-foreground">{t("hero.titleLine2")}</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl text-muted">{t("hero.subtitle")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 grid grid-cols-3 gap-6 sm:gap-12"
      >
        {[
          { label: t("hero.statCheckouts"), value: summary.total_checkouts },
          { label: t("hero.statPatrons"), value: summary.unique_patrons },
          { label: t("hero.statTitles"), value: summary.unique_titles },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-black text-foreground sm:text-4xl">
              {formatNumber(s.value, lang)}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        }}
        className="absolute bottom-10 flex flex-col items-center text-muted hover:text-foreground"
      >
        <span className="text-sm">{t("hero.scrollHint")}</span>
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
