/**
 * Alamat kanonis situs, satu sumber untuk metadataBase, sitemap, robots,
 * tautan canonical, dan URL gambar Open Graph.
 *
 * NEXT_PUBLIC_SITE_URL disisipkan saat build, jadi pratinjau Vercel bisa
 * memakai alamatnya sendiri tanpa mengubah kode. Tanpa variabel itu nilainya
 * jatuh ke domain produksi, bukan localhost, supaya build yang lupa memasang
 * variabel tetap menghasilkan URL absolut yang benar alih-alih menyebar
 * http://localhost:3000 ke dalam sitemap dan tag og:image.
 */
const FALLBACK = "https://holidayin-six.vercel.app";

/** Tanpa garis miring di ujung, supaya `${SITE_URL}/destinasi` tidak berganda. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK).replace(
  /\/+$/,
  ""
);

/** Bentuk URL untuk metadataBase; Next memakainya untuk melengkapi jalur relatif. */
export const siteUrl = new URL(SITE_URL);

/** Jalur relatif menjadi URL absolut. Jalur tanpa "/" di depan ikut dibetulkan. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
