# Tử Vi Học — Học Tử Vi Đẩu Số

Ứng dụng web học Tử Vi Đẩu Số: **36 bài học** qua 5 module · **Lộ trình tương tác** với quiz tự chấm, sơ đồ Ngũ hành & 12 cung · **Công cụ lập lá số** tính **67 sao tự động** (14 chính tinh + 13 phụ tinh chính + Vòng Tràng Sinh + Vòng Bác Sĩ + Vòng Thái Tuế + 15 đào hoa/quý/hung + Tuần/Triệt + Đại Vận + Tứ Hóa năm).

> Toàn bộ chạy client-side · không server · không database · 0đ vận hành.

---

## 🚀 Bắt đầu nhanh

```bash
npm install
npm run dev
# → http://localhost:3000
```

Mở `http://localhost:3000` để xem ứng dụng. Trang chính có lộ trình 4 giai đoạn và dashboard tiến độ. Vào `/la-so` để thử lập lá số với ngày sinh của bạn.

## 📦 Stack

| Lớp | Công cụ |
|-----|---------|
| Frontend | **Next.js 16** (App Router) · React 19 |
| Styling | **Tailwind CSS 4** (CSS-first `@theme`) |
| Icons | lucide-react |
| State khách | `useSyncExternalStore` + localStorage (custom hooks) |
| Nội dung | JSON tĩnh — bundled tại build time |
| PWA | Manifest + service worker thủ công |
| Fonts | Noto Serif Display · Noto Sans · Ma Shan Zheng |

## 🗂 Cấu trúc

```
tuvi-app/
├── app/
│   ├── page.tsx                    # Homepage có dashboard tiến độ
│   ├── learn/[slug]/page.tsx       # 36 trang bài học (SSG)
│   ├── learn/[slug]/loading.tsx    # Skeleton khi navigate sang bài
│   ├── la-so/page.tsx              # Công cụ lập lá số
│   ├── la-so/loading.tsx           # Skeleton khi navigate sang la-so
│   ├── manifest.ts                 # PWA manifest
│   ├── layout.tsx                  # Fonts, metadata, viewport
│   └── globals.css                 # Tailwind theme + animations
├── components/                      # 12+ components, 4 interactive
├── data/
│   ├── giai-doan-1.json (6 bài)    # Module A — triết học
│   ├── giai-doan-2.json (5 bài)    # Module B — can chi
│   ├── giai-doan-3.json (8 bài)    # Module C — 12 cung & 14 chính tinh
│   ├── giai-doan-4.json (11 bài)   # Module D — thực hành + nâng cao
│   ├── giai-doan-5.json (4 bài)    # Module E — Mệnh ca cổ điển
│   └── 12-cung.json                # Ý nghĩa 12 cung
├── hooks/                           # useLocalStorage · useProgress · useStreak · useQuizProgress
├── lib/
│   ├── lessons.ts                  # Loader + roadmap
│   ├── types.ts                    # Shape của Lesson/Quiz/Visual
│   └── tuvi-calc.ts                # Can-chi · nạp âm · cung Mệnh · Cục · an 14 chính tinh
└── public/
    ├── icon.svg                    # Logo Âm dương Bát quái
    └── sw.js                       # Service worker
```

## 🧪 Scripts

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build (SSG 42 trang)
npm run start    # next start (sau khi build)
npm run lint     # eslint
```

Sau khi `npm run build`, toàn bộ 36 trang bài học + 3 trang static + `/manifest.webmanifest` + `_not-found` = 42 trang pre-render. App trở thành **static site** đầy đủ. Không cần Node.js runtime để chạy.

## 🌐 Triển khai

### Vercel (khuyến nghị, miễn phí)

**Cách 1 — Deploy qua Git (khuyến nghị, deploy tự động):**

1. Push code lên GitHub (private hoặc public đều được)
2. Vào [vercel.com](https://vercel.com/new) → đăng nhập bằng GitHub
3. **Import Project** → chọn repo `tuvi-app`
4. Framework Preset: tự nhận **Next.js** → giữ nguyên mọi setting
5. Click **Deploy** → đợi ~2 phút → có URL `https://your-project.vercel.app`

Từ giờ, mỗi `git push` vào nhánh main → Vercel tự build + deploy. Pull request có preview URL riêng.

**Cách 2 — Deploy qua CLI:**

```bash
npm install -g vercel
vercel login                 # đăng nhập một lần
vercel                       # deploy preview (vào nhánh dev)
vercel --prod                # deploy production
```

Lần đầu Vercel CLI sẽ hỏi:
- **Set up and deploy?** → Y
- **Which scope?** → tài khoản cá nhân
- **Link to existing project?** → N
- **Project name?** → `tuvi-hoc` (hoặc tên bạn muốn)
- **Directory?** → `.` (thư mục hiện tại)

**Tuỳ chọn:** đặt biến môi trường `NEXT_PUBLIC_SITE_URL` trong Vercel Dashboard → Settings → Environment Variables để OpenGraph dùng domain thật:

```
NEXT_PUBLIC_SITE_URL=https://tuvi-hoc.vercel.app
```

**Vercel Analytics:** đã cài sẵn (`@vercel/analytics`). Vào Vercel Dashboard → project → tab **Analytics** → bật **Web Analytics**. Hoàn toàn miễn phí gói Hobby — không cần thay đổi code thêm.

**Custom domain (tuỳ chọn):**

1. Mua domain (Namecheap, Cloudflare, Google Domains... ~250-500k VND/năm)
2. Vercel Dashboard → project → Settings → **Domains** → Add
3. Theo hướng dẫn cấu hình DNS (A record + CNAME)
4. Cập nhật `NEXT_PUBLIC_SITE_URL` → domain mới

### Static export ra host khác

App là pure static — có thể deploy lên bất kỳ static host (Netlify, Cloudflare Pages, GitHub Pages):

```bash
npm run build
# Output ở .next/ — Vercel/Netlify hiểu sẵn.
# Nếu muốn export thuần (không cần Node runtime),
# thêm `output: 'export'` vào next.config.ts rồi build — out/ chứa file static.
```

## 📱 PWA (offline)

App có manifest + service worker đơn giản:
- **Manifest** (`/manifest.webmanifest`) cho phép "Cài đặt" trên điện thoại
- **Service worker** (`/sw.js`) cache theo chiến lược **network-first cho HTML/JS/CSS**, **cache-first cho ảnh/font**
- Chỉ đăng ký ở **production** (`NODE_ENV=production`) — tránh xung đột HMR khi dev

Sau lần truy cập đầu, các trang đã xem được cache → mở lại khi offline vẫn dùng được.

### Cách test PWA offline trên máy

```bash
npm run build
npm run start                # phải dùng start, KHÔNG dùng dev (dev không đăng ký SW)
# → http://localhost:3000
```

Sau khi mở app trong Chrome/Edge:

1. Truy cập một vài bài học bất kỳ + trang `/la-so` để cache cho service worker
2. Mở **DevTools** (F12) → tab **Application** → **Service Workers** — kiểm tra `sw.js` đã active
3. Vẫn ở DevTools, chuyển sang tab **Network** → đổi throttling thành **Offline**
4. Reload bất kỳ trang nào đã xem → vẫn vào được, có nội dung đầy đủ
5. Thử navigate sang bài học chưa từng xem → cũng vào được (HTML đã prerender, JS chia chunk theo bài)

Tip cài app: Chrome → menu ⋮ → **Cài đặt Tử Vi Học…** (hoặc icon ⊕ ở thanh URL). Trên iOS Safari: **Share** → **Add to Home Screen**.

### Sau khi deploy: cập nhật service worker

Khi bạn deploy phiên bản mới và user đã có SW cũ, browser sẽ tự **fetch lại `sw.js`** trong mỗi navigation. SW mới được install → đợi old clients đóng → activate. Nếu muốn force update ngay, mở DevTools → Application → **skipWaiting**.

## 📚 Nội dung

36 bài chia 5 module:

| Module | Bài | Trọng tâm |
|--------|-----|-----------|
| **A** — Nền tảng triết học | 6 | Âm dương · Ngũ hành · Tương sinh-khắc · Thái cực · Tứ tượng · Bảng quy chiếu |
| **B** — Can Chi & Nạp âm | 5 | 10 thiên can · 12 địa chi · Lục thập hoa giáp · Nạp âm · Giờ địa chi |
| **C** — 12 cung & 14 chính tinh | 8 | Bàn lá số · Mệnh-Thân · Đối xung · Tam phương tứ chính · 14 chính tinh · Tứ Hóa |
| **D** — Thực hành lập lá số | 11 | Đại vận · An 14 chính tinh · Phụ tinh · Quy trình 7 bước · Sai lầm · Case study · Tuần Triệt · Vòng Tràng Sinh · Vòng Bác Sĩ-Thái Tuế · Đào hoa quý · Hung tinh |
| **E** — Mệnh ca cổ điển | 4 | Nam Mệnh ca (14 sao) · Nữ Mệnh ca (14 sao) — cách đọc lời cổ trong bối cảnh hiện đại |

## 🧮 Logic Tử Vi (`lib/tuvi-calc.ts`)

Module thuần TS, không phụ thuộc UI, dùng được cho cả server và client. **Đã cross-check với Tử Vi Đẩu Số Tân Biên (1956) và Toàn Thư (Vũ Tài Lục)**.

- **Năm sinh → can chi:** công thức mod 10 / 12 dựa năm gốc Giáp Tý (4 SCN)
- **Năm sinh → nạp âm:** lookup 60 cặp / 30 nạp âm
- **Tháng + giờ → cung Mệnh, cung Thân:** công thức truyền thống Tử Vi
- **Can năm + cung Mệnh → Cục:** bảng tra 5 cặp can × 12 chi → Cục số (2/3/4/5/6)
- **Cục + ngày sinh âm → vị trí Tử Vi:** công thức `Q=⌈D/C⌉, R=Q·C−D`; R chẵn → thuận R, R lẻ → ngược R từ Dần
- **Vị trí Tử Vi → vị trí Thiên Phủ:** `(4 − pos) mod 12` (đối xứng qua trục Dần-Thân, đồng cung tại Dần/Thân — theo Tân Biên §6)
- **An 14 chính tinh:** offset cố định cho 6 sao chòm Tử Vi (đi ngược) + 8 sao chòm Thiên Phủ (đi thuận)
- **13 phụ tinh chính:** Tả-Hữu, Văn Xương-Khúc, Lộc Tồn, Khôi Việt, Hỏa-Linh, Kình-Đà, Không-Kiếp (mỗi sao công thức riêng)
- **Vòng Tràng Sinh (12 sao theo Cục) + Vòng Bác Sĩ (12 sao theo Lộc Tồn) + Vòng Thái Tuế (12 sao theo chi năm)**
- **15 đào hoa/quý/hung tinh:** Hồng Loan, Thiên Hỷ, Tam Thai, Bát Tọa, Long Trì, Phượng Các, Thiên Đức, Nguyệt Đức, Thiên Khốc, Thiên Hư, Thiên Hình, Thiên Riêu, Thiên Y, Thiên Thương, Thiên Sứ
- **Tuần Triệt (theo block 10 năm hoa giáp + can) · Thiên Mã (tam hợp chi)**
- **Đại Vận hiện tại** theo tuổi + hướng âm (Dương Nam/Âm Nữ thuận, Âm Nam/Dương Nữ nghịch)
- **Tứ Hóa năm hiện tại** (Lộc-Quyền-Khoa-Kỵ theo can năm hiện tại)
- **Đắc/bình/hãm:** đánh giá theo Ngũ hành sinh-khắc giữa hành sao và hành chi

## 🗃 Lưu trữ tiến độ

Toàn bộ tiến độ học lưu trên **localStorage**, không đồng bộ cloud:

| Key | Nội dung |
|-----|----------|
| `tuvi:quiz-progress` | `Record<lessonId, { answers, correctCount, completed, completedAt }>` |
| `tuvi:study-meta` | `{ lastStudyDate, streakDays, bestStreak }` |

Xóa cả hai key (Browser DevTools → Application → Local Storage) để reset toàn bộ.

## 📝 Nguồn nội dung

Nội dung bài học được viết theo nguyên tắc trong `CLAUDE.md`:
- Mở đầu bằng **câu chuyện/câu hỏi**, không định nghĩa khô
- Mỗi khái niệm có **ví dụ thực tế**
- Chia nhỏ ý, mỗi ý 1 dòng/bullet
- Quan hệ/trình tự/so sánh → có **visual** đi kèm (bảng, sơ đồ, ngũ giác)

## ⚠️ Giới hạn hiện tại

- **Đắc/hãm địa** tính theo Ngũ hành cơ bản (chi sinh sao → đắc, chi khắc sao → hãm), chưa đầy đủ như bảng truyền thống cho mọi sao
- **Xuất lá số PNG/PDF** chưa có (đang lên kế hoạch — kiến trúc sẵn sàng cho `html2canvas`)
- **Đồng bộ tiến độ cloud** chưa có — tiến độ chỉ lưu local, mất khi xóa browser data

Các tính năng trên có thể bổ sung — kiến trúc đã sẵn sàng.

## 📄 License

Dự án cá nhân — học tập và chia sẻ tự do. Vui lòng ghi nguồn nếu fork để giảng dạy.
