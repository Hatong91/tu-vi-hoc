import phase1 from "@/data/giai-doan-1.json";
import phase2 from "@/data/giai-doan-2.json";
import phase3 from "@/data/giai-doan-3.json";
import phase4 from "@/data/giai-doan-4.json";
import phase5 from "@/data/giai-doan-5.json";
import type { Lesson, PhaseFile, PhaseInfo } from "./types";

const phases: PhaseFile[] = [
  phase1 as PhaseFile,
  phase2 as PhaseFile,
  phase3 as PhaseFile,
  phase4 as PhaseFile,
  phase5 as PhaseFile,
];

export function getAllPhases(): PhaseInfo[] {
  return phases.map((p) => p.phase);
}

export function getAllLessons(): Lesson[] {
  return phases.flatMap((p) => p.lessons);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.slug === slug);
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  const p = phases.find((p) => p.phase.id === phaseId);
  return p ? p.lessons : [];
}

/** Toàn bộ 4 giai đoạn được liệt kê cho Homepage — chỉ giai đoạn 1 có nội dung trong Phase 1 dev. */
export const PHASE_ROADMAP: Array<PhaseInfo & { available: boolean }> = [
  {
    id: "gd-1",
    title: "Giai đoạn 1 — Nền tảng triết học",
    subtitle: "Âm dương · Ngũ hành · Tương sinh tương khắc",
    summary:
      "Hiểu hai khái niệm gốc của Tử Vi: Âm dương và Ngũ hành. Đây là chìa khóa để đọc mọi sao, mọi cung sau này.",
    modules: ["A"],
    available: true,
  },
  {
    id: "gd-2",
    title: "Giai đoạn 2 — Thiên can & Địa chi",
    subtitle: "10 Thiên can · 12 Địa chi · Lục thập hoa giáp · Nạp âm",
    summary:
      "Bộ khung thời gian của Tử Vi. Học can chi để hiểu năm/tháng/giờ trong lá số, và tra mệnh Ngũ hành từ năm sinh.",
    modules: ["B"],
    available: true,
  },
  {
    id: "gd-3",
    title: "Giai đoạn 3 — 12 cung & 14 chính tinh",
    subtitle: "Bàn lá số · Cung Mệnh · Đối xung · Tam hợp · Chính tinh",
    summary:
      "Cấu trúc lá số Tử Vi: 12 cung phân định lĩnh vực đời sống, 14 chính tinh chủ vận mệnh. Kèm công cụ lập lá số ở /la-so.",
    modules: ["C"],
    available: true,
  },
  {
    id: "gd-4",
    title: "Giai đoạn 4 — Thực hành lập lá số & đọc vận hạn",
    subtitle: "Cục số · Đại vận · Lưu niên · Tiểu vận · Đọc lá số mẫu",
    summary:
      "Tổng hợp toàn bộ kiến thức để tự lập và đọc một lá số Tử Vi hoàn chỉnh — bao gồm hệ thống vận hạn theo thời gian.",
    modules: ["D"],
    available: true,
  },
  {
    id: "gd-5",
    title: "Giai đoạn 5 — Mệnh ca cổ điển",
    subtitle: "Nam Mệnh ca · Nữ Mệnh ca · 14 chính tinh tại Mệnh",
    summary:
      "Bộ ca quyết cổ truyền mô tả số phận khi mỗi chính tinh đóng Mệnh — chia riêng Nam và Nữ. Học cách đọc lời cổ trong bối cảnh hiện đại.",
    modules: ["E"],
    available: true,
  },
];
