import Image from "next/image";
import Link from "next/link";

import { CategoryTiles } from "@/src/components/category-tiles";
import { DestinationCard } from "@/src/components/destination-card";
import { RegionCards } from "@/src/components/region-cards";
import { buttonClass } from "@/src/components/ui/button";
import {
  destinations,
  featuredDestinations,
  filledCategories,
  filledRegions,
  getDestination,
} from "@/src/lib/destinations";

const HERO = "candi-prambanan";

const STATS = [
  { value: destinations.length, label: "destinasi" },
  { value: filledRegions.length, label: "wilayah" },
  { value: filledCategories.length, label: "kategori" },
];

export default function Home() {
  const pilihan = featuredDestinations;

  // Foto hero diambil dari data, bukan jalur yang ditulis tangan, supaya ikut
  // berpindah saat berkas gambar diganti.
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
        </div>
      </section>

      {/* Irama tegak beranda: tiap bagian setelah hero dibuka pt-section, dan
          bagian terakhir menutup dengan pb-section. Jaraknya jadi sama di
          keempat peralihan: hero, wilayah, kategori, destinasi pilihan. */}
      <section className="mx-auto max-w-page px-gutter pt-section">
        <h2 className="font-display text-h2">Telusuri per wilayah</h2>
        <RegionCards />
      </section>

      <section className="mx-auto max-w-page px-gutter pt-section">
        <h2 className="font-display text-h2">Telusuri per kategori</h2>
        <CategoryTiles />
      </section>

      {/*
        Judul, kisi, lalu tautan: urutan DOM ini langsung jadi urutan di layar
        sempit, sehingga "Lihat semua" jatuh di bawah kisi. Mulai sm penempatan
        kisinya diatur eksplisit supaya tautan naik sebaris dengan judul.
      */}
      <section className="mx-auto max-w-page px-gutter pt-section pb-section">
        <div className="grid gap-y-8 sm:grid-cols-[1fr_auto] sm:items-baseline">
          <h2 className="font-display text-h2 sm:col-start-1 sm:row-start-1">
            Destinasi pilihan
          </h2>

          <div className="grid gap-6 sm:col-span-2 sm:row-start-2 sm:grid-cols-2 lg:grid-cols-3">
            {pilihan.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>

          <Link
            href="/destinasi"
            className="text-caption font-medium text-accent hover:underline sm:col-start-2 sm:row-start-1 sm:justify-self-end"
          >
            Lihat semua {destinations.length} destinasi
          </Link>
        </div>
      </section>
    </>
  );
}
