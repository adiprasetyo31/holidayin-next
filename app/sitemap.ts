import type { MetadataRoute } from "next";

import { destinations } from "@/src/lib/destinations";
import { absoluteUrl } from "@/src/lib/site";

/**
 * Peta situs dibangun dari `destinations`, yang sudah disaring ke yang
 * published, jadi destinasi tanpa foto tidak pernah bocor ke sini.
 *
 * lastModified tiap destinasi memakai lastVerified, karena itu tanggal isi
 * halamannya terakhir diperiksa. /styleguide sengaja tidak didaftarkan:
 * halaman itu alat bantu internal, bukan isi yang perlu diindeks.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const terbaru = destinations
    .map((d) => d.lastVerified)
    .sort()
    .at(-1);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: terbaru,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/destinasi"),
      lastModified: terbaru,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...destinations.map((destination) => ({
      url: absoluteUrl(`/destinasi/${destination.slug}`),
      lastModified: destination.lastVerified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
