import { Bookmark } from "lucide-react";

export type QuickRecallData = {
  /** Tiêu đề tuỳ chọn — mặc định "MANG VỀ — Điểm cốt lõi" */
  title?: string;
  /** 3-5 điểm cốt lõi — string có thể chứa **bold** */
  points: string[];
  /** Câu vần ngắn để nhớ — tuỳ chọn */
  mnemonic?: string;
  /** Ví dụ ứng dụng thực tế 1 dòng — tuỳ chọn */
  example?: string;
};

/**
 * Hộp tổng kết cuối bài — "5 điểm mang về sau bài này".
 *
 * Render ở phía DƯỚI Quiz, TRƯỚC FAQ (vị trí mắt nhìn cuối cùng).
 * Mục đích: giúp não giữ lại core takeaway.
 *
 * Best practices áp dụng:
 *  - "Magic number 7" → giới hạn 3-5 điểm
 *  - Mnemonic device (rhyme) → giúp recall lâu hơn
 *  - Concrete example → kết nối với thực tế
 */
export default function QuickRecall({ data }: { data: QuickRecallData }) {
  const title = data.title ?? "MANG VỀ — Điểm cốt lõi";
  return (
    <aside
      className="mt-12 overflow-hidden rounded-lg border-2 border-red-ink-2 bg-cream shadow-sm"
      aria-labelledby="quick-recall-heading"
    >
      {/* Header đỏ son */}
      <header className="flex items-center gap-2 bg-red-ink-2 px-4 py-2.5 text-parchment">
        <Bookmark size={16} fill="currentColor" />
        <h2
          id="quick-recall-heading"
          className="font-display text-sm font-semibold uppercase tracking-[0.2em]"
        >
          {title}
        </h2>
      </header>

      <div className="px-5 py-5 sm:px-6">
        {/* Danh sách điểm cốt lõi */}
        <ol className="space-y-2.5" role="list">
          {data.points.map((point, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-red-ink-2 bg-parchment font-display text-xs font-bold text-red-ink-2">
                {i + 1}
              </span>
              <BoldText
                text={point}
                className="flex-1 text-sm leading-relaxed text-ink-2"
              />
            </li>
          ))}
        </ol>

        {/* Mnemonic */}
        {data.mnemonic && (
          <div className="mt-5 rounded-md border-l-4 border-gold-2 bg-gold-2/12 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-2">
              🎵 Vần thuộc lòng
            </div>
            <p className="mt-1 font-display text-base font-semibold leading-snug text-ink">
              {data.mnemonic}
            </p>
          </div>
        )}

        {/* Example */}
        {data.example && (
          <div className="mt-3 rounded-md border-l-4 border-teal-2 bg-teal-2/8 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-2">
              💡 Ví dụ thực tế
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              {data.example}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

/** Render **bold** trong text */
function BoldText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
