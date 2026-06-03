import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-gold-2 bg-ink-2 text-parchment">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="Tử Vi Học">
          <Logo />
          <div className="leading-tight min-w-0">
            <div className="font-display text-sm font-semibold tracking-wide text-gold-3 sm:text-base">
              TỬ VI ĐẨU SỐ
            </div>
            <div className="hidden text-[10px] uppercase tracking-[0.2em] text-cream-2/80 sm:block">
              Học từ nền tảng đến thực hành
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5 text-xs font-medium sm:gap-1 sm:text-sm">
          <NavLink href="/">Trang chủ</NavLink>
          <NavLink href="/learn/am-duong">Bài học</NavLink>
          <NavLink href="/la-so">Lập lá số</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1.5 text-parchment transition hover:bg-ink/40 hover:text-gold-3 sm:px-3"
    >
      {children}
    </Link>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 64 64" className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden>
      <defs>
        <radialGradient id="logoGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5C840" />
          <stop offset="100%" stopColor="#C9881A" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#logoGold)" stroke="#E8A820" strokeWidth="1.5" />
      {/* Âm dương ở giữa */}
      <path
        d="M32 8 a24 24 0 0 1 0 48 a12 12 0 0 1 0 -24 a12 12 0 0 0 0 -24 z"
        fill="#2A1500"
      />
      <circle cx="32" cy="20" r="3" fill="#FAF0D7" />
      <circle cx="32" cy="44" r="3" fill="#2A1500" />
      {/* 8 vạch quái — chỉ chấm */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = 28;
        const rad = (deg * Math.PI) / 180;
        const cx = 32 + Math.cos(rad) * r;
        const cy = 32 + Math.sin(rad) * r;
        return <circle key={deg} cx={cx} cy={cy} r="1.2" fill="#2A1500" />;
      })}
    </svg>
  );
}
