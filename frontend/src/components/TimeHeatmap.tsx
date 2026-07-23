"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { HeatmapTime } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";

export default function TimeHeatmap({ data }: { data: HeatmapTime }) {
  const { t, lang, dict } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  // Saját fordított sorozat építése (a hétfőt akarjuk felül -> megfordítjuk).
  const series = data.weekdays
    .map((_, wd) => ({
      name: dict.weekdays[wd] ?? data.weekdays[wd],
      data: data.hours.map((h) => ({ x: `${String(h).padStart(2, "0")}`, y: data.matrix[wd][h] })),
    }))
    .reverse();

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      height: 380,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 500 },
    },
    theme: { mode: palette.mode },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: [palette.mode === "dark" ? "#07060f" : "#f6f5fb"] },
    colors: [palette.primary],
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.6,
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
      type: "category",
      labels: {
        style: { colors: palette.textMuted, fontSize: "11px" },
        formatter: (v: string) => `${v}h`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: palette.textStrong, fontSize: "13px" } } },
    tooltip: {
      theme: palette.mode,
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("stats.checkoutsSuffix")}` },
    },
    legend: { show: false },
  };

  return (
    <div className="glass p-5 sm:p-7">
      <ApexChart key={theme} options={options} series={series} type="heatmap" height={380} />
    </div>
  );
}
