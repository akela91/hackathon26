import type {
  Summary,
  AuthorsMonthly,
  QuizData,
  Heatmaps,
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

export async function fetchAppData(): Promise<AppData> {
  const [summary, authors, quiz, heatmaps] = await Promise.all([
    getJSON<Summary>("/api/summary"),
    getJSON<AuthorsMonthly>("/api/authors"),
    getJSON<QuizData>("/api/quiz"),
    getJSON<Heatmaps>("/api/heatmaps"),
  ]);
  return { summary, authors, quiz, heatmaps };
}

export { API_URL };
