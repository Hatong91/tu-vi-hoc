import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import VisualBlock from "@/components/VisualBlock";
import QuizBlock from "@/components/QuizBlock";
import FAQ from "@/components/FAQ";
import QuickRecall from "@/components/QuickRecall";
import { getAllLessons, getLessonBySlug } from "@/lib/lessons";
import type { ContentChunk } from "@/lib/types";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.slug }));
}

/** Bỏ markdown bold ** + cắt cho description meta */
function plainExcerpt(s: string, max = 160): string {
  const stripped = s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\s+/g, " ").trim();
  return stripped.length <= max ? stripped : stripped.slice(0, max - 1) + "…";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return { title: "Không tìm thấy bài học | Tử Vi Học" };
  }
  const title = `${lesson.title} | Tử Vi Học`;
  const description = plainExcerpt(lesson.story_hook);
  const url = `/learn/${lesson.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Tử Vi Học",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      "Tử Vi",
      "Tử Vi Đẩu Số",
      `Module ${lesson.module}`,
      lesson.title,
    ],
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 animate-page-in">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-2 hover:text-red-ink-2"
        >
          <ChevronLeft size={16} />
          Quay về trang chủ
        </Link>

        {/* Header bài */}
        <header className="border-b border-gold/40 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-teal-2 px-2.5 py-0.5 text-parchment">
              Module {lesson.module} · Bài {lesson.order}
            </span>
            <span className="inline-flex items-center gap-1 text-ink-2">
              <Clock size={12} />
              {lesson.duration_minutes} phút đọc
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            {lesson.title}
          </h1>

          {/* Story hook — câu chuyện dẫn dắt */}
          <div className="mt-5 rounded-md border-l-4 border-teal-2 bg-cream-2/50 p-4">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-2">
              <span className="font-deco text-base text-red-ink-2">問</span>
              Câu hỏi mở đầu
            </div>
            <p className="text-base leading-relaxed text-ink-2">
              {lesson.story_hook}
            </p>
          </div>

          {/* Key metaphor */}
          <div className="mt-3 rounded-md bg-parchment p-4 ring-1 ring-gold/40">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
              Ví dụ cốt lõi
            </div>
            <p className="text-sm leading-relaxed text-ink-2">
              {lesson.key_metaphor}
            </p>
          </div>
        </header>

        {/* Nội dung sections */}
        <article className="prose-tuvi mt-8 space-y-10">
          {lesson.content.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl font-semibold text-ink">
                {section.title}
              </h2>
              <RichBody body={section.body} className="mt-2 text-base leading-relaxed text-ink-2" />

              {section.chunks.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {section.chunks.map((chunk, j) => (
                    <ChunkItem key={j} chunk={chunk} />
                  ))}
                </ul>
              )}

              {section.visual && <VisualBlock visual={section.visual} />}
            </section>
          ))}
        </article>

        {/* Quiz — tự chấm điểm + lưu localStorage + toast khi hoàn thành */}
        <QuizBlock
          lessonId={lesson.id}
          quiz={lesson.quiz}
          nextLesson={getNextLesson(lesson.slug)}
        />

        {/* Quick Recall — hộp "mang về" 3-5 điểm cốt lõi (tuỳ chọn) */}
        {lesson.quick_recall && <QuickRecall data={lesson.quick_recall} />}

        {/* FAQ — accordion có search */}
        <div className="mt-8">
          <FAQ items={lesson.faq} />
        </div>

        {/* Điều hướng */}
        <NavPrevNext currentSlug={lesson.slug} />
      </main>
    </div>
  );
}

function ChunkItem({ chunk }: { chunk: ContentChunk }) {
  const styles: Record<ContentChunk["type"], { label: string; className: string }> = {
    definition: {
      label: "Khái niệm",
      className: "border-l-teal-2 bg-cream/70",
    },
    example: {
      label: "Ví dụ",
      className: "border-l-gold-2 bg-cream/70",
    },
    application: {
      label: "Ứng dụng",
      className: "border-l-teal-3 bg-cream/70",
    },
    note: {
      label: "Lưu ý",
      className: "border-l-red-ink-2 bg-cream-2/40",
    },
  };
  const s = styles[chunk.type];
  return (
    <li className={`rounded-r-md border-l-4 px-3 py-2 ${s.className}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-2">
        {s.label}
      </div>
      <RichBody body={chunk.text} className="mt-0.5 text-sm leading-relaxed text-ink-2" />
    </li>
  );
}

/** Hỗ trợ in đậm bằng cú pháp **bold** trong JSON — đơn giản, không cần markdown lib */
function RichBody({ body, className }: { body: string; className?: string }) {
  const parts = body.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function getNextLesson(currentSlug: string): { slug: string; title: string } | undefined {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === currentSlug);
  if (idx === -1 || idx === all.length - 1) return undefined;
  const next = all[idx + 1];
  return { slug: next.slug, title: next.title };
}

function NavPrevNext({ currentSlug }: { currentSlug: string }) {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === currentSlug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <nav className="mt-12 flex flex-col gap-3 border-t border-gold/40 pt-6 sm:flex-row sm:justify-between">
      {prev ? (
        <Link
          href={`/learn/${prev.slug}`}
          className="rounded-md border border-gold/50 bg-cream p-3 text-sm transition hover:border-red-ink-2 sm:max-w-[45%]"
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-2">
            ← Bài trước
          </div>
          <div className="mt-0.5 font-display font-semibold text-ink">
            {prev.title}
          </div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/learn/${next.slug}`}
          className="rounded-md border border-gold/50 bg-cream p-3 text-right text-sm transition hover:border-red-ink-2 sm:max-w-[45%]"
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-2">
            Bài tiếp theo →
          </div>
          <div className="mt-0.5 font-display font-semibold text-ink">
            {next.title}
          </div>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
