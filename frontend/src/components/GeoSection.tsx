"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { HeatmapGeo } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

// A Leaflet térkép csak kliensen fut (a window-ra hivatkozik), ezért ssr:false.
const ReadersMap = dynamic(() => import("./ReadersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] w-full items-center justify-center rounded-2xl text-muted">
      Térkép betöltése…
    </div>
  ),
});

export default function GeoSection({ data }: { data: HeatmapGeo }) {
  const { t, lang } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="glass overflow-hidden p-5 sm:p-7 lg:col-span-2">
        <h3 className="mb-3 text-lg font-bold">{t("geo.topCitiesTitle")}</h3>
        {/* Térképdiagram: Magyarországra zoomolva, a körök mérete az olvasók
            számától függ. */}
        <ReadersMap cities={data.by_city} />
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
