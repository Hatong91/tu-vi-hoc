import Link from "next/link";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import LessonCard from "@/components/LessonCard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { PHASE_ROADMAP, getLessonsByPhase } from "@/lib/lessons";

export default function Home() {
  const availablePhases = PHASE_ROADMAP.filter((p) => p.available);
  const totalAvailableLessons = availablePhases.reduce(
    (sum, p) => sum + getLessonsByPhase(p.id).length,
    0
  );
  // Truyền lessonIds xuống client component để tránh re-fetch JSON ở client
  const phasesWithLessonIds = availablePhases.map((p) => ({
    ...p,
    lessonIds: getLessonsByPhase(p.id).map((l) => l.id),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_300px]">
        {/* CỘT TRÁI — nền parchment, nội dung chính */}
        <main className="space-y-10">
          <Hero />

          {/* Lộ trình 4 giai đoạn */}
          <section aria-labelledby="roadmap">
            <header className="mb-4 flex items-baseline justify-between">
              <h2
                id="roadmap"
                className="font-display text-2xl font-semibold text-ink"
              >
                Lộ trình học
              </h2>
              <span className="text-sm text-ink-2">4 giai đoạn · ~12 tuần</span>
            </header>

            <ol className="space-y-3">
              {PHASE_ROADMAP.map((p, idx) => (
                <PhaseRow key={p.id} phase={p} index={idx} />
              ))}
            </ol>
          </section>

          {/* Bài học theo từng giai đoạn available */}
          {availablePhases.map((phase) => {
            const lessons = getLessonsByPhase(phase.id);
            if (lessons.length === 0) return null;
            return (
              <section
                key={phase.id}
                aria-labelledby={`lessons-${phase.id}`}
              >
                <header className="mb-4 flex items-baseline justify-between gap-3">
                  <h2
                    id={`lessons-${phase.id}`}
                    className="font-display text-2xl font-semibold text-ink"
                  >
                    {phase.title}
                  </h2>
                  <span className="shrink-0 text-sm text-ink-2">
                    {lessons.length} bài
                  </span>
                </header>
                <div className="space-y-3">
                  {lessons.map((lesson, i) => (
                    <LessonCard key={lesson.id} lesson={lesson} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* CỘT PHẢI — sidebar teal2 (thống kê + streak thật) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DashboardSidebar
            phases={phasesWithLessonIds}
            totalLessons={totalAvailableLessons}
          />
        </aside>
      </div>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden rounded-xl border border-gold/50 bg-cream p-6 shadow-sm md:p-8">
      <div className="flex items-start gap-2">
        <span className="font-deco text-3xl leading-none text-red-ink-2">
          問
        </span>
        <p className="text-xs uppercase tracking-[0.25em] text-ink-3">
          Học Tử Vi Đẩu Số
        </p>
      </div>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
        Từ <span className="text-red-ink-2">Âm dương — Ngũ hành</span>
        <br />
        đến đọc được một lá số
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
        Lộ trình 4 giai đoạn — học từ nền tảng triết học đến công cụ lập lá số.
        Có sơ đồ tương tác, quiz tự chấm và FAQ cho mọi câu hỏi thường gặp.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/learn/am-duong"
          className="inline-flex items-center gap-2 rounded-md bg-red-ink-2 px-5 py-2.5 text-sm font-semibold text-parchment shadow-sm transition hover:bg-red-ink"
        >
          Bắt đầu bài đầu tiên
        </Link>
        <a
          href="#roadmap"
          className="inline-flex items-center gap-2 rounded-md border border-ink-2/40 bg-parchment px-5 py-2.5 text-sm font-semibold text-ink-2 transition hover:border-ink-2"
        >
          Xem lộ trình
        </a>
      </div>
    </section>
  );
}

function PhaseRow({
  phase,
  index,
}: {
  phase: (typeof PHASE_ROADMAP)[number];
  index: number;
}) {
  const available = phase.available;
  return (
    <li
      className={`flex items-start gap-4 rounded-lg border p-4 transition ${
        available
          ? "border-gold/60 bg-cream hover:border-red-ink-2"
          : "border-ink-3/30 bg-cream/70"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${
          available
            ? "border-2 border-red-ink-2 bg-parchment text-red-ink-2"
            : "border-2 border-ink-3/50 bg-cream text-ink-2"
        }`}
      >
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3
            className={`font-display text-base font-semibold ${
              available ? "text-ink" : "text-ink-2"
            }`}
          >
            {phase.title}
          </h3>
          {!available && (
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-ink-2">
              <Lock size={12} />
              Sắp ra mắt
            </span>
          )}
        </div>
        <p className={`text-sm ${available ? "text-ink-2" : "text-ink-2"}`}>
          {phase.subtitle}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">
          {phase.summary}
        </p>
      </div>
    </li>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-cream py-6 text-center text-xs text-ink-2">
      <p>
        <span className="font-deco text-base text-red-ink-2">命</span> Tử Vi Học
        — Học offline, miễn phí. Nội dung được soạn theo phong cách kể chuyện,
        ví dụ thực tế.
      </p>
    </footer>
  );
}
