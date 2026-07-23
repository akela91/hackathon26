import type {
  Summary,
  AuthorsMonthly,
  QuizData,
  Heatmaps,
  EtoAgeHeatmap,
  AppData,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API hiba (${res.status}) a ${path} végponton`);
  }
  return (await res.json()) as T;
}

/**
 * Az összes adat lekérése egy adott könyvtár scope-ra ("ALL" vagy egy
 * konkrét könyvtárkód). A backend minden végpontot előre kiszámolva szolgál
 * ki scope-onként, így ez is csak statikus JSON-öket olvas fel.
 */
export async function fetchAppData(library: string = "ALL"): Promise<AppData> {
  const q = `?library=${encodeURIComponent(library)}`;
  const [summary, authors, quiz, heatmaps, etoAge] = await Promise.all([
    getJSON<Summary>(`/api/summary${q}`),
    getJSON<AuthorsMonthly>(`/api/authors${q}`),
    getJSON<QuizData>(`/api/quiz${q}`),
    getJSON<Heatmaps>(`/api/heatmaps${q}`),
    getJSON<EtoAgeHeatmap>(`/api/heatmaps/eto-age${q}`),
  ]);
  return { summary, authors, quiz, heatmaps, etoAge };
}

export { API_URL };
