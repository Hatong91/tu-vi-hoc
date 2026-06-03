"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { recordStudyActivity } from "./useStreak";

export type QuizAnswerState = number | null;

export type LessonQuizState = {
  answers: QuizAnswerState[];
  correctCount: number;
  completed: boolean;
  completedAt: string | null;
};

const STORAGE_KEY = "tuvi:quiz-progress";

type AllProgress = Record<string, LessonQuizState>;

/**
 * Quản lý điểm quiz cho một bài học.
 * Truyền cả mảng `correctAnswers` để hook tự tính `correctCount` mỗi lần submit.
 */
export function useQuizProgress(lessonId: string, correctAnswers: number[]) {
  const total = correctAnswers.length;
  const { value: all, setValue: setAll, hydrated } = useLocalStorage<AllProgress>(
    STORAGE_KEY,
    {}
  );

  // Đảm bảo mảng answers luôn đủ length (phòng khi JSON đổi số câu)
  const state: LessonQuizState = useMemo(() => {
    const stored = all[lessonId];
    if (!stored) {
      return {
        answers: Array(total).fill(null),
        correctCount: 0,
        completed: false,
        completedAt: null,
      };
    }
    const answers =
      stored.answers.length === total
        ? stored.answers
        : [
            ...stored.answers,
            ...Array(Math.max(0, total - stored.answers.length)).fill(null),
          ].slice(0, total);
    // Re-tính correctCount dựa trên correctAnswers mới nhất (phòng khi JSON đổi)
    const correctCount = answers.reduce<number>(
      (acc, ans, i) => acc + (ans !== null && ans === correctAnswers[i] ? 1 : 0),
      0
    );
    const completed = answers.every((a) => a !== null);
    return {
      answers,
      correctCount,
      completed,
      completedAt: completed ? stored.completedAt : null,
    };
  }, [all, lessonId, total, correctAnswers]);

  const submit = useCallback(
    (questionIndex: number, optionIndex: number) => {
      // Ghi nhận hoạt động học vào streak (cùng ngày → no-op)
      recordStudyActivity();
      setAll((prev) => {
        const current = prev[lessonId] ?? {
          answers: Array(total).fill(null),
          correctCount: 0,
          completed: false,
          completedAt: null,
        };
        const nextAnswers = [...current.answers];
        while (nextAnswers.length < total) nextAnswers.push(null);
        nextAnswers[questionIndex] = optionIndex;

        const correctCount = nextAnswers.reduce<number>(
          (acc, ans, i) =>
            acc + (ans !== null && ans === correctAnswers[i] ? 1 : 0),
          0
        );
        const completed = nextAnswers.every((a) => a !== null);

        return {
          ...prev,
          [lessonId]: {
            answers: nextAnswers,
            correctCount,
            completed,
            completedAt: completed
              ? current.completedAt ?? new Date().toISOString()
              : null,
          },
        };
      });
    },
    [lessonId, setAll, total, correctAnswers]
  );

  const reset = useCallback(() => {
    setAll((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });
  }, [lessonId, setAll]);

  return {
    answers: state.answers,
    correctCount: state.correctCount,
    completed: state.completed,
    completedAt: state.completedAt,
    submit,
    reset,
    hydrated,
  };
}
