import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import LaSoForm from "@/components/LaSoForm";

export const metadata: Metadata = {
  title: "Lập lá số Tử Vi — Tử Vi Học",
  description:
    "Công cụ lập lá số Tử Vi cơ bản: tra can chi, nạp âm, cung Mệnh, cung Thân và an 12 cung. Hoàn toàn miễn phí, chạy offline.",
};

export default function LaSoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 animate-page-in">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-2 hover:text-red-ink-2"
        >
          <ChevronLeft size={16} />
          Quay về trang chủ
        </Link>

        <header className="mb-6">
          <div className="flex items-baseline gap-2 text-xs uppercase tracking-[0.25em] text-ink-2">
            <span className="font-deco text-base text-red-ink-2">氣</span>
            Công cụ
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            Lập lá số Tử Vi cơ bản
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-2">
            Nhập ngày tháng năm + giờ sinh + giới tính. Hệ thống an tự động{" "}
            <strong className="text-ink">67 sao</strong> trên bàn lá số: 14 chính
            tinh + 13 phụ tinh chính + Vòng Tràng Sinh + Vòng Bác Sĩ + Vòng Thái
            Tuế + 15 đào hoa/quý/hung + Tuần/Triệt + Đại Vận hiện tại + Tứ Hóa
            năm. Bấm vào mỗi cung để xem ý nghĩa chi tiết.
          </p>
        </header>

        <LaSoForm />
      </main>

      <footer className="border-t border-gold/40 bg-cream py-6 text-center text-xs text-ink-2">
        <p>
          <span className="font-deco text-base text-red-ink-2">命</span> Lá số
          tính toàn bộ trên trình duyệt — không gửi dữ liệu đi đâu.
        </p>
      </footer>
    </div>
  );
}
