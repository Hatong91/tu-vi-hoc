/* Service Worker đơn giản cho Tử Vi Học.
 *
 * Chiến lược cache:
 * - HTML/JS/CSS: network-first, fallback cache (giúp app cập nhật được khi online,
 *   mà vẫn mở được offline).
 * - Ảnh & font: cache-first (ít đổi, tiết kiệm băng thông).
 * - Bỏ qua chunk /api/, /_next/data — luôn đi mạng.
 *
 * Không dùng workbox vì project Next.js 16 chưa có plugin chính thức.
 */

const CACHE = "tuvi-hoc-v1";
const CORE_ASSETS = ["/", "/la-so", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Best-effort: nếu offline ngay từ đầu, vẫn cho phép install.
      await Promise.allSettled(CORE_ASSETS.map((p) => cache.add(p)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Chỉ xử lý cùng origin và GET
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Bỏ qua một số đường dẫn động
  if (url.pathname.startsWith("/_next/data") || url.pathname.startsWith("/api/")) return;

  // Ảnh và font — cache-first
  const dest = req.destination;
  if (dest === "image" || dest === "font") {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Còn lại — network-first
  event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok && fresh.type !== "opaque") {
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Trang chủ làm fallback cuối cùng cho navigation
    if (req.mode === "navigate") {
      const home = await cache.match("/");
      if (home) return home;
    }
    return Response.error();
  }
}
