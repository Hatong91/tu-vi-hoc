"use client";

import { Sparkles, Flame, BookMarked, CheckCircle2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import FlashcardsWidget from "./FlashcardsWidget";
import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import type { PhaseInfo } from "@/lib/types";

type Props = {
  /** Danh sách phase available (đã filter ở server) kèm lessonIds. */
  phases: Array<PhaseInfo & { lessonIds: string[] }>;
  /** Tổng số bài học hiện có (đếm server, ổn định cho mọi render). */
  totalLessons: number;
};

export default function DashboardSidebar({ phases, totalLessons }: Props) {
  const { completedCount, getPhaseProgress } = useProgress();
  const { streakDays, bestStreak, isStreakAlive } = useStreak();

  const streakActive = isStreakAlive();
  const allCompleted = completedCount === totalLessons && totalLessons > 0;

  return (
    <>
      <div className="rounded-lg bg-teal-2 p-5 text-parchment shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold text-gold-3">
          <Sparkles size={16} />
          Tiến độ của bạn
        </h3>

        <div className="mt-4 space-y-4 text-sm">
          <ProgressBar
            value={completedCount}
            max={totalLessons}
            label={
              allCompleted
                ? "Hoàn thành toàn bộ lộ trình"
                : `Đã hoàn thành ${completedCount}/${totalLessons} bài`
            }
            tone="gold"
            onDark
          />

          {/* Streak */}
          <div className="flex items-center gap-3 rounded-md bg-ink-2/50 p-3">
            <Flame
              className={streakActive && streakDays > 0 ? "text-red-ink animate-pulse" : "text-cream-2/60"}
              size={28}
              aria-hidden
            />
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl font-semibold text-gold-3 leading-none tabular-nums">
                {streakDays}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-cream-2">
                Ngày học liên tiếp
              </div>
              {bestStreak > streakDays && (
                <div className="text-[10px] text-cream-2/80 mt-0.5">
                  Kỷ lục: {bestStreak} ngày
                </div>
              )}
            </div>
          </div>

          {/* Breakdown theo phase */}
          <ul className="space-y-1.5">
            {phases.map((phase) => {
              const pp = getPhaseProgress(phase.id, phase.lessonIds);
              return (
                <li
                  key={phase.id}
                  className="rounded-md bg-ink-2/40 px-2.5 py-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="truncate text-cream-2">
                      {phase.title.split(" — ")[0]}
                    </span>
                    <span className="shrink-0 tabular-nums text-gold-3">
                      {pp.done}/{pp.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-ink/60">
                    <div
                      className="h-full bg-gold-2 transition-[width] duration-500"
                      style={{ width: `${pp.percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-md border border-gold/40 p-3 text-xs leading-relaxed text-cream">
            <p className="font-semibold text-gold-3">
              {allCompleted ? "Chúc mừng" : "Mẹo"}
            </p>
            <p className="mt-1">
              {allCompleted
                ? "Bạn đã đi hết lộ trình. Hãy thử /la-so với ngày sinh của bản thân để xem lá số."
                : "Mỗi ngày dành 15 phút học một bài, giữ chuỗi ngày học liên tiếp để củng cố kiến thức."}
            </p>
          </div>
        </div>
      </div>

      {/* Widget Flashcards — số thẻ cần ôn hôm nay */}
      <FlashcardsWidget />

      <div className="mt-4 rounded-lg border border-gold/50 bg-cream p-4">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
          <BookMarked size={14} />
          Triết lý của app
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-ink">
          Tử Vi không phải mê tín. Đó là một hệ thống quan sát quy luật của
          người xưa — học để hiểu chính mình và môi trường xung quanh.
        </p>
      </div>

      {/* Khi đã có ít nhất 1 bài hoàn thành — hiện gợi ý dùng /la-so */}
      {completedCount >= 5 && !allCompleted && (
        <div className="mt-4 rounded-lg border border-red-ink-2/40 bg-cream-2/40 p-3 text-xs text-ink-2">
          <p className="font-semibold text-red-ink-2 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            Sẵn sàng thử thực hành?
          </p>
          <p className="mt-1">
            Bạn đã hoàn thành {completedCount} bài — hãy thử <strong>/la-so</strong>{" "}
            với ngày sinh của mình.
          </p>
        </div>
      )}
    </>
  );
}
