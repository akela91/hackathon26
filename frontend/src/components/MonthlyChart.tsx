"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { Summary } from "@/lib/types";
import { formatMonth, formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";

export default function MonthlyChart({ summary }: { summary: Summary }) {
  const { t, lang, dict } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  const data = summary.monthly_checkouts;
  const categories = data.map((d) => d.month);
  const fmtMonth = (v: string) => formatMonth(v, dict.monthsShort, lang);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 340,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 900 },
    },
    theme: { mode: palette.mode },
    colors: ["#8b5cf6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.02,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: "#ec4899", opacity: 0.5 },
          { offset: 100, color: "#8b5cf6", opacity: 0 },
        ],
      },
    },
    grid: { borderColor: palette.gridBorder, strokeDashArray: 4 },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: { colors: palette.textMuted, fontSize: "11px" },
        formatter: (v: string) => (v ? fmtMonth(v) : v),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 12,
    },
    yaxis: {
      labels: {
        style: { colors: palette.textMuted },
        formatter: (v: number) => formatNumber(v, lang),
      },
    },
    tooltip: {
      theme: palette.mode,
      x: { formatter: (val) => (val ? fmtMonth(String(val)) : "") },
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("stats.checkoutsSuffix")}` },
    },
    markers: { size: 0, hover: { size: 6 } },
  };

  const series = [{ name: t("stats.checkoutsSuffix"), data: data.map((d) => d.checkouts) }];

  return (
    <div className="glass p-5 sm:p-7">
      <ApexChart options={options} series={series} type="area" height={340} />
    </div>
  );
}
