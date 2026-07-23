"use client";

// ApexCharts csak kliensen fut (a window-ra hivatkozik), ezért ssr:false-szal
// dinamikusan importáljuk. Ezt a wrappert használja minden chart komponens.
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[280px] w-full items-center justify-center text-muted">
      Chart betöltése…
    </div>
  ),
});

export default ApexChart;
