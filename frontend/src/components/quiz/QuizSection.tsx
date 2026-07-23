"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, BookOpen, ListOrdered, Award, RotateCcw, Hash } from "lucide-react";
import type { QuizData, Summary } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import BookQuiz from "./BookQuiz";
import AuthorDragQuiz from "./AuthorDragQuiz";
import NumberQuiz from "./NumberQuiz";
import MongooseEgg from "@/components/easter-egg/MongooseEgg";

type Stage = "intro" | "books" | "authors" | "numbers" | "result";

export default function QuizSection({ quiz, summary }: { quiz: QuizData; summary: Summary }) {
  const { t } = useLanguage();
  const [stage, setStage] = useState<Stage>("intro");
  const [bookScore, setBookScore] = useState({ correct: 0, total: 0 });
  const [authorScore, setAuthorScore] = useState({ correct: 0, total: 0 });
  const [numberScore, setNumberScore] = useState({ correct: 0, total: 0 });

  // Ha felül megváltozik a könyvtár vagy az évszám, a `quiz` prop új referenciát
  // kap (friss fetch) — ilyenkor a kvíz teljesen újrakezdődik friss kérdésekkel,
  // még akkor is, ha a felhasználó épp félúton volt.
  useEffect(() => {
    setStage("intro");
    setBookScore({ correct: 0, total: 0 });
    setAuthorScore({ correct: 0, total: 0 });
    setNumberScore({ correct: 0, total: 0 });
  }, [quiz]);

  const totalCorrect = bookScore.correct + authorScore.correct + numberScore.correct;
  const totalQuestions = bookScore.total + authorScore.total + numberScore.total;
  const pct = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  function reset() {
    setBookScore({ correct: 0, total: 0 });
    setAuthorScore({ correct: 0, total: 0 });
    setNumberScore({ correct: 0, total: 0 });
    setStage("intro");
  }

  const rank =
    pct >= 90
      ? { title: t("quiz.result.ranks.master"), emoji: "🏆", color: "from-amber-400 to-orange-500" }
      : pct >= 60
      ? { title: t("quiz.result.ranks.enthusiast"), emoji: "📚", color: "from-violet-500 to-fuchsia-500" }
      : pct >= 30
      ? { title: t("quiz.result.ranks.beginner"), emoji: "🔍", color: "from-cyan-500 to-blue-500" }
      : { title: t("quiz.result.ranks.first"), emoji: "🌱", color: "from-emerald-500 to-teal-500" };

  return (
    <div className="glass relative overflow-hidden p-6 sm:p-10">
      {/* Mongúz easter egg: minden kör-váltásnál felbukkan a kártya sarkában */}
      <MongooseEgg trigger={stage} ambientIntervalMs={null} mode="corner" />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-accent-1 to-accent-2 p-4">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-black">{t("quiz.intro.title")}</h3>
            <p className="mt-3 text-muted">{t("quiz.intro.subtitle")}</p>
            <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BookOpen className="mb-2 h-6 w-6 text-accent-2" />
                <div className="font-bold">{t("quiz.intro.round1Title")}</div>
                <div className="text-sm text-muted">{t("quiz.intro.round1Desc")}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ListOrdered className="mb-2 h-6 w-6 text-accent-3" />
                <div className="font-bold">{t("quiz.intro.round2Title")}</div>
                <div className="text-sm text-muted">{t("quiz.intro.round2Desc")}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Hash className="mb-2 h-6 w-6 text-accent-4" />
                <div className="font-bold">{t("quiz.intro.round3Title")}</div>
                <div className="text-sm text-muted">{t("quiz.intro.round3Desc")}</div>
              </div>
            </div>
            <button
              onClick={() => setStage("books")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 px-8 py-4 text-lg font-bold text-white transition hover:opacity-90"
            >
              {t("quiz.intro.cta")} <Gamepad2 className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === "books" && (
          <motion.div
            key="books"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <BookQuiz
              quiz={quiz}
              onComplete={(correct, total) => {
                setBookScore({ correct, total });
                setStage("authors");
              }}
            />
          </motion.div>
        )}

        {stage === "authors" && (
          <motion.div
            key="authors"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <AuthorDragQuiz
              quiz={quiz}
              onComplete={(correct, total) => {
                setAuthorScore({ correct, total });
                setStage("numbers");
              }}
            />
          </motion.div>
        )}

        {stage === "numbers" && (
          <motion.div
            key="numbers"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <NumberQuiz
              summary={summary}
              onComplete={(correct, total) => {
                setNumberScore({ correct, total });
                setStage("result");
              }}
            />
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-lg text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="mb-4 text-7xl"
            >
              {rank.emoji}
            </motion.div>
            <div className="text-sm uppercase tracking-widest text-muted">
              {t("quiz.result.yourResult")}
            </div>
            <div
              className={`bg-gradient-to-r ${rank.color} bg-clip-text text-4xl font-black text-transparent`}
            >
              {rank.title}
            </div>

            <div className="my-8">
              <div className="text-6xl font-black">
                {totalCorrect}
                <span className="text-2xl text-muted">/{totalQuestions}</span>
              </div>
              <div className="mt-2 text-muted">
                {pct}
                {t("quiz.result.accuracySuffix")}
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <ScorePill
                icon={<BookOpen className="h-5 w-5" />}
                label={t("quiz.result.books")}
                score={`${bookScore.correct}/${bookScore.total}`}
              />
              <ScorePill
                icon={<Award className="h-5 w-5" />}
                label={t("quiz.result.authors")}
                score={`${authorScore.correct}/${authorScore.total}`}
              />
              <ScorePill
                icon={<Hash className="h-5 w-5" />}
                label={t("quiz.result.numbers")}
                score={`${numberScore.correct}/${numberScore.total}`}
              />
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" /> {t("quiz.result.again")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScorePill({
  icon,
  label,
  score,
}: {
  icon: React.ReactNode;
  label: string;
  score: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-accent-1">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
        <div className="text-xl font-bold">{score}</div>
      </div>
    </div>
  );
}
