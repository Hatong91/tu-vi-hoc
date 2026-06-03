import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tử Vi Học — Học Tử Vi Đẩu Số",
    short_name: "Tử Vi Học",
    description:
      "Lộ trình 4 giai đoạn · 24 bài học · công cụ lập lá số. Học offline, miễn phí.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF0D7",
    theme_color: "#0F4F41",
    orientation: "portrait-primary",
    lang: "vi",
    categories: ["education", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Bắt đầu học",
        short_name: "Học",
        description: "Bài đầu tiên — Âm dương",
        url: "/learn/am-duong",
      },
      {
        name: "Lập lá số",
        short_name: "Lá số",
        description: "Công cụ lập lá số Tử Vi",
        url: "/la-so",
      },
    ],
  };
}
