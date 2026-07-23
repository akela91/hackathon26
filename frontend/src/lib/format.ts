import type { Lang } from "./dictionaries";

function locale(lang: Lang = "hu"): string {
  if (lang === "en") return "en-US";
  if (lang === "zh") return "zh-CN";
  return "hu-HU";
}

/** Ezres tagolás a megadott nyelv konvenciója szerint. */
export function formatNumber(n: number, lang: Lang = "hu"): string {
  return new Intl.NumberFormat(locale(lang)).format(Math.round(n));
}

/** HUF összeg rövidítve (pl. 1,89 Mrd Ft / 1.89B Ft). */
export function formatHUF(n: number, lang: Lang = "hu"): string {
  const suffix = lang === "hu" ? { b: "Mrd", m: "M", k: "E" } : { b: "B", m: "M", k: "K" };
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} ${suffix.b} Ft`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} ${suffix.m} Ft`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} ${suffix.k} Ft`;
  return `${formatNumber(n, lang)} Ft`;
}

/** Rövid szám (pl. 12,3 E / 12.3K). */
export function formatCompact(n: number, lang: Lang = "hu"): string {
  const suffix = lang === "hu" ? { m: "M", k: "E" } : { m: "M", k: "K" };
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}${suffix.m}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}${suffix.k}`;
  return formatNumber(n, lang);
}

/** "2024-09" -> "2024. szept" / "2024 Sep", a megadott rövid hónapnevekkel. */
export function formatMonth(ym: string, monthsShort: string[], lang: Lang = "hu"): string {
  const [y, m] = ym.split("-");
  const idx = parseInt(m, 10) - 1;
  const name = monthsShort[idx] ?? m;
  if (lang === "en") return `${name} ${y}`;
  if (lang === "zh") return `${y}年${name}`;
  return `${y}. ${name}`;
}
