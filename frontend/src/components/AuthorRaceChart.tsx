"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { Play, Pause, RotateCcw } from "lucide-react";
import ApexChart from "./charts/ApexChart";
import type { AuthorsMonthly } from "@/lib/types";
import { formatMonth, formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";

export default function AuthorRaceChart({ data }: { data: AuthorsMonthly }) {
  const { t, lang, dict } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);
  const PALETTE = palette.categorical;
  const { months, authors } = data;
  const [idx, setIdx] = useState(months.length - 1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Kumulált értékek az aktuális hónapig, csökkenő sorrendben.
  const { categories, values, colors } = useMemo(() => {
    const cum = authors.map((a) => ({
      author: a.author,
      value: a.data.slice(0, idx + 1).reduce((s, v) => s + v, 0),
    }));
    cum.sort((x, y) => x.value - y.value); // ApexCharts alulról épít, ezért növekvő
    return {
      categories: cum.map((c) => c.author),
      values: cum.map((c) => c.value),
      colors: cum.map((_, i) => PALETTE[(cum.length - 1 - i) % PALETTE.length]),
    };
  }, [authors, idx, PALETTE]);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIdx((prev) => {
        if (prev >= months.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, months.length]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 460,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 650,
        animateGradually: { enabled: false },
        dynamicAnimation: { enabled: true, speed: 650 },
      },
    },
    theme: { mode: palette.mode },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "72%",
        distributed: true,
        dataLabels: { position: "center" },
      },
    },
    colors,
    dataLabels: {
      enabled: true,
      formatter: (v: number) => formatNumber(v, lang),
      style: { fontSize: "12px", fontWeight: 700, colors: ["#fff"] },
    },
    legend: { show: false },
    grid: { borderColor: palette.gridBorder, xaxis: { lines: { show: true } } },
    xaxis: {
      categories,
      labels: {
        style: { colors: palette.textMuted },
        formatter: (v: string) => formatNumber(Number(v), lang),
      },
    },
    yaxis: { labels: { style: { colors: palette.textStrong, fontSize: "13px" } } },
    tooltip: {
      theme: palette.mode,
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("authorRace.checkoutsSuffix")}` },
    },
  };

  const series = [{ name: t("authorRace.checkoutsSuffix"), data: values }];

  return (
    <div className="glass p-5 sm:p-7">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm uppercase tracking-widest text-muted">
            {t("authorRace.cumulativeUntil")}
          </div>
          <div className="text-2xl font-black gradient-text-cool">
            {formatMonth(months[idx], dict.monthsShort, lang)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (idx >= months.length - 1) setIdx(0);
              setPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? t("authorRace.pause") : t("authorRace.play")}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setIdx(months.length - 1);
            }}
            title={t("authorRace.resetTitle")}
            className="inline-flex rounded-full border border-white/10 bg-white/5 p-2.5 text-muted transition hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={months.length - 1}
        value={idx}
        onChange={(e) => {
          setPlaying(false);
          setIdx(Number(e.target.value));
        }}
        className="mb-4 w-full accent-fuchsia-500"
      />

      <ApexChart options={options} series={series} type="bar" height={460} />
    </div>
  );
}
