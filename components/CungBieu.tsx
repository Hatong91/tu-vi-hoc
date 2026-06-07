"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Info, X } from "lucide-react";
import {
  DIA_CHI,
  TEN_12_CUNG,
  CHI_GRID_POS,
  CHI_HANH,
  CHI_AM_DUONG,
  CHI_CON_GIAP,
  anThapNhiCung,
  chiToCung as invertCungMap,
  type DiaChi,
  type TenCung,
  type ChinhTinhAt,
  type DacHam,
  type PhuTinhInfo,
  type DaiVan,
  type VongTrangSinhName,
  type TuanTrietPos,
} from "@/lib/tuvi-calc";
import cungInfo from "@/data/12-cung.json";

type CungEntry = (typeof cungInfo.cung)[number];

const CUNG_LOOKUP: Record<TenCung, CungEntry> = cungInfo.cung.reduce(
  (acc, c) => {
    acc[c.name as TenCung] = c as CungEntry;
    return acc;
  },
  {} as Record<TenCung, CungEntry>
);

const HANH_COLOR: Record<string, { bg: string; text: string; chip: string }> = {
  "Kim":  { bg: "#6B3D10", text: "#FAF0D7", chip: "Kim" },
  "Mộc":  { bg: "#2A8A72", text: "#FAF0D7", chip: "Mộc" },
  "Thủy": { bg: "#0F4F41", text: "#FAF0D7", chip: "Thủy" },
  "Hỏa":  { bg: "#C0321E", text: "#FAF0D7", chip: "Hỏa" },
  "Thổ":  { bg: "#C9881A", text: "#2A1500", chip: "Thổ" },
};

type Props = {
  /** Chi của cung Mệnh — bắt buộc; component sẽ tự tính 12 cung từ đây. */
  cungMenh?: DiaChi;
  /** Chi của cung Thân (tuỳ chọn). */
  cungThan?: DiaChi;
  /** Mapping 12 cung → chi (ưu tiên nếu truyền sẵn, không cần cungMenh). */
  thapNhiCung?: Record<TenCung, DiaChi>;
  /** Mapping chi → mảng chính tinh tại chi đó (có đắc/hãm). */
  chinhTinh?: Record<DiaChi, ChinhTinhAt[]>;
  /** Mapping chi → mảng phụ tinh tại chi đó. */
  phuTinh?: Record<DiaChi, PhuTinhInfo[]>;
  /** Đại Vận list — nếu có sẽ hiện badge ĐV trên mỗi cung. */
  daiVanList?: DaiVan[];
  /** Chỉ số Đại Vận hiện tại (1..12, 0 = chưa vào ĐV1). */
  currentDaiVanIndex?: number;
  /** Cung Lưu Niên năm hiện tại (chi của năm hiện tại). */
  cungLuuNien?: DiaChi;
  /** Mapping chi → tên giai đoạn vòng Tràng Sinh. */
  vongTrangSinh?: Record<DiaChi, VongTrangSinhName>;
  /** Vị trí Tuần — đứng giữa 2 chi. */
  tuan?: TuanTrietPos;
  /** Vị trí Triệt — đứng giữa 2 chi. */
  triet?: TuanTrietPos;
  /** Chi có sao Thiên Mã. */
  thienMa?: DiaChi;
  /** Vòng Bác Sĩ — 1 sao/cung. */
  vongBacSi?: Record<DiaChi, string>;
  /** Vòng Thái Tuế — 1 sao/cung. */
  vongThaiTue?: Record<DiaChi, string>;
  /** Phụ tinh đào hoa/quý/hung. */
  daoHoaQuyTinh?: Record<DiaChi, PhuTinhInfo[]>;
  /** Tiêu đề trên header. */
  title?: string;
  /** Phụ chú dưới figure. */
  caption?: string;
  /** Nội dung trung tâm 2×2 (lá số thật: hiện info; bài học: hiện gợi ý). */
  centerInfo?: React.ReactNode;
};

const DAC_BADGE: Record<DacHam, { label: string; cls: string }> = {
  "đắc":  { label: "đắc",  cls: "bg-teal-2 text-parchment" },
  "bình": { label: "bình", cls: "bg-ink-2/60 text-cream-2" },
  "hãm":  { label: "hãm",  cls: "bg-red-ink-2 text-parchment" },
};

// Viết tắt 12 giai đoạn vòng Tràng Sinh (cho hiển thị compact trong cell)
const TRANG_SINH_SHORT: Record<VongTrangSinhName, string> = {
  "Tràng Sinh": "Tr.Sinh", "Mộc Dục": "Mộc Dục", "Quan Đới": "Q.Đới",
  "Lâm Quan": "Lâm Q.",   "Đế Vượng": "Đế Vượng","Suy": "Suy",
  "Bệnh": "Bệnh",         "Tử": "Tử",             "Mộ": "Mộ",
  "Tuyệt": "Tuyệt",       "Thai": "Thai",         "Dưỡng": "Dưỡng",
};

export default function CungBieu({
  cungMenh = "Dần",
  cungThan,
  thapNhiCung,
  chinhTinh,
  phuTinh,
  daiVanList,
  currentDaiVanIndex,
  cungLuuNien,
  vongTrangSinh,
  tuan,
  triet,
  thienMa,
  vongBacSi,
  vongThaiTue,
  daoHoaQuyTinh,
  title = "Sơ đồ 12 cung — Bàn lá số Tử Vi",
  caption = "Bấm vào ô địa chi để xem ý nghĩa cung Tử Vi tương ứng.",
  centerInfo,
}: Props) {
  const [selectedChi, setSelectedChi] = useState<DiaChi | null>(null);

  // Mapping 12 cung — ưu tiên prop, nếu không thì tính từ cungMenh
  const cungMap = useMemo<Record<TenCung, DiaChi>>(
    () => thapNhiCung ?? anThapNhiCung(cungMenh),
    [thapNhiCung, cungMenh]
  );

  // Đảo ngược: chi → tên cung
  const chiToCungName = useMemo(() => invertCungMap(cungMap), [cungMap]);

  const selectedCung = selectedChi ? CUNG_LOOKUP[chiToCungName[selectedChi]] : null;

  return (
    <figure className="my-6 overflow-hidden rounded-lg border-2 border-gold-2 bg-parchment shadow-sm">
      <header className="bg-cream-2/50 px-4 py-3">
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      </header>

      <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start md:gap-5">
        {/* Wrapper cho phép scroll ngang trên mobile — giữ cells đọc được */}
        <div className="-mx-1 overflow-x-auto sm:mx-0 sm:overflow-visible">
        {/* Bảng 4×4 — min-w để mỗi cell tối thiểu ~115px trên mobile */}
        <div
          className="grid aspect-square w-full min-w-[460px] grid-cols-4 grid-rows-4 overflow-hidden rounded-md border border-ink-2/30 bg-cream sm:min-w-0"
          role="grid"
          aria-label="Bàn 12 cung Tử Vi"
        >
          {DIA_CHI.map((chi) => {
            const pos = CHI_GRID_POS[chi];
            const cungName = chiToCungName[chi];
            const isMenh = chi === (cungMap.Mệnh ?? cungMenh);
            const isThan = !!cungThan && chi === cungThan;
            const isSelected = selectedChi === chi;
            const isLuuNien = !!cungLuuNien && chi === cungLuuNien;
            const hanhColor = HANH_COLOR[CHI_HANH[chi]];
            // Tìm ĐV nào nằm ở chi này
            const dvAtChi = daiVanList?.find((d) => d.chi === chi);
            const isCurrentDV = dvAtChi && currentDaiVanIndex === dvAtChi.index;
            // Tuần / Triệt phủ chi này không?
            const hasTuan = tuan && (tuan.chi1 === chi || tuan.chi2 === chi);
            const hasTriet = triet && (triet.chi1 === chi || triet.chi2 === chi);
            const hasThienMa = thienMa === chi;
            const tsStage = vongTrangSinh?.[chi];
            return (
              <button
                key={chi}
                type="button"
                role="gridcell"
                aria-label={`Cung ${cungName} tại ${chi}`}
                aria-selected={isSelected}
                onClick={() => setSelectedChi((cur) => (cur === chi ? null : chi))}
                className={clsx(
                  "relative flex flex-col items-stretch justify-between border border-ink-2/15 p-1.5 text-left transition focus:outline-none",
                  "hover:bg-cream-2/60 focus-visible:bg-cream-2/70 focus-visible:ring-2 focus-visible:ring-red-ink-2/60",
                  isMenh && "ring-2 ring-inset ring-red-ink-2 bg-red-ink-2/8",
                  isThan && !isMenh && "ring-2 ring-inset ring-gold-2 bg-gold-2/10",
                  isSelected && !isMenh && !isThan && "bg-teal-2/15"
                )}
                style={{
                  gridColumnStart: pos.x + 1,
                  gridRowStart: pos.y + 1,
                }}
              >
                <div className="flex items-baseline justify-between gap-1">
                  <span
                    className="font-display text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: hanhColor.bg }}
                  >
                    {chi}
                  </span>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {dvAtChi && (
                      <span
                        className={clsx(
                          "rounded-sm px-1 py-px text-[8px] font-semibold tabular-nums",
                          isCurrentDV
                            ? "bg-gold-2 text-ink ring-1 ring-red-ink-2"
                            : "bg-ink-2/30 text-ink-2"
                        )}
                        title={`Đại Vận ${dvAtChi.index} · ${dvAtChi.ageStart}-${dvAtChi.ageEnd} tuổi`}
                      >
                        ĐV{dvAtChi.index}
                      </span>
                    )}
                    {isLuuNien && (
                      <span
                        className="rounded-sm bg-teal-2 px-1 py-px text-[8px] font-semibold text-parchment"
                        title="Cung Lưu Niên năm hiện tại"
                      >
                        LN
                      </span>
                    )}
                    {isMenh && (
                      <span className="rounded-sm bg-red-ink-2 px-1 py-px text-[8px] font-semibold text-parchment">
                        Mệnh
                      </span>
                    )}
                    {isThan && !isMenh && (
                      <span className="rounded-sm bg-gold-2 px-1 py-px text-[8px] font-semibold text-ink">
                        Thân
                      </span>
                    )}
                  </div>
                </div>

                {/* Chính tinh */}
                {chinhTinh && chinhTinh[chi].length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {chinhTinh[chi].map((sao) => (
                      <li
                        key={sao.name}
                        className="flex items-baseline gap-1 text-[10px] leading-tight"
                      >
                        <span className="font-display font-semibold text-ink truncate">
                          {sao.name}
                        </span>
                        <span
                          className={clsx(
                            "shrink-0 rounded-sm px-0.5 text-[7px] font-semibold uppercase",
                            DAC_BADGE[sao.dac].cls
                          )}
                          aria-label={`${sao.dac} địa`}
                        >
                          {sao.dac}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Phụ tinh — font nhỏ hơn, không có badge đắc/hãm */}
                <ul className="mt-1 flex flex-wrap gap-x-1 gap-y-0">
                  {phuTinh?.[chi].map((sao) => (
                    <li
                      key={`pt-${sao.name}`}
                      className={clsx(
                        "text-[9px] leading-tight",
                        sao.kind === "cát" && "text-teal-2",
                        sao.kind === "hung" && "text-red-ink-2",
                        sao.kind === "trung" && "text-ink-2"
                      )}
                      title={sao.shortDesc}
                    >
                      {sao.name}
                    </li>
                  ))}
                  {hasThienMa && (
                    <li className="text-[9px] leading-tight font-semibold text-gold" title="Thiên Mã — di động, đi xa">
                      Thiên Mã
                    </li>
                  )}
                  {daoHoaQuyTinh?.[chi].map((sao) => (
                    <li
                      key={`dh-${sao.name}`}
                      className={clsx(
                        "text-[9px] leading-tight",
                        sao.kind === "cát" && "text-teal-2",
                        sao.kind === "hung" && "text-red-ink-2",
                        sao.kind === "trung" && "text-ink-2"
                      )}
                      title={sao.shortDesc}
                    >
                      {sao.name}
                    </li>
                  ))}
                  {vongBacSi?.[chi] && (
                    <li className="text-[8.5px] leading-tight italic text-ink-2" title="Vòng Bác Sĩ">
                      {vongBacSi[chi]}
                    </li>
                  )}
                  {vongThaiTue?.[chi] && (
                    <li className="text-[8.5px] leading-tight italic text-gold-2" title="Vòng Thái Tuế">
                      {vongThaiTue[chi]}
                    </li>
                  )}
                </ul>

                {/* Tuần / Triệt badges — sao Không Vong */}
                {(hasTuan || hasTriet) && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {hasTuan && (
                      <span className="rounded-sm bg-ink-2 px-1 py-px text-[8px] font-semibold text-cream-2" title="Tuần Trung Không Vong">
                        Tuần
                      </span>
                    )}
                    {hasTriet && (
                      <span className="rounded-sm bg-red-ink-2 px-1 py-px text-[8px] font-semibold text-parchment" title="Triệt Lộ Không Vong">
                        Triệt
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto">
                  <div className="font-display text-[12px] font-semibold leading-tight text-ink">
                    {cungName}
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="text-[9px] uppercase tracking-wider text-ink-2">
                      {CHI_HANH[chi]} · {CHI_AM_DUONG[chi]}
                    </div>
                    {tsStage && (
                      <div className="text-[8px] italic text-teal-3" title={`Vòng Tràng Sinh: ${tsStage}`}>
                        {TRANG_SINH_SHORT[tsStage]}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Center 2×2 */}
          <div
            className="col-start-2 col-span-2 row-start-2 row-span-2 flex items-center justify-center border border-ink-2/15 bg-ink-2 p-2 text-center text-parchment"
          >
            {centerInfo ?? <DefaultCenter cungMenh={cungMap.Mệnh ?? cungMenh} />}
          </div>
        </div>
        </div>

        {/* Panel mô tả */}
        <CungPanel
          selected={selectedCung}
          selectedChi={selectedChi}
          stars={selectedChi && chinhTinh ? chinhTinh[selectedChi] : []}
          phuStars={selectedChi && phuTinh ? phuTinh[selectedChi] : []}
          onSelectByName={(name) => {
            const chi = cungMap[name];
            if (chi) setSelectedChi(chi);
          }}
          onClose={() => setSelectedChi(null)}
        />
      </div>

      <figcaption className="border-t border-gold/30 bg-cream/70 px-4 py-2 text-xs italic text-ink-2">
        {caption}
      </figcaption>
    </figure>
  );
}

function DefaultCenter({ cungMenh }: { cungMenh: DiaChi }) {
  return (
    <div className="space-y-1">
      <div className="font-deco text-2xl leading-none text-gold-3">命</div>
      <div className="text-[10px] uppercase tracking-wider text-cream-2">
        Cung Mệnh tại {cungMenh} ({CHI_CON_GIAP[cungMenh]})
      </div>
      <div className="mt-1 text-[10px] text-cream-2/85">
        Bấm vào các ô để xem 12 cung
      </div>
    </div>
  );
}

function CungPanel({
  selected,
  selectedChi,
  stars,
  phuStars,
  onSelectByName,
  onClose,
}: {
  selected: CungEntry | null;
  selectedChi: DiaChi | null;
  stars: ChinhTinhAt[];
  phuStars: PhuTinhInfo[];
  onSelectByName: (name: TenCung) => void;
  onClose: () => void;
}) {
  if (!selected || !selectedChi) {
    return (
      <div className="flex h-full flex-col rounded-md border border-dashed border-gold/60 bg-cream/60 p-4 text-sm leading-relaxed text-ink-2">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
          <Info size={12} />
          Hướng dẫn
        </div>
        <p>
          Bàn 12 cung là <strong>khung Tử Vi</strong> — mỗi ô là một địa chi
          + một cung chỉ một lĩnh vực đời sống.
        </p>
        <p className="mt-2">
          <span className="inline-block h-2 w-3 align-middle bg-red-ink-2 mr-1.5"></span>
          viền đỏ = <strong>cung Mệnh</strong>.
          <span className="inline-block h-2 w-3 align-middle bg-gold-2 mr-1.5 ml-3"></span>
          viền vàng = <strong>cung Thân</strong>.
        </p>
        <p className="mt-3 text-xs italic text-ink-2">
          Bấm vào một ô để xem ý nghĩa cung đó.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gold/60 bg-cream p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-deco text-2xl text-red-ink-2">
              {selected.han}
            </span>
            <h4 className="font-display text-lg font-semibold text-ink">
              Cung {selected.name}
            </h4>
          </div>
          <p className="text-xs text-ink-2">
            tại {selectedChi} · {CHI_HANH[selectedChi]} · {CHI_AM_DUONG[selectedChi]}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="rounded-full p-1 text-ink-2 hover:bg-cream-2/70"
        >
          <X size={14} />
        </button>
      </div>

      <p className="mb-2 text-xs uppercase tracking-wider font-semibold text-ink-2">
        {selected.domain}
      </p>

      {/* Chính tinh tại cung (nếu có truyền) */}
      {stars.length > 0 && (
        <div className="mb-3 rounded-md border border-teal-2/40 bg-teal-2/5 p-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-2">
            Chính tinh tại cung
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {stars.map((sao) => (
              <li key={sao.name} className="flex items-baseline gap-2">
                <span className="font-deco text-base text-red-ink-2 leading-none">
                  {sao.han}
                </span>
                <span className="font-display text-sm font-semibold text-ink">
                  {sao.name}
                </span>
                <span
                  className={clsx(
                    "shrink-0 rounded-sm px-1 py-px text-[9px] font-semibold uppercase",
                    DAC_BADGE[sao.dac].cls
                  )}
                >
                  {sao.dac}
                </span>
                <span className="text-[10px] text-ink-2">
                  · {sao.hanh} {sao.amDuong}
                </span>
                <span className="ml-auto text-[10px] italic text-ink-2 truncate">
                  {sao.shortDesc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phụ tinh tại cung */}
      {phuStars.length > 0 && (
        <div className="mb-3 rounded-md border border-gold/40 bg-cream/60 p-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">
            Phụ tinh tại cung
          </div>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {phuStars.map((sao) => (
              <li
                key={sao.name}
                className={clsx(
                  "rounded-md border px-1.5 py-0.5 text-[10px]",
                  sao.kind === "cát" && "border-teal-2/50 bg-teal-2/10 text-teal-2",
                  sao.kind === "hung" && "border-red-ink-2/50 bg-red-ink-2/10 text-red-ink-2",
                  sao.kind === "trung" && "border-ink-2/30 bg-ink-2/5 text-ink-2"
                )}
                title={sao.shortDesc}
              >
                <span className="font-deco mr-0.5">{sao.han}</span>{" "}
                <span className="font-semibold">{sao.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm leading-relaxed text-ink-2">
        <RichText text={selected.description} />
      </p>

      <div className="mt-3 rounded-md border-l-4 border-gold-2 bg-gold-2/10 p-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">
          Câu hỏi gợi ý khi đọc
        </div>
        <ul className="mt-1 space-y-0.5 text-xs text-ink-2">
          {selected.key_questions.map((q, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-gold">·</span>
              {q}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="text-ink-2">Đối xung:</span>
        <button
          type="button"
          onClick={() => onSelectByName(selected.doi_xung as TenCung)}
          className="rounded-full bg-red-ink-2/10 px-2 py-0.5 font-semibold text-red-ink-2 underline-offset-2 hover:underline"
        >
          {selected.doi_xung} →
        </button>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-ink-2">Tam hợp:</span>
        {selected.tam_hop.map((t) => {
          const isCurrent = t === selected.name;
          return (
            <button
              key={t}
              type="button"
              disabled={isCurrent}
              onClick={() => onSelectByName(t as TenCung)}
              className={clsx(
                "rounded-full px-2 py-0.5 font-semibold",
                isCurrent
                  ? "bg-teal-2/20 text-teal-2"
                  : "bg-teal-2/10 text-teal-2 hover:bg-teal-2/20"
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Bảng nhảy nhanh sang cung khác */}
      <div className="mt-4 border-t border-gold/30 pt-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
          Chuyển sang cung khác
        </div>
        <div className="flex flex-wrap gap-1">
          {TEN_12_CUNG.map((name) => {
            const isCurrent = name === selected.name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectByName(name)}
                aria-pressed={isCurrent}
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-xs transition",
                  isCurrent
                    ? "border-red-ink-2 bg-red-ink-2 text-parchment"
                    : "border-gold/50 bg-parchment text-ink-2 hover:border-red-ink-2 hover:text-red-ink-2"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** In đậm bằng cú pháp **bold** */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
