"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ThumbsUp, ThumbsDown } from "lucide-react";
import type { QuizData } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

interface Card {
  title: string;
  author: string | null;
  checkouts: number;
  isTop: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BookQuiz({
  quiz,
  onComplete,
}: {
  quiz: QuizData;
  onComplete: (correct: number, total: number) => void;
}) {
  const { t, lang } = useLanguage();
  const cards = useMemo<Card[]>(() => {
    const tops = quiz.book_quiz.top_books
      .slice(0, 4)
      .map((b) => ({ ...b, isTop: true }));
    const decoys = shuffle(quiz.book_quiz.decoys)
      .slice(0, 4)
      .map((b) => ({ ...b, isTop: false }));
    return shuffle([...tops, ...decoys]);
  }, [quiz]);

  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  // Ref-alapú zár: az azonos tick-en belüli (pl. dupla-kattintás) ismételt
  // answer()-hívások is kizárva, mert a `feedback` state csak a következő
  // render-nél frissül, addig több hívás is "null"-nak látná.
  const answeredRef = useRef(false);

  const card = cards[i];

  function answer(guessTop: boolean) {
    if (answeredRef.current || !card) return;
    answeredRef.current = true;
    const right = guessTop === card.isTop;
    const finalCorrect = correct + (right ? 1 : 0);
    const isLast = i >= cards.length - 1;
    setFeedback(right);
    if (right) setCorrect(finalCorrect);
    setTimeout(() => {
      // Az onComplete a szülő (QuizSection) state-jét frissíti — ezt NEM
      // szabad egy állapot-updater függvényből (renderfázis) hívni. A
      // setTimeout callbackje viszont a renderen kívül fut, itt biztonságos.
      if (isLast) {
        onComplete(finalCorrect, cards.length);
      } else {
        setI(i + 1);
        setFeedback(null);
        answeredRef.current = false;
      }
    }, 1100);
  }

  if (!card) return null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          {i + 1} / {cards.length}
        </span>
        <span>
          {t("quiz.book.scoreLabel")}: <span className="font-bold text-foreground">{correct}</span>
        </span>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
          animate={{ width: `${((i + 1) / cards.length) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-center text-lg text-muted">{t("quiz.book.question")}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
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
              {feedback ? (
                <Check className="h-6 w-6 text-white" />
              ) : (
                <X className="h-6 w-6 text-white" />
              )}
            </motion.div>
          )}
          <div className="mb-2 text-2xl font-black leading-tight">
            {card.title}
          </div>
          {card.author && (
            <div className="text-muted">{card.author}</div>
          )}

          {feedback !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm"
            >
              <span
                className={
                  card.isTop ? "text-emerald-400" : "text-rose-400"
                }
              >
                {card.isTop ? t("quiz.book.topBadge") : t("quiz.book.notTopBadge")}
              </span>{" "}
              — {formatNumber(card.checkouts, lang)} {t("quiz.book.checkoutsSuffix")}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => answer(true)}
          disabled={feedback !== null}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <ThumbsUp className="h-5 w-5" /> {t("quiz.book.yes")}
        </button>
        <button
          onClick={() => answer(false)}
          disabled={feedback !== null}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <ThumbsDown className="h-5 w-5" /> {t("quiz.book.no")}
        </button>
      </div>
    </div>
  );
}
