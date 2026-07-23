"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { GeoRow } from "@/lib/types";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { formatNumber } from "@/lib/format";

/**
 * A görgő-zoom csak akkor aktív, ha a kurzor a térkép fölött van (fókusz),
 * hogy az oldal görgetése ne akadjon el rajta, de a térkép fölött szabadon
 * lehessen ki-be zoomolni. Leaflet mouseover/mouseout eseményekre kapcsol.
 */
function ScrollZoomOnHover() {
  const map = useMap();
  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    disable();
    map.on("mouseover", enable);
    map.on("mouseout", disable);
    return () => {
      map.off("mouseover", enable);
      map.off("mouseout", disable);
    };
  }, [map]);
  return null;
}

// Magyarország befoglaló doboza – erre zoomol alapból a térkép.
const HU_BOUNDS: LatLngBoundsExpression = [
  [45.7, 16.0],
  [48.6, 22.95],
];

// Ingyenes, kulcs nélküli CartoDB csempék, témához illően.
const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

export default function ReadersMap({ cities }: { cities: GeoRow[] }) {
  const { theme } = useTheme();
  const { t, lang } = useLanguage();

  const pts = cities.filter((c) => typeof c.lat === "number" && typeof c.lng === "number");
  const maxPatrons = Math.max(1, ...pts.map((c) => c.patrons || 0));
  const tileUrl = theme === "dark" ? TILES.dark : TILES.light;
  const fill = theme === "unicorn" ? "#ff2e97" : "#97b513"; // Qulto zöld / unicorn pink
  const stroke = theme === "unicorn" ? "#a24bff" : "#174b85"; // Qulto kék

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        bounds={HU_BOUNDS}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "transparent" }}
      >
        <ScrollZoomOnHover />
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>, &copy; <a href="https://carto.com/">CARTO</a>'
        />
        {pts.map((c, i) => {
          // Kör sugara az olvasószámtól (négyzetgyök-skálázás a vizuális arányért).
          const r = 6 + Math.sqrt((c.patrons || 0) / maxPatrons) * 34;
          return (
            <CircleMarker
              key={`${c.city}-${i}`}
              center={[c.lat as number, c.lng as number]}
              radius={r}
              pathOptions={{
                color: stroke,
                weight: 1.5,
                fillColor: fill,
                fillOpacity: 0.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                <div style={{ fontWeight: 700 }}>{c.city}</div>
                <div>
                  {formatNumber(c.patrons, lang)} {t("hero.statPatrons")}
                </div>
                <div style={{ opacity: 0.7 }}>
                  {formatNumber(c.checkouts, lang)} {t("stats.checkoutsSuffix")}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
