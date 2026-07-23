"use client";

import type { ApexOptions } from "apexcharts";
import ApexChart from "./charts/ApexChart";
import type { Summary } from "@/lib/types";
import { formatMonth, formatNumber } from "@/lib/format";

export default function MonthlyChart({ summary }: { summary: Summary }) {
  const data = summary.monthly_checkouts;
  const categories = data.map((d) => d.month);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 340,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 900 },
    },
    theme: { mode: "dark" },
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
    grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 4 },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: { colors: "#9b96c4", fontSize: "11px" },
        formatter: (v: string) => (v ? formatMonth(v) : v),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 12,
    },
    yaxis: {
      labels: {
        style: { colors: "#9b96c4" },
        formatter: (v: number) => formatNumber(v),
      },
    },
    tooltip: {
      theme: "dark",
      x: { formatter: (val) => (val ? formatMonth(String(val)) : "") },
      y: { formatter: (v: number) => `${formatNumber(v)} kölcsönzés` },
    },
    markers: { size: 0, hover: { size: 6 } },
  };

  const series = [{ name: "Kölcsönzés", data: data.map((d) => d.checkouts) }];

  return (
    <div className="glass p-5 sm:p-7">
      <ApexChart options={options} series={series} type="area" height={340} />
    </div>
  );
}
