/* ============================================================
 *  MindMap — phong cách "cây ngang" (horizontal tree)
 *
 *  Bố cục:
 *    [Tâm] ──curve──> [Nhãn nhóm] ──> [Collector ●] ──curves──> [Lá]
 *
 *  Mỗi nhánh chính có 1 màu riêng. Lá có gạch chân cùng màu nhánh.
 *  Đọc trái → phải, dễ scan, mobile fallback stack dọc.
 * ============================================================ */

/** 1 lá — string đơn giản (chỉ tên) hoặc object có title + description */
export type LeafItem = string | { title: string; description?: string };

export type MindMapBranch = {
  label: string;
  symbol?: string;
  hint?: string;
  leaves: LeafItem[];
  tone?: "teal" | "gold" | "red" | "ink";
};

export type MindMapData = {
  center: string;
  centerSymbol?: string;
  branches: MindMapBranch[];
};

/* ----- Style tokens ----- */
const TONE_STROKE: Record<NonNullable<MindMapBranch["tone"]>, string> = {
  red: "#9E2515",
  gold: "#C9881A",
  teal: "#1A6B5A",
  ink: "#4A2800",
};

const TONE_TEXT: Record<NonNullable<MindMapBranch["tone"]>, string> = {
  red: "#9E2515",
  gold: "#6B3D10",
  teal: "#0F4F41",
  ink: "#2A1500",
};

/* ----- Layout constants (SVG viewbox 1100×Auto) -----
 * Mọi line liền mạch: curve từ tâm → ngang DƯỚI label nhóm → curve → collector
 *                   → curve ra lá → ngang DƯỚI text lá → end.
 * Cả label nhóm lẫn text lá đều SIT trên line. */
const CENTER_X = 80;
const BRANCH_LABEL_X = 290; // điểm trunk bắt đầu ngang (dưới label nhóm)
const COLLECTOR_X = 600;    // hội tụ; đủ chỗ cho label dài 290px
const LEAF_LINE_START_X = 640;
const LEAF_TEXT_X = 670;
const LEAF_HEIGHT = 52; // khoảng cách giữa 2 lá
const BRANCH_GAP = 36;  // khoảng cách giữa các nhánh
const TOP_PAD = 36;

function leafTitle(leaf: LeafItem): string {
  return typeof leaf === "string" ? leaf : leaf.title;
}
function leafDesc(leaf: LeafItem): string | undefined {
  return typeof leaf === "string" ? undefined : leaf.description;
}

export default function MindMap({ data }: { data: MindMapData }) {
  // ===== Tính bố cục (xác định Y của từng lá + nhánh) =====
  // Dùng reduce để tích lũy cursorY immutably — tránh react-hooks/immutability lint
  const { layouts, finalY } = data.branches.reduce<{
    layouts: {
      branch: MindMapBranch;
      branchCenterY: number;
      leaves: { leaf: LeafItem; y: number }[];
    }[];
    finalY: number;
  }>(
    (acc, branch) => {
      const n = branch.leaves.length;
      const branchHeight = Math.max(LEAF_HEIGHT, n * LEAF_HEIGHT);
      const startY = acc.finalY;
      const branchCenterY = startY + branchHeight / 2;
      const leaves = branch.leaves.map((leaf, i) => ({
        leaf,
        y: startY + i * LEAF_HEIGHT + LEAF_HEIGHT / 2,
      }));
      return {
        layouts: [...acc.layouts, { branch, branchCenterY, leaves }],
        finalY: startY + branchHeight + BRANCH_GAP,
      };
    },
    { layouts: [], finalY: TOP_PAD }
  );
  const totalHeight = finalY + TOP_PAD;
  const centerY = totalHeight / 2;

  return (
    <figure className="my-6 overflow-hidden rounded-lg border-2 border-gold-2 bg-parchment">
      <header className="border-b border-gold/40 bg-cream-2/40 px-4 py-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-2">
          Sơ đồ tư duy
        </div>
      </header>

      {/* DESKTOP — horizontal tree với SVG */}
      <div className="hidden overflow-x-auto p-4 md:block">
        <svg
          viewBox={`0 0 1100 ${totalHeight}`}
          className="block h-auto w-full"
          style={{ minWidth: 760 }}
          role="img"
          aria-label={`Sơ đồ tư duy ${data.center}`}
        >
          {/* ===== Render từng nhánh ===== */}
          {layouts.map((layout, bi) => {
            const tone = layout.branch.tone ?? "teal";
            const color = TONE_STROKE[tone];
            const branchLabelStr = `${bi + 1}. ${layout.branch.label}`;
            // Underline dưới label kéo dài đúng chữ + chừa 16px phải để curve mượt
            const labelUnderlineEnd =
              BRANCH_LABEL_X + measureBranchLabelWidth(branchLabelStr) + 16;
            return (
              <g key={`b-${bi}`}>
                {/*
                 * (1) TRUNK LIỀN MẠCH:
                 *   tâm → curve → ngang DƯỚI label → curve → collector.
                 * Cả label nhóm SIT trên đoạn ngang giữa, như leaf sit trên gạch chân.
                 */}
                <path
                  d={`M ${CENTER_X} ${centerY}
                      C ${CENTER_X + 130} ${centerY},
                        ${BRANCH_LABEL_X - 40} ${layout.branchCenterY},
                        ${BRANCH_LABEL_X} ${layout.branchCenterY}
                      L ${labelUnderlineEnd} ${layout.branchCenterY}
                      C ${labelUnderlineEnd + 60} ${layout.branchCenterY},
                        ${COLLECTOR_X - 50} ${layout.branchCenterY},
                        ${COLLECTOR_X} ${layout.branchCenterY}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* (2) Nhãn nhóm — SIT trên line, baseline y-7 (giống lá) */}
                <text
                  x={BRANCH_LABEL_X + 14}
                  y={layout.branchCenterY - 7}
                  fontFamily="var(--font-display), serif"
                  fontSize="20"
                  fontWeight="700"
                  fill={TONE_TEXT[tone]}
                >
                  {branchLabelStr}
                </text>
                {layout.branch.symbol && (
                  <text
                    x={BRANCH_LABEL_X + 4}
                    y={layout.branchCenterY - 7}
                    fontFamily="var(--font-deco), serif"
                    fontSize="24"
                    textAnchor="end"
                    fill={color}
                    opacity="0.75"
                  >
                    {layout.branch.symbol}
                  </text>
                )}

                {/* (3) Collector — circle nhỏ ở điểm hội tụ */}
                <circle
                  cx={COLLECTOR_X}
                  cy={layout.branchCenterY}
                  r="6"
                  fill="#FAF0D7"
                  stroke={color}
                  strokeWidth="2.5"
                />

                {/*
                 * (4) Mỗi LÁ là 1 path liền mạch:
                 *   collector → curve → gạch chân ngang DƯỚI CHỮ → kết thúc đúng độ dài chữ.
                 * Chữ NẰM TRÊN line, không phải trôi lơ lửng.
                 */}
                {layout.leaves.map((leafItem, li) => {
                  const title = leafTitle(leafItem.leaf);
                  const desc = leafDesc(leafItem.leaf);
                  const titleStr = desc ? `${title}:` : title;
                  // Line kết thúc ĐÚNG độ dài chữ (không kéo dài tới hết viewbox)
                  const lineEndX = LEAF_TEXT_X + measureLeafWidth(titleStr, desc) + 8;
                  return (
                    <g key={`l-${bi}-${li}`}>
                      {/* Path liền: collector → curve → gạch chân ngang dưới chữ */}
                      <path
                        d={`M ${COLLECTOR_X + 6} ${layout.branchCenterY}
                            C ${COLLECTOR_X + 70} ${layout.branchCenterY},
                              ${LEAF_LINE_START_X - 60} ${leafItem.y},
                              ${LEAF_LINE_START_X} ${leafItem.y}
                            L ${lineEndX} ${leafItem.y}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Title — baseline y-7: chữ ngồi sát line như underline.
                       * Descender (~4px) ≈ kết thúc ở y-3 — chỉ chừa 3px gap → đẹp. */}
                      <text
                        x={LEAF_TEXT_X}
                        y={leafItem.y - 7}
                        fontFamily="var(--font-body), sans-serif"
                        fontSize="16"
                        fontWeight="700"
                        fill="#2A1500"
                      >
                        {titleStr}
                      </text>
                      {/* Description (cùng dòng với title) */}
                      {desc && (
                        <text
                          x={LEAF_TEXT_X + measureTitleWidth(titleStr) + 8}
                          y={leafItem.y - 7}
                          fontFamily="var(--font-body), sans-serif"
                          fontSize="14"
                          fontWeight="400"
                          fill="#4A2800"
                        >
                          {desc}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* ===== TÂM (render cuối) ===== */}
          <g>
            <circle
              cx={CENTER_X}
              cy={centerY}
              r="9"
              fill="#9E2515"
              stroke="#9E2515"
              strokeWidth="2"
            />
            {/* Nhãn tâm bên trái */}
            <text
              x={CENTER_X - 20}
              y={centerY - 8}
              textAnchor="end"
              fontFamily="var(--font-display), serif"
              fontSize="13"
              fontWeight="600"
              fill="#6B3D10"
              letterSpacing="1.5"
            >
              SƠ ĐỒ TƯ DUY
            </text>
            <text
              x={CENTER_X - 20}
              y={centerY + 13}
              textAnchor="end"
              fontFamily="var(--font-display), serif"
              fontSize="18"
              fontWeight="800"
              fill="#9E2515"
            >
              {data.center}
            </text>
            {data.centerSymbol && (
              <text
                x={CENTER_X - 20}
                y={centerY + 38}
                textAnchor="end"
                fontFamily="var(--font-deco), serif"
                fontSize="26"
                fill="#9E2515"
                opacity="0.8"
              >
                {data.centerSymbol}
              </text>
            )}
          </g>
        </svg>
      </div>

      {/* MOBILE — stack */}
      <div className="p-5 md:hidden">
        <div className="mb-4 rounded-md border-l-4 border-red-ink-2 bg-cream px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-2">
            Sơ đồ tư duy
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-base font-bold text-red-ink-2">
              {data.center}
            </span>
            {data.centerSymbol && (
              <span className="font-deco text-2xl leading-none text-red-ink-2/70">
                {data.centerSymbol}
              </span>
            )}
          </div>
        </div>
        <ol className="space-y-3">
          {data.branches.map((branch, bi) => {
            const tone = branch.tone ?? "teal";
            const color = TONE_STROKE[tone];
            return (
              <li
                key={bi}
                className="rounded-md border-l-4 bg-cream/70 px-3 py-2"
                style={{ borderColor: color }}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display text-sm font-bold"
                    style={{ color: TONE_TEXT[tone] }}
                  >
                    {bi + 1}. {branch.label}
                  </span>
                  {branch.symbol && (
                    <span
                      className="font-deco text-base leading-none opacity-70"
                      style={{ color }}
                    >
                      {branch.symbol}
                    </span>
                  )}
                </div>
                <ul className="mt-1.5 space-y-1">
                  {branch.leaves.map((leaf, li) => {
                    const title = leafTitle(leaf);
                    const desc = leafDesc(leaf);
                    return (
                      <li
                        key={li}
                        className="border-b pb-1 text-xs leading-snug"
                        style={{ borderColor: `${color}40` }}
                      >
                        <span className="font-semibold text-ink">
                          {desc ? `${title}:` : title}
                        </span>
                        {desc && (
                          <span className="ml-1 text-ink-2">{desc}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}

/**
 * Ước lượng độ rộng pixel của title — để đặt description cùng dòng.
 * Heuristic đơn giản: avg ~7.5px per char ở fontSize 13, font sans VN.
 * Đủ chính xác để bố cục không bị chồng — không cần đo thật bằng canvas.
 */
/**
 * Ước lượng độ rộng pixel của TITLE (font-bold 16px, sans VN).
 * Dùng để biết description bắt đầu ở đâu trên cùng dòng.
 * Heuristic ~9.5px/char đủ chính xác để chữ không chồng.
 */
function measureTitleWidth(title: string): number {
  return Math.ceil(title.length * 9.5);
}

/**
 * Ước lượng độ rộng pixel của LABEL NHÓM (display font bold 20px).
 * Chữ display rộng hơn sans body — heuristic ~12px/char.
 * Dùng để biết underline dưới label kết thúc ở đâu → curve tiếp tục.
 */
function measureBranchLabelWidth(label: string): number {
  return Math.ceil(label.length * 12);
}

/**
 * Ước lượng tổng độ rộng pixel của 1 lá (title + desc nếu có).
 * Dùng để biết line UNDER nên kết thúc ở đâu.
 *  - Title bold 16px: ~9.5px/char
 *  - Description regular 14px: ~7.2px/char (chữ Việt có dấu)
 *  - Gap giữa title và desc: 8px
 */
function measureLeafWidth(titleStr: string, desc?: string): number {
  const titleW = Math.ceil(titleStr.length * 9.5);
  if (!desc) return titleW;
  const descW = Math.ceil(desc.length * 7.2);
  return titleW + 8 + descW;
}
