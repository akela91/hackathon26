"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { EtoAgeHeatmap as EtoAgeData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { useLibrary } from "@/lib/library-context";
import { getChartPalette } from "@/lib/chart-theme";
import { formatNumber } from "@/lib/format";

const AGE_MIN = 0;
const AGE_MAX = 100;

export default function EtoAgeHeatmap({ data }: { data: EtoAgeData }) {
  const { t, lang, dict } = useLanguage();
  const { theme } = useTheme();
  const { selectedLibrary, selectedYear } = useLibrary();
  const palette = getChartPalette(theme);
  const chartKey = `${theme}-${selectedLibrary}-${selectedYear}`;

  // Egyetlen életkor 0–100 között. A bucket-méret (5 év) alapján képezzük le
  // a mátrix sorára.
  const [age, setAge] = useState(30);
  const bucketSize = data.bucket_size || 5;
  const lastBucket = data.age_buckets.length - 1;
  const bucketIdx = Math.min(Math.floor(age / bucketSize), lastBucket);

  const classLabels = data.eto_classes.map((c) => dict.etoClassShort[c] ?? c);

  // Teljes mátrix a heatmaphez (áttekintés), a hétfő-analógiára megfordítva,
  // hogy a legfiatalabb korosztály legyen felül.
  const series = data.age_buckets
    .map((label, i) => ({
      name: label,
      data: classLabels.map((clabel, j) => ({ x: clabel, y: data.matrix[i][j] })),
    }))
    .reverse();

  // A kiválasztott életkorhoz tartozó bucket bontása az oldalpanelhez.
  const rowTotals = data.matrix[bucketIdx] ?? [];
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);
  const ranked = data.eto_classes
    .map((code, i) => ({
      code,
      label: dict.etoClassShort[code] ?? code,
      value: rowTotals[i] ?? 0,
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      height: 420,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 400 },
    },
    theme: { mode: palette.mode },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: [palette.stroke] },
    colors: [palette.primary],
    plotOptions: {
      heatmap: {
        radius: 4,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: palette.cellEmpty, name: "0" },
            { from: 1, to: Math.max(1, Math.round(data.max * 0.15)), color: palette.heatmap[1] },
            { from: Math.round(data.max * 0.15) + 1, to: Math.round(data.max * 0.4), color: palette.heatmap[3] },
            { from: Math.round(data.max * 0.4) + 1, to: Math.round(data.max * 0.7), color: palette.heatmap[5] },
            { from: Math.round(data.max * 0.7) + 1, to: data.max, color: palette.heatmap[6] },
          ],
        },
      },
    },
    xaxis: {
      labels: {
        style: { colors: palette.textMuted, fontSize: "11px" },
        rotate: -35,
        trim: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: palette.textStrong, fontSize: "12px" } } },
    tooltip: {
      theme: palette.mode,
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("stats.checkoutsSuffix")}` },
    },
    legend: { show: false },
  };

  const fillPct = ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">
      {/* A heatmap a bal oldalon mindkét sort kitölti fölfelé, mióta a
          korválasztó már nem külön, teljes szélességű sor, hanem a jobb
          oldali panel fölé került. */}
      <div className="glass flex flex-col p-5 sm:p-7 lg:col-span-2 lg:row-span-2">
        <ApexChart key={chartKey} options={options} series={series} type="heatmap" height={480} />
      </div>

      <div className="glass p-5 sm:p-7">
        <div className="mb-4 flex items-end justify-between">
          <span className="text-sm text-muted">{t("etoAge.selectedAgeLabel")}</span>
          <span className="text-2xl font-black gradient-text-cool">
            {age} {t("etoAge.yearsSuffix")}
            <span className="ml-2 align-middle text-sm font-medium text-muted">
              ({data.age_buckets[bucketIdx]})
            </span>
          </span>
        </div>
        <input
          type="range"
          className="age-slider"
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          value={age}
          aria-label={t("etoAge.ageRangeLabel")}
          onChange={(e) => setAge(Number(e.target.value))}
          style={{
            background: `linear-gradient(90deg, var(--accent-1) 0%, var(--accent-2) ${fillPct}%, var(--card-border) ${fillPct}%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="glass p-5 sm:p-7">
        <h3 className="mb-1 text-lg font-bold">{t("etoAge.selectionTitle")}</h3>
        <p className="mb-4 text-sm text-muted">
          {formatNumber(grandTotal, lang)} {t("etoAge.checkoutsInRange")}
        </p>
        {ranked.length === 0 ? (
          <p className="text-sm text-muted">{t("etoAge.selectionEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {ranked.slice(0, 7).map((r) => {
              const pct = grandTotal ? (r.value / grandTotal) * 100 : 0;
              return (
                <li key={r.code}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{r.label}</span>
                    <span className="text-muted">{pct.toFixed(1)}%</span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ background: "var(--card-border)" }}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
