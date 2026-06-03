import Link from "next/link";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import type { Lesson } from "@/lib/types";
import CompletedStamp from "./CompletedStamp";

type Props = {
  lesson: Lesson;
  index: number;
};

export default function LessonCard({ lesson, index }: Props) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="group block rounded-lg border border-gold/50 bg-cream p-5 transition hover:border-red-ink-2 hover:shadow-md focus-visible:outline-2 focus-visible:outline-red-ink-2"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold-2 bg-parchment font-display text-lg font-semibold text-ink-2">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-2">
            <span className="rounded-full bg-teal-2 px-2 py-0.5 text-parchment">
              Module {lesson.module}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {lesson.duration_minutes} phút
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen size={12} />
              {lesson.content.sections.length} phần · {lesson.quiz.length} câu hỏi
            </span>
            <CompletedStamp lessonId={lesson.id} totalQuestions={lesson.quiz.length} />
          </div>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink transition group-hover:text-red-ink-2">
            {lesson.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-2">
            {lesson.story_hook.replace(/\*\*/g, "")}
          </p>
        </div>
        <ArrowRight
          size={20}
          className="mt-2 shrink-0 text-gold transition group-hover:translate-x-0.5 group-hover:text-red-ink-2"
        />
      </div>
    </Link>
  );
}
