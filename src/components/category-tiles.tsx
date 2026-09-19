import {
  Landmark,
  MountainSnow,
  Palmtree,
  UtensilsCrossed,
  Waves,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  categories,
  categoryShortLabel,
  countByCategory,
  destinasiHref,
} from "@/src/lib/destinations";

/** Ikon per kategori. Kategori tanpa ikon jatuh ke Landmark. */
const IKON: Record<string, LucideIcon> = {
  budaya: Landmark,
  pantai: Waves,
  alam: MountainSnow,
  "taman-hiburan": Palmtree,
  kuliner: UtensilsCrossed,
  "desa-wisata": Wheat,
};

/**
 * Ubin kategori: ikon, nama, dan jumlah destinasi. Bergaris, tanpa foto,
 * supaya jelas berbeda dari kartu wilayah yang berfoto dan dari pil penyaring
 * di /destinasi. Tiap ubin membuka /destinasi dengan kategorinya terpilih.
 *
 * Enam kategori: dua kolom di seluler, tiga di layar sedang, dan enam di layar
 * lebar sehingga selalu terbagi rata tanpa ubin menggantung sendirian.
 */
export function CategoryTiles() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => {
        const Ikon = IKON[category.id] ?? Landmark;
        return (
          <li key={category.id}>
            <Link
              href={destinasiHref({ kategori: category.id })}
              className="flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent"
            >
              <Ikon
                aria-hidden
                className="size-6 shrink-0 text-accent"
                strokeWidth={1.6}
              />
              <div>
                <p className="text-caption font-medium text-text">
                  {categoryShortLabel(category.id)}
                </p>
                <p className="mt-0.5 text-caption text-muted">
                  {countByCategory(category.id)} destinasi
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
