import Image from "next/image";
import Link from "next/link";

import { DestinationCard } from "@/src/components/destination-card";
import { ImageCredit } from "@/src/components/image-credit";
import { buttonClass } from "@/src/components/ui/button";
import {
  categories,
  countByCategory,
  countByRegion,
  destinasiHref,
  destinations,
  filledCategories,
  filledRegions,
  getDestination,
} from "@/src/lib/destinations";

const UNGGULAN = ["candi-prambanan", "pantai-indrayanti", "heha-sky-view"];
const HERO = "candi-prambanan";

const STATS = [
  { value: destinations.length, label: "destinasi" },
  { value: filledRegions.length, label: "wilayah" },
  { value: filledCategories.length, label: "kategori" },
];

export default function Home() {
  const unggulan = UNGGULAN.map(getDestination).filter(
    (d): d is NonNullable<typeof d> => Boolean(d)
  );

  // Foto hero diambil dari data, bukan jalur yang ditulis tangan, supaya ikut
  // berpindah saat berkas gambar diganti dan kreditnya tetap terbawa.
  const hero = getDestination(HERO)?.images.card;

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {hero && (
            <Image
              src={hero.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-scrim/75 via-scrim/60 to-scrim/85"
          />
        </div>

        <div className="mx-auto max-w-page px-gutter py-section">
          <p className="text-micro font-medium uppercase text-on-scrim-muted">
            Panduan Wisata Yogyakarta
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-h1 text-on-scrim">
            Dari lereng Merapi sampai pantai selatan
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-scrim-muted">
            {destinations.length} destinasi di {filledRegions.length} wilayah
            Yogyakarta. Cari berdasarkan kategori atau wilayah, cek info
            kunjungan, lalu buka lokasinya langsung di peta.
          </p>
          <Link href="/destinasi" className={buttonClass({ className: "mt-8" })}>
            Jelajahi destinasi
            <span aria-hidden>&rarr;</span>
          </Link>

          {/* Semua angka dihitung dari destinations.json, tidak ditulis tangan. */}
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-caption text-on-scrim-muted">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="font-medium text-on-scrim">{stat.value}</span>{" "}
                {stat.label}
              </li>
            ))}
          </ul>

          <ImageCredit
            credit={hero?.imageCredit ?? null}
            tone="on-scrim"
            className="mt-10"
          />
        </div>
      </section>

      <section className="mx-auto max-w-page px-gutter py-block">
        <h2 className="font-display text-h2">Telusuri per wilayah</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {filledRegions.map((region) => (
            <li key={region.id}>
              <Link
                href={destinasiHref({ wilayah: region.id })}
                className="inline-flex items-baseline gap-2 rounded-pill border border-line bg-surface px-5 py-2.5 text-caption transition-colors hover:border-accent hover:text-accent"
              >
                {region.label}
                <span className="text-micro tracking-normal text-muted">
                  {countByRegion(region.id)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-block font-display text-h2">Telusuri per kategori</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={destinasiHref({ kategori: category.id })}
                className="inline-flex items-baseline gap-2 rounded-pill border border-line bg-surface px-5 py-2.5 text-caption transition-colors hover:border-accent hover:text-accent"
              >
                {category.label}
                <span className="text-micro tracking-normal text-muted">
                  {countByCategory(category.id)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-page px-gutter pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-h2">Destinasi pilihan</h2>
          <Link
            href="/destinasi"
            className="text-caption font-medium text-accent hover:underline"
          >
            Lihat semua {destinations.length} destinasi
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {unggulan.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </section>
    </>
  );
}
