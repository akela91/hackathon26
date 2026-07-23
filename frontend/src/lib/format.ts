const nf = new Intl.NumberFormat("hu-HU");

/** Ezres tagolás magyar formátumban. */
export function formatNumber(n: number): string {
  return nf.format(Math.round(n));
}

/** HUF összeg rövidítve (pl. 1,89 Mrd Ft). */
export function formatHUF(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} Mrd Ft`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M Ft`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} E Ft`;
  return `${formatNumber(n)} Ft`;
}

/** Rövid szám (pl. 12,3 E). */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}E`;
  return formatNumber(n);
}

const MONTHS_HU = [
  "jan", "feb", "márc", "ápr", "máj", "jún",
  "júl", "aug", "szept", "okt", "nov", "dec",
];

/** "2024-09" -> "2024. szept" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${y}. ${MONTHS_HU[idx] ?? m}`;
}

/** "2024-09" -> "szept" (rövid, chart tengelyre) */
export function formatMonthShort(ym: string): string {
  const [, m] = ym.split("-");
  const idx = parseInt(m, 10) - 1;
  return MONTHS_HU[idx] ?? m;
}
