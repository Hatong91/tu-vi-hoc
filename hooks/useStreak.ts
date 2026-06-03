"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const STREAK_KEY = "tuvi:study-meta";

export type StudyMeta = {
  /** ISO date (YYYY-MM-DD) ngày học gần nhất. */
  lastStudyDate: string | null;
  /** Số ngày liên tiếp đã học. */
  streakDays: number;
  /** Ngày học dài nhất từ trước đến nay (record). */
  bestStreak: number;
};

const DEFAULT_META: StudyMeta = {
  lastStudyDate: null,
  streakDays: 0,
  bestStreak: 0,
};

/** Chuyển Date sang YYYY-MM-DD theo local timezone (không UTC). */
function toLocalDateString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Số ngày giữa 2 chuỗi YYYY-MM-DD (ngày sau − ngày trước). */
function daysBetween(a: string, b: string): number {
  const dA = new Date(a + "T00:00:00");
  const dB = new Date(b + "T00:00:00");
  return Math.round((dB.getTime() - dA.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * Hook quản lý chuỗi ngày học liên tiếp.
 * - `recordActivity()` gọi khi người dùng có hoạt động học (vd trả lời quiz).
 * - Tự cộng nếu cách hôm trước 1 ngày, reset về 1 nếu cách > 1 ngày.
 * - Không thay đổi gì nếu là cùng ngày.
 */
export function useStreak() {
  const { value: meta, setValue: setMeta } = useLocalStorage<StudyMeta>(
    STREAK_KEY,
    DEFAULT_META
  );

  const recordActivity = useCallback(() => {
    const today = toLocalDateString(new Date());
    setMeta((prev) => {
      if (prev.lastStudyDate === today) return prev; // cùng ngày, không đổi

      let nextStreak: number;
      if (!prev.lastStudyDate) {
        nextStreak = 1;
      } else {
        const diff = daysBetween(prev.lastStudyDate, today);
        if (diff === 1) nextStreak = prev.streakDays + 1;
        else if (diff > 1) nextStreak = 1; // bỏ ngày → reset
        else return prev; // sai logic (today < lastStudyDate) — giữ nguyên
      }

      return {
        lastStudyDate: today,
        streakDays: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
      };
    });
  }, [setMeta]);

  /**
   * Kiểm tra streak hiện tại còn "sống" hay không.
   * Nếu hôm nay đã qua mà chưa học, streak có thể bị break ngày mai.
   * Trả về `true` nếu streak vẫn đang còn (last study là hôm qua hoặc hôm nay).
   */
  const isStreakAlive = useCallback((): boolean => {
    if (!meta.lastStudyDate) return false;
    const today = toLocalDateString(new Date());
    const diff = daysBetween(meta.lastStudyDate, today);
    return diff <= 1;
  }, [meta.lastStudyDate]);

  return {
    streakDays: meta.streakDays,
    bestStreak: meta.bestStreak,
    lastStudyDate: meta.lastStudyDate,
    recordActivity,
    isStreakAlive,
  };
}

/**
 * Function-only API để gọi từ ngoài hook (vd inside submit callback).
 * Đọc + ghi localStorage trực tiếp — không cần React.
 */
export function recordStudyActivity(): void {
  if (typeof window === "undefined") return;
  const today = toLocalDateString(new Date());
  let meta: StudyMeta;
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    meta = raw ? (JSON.parse(raw) as StudyMeta) : DEFAULT_META;
  } catch {
    meta = DEFAULT_META;
  }

  if (meta.lastStudyDate === today) return;

  let nextStreak: number;
  if (!meta.lastStudyDate) {
    nextStreak = 1;
  } else {
    const diff = daysBetween(meta.lastStudyDate, today);
    if (diff === 1) nextStreak = meta.streakDays + 1;
    else if (diff > 1) nextStreak = 1;
    else return;
  }

  const next: StudyMeta = {
    lastStudyDate: today,
    streakDays: nextStreak,
    bestStreak: Math.max(meta.bestStreak, nextStreak),
  };
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    // Phát sự kiện để các hook useLocalStorage trên cùng tab cập nhật
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STREAK_KEY,
        newValue: JSON.stringify(next),
      })
    );
  } catch {
    // ignore
  }
}
