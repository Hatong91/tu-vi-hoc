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
 * PHỤ TINH — 13 sao phụ thông dụng nhất
 *
 * Công thức theo "Tử Vi Đẩu Số Tân Biên" — Vân Đằng Thái Thứ Lang (1956),
 * phần §8 An sao (mục 4-6, 7-10).
 * ============================================================ */

export type PhuTinhName =
  | "Lộc Tồn" | "Kình Dương" | "Đà La"
  | "Tả Phụ" | "Hữu Bật"
  | "Văn Xương" | "Văn Khúc"
  | "Thiên Khôi" | "Thiên Việt"
  | "Hỏa Tinh" | "Linh Tinh"
  | "Địa Không" | "Địa Kiếp";

export type PhuTinhKind = "cát" | "hung" | "trung";

export type PhuTinhInfo = {
  /** Tên sao — chấp nhận PhuTinhName cốt lõi cũng như các sao mở rộng (đào hoa, quý, hung). */
  name: string;
  han: string;
  kind: PhuTinhKind;
  shortDesc: string;
};

export const PHU_TINH: Record<PhuTinhName, PhuTinhInfo> = {
  "Lộc Tồn":   { name: "Lộc Tồn",   han: "祿存", kind: "cát",   shortDesc: "Tài tinh — tiền tích lũy" },
  "Kình Dương":{ name: "Kình Dương",han: "擎羊", kind: "hung",  shortDesc: "Sát tinh — sắc bén, va chạm" },
  "Đà La":     { name: "Đà La",     han: "陀羅", kind: "hung",  shortDesc: "Sát tinh — vướng mắc, chậm" },
  "Tả Phụ":    { name: "Tả Phụ",    han: "左輔", kind: "cát",   shortDesc: "Trợ thủ công khai" },
  "Hữu Bật":   { name: "Hữu Bật",   han: "右弼", kind: "cát",   shortDesc: "Trợ thủ kín đáo" },
  "Văn Xương": { name: "Văn Xương", han: "文昌", kind: "cát",   shortDesc: "Văn chương, học vấn" },
  "Văn Khúc":  { name: "Văn Khúc",  han: "文曲", kind: "cát",   shortDesc: "Văn nghệ, hùng biện" },
  "Thiên Khôi":{ name: "Thiên Khôi",han: "天魁", kind: "cát",   shortDesc: "Quý nhân nam — cấp trên giúp" },
  "Thiên Việt":{ name: "Thiên Việt",han: "天鉞", kind: "cát",   shortDesc: "Quý nhân nữ — hậu duệ giúp" },
  "Hỏa Tinh":  { name: "Hỏa Tinh",  han: "火星", kind: "hung",  shortDesc: "Lửa bốc — nóng nảy, đột biến" },
  "Linh Tinh": { name: "Linh Tinh", han: "鈴星", kind: "hung",  shortDesc: "Lửa ngầm — uẩn ức, mưu sâu" },
  "Địa Không": { name: "Địa Không", han: "地空", kind: "hung",  shortDesc: "Hư không — mất mát, hư vô" },
  "Địa Kiếp":  { name: "Địa Kiếp",  han: "地劫", kind: "hung",  shortDesc: "Cướp đoạt — biến động lớn" },
};

/** Lộc Tồn theo Thiên Can năm sinh (Tân Biên §8.4). */
const LOC_TON_BY_CAN: Record<ThienCan, DiaChi> = {
  "Giáp": "Dần", "Ất": "Mão",
  "Bính": "Tỵ", "Đinh": "Ngọ",
  "Mậu": "Tỵ",  "Kỷ": "Ngọ",
  "Canh": "Thân", "Tân": "Dậu",
  "Nhâm": "Hợi", "Quý": "Tý",
};

/** Khôi Việt theo Thiên Can năm sinh (Tân Biên §8.10). */
const KHOI_VIET_BY_CAN: Record<ThienCan, { khoi: DiaChi; viet: DiaChi }> = {
  "Giáp":{ khoi: "Sửu", viet: "Mùi" }, "Mậu":{ khoi: "Sửu", viet: "Mùi" },
  "Ất": { khoi: "Tý",  viet: "Thân" }, "Kỷ":{ khoi: "Tý",  viet: "Thân" },
  "Canh":{ khoi: "Ngọ", viet: "Dần" }, "Tân":{ khoi: "Ngọ", viet: "Dần" },
  "Bính":{ khoi: "Hợi", viet: "Dậu" }, "Đinh":{ khoi: "Hợi", viet: "Dậu" },
  "Nhâm":{ khoi: "Mão", viet: "Tỵ" },  "Quý":{ khoi: "Mão", viet: "Tỵ" },
};

/** Hỏa Tinh & Linh Tinh khởi điểm theo nhóm 3 chi của năm (Tân Biên §8.6). */
const HOA_LINH_START: Record<DiaChi, { hoa: DiaChi; linh: DiaChi }> = {
  // Dần/Ngọ/Tuất (Hỏa cục)
  "Dần":  { hoa: "Sửu", linh: "Mão" },
  "Ngọ":  { hoa: "Sửu", linh: "Mão" },
  "Tuất": { hoa: "Sửu", linh: "Mão" },
  // Thân/Tý/Thìn (Thủy cục)
  "Thân": { hoa: "Dần", linh: "Tuất" },
  "Tý":   { hoa: "Dần", linh: "Tuất" },
  "Thìn": { hoa: "Dần", linh: "Tuất" },
  // Tỵ/Dậu/Sửu (Kim cục)
  "Tỵ":   { hoa: "Mão", linh: "Tuất" },
  "Dậu":  { hoa: "Mão", linh: "Tuất" },
  "Sửu":  { hoa: "Mão", linh: "Tuất" },
  // Hợi/Mão/Mùi (Mộc cục)
  "Hợi":  { hoa: "Dần", linh: "Tuất" },
  "Mão":  { hoa: "Dần", linh: "Tuất" },
  "Mùi":  { hoa: "Dần", linh: "Tuất" },
};

export function tinhLocTon(canNam: ThienCan): DiaChi {
  return LOC_TON_BY_CAN[canNam];
}
export function tinhKinhDuong(canNam: ThienCan): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(LOC_TON_BY_CAN[canNam]) + 1)];
}
export function tinhDaLa(canNam: ThienCan): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(LOC_TON_BY_CAN[canNam]) - 1)];
}
export function tinhTaPhu(thangSinh: number): DiaChi {
  // Thìn (4) khởi tháng Giêng, đếm thuận
  return DIA_CHI[mod12(4 + (thangSinh - 1))];
}
export function tinhHuuBat(thangSinh: number): DiaChi {
  // Tuất (10) khởi tháng Giêng, đếm nghịch
  return DIA_CHI[mod12(10 - (thangSinh - 1))];
}
export function tinhVanXuong(gioSinh: number): DiaChi {
  // Tuất (10) khởi giờ Tý, đếm nghịch
  return DIA_CHI[mod12(10 - chiGioIndex(gioSinh))];
}
export function tinhVanKhuc(gioSinh: number): DiaChi {
  // Thìn (4) khởi giờ Tý, đếm thuận
  return DIA_CHI[mod12(4 + chiGioIndex(gioSinh))];
}
export function tinhKhoiViet(canNam: ThienCan): { khoi: DiaChi; viet: DiaChi } {
  return KHOI_VIET_BY_CAN[canNam];
}

/**
 * Quy tắc đi thuận/nghịch cho Hỏa-Linh, Đại Vận:
 * - Dương Nam + Âm Nữ → THUẬN (return 1)
 * - Âm Nam + Dương Nữ → NGHỊCH (return -1)
 */
function huongAm(canNam: ThienCan, gioiTinh: "Nam" | "Nữ"): 1 | -1 {
  const duong = CAN_AM_DUONG[canNam] === "Dương";
  if (gioiTinh === "Nam") return duong ? 1 : -1;
  return duong ? -1 : 1;
}

export function tinhHoaTinh(
  chiNam: DiaChi,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ",
  gioSinh: number
): DiaChi {
  const startIdx = DIA_CHI.indexOf(HOA_LINH_START[chiNam].hoa);
  const huong = huongAm(canNam, gioiTinh); // Hỏa cùng hướng âm dương
  return DIA_CHI[mod12(startIdx + huong * chiGioIndex(gioSinh))];
}

export function tinhLinhTinh(
  chiNam: DiaChi,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ",
  gioSinh: number
): DiaChi {
  const startIdx = DIA_CHI.indexOf(HOA_LINH_START[chiNam].linh);
  // Linh đi NGƯỢC hướng Hỏa
  const huong = (-huongAm(canNam, gioiTinh)) as 1 | -1;
  return DIA_CHI[mod12(startIdx + huong * chiGioIndex(gioSinh))];
}

export function tinhDiaKiep(gioSinh: number): DiaChi {
  // Hợi (11) khởi giờ Tý, đếm thuận
  return DIA_CHI[mod12(11 + chiGioIndex(gioSinh))];
}
export function tinhDiaKhong(gioSinh: number): DiaChi {
  // Hợi (11) khởi giờ Tý, đếm nghịch
  return DIA_CHI[mod12(11 - chiGioIndex(gioSinh))];
}

/** Tính toàn bộ 13 phụ tinh trên bàn lá số. */
export function anPhuTinhAll(input: {
  canNam: ThienCan;
  chiNam: DiaChi;
  thangSinh: number;
  gioSinh: number;
  gioiTinh: "Nam" | "Nữ";
}): Record<DiaChi, PhuTinhInfo[]> {
  const result = {} as Record<DiaChi, PhuTinhInfo[]>;
  for (const chi of DIA_CHI) result[chi] = [];

  const add = (chi: DiaChi, name: PhuTinhName) => {
    result[chi].push(PHU_TINH[name]);
  };

  const { canNam, chiNam, thangSinh, gioSinh, gioiTinh } = input;
  const kv = tinhKhoiViet(canNam);

  add(tinhLocTon(canNam), "Lộc Tồn");
  add(tinhKinhDuong(canNam), "Kình Dương");
  add(tinhDaLa(canNam), "Đà La");
  add(tinhTaPhu(thangSinh), "Tả Phụ");
  add(tinhHuuBat(thangSinh), "Hữu Bật");
  add(tinhVanXuong(gioSinh), "Văn Xương");
  add(tinhVanKhuc(gioSinh), "Văn Khúc");
  add(kv.khoi, "Thiên Khôi");
  add(kv.viet, "Thiên Việt");
  add(tinhHoaTinh(chiNam, canNam, gioiTinh, gioSinh), "Hỏa Tinh");
  add(tinhLinhTinh(chiNam, canNam, gioiTinh, gioSinh), "Linh Tinh");
  add(tinhDiaKiep(gioSinh), "Địa Kiếp");
  add(tinhDiaKhong(gioSinh), "Địa Không");

  return result;
}

/* ============================================================
 * TỨ HÓA — Lộc, Quyền, Khoa, Kỵ theo Thiên Can.
 * Bao gồm cả phụ tinh (Văn Xương/Khúc, Tả Phụ, Hữu Bật) có thể mang Hóa.
 * ============================================================ */

export type TuHoaTarget =
  | ChinhTinhName
  | "Văn Xương" | "Văn Khúc" | "Tả Phụ" | "Hữu Bật";

export type TuHoaSet = {
  loc: TuHoaTarget;
  quyen: TuHoaTarget;
  khoa: TuHoaTarget;
  ky: TuHoaTarget;
};

const TU_HOA_BY_CAN: Record<ThienCan, TuHoaSet> = {
  "Giáp": { loc: "Liêm Trinh", quyen: "Phá Quân",   khoa: "Vũ Khúc",   ky: "Thái Dương" },
  "Ất":   { loc: "Thiên Cơ",   quyen: "Thiên Lương",khoa: "Tử Vi",     ky: "Thái Âm" },
  "Bính": { loc: "Thiên Đồng", quyen: "Thiên Cơ",   khoa: "Văn Xương", ky: "Liêm Trinh" },
  "Đinh": { loc: "Thái Âm",    quyen: "Thiên Đồng", khoa: "Thiên Cơ",  ky: "Cự Môn" },
  "Mậu":  { loc: "Tham Lang",  quyen: "Thái Âm",    khoa: "Hữu Bật",   ky: "Thiên Cơ" },
  "Kỷ":   { loc: "Vũ Khúc",    quyen: "Tham Lang",  khoa: "Thiên Lương",ky: "Văn Khúc" },
  "Canh": { loc: "Thái Dương", quyen: "Vũ Khúc",    khoa: "Thái Âm",   ky: "Thiên Đồng" },
  "Tân":  { loc: "Cự Môn",     quyen: "Thái Dương", khoa: "Văn Khúc",  ky: "Văn Xương" },
  "Nhâm": { loc: "Thiên Lương",quyen: "Tử Vi",      khoa: "Tả Phụ",    ky: "Vũ Khúc" },
  "Quý":  { loc: "Phá Quân",   quyen: "Cự Môn",     khoa: "Thái Âm",   ky: "Tham Lang" },
};

export function getTuHoa(canNam: ThienCan): TuHoaSet {
  return TU_HOA_BY_CAN[canNam];
}

/**
 * Định vị Tứ Hóa trên bàn lá số: với canTarget, trả về 4 sao + vị trí của chúng.
 * Tìm chính tinh trong chinhTinhMap, hoặc phụ tinh trong phuTinhMap.
 */
export type HoaPosition = {
  loai: "Lộc" | "Quyền" | "Khoa" | "Kỵ";
  sao: TuHoaTarget;
  chi: DiaChi | null; // null nếu không tìm thấy
};

function findStarPos(
  starName: TuHoaTarget,
  chinhTinh: Record<DiaChi, ChinhTinhAt[]>,
  phuTinh: Record<DiaChi, PhuTinhInfo[]>
): DiaChi | null {
  for (const chi of DIA_CHI) {
    if (chinhTinh[chi].some((s) => s.name === starName)) return chi;
    if (phuTinh[chi].some((s) => s.name === starName)) return chi;
  }
  return null;
}

export function locateHoa(
  canTarget: ThienCan,
  chinhTinh: Record<DiaChi, ChinhTinhAt[]>,
  phuTinh: Record<DiaChi, PhuTinhInfo[]>
): HoaPosition[] {
  const set = TU_HOA_BY_CAN[canTarget];
  return [
    { loai: "Lộc",   sao: set.loc,   chi: findStarPos(set.loc,   chinhTinh, phuTinh) },
    { loai: "Quyền", sao: set.quyen, chi: findStarPos(set.quyen, chinhTinh, phuTinh) },
    { loai: "Khoa",  sao: set.khoa,  chi: findStarPos(set.khoa,  chinhTinh, phuTinh) },
    { loai: "Kỵ",    sao: set.ky,    chi: findStarPos(set.ky,    chinhTinh, phuTinh) },
  ];
}

/* ============================================================
 * ĐẠI VẬN — 10 năm/vận, khởi từ Cung Mệnh
 *
 * Quy tắc (Tân Biên & CLAUDE.md):
 * - Đại Vận 1 bắt đầu năm tuổi = Cục số (Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6)
 * - Dương Nam + Âm Nữ: đi THUẬN qua 12 cung
 * - Âm Nam + Dương Nữ: đi NGHỊCH qua 12 cung
 * ============================================================ */

export type DaiVan = {
  index: number;       // 1..12
  chi: DiaChi;
  ageStart: number;
  ageEnd: number;
};

export type DaiVanInfo = {
  direction: "thuận" | "nghịch";
  cucSo: number;
  list: DaiVan[];                  // tất cả 12 đại vận
  currentAge: number;              // tuổi hiện tại (theo dương lịch năm hiện tại - năm sinh)
  currentIndex: number;            // 1..12, hoặc 0 nếu chưa vào Đại Vận 1
  currentDaiVan: DaiVan | null;    // null nếu chưa vào
};

export function tinhDaiVanAll(
  cungMenh: DiaChi,
  cucSo: number,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ"
): DaiVan[] {
  const huong = huongAm(canNam, gioiTinh); // 1 thuận, -1 nghịch
  const menhIdx = DIA_CHI.indexOf(cungMenh);
  const list: DaiVan[] = [];
  for (let i = 0; i < 12; i++) {
    const chi = DIA_CHI[mod12(menhIdx + huong * i)];
    const ageStart = cucSo + i * 10;
    list.push({ index: i + 1, chi, ageStart, ageEnd: ageStart + 9 });
  }
  return list;
}

export function tinhDaiVanInfo(
  cungMenh: DiaChi,
  cucSo: number,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ",
  namSinh: number,
  currentYear: number
): DaiVanInfo {
  const list = tinhDaiVanAll(cungMenh, cucSo, canNam, gioiTinh);
  const direction: "thuận" | "nghịch" =
    huongAm(canNam, gioiTinh) === 1 ? "thuận" : "nghịch";

  const currentAge = currentYear - namSinh;
  let currentIndex = 0;
  let currentDaiVan: DaiVan | null = null;
  for (const dv of list) {
    if (currentAge >= dv.ageStart && currentAge <= dv.ageEnd) {
      currentIndex = dv.index;
      currentDaiVan = dv;
      break;
    }
  }
  return { direction, cucSo, list, currentAge, currentIndex, currentDaiVan };
}

/* ============================================================
 * HÓA NĂM — Tứ Hóa theo can năm dương lịch hiện tại
 * (Lưu Niên Hóa)
 * ============================================================ */

export type HoaNamInfo = {
  year: number;
  canChi: { can: ThienCan; chi: DiaChi };
  cungLuuNien: DiaChi;     // chi của năm = cung Lưu Niên
  hoa: HoaPosition[];      // 4 Hóa Lộc/Quyền/Khoa/Kỵ + vị trí trên bàn
};

export function tinhHoaNamInfo(
  year: number,
  chinhTinh: Record<DiaChi, ChinhTinhAt[]>,
  phuTinh: Record<DiaChi, PhuTinhInfo[]>
): HoaNamInfo {
  const can = tinhThienCan(year);
  const chi = tinhDiaChi(year);
  return {
    year,
    canChi: { can, chi },
    cungLuuNien: chi, // Lưu Niên ở cung trùng chi năm
    hoa: locateHoa(can, chinhTinh, phuTinh),
  };
}

/* ============================================================
 * VÒNG BÁC SĨ — 12 sao đi theo Lộc Tồn
 *
 * Tân Biên §8.4 + Toàn Thư §Chùm sao đi theo Lộc Tồn.
 * Thứ tự: Bác Sĩ (tại Lộc Tồn) → Lực Sĩ → Thanh Long → Tiểu Hao →
 *   Tướng Quân → Tấu Thư → Phi Liêm → Hỷ Thần → Bệnh Phù → Đại Hao →
 *   Phục Binh → Quan Phủ.
 * Direction: Dương Nam + Âm Nữ THUẬN, Âm Nam + Dương Nữ NGHỊCH.
 * ============================================================ */

export const VONG_BAC_SI = [
  "Bác Sĩ", "Lực Sĩ", "Thanh Long", "Tiểu Hao",
  "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần",
  "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ",
] as const;
export type VongBacSiName = (typeof VONG_BAC_SI)[number];

export function anVongBacSi(
  locTon: DiaChi,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ"
): Record<DiaChi, VongBacSiName> {
  const startIdx = DIA_CHI.indexOf(locTon);
  const huong = huongAm(canNam, gioiTinh);
  const result = {} as Record<DiaChi, VongBacSiName>;
  for (let i = 0; i < 12; i++) {
    const chi = DIA_CHI[mod12(startIdx + huong * i)];
    result[chi] = VONG_BAC_SI[i];
  }
  return result;
}

/* ============================================================
 * VÒNG THÁI TUẾ — 12 sao đi theo Chi năm sinh
 *
 * Tân Biên §8.3.
 * Khởi: Thái Tuế tại chi năm sinh. Đếm THUẬN bất kể nam-nữ.
 * Thứ tự: Thái Tuế → Thiếu Dương → Tang Môn → Thiếu Âm → Quan Phù →
 *   Tử Phù → Tuế Phá → Long Đức → Bạch Hổ → Phúc Đức → Điếu Khách →
 *   Trực Phù.
 *
 * Lưu ý: "Quan Phù" ở vòng Thái Tuế khác "Quan Phủ" ở vòng Bác Sĩ
 * (vần khác — Phù 符 vs Phủ 府).
 * ============================================================ */

export const VONG_THAI_TUE = [
  "Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm",
  "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức",
  "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù",
] as const;
export type VongThaiTueName = (typeof VONG_THAI_TUE)[number];

export function anVongThaiTue(chiNam: DiaChi): Record<DiaChi, VongThaiTueName> {
  const startIdx = DIA_CHI.indexOf(chiNam);
  const result = {} as Record<DiaChi, VongThaiTueName>;
  for (let i = 0; i < 12; i++) {
    result[DIA_CHI[mod12(startIdx + i)]] = VONG_THAI_TUE[i];
  }
  return result;
}

/* ============================================================
 * PHỤ TINH KHÁC — Đào hoa, Quý tinh, Hung tinh, Sao theo cung
 * (Tân Biên §8.9, §8.11–19)
 * ============================================================ */

export type DaoHoaQuyTinhName =
  | "Hồng Loan" | "Thiên Hỷ"     // đào hoa, hôn nhân
  | "Tam Thai"  | "Bát Tọa"      // quý tinh tăng vinh
  | "Long Trì"  | "Phượng Các"   // văn nghệ, thẩm mỹ
  | "Thiên Đức" | "Nguyệt Đức"   // phúc đức hoá giải
  | "Thiên Khốc"| "Thiên Hư"     // buồn, hư danh
  | "Thiên Hình"| "Thiên Riêu" | "Thiên Y"  // hình, dâm, y
  | "Thiên Thương"| "Thiên Sứ";  // 2 sao cố định ở Nô Bộc và Tật Ách

export const DAO_HOA_QUY_TINH_INFO: Record<DaoHoaQuyTinhName, PhuTinhInfo> = {
  "Hồng Loan":   { name: "Hồng Loan", han: "紅鸞", kind: "cát", shortDesc: "Đào hoa, hôn nhân, hỷ sự" },
  "Thiên Hỷ":   { name: "Thiên Hỷ", han: "天喜", kind: "cát", shortDesc: "Tin vui, sinh con, hôn lễ" },
  "Tam Thai":   { name: "Tam Thai", han: "三台", kind: "cát", shortDesc: "Quý tinh — tăng vinh hiển" },
  "Bát Tọa":    { name: "Bát Tọa", han: "八座", kind: "cát", shortDesc: "Quý tinh — tăng phẩm tước" },
  "Long Trì":   { name: "Long Trì", han: "龍池", kind: "cát", shortDesc: "Văn nghệ, thông minh" },
  "Phượng Các": { name: "Phượng Các", han: "鳳閣", kind: "cát", shortDesc: "Thẩm mỹ, đoan trang" },
  "Thiên Đức":  { name: "Thiên Đức", han: "天德", kind: "cát", shortDesc: "Phúc đức — hoá giải sao hung" },
  "Nguyệt Đức": { name: "Nguyệt Đức", han: "月德", kind: "cát", shortDesc: "Phúc đức — bình an" },
  "Thiên Khốc": { name: "Thiên Khốc", han: "天哭", kind: "hung", shortDesc: "Khóc — buồn thương, tang chế" },
  "Thiên Hư":   { name: "Thiên Hư", han: "天虛", kind: "hung", shortDesc: "Hư danh — không thực" },
  "Thiên Hình": { name: "Thiên Hình", han: "天刑", kind: "hung", shortDesc: "Hình phạt, pháp luật" },
  "Thiên Riêu": { name: "Thiên Riêu", han: "天姚", kind: "hung", shortDesc: "Dâm dục, đào hoa xấu" },
  "Thiên Y":    { name: "Thiên Y", han: "天醫", kind: "cát", shortDesc: "Y học, chữa bệnh (đi cùng Riêu)" },
  "Thiên Thương":{name: "Thiên Thương", han: "天傷", kind: "hung", shortDesc: "Thương tổn — luôn ở Nô Bộc" },
  "Thiên Sứ":   { name: "Thiên Sứ", han: "天使", kind: "hung", shortDesc: "Sứ giả tử thần — luôn ở Tật Ách" },
};

// Hồng Loan: từ Mão (3) khởi năm Tý, đi NGHỊCH
export function tinhHongLoan(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(3 - DIA_CHI.indexOf(chiNam))];
}
// Thiên Hỷ: đối xung Hồng Loan (+6)
export function tinhThienHy(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(tinhHongLoan(chiNam)) + 6)];
}

// Tam Thai: từ vị trí Tả Phụ, đếm THUẬN đến ngày sinh
export function tinhTamThai(taPhuPos: DiaChi, ngaySinh: number): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(taPhuPos) + (ngaySinh - 1))];
}
// Bát Tọa: từ vị trí Hữu Bật, đếm NGHỊCH đến ngày sinh
export function tinhBatToa(huuBatPos: DiaChi, ngaySinh: number): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(huuBatPos) - (ngaySinh - 1))];
}

// Long Trì: từ Thìn (4), năm Tý, đếm THUẬN
export function tinhLongTri(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(4 + DIA_CHI.indexOf(chiNam))];
}
// Phượng Các: từ Tuất (10), năm Tý, đếm NGHỊCH
export function tinhPhuongCac(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(10 - DIA_CHI.indexOf(chiNam))];
}

// Thiên Đức: từ Dậu (9), năm Tý, đếm THUẬN
export function tinhThienDuc(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(9 + DIA_CHI.indexOf(chiNam))];
}
// Nguyệt Đức: từ Tỵ (5), năm Tý, đếm THUẬN
export function tinhNguyetDuc(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(5 + DIA_CHI.indexOf(chiNam))];
}

// Thiên Khốc: từ Ngọ (6), năm Tý, đếm NGHỊCH
export function tinhThienKhoc(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(6 - DIA_CHI.indexOf(chiNam))];
}
// Thiên Hư: từ Ngọ (6), năm Tý, đếm THUẬN
export function tinhThienHu(chiNam: DiaChi): DiaChi {
  return DIA_CHI[mod12(6 + DIA_CHI.indexOf(chiNam))];
}

// Thiên Hình: từ Dậu (9), tháng Giêng, đếm THUẬN
export function tinhThienHinh(thangSinh: number): DiaChi {
  return DIA_CHI[mod12(9 + (thangSinh - 1))];
}
// Thiên Riêu: từ Sửu (1), tháng Giêng, đếm THUẬN. Thiên Y đồng cung Riêu.
export function tinhThienRieu(thangSinh: number): DiaChi {
  return DIA_CHI[mod12(1 + (thangSinh - 1))];
}

// Thiên Thương: cố định tại cung Nô Bộc (idx 5 từ Mệnh đi thuận)
export function tinhThienThuong(cungMenh: DiaChi): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(cungMenh) + 5)];
}
// Thiên Sứ: cố định tại cung Tật Ách (idx 7 từ Mệnh đi thuận)
export function tinhThienSu(cungMenh: DiaChi): DiaChi {
  return DIA_CHI[mod12(DIA_CHI.indexOf(cungMenh) + 7)];
}

/** An toàn bộ 14 phụ tinh đào hoa/quý/hung. Cần taPhu + huuBat (đã tính). */
export function anDaoHoaQuyTinh(
  chiNam: DiaChi,
  thangSinh: number,
  ngaySinh: number,
  taPhuPos: DiaChi,
  huuBatPos: DiaChi,
  cungMenh: DiaChi
): Record<DiaChi, PhuTinhInfo[]> {
  const result = {} as Record<DiaChi, PhuTinhInfo[]>;
  for (const chi of DIA_CHI) result[chi] = [];
  const add = (chi: DiaChi, name: DaoHoaQuyTinhName) => {
    result[chi].push(DAO_HOA_QUY_TINH_INFO[name]);
  };

  add(tinhHongLoan(chiNam), "Hồng Loan");
  add(tinhThienHy(chiNam), "Thiên Hỷ");
  add(tinhTamThai(taPhuPos, ngaySinh), "Tam Thai");
  add(tinhBatToa(huuBatPos, ngaySinh), "Bát Tọa");
  add(tinhLongTri(chiNam), "Long Trì");
  add(tinhPhuongCac(chiNam), "Phượng Các");
  add(tinhThienDuc(chiNam), "Thiên Đức");
  add(tinhNguyetDuc(chiNam), "Nguyệt Đức");
  add(tinhThienKhoc(chiNam), "Thiên Khốc");
  add(tinhThienHu(chiNam), "Thiên Hư");
  add(tinhThienHinh(thangSinh), "Thiên Hình");
  const rieuPos = tinhThienRieu(thangSinh);
  add(rieuPos, "Thiên Riêu");
  add(rieuPos, "Thiên Y"); // Thiên Y đồng cung Thiên Riêu
  add(tinhThienThuong(cungMenh), "Thiên Thương");
  add(tinhThienSu(cungMenh), "Thiên Sứ");

  return result;
}

/* ============================================================
 * TUẦN & TRIỆT — Hai sao "Không Vong" của Tử Vi Việt
 *
 * Tuần (Tuần Trung Không Vong): theo block 10 năm Giáp-Quý trong vòng
 *   Lục Thập Hoa Giáp. Đứng giữa 2 chi liền nhau:
 *   - Năm 1-10 (Giáp Tý → Quý Dậu): Tuần Tuất-Hợi
 *   - Năm 11-20 (Giáp Tuất → Quý Mùi): Tuần Thân-Dậu
 *   - Năm 21-30: Tuần Ngọ-Mùi
 *   - Năm 31-40: Tuần Thìn-Tỵ
 *   - Năm 41-50: Tuần Dần-Mão
 *   - Năm 51-60: Tuần Tý-Sửu
 *
 * Triệt (Triệt Lộ Không Vong): theo Can năm sinh, đứng giữa 2 chi:
 *   - Giáp/Kỷ: Triệt Thân-Dậu
 *   - Ất/Canh: Triệt Ngọ-Mùi
 *   - Bính/Tân: Triệt Thìn-Tỵ
 *   - Đinh/Nhâm: Triệt Dần-Mão
 *   - Mậu/Quý: Triệt Tý-Sửu
 *
 * Nguồn: Tử Vi Đẩu Số Toàn Thư §TUẦN VÀ TRIỆT (Vũ Tài Lục), Tân Biên §13.
 * ============================================================ */

export type TuanTrietPos = {
  chi1: DiaChi;
  chi2: DiaChi;
};

export function tinhTuan(namSinh: number): TuanTrietPos {
  const idx = ((namSinh - 4) % 60 + 60) % 60;
  const block = Math.floor(idx / 10); // 0..5
  const c1 = mod12(10 - 2 * block);
  const c2 = mod12(11 - 2 * block);
  return { chi1: DIA_CHI[c1], chi2: DIA_CHI[c2] };
}

const TRIET_BY_CAN: Record<ThienCan, [DiaChi, DiaChi]> = {
  "Giáp": ["Thân", "Dậu"], "Kỷ":  ["Thân", "Dậu"],
  "Ất":   ["Ngọ", "Mùi"],   "Canh":["Ngọ", "Mùi"],
  "Bính": ["Thìn", "Tỵ"],   "Tân": ["Thìn", "Tỵ"],
  "Đinh": ["Dần", "Mão"],   "Nhâm":["Dần", "Mão"],
  "Mậu":  ["Tý", "Sửu"],    "Quý": ["Tý", "Sửu"],
};

export function tinhTriet(canNam: ThienCan): TuanTrietPos {
  const [c1, c2] = TRIET_BY_CAN[canNam];
  return { chi1: c1, chi2: c2 };
}

/* ============================================================
 * THIÊN MÃ — Sao ngựa, chủ di động, đi xa
 *
 * Theo nhóm tam hợp chi năm sinh (Toàn Thư §SAO THIÊN MÃ):
 *   - Thân/Tý/Thìn (Thủy cục) → Thiên Mã tại Dần
 *   - Hợi/Mão/Mùi (Mộc cục)  → Thiên Mã tại Tỵ
 *   - Dần/Ngọ/Tuất (Hỏa cục) → Thiên Mã tại Thân
 *   - Tỵ/Dậu/Sửu (Kim cục)  → Thiên Mã tại Hợi
 *
 * Quy luật: Thiên Mã đứng tại chi "khởi cục" của tam hợp ĐỐI XUNG.
 * ============================================================ */

const THIEN_MA_BY_CHI: Record<DiaChi, DiaChi> = {
  "Thân": "Dần", "Tý": "Dần", "Thìn": "Dần",
  "Hợi": "Tỵ",   "Mão": "Tỵ", "Mùi": "Tỵ",
  "Dần": "Thân", "Ngọ": "Thân", "Tuất": "Thân",
  "Tỵ": "Hợi",   "Dậu": "Hợi", "Sửu": "Hợi",
};

export function tinhThienMa(chiNam: DiaChi): DiaChi {
  return THIEN_MA_BY_CHI[chiNam];
}

/* ============================================================
 * VÒNG TRÀNG SINH — 12 giai đoạn sinh tử của hành Cục
 *
 * Vị trí khởi Tràng Sinh theo Cục (Toàn Thư §VÒNG TRÀNG SINH):
 *   - Thủy nhị / Thổ ngũ: Tràng Sinh tại Thân
 *   - Mộc tam: Tràng Sinh tại Hợi
 *   - Kim tứ: Tràng Sinh tại Tỵ
 *   - Hỏa lục: Tràng Sinh tại Dần
 *
 * 12 giai đoạn (đi thuận từ Tràng Sinh):
 *   Tràng Sinh → Mộc Dục → Quan Đới → Lâm Quan → Đế Vượng → Suy →
 *   Bệnh → Tử → Mộ → Tuyệt → Thai → Dưỡng.
 *
 * Nam dương + Nữ âm: đi THUẬN. Nam âm + Nữ dương: đi NGHỊCH.
 * ============================================================ */

export const VONG_TRANG_SINH = [
  "Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy",
  "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng",
] as const;
export type VongTrangSinhName = (typeof VONG_TRANG_SINH)[number];

export const VONG_TRANG_SINH_DESC: Record<VongTrangSinhName, string> = {
  "Tràng Sinh": "Mới sinh — khởi đầu, đầy sinh khí",
  "Mộc Dục":    "Tắm gội — non nớt, dễ tổn thương",
  "Quan Đới":   "Đội mũ áo — bắt đầu trưởng thành",
  "Lâm Quan":   "Đến triều — chuẩn bị có thực lực",
  "Đế Vượng":   "Đỉnh cao — sung mãn nhất",
  "Suy":        "Suy giảm — đỉnh đã qua, bắt đầu xuống",
  "Bệnh":       "Bệnh tật — sức lực hao mòn",
  "Tử":         "Chết — kết thúc một chu kỳ",
  "Mộ":         "Mộ phần — nằm yên, chôn vùi",
  "Tuyệt":      "Tuyệt diệt — hoàn toàn không còn",
  "Thai":       "Bào thai — bắt đầu tái sinh",
  "Dưỡng":      "Nuôi dưỡng — chuẩn bị sinh ra",
};

const TRANG_SINH_KHOI_THEO_CUC: Record<number, DiaChi> = {
  2: "Thân", // Thủy nhị
  3: "Hợi",  // Mộc tam
  4: "Tỵ",   // Kim tứ
  5: "Thân", // Thổ ngũ
  6: "Dần",  // Hỏa lục
};

export function anVongTrangSinh(
  cucSo: number,
  canNam: ThienCan,
  gioiTinh: "Nam" | "Nữ"
): Record<DiaChi, VongTrangSinhName> {
  const start = TRANG_SINH_KHOI_THEO_CUC[cucSo];
  const startIdx = DIA_CHI.indexOf(start);
  const huong = huongAm(canNam, gioiTinh);
  const result = {} as Record<DiaChi, VongTrangSinhName>;
  for (let i = 0; i < 12; i++) {
    const chi = DIA_CHI[mod12(startIdx + huong * i)];
    result[chi] = VONG_TRANG_SINH[i];
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
  /** Phụ tinh tại từng địa chi (13 sao trải đều) */
  phuTinh: Record<DiaChi, PhuTinhInfo[]>;
  /** Đại Vận (12 vận, mỗi vận 10 năm) + đại vận hiện tại */
  daiVan: DaiVanInfo;
  /** Tứ Hóa bẩm sinh (theo can năm sinh) — đậu vào sao nào, ở chi nào */
  tuHoaSinh: HoaPosition[];
  /** Tứ Hóa năm hiện tại (Lưu Niên Hóa) */
  hoaNam: HoaNamInfo;
  /** Tuần Trung Không Vong — đứng giữa 2 chi */
  tuan: TuanTrietPos;
  /** Triệt Lộ Không Vong — đứng giữa 2 chi */
  triet: TuanTrietPos;
  /** Sao Thiên Mã — đi xa, di động (chủ Thiên Di) */
  thienMa: DiaChi;
  /** Vòng Tràng Sinh — 12 giai đoạn sinh tử tại 12 chi */
  vongTrangSinh: Record<DiaChi, VongTrangSinhName>;
  /** Vòng Bác Sĩ — 12 sao theo Lộc Tồn, 1 sao/cung */
  vongBacSi: Record<DiaChi, VongBacSiName>;
  /** Vòng Thái Tuế — 12 sao theo chi năm, 1 sao/cung */
  vongThaiTue: Record<DiaChi, VongThaiTueName>;
  /** 15 phụ tinh đào hoa/quý/hung (Hồng Loan, Tam Thai, Thiên Hình, Riêu...) */
  daoHoaQuyTinh: Record<DiaChi, PhuTinhInfo[]>;
};

export function lapLaSoCoBan(input: {
  namSinh: number;
  thangSinh: number;
  ngaySinh: number;
  gioSinh: number;
  gioiTinh: "Nam" | "Nữ";
  /** Năm hiện tại — mặc định lấy năm dương lịch hệ thống */
  currentYear?: number;
}): LaSoBasic {
  const can = tinhThienCan(input.namSinh);
  const chi = tinhDiaChi(input.namSinh);
  const napAm = tinhNapAm(input.namSinh);
  const cungMenh = tinhCungMenh(input.thangSinh, input.gioSinh);
  const cungThan = tinhCungThan(input.thangSinh, input.gioSinh);
  const cuc = tinhCuc(can, cungMenh);
  const tuViPos = tinhTuViPosition(cuc.cucSo, input.ngaySinh);
  const thienPhuPos = tinhThienPhuPosition(tuViPos);
  const chinhTinh = an14ChinhTinh(tuViPos);
  const phuTinh = anPhuTinhAll({
    canNam: can,
    chiNam: chi,
    thangSinh: input.thangSinh,
    gioSinh: input.gioSinh,
    gioiTinh: input.gioiTinh,
  });
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const daiVan = tinhDaiVanInfo(cungMenh, cuc.cucSo, can, input.gioiTinh, input.namSinh, currentYear);
  const tuHoaSinh = locateHoa(can, chinhTinh, phuTinh);
  const hoaNam = tinhHoaNamInfo(currentYear, chinhTinh, phuTinh);
  return {
    namSinh: input.namSinh,
    thangSinh: input.thangSinh,
    ngaySinh: input.ngaySinh,
    gioSinh: input.gioSinh,
    gioiTinh: input.gioiTinh,
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
    chinhTinh,
    phuTinh,
    daiVan,
    tuHoaSinh,
    hoaNam,
    tuan: tinhTuan(input.namSinh),
    triet: tinhTriet(can),
    thienMa: tinhThienMa(chi),
    vongTrangSinh: anVongTrangSinh(cuc.cucSo, can, input.gioiTinh),
    vongBacSi: anVongBacSi(tinhLocTon(can), can, input.gioiTinh),
    vongThaiTue: anVongThaiTue(chi),
    daoHoaQuyTinh: anDaoHoaQuyTinh(
      chi,
      input.thangSinh,
      input.ngaySinh,
      tinhTaPhu(input.thangSinh),
      tinhHuuBat(input.thangSinh),
      cungMenh
    ),
  };
}
