"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  Coins,
  Users,
  RefreshCw,
  CalendarClock,
  Clock,
} from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber, formatHUF, formatMonth } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import AnimatedCounter from "./ui/AnimatedCounter";

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: number;
  format: (n: number) => string;
  hint?: string;
  accent: string;
}

export default function StatsGrid({ summary }: { summary: Summary }) {
  const { t, lang, dict } = useLanguage();
  const { most_active_period: p } = summary;

  const stats: Stat[] = [
    {
      icon: <BookMarked className="h-6 w-6" />,
      label: t("stats.totalCheckouts"),
      value: summary.total_checkouts,
      format: (n) => formatNumber(n, lang),
      accent: "from-violet-500/20 to-transparent",
    },
    {
      icon: <Coins className="h-6 w-6" />,
      label: t("stats.totalValue"),
      value: summary.total_value_huf,
      format: (n) => formatHUF(n, lang),
      hint: t("stats.totalValueHint"),
      accent: "from-amber-500/20 to-transparent",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: t("stats.activePatrons"),
      value: summary.unique_patrons,
      format: (n) => formatNumber(n, lang),
      accent: "from-pink-500/20 to-transparent",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      label: t("stats.totalRenewals"),
      value: summary.total_renewals,
      format: (n) => formatNumber(n, lang),
      hint: t("stats.avgRenewalsHint", { avg: summary.avg_renewals }),
      accent: "from-cyan-500/20 to-transparent",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`glass glass-hover relative overflow-hidden p-6`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent}`}
            />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 text-accent-1">
                {s.icon}
              </div>
              <div className="text-3xl font-black">
                <AnimatedCounter value={s.value} format={s.format} />
              </div>
              <div className="mt-1 text-sm font-medium text-foreground/90">
                {s.label}
              </div>
              {s.hint && (
                <div className="mt-1 text-xs text-muted">{s.hint}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legaktívabb időszak highlight-ok */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {p.busiest_month && (
          <HighlightCard
            icon={<CalendarClock className="h-5 w-5" />}
            title={t("stats.busiestMonth")}
            main={formatMonth(p.busiest_month.month, dict.monthsShort, lang)}
            sub={`${formatNumber(p.busiest_month.checkouts, lang)} ${t("stats.checkoutsSuffix")}`}
          />
        )}
        {p.busiest_weekday && (
          <HighlightCard
            icon={<CalendarClock className="h-5 w-5" />}
            title={t("stats.busiestWeekday")}
            main={dict.weekdays[p.busiest_weekday.weekday] ?? p.busiest_weekday.label}
            sub={`${formatNumber(p.busiest_weekday.checkouts, lang)} ${t("stats.checkoutsSuffix")}`}
          />
        )}
        {p.busiest_hour && (
          <HighlightCard
            icon={<Clock className="h-5 w-5" />}
            title={t("stats.busiestHour")}
            main={`${p.busiest_hour.hour}:00`}
            sub={`${formatNumber(p.busiest_hour.checkouts, lang)} ${t("stats.checkoutsSuffix")}`}
          />
        )}
      </div>
    </div>
  );
}

function HighlightCard({
  icon,
  title,
  main,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  main: string;
  sub: string;
}) {
  return (
    <div className="glass flex items-center gap-4 p-5">
      <div className="inline-flex rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 p-3 text-white">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted">
          {title}
        </div>
        <div className="text-xl font-bold">{main}</div>
        <div className="text-sm text-muted">{sub}</div>
      </div>
    </div>
  );
}
