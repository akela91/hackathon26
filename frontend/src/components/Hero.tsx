"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useLibrary } from "@/lib/library-context";

export default function Hero({ summary }: { summary: Summary }) {
  const { t, lang } = useLanguage();
  const { manifest, selectedYear, setSelectedYear } = useLibrary();
  const years = manifest?.years ?? [];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 text-center">
      {/* Év-választó: MIND + minden évszám külön; kattintásra frissül minden adat. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        role="radiogroup"
        aria-label={t("hero.yearSelectorLabel")}
        className="mb-6 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm backdrop-blur"
      >
        <Sparkles className="ml-2 mr-1 h-4 w-4 shrink-0 text-accent-3" />
        {[{ code: "ALL", label: t("hero.allYears") }, ...years.map((y) => ({ code: y, label: y }))].map(
          (opt) => {
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
          }
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <Image
          src="/logo.png"
          alt="Library Wrapped logó"
          width={140}
          height={140}
          priority
          className="mb-5 h-28 w-28 rounded-3xl shadow-lg sm:h-36 sm:w-36"
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
