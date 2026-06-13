/* ============================================================
 *  Spaced Repetition System — Flashcards (Anki-style)
 *
 *  Auto-gen flashcards từ quick_recall của 36 bài học:
 *    - 1 card vần thuộc (mnemonic)
 *    - 2 card cốt lõi (2 points đầu tiên)
 *    - 1 card ví dụ thực tế (nếu có)
 *  Tổng: ~140 cards.
 *
 *  Thuật toán SM-2 đơn giản hóa:
 *    - again: reset interval = 1, ease giảm 0.2
 *    - hard:  interval × 1.2, ease giảm 0.15
 *    - good:  interval × ease (lần đầu = 1, lần 2 = 3)
 *    - easy:  interval × ease × 1.3, ease tăng 0.15
 *
 *  Tham khảo: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 * ============================================================ */

import { getAllLessons } from "./lessons";

export type CardState = "new" | "learning" | "review" | "mature";
export type CardRating = "again" | "hard" | "good" | "easy";
export type CardType = "mnemonic" | "point" | "example";

export type Flashcard = {
  id: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  module: string;
  front: string;
  back: string;
  type: CardType;
};

export type CardProgress = {
  cardId: string;
  ease: number; // 2.5 default, [1.3, 3.0]
  interval: number; // số ngày đến lần ôn kế
  reviewCount: number;
  lastReview: string | null;
  nextReview: string; // ISO date
  state: CardState;
};

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const MAX_INTERVAL = 365; // cap 1 năm

/** Strip Markdown bold/italic để hiển thị trong front question */
function plainHeadline(text: string, max = 80): string {
  const stripped = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length <= max ? stripped : stripped.slice(0, max - 1) + "…";
}

/** Tạo toàn bộ flashcards từ quick_recall của các bài. */
export function generateAllFlashcards(): Flashcard[] {
  const lessons = getAllLessons();
  const cards: Flashcard[] = [];

  for (const lesson of lessons) {
    if (!lesson.quick_recall) continue;
    const qr = lesson.quick_recall;

    // 1. Mnemonic — vần thuộc lòng (quan trọng nhất)
    if (qr.mnemonic) {
      cards.push({
        id: `${lesson.id}-mnemonic`,
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        module: lesson.module,
        front: `🎵 Vần thuộc lòng cho bài \"${lesson.title}\"?`,
        back: qr.mnemonic,
        type: "mnemonic",
      });
    }

    // 2. Top 2 cốt lõi
    qr.points.slice(0, 2).forEach((point, i) => {
      // Lấy headline từ bold đầu tiên
      const boldMatch = point.match(/\*\*([^*]+?)\*\*/);
      const headline = boldMatch
        ? boldMatch[1].replace(/:$/, "").trim()
        : `Cốt lõi ${i + 1}`;

      cards.push({
        id: `${lesson.id}-point-${i}`,
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        module: lesson.module,
        front: `💡 ${plainHeadline(headline, 60)} là gì?`,
        back: point,
        type: "point",
      });
    });

    // 3. Ví dụ thực tế
    if (qr.example) {
      cards.push({
        id: `${lesson.id}-example`,
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        module: lesson.module,
        front: `📌 Cho 1 ví dụ thực tế từ bài \"${lesson.title}\"?`,
        back: qr.example,
        type: "example",
      });
    }
  }

  return cards;
}

/** Khởi tạo progress mặc định cho 1 card mới — sẵn sàng review ngay. */
export function newProgress(cardId: string): CardProgress {
  const now = new Date().toISOString();
  return {
    cardId,
    ease: DEFAULT_EASE,
    interval: 0,
    reviewCount: 0,
    lastReview: null,
    nextReview: now,
    state: "new",
  };
}

/**
 * Áp dụng SM-2 đơn giản hóa: cập nhật progress sau khi user đánh giá.
 * Trả về progress mới (immutable).
 */
export function reviewCard(
  progress: CardProgress,
  rating: CardRating
): CardProgress {
  let { ease, interval } = progress;
  const reviewCount = progress.reviewCount;

  switch (rating) {
    case "again":
      ease = Math.max(MIN_EASE, ease - 0.2);
      interval = 1;
      break;
    case "hard":
      ease = Math.max(MIN_EASE, ease - 0.15);
      interval = Math.max(1, Math.round(Math.max(interval, 1) * 1.2));
      break;
    case "good":
      if (reviewCount === 0) interval = 1;
      else if (reviewCount === 1) interval = 3;
      else interval = Math.round(interval * ease);
      break;
    case "easy":
      ease = Math.min(MAX_EASE, ease + 0.15);
      if (reviewCount === 0) interval = 4;
      else interval = Math.round(interval * ease * 1.3);
      break;
  }

  interval = Math.min(MAX_INTERVAL, interval);

  const now = new Date();
  const next = new Date(now.getTime() + interval * 86400000);

  let state: CardState;
  if (interval >= 21) state = "mature";
  else if (interval >= 7) state = "review";
  else state = "learning";

  return {
    cardId: progress.cardId,
    ease,
    interval,
    reviewCount: reviewCount + 1,
    lastReview: now.toISOString(),
    nextReview: next.toISOString(),
    state,
  };
}

/** Card có đến hạn ôn không? */
export function isCardDue(
  progress: CardProgress,
  now: Date = new Date()
): boolean {
  return new Date(progress.nextReview).getTime() <= now.getTime();
}

/** Map nhãn rating sang tiếng Việt cho UI */
export const RATING_LABELS: Record<CardRating, string> = {
  again: "Quên",
  hard: "Khó",
  good: "Nhớ",
  easy: "Dễ",
};

/** Map nhãn state sang tiếng Việt cho UI */
export const STATE_LABELS: Record<CardState, string> = {
  new: "Mới",
  learning: "Đang học",
  review: "Ôn tập",
  mature: "Thành thạo",
};
