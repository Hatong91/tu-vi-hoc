import clsx from "clsx";

type Props = {
  value: number;
  max: number;
  label?: string;
  className?: string;
  tone?: "gold" | "teal";
  /** Đặt `true` khi đặt trên nền tối (teal-2, ink-2) — label & số % dùng màu sáng để đảm bảo contrast. */
  onDark?: boolean;
};

export default function ProgressBar({
  value,
  max,
  label,
  className,
  tone = "gold",
  onDark = false,
}: Props) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  const fillClass = tone === "gold" ? "bg-gold-2" : "bg-teal-3";
  const labelClass = onDark ? "text-cream-2" : "text-ink-2";
  const trackClass = onDark
    ? "bg-ink-2/60 border-gold/50"
    : "bg-cream-2/60 border-gold/40";

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <div
          className={clsx(
            "flex items-baseline justify-between mb-1.5 text-xs font-medium",
            labelClass
          )}
        >
          <span>{label}</span>
          <span className="tabular-nums">
            {value}/{max} · {percent}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={clsx(
          "h-2 w-full rounded-full overflow-hidden border",
          trackClass
        )}
      >
        <div
          className={clsx("h-full transition-[width] duration-500 ease-out", fillClass)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
