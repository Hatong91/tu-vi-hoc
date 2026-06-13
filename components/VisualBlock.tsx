import type { Visual } from "@/lib/types";
import NguHanhChart from "./NguHanhChart";
import CungBieu from "./CungBieu";
import MnemonicCard, { type MnemonicData } from "./MnemonicCard";
import MetaphorBox, { type MetaphorGridData } from "./MetaphorBox";
import MindMap, { type MindMapData as MindMapTreeData } from "./MindMap";
import type { DiaChi } from "@/lib/tuvi-calc";

type TableData = {
  headers: string[];
  rows: string[][];
};

type MindMapNode = { label: string; color?: string; children?: MindMapNode[] };
type MindMapData = { root: string; children: MindMapNode[] };

type PentagonData = {
  type: "pentagon";
  mode: "sinh" | "khac";
  nodes: { label: string; color: string; position: string }[];
  edges: { from: string; to: string; label: string }[];
};

type TaichiData = {
  type: "taichi";
  labels: { yang: string; yin: string };
  description: string;
};

type TimelineData = {
  steps: { label: string; subtitle?: string }[];
};

export default function VisualBlock({ visual }: { visual: Visual }) {
  // Interactive components tự render khung của chúng (header + caption riêng)
  if (visual.kind === "interactive-ngu-hanh") {
    return <NguHanhChart title={visual.caption} />;
  }
  if (visual.kind === "interactive-cung-bieu") {
    const data = (visual.data as { cungMenh?: DiaChi; cungThan?: DiaChi }) ?? {};
    return (
      <CungBieu
        cungMenh={data.cungMenh}
        cungThan={data.cungThan}
        caption={visual.caption}
      />
    );
  }

  // Các visual mới (Phase 7) — tự render khung riêng, không cần wrapper figure
  if (visual.kind === "mnemonic") {
    return <MnemonicCard data={visual.data as MnemonicData} />;
  }
  if (visual.kind === "metaphor-grid") {
    return <MetaphorBox data={visual.data as MetaphorGridData} />;
  }
  if (visual.kind === "mindmap-tree") {
    return <MindMap data={visual.data as MindMapTreeData} />;
  }

  return (
    <figure className="my-5 overflow-hidden rounded-lg border border-gold/50 bg-parchment">
      <div className="bg-cream-2/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
        {visual.kind === "table" && "Bảng tra"}
        {visual.kind === "mindmap" && "Sơ đồ tỏa"}
        {visual.kind === "flowchart" && "Sơ đồ quy trình"}
        {visual.kind === "timeline" && "Trục thời gian"}
        {visual.kind === "infographic" && "Sơ đồ minh họa"}
      </div>
      <div className="p-4">
        {visual.kind === "table" && <TableVisual data={visual.data as TableData} />}
        {visual.kind === "mindmap" && <MindMapVisual data={visual.data as MindMapData} />}
        {visual.kind === "infographic" && <InfographicVisual data={visual.data as TaichiData | PentagonData} />}
        {visual.kind === "timeline" && <TimelineVisual data={visual.data as TimelineData} />}
        {visual.kind === "flowchart" && (
          <PlaceholderVisual caption="Sơ đồ quy trình sẽ thêm ở Giai đoạn 3" />
        )}
      </div>
      <figcaption className="border-t border-gold/30 bg-cream/70 px-4 py-2 text-xs italic text-ink-2">
        {visual.caption}
      </figcaption>
    </figure>
  );
}

function TableVisual({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-teal-2 text-parchment">
            {data.headers.map((h) => (
              <th
                key={h}
                className="border border-gold/30 px-3 py-2 text-left font-display font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, r) => (
            <tr key={r} className={r % 2 === 0 ? "bg-parchment" : "bg-cream/60"}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`border border-gold/30 px-3 py-2 ${
                    c === 0 ? "font-semibold text-ink-2" : "text-ink-2/90"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MindMapVisual({ data }: { data: MindMapData }) {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="rounded-full bg-ink-2 px-4 py-2 font-display text-base font-semibold text-gold-3">
        {data.root}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-5">
        {data.children.map((node) => (
          <div
            key={node.label}
            className="rounded-md border border-gold/40 bg-cream/60 p-3"
            style={node.color ? { borderTopColor: node.color, borderTopWidth: 3 } : undefined}
          >
            <div className="font-display text-sm font-semibold text-ink" style={{ color: node.color }}>
              {node.label}
            </div>
            {node.children && (
              <ul className="mt-2 space-y-1 text-xs text-ink-2/90">
                {node.children.map((c) => (
                  <li key={c.label} className="flex gap-1">
                    <span className="text-gold">•</span>
                    {c.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfographicVisual({ data }: { data: TaichiData | PentagonData }) {
  if ("type" in data && data.type === "taichi") {
    return (
      <div className="flex flex-col items-center gap-3 py-2 md:flex-row md:items-center md:gap-6">
        <TaichiSVG />
        <div className="space-y-2 text-sm leading-relaxed text-ink-2">
          <p>
            <span className="font-semibold text-ink">{data.labels.yang}:</span>{" "}
            chấm trắng trong vùng đen
          </p>
          <p>
            <span className="font-semibold text-ink">{data.labels.yin}:</span>{" "}
            chấm đen trong vùng trắng
          </p>
          <p className="text-xs italic text-ink-2">{data.description}</p>
        </div>
      </div>
    );
  }

  if ("type" in data && data.type === "pentagon") {
    const isSinh = data.mode === "sinh";
    return (
      <div className="py-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
          <PentagonSVG mode={data.mode} nodes={data.nodes} />
          <div>
            <h4 className="mb-2 font-display text-sm font-semibold text-ink">
              {isSinh ? "Mạch sinh — chiều kim đồng hồ" : "Mạch khắc — cách 1 đỉnh"}
            </h4>
            <ol className="space-y-1.5 text-sm text-ink-2">
              {data.edges.map((e, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-1">
                  <span className="font-semibold text-ink">{e.from}</span>
                  <span className={isSinh ? "text-teal" : "text-red-ink-2"}>
                    {isSinh ? "→" : "↛"}
                  </span>
                  <span className="font-semibold text-ink">{e.to}</span>
                  <span className="text-xs italic text-ink-2">— {e.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TimelineVisual({ data }: { data: TimelineData }) {
  return (
    <ol className="relative flex flex-col gap-3 py-2 md:flex-row md:items-stretch md:gap-0">
      {data.steps.map((step, i) => {
        const isLast = i === data.steps.length - 1;
        return (
          <li
            key={i}
            className="relative flex flex-1 items-start gap-3 md:flex-col md:items-center md:text-center"
          >
            <div className="flex flex-col items-center md:contents">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-ink-2 bg-parchment font-display text-sm font-semibold text-red-ink-2 md:z-10">
                {i + 1}
              </div>
              {!isLast && (
                <div className="ml-4 h-10 w-px bg-gold/60 md:absolute md:left-1/2 md:top-4 md:ml-0 md:h-px md:w-full md:bg-gradient-to-r md:from-gold/60 md:to-gold/60" />
              )}
            </div>
            <div className="flex-1 md:mt-2">
              <div className="font-display text-base font-semibold text-ink">
                {step.label}
              </div>
              {step.subtitle && (
                <div className="text-xs text-ink-2">{step.subtitle}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function PlaceholderVisual({ caption }: { caption: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-gold/60 bg-cream/70 text-center text-sm italic text-ink-2">
      {caption}
    </div>
  );
}

function TaichiSVG() {
  return (
    <svg viewBox="0 0 100 100" width={120} height={120} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="#FAF0D7" stroke="#2A1500" strokeWidth="2" />
      <path
        d="M50 2 a48 48 0 0 1 0 96 a24 24 0 0 1 0 -48 a24 24 0 0 0 0 -48 z"
        fill="#2A1500"
      />
      <circle cx="50" cy="26" r="6" fill="#FAF0D7" />
      <circle cx="50" cy="74" r="6" fill="#2A1500" />
    </svg>
  );
}

function PentagonSVG({
  mode,
  nodes,
}: {
  mode: "sinh" | "khac";
  nodes: PentagonData["nodes"];
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  // 5 đỉnh ngũ giác, đỉnh đầu hướng lên
  const positions = [0, 1, 2, 3, 4].map((i) => {
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  // Theo CLAUDE.md ngũ giác mặc định: Thủy (top), Mộc (top-right), Hỏa (bottom-right), Thổ (bottom-left), Kim (top-left)
  // Nodes input theo CLAUDE.md đã sắp theo thứ tự đó.

  // Edges chỉ số theo thứ tự nodes
  const edgePairs =
    mode === "sinh"
      ? [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 0],
        ]
      : [
          [0, 2],
          [2, 4],
          [4, 1],
          [1, 3],
          [3, 0],
        ];

  const lineColor = mode === "sinh" ? "#1A6B5A" : "#9E2515";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      {/* Đường nối */}
      {edgePairs.map(([a, b], i) => (
        <line
          key={i}
          x1={positions[a].x}
          y1={positions[a].y}
          x2={positions[b].x}
          y2={positions[b].y}
          stroke={lineColor}
          strokeWidth="2"
          strokeDasharray={mode === "khac" ? "4 3" : undefined}
          markerEnd="url(#arrow)"
          opacity={0.85}
        />
      ))}
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill={lineColor} />
        </marker>
      </defs>
      {/* Đỉnh */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle cx={positions[i].x} cy={positions[i].y} r="22" fill={n.color} />
          <text
            x={positions[i].x}
            y={positions[i].y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FAF0D7"
            fontFamily="serif"
            fontSize="14"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
