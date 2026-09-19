/**
 * Satu-satunya tempat label wilayah dan kategori yang tampil di layar ditulis.
 *
 * Berkas ini sengaja tidak mengimpor destinations.json. Dengan begitu komponen
 * klien boleh memakainya tanpa ikut menyeret seluruh data destinasi ke bundel
 * peramban, dan label di beranda selalu sama dengan label di penyaring
 * /destinasi karena keduanya membaca dari sini.
 *
 * Seluruh UI memakai label pendek ini: kartu, judul halaman detail, pil filter,
 * dan navigasi beranda. Label panjang di destinations.json ("Kabupaten Sleman",
 * "Budaya & Sejarah") tidak lagi ditampilkan; sisanya hanya dua peran, yaitu
 * cadangan bila ada id baru yang belum terdaftar di sini, dan bahan pencarian
 * di matchesQuery supaya kueri "Kabupaten Sleman" tetap menemukan hasil.
 */

export const REGION_SHORT_LABEL: Record<string, string> = {
  "kota-yogyakarta": "Kota Yogyakarta",
  sleman: "Sleman",
  bantul: "Bantul",
  gunungkidul: "Gunungkidul",
  "kulon-progo": "Kulon Progo",
};

export const CATEGORY_SHORT_LABEL: Record<string, string> = {
  budaya: "Budaya",
  pantai: "Pantai",
  alam: "Alam",
  "taman-hiburan": "Hiburan",
  kuliner: "Kuliner",
  "desa-wisata": "Desa Wisata",
};

/** Label pendek wilayah; kembali ke fallback bila idnya belum terdaftar. */
export function regionShortLabelFor(id: string, fallback: string): string {
  return REGION_SHORT_LABEL[id] ?? fallback;
}

/** Label pendek kategori; kembali ke fallback bila idnya belum terdaftar. */
export function categoryShortLabelFor(id: string, fallback: string): string {
  return CATEGORY_SHORT_LABEL[id] ?? fallback;
}
