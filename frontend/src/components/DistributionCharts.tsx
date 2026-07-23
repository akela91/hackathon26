"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { getChartPalette } from "@/lib/chart-theme";

export default function DistributionCharts({ summary }: { summary: Summary }) {
  const { t, lang, dict } = useLanguage();
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  const docs = summary.by_doc_type.filter((d) => d.checkouts > 0);
  const docLabel = (code?: string, fallback?: string) =>
    (code && dict.docTypes[code]) || fallback || code || "?";

  const donut: ApexOptions = {
    chart: {
      type: "donut",
      height: 320,
      background: "transparent",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 700 },
    },
    theme: { mode: palette.mode },
    labels: docs.map((d) => docLabel(d.code, d.label)),
    colors: palette.categorical,
    stroke: { width: 2, colors: [palette.mode === "dark" ? "#07060f" : "#f6f5fb"] },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { fontSize: "12px", fontWeight: 700 },
    },
    legend: { position: "bottom", labels: { colors: palette.textMuted } },
    plotOptions: {
      pie: {
        donut: {
          size: "62%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("distribution.totalLabel"),
              color: palette.textMuted,
              formatter: () =>
                formatNumber(docs.reduce((s, d) => s + d.checkouts, 0), lang),
            },
          },
        },
      },
    },
    tooltip: {
      theme: palette.mode,
      y: { formatter: (v: number) => `${formatNumber(v, lang)} ${t("stats.checkoutsSuffix")}` },
    },
  };

  const langs = summary.by_language;
  const langMax = langs[0]?.checkouts || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="glass p-5 sm:p-7">
        <h3 className="mb-3 text-lg font-bold">{t("distribution.docTypesTitle")}</h3>
        <ApexChart
          options={donut}
          series={docs.map((d) => d.checkouts)}
          type="donut"
          height={320}
        />
      </div>

      <div className="glass p-5 sm:p-7">
        <h3 className="mb-5 text-lg font-bold">{t("distribution.languagesTitle")}</h3>
        <ul className="space-y-3">
          {langs.map((l) => {
            const code = l.language || "?";
            const pct = (l.checkouts / langMax) * 100;
            return (
              <li key={code}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{dict.languages[code] || code}</span>
                  <span className="text-muted">{formatNumber(l.checkouts, lang)}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
