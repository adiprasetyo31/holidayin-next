import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/src/lib/site";

/**
 * /styleguide ditutup dari perayap: isinya token warna dan angka kontras,
 * bukan halaman yang berguna di hasil pencarian.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/styleguide",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
