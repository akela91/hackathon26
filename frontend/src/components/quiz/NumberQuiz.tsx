"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Hash } from "lucide-react";
import type { Summary } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

interface NumberQuestion {
  key: string;
  question: string;
  answer: number;
}

// ±10% tolerancia a valós érték körül — a nagy, kerek számokat (kölcsönzés,
// olvasó, cím) reális eséllyel el lehet találni pontos egyezés nélkül is.
const TOLERANCE = 0.1;

export default function NumberQuiz({
  summary,
  onComplete,
}: {
  summary: Summary;
  onComplete: (correct: number, total: number) => void;
}) {
  const { t, lang } = useLanguage();

  const questions = useMemo<NumberQuestion[]>(
    () => [
      { key: "checkouts", question: t("quiz.numbers.questionCheckouts"), answer: summary.total_checkouts },
      { key: "patrons", question: t("quiz.numbers.questionPatrons"), answer: summary.unique_patrons },
      { key: "titles", question: t("quiz.numbers.questionTitles"), answer: summary.unique_titles },
    ],
    [summary, t]
  );

  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const answeredRef = useRef(false);

  const q = questions[i];

  function submit() {
    if (answeredRef.current || !q) return;
    const value = Number(guess.replace(/[^0-9.-]/g, ""));
    if (!Number.isFinite(value)) return;
    answeredRef.current = true;
    const right = Math.abs(value - q.answer) <= q.answer * TOLERANCE;
    const finalCorrect = correct + (right ? 1 : 0);
    setFeedback(right);
    if (right) setCorrect(finalCorrect);

    const isLast = i >= questions.length - 1;
    setTimeout(() => {
      if (isLast) {
        onComplete(finalCorrect, questions.length);
      } else {
        setI(i + 1);
        setGuess("");
        setFeedback(null);
        answeredRef.current = false;
      }
    }, 1400);
  }

  if (!q) return null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          {i + 1} / {questions.length}
        </span>
        <span>
          {t("quiz.numbers.scoreLabel")}: <span className="font-bold text-foreground">{correct}</span>
        </span>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
          animate={{ width: `${((i + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="mb-6 text-center text-sm text-muted">{t("quiz.numbers.instruction")}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35 }}
          className="glass relative overflow-hidden p-8 text-center"
        >
          {feedback !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full ${
                feedback ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              {feedback ? <Check className="h-6 w-6 text-white" /> : <X className="h-6 w-6 text-white" />}
            </motion.div>
          )}

          <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-accent-1 to-accent-2 p-4">
            <Hash className="h-8 w-8 text-white" />
          </div>
          <div className="mb-6 text-2xl font-black leading-tight">{q.question}</div>

          <input
            type="text"
            inputMode="numeric"
            value={guess}
            disabled={feedback !== null}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("quiz.numbers.placeholder")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-2xl font-bold text-foreground outline-none focus:border-accent-1 disabled:opacity-60"
          />

          {feedback !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm"
            >
              <span className={feedback ? "text-emerald-400" : "text-rose-400"}>
                {feedback ? t("quiz.numbers.correct") : t("quiz.numbers.incorrect")}
              </span>{" "}
              — {t("quiz.numbers.realValueLabel")}: {formatNumber(q.answer, lang)}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={submit}
        disabled={feedback !== null || guess.trim() === ""}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-accent-1 to-accent-2 py-4 text-lg font-bold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {t("quiz.numbers.submit")}
      </button>
    </div>
  );
}
