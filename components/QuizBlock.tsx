"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, X, RotateCcw, Trophy, Lightbulb, MessageCircleQuestion, ArrowRight, X as Close } from "lucide-react";
import type { QuizItem } from "@/lib/types";
import { useQuizProgress } from "@/hooks/useQuizProgress";

type Props = {
  lessonId: string;
  quiz: QuizItem[];
  /** Bài tiếp theo trong lộ trình — dùng cho toast khi hoàn thành. */
  nextLesson?: { slug: string; title: string };
};

export default function QuizBlock({ lessonId, quiz, nextLesson }: Props) {
  // Memoize correctAnswers để tránh tạo mảng mới mỗi render (gây re-calc trong hook)
  const correctAnswers = useMemo(() => quiz.map((q) => q.answer), [quiz]);
  const { answers, correctCount, completed, submit, reset, hydrated } =
    useQuizProgress(lessonId, correctAnswers);

  // Số câu đã trả lời
  const answeredCount = answers.filter((a) => a !== null).length;

  // Toast khi vừa hoàn thành (chỉ hiện 1 lần ngay khi chuyển từ false → true)
  const [toastVisible, setToastVisible] = useState(false);
  const wasCompletedRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (wasCompletedRef.current === null) {
      // Lần đầu hydrate — chỉ ghi nhận, không hiện toast
      wasCompletedRef.current = completed;
      return;
    }
    if (completed && !wasCompletedRef.current) {
      setToastVisible(true);
      const timer = window.setTimeout(() => setToastVisible(false), 7000);
      wasCompletedRef.current = completed;
      return () => window.clearTimeout(timer);
    }
    wasCompletedRef.current = completed;
  }, [completed, hydrated]);

  // Câu hiện tại đang chờ trả lời (câu chưa làm đầu tiên)
  const currentIndex = useMemo(() => {
    const idx = answers.findIndex((a) => a === null);
    return idx === -1 ? quiz.length : idx;
  }, [answers, quiz.length]);

  return (
    <section
      aria-labelledby="quiz-heading"
      className="mt-12 overflow-hidden rounded-lg border border-gold-2 bg-cream shadow-sm"
    >
      {/* Header */}
      <header className="bg-gold-2/15 px-5 py-4 border-b border-gold-2/60">
        <h2
          id="quiz-heading"
          className="flex items-center gap-2 font-display text-xl font-semibold text-ink"
        >
          <MessageCircleQuestion size={20} className="text-gold" />
          Bài tập — {quiz.length} câu
        </h2>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-2">
          <span>
            Đã làm: <strong className="font-semibold">{answeredCount}/{quiz.length}</strong>
          </span>
          <span>
            Đúng:{" "}
            <strong className="font-semibold text-teal">{correctCount}/{quiz.length}</strong>
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-2 px-2 py-0.5 text-xs font-medium text-parchment">
              <Check size={12} /> Hoàn thành
            </span>
          )}
        </div>
      </header>

      {/* Danh sách câu hỏi */}
      <ol className="divide-y divide-gold/30">
        {quiz.map((item, i) => (
          <QuizQuestion
            key={i}
            index={i}
            item={item}
            selected={answers[i]}
            locked={!hydrated}
            visible={i <= currentIndex}
            onSelect={(optionIndex) => submit(i, optionIndex)}
          />
        ))}
      </ol>

      {/* Summary cuối */}
      {completed && (
        <Summary
          correct={correctCount}
          total={quiz.length}
          onRetry={reset}
        />
      )}

      {/* Toast hoàn thành */}
      {toastVisible && (
        <CompletionToast
          correct={correctCount}
          total={quiz.length}
          nextLesson={nextLesson}
          onClose={() => setToastVisible(false)}
        />
      )}
    </section>
  );
}

function CompletionToast({
  correct,
  total,
  nextLesson,
  onClose,
}: {
  correct: number;
  total: number;
  nextLesson?: { slug: string; title: string };
  onClose: () => void;
}) {
  const percent = Math.round((correct / total) * 100);
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-reveal rounded-lg border-2 border-gold-2 bg-cream p-4 shadow-xl sm:left-auto sm:right-4 sm:w-96"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng thông báo"
        className="absolute right-2 top-2 rounded-full p-1 text-ink-2 hover:bg-cream-2"
      >
        <Close size={14} />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-2 bg-parchment">
          <Trophy size={20} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm font-semibold text-ink">
            Bài hoàn thành — {correct}/{total} ({percent}%)
          </p>
          <p className="mt-0.5 text-xs text-ink-2">
            Tiến độ đã được lưu. Chuỗi ngày học cũng tự cộng.
          </p>
          {nextLesson && (
            <Link
              href={`/learn/${nextLesson.slug}`}
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-ink-2 hover:underline"
            >
              Bài tiếp theo: {nextLesson.title}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizQuestion({
  index,
  item,
  selected,
  locked,
  visible,
  onSelect,
}: {
  index: number;
  item: QuizItem;
  selected: number | null;
  locked: boolean;
  visible: boolean;
  onSelect: (optionIndex: number) => void;
}) {
  const answered = selected !== null;
  const correct = answered && selected === item.answer;

  if (!visible) {
    return (
      <li className="px-5 py-4 opacity-60">
        <div className="flex items-center gap-3 text-sm text-ink-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-3/40 bg-cream-2/40 font-display text-xs">
            {index + 1}
          </span>
          <span className="italic">Hãy hoàn thành câu trước để mở câu này.</span>
        </div>
      </li>
    );
  }

  return (
    <li className="px-5 py-4">
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-semibold",
            answered
              ? correct
                ? "border-teal-2 bg-teal-2 text-parchment"
                : "border-red-ink-2 bg-red-ink-2 text-parchment"
              : "border-red-ink-2 bg-parchment text-red-ink-2"
          )}
          aria-hidden
        >
          {answered ? (correct ? <Check size={16} /> : <X size={16} />) : index + 1}
        </span>
        <p className="pt-1 font-medium leading-relaxed text-ink">{item.question}</p>
      </div>

      <ul className="mt-3 ml-11 space-y-2" role="radiogroup" aria-label={`Câu ${index + 1}`}>
        {item.options.map((opt, j) => {
          const isUserChoice = selected === j;
          const isCorrect = j === item.answer;
          const showCorrect = answered && isCorrect;
          const showWrong = answered && isUserChoice && !isCorrect;

          return (
            <li key={j}>
              <button
                type="button"
                role="radio"
                aria-checked={isUserChoice}
                disabled={answered || locked}
                onClick={() => onSelect(j)}
                className={clsx(
                  "group flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left text-sm transition",
                  !answered &&
                    "border-gold/50 bg-parchment hover:border-red-ink-2 hover:bg-cream cursor-pointer",
                  showCorrect && "border-teal-2 bg-teal-2/15 text-ink",
                  showWrong && "border-red-ink-2 bg-red-ink-2/10 text-ink",
                  answered && !showCorrect && !showWrong && "border-gold/30 bg-parchment text-ink-2 opacity-80"
                )}
              >
                <span
                  className={clsx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold",
                    showCorrect && "border-teal-2 bg-teal-2 text-parchment",
                    showWrong && "border-red-ink-2 bg-red-ink-2 text-parchment",
                    !showCorrect && !showWrong && "border-gold-2 bg-cream text-ink-2 group-hover:border-red-ink-2 group-hover:text-red-ink-2"
                  )}
                >
                  {showCorrect ? (
                    <Check size={12} />
                  ) : showWrong ? (
                    <X size={12} />
                  ) : (
                    String.fromCharCode(65 + j)
                  )}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Explanation reveal */}
      {answered && (
        <div
          className={clsx(
            "ml-11 mt-3 rounded-md border-l-4 p-3 text-sm leading-relaxed animate-reveal",
            correct
              ? "border-teal-2 bg-teal-2/10 text-ink"
              : "border-red-ink-2 bg-red-ink-2/10 text-ink"
          )}
        >
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
            <Lightbulb size={12} className={correct ? "text-teal-2" : "text-red-ink-2"} />
            <span className={correct ? "text-teal-2" : "text-red-ink-2"}>
              {correct ? "Chính xác — giải thích" : "Chưa đúng — giải thích"}
            </span>
          </div>
          <RichExplanation text={item.explanation} />
        </div>
      )}
    </li>
  );
}

function Summary({
  correct,
  total,
  onRetry,
}: {
  correct: number;
  total: number;
  onRetry: () => void;
}) {
  const percent = Math.round((correct / total) * 100);
  const grade =
    percent === 100
      ? { label: "Xuất sắc", note: "Bạn đã nắm vững bài này.", tone: "teal" }
      : percent >= 67
        ? { label: "Tốt", note: "Đọc lại các câu sai để chắc hơn.", tone: "teal" }
        : { label: "Cần ôn", note: "Hãy đọc lại bài rồi thử lại nhé.", tone: "red" };

  return (
    <div className="border-t border-gold-2/60 bg-gold-2/15 px-5 py-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold-2 bg-parchment">
          <Trophy size={26} className="text-gold" />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg font-semibold text-ink">
            {grade.label} — {correct}/{total} ({percent}%)
          </div>
          <p className="text-sm text-ink-2">{grade.note}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-red-ink-2 bg-parchment px-4 py-2 text-sm font-semibold text-red-ink-2 transition hover:bg-red-ink-2 hover:text-parchment"
        >
          <RotateCcw size={14} />
          Làm lại
        </button>
      </div>
    </div>
  );
}

/** In đậm bằng cú pháp **bold** trong explanation */
function RichExplanation({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </p>
  );
}
