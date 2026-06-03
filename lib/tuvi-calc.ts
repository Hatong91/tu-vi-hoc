/**
 * Logic tính toán Tử Vi cơ bản — không phụ thuộc DOM/React.
 * Có thể dùng cho cả Server Component và Client Component.
 */

export const THIEN_CAN = [
  "Giáp", "Ất", "Bính", "Đinh", "Mậu",
  "Kỷ", "Canh", "Tân", "Nhâm", "Quý",
] as const;
export type ThienCan = (typeof THIEN_CAN)[number];

export const DIA_CHI = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ",
  "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
] as const;
export type DiaChi = (typeof DIA_CHI)[number];

export type Hanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
export type AmDuong = "Âm" | "Dương";

export const CAN_HANH: Record<ThienCan, Hanh> = {
  "Giáp": "Mộc", "Ất": "Mộc",
  "Bính": "Hỏa", "Đinh": "Hỏa",
  "Mậu": "Thổ", "Kỷ": "Thổ",
  "Canh": "Kim", "Tân": "Kim",
  "Nhâm": "Thủy", "Quý": "Thủy",
};
export const CAN_AM_DUONG: Record<ThienCan, AmDuong> = {
  "Giáp": "Dương", "Ất": "Âm",
  "Bính": "Dương", "Đinh": "Âm",
  "Mậu": "Dương", "Kỷ": "Âm",
  "Canh": "Dương", "Tân": "Âm",
  "Nhâm": "Dương", "Quý": "Âm",
};

export const CHI_HANH: Record<DiaChi, Hanh> = {
  "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc",
  "Thìn": "Thổ", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Mùi": "Thổ",
  "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy",
};
export const CHI_AM_DUONG: Record<DiaChi, AmDuong> = {
  "Tý": "Dương", "Sửu": "Âm", "Dần": "Dương", "Mão": "Âm",
  "Thìn": "Dương", "Tỵ": "Âm", "Ngọ": "Dương", "Mùi": "Âm",
  "Thân": "Dương", "Dậu": "Âm", "Tuất": "Dương", "Hợi": "Âm",
};
export const CHI_CON_GIAP: Record<DiaChi, string> = {
  "Tý": "Chuột", "Sửu": "Trâu", "Dần": "Hổ", "Mão": "Mèo",
  "Thìn": "Rồng", "Tỵ": "Rắn", "Ngọ": "Ngựa", "Mùi": "Dê",
  "Thân": "Khỉ", "Dậu": "Gà", "Tuất": "Chó", "Hợi": "Lợn",
};

/* ============================================================
 * NẠP ÂM — Bảng 60 cặp can-chi → tên mệnh thi vị
 * Mỗi nạp âm phủ 2 năm liền nhau (Dương-Dương + Âm-Âm).
 * ============================================================ */
const NAP_AM_30: { name: string; hanh: Hanh }[] = [
  { name: "Hải Trung Kim",   hanh: "Kim" },   // Giáp Tý · Ất Sửu
  { name: "Lư Trung Hỏa",    hanh: "Hỏa" },   // Bính Dần · Đinh Mão
  { name: "Đại Lâm Mộc",     hanh: "Mộc" },   // Mậu Thìn · Kỷ Tỵ
  { name: "Lộ Bàng Thổ",     hanh: "Thổ" },   // Canh Ngọ · Tân Mùi
  { name: "Kiếm Phong Kim",  hanh: "Kim" },   // Nhâm Thân · Quý Dậu
  { name: "Sơn Đầu Hỏa",     hanh: "Hỏa" },   // Giáp Tuất · Ất Hợi
  { name: "Giản Hạ Thủy",    hanh: "Thủy" },  // Bính Tý · Đinh Sửu
  { name: "Thành Đầu Thổ",   hanh: "Thổ" },   // Mậu Dần · Kỷ Mão
  { name: "Bạch Lạp Kim",    hanh: "Kim" },   // Canh Thìn · Tân Tỵ
  { name: "Dương Liễu Mộc",  hanh: "Mộc" },   // Nhâm Ngọ · Quý Mùi
  { name: "Tuyền Trung Thủy",hanh: "Thủy" },  // Giáp Thân · Ất Dậu
  { name: "Ốc Thượng Thổ",   hanh: "Thổ" },   // Bính Tuất · Đinh Hợi
  { name: "Tích Lịch Hỏa",   hanh: "Hỏa" },   // Mậu Tý · Kỷ Sửu
  { name: "Tùng Bách Mộc",   hanh: "Mộc" },   // Canh Dần · Tân Mão
  { name: "Trường Lưu Thủy", hanh: "Thủy" },  // Nhâm Thìn · Quý Tỵ
  { name: "Sa Trung Kim",    hanh: "Kim" },   // Giáp Ngọ · Ất Mùi
  { name: "Sơn Hạ Hỏa",      hanh: "Hỏa" },   // Bính Thân · Đinh Dậu
  { name: "Bình Địa Mộc",    hanh: "Mộc" },   // Mậu Tuất · Kỷ Hợi
  { name: "Bích Thượng Thổ", hanh: "Thổ" },   // Canh Tý · Tân Sửu
  { name: "Kim Bạc Kim",     hanh: "Kim" },   // Nhâm Dần · Quý Mão
  { name: "Phú Đăng Hỏa",    hanh: "Hỏa" },   // Giáp Thìn · Ất Tỵ
  { name: "Thiên Hà Thủy",   hanh: "Thủy" },  // Bính Ngọ · Đinh Mùi
  { name: "Đại Trạch Thổ",   hanh: "Thổ" },   // Mậu Thân · Kỷ Dậu
  { name: "Thoa Xuyến Kim",  hanh: "Kim" },   // Canh Tuất · Tân Hợi
  { name: "Tang Đố Mộc",     hanh: "Mộc" },   // Nhâm Tý · Quý Sửu
  { name: "Đại Khê Thủy",    hanh: "Thủy" },  // Giáp Dần · Ất Mão
  { name: "Sa Trung Thổ",    hanh: "Thổ" },   // Bính Thìn · Đinh Tỵ
  { name: "Thiên Thượng Hỏa",hanh: "Hỏa" },   // Mậu Ngọ · Kỷ Mùi
  { name: "Thạch Lựu Mộc",   hanh: "Mộc" },   // Canh Thân · Tân Dậu
  { name: "Đại Hải Thủy",    hanh: "Thủy" },  // Nhâm Tuất · Quý Hợi
];

/* ============================================================
 * Hàm tra cứu cơ bản
 * ============================================================ */

/**
 * Lấy chỉ số trong vòng Lục thập hoa giáp (0..59) từ năm dương lịch.
 * Năm 4 SCN = Giáp Tý (index 0).
 */
function hoaGiapIndex(namSinh: number): number {
  return ((namSinh - 4) % 60 + 60) % 60;
}

/** Tra Thiên can của năm sinh (dương lịch). */
export function tinhThienCan(namSinh: number): ThienCan {
  return THIEN_CAN[hoaGiapIndex(namSinh) % 10];
}

/** Tra Địa chi của năm sinh (dương lịch). */
export function tinhDiaChi(namSinh: number): DiaChi {
  return DIA_CHI[hoaGiapIndex(namSinh) % 12];
}

/** Tra Nạp âm (bản mệnh Ngũ hành) của năm sinh. */
export function tinhNapAm(namSinh: number): { name: string; hanh: Hanh } {
  // Nạp âm thay đổi mỗi 2 năm. Index 0/1 → nạp âm 0, index 2/3 → nạp âm 1, v.v.
  const idx = Math.floor(hoaGiapIndex(namSinh) / 2);
  return NAP_AM_30[idx];
}

/* ============================================================
 * Giờ → Địa chi
 * ============================================================ */

/**
 * Đổi giờ (0-23) sang chỉ số Địa chi giờ (0=Tý ... 11=Hợi).
 * Giờ Tý kéo dài từ 23h hôm trước đến 1h hôm sau.
 */
export function chiGioIndex(gioSinh: number): number {
  // Bù 1h: h=23 → chi 0, h=0/1 → chi 0/1...
  // (gioSinh + 1) % 24 chia 2 ra index 0-11
  return Math.floor(((gioSinh + 1) % 24) / 2);
}

/** Lấy địa chi của giờ sinh. */
export function chiGio(gioSinh: number): DiaChi {
  return DIA_CHI[chiGioIndex(gioSinh)];
}

/* ============================================================
 * Cung Mệnh & Cung Thân
 * ============================================================
 *
 * Quy tắc truyền thống:
 *  1. Đặt tháng Giêng (tháng 1 âm) ở cung Dần.
 *  2. Đếm THUẬN từ Dần đến cung tháng sinh.
 *  3. Từ cung tháng sinh, đếm NGHỊCH chi giờ → cung Mệnh.
 *  4. Từ cung tháng sinh, đếm THUẬN chi giờ → cung Thân.
 *
 * Dần có index 2 trong DIA_CHI[0..11].
 * Cung Mệnh index = (2 + (thangSinh - 1) - chiGioIdx) mod 12
 *                = (1 + thangSinh - chiGioIdx) mod 12
 * Cung Thân index = (1 + thangSinh + chiGioIdx) mod 12
 */
function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

/** Lấy cung Mệnh từ tháng sinh âm (1..12) và giờ sinh (0-23). */
export function tinhCungMenh(thangSinh: number, gioSinh: number): DiaChi {
  const ci = chiGioIndex(gioSinh);
  return DIA_CHI[mod12(1 + thangSinh - ci)];
}

/** Lấy cung Thân. */
export function tinhCungThan(thangSinh: number, gioSinh: number): DiaChi {
  const ci = chiGioIndex(gioSinh);
  return DIA_CHI[mod12(1 + thangSinh + ci)];
}

/* ============================================================
 * An 12 cung
 * ============================================================ */

export const TEN_12_CUNG = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
] as const;
export type TenCung = (typeof TEN_12_CUNG)[number];

/**
 * Trả về mapping: tên 12 cung → Địa chi.
 *
 * Bắt đầu từ cung Mệnh, đi **THUẬN** chiều kim đồng hồ qua các địa chi
 * (theo thứ tự an cung truyền thống — Tân Biên: "Sau khi đã an Mệnh, bắt đầu
 * theo chiều thuận, thứ tự an các cung: Phụ Mẫu, Phúc Đức, Điền Trạch...").
 *
 * Nhờ đó: Mệnh ↔ Thiên Di (offset +6, đối xung 180°), Phụ Mẫu ↔ Tật Ách,
 * Phúc Đức ↔ Tài Bạch, v.v.
 */
export function anThapNhiCung(cungMenh: DiaChi): Record<TenCung, DiaChi> {
  const menhIdx = DIA_CHI.indexOf(cungMenh);
  const result = {} as Record<TenCung, DiaChi>;
  for (let i = 0; i < 12; i++) {
    const chi = DIA_CHI[mod12(menhIdx + i)];
    result[TEN_12_CUNG[i]] = chi;
  }
  return result;
}

/** Đảo ngược: Địa chi → tên cung. */
export function chiToCung(
  cungMap: Record<TenCung, DiaChi>
): Record<DiaChi, TenCung> {
  const inv = {} as Record<DiaChi, TenCung>;
  (Object.keys(cungMap) as TenCung[]).forEach((cung) => {
    inv[cungMap[cung]] = cung;
  });
  return inv;
}

/* ============================================================
 * Layout 4×4 trên bàn lá số
 *
 * Quy ước Tử Vi: 12 cung xếp quanh viền 4×4, trung tâm trống.
 * Tỵ ở góc trên-trái, đi thuận chiều kim đồng hồ.
 *
 *  Tỵ  Ngọ  Mùi  Thân
 *  Thìn         Dậu
 *  Mão          Tuất
 *  Dần Sửu Tý  Hợi
 * ============================================================ */

export type GridPos = { x: number; y: number };

export const CHI_GRID_POS: Record<DiaChi, GridPos> = {
  "Tỵ":  { x: 0, y: 0 },
  "Ngọ": { x: 1, y: 0 },
  "Mùi": { x: 2, y: 0 },
  "Thân":{ x: 3, y: 0 },
  "Dậu": { x: 3, y: 1 },
  "Tuất":{ x: 3, y: 2 },
  "Hợi": { x: 3, y: 3 },
  "Tý":  { x: 2, y: 3 },
  "Sửu": { x: 1, y: 3 },
  "Dần": { x: 0, y: 3 },
  "Mão": { x: 0, y: 2 },
  "Thìn":{ x: 0, y: 1 },
};

/* ============================================================
 * NGŨ HÀNH CỤC — Xác định Cục từ Thiên can năm sinh + Địa chi cung Mệnh.
 * Cục số = số năm bắt đầu Đại Vận 1, cũng là cơ sở an Tử Vi.
 * ============================================================ */

type CucKey = "Giáp/Kỷ" | "Ất/Canh" | "Bính/Tân" | "Đinh/Nhâm" | "Mậu/Quý";

const CAN_TO_CUC_KEY: Record<ThienCan, CucKey> = {
  "Giáp": "Giáp/Kỷ", "Kỷ": "Giáp/Kỷ",
  "Ất": "Ất/Canh", "Canh": "Ất/Canh",
  "Bính": "Bính/Tân", "Tân": "Bính/Tân",
  "Đinh": "Đinh/Nhâm", "Nhâm": "Đinh/Nhâm",
  "Mậu": "Mậu/Quý", "Quý": "Mậu/Quý",
};

const CUC_INFO: Record<number, { name: string; hanh: Hanh }> = {
  2: { name: "Thủy Nhị Cục", hanh: "Thủy" },
  3: { name: "Mộc Tam Cục", hanh: "Mộc" },
  4: { name: "Kim Tứ Cục", hanh: "Kim" },
  5: { name: "Thổ Ngũ Cục", hanh: "Thổ" },
  6: { name: "Hỏa Lục Cục", hanh: "Hỏa" },
};

/**
 * Bảng tra Cục số chuẩn của Tử Vi Đẩu Số:
 * - Hàng: cặp can (5 cặp)
 * - Cột: cặp chi của cung Mệnh (6 cặp: Tý/Sửu, Dần/Mão, Thìn/Tỵ, Ngọ/Mùi, Thân/Dậu, Tuất/Hợi)
 */
// Bảng tra Cục chuẩn theo "Tử Vi Đẩu Số Tân Biên" — Vân Đằng Thái Thứ Lang (1956).
// Mỗi cặp can (5 cặp) × 6 cặp chi cung Mệnh (Tý/Sửu, Dần/Mão/Tuất/Hợi, Thìn/Tỵ,
// Ngọ/Mùi, Thân/Dậu) → Cục số (2 Thủy, 3 Mộc, 4 Kim, 5 Thổ, 6 Hỏa).
//
// Lưu ý: cặp chi "Dần/Mão/Tuất/Hợi" dùng chung một giá trị Cục (vd Giáp/Kỷ + Dần
// = Hỏa lục, đồng thời Giáp/Kỷ + Tuất cũng = Hỏa lục).
const CUC_TABLE: Record<CucKey, Record<DiaChi, number>> = {
  "Giáp/Kỷ":  { "Tý": 2, "Sửu": 2, "Dần": 6, "Mão": 6, "Thìn": 3, "Tỵ": 3,
                "Ngọ": 5, "Mùi": 5, "Thân": 4, "Dậu": 4, "Tuất": 6, "Hợi": 6 },
  "Ất/Canh":  { "Tý": 6, "Sửu": 6, "Dần": 5, "Mão": 5, "Thìn": 4, "Tỵ": 4,
                "Ngọ": 3, "Mùi": 3, "Thân": 2, "Dậu": 2, "Tuất": 5, "Hợi": 5 },
  "Bính/Tân": { "Tý": 5, "Sửu": 5, "Dần": 3, "Mão": 3, "Thìn": 2, "Tỵ": 2,
                "Ngọ": 4, "Mùi": 4, "Thân": 6, "Dậu": 6, "Tuất": 3, "Hợi": 3 },
  "Đinh/Nhâm":{ "Tý": 3, "Sửu": 3, "Dần": 4, "Mão": 4, "Thìn": 6, "Tỵ": 6,
                "Ngọ": 2, "Mùi": 2, "Thân": 5, "Dậu": 5, "Tuất": 4, "Hợi": 4 },
  "Mậu/Quý":  { "Tý": 4, "Sửu": 4, "Dần": 2, "Mão": 2, "Thìn": 5, "Tỵ": 5,
                "Ngọ": 6, "Mùi": 6, "Thân": 3, "Dậu": 3, "Tuất": 2, "Hợi": 2 },
};

export type CucResult = { cucSo: number; name: string; hanh: Hanh };

/** Tra Cục từ Thiên can năm + Địa chi cung Mệnh. */
export function tinhCuc(canNam: ThienCan, cungMenh: DiaChi): CucResult {
  const key = CAN_TO_CUC_KEY[canNam];
  const cucSo = CUC_TABLE[key][cungMenh];
  return { cucSo, ...CUC_INFO[cucSo] };
}

/* ============================================================
 * AN TỬ VI — Từ Cục số + ngày sinh âm lịch.
 *
 * Công thức truyền thống (Bùi Sĩ Tâm, Trần Đoàn):
 *   Q = ceil(ngày / Cục)
 *   R = Q*Cục − ngày                 // dư khi đẩy lên bội kế tiếp
 *   Nếu R chẵn: Tử Vi tại (Dần + Q − 1 + R) mod 12  // đếm thuận R
 *   Nếu R lẻ : Tử Vi tại (Dần + Q − 1 − R) mod 12  // đếm ngược R
 * Trong đó Dần = index 2 trong DIA_CHI.
 * ============================================================ */

const DAN_INDEX = 2;

/** Xác định vị trí sao Tử Vi từ Cục số + ngày sinh âm lịch (1..30). */
export function tinhTuViPosition(cucSo: number, ngaySinhAm: number): DiaChi {
  const C = cucSo;
  const D = ngaySinhAm;
  const Q = Math.ceil(D / C);
  const R = Q * C - D;
  const offset = R % 2 === 0 ? Q - 1 + R : Q - 1 - R;
  return DIA_CHI[mod12(DAN_INDEX + offset)];
}

/* ============================================================
 * 14 CHÍNH TINH — Thông tin sao + cách an
 * ============================================================ */

export type ChomSao = "Tử Vi" | "Thiên Phủ";
export type ChinhTinhName =
  | "Tử Vi" | "Thiên Cơ" | "Thái Dương" | "Vũ Khúc" | "Thiên Đồng" | "Liêm Trinh"
  | "Thiên Phủ" | "Thái Âm" | "Tham Lang" | "Cự Môn" | "Thiên Tướng"
  | "Thiên Lương" | "Thất Sát" | "Phá Quân";

export type ChinhTinhInfo = {
  name: ChinhTinhName;
  han: string;
  hanh: Hanh;
  amDuong: AmDuong;
  chom: ChomSao;
  shortDesc: string;
};

export const CHINH_TINH: Record<ChinhTinhName, ChinhTinhInfo> = {
  "Tử Vi":      { name: "Tử Vi",      han: "紫微", hanh: "Thổ",  amDuong: "Âm",    chom: "Tử Vi",     shortDesc: "Đế tinh — lãnh đạo" },
  "Thiên Cơ":   { name: "Thiên Cơ",   han: "天機", hanh: "Mộc",  amDuong: "Âm",    chom: "Tử Vi",     shortDesc: "Mưu sĩ — trí tuệ" },
  "Thái Dương": { name: "Thái Dương", han: "太陽", hanh: "Hỏa",  amDuong: "Dương", chom: "Tử Vi",     shortDesc: "Mặt trời — quang minh" },
  "Vũ Khúc":    { name: "Vũ Khúc",    han: "武曲", hanh: "Kim",  amDuong: "Âm",    chom: "Tử Vi",     shortDesc: "Tướng tài — kỷ luật" },
  "Thiên Đồng": { name: "Thiên Đồng", han: "天同", hanh: "Thủy", amDuong: "Dương", chom: "Tử Vi",     shortDesc: "Phúc tinh — hiền hòa" },
  "Liêm Trinh": { name: "Liêm Trinh", han: "廉貞", hanh: "Hỏa",  amDuong: "Âm",    chom: "Tử Vi",     shortDesc: "Tù tinh — nguyên tắc" },
  "Thiên Phủ":  { name: "Thiên Phủ",  han: "天府", hanh: "Thổ",  amDuong: "Dương", chom: "Thiên Phủ", shortDesc: "Tài tinh — kho báu" },
  "Thái Âm":    { name: "Thái Âm",    han: "太陰", hanh: "Thủy", amDuong: "Âm",    chom: "Thiên Phủ", shortDesc: "Mặt trăng — kín đáo" },
  "Tham Lang":  { name: "Tham Lang",  han: "貪狼", hanh: "Mộc",  amDuong: "Dương", chom: "Thiên Phủ", shortDesc: "Đào hoa — đa năng" },
  "Cự Môn":     { name: "Cự Môn",     han: "巨門", hanh: "Thủy", amDuong: "Âm",    chom: "Thiên Phủ", shortDesc: "Khẩu tinh — lời nói" },
  "Thiên Tướng":{ name: "Thiên Tướng",han: "天相", hanh: "Thủy", amDuong: "Dương", chom: "Thiên Phủ", shortDesc: "Ấn tinh — trung thực" },
  "Thiên Lương":{ name: "Thiên Lương",han: "天梁", hanh: "Thổ",  amDuong: "Dương", chom: "Thiên Phủ", shortDesc: "Phụ tinh — từ tâm" },
  "Thất Sát":   { name: "Thất Sát",   han: "七殺", hanh: "Kim",  amDuong: "Âm",    chom: "Thiên Phủ", shortDesc: "Tướng tinh — quyết liệt" },
  "Phá Quân":   { name: "Phá Quân",   han: "破軍", hanh: "Thủy", amDuong: "Âm",    chom: "Thiên Phủ", shortDesc: "Đột phá — sáng tạo" },
};

/** Vị trí 6 sao chòm Tử Vi (đếm NGƯỢC chiều kim đồng hồ từ Tử Vi). */
const CHOM_TU_VI_OFFSETS: Array<[ChinhTinhName, number]> = [
  ["Tử Vi", 0],
  ["Thiên Cơ", -1],
  ["Thái Dương", -3],
  ["Vũ Khúc", -4],
  ["Thiên Đồng", -5],
  ["Liêm Trinh", -8],
];

/** Vị trí 8 sao chòm Thiên Phủ (đếm THUẬN chiều kim đồng hồ từ Thiên Phủ). */
const CHOM_THIEN_PHU_OFFSETS: Array<[ChinhTinhName, number]> = [
  ["Thiên Phủ", 0],
  ["Thái Âm", 1],
  ["Tham Lang", 2],
  ["Cự Môn", 3],
  ["Thiên Tướng", 4],
  ["Thiên Lương", 5],
  ["Thất Sát", 6],
  ["Phá Quân", 10],
];

/**
 * Vị trí Thiên Phủ: đối xứng với Tử Vi qua **trục Dần-Thân** (đường chéo
 * nối hai góc bàn lá số). Công thức: pos(Tử Vi) + pos(Thiên Phủ) ≡ 4 (mod 12)
 * — vì Dần (idx 2) + Dần = 4 và Thân (idx 8) + Thân = 16 ≡ 4.
 *
 * Đồng cung khi Tử Vi ở Dần hoặc Thân ("song đế đồng cung").
 *
 * Nguồn: Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang (1956), sơ đồ Tử Vi
 * tinh hệ phần "An sao".
 */
export function tinhThienPhuPosition(tuViPos: DiaChi): DiaChi {
  return DIA_CHI[mod12(4 - DIA_CHI.indexOf(tuViPos))];
}

export type DacHam = "đắc" | "bình" | "hãm";

/**
 * Đánh giá đắc/hãm địa cơ bản theo quan hệ Ngũ hành chi ↔ sao:
 * - chi sinh sao  → đắc (sao được nuôi)
 * - chi khắc sao  → hãm (sao bị chế ngự)
 * - cùng hành / sao sinh chi / sao khắc chi → bình
 */
function dacHam(saoHanh: Hanh, chiHanh: Hanh): DacHam {
  const SINH: Record<Hanh, Hanh> = { Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc" };
  const KHAC: Record<Hanh, Hanh> = { Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc" };
  if (SINH[chiHanh] === saoHanh) return "đắc";
  if (KHAC[chiHanh] === saoHanh) return "hãm";
  return "bình";
}

export type ChinhTinhAt = ChinhTinhInfo & { dac: DacHam };

/**
 * An 14 chính tinh trên 12 cung từ vị trí Tử Vi.
 * Trả về map: chi → mảng sao tại chi đó (0, 1, hoặc 2 sao).
 */
export function an14ChinhTinh(tuViPos: DiaChi): Record<DiaChi, ChinhTinhAt[]> {
  const result = {} as Record<DiaChi, ChinhTinhAt[]>;
  for (const chi of DIA_CHI) result[chi] = [];

  const tuViIdx = DIA_CHI.indexOf(tuViPos);
  const thienPhuIdx = DIA_CHI.indexOf(tinhThienPhuPosition(tuViPos));

  // Chòm Tử Vi
  for (const [name, offset] of CHOM_TU_VI_OFFSETS) {
    const chi = DIA_CHI[mod12(tuViIdx + offset)];
    const info = CHINH_TINH[name];
    result[chi].push({ ...info, dac: dacHam(info.hanh, CHI_HANH[chi]) });
  }
  // Chòm Thiên Phủ
  for (const [name, offset] of CHOM_THIEN_PHU_OFFSETS) {
    const chi = DIA_CHI[mod12(thienPhuIdx + offset)];
    const info = CHINH_TINH[name];
    result[chi].push({ ...info, dac: dacHam(info.hanh, CHI_HANH[chi]) });
  }
  return result;
}

/* ============================================================
 * Tổng hợp: tính toàn bộ thông tin lá số cơ bản
 * ============================================================ */

export type LaSoBasic = {
  namSinh: number;
  thangSinh: number;
  ngaySinh: number;
  gioSinh: number;
  gioiTinh: "Nam" | "Nữ";

  thienCan: ThienCan;
  diaChi: DiaChi;
  napAm: { name: string; hanh: Hanh };
  hanhMenh: Hanh;
  canAmDuong: AmDuong;
  chiAmDuong: AmDuong;
  conGiap: string;

  chiGio: DiaChi;
  cungMenh: DiaChi;
  cungThan: DiaChi;
  thapNhiCung: Record<TenCung, DiaChi>;

  /** Cục số + tên + hành */
  cuc: CucResult;
  /** Vị trí sao Tử Vi và Thiên Phủ */
  tuViPos: DiaChi;
  thienPhuPos: DiaChi;
  /** Sao chính tinh tại từng địa chi (0-2 sao mỗi cung) */
  chinhTinh: Record<DiaChi, ChinhTinhAt[]>;
};

export function lapLaSoCoBan(input: {
  namSinh: number;
  thangSinh: number;
  ngaySinh: number;
  gioSinh: number;
  gioiTinh: "Nam" | "Nữ";
}): LaSoBasic {
  const can = tinhThienCan(input.namSinh);
  const chi = tinhDiaChi(input.namSinh);
  const napAm = tinhNapAm(input.namSinh);
  const cungMenh = tinhCungMenh(input.thangSinh, input.gioSinh);
  const cungThan = tinhCungThan(input.thangSinh, input.gioSinh);
  const cuc = tinhCuc(can, cungMenh);
  const tuViPos = tinhTuViPosition(cuc.cucSo, input.ngaySinh);
  const thienPhuPos = tinhThienPhuPosition(tuViPos);
  return {
    ...input,
    thienCan: can,
    diaChi: chi,
    napAm,
    hanhMenh: napAm.hanh,
    canAmDuong: CAN_AM_DUONG[can],
    chiAmDuong: CHI_AM_DUONG[chi],
    conGiap: CHI_CON_GIAP[chi],
    chiGio: chiGio(input.gioSinh),
    cungMenh,
    cungThan,
    thapNhiCung: anThapNhiCung(cungMenh),
    cuc,
    tuViPos,
    thienPhuPos,
    chinhTinh: an14ChinhTinh(tuViPos),
  };
}
