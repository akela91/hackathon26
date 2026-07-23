"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, BookOpen } from "lucide-react";
import { fetchAppData, API_URL } from "@/lib/api";
import type { AppData } from "@/lib/types";

import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import StatsGrid from "@/components/StatsGrid";
import MonthlyChart from "@/components/MonthlyChart";
import DistributionCharts from "@/components/DistributionCharts";
import AuthorRaceChart from "@/components/AuthorRaceChart";
import TimeHeatmap from "@/components/TimeHeatmap";
import GeoSection from "@/components/GeoSection";
import RenewedBooks from "@/components/RenewedBooks";
import QuizSection from "@/components/quiz/QuizSection";

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppData()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="glass max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-accent-3" />
          <h1 className="mb-2 text-2xl font-bold">Nem érhető el a backend</h1>
          <p className="mb-4 text-muted">{error}</p>
          <div className="rounded-xl bg-black/40 p-4 text-left text-sm text-muted">
            <p className="mb-2">Indítsd el a backendet a repo gyökeréből:</p>
            <code className="block rounded bg-black/50 p-2 text-accent-4">
              python -m uvicorn backend.main:app --port 8000
            </code>
            <p className="mt-3">
              API: <span className="text-accent-4">{API_URL}</span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-accent-1" />
        </motion.div>
        <p className="text-muted">Adatok betöltése…</p>
      </main>
    );
  }

  const { summary, authors, quiz, heatmaps } = data;

  return (
    <main className="relative">
      <Hero summary={summary} />

      <Section
        id="stats"
        eyebrow="Az év számokban"
        title={<span className="gradient-text">A nagy összkép</span>}
        subtitle="Minden, amit a közösség idén kölcsönzött — egy pillantásra."
      >
        <StatsGrid summary={summary} />
      </Section>

      <Section
        eyebrow="Ritmus"
        title="Így pörgött az év"
        subtitle="Havi kölcsönzési trend a teljes időszakra."
      >
        <MonthlyChart summary={summary} />
      </Section>

      <Section
        eyebrow="Verseny"
        title={<span className="gradient-text-cool">Szerzők versenye</span>}
        subtitle="Nyomd meg a Lejátszást, és nézd, hogyan előzik egymást a legnépszerűbb szerzők hónapról hónapra."
      >
        <AuthorRaceChart data={authors} />
      </Section>

      <Section
        eyebrow="Megoszlás"
        title="Mit és milyen nyelven?"
        subtitle="Dokumentumtípusok és nyelvek a kölcsönzésekben."
      >
        <DistributionCharts summary={summary} />
      </Section>

      <Section
        eyebrow="Mikor?"
        title="A könyvtár pulzusa"
        subtitle="Kölcsönzések a hét napjai és a nap órái szerint. A meleg mezők a csúcsidők."
      >
        <TimeHeatmap data={heatmaps.time} />
      </Section>

      <Section
        eyebrow="Honnan?"
        title="Az olvasók térképe"
        subtitle="Honnan érkeznek a legtöbben — települések és irányítószámok szerint."
      >
        <GeoSection data={heatmaps.geo} />
      </Section>

      <Section
        eyebrow="Kedvencek"
        title={<span className="gradient-text">Nem adták vissza</span>}
        subtitle="A legtöbbször meghosszabbított könyvek."
      >
        <RenewedBooks summary={summary} />
      </Section>

      <Section
        id="quiz"
        eyebrow="Játék"
        title={<span className="gradient-text-cool">Gamifikált kvíz</span>}
        subtitle="Teszteld magad: mennyire ismered a könyvtár adatait?"
      >
        <QuizSection quiz={quiz} />
      </Section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5">
          <BookOpen className="h-6 w-6 text-accent-1" />
          <p>
            Library Wrapped · {summary.libraries.join(" • ")} ·{" "}
            {summary.dataset} adathalmaz
          </p>
          <p className="text-xs">
            Előre aggregált adatok — pipeline (DuckDB) → FastAPI → Next.js
          </p>
        </div>
      </footer>
    </main>
  );
}
