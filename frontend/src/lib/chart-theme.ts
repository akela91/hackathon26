import type { Theme } from "./theme-context";

export interface ChartPalette {
  mode: "dark" | "light";
  textMuted: string;
  textStrong: string;
  gridBorder: string;
  tooltipBg: string;
  cellEmpty: string;
}

const DARK: ChartPalette = {
  mode: "dark",
  textMuted: "#9b96c4",
  textStrong: "#f4f2ff",
  gridBorder: "rgba(255,255,255,0.06)",
  tooltipBg: "#14122a",
  cellEmpty: "#141228",
};

const LIGHT: ChartPalette = {
  mode: "light",
  textMuted: "#5b5580",
  textStrong: "#1a1730",
  gridBorder: "rgba(20,10,45,0.08)",
  tooltipBg: "#ffffff",
  cellEmpty: "#ece9f7",
};

export function getChartPalette(theme: Theme): ChartPalette {
  return theme === "light" ? LIGHT : DARK;
}
