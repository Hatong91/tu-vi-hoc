"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Search, ChevronRight, HelpCircle, X } from "lucide-react";
import type { FaqItem } from "@/lib/types";

type Props = {
  items: FaqItem[];
  /** Hiển thị ô tìm kiếm khi >= ngưỡng này. Mặc định 4. */
  searchThreshold?: number;
};

/** Bỏ dấu tiếng Việt + lowercase để tìm kiếm không phụ thuộc dấu. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

export default function FAQ({ items, searchThreshold = 4 }: Props) {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());

  const showSearch = items.length >= searchThreshold;

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return items.map((item, i) => ({ item, originalIndex: i }));
    return items
      .map((item, i) => ({ item, originalIndex: i }))
      .filter(
        ({ item }) =>
          normalize(item.question).includes(q) || normalize(item.answer).includes(q)
      );
  }, [items, query]);

  function toggle(idx: number) {
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <section aria-labelledby="faq-heading">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="faq-heading"
          className="flex items-center gap-2 font-display text-xl font-semibold text-ink"
        >
          <HelpCircle size={20} className="text-teal-2" />
          Câu hỏi thường gặp
        </h2>
        <span className="text-sm text-ink-2">
          {items.length} câu{query && ` · ${filtered.length} kết quả`}
        </span>
      </header>

      {showSearch && (
        <div className="relative mb-3">
          <Search
            size={14}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong FAQ — gõ không cần dấu cũng được"
            className="w-full rounded-md border border-gold/50 bg-parchment py-2 pl-9 pr-9 text-sm text-ink placeholder:text-ink-2/70 focus:border-red-ink-2 focus:outline-none"
            aria-label="Tìm trong câu hỏi thường gặp"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Xóa tìm kiếm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-2 hover:bg-cream-2"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-gold/60 bg-cream/70 p-6 text-center text-sm text-ink-2">
          Không có câu hỏi nào khớp với <strong>&ldquo;{query}&rdquo;</strong>.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(({ item, originalIndex }) => {
            const open = openIdx.has(originalIndex);
            return (
              <li
                key={originalIndex}
                className="overflow-hidden rounded-md border border-gold/50 bg-cream"
              >
                <button
                  type="button"
                  onClick={() => toggle(originalIndex)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-cream-2/50"
                >
                  <ChevronRight
                    size={16}
                    aria-hidden
                    className={clsx(
                      "mt-0.5 shrink-0 text-gold transition-transform",
                      open && "rotate-90"
                    )}
                  />
                  <span className="flex-1 font-display text-sm font-semibold leading-snug text-ink">
                    <Highlight text={item.question} query={query} />
                  </span>
                </button>
                <div
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gold/30 bg-parchment px-4 py-3 pl-10 text-sm leading-relaxed text-ink-2">
                      <RichAnswer text={item.answer} query={query} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Highlight đoạn khớp với query trong text — bỏ dấu để so. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const nText = normalize(text);
  const nQuery = normalize(query.trim());
  const idx = nText.indexOf(nQuery);
  if (idx === -1) return <>{text}</>;
  // Tìm đoạn tương ứng trong text gốc — vì normalize không đổi độ dài (chỉ bỏ dấu)
  // nên cùng index/length vẫn dùng được.
  const len = nQuery.length;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-gold-3/60 px-0.5 text-ink">
        {text.slice(idx, idx + len)}
      </mark>
      {text.slice(idx + len)}
    </>
  );
}

/** Render answer với hỗ trợ in đậm **bold** và highlight query */
function RichAnswer({ text, query }: { text: string; query: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              <Highlight text={part.slice(2, -2)} query={query} />
            </strong>
          );
        }
        return (
          <span key={i}>
            <Highlight text={part} query={query} />
          </span>
        );
      })}
    </p>
  );
}
