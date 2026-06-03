"use client";

import { useState } from "react";
import clsx from "clsx";
import { Sparkles, RotateCcw, ChevronRight } from "lucide-react";
import {
  lapLaSoCoBan,
  DIA_CHI,
  CHI_CON_GIAP,
  type LaSoBasic,
  type DiaChi,
} from "@/lib/tuvi-calc";
import CungBieu from "./CungBieu";

const NAM_NOW = new Date().getFullYear();

const GIO_OPTIONS = DIA_CHI.map((chi, i) => {
  const start = (i * 2 + 23) % 24; // Tý=23, Sửu=1, ...
  const end = (start + 2) % 24;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    chi,
    label: `${chi} (${pad(start)}h - ${pad(end)}h)`,
    // Đại diện giờ giữa khung: chiGioIndex sẽ trả về đúng chi này
    hour: (start + 1) % 24,
  };
});

export default function LaSoForm() {
  const [ngay, setNgay] = useState<string>("15");
  const [thang, setThang] = useState<string>("6");
  const [nam, setNam] = useState<string>("1990");
  const [gioChi, setGioChi] = useState<DiaChi>("Ngọ");
  const [gioiTinh, setGioiTinh] = useState<"Nam" | "Nữ">("Nam");
  const [result, setResult] = useState<LaSoBasic | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const dN = parseInt(ngay, 10);
    const dT = parseInt(thang, 10);
    const dY = parseInt(nam, 10);

    if (!dN || dN < 1 || dN > 31) {
      setError("Ngày sinh phải trong khoảng 1–31.");
      return;
    }
    if (!dT || dT < 1 || dT > 12) {
      setError("Tháng sinh phải trong khoảng 1–12.");
      return;
    }
    if (!dY || dY < 1900 || dY > NAM_NOW) {
      setError(`Năm sinh phải trong khoảng 1900–${NAM_NOW}.`);
      return;
    }

    const gioOption = GIO_OPTIONS.find((g) => g.chi === gioChi);
    if (!gioOption) {
      setError("Giờ sinh không hợp lệ.");
      return;
    }

    const laSo = lapLaSoCoBan({
      ngaySinh: dN,
      thangSinh: dT,
      namSinh: dY,
      gioSinh: gioOption.hour,
      gioiTinh,
    });
    setResult(laSo);

    // Scroll xuống kết quả sau khi submit
    requestAnimationFrame(() => {
      document.getElementById("la-so-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function onReset() {
    setResult(null);
    setError(null);
  }

  return (
    <>
      {/* Form — nền teal2 theo design system */}
      <section
        aria-labelledby="form-heading"
        className="rounded-lg bg-teal-2 p-5 text-parchment shadow-sm md:p-6"
      >
        <header className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-gold-3" />
          <h2
            id="form-heading"
            className="font-display text-lg font-semibold text-gold-3"
          >
            Thông tin sinh
          </h2>
        </header>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Ngày sinh"
            value={ngay}
            onChange={setNgay}
            min={1}
            max={31}
            placeholder="1 – 31"
          />
          <NumberField
            label="Tháng sinh (âm lịch)"
            value={thang}
            onChange={setThang}
            min={1}
            max={12}
            placeholder="1 – 12"
            hint="Tháng theo âm lịch"
          />
          <NumberField
            label="Năm sinh (dương lịch)"
            value={nam}
            onChange={setNam}
            min={1900}
            max={NAM_NOW}
            placeholder="1900 – hiện tại"
            className="sm:col-span-2"
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream-2">
              Giờ sinh
            </span>
            <select
              value={gioChi}
              onChange={(e) => setGioChi(e.target.value as DiaChi)}
              className="rounded-md border border-gold/50 bg-ink-2 px-3 py-2 text-sm text-parchment focus:border-gold-2 focus:outline-none"
            >
              {GIO_OPTIONS.map((g) => (
                <option key={g.chi} value={g.chi}>
                  {g.label}
                </option>
              ))}
            </select>
            <span className="text-[10px] italic text-cream-2/80">
              Nếu sinh sát giờ giao, thử cả hai canh để so sánh
            </span>
          </label>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-xs font-semibold uppercase tracking-wider text-cream-2">
              Giới tính
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["Nam", "Nữ"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGioiTinh(g)}
                  className={clsx(
                    "rounded-md border px-3 py-2 text-sm font-semibold transition",
                    gioiTinh === g
                      ? "border-gold-2 bg-gold-2 text-ink"
                      : "border-gold/40 bg-ink-2 text-cream-2 hover:border-gold-2"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <div className="sm:col-span-2 rounded-md border border-red-ink bg-red-ink-2/30 px-3 py-2 text-sm text-parchment">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-red-ink-2 px-5 py-2.5 text-sm font-semibold text-parchment shadow-sm transition hover:bg-red-ink sm:flex-none sm:min-w-[200px]"
            >
              Lập lá số
              <ChevronRight size={16} />
            </button>
            {result && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-gold/50 bg-ink-2 px-4 py-2.5 text-sm font-medium text-cream-2 transition hover:border-gold-2"
              >
                <RotateCcw size={14} />
                Xoá kết quả
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Kết quả */}
      {result && (
        <section
          id="la-so-result"
          aria-labelledby="result-heading"
          className="mt-6 space-y-5 animate-page-in"
        >
          <header className="rounded-lg border border-gold/50 bg-cream p-4">
            <h2
              id="result-heading"
              className="font-display text-xl font-semibold text-ink"
            >
              Lá số của bạn
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              Sinh ngày <strong>{result.ngaySinh}/{result.thangSinh}/{result.namSinh}</strong>
              {" "}· giờ <strong>{result.chiGio} ({CHI_CON_GIAP[result.chiGio]})</strong>
              {" "}· <strong>{result.gioiTinh}</strong>
            </p>
          </header>

          <BasicInfo result={result} />

          <CungBieu
            cungMenh={result.cungMenh}
            cungThan={result.cungThan}
            thapNhiCung={result.thapNhiCung}
            chinhTinh={result.chinhTinh}
            title="Bàn 12 cung & 14 chính tinh của bạn"
            caption="Mỗi ô hiện chính tinh (kèm đắc/bình/hãm địa). Viền đỏ = Mệnh, viền vàng = Thân. Bấm vào ô để xem chi tiết."
            centerInfo={<CenterBlock result={result} />}
          />

          <p className="rounded-md border-l-4 border-teal-2 bg-cream-2/40 p-3 text-sm leading-relaxed text-ink-2">
            <strong className="text-ink">Lưu ý:</strong> đây là lá số có{" "}
            <strong>14 chính tinh</strong> + 12 cung. Các <strong>phụ tinh</strong>{" "}
            (Tả Phụ - Hữu Bật, Văn Xương - Khúc, Lộc Tồn, Khôi Việt, Hỏa Linh...) và{" "}
            <strong>Tứ Hóa</strong> sẽ được tích hợp ở bản tiếp theo. Đắc/hãm địa hiện
            tính theo Ngũ hành cơ bản (chi sinh sao → đắc, chi khắc sao → hãm).
          </p>
        </section>
      )}
    </>
  );
}

function BasicInfo({ result }: { result: LaSoBasic }) {
  const cards: Array<{ label: string; value: string; note?: string }> = [
    {
      label: "Năm sinh (can chi)",
      value: `${result.thienCan} ${result.diaChi}`,
      note: `${result.conGiap} · ${result.canAmDuong}-${result.chiAmDuong}`,
    },
    {
      label: "Nạp âm — Bản mệnh",
      value: result.napAm.name,
      note: `Hành ${result.napAm.hanh}`,
    },
    {
      label: "Cục",
      value: result.cuc.name,
      note: `Đại Vận 1 từ ${result.cuc.cucSo} tuổi`,
    },
    {
      label: "Vị trí Tử Vi · Thiên Phủ",
      value: `${result.tuViPos} · ${result.thienPhuPos}`,
      note:
        result.tuViPos === result.thienPhuPos
          ? "Song đế đồng cung — hiếm gặp"
          : "Hai đế tinh trên bàn",
    },
    {
      label: "Cung Mệnh",
      value: result.cungMenh,
      note: `${result.thapNhiCung.Mệnh === result.cungMenh ? "Hợp lệ" : ""}`,
    },
    {
      label: "Cung Thân",
      value: result.cungThan,
      note: result.cungMenh === result.cungThan ? "Mệnh & Thân đồng cung" : "",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-gold/50 bg-cream p-4"
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">
            {c.label}
          </div>
          <div className="mt-1 font-display text-xl font-semibold text-ink">
            {c.value}
          </div>
          {c.note && (
            <div className="mt-0.5 text-xs text-ink-2">{c.note}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function CenterBlock({ result }: { result: LaSoBasic }) {
  return (
    <div className="space-y-1 text-center">
      <div className="font-deco text-2xl leading-none text-gold-3">命</div>
      <div className="font-display text-sm font-semibold text-parchment">
        {result.thienCan} {result.diaChi}
      </div>
      <div className="text-[10px] text-cream-2">
        {result.napAm.name}
      </div>
      <div className="text-[10px] text-gold-3">
        {result.cuc.name}
      </div>
      <div className="text-[10px] text-cream-2/85">
        {result.gioiTinh} · {result.conGiap}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={clsx("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-cream-2">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        placeholder={placeholder}
        required
        className="rounded-md border border-gold/50 bg-ink-2 px-3 py-2 text-sm text-parchment placeholder:text-cream-2/50 focus:border-gold-2 focus:outline-none"
      />
      {hint && <span className="text-[10px] italic text-cream-2/80">{hint}</span>}
    </label>
  );
}
