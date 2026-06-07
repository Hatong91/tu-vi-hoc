import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Bật View Transitions API native cho navigation client-side.
    // Next.js sẽ tự bọc các điều hướng trong startViewTransition().
    // Browser không hỗ trợ → fallback yên lặng, không lỗi.
    viewTransition: true,
  },
};

export default nextConfig;
