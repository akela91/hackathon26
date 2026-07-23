"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";

const LANG_HU: Record<string, string> = {
  hun: "magyar",
  ger: "német",
  eng: "angol",
  fre: "francia",
  lat: "latin",
  rus: "orosz",
  ita: "olasz",
  spa: "spanyol",
  mul: "többnyelvű",
};

export default function DistributionCharts({ summary }: { summary: Summary }) {
  const docs = summary.by_doc_type.filter((d) => d.checkouts > 0);
  const donut: ApexOptions = {
    chart: {
      type: "donut",
      height: 320,
      background: "transparent",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 700 },
    },
    theme: { mode: "dark" },
    labels: docs.map((d) => d.label || d.code || "?"),
    colors: ["#8b5cf6", "#ec4899", "#f59e0b", "#22d3ee", "#34d399", "#f472b6", "#a78bfa", "#fbbf24"],
    stroke: { width: 2, colors: ["#07060f"] },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { fontSize: "12px", fontWeight: 700 },
    },
    legend: { position: "bottom", labels: { colors: "#9b96c4" } },
    plotOptions: {
      pie: {
        donut: {
          size: "62%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Dokumentum",
              color: "#9b96c4",
              formatter: () =>
                formatNumber(docs.reduce((s, d) => s + d.checkouts, 0)),
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (v: number) => `${formatNumber(v)} kölcsönzés` },
    },
  };

  const langs = summary.by_language;
  const langMax = langs[0]?.checkouts || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="glass p-5 sm:p-7">
        <h3 className="mb-3 text-lg font-bold">Dokumentumtípusok</h3>
        <ApexChart
          options={donut}
          series={docs.map((d) => d.checkouts)}
          type="donut"
          height={320}
        />
      </div>

      <div className="glass p-5 sm:p-7">
        <h3 className="mb-5 text-lg font-bold">Nyelvek</h3>
        <ul className="space-y-3">
          {langs.map((l) => {
            const code = l.language || "?";
            const pct = (l.checkouts / langMax) * 100;
            return (
              <li key={code}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {LANG_HU[code] || code}
                  </span>
                  <span className="text-muted">{formatNumber(l.checkouts)}</span>
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
