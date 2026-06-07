import type { Metadata, Viewport } from "next";
import { Noto_Serif_Display, Noto_Sans, Ma_Shan_Zheng } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans-vn",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Tử Vi Học — Học Tử Vi Đẩu Số từ cơ bản đến thực hành",
    template: "%s",
  },
  description:
    "Ứng dụng học Tử Vi Đẩu Số: 36 bài học qua 5 giai đoạn — sơ đồ tương tác, quiz tự chấm, công cụ lập lá số tính 67 sao tự động. Học offline, miễn phí.",
  applicationName: "Tử Vi Học",
  authors: [{ name: "Tử Vi Học" }],
  keywords: [
    "Tử Vi",
    "Tử Vi Đẩu Số",
    "Lập lá số",
    "Âm dương",
    "Ngũ hành",
    "Thiên can",
    "Địa chi",
    "Học Tử Vi",
  ],
  openGraph: {
    title: "Tử Vi Học — Học Tử Vi Đẩu Số",
    description:
      "Lộ trình 5 giai đoạn, 36 bài học có sơ đồ tương tác + công cụ lập lá số (67 sao tự động). Học offline, miễn phí.",
    type: "website",
    locale: "vi_VN",
    siteName: "Tử Vi Học",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tử Vi Học — Học Tử Vi Đẩu Số",
    description:
      "36 bài học · sơ đồ tương tác · công cụ lập lá số 67 sao. Học offline, miễn phí.",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F4F41" },
    { media: "(prefers-color-scheme: dark)", color: "#0F4F41" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${notoSerifDisplay.variable} ${notoSans.variable} ${maShanZheng.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-parchment text-ink font-body">
        {children}
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
