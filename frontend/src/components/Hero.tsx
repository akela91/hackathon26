"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export default function Hero({ summary }: { summary: Summary }) {
  const years = summary.by_year.map((y) => y.year).join(" – ");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted backdrop-blur"
      >
        <Sparkles className="h-4 w-4 text-accent-3" />
        {summary.libraries.join(" • ")} · {years}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <BookOpen className="mb-4 h-16 w-16 text-accent-1" />
        <h1 className="text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl">
          <span className="gradient-text">Library</span>
          <br />
          <span className="text-foreground">Wrapped</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl text-muted">
          Az évünk könyvekben. Nézd meg, mit olvasott a közösség — statisztikák,
          animált chartok és egy játékos kvíz.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 grid grid-cols-3 gap-6 sm:gap-12"
      >
        {[
          { label: "kölcsönzés", value: summary.total_checkouts },
          { label: "olvasó", value: summary.unique_patrons },
          { label: "egyedi cím", value: summary.unique_titles },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-black text-foreground sm:text-4xl">
              {formatNumber(s.value)}
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
        <span className="text-sm">Görgess</span>
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
