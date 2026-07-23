import type { Theme } from "./theme-context";

export interface ChartPalette {
  mode: "dark" | "light";
  textMuted: string;
  textStrong: string;
  gridBorder: string;
  cellEmpty: string;
  /** Kategorikus sorozat-színek (Qulto kék/zöld rámpából interleave-elve). */
  categorical: string[];
  /** Heatmap színskála alsó→felső. */
  heatmap: string[];
  /** Fő kiemelő szín (area/line). */
  primary: string;
  /** Kártya-kitöltés kontúr (heatmap cellák elválasztója). */
  stroke: string;
}

// Qulto kék + zöld rámpák interleave-elve — minden szín a hivatalos designból.
const QULTO_CATEGORICAL = [
  "#174b85", "#97b513", "#245d96", "#a7c52b", "#4179ad",
  "#66790d", "#739fc8", "#bcd24f", "#123c69", "#d4e389",
  "#1c5290", "#819c10",
];
const QULTO_CATEGORICAL_DARK = [
  "#4179ad", "#a7c52b", "#739fc8", "#bcd24f", "#245d96",
  "#97b513", "#a6c2dd", "#d4e389", "#4d9fe0", "#c8e06a",
  "#1c5290", "#819c10",
];
// Kék→zöld heatmap skála (Qulto rámpák).
const QULTO_HEATMAP = ["#0d2c4d", "#174b85", "#245d96", "#4179ad", "#66790d", "#97b513", "#bcd24f"];

const UNICORN_CATEGORICAL = [
  "#ff2e97", "#a24bff", "#ff8a00", "#22c55e", "#2ea6ff",
  "#ffd500", "#ff5fa2", "#7b6bff", "#35d6c3", "#ff6ec7",
];
// 7 lépcsős (0–6): a heatmap komponensek a [6] indexet is használják, ezért
// FONTOS, hogy legalább 7 elem legyen — különben ApexCharts undefined színt
// próbál árnyékolni és elszáll (shadeRGBColor .split crash).
const UNICORN_HEATMAP = ["#2ea6ff", "#4bc0ff", "#22c55e", "#ffd500", "#ff8a00", "#ff2e97", "#a24bff"];

const DARK = {
  mode: "dark" as const,
  textMuted: "#9aa6b4",
  textStrong: "#eef1f5",
  gridBorder: "rgba(255,255,255,0.07)",
  cellEmpty: "#171f2b",
  categorical: QULTO_CATEGORICAL_DARK,
  heatmap: QULTO_HEATMAP,
  primary: "#4179ad",
  stroke: "#0c111a",
};

const LIGHT = {
  mode: "light" as const,
  textMuted: "#6b7888",
  textStrong: "#141a23",
  gridBorder: "rgba(20,26,35,0.08)",
  cellEmpty: "#eef1f5",
  categorical: QULTO_CATEGORICAL,
  heatmap: QULTO_HEATMAP,
  primary: "#174b85",
  stroke: "#ffffff",
};

const UNICORN = {
  mode: "light" as const,
  textMuted: "#b45fb4",
  textStrong: "#6a1b6a",
  gridBorder: "rgba(255,105,180,0.18)",
  cellEmpty: "#ffe3f6",
  categorical: UNICORN_CATEGORICAL,
  heatmap: UNICORN_HEATMAP,
  primary: "#ff2e97",
  stroke: "#fff5fc",
};

export function getChartPalette(theme: Theme): ChartPalette {
  if (theme === "light") return LIGHT;
  if (theme === "unicorn") return UNICORN;
  return DARK;
}
