"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import {
  generateAllFlashcards,
  isCardDue,
  type CardProgress,
} from "@/lib/flashcards";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const PROGRESS_KEY = "tuvi:flashcard-progress";
const NEW_CARDS_PER_DAY = 10;

type AllProgress = Record<string, CardProgress>;

/**
 * Widget hiển thị số thẻ flashcards cần ôn hôm nay.
 * Mount trên Homepage sidebar — link tới /flashcards.
 */
export default function FlashcardsWidget() {
  const { value: progressMap } = useLocalStorage<AllProgress>(PROGRESS_KEY, {});

  const stats = useMemo(() => {
    const cards = generateAllFlashcards();
    const now = new Date();

    let dueReview = 0;
    let newCards = 0;
    let mature = 0;

    for (const c of cards) {
      const p = progressMap[c.id];
      if (!p) {
        newCards++;
      } else {
        if (p.state === "mature") mature++;
        if (isCardDue(p, now)) dueReview++;
      }
    }

    const reviewedTotal = Object.keys(progressMap).length;
    const todayQueue = dueReview + Math.min(newCards, NEW_CARDS_PER_DAY);

    return {
      total: cards.length,
      reviewedTotal,
      mature,
      todayQueue,
      hasStarted: reviewedTotal > 0,
    };
  }, [progressMap]);

  // Trạng thái chính của widget
  const allDone = stats.todayQueue === 0 && stats.hasStarted;

  return (
    <Link
      href="/flashcards"
      className="mt-4 block rounded-lg border-2 border-red-ink-2/40 bg-cream p-4 shadow-sm transition hover:border-red-ink-2 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-red-ink-2" />
          <h3 className="font-display text-sm font-semibold text-ink">
            Ôn tập Flashcards
          </h3>
        </div>
        <ArrowRight size={14} className="text-ink-2" />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {allDone ? (
          <>
            <span className="font-display text-2xl font-bold text-teal-2">
              ✓
            </span>
            <span className="text-xs text-ink-2">
              Hết thẻ đến hạn — quay lại mai!
            </span>
          </>
        ) : (
          <>
            <span className="font-display text-3xl font-bold text-red-ink-2 tabular-nums">
              {stats.todayQueue}
            </span>
            <span className="text-xs text-ink-2">
              {stats.hasStarted ? "thẻ cần ôn hôm nay" : "thẻ sẵn sàng bắt đầu"}
            </span>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2 text-[10px]">
        <span className="rounded-full bg-cream-2/70 px-2 py-0.5 text-ink-2">
          {stats.reviewedTotal}/{stats.total} đã học
        </span>
        {stats.mature > 0 && (
          <span className="rounded-full bg-teal-2/15 px-2 py-0.5 text-teal-2 font-semibold">
            {stats.mature} thành thạo
          </span>
        )}
      </div>
    </Link>
  );
}
