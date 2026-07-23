"use client";

// ApexCharts csak kliensen fut (a window-ra hivatkozik), ezért ssr:false-szal
// dinamikusan importáljuk. Ezt a wrappert használja minden chart komponens.
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/language-context";

function ChartLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-full min-h-[280px] w-full items-center justify-center text-muted">
      {t("errors.loading")}
    </div>
  );
}

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: ChartLoading,
});

export default ApexChart;
