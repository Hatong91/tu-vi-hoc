import { Music } from "lucide-react";

export type MnemonicData = {
  /** Chữ Hán/decoration ở góc — 1 ký tự */
  han?: string;
  /** Tiêu đề ngắn — ví dụ "Vần ngũ hành tương sinh" */
  title: string;
  /** Câu thần chú/vần luật — hiển thị to. Mỗi dòng = 1 phần tử array */
  lines: string[];
  /** Ghi chú phụ — giải thích nhịp/cách đọc/mẹo nhớ */
  hint?: string;
};

/**
 * Hộp "câu thần chú" — vần luật dễ thuộc lòng.
 * Mục đích: học sinh đọc to → não ghi nhớ nhịp + vần → nhớ lâu hơn 5×.
 *
 * Phong cách: nền cream-2 (giấy cổ), border vàng đồng dày, chữ Hán to,
 * dòng vần luật font-display lớn — gợi cảm giác "câu kinh".
 */
export default function MnemonicCard({ data }: { data: MnemonicData }) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border-2 border-gold-2 bg-cream-2/40 shadow-sm">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-gold/40 bg-gold-2/15 px-4 py-2">
        <Music size={14} className="text-red-ink-2" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-2">
          Câu thần chú — đọc to để nhớ
        </div>
      </header>

      <div className="relative px-5 py-6 sm:px-8 sm:py-7">
        {/* Chữ Hán watermark — to mờ phía sau */}
        {data.han && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none font-deco text-[140px] leading-none text-red-ink-2/8 sm:text-[180px]"
          >
            {data.han}
          </div>
        )}

        {/* Tiêu đề */}
        <h4 className="relative font-display text-sm font-semibold uppercase tracking-wider text-ink-2">
          {data.title}
        </h4>

        {/* Vần luật — chữ to, font-display */}
        <div className="relative mt-3 space-y-1.5">
          {data.lines.map((line, i) => (
            <p
              key={i}
              className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Hint */}
        {data.hint && (
          <p className="relative mt-4 border-t border-gold/40 pt-3 text-xs italic leading-relaxed text-ink-2">
            💡 {data.hint}
          </p>
        )}
      </div>
    </figure>
  );
}
