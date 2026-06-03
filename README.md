# Tử Vi Học — Học Tử Vi Đẩu Số

Ứng dụng web học Tử Vi Đẩu Số: **24 bài học** qua 4 module · **Lộ trình tương tác** với quiz tự chấm, sơ đồ Ngũ hành & 12 cung · **Công cụ lập lá số** tính 14 chính tinh tự động.

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
│   ├── learn/[slug]/page.tsx       # 24 trang bài học (SSG)
│   ├── la-so/page.tsx              # Công cụ lập lá số
│   ├── manifest.ts                 # PWA manifest
│   ├── layout.tsx                  # Fonts, metadata, viewport
│   └── globals.css                 # Tailwind theme + animations
├── components/                      # 12+ components, 4 interactive
├── data/
│   ├── giai-doan-1.json (6 bài)    # Module A — triết học
│   ├── giai-doan-2.json (5 bài)    # Module B — can chi
│   ├── giai-doan-3.json (8 bài)    # Module C — 12 cung & 14 chính tinh
│   ├── giai-doan-4.json (5 bài)    # Module D — thực hành
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
npm run build    # next build (SSG 30 trang)
npm run start    # next start (sau khi build)
npm run lint     # eslint
```

Sau khi `npm run build`, toàn bộ 24 trang bài học được pre-render và app trở thành **static site** đầy đủ. Không cần Node.js runtime để chạy.

## 🌐 Triển khai

### Vercel (khuyến nghị, miễn phí)

```bash
npm install -g vercel
vercel --prod
```

Lần đầu Vercel sẽ hỏi:
- **Set up and deploy?** → Y
- **Which scope?** → tài khoản cá nhân
- **Link to existing project?** → N
- **Project name?** → `tuvi-hoc` (hoặc tên bạn muốn)
- **Directory?** → `.` (thư mục hiện tại)

Sau lần đầu, mỗi lần deploy tiếp chỉ cần `vercel --prod`.

**Tuỳ chọn:** đặt biến môi trường `NEXT_PUBLIC_SITE_URL` trong Vercel Dashboard để OpenGraph dùng domain thật:

```
NEXT_PUBLIC_SITE_URL=https://tuvi-hoc.vercel.app
```

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

## 📚 Nội dung

24 bài chia 4 module:

| Module | Bài | Trọng tâm |
|--------|-----|-----------|
| **A** — Nền tảng triết học | 6 | Âm dương · Ngũ hành · Tương sinh-khắc · Thái cực · Tứ tượng · Bảng quy chiếu |
| **B** — Can Chi & Nạp âm | 5 | 10 thiên can · 12 địa chi · Lục thập hoa giáp · Nạp âm · Giờ địa chi |
| **C** — 12 cung & 14 chính tinh | 8 | Bàn lá số · Mệnh-Thân · Đối xung · Tam phương tứ chính · 14 chính tinh · Tứ Hóa |
| **D** — Thực hành | 5 | Đại vận · An sao chính tinh · Phụ tinh · Quy trình 7 bước · Sai lầm thường gặp |

## 🧮 Logic Tử Vi (`lib/tuvi-calc.ts`)

Module thuần TS, không phụ thuộc UI, dùng được cho cả server và client:

- **Năm sinh → can chi:** công thức mod 10 / 12 dựa năm gốc Giáp Tý (4 SCN)
- **Năm sinh → nạp âm:** lookup 60 cặp / 30 nạp âm
- **Tháng + giờ → cung Mệnh, cung Thân:** công thức truyền thống Tử Vi
- **Can năm + cung Mệnh → Cục:** bảng tra 5 cặp can × 12 chi → Cục số (2/3/4/5/6)
- **Cục + ngày sinh âm → vị trí Tử Vi:** công thức `Q=⌈D/C⌉, R=Q·C−D`; R chẵn → thuận R, R lẻ → ngược R từ Dần
- **Vị trí Tử Vi → vị trí Thiên Phủ:** `(10 − pos) mod 12` (đối xứng qua trục Tỵ-Hợi)
- **An 14 chính tinh:** offset cố định cho 6 sao chòm Tử Vi (đi ngược) + 8 sao chòm Thiên Phủ (đi thuận)
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

- **Đắc/hãm địa** tính theo Ngũ hành cơ bản (chi sinh sao → đắc, chi khắc sao → hãm), chưa đầy đủ như bảng truyền thống
- **Phụ tinh** (Tả-Hữu, Văn Xương-Khúc, Lộc Tồn, Khôi Việt, Hỏa-Linh, Kình-Đà) chưa được an tự động
- **Tứ Hóa năm sinh & năm hiện tại** chưa hiển thị trên lá số
- **Đại vận** mới có công thức trong bài học, chưa hiện trên bàn lá số

Các tính năng trên có thể bổ sung — kiến trúc đã sẵn sàng.

## 📄 License

Dự án cá nhân — học tập và chia sẻ tự do. Vui lòng ghi nguồn nếu fork để giảng dạy.
