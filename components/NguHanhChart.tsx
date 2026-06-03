"use client";

import { useState } from "react";
import clsx from "clsx";
import { Info } from "lucide-react";

type Hanh = "Thủy" | "Mộc" | "Hỏa" | "Thổ" | "Kim";
type Mode = "sinh" | "khac";

type HanhMeta = {
  name: Hanh;
  color: string;
  textOnColor: string;
  emoji?: string;
};

const HANH_ORDER: Hanh[] = ["Thủy", "Mộc", "Hỏa", "Thổ", "Kim"];

const HANH_META: Record<Hanh, HanhMeta> = {
  "Thủy": { name: "Thủy", color: "#0F4F41", textOnColor: "#FAF0D7" },
  "Mộc": { name: "Mộc", color: "#2A8A72", textOnColor: "#FAF0D7" },
  "Hỏa": { name: "Hỏa", color: "#C0321E", textOnColor: "#FAF0D7" },
  "Thổ": { name: "Thổ", color: "#C9881A", textOnColor: "#2A1500" },
  "Kim": { name: "Kim", color: "#6B3D10", textOnColor: "#FAF0D7" },
};

/** Quan hệ tương sinh: hành nào sinh hành nào, kèm metaphor. */
const SINH: Record<Hanh, { target: Hanh; metaphor: string }> = {
  "Thủy": { target: "Mộc", metaphor: "Nước tưới cây — cây lớn lên." },
  "Mộc": { target: "Hỏa", metaphor: "Củi gỗ nhóm lửa." },
  "Hỏa": { target: "Thổ", metaphor: "Tro tàn sau lửa thành đất màu mỡ." },
  "Thổ": { target: "Kim", metaphor: "Lòng đất chứa quặng kim loại." },
  "Kim": { target: "Thủy", metaphor: "Kim loại lạnh ngưng tụ thành giọt nước." },
};

/** Quan hệ tương khắc: hành nào chế ngự hành nào, kèm metaphor. */
const KHAC: Record<Hanh, { target: Hanh; metaphor: string }> = {
  "Thủy": { target: "Hỏa", metaphor: "Nước dập lửa." },
  "Hỏa": { target: "Kim", metaphor: "Lửa nung chảy kim loại." },
  "Kim": { target: "Mộc", metaphor: "Dao chặt cây — chế ngự để tạo hình." },
  "Mộc": { target: "Thổ", metaphor: "Rễ cây hút chất từ đất." },
  "Thổ": { target: "Thủy", metaphor: "Đất đắp đê chặn nước." },
};

/** Hành nào sinh ra hành này (đảo chiều của SINH) */
function getSinhBy(h: Hanh): Hanh {
  return (Object.keys(SINH) as Hanh[]).find((k) => SINH[k].target === h)!;
}
/** Hành nào khắc hành này (đảo chiều của KHAC) */
function getKhacBy(h: Hanh): Hanh {
  return (Object.keys(KHAC) as Hanh[]).find((k) => KHAC[k].target === h)!;
}

type Props = {
  /** Tiêu đề tuỳ chọn — mặc định "Sơ đồ Ngũ hành tương tác". */
  title?: string;
};

export default function NguHanhChart({ title = "Sơ đồ Ngũ hành tương tác" }: Props) {
  const [mode, setMode] = useState<Mode>("sinh");
  const [selected, setSelected] = useState<Hanh | null>(null);

  return (
    <figure className="my-6 overflow-hidden rounded-lg border-2 border-gold-2 bg-parchment shadow-sm">
      {/* Header với toggle */}
      <header className="flex flex-wrap items-center justify-between gap-3 bg-cream-2/50 px-4 py-3">
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
        <div
          role="tablist"
          aria-label="Chế độ"
          className="inline-flex rounded-md border border-gold/50 bg-parchment p-0.5 text-xs font-semibold"
        >
          <ModeTab
            mode="sinh"
            active={mode === "sinh"}
            onClick={() => {
              setMode("sinh");
              setSelected(null);
            }}
          >
            Tương sinh
          </ModeTab>
          <ModeTab
            mode="khac"
            active={mode === "khac"}
            onClick={() => {
              setMode("khac");
              setSelected(null);
            }}
          >
            Tương khắc
          </ModeTab>
        </div>
      </header>

      <div className="grid gap-4 p-4 md:grid-cols-[1fr_1fr] md:items-start md:gap-6">
        <PentagonSvg
          mode={mode}
          selected={selected}
          onSelect={(h) => setSelected((cur) => (cur === h ? null : h))}
        />
        <Panel mode={mode} selected={selected} onSelect={setSelected} />
      </div>

      <figcaption className="border-t border-gold/30 bg-cream/70 px-4 py-2 text-xs italic text-ink-2">
        Bấm vào một hành để xem nó sinh/khắc hành nào và bị hành nào sinh/khắc.
        Đổi giữa <strong>Tương sinh</strong> và <strong>Tương khắc</strong> ở góc phải.
      </figcaption>
    </figure>
  );
}

function ModeTab({
  mode,
  active,
  onClick,
  children,
}: {
  mode: Mode;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "rounded px-3 py-1 transition",
        active
          ? mode === "sinh"
            ? "bg-teal-2 text-parchment shadow-sm"
            : "bg-red-ink-2 text-parchment shadow-sm"
          : "text-ink-2 hover:bg-cream"
      )}
    >
      {children}
    </button>
  );
}

function PentagonSvg({
  mode,
  selected,
  onSelect,
}: {
  mode: Mode;
  selected: Hanh | null;
  onSelect: (h: Hanh) => void;
}) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 105;
  const nodeRadius = 30;

  // Vị trí 5 đỉnh theo thứ tự HANH_ORDER: Thủy=top, Mộc=top-right, Hỏa=bottom-right, Thổ=bottom-left, Kim=top-left
  const positions = HANH_ORDER.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  // Edges: nếu mode="sinh" thì các cặp liền kề (0→1, 1→2, ..., 4→0)
  //        nếu mode="khac" thì cách 1 đỉnh (0→2, 2→4, 4→1, 1→3, 3→0)
  const edges: Array<{ from: number; to: number; fromHanh: Hanh; toHanh: Hanh }> = [];
  if (mode === "sinh") {
    for (let i = 0; i < 5; i++) {
      const to = (i + 1) % 5;
      edges.push({
        from: i,
        to,
        fromHanh: HANH_ORDER[i],
        toHanh: HANH_ORDER[to],
      });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const to = (i + 2) % 5;
      edges.push({
        from: i,
        to,
        fromHanh: HANH_ORDER[i],
        toHanh: HANH_ORDER[to],
      });
    }
  }

  const lineColor = mode === "sinh" ? "#1A6B5A" : "#9E2515";
  const dimColor = mode === "sinh" ? "#1A6B5A55" : "#9E251555";

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{ maxWidth: size }}
        role="img"
        aria-label={`Ngũ giác ${mode === "sinh" ? "tương sinh" : "tương khắc"}`}
      >
        <defs>
          <marker
            id="arrow-on"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={lineColor} />
          </marker>
          <marker
            id="arrow-off"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={dimColor} />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => {
          // Vẽ line từ rìa nút đến rìa nút (chứ không phải tâm) để mũi tên đẹp
          const dx = positions[e.to].x - positions[e.from].x;
          const dy = positions[e.to].y - positions[e.from].y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / len;
          const uy = dy / len;
          const x1 = positions[e.from].x + ux * nodeRadius;
          const y1 = positions[e.from].y + uy * nodeRadius;
          const x2 = positions[e.to].x - ux * nodeRadius;
          const y2 = positions[e.to].y - uy * nodeRadius;

          // Highlight nếu hành đã chọn là from hoặc to của cạnh này
          const isRelevant =
            selected !== null && (e.fromHanh === selected || e.toHanh === selected);
          const noSelection = selected === null;
          const stroke = isRelevant || noSelection ? lineColor : dimColor;
          const markerEnd =
            isRelevant || noSelection ? "url(#arrow-on)" : "url(#arrow-off)";
          const strokeWidth = isRelevant ? 3 : 2;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={mode === "khac" ? "5 3" : undefined}
              markerEnd={markerEnd}
              className="transition-[stroke-width] duration-150"
            />
          );
        })}

        {/* Nodes */}
        {HANH_ORDER.map((h, i) => {
          const meta = HANH_META[h];
          const isSelected = selected === h;
          const isFaded = selected !== null && !isSelected && !relatesTo(h, selected, mode);
          return (
            <g
              key={h}
              transform={`translate(${positions[i].x}, ${positions[i].y})`}
              onClick={() => onSelect(h)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Hành ${h}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(h);
                }
              }}
            >
              <circle
                r={nodeRadius}
                fill={meta.color}
                stroke={isSelected ? "#FAF0D7" : "transparent"}
                strokeWidth={3}
                opacity={isFaded ? 0.45 : 1}
                className="transition-opacity duration-150 hover:opacity-90"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="serif"
                fontSize="17"
                fontWeight="600"
                fill={meta.textOnColor}
                opacity={isFaded ? 0.7 : 1}
                pointerEvents="none"
              >
                {h}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Kiểm tra hành h có liên quan đến hành sel theo mode hiện tại không (sinh/khắc/được sinh/bị khắc) */
function relatesTo(h: Hanh, sel: Hanh, mode: Mode): boolean {
  const rel = mode === "sinh" ? SINH : KHAC;
  const inv = mode === "sinh" ? getSinhBy : getKhacBy;
  return rel[sel].target === h || inv(sel) === h;
}

function Panel({
  mode,
  selected,
  onSelect,
}: {
  mode: Mode;
  selected: Hanh | null;
  onSelect: (h: Hanh) => void;
}) {
  if (!selected) {
    return (
      <div className="flex h-full flex-col justify-center rounded-md border border-dashed border-gold/60 bg-cream/60 p-4 text-sm leading-relaxed text-ink-2">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
          <Info size={12} />
          Hướng dẫn
        </div>
        <p>
          Bấm vào một hành trong ngũ giác để xem quan hệ
          {mode === "sinh" ? " tương sinh" : " tương khắc"} của nó.
        </p>
        <p className="mt-2">
          Hoặc chọn nhanh:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {HANH_ORDER.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onSelect(h)}
              className="rounded-full px-2.5 py-1 text-xs font-semibold text-parchment transition hover:scale-105"
              style={{ background: HANH_META[h].color, color: HANH_META[h].textOnColor }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const rel = mode === "sinh" ? SINH : KHAC;
  const inv = mode === "sinh" ? getSinhBy : getKhacBy;

  const target = rel[selected].target;
  const targetMetaphor = rel[selected].metaphor;
  const source = inv(selected);
  const sourceRel = rel[source];

  const verb = mode === "sinh" ? "sinh" : "khắc";
  const tone = mode === "sinh" ? "teal" : "red";

  return (
    <div className="rounded-md border border-gold/60 bg-cream p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full font-display text-base font-semibold"
            style={{
              background: HANH_META[selected].color,
              color: HANH_META[selected].textOnColor,
            }}
          >
            {selected}
          </span>
          <span className="font-display text-base font-semibold text-ink">
            Hành {selected}
          </span>
        </div>
      </div>

      {/* Hành này sinh/khắc → */}
      <div
        className={clsx(
          "mb-3 rounded-md border-l-4 p-3",
          tone === "teal" ? "border-teal-2 bg-teal-2/10" : "border-red-ink-2 bg-red-ink-2/10"
        )}
      >
        <div
          className={clsx(
            "text-[11px] font-semibold uppercase tracking-wider",
            tone === "teal" ? "text-teal-2" : "text-red-ink-2"
          )}
        >
          {selected} {verb} {target}
        </div>
        <p className="mt-1 text-sm text-ink-2">{targetMetaphor}</p>
        <button
          type="button"
          onClick={() => onSelect(target)}
          className="mt-2 text-xs font-medium text-ink-2 underline decoration-gold-2 decoration-2 underline-offset-2 hover:text-red-ink-2"
        >
          Xem hành {target} →
        </button>
      </div>

      {/* ← Hành nào sinh/khắc hành này */}
      <div className="rounded-md border-l-4 border-gold-2 bg-gold-2/15 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">
          {source} {verb} {selected}
        </div>
        <p className="mt-1 text-sm text-ink-2">{sourceRel.metaphor}</p>
        <button
          type="button"
          onClick={() => onSelect(source)}
          className="mt-2 text-xs font-medium text-ink-2 underline decoration-gold-2 decoration-2 underline-offset-2 hover:text-red-ink-2"
        >
          Xem hành {source} →
        </button>
      </div>
    </div>
  );
}
