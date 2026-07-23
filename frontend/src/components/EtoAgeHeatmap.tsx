"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { EtoAgeHeatmap as EtoAgeData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";
import { formatNumber } from "@/lib/format";

export default function EtoAgeHeatmap({ data }: { data: EtoAgeData }) {
  const { t, dict } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  const lastIdx = data.age_buckets.length - 1;
  const [minIdx, setMinIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(lastIdx);

  const selectedRows = useMemo(
    () => data.matrix.slice(minIdx, maxIdx + 1),
    [data.matrix, minIdx, maxIdx]
  );
  const visibleBuckets = data.age_buckets.slice(minIdx, maxIdx + 1);

  const classTotals = useMemo(() => {
    const totals = new Array(data.eto_classes.length).fill(0);
    for (const row of selectedRows) {
      row.forEach((v, i) => {
        totals[i] += v;
      });
    }
    return totals;
  }, [selectedRows, data.eto_classes.length]);

  const grandTotal = classTotals.reduce((a, b) => a + b, 0);

  const ranked = data.eto_classes
    .map((code, i) => ({
      code,
      label: dict.etoClassShort[code] ?? code,
      value: classTotals[i],
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const classLabels = data.eto_classes.map((c) => dict.etoClassShort[c] ?? c);

  const series = visibleBuckets
    .map((label, i) => ({
      name: label,
      data: classLabels.map((clabel, j) => ({ x: clabel, y: selectedRows[i][j] })),
    }))
    .reverse();

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
    stroke: { width: 2, colors: [palette.mode === "dark" ? "#07060f" : "#f6f5fb"] },
    colors: ["#8b5cf6"],
    plotOptions: {
      heatmap: {
        radius: 4,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: palette.cellEmpty, name: "0" },
            { from: 1, to: Math.max(1, Math.round(data.max * 0.15)), color: "#312e81" },
            {
              from: Math.round(data.max * 0.15) + 1,
              to: Math.round(data.max * 0.4),
              color: "#6d28d9",
            },
            {
              from: Math.round(data.max * 0.4) + 1,
              to: Math.round(data.max * 0.7),
              color: "#c026d3",
            },
            { from: Math.round(data.max * 0.7) + 1, to: data.max, color: "#f59e0b" },
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
      y: { formatter: (v: number) => `${formatNumber(v)} ${t("stats.checkoutsSuffix")}` },
    },
    legend: { show: false },
  };

  function handleMinChange(v: number) {
    setMinIdx(Math.min(v, maxIdx));
  }
  function handleMaxChange(v: number) {
    setMaxIdx(Math.max(v, minIdx));
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 sm:p-7">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted">{t("etoAge.ageRangeLabel")}</span>
          <span className="font-bold gradient-text-cool">
            {data.age_buckets[minIdx]} — {data.age_buckets[maxIdx]} {t("etoAge.yearsSuffix")}
          </span>
        </div>
        <div className="range-slider">
          <div className="range-track" />
          <div
            className="range-track-fill"
            style={{
              left: `${(minIdx / lastIdx) * 100}%`,
              width: `${((maxIdx - minIdx) / lastIdx) * 100}%`,
            }}
          />
          <input
            type="range"
            min={0}
            max={lastIdx}
            value={minIdx}
            aria-label="min age"
            onChange={(e) => handleMinChange(Number(e.target.value))}
          />
          <input
            type="range"
            min={0}
            max={lastIdx}
            value={maxIdx}
            aria-label="max age"
            onChange={(e) => handleMaxChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass p-5 sm:p-7 lg:col-span-2">
          <ApexChart options={options} series={series} type="heatmap" height={420} />
        </div>

        <div className="glass p-5 sm:p-7">
          <h3 className="mb-1 text-lg font-bold">{t("etoAge.selectionTitle")}</h3>
          <p className="mb-4 text-sm text-muted">
            {formatNumber(grandTotal)} {t("etoAge.checkoutsInRange")}
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
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
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
    </div>
  );
}
