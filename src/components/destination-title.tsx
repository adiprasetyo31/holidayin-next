import Link from "next/link";

import {
  categoryShortLabel,
  destinasiHref,
  regionShortLabel,
  type Destination,
} from "@/src/lib/destinations";

/**
 * Remah roti, label kategori dan wilayah, lalu judul. Semuanya duduk di atas
 * latar halaman biasa: tidak ada foto maupun tirai di belakangnya, jadi
 * warnanya memakai token teks biasa.
 */
export function DestinationTitle({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <header className="mx-auto max-w-page px-gutter pt-block">
      <nav aria-label="Remah roti" className="text-caption text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Beranda
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/destinasi" className="hover:text-accent">
              Destinasi
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text">{destination.name}</li>
        </ol>
      </nav>

      {/* highlight tidak pernah dipakai sebagai warna teks, jadi label memakai accent. */}
      <p className="mt-block flex flex-wrap items-center gap-2 text-micro font-medium uppercase text-accent">
        <Link
          href={destinasiHref({ kategori: destination.category })}
          className="hover:underline"
        >
          {categoryShortLabel(destination.category)}
        </Link>
        <span aria-hidden className="text-muted">
          &middot;
        </span>
        <Link
          href={destinasiHref({ wilayah: destination.region })}
          className="hover:underline"
        >
          {regionShortLabel(destination.region)}
        </Link>
      </p>

      <h1 className="mt-3 max-w-prose font-display text-h1 text-text">
        {destination.name}
      </h1>
    </header>
  );
}
