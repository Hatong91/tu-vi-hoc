import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import FlashcardReview from "@/components/FlashcardReview";
import { generateAllFlashcards } from "@/lib/flashcards";

export const metadata: Metadata = {
  title: "Flashcards — Ôn tập nhớ lâu | Tử Vi Học",
  description:
    "Học thuộc kiến thức Tử Vi với hệ thống thẻ ôn tập theo phương pháp Spaced Repetition (như Anki). Tự đánh giá độ nhớ, app lập lịch ôn vào đúng thời điểm sắp quên.",
};

/** Trang ôn tập flashcards — gen cards ở build time, review ở client. */
export default function FlashcardsPage() {
  const cards = generateAllFlashcards();

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 animate-page-in">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-2 hover:text-red-ink-2"
        >
          <ChevronLeft size={16} />
          Quay về trang chủ
        </Link>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink-2">
            <Brain size={14} className="text-red-ink-2" />
            Ôn tập
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            Flashcards — Nhớ lâu kiến thức
          </h1>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-2">
            Hệ thống <strong className="text-ink">Spaced Repetition</strong>{" "}
            (như Anki) — bạn tự đánh giá độ nhớ, app lập lịch ôn vào thời điểm
            <strong className="text-ink"> sắp quên</strong>. Càng ôn đều, càng
            nhớ lâu. Tất cả lưu trên trình duyệt, không cần đăng nhập.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 rounded-md border-l-4 border-teal-2 bg-cream-2/40 p-4 text-xs">
            <Info label="Auto-gen" value={`${cards.length} thẻ`} sub="từ 36 bài" />
            <Info label="Thẻ mới mỗi ngày" value="10" sub="tránh quá tải" />
            <Info label="Lưu trữ" value="Local" sub="không backend" />
          </div>
        </header>

        <FlashcardReview cards={cards} />

        {/* Hint cách dùng */}
        <section className="mt-10 rounded-md border border-gold/40 bg-cream/70 p-5">
          <h2 className="font-display text-base font-semibold text-ink">
            🎓 4 nút đánh giá — chọn theo cảm nhận thực
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
            <li>
              <strong className="text-red-ink-2">Quên</strong> — bí, không nhớ
              gì. App sẽ hỏi lại sau <strong>1 ngày</strong>.
            </li>
            <li>
              <strong className="text-gold">Khó</strong> — nhớ nhưng phải nghĩ
              lâu. Hỏi lại sau <strong>~3 ngày</strong>.
            </li>
            <li>
              <strong className="text-teal-2">Nhớ</strong> — nhớ ngay không
              khó. Hỏi lại sau <strong>~7 ngày</strong>.
            </li>
            <li>
              <strong className="text-ink">Dễ</strong> — quá đơn giản với bạn.
              Hỏi lại sau <strong>~14+ ngày</strong>.
            </li>
          </ul>
          <p className="mt-3 text-xs italic text-ink-2">
            💡 Khoảng cách ôn tăng dần theo cấp số nhân — đó là bí quyết của{" "}
            <strong>Spaced Repetition</strong>. Càng tự đánh giá đúng → app
            càng tối ưu lịch ôn cho riêng bạn.
          </p>
        </section>
      </main>

      <footer className="border-t border-gold/40 bg-cream py-6 text-center text-xs text-ink-2">
        <p>
          <span className="font-deco text-base text-red-ink-2">記</span> Tử Vi
          Học — Flashcards lưu local, an toàn riêng tư.
        </p>
      </footer>
    </div>
  );
}

function Info({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-ink-2">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-bold text-red-ink-2">
        {value}
      </div>
      <div className="text-[10px] italic text-ink-2">{sub}</div>
    </div>
  );
}
