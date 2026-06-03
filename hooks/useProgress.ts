"use client";

import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { LessonQuizState } from "./useQuizProgress";

const STORAGE_KEY = "tuvi:quiz-progress";

type AllProgress = Record<string, LessonQuizState>;

export type LessonStatus = {
  lessonId: string;
  completed: boolean;
  correctCount: number;
  totalQuestions: number;
  percent: number;
  completedAt: string | null;
};

export type PhaseProgress = {
  phaseId: string;
  done: number;
  total: number;
  percent: number;
};

/**
 * Đọc tiến độ quiz từ localStorage (dùng chung key với useQuizProgress).
 * Không sửa được — chỉ đọc. Để ghi, dùng useQuizProgress.
 */
export function useProgress() {
  const { value: all } = useLocalStorage<AllProgress>(STORAGE_KEY, {});

  return useMemo(() => {
    const entries = Object.entries(all);
    const completedCount = entries.filter(([, v]) => v.completed).length;
    const totalQuestionsAnswered = entries.reduce(
      (sum, [, v]) => sum + v.answers.filter((a) => a !== null).length,
      0
    );
    const totalCorrect = entries.reduce(
      (sum, [, v]) => sum + v.correctCount,
      0
    );

    /** Trả về trạng thái 1 bài học. */
    function getLessonStatus(lessonId: string, totalQuestions: number): LessonStatus {
      const v = all[lessonId];
      if (!v) {
        return {
          lessonId,
          completed: false,
          correctCount: 0,
          totalQuestions,
          percent: 0,
          completedAt: null,
        };
      }
      const answered = v.answers.filter((a) => a !== null).length;
      return {
        lessonId,
        completed: v.completed,
        correctCount: v.correctCount,
        totalQuestions,
        percent: totalQuestions === 0 ? 0 : Math.round((answered / totalQuestions) * 100),
        completedAt: v.completedAt,
      };
    }

    /** Trả về tỉ lệ hoàn thành theo phase. */
    function getPhaseProgress(
      phaseId: string,
      lessonIds: string[]
    ): PhaseProgress {
      const done = lessonIds.filter((id) => all[id]?.completed).length;
      return {
        phaseId,
        done,
        total: lessonIds.length,
        percent: lessonIds.length === 0 ? 0 : Math.round((done / lessonIds.length) * 100),
      };
    }

    return {
      completedCount,
      totalAnswered: totalQuestionsAnswered,
      totalCorrect,
      raw: all,
      getLessonStatus,
      getPhaseProgress,
    };
  }, [all]);
}
