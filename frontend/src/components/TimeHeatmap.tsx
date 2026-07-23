"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { HeatmapTime } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export default function TimeHeatmap({ data }: { data: HeatmapTime }) {
  // ApexCharts alulról felfelé rajzol; a hétfőt akarjuk felül -> megfordítjuk.
  const series = [...data.apex_series].reverse();

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      height: 380,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 500 },
    },
    theme: { mode: "dark" },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#07060f"] },
    colors: ["#8b5cf6"],
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.6,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#141228", name: "nincs" },
            {
              from: 1,
              to: Math.max(1, Math.round(data.max * 0.15)),
              color: "#312e81",
            },
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
            {
              from: Math.round(data.max * 0.7) + 1,
              to: data.max,
              color: "#f59e0b",
            },
          ],
        },
      },
    },
    xaxis: {
      type: "category",
      labels: {
        style: { colors: "#9b96c4", fontSize: "11px" },
        formatter: (v: string) => `${v}h`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#f4f2ff", fontSize: "13px" } } },
    tooltip: {
      theme: "dark",
      y: { formatter: (v: number) => `${formatNumber(v)} kölcsönzés` },
    },
    legend: { show: false },
  };

  return (
    <div className="glass p-5 sm:p-7">
      <ApexChart options={options} series={series} type="heatmap" height={380} />
    </div>
  );
}
