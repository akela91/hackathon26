"use client";

import type { ApexOptions } from "apexcharts";
import { MapPin } from "lucide-react";
import ApexChart from "./charts/ApexChart";
import type { HeatmapGeo } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";

export default function GeoSection({ data }: { data: HeatmapGeo }) {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  const topCities = data.by_city.slice(0, 12).reverse();

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 420,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 800 },
    },
    theme: { mode: palette.mode },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 6, barHeight: "70%", distributed: true },
    },
    colors: palette.categorical,
    dataLabels: {
      enabled: true,
      formatter: (v: number) => formatNumber(v, lang),
      style: { fontSize: "11px", fontWeight: 600, colors: ["#fff"] },
    },
    legend: { show: false },
    grid: { borderColor: palette.gridBorder },
    xaxis: {
      categories: topCities.map((c) => c.city),
      labels: {
        style: { colors: palette.textMuted },
        formatter: (v: string) => formatNumber(Number(v), lang),
      },
    },
    yaxis: { labels: { style: { colors: palette.textStrong, fontSize: "12px" } } },
    tooltip: {
      theme: palette.mode,
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("stats.checkoutsSuffix")}` },
    },
  };

  const series = [{ name: t("stats.checkoutsSuffix"), data: topCities.map((c) => c.checkouts) }];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="glass p-5 sm:p-7 lg:col-span-2">
        <h3 className="mb-3 text-lg font-bold">{t("geo.topCitiesTitle")}</h3>
        <ApexChart key={theme} options={options} series={series} type="bar" height={420} />
      </div>

      <div className="glass p-5 sm:p-7">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <MapPin className="h-5 w-5 text-accent-2" /> {t("geo.topZipsTitle")}
        </h3>
        <ul className="space-y-2">
          {data.by_zip.slice(0, 12).map((z, i) => {
            const max = data.by_zip[0]?.checkouts || 1;
            const pct = (z.checkouts / max) * 100;
            return (
              <li key={`${z.zip}-${i}`} className="relative">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-accent-1/30 to-accent-2/10"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                  <span className="font-mono font-semibold">{z.zip}</span>
                  <span className="text-muted">{z.city}</span>
                  <span className="font-bold">{formatNumber(z.checkouts, lang)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
