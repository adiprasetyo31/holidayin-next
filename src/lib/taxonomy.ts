/**
 * Satu-satunya tempat label pendek wilayah dan kategori ditulis.
 *
 * Berkas ini sengaja tidak mengimpor destinations.json. Dengan begitu komponen
 * klien boleh memakainya tanpa ikut menyeret seluruh data destinasi ke bundel
 * peramban, dan label di beranda selalu sama dengan label di penyaring
 * /destinasi karena keduanya membaca dari sini.
 *
 * Label panjang ("Kabupaten Sleman", "Budaya & Sejarah") tetap tinggal di
 * destinations.json dan dipakai pada kartu serta halaman detail.
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
