"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trophy, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import type { QuizData } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useLanguage } from "@/lib/language-context";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Item {
  author: string;
  checkouts: number;
}

function SortableRow({
  item,
  index,
  revealed,
  correctIndex,
  dragLabel,
  lang,
}: {
  item: Item;
  index: number;
  revealed: boolean;
  correctIndex: number;
  dragLabel: string;
  lang: "hu" | "en";
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.author, disabled: revealed });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isRight = revealed && index === correctIndex;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass flex items-center gap-3 p-4 ${
        isDragging ? "shadow-2xl" : ""
      } ${
        revealed
          ? isRight
            ? "border-emerald-500/60"
            : "border-rose-500/60"
          : ""
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-1 to-accent-2 text-sm font-black text-white">
        {index + 1}
      </span>
      {!revealed && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted active:cursor-grabbing"
          aria-label={dragLabel}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      )}
      <span className="flex-1 font-semibold">{item.author}</span>
      {revealed && (
        <span className="flex items-center gap-2 text-sm text-muted">
          {formatNumber(item.checkouts, lang)}
          {isRight ? (
            <Check className="h-5 w-5 text-emerald-400" />
          ) : (
            <X className="h-5 w-5 text-rose-400" />
          )}
        </span>
      )}
    </div>
  );
}

export default function AuthorDragQuiz({
  quiz,
  onComplete,
}: {
  quiz: QuizData;
  onComplete: (correct: number, total: number) => void;
}) {
  const { t, lang } = useLanguage();
  const correctOrder = useMemo(
    () =>
      [...quiz.author_quiz.top_authors].sort(
        (a, b) => b.checkouts - a.checkouts
      ),
    [quiz]
  );
  const [items, setItems] = useState<Item[]>(() => {
    // Ne induljon véletlenül a helyes sorrendben.
    let s = shuffle(correctOrder);
    if (s.map((x) => x.author).join() === correctOrder.map((x) => x.author).join()) {
      s = [...s].reverse();
    }
    return s;
  });
  const [revealed, setRevealed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldI = prev.findIndex((x) => x.author === active.id);
        const newI = prev.findIndex((x) => x.author === over.id);
        return arrayMove(prev, oldI, newI);
      });
    }
  }

  const correctIndexOf = (author: string) =>
    correctOrder.findIndex((x) => x.author === author);

  function check() {
    setRevealed(true);
    const correct = items.filter(
      (it, idx) => correctIndexOf(it.author) === idx
    ).length;
    setTimeout(() => onComplete(correct, items.length), 1800);
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-6 text-center text-lg text-muted">{t("quiz.author.instruction")}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((x) => x.author)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((it, idx) => (
              <SortableRow
                key={it.author}
                item={it}
                index={idx}
                revealed={revealed}
                correctIndex={correctIndexOf(it.author)}
                dragLabel={t("quiz.author.dragLabel")}
                lang={lang}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!revealed && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={check}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-1 to-accent-2 py-4 text-lg font-bold text-white transition hover:opacity-90"
        >
          <Trophy className="h-5 w-5" /> {t("quiz.author.check")}
        </motion.button>
      )}
    </div>
  );
}
