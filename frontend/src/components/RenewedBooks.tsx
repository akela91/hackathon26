"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

export default function RenewedBooks({ summary }: { summary: Summary }) {
  const { t, lang } = useLanguage();
  const books = summary.top_renewed_books.slice(0, 10);
  const max = books[0]?.total_renewals || 1;

  return (
    <div className="glass p-5 sm:p-7">
      <p className="mb-6 text-muted">{t("renewed.intro")}</p>
      <ol className="space-y-3">
        {books.map((b, i) => {
          const pct = (b.total_renewals / max) * 100;
          return (
            <motion.li
              key={`${b.title}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-xl border border-white/5"
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-1/25 to-accent-2/5"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center gap-4 px-4 py-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    i < 3
                      ? "bg-gradient-to-br from-accent-3 to-accent-2 text-white"
                      : "bg-white/10 text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold" title={b.title}>
                    {b.title}
                  </div>
                  {b.author && (
                    <div className="truncate text-sm text-muted">{b.author}</div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-right">
                  <RefreshCw className="h-4 w-4 text-accent-3" />
                  <span className="font-bold">
                    {formatNumber(b.total_renewals, lang)}
                  </span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
