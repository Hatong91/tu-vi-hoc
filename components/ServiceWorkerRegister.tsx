"use client";

import { useEffect } from "react";

/**
 * Đăng ký service worker đơn giản trên client.
 * Chỉ chạy ở production để tránh xung đột với HMR của next dev.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        // Lặng — không phá vỡ trải nghiệm nếu SW không đăng ký được
        console.warn("[SW] register failed", err);
      }
    };
    // Đợi window load để không block first paint
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
