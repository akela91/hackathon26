"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, BookOpen } from "lucide-react";
import { fetchAppData, API_URL } from "@/lib/api";
import type { AppData } from "@/lib/types";
import { useLibrary } from "@/lib/library-context";
import { useLanguage } from "@/lib/language-context";

import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import StatsGrid from "@/components/StatsGrid";
import MonthlyChart from "@/components/MonthlyChart";
import AuthorRaceChart from "@/components/AuthorRaceChart";
import TimeHeatmap from "@/components/TimeHeatmap";
import EtoAgeHeatmap from "@/components/EtoAgeHeatmap";
import GeoSection from "@/components/GeoSection";
import RenewedBooks from "@/components/RenewedBooks";
import QuizSection from "@/components/quiz/QuizSection";
import MongooseEgg from "@/components/easter-egg/MongooseEgg";

export default function Home() {
  const { selectedLibrary, selectedYear } = useLibrary();
  const { t } = useLanguage();
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    fetchAppData(selectedLibrary, selectedYear)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => {
        isFirstLoad.current = false;
      });
  }, [selectedLibrary, selectedYear]);

  if (error) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-5">
        <div className="glass max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-accent-3" />
          <h1 className="mb-2 text-2xl font-bold">{t("errors.backendUnavailable")}</h1>
          <p className="mb-4 text-muted">{error}</p>
          <div className="rounded-xl bg-black/40 p-4 text-left text-sm text-muted">
            <p className="mb-2">{t("errors.startBackendHint")}</p>
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

  if (!data && isFirstLoad.current) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-accent-1" />
        </motion.div>
        <p className="text-muted">{t("errors.loading")}</p>
      </main>
    );
  }

  if (!data) return null;

  const { summary, authors, quiz, heatmaps, etoAge } = data;

  return (
    <main className="relative">
      <Hero summary={summary} />

      <Section
        id="stats"
        eyebrow={t("sections.stats.eyebrow")}
        title={<span className="gradient-text">{t("sections.stats.title")}</span>}
        subtitle={t("sections.stats.subtitle")}
      >
        <StatsGrid summary={summary} />
      </Section>

      <Section
        eyebrow={t("sections.monthly.eyebrow")}
        title={t("sections.monthly.title")}
        subtitle={t("sections.monthly.subtitle")}
      >
        <MonthlyChart summary={summary} />
      </Section>

      <Section
        eyebrow={t("sections.authorRace.eyebrow")}
        title={<span className="gradient-text-cool">{t("sections.authorRace.title")}</span>}
        subtitle={t("sections.authorRace.subtitle")}
      >
        <AuthorRaceChart data={authors} />
      </Section>

      <Section
        eyebrow={t("sections.timeHeatmap.eyebrow")}
        title={t("sections.timeHeatmap.title")}
        subtitle={t("sections.timeHeatmap.subtitle")}
      >
        <TimeHeatmap data={heatmaps.time} />
      </Section>

      <Section
        eyebrow={t("sections.etoAge.eyebrow")}
        title={<span className="gradient-text">{t("sections.etoAge.title")}</span>}
        subtitle={t("sections.etoAge.subtitle")}
      >
        <EtoAgeHeatmap data={etoAge} />
      </Section>

      <Section
        eyebrow={t("sections.geo.eyebrow")}
        title={t("sections.geo.title")}
        subtitle={t("sections.geo.subtitle")}
      >
        <GeoSection data={heatmaps.geo} />
      </Section>

      <Section
        eyebrow={t("sections.renewed.eyebrow")}
        title={<span className="gradient-text">{t("sections.renewed.title")}</span>}
        subtitle={t("sections.renewed.subtitle")}
      >
        <RenewedBooks summary={summary} />
      </Section>

      <Section
        id="quiz"
        eyebrow={t("sections.quiz.eyebrow")}
        title={<span className="gradient-text-cool">{t("sections.quiz.title")}</span>}
        subtitle={t("sections.quiz.subtitle")}
      >
        <QuizSection quiz={quiz} summary={summary} />
      </Section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-muted">
        <div className="mx-auto flex max-w-[86rem] flex-col items-center gap-2 px-5">
          <BookOpen className="h-6 w-6 text-accent-1" />
          <p>
            {t("footer.tagline")} · {summary.libraries.join(" • ")} ·{" "}
            {summary.dataset}
          </p>
          <p className="text-xs">{t("footer.pipeline")}</p>
        </div>
      </footer>

      <MongooseEgg />
    </main>
  );
}
