/**
 * Cerminan token dari app/globals.css, khusus untuk halaman /styleguide.
 *
 * SEMENTARA: dipakai hanya untuk mendokumentasikan nilai token dan menghitung
 * rasio kontras. Komponen tidak boleh mengimpor berkas ini — pakai utilitas
 * Tailwind (bg-surface, text-muted, ...). Ikut dihapus bersama /styleguide.
 */

export type ColorToken = {
  /** Nama utilitas Tailwind, mis. "surface" untuk bg-surface. */
  name: string;
  light: string;
  dark: string;
  note: string;
  /** Warna latar yang dipakai saat mengukur kontras, jika token ini teks. */
  contrastOn?: "background" | "surface";
};

export const colorTokens: ColorToken[] = [
  {
    name: "background",
    light: "#F7F3EC",
    dark: "#1A1612",
    note: "Kertas hangat. Latar halaman.",
  },
  {
    name: "surface",
    light: "#EFE7DA",
    dark: "#241E18",
    note: "Kartu, bilah, dan bidang yang naik satu tingkat.",
  },
  {
    name: "surface-raised",
    light: "#E6DBC9",
    dark: "#2F2720",
    note: "Turunan: bidang di atas surface (mis. input di dalam kartu).",
  },
  {
    name: "text",
    light: "#2B211A",
    dark: "#EFE6D9",
    note: "Sogan tua. Teks utama.",
    contrastOn: "background",
  },
  {
    name: "muted",
    light: "#7A6A5C",
    dark: "#A2937F",
    note: "Teks sekunder dan keterangan.",
    contrastOn: "background",
  },
  {
    name: "accent",
    light: "#9C5B2E",
    dark: "#C77F4A",
    note:
      "Sogan. Dipakai hemat: satu aksi utama per bagian. " +
      "Juga dipakai untuk label kecil huruf besar, menggantikan highlight.",
    contrastOn: "background",
  },
  {
    name: "accent-hover",
    light: "#824B26",
    dark: "#D99A6A",
    note: "Turunan: keadaan hover untuk isian accent.",
  },
  {
    name: "on-accent",
    light: "#F7F3EC",
    dark: "#1A1612",
    note: "Turunan: teks di atas isian accent.",
  },
  {
    name: "highlight",
    light: "#B8893A",
    dark: "#D6A85A",
    note:
      "Emas kraton. Hanya untuk unsur non-teks: garis, ikon, tepi, aksen dekoratif. " +
      "Kontrasnya di atas kertas terlalu rendah untuk teks.",
  },
  {
    name: "stone",
    light: "#5E6660",
    dark: "#8A938C",
    note: "Andesit. Tag dan UI sekunder.",
    contrastOn: "background",
  },
];

/** Token garis memakai alpha, jadi kontrasnya tidak diukur. */
export const lineTokens = [
  { name: "line", light: "rgb(43 33 26 / 0.14)", dark: "rgb(239 230 217 / 0.16)" },
  {
    name: "line-strong",
    light: "rgb(43 33 26 / 0.28)",
    dark: "rgb(239 230 217 / 0.32)",
  },
];

/** Warna tetap untuk teks di atas foto; sama di kedua mode. */
export const scrimTokens = [
  { name: "scrim", value: "#2B211A" },
  { name: "on-scrim", value: "#F7F3EC" },
  { name: "on-scrim-muted", value: "rgb(239 231 218 / 0.85)" },
];

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const v = hex.replace("#", "");
  const r = Number.parseInt(v.slice(0, 2), 16);
  const g = Number.parseInt(v.slice(2, 4), 16);
  const b = Number.parseInt(v.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Rasio kontras WCAG 2.1, dibulatkan dua desimal. */
export function contrastRatio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  return Math.round(ratio * 100) / 100;
}

/** Label kelulusan untuk teks berukuran normal. */
export function wcagLabel(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA besar";
  return "gagal";
}

export const typeScale = [
  { name: "display", value: "clamp(2.5rem, 1.85rem + 3.2vw, 4rem)", face: "display" },
  { name: "h1", value: "clamp(2rem, 1.6rem + 2vw, 3rem)", face: "display" },
  { name: "h2", value: "clamp(1.5rem, 1.32rem + 0.9vw, 2rem)", face: "display" },
  { name: "h3", value: "1.375rem", face: "display" },
  { name: "h4", value: "1.125rem", face: "display" },
  { name: "body-lg", value: "1.125rem / 1.7", face: "sans" },
  { name: "body", value: "1rem / 1.65", face: "sans" },
  { name: "caption", value: "0.875rem / 1.5", face: "sans" },
  { name: "micro", value: "0.75rem, tracking 0.08em", face: "sans" },
] as const;

export const spacingTokens = [
  { name: "gutter", value: "clamp(1rem, 0.6rem + 1.6vw, 1.5rem)", use: "padding tepi halaman" },
  { name: "block", value: "clamp(1.5rem, 1.1rem + 1.8vw, 2.5rem)", use: "jarak antar blok" },
  { name: "section", value: "clamp(3rem, 2rem + 5vw, 6rem)", use: "jarak antar bagian besar" },
];

export const radiusTokens = [
  { name: "field", value: "0.75rem", use: "input, tombol ikon" },
  { name: "card", value: "1rem", use: "kartu, panel" },
  { name: "pill", value: "9999px", use: "tombol, chip" },
];
