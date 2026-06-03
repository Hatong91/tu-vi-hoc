"use client";

import { Check } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

/**
 * Hiển thị badge "Đã hoàn thành" trên LessonCard hoặc bất kỳ chỗ nào.
 * - Nhỏ gọn, chỉ render khi quiz của bài đã completed.
 */
export default function CompletedStamp({
  lessonId,
  totalQuestions,
}: {
  lessonId: string;
  totalQuestions: number;
}) {
  const { getLessonStatus } = useProgress();
  const status = getLessonStatus(lessonId, totalQuestions);
  if (!status.completed) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-teal-2 px-2 py-0.5 text-[10px] font-semibold text-parchment"
      title={`Đã trả lời đúng ${status.correctCount}/${status.totalQuestions}`}
    >
      <Check size={10} aria-hidden />
      Hoàn thành · {status.correctCount}/{status.totalQuestions}
    </span>
  );
}
