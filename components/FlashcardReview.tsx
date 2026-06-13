"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Eye,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import {
  type Flashcard,
  type CardRating,
  type CardProgress,
  reviewCard,
  newProgress,
  isCardDue,
  RATING_LABELS,
} from "@/lib/flashcards";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const PROGRESS_KEY = "tuvi:flashcard-progress";
const NEW_CARDS_PER_DAY = 10;
const SESSION_LIMIT = 50;

type AllProgress = Record<string, CardProgress>;

type Props = {
  cards: Flashcard[];
};

/**
 * Review session — quản lý hàng đợi card, hiển thị front/back, 4 buttons đánh giá.
 * Limit:
 *  - 10 new cards/ngày (tránh overwhelm người mới)
 *  - 50 cards/phiên (mỏi mệt → kém hiệu quả)
 */
export default function FlashcardReview({ cards }: Props) {
  const { value: progressMap, setValue: setProgressMap, reset } =
    useLocalStorage<AllProgress>(PROGRESS_KEY, {});
  const [showBack, setShowBack] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Tính hàng đợi: review cards (đến hạn) + tối đa 10 new cards
  const queue = useMemo(() => {
    const now = new Date();
    const reviewCards: Flashcard[] = [];
    const newCards: Flashcard[] = [];

    for (const c of cards) {
      const p = progressMap[c.id];
      if (!p) {
        newCards.push(c);
      } else if (isCardDue(p, now)) {
        reviewCards.push(c);
      }
    }

    return [
      ...reviewCards,
      ...newCards.slice(0, NEW_CARDS_PER_DAY),
    ].slice(0, SESSION_LIMIT);
  }, [cards, progressMap]);

  const currentCard = queue[0];

  const handleRating = useCallback(
    (rating: CardRating) => {
      if (!currentCard) return;
      const oldProg = progressMap[currentCard.id] ?? newProgress(currentCard.id);
      const updated = reviewCard(oldProg, rating);
      setProgressMap({ ...progressMap, [currentCard.id]: updated });
      setShowBack(false);
      setSessionCount((c) => c + 1);
    },
    [currentCard, progressMap, setProgressMap]
  );

  // Stats tổng quan
  const stats = useMemo(() => {
    const allProg = Object.values(progressMap);
    const reviewed = allProg.length;
    const mature = allProg.filter((p) => p.state === "mature").length;
    const learning = allProg.filter((p) => p.state === "learning").length;
    return {
      total: cards.length,
      reviewed,
      mature,
      learning,
      due: queue.length,
    };
  }, [cards.length, progressMap, queue.length]);

  // ===== Hoàn thành phiên =====
  if (!currentCard) {
    return (
      <div className="rounded-lg border-2 border-teal-2 bg-cream p-8 text-center shadow-md">
        <Sparkles size={48} className="mx-auto text-teal-2" />
        <h2 className="mt-4 font-display text-2xl font-bold text-ink">
          {sessionCount > 0 ? "Hoàn thành phiên!" : "Không có thẻ đến hạn"} 🎉
        </h2>
        <p className="mt-3 text-ink-2">
          {sessionCount > 0
            ? `Bạn vừa ôn ${sessionCount} thẻ. Quay lại ngày mai để tiếp tục.`
            : "Tất cả thẻ đã ôn xong. Hệ thống sẽ chọn thẻ kế tiếp khi đến lịch."}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Đã học" value={stats.reviewed} total={stats.total} />
          <Stat label="Đang học" value={stats.learning} />
          <Stat label="Thành thạo" value={stats.mature} />
          <Stat label="Phiên này" value={sessionCount} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-red-ink-2 px-5 py-2 font-semibold text-parchment hover:bg-red-ink"
          >
            <BookOpen size={16} />
            Quay về trang chủ
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset toàn bộ tiến độ flashcards?")) reset();
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-2/40 bg-parchment px-4 py-2 text-sm font-semibold text-ink-2 hover:border-red-ink-2"
          >
            <RotateCcw size={14} />
            Reset tất cả
          </button>
        </div>
      </div>
    );
  }

  // ===== Card hiện tại =====
  const oldProg = progressMap[currentCard.id];
  const isNew = !oldProg;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="rounded-full bg-cream-2/70 px-3 py-1 font-semibold text-ink-2">
          Còn <strong className="text-red-ink-2">{queue.length}</strong> thẻ
        </span>
        <span className="text-ink-2">
          Phiên: {sessionCount} · Đã học {stats.reviewed}/{stats.total}
        </span>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border-2 border-gold-2 bg-cream shadow-lg">
        {/* Label module + link bài */}
        <div className="flex items-center justify-between gap-2 border-b border-gold/40 bg-cream-2/50 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment">
              Module {currentCard.module}
            </span>
            {isNew && (
              <span className="rounded-full bg-gold-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
                Mới
              </span>
            )}
          </div>
          <Link
            href={`/learn/${currentCard.lessonSlug}`}
            target="_blank"
            className="truncate max-w-[200px] text-xs italic text-ink-2 hover:underline sm:max-w-[300px]"
            title={`Mở bài: ${currentCard.lessonTitle}`}
          >
            📖 {currentCard.lessonTitle}
          </Link>
        </div>

        {/* Front + Back */}
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <p className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
            {currentCard.front}
          </p>

          {showBack && (
            <div className="mt-6 border-t-2 border-dashed border-gold/40 pt-6 animate-reveal">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-2">
                ĐÁP ÁN
              </div>
              <div className="text-base leading-relaxed text-ink">
                <BoldText text={currentCard.back} />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="border-t border-gold/40 bg-cream-2/30 p-3">
          {!showBack ? (
            <button
              onClick={() => setShowBack(true)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-ink-2 px-5 py-3 font-semibold text-parchment transition hover:bg-ink"
            >
              <Eye size={18} />
              Hiện đáp án (Spacebar)
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <RatingButton
                tone="red"
                icon={<X size={16} />}
                interval="1 ngày"
                onClick={() => handleRating("again")}
              >
                {RATING_LABELS.again}
              </RatingButton>
              <RatingButton
                tone="gold"
                icon={<AlertTriangle size={16} />}
                interval="~3 ngày"
                onClick={() => handleRating("hard")}
              >
                {RATING_LABELS.hard}
              </RatingButton>
              <RatingButton
                tone="teal"
                icon={<Check size={16} />}
                interval="~7 ngày"
                onClick={() => handleRating("good")}
              >
                {RATING_LABELS.good}
              </RatingButton>
              <RatingButton
                tone="ink"
                icon={<Sparkles size={16} />}
                interval="~14+ ngày"
                onClick={() => handleRating("easy")}
              >
                {RATING_LABELS.easy}
              </RatingButton>
            </div>
          )}
        </div>
      </div>

      {/* Hint dưới card */}
      <p className="text-center text-xs italic leading-relaxed text-ink-2">
        💡 Chọn theo <strong>cảm nhận thực</strong> của bạn về độ nhớ — không
        phải đánh giá khó của câu hỏi.
        <br />
        Tự thấy nhớ kém → chọn &ldquo;Quên&rdquo; → app sẽ ôn lại sớm.
      </p>
    </div>
  );
}

/* ============================================================
 * UI subcomponents
 * ============================================================ */

function RatingButton({
  tone,
  icon,
  interval,
  onClick,
  children,
}: {
  tone: "red" | "gold" | "teal" | "ink";
  icon: React.ReactNode;
  interval: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const toneClasses: Record<typeof tone, string> = {
    red: "bg-red-ink-2 hover:bg-red-ink text-parchment",
    gold: "bg-gold-2 hover:bg-gold text-ink",
    teal: "bg-teal-2 hover:bg-teal text-parchment",
    ink: "bg-ink-2 hover:bg-ink text-parchment",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-3 text-sm font-bold transition ${toneClasses[tone]}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span>{children}</span>
      </div>
      <span className="text-[10px] font-normal opacity-80">{interval}</span>
    </button>
  );
}

function Stat({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total?: number;
}) {
  return (
    <div className="rounded-md border border-gold/40 bg-parchment p-3 text-center">
      <div className="font-display text-2xl font-bold text-red-ink-2 tabular-nums">
        {value}
        {total !== undefined && (
          <span className="text-sm font-normal text-ink-2">/{total}</span>
        )}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-ink-2">
        {label}
      </div>
    </div>
  );
}

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-red-ink-2">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}
