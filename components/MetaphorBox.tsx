export type MetaphorItem = {
  /** Chữ Hán/emoji ở góc */
  symbol: string;
  /** Tên — ví dụ "Cung Mệnh" hoặc "Tử Vi" */
  title: string;
  /** Câu ẩn dụ — 1 dòng ngắn, in nghiêng */
  metaphor: string;
  /** Giải thích 1-2 dòng */
  explanation: string;
  /** Màu nền — tuỳ chọn nhóm. Default = cream */
  tone?: "cream" | "teal" | "gold" | "red";
};

export type MetaphorGridData = {
  items: MetaphorItem[];
  /** Layout: grid bao nhiêu cột trên màn rộng. Default = 3 */
  cols?: 2 | 3 | 4;
};

const TONE_STYLES: Record<NonNullable<MetaphorItem["tone"]>, string> = {
  cream: "bg-cream border-gold/50",
  teal: "bg-teal-2/8 border-teal-2/50",
  gold: "bg-gold-2/12 border-gold-2/60",
  red: "bg-red-ink-2/8 border-red-ink-2/50",
};

const TONE_SYMBOL: Record<NonNullable<MetaphorItem["tone"]>, string> = {
  cream: "text-red-ink-2",
  teal: "text-teal-2",
  gold: "text-gold",
  red: "text-red-ink-2",
};

const COL_CLASS: Record<NonNullable<MetaphorGridData["cols"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3",
  4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

/**
 * Lưới các ô "ẩn dụ" — biểu tượng to + 1 câu so sánh thực tế + giải thích ngắn.
 *
 * Mục đích: thay 1 đoạn text khô khan bằng nhiều ô trực quan, mỗi ô là 1 khái niệm.
 * Não nhớ qua HÌNH ẢNH + ẨN DỤ thay vì định nghĩa.
 *
 * Use case:
 *  - 12 cung như 12 phòng trong nhà
 *  - 5 ngũ hành như 5 hiện tượng thiên nhiên
 *  - 14 chính tinh như 14 nhân vật điển hình
 */
export default function MetaphorBox({ data }: { data: MetaphorGridData }) {
  const cols = data.cols ?? 3;
  return (
    <div
      className={`my-6 grid grid-cols-1 gap-3 ${COL_CLASS[cols]}`}
      role="list"
    >
      {data.items.map((item, i) => {
        const tone = item.tone ?? "cream";
        return (
          <div
            key={i}
            role="listitem"
            className={`flex flex-col rounded-lg border p-4 transition hover:shadow-md ${TONE_STYLES[tone]}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`shrink-0 select-none font-deco text-3xl leading-none ${TONE_SYMBOL[tone]} sm:text-4xl`}
                aria-hidden
              >
                {item.symbol}
              </span>
              <div className="min-w-0">
                <h4 className="font-display text-base font-semibold leading-tight text-ink">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs italic leading-snug text-ink-2">
                  &ldquo;{item.metaphor}&rdquo;
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-2">
              {item.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}
