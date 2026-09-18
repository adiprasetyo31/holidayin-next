"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageCredit } from "@/src/components/image-credit";
import type { DestinationImage } from "@/src/lib/destinations";

/** Jarak geser minimum sebelum dihitung sebagai perpindahan foto. */
const AMBANG_GESER = 40;

const TOMBOL_ARAH =
  "absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center " +
  "rounded-pill border border-line bg-background/85 text-text backdrop-blur " +
  "transition-colors hover:border-accent hover:text-accent";

function Panah({ arah }: { arah: "kiri" | "kanan" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={arah === "kiri" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

/**
 * Galeri foto destinasi: satu foto utama, tombol arah, geser di layar sentuh,
 * tombol panah papan ketik, dan deretan thumbnail.
 *
 * Tidak ada putar otomatis. Foto berpindah hanya karena tindakan pengunjung.
 *
 * Soal pemuatan: hanya foto aktif dan foto berikutnya yang dirender. Foto
 * berikutnya duduk di atas foto aktif dengan opacity 0 sehingga berkasnya ikut
 * diambil lebih dulu dan perpindahan terasa seketika. Foto sisanya sengaja
 * tidak dirender sama sekali; menumpuk semuanya dengan loading="lazy" tidak
 * menunda apa pun karena elemennya tetap berada di dalam viewport.
 */
export function DestinationGallery({
  images,
  name,
}: {
  images: DestinationImage[];
  name: string;
}) {
  const [aktif, setAktif] = useState(0);
  const sentuh = useRef<{ x: number; y: number } | null>(null);

  const jumlah = images.length;
  const banyakFoto = jumlah > 1;

  const pindah = useCallback(
    (langkah: number) => {
      setAktif((sekarang) => (sekarang + langkah + jumlah) % jumlah);
    },
    [jumlah]
  );

  // Thumbnail aktif digulirkan ke dalam pandangan saat foto berpindah lewat
  // panah atau geseran, supaya penanda aktifnya tidak tersembunyi di luar layar.
  const daftarThumb = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = daftarThumb.current?.children[aktif];
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [aktif]);

  if (jumlah === 0) return null;

  const sekarang = images[aktif];
  const berikutnya = banyakFoto ? images[(aktif + 1) % jumlah] : null;

  return (
    <section aria-label={`Galeri foto ${name}`}>
      <div
        // Bisa difokus supaya panah papan ketik punya sasaran yang jelas.
        tabIndex={banyakFoto ? 0 : -1}
        role={banyakFoto ? "group" : undefined}
        aria-label={
          banyakFoto
            ? `Foto ${name}. Gunakan tombol panah kiri dan kanan untuk berpindah foto.`
            : undefined
        }
        onKeyDown={(e) => {
          if (!banyakFoto) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            pindah(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            pindah(1);
          }
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          sentuh.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const awal = sentuh.current;
          sentuh.current = null;
          if (!awal || !banyakFoto) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - awal.x;
          const dy = t.clientY - awal.y;
          // Gerak yang lebih tegak dianggap menggulir halaman, bukan menggeser foto.
          if (Math.abs(dx) < AMBANG_GESER || Math.abs(dx) <= Math.abs(dy)) return;
          pindah(dx < 0 ? 1 : -1);
        }}
        className="relative aspect-[3/2] overflow-hidden rounded-card border border-line bg-surface"
      >
        <Image
          key={sekarang.src}
          src={sekarang.src}
          alt={
            banyakFoto
              ? `${name}, foto ${aktif + 1} dari ${jumlah}`
              : name
          }
          fill
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />

        {/* Foto berikutnya diambil lebih dulu, tapi tidak ikut terlihat maupun terbaca. */}
        {berikutnya && berikutnya.src !== sekarang.src && (
          <Image
            key={`pramuat-${berikutnya.src}`}
            src={berikutnya.src}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="pointer-events-none object-cover opacity-0"
          />
        )}

        {banyakFoto && (
          <>
            <button
              type="button"
              onClick={() => pindah(-1)}
              aria-label="Foto sebelumnya"
              className={`${TOMBOL_ARAH} left-3`}
            >
              <Panah arah="kiri" />
            </button>
            <button
              type="button"
              onClick={() => pindah(1)}
              aria-label="Foto berikutnya"
              className={`${TOMBOL_ARAH} right-3`}
            >
              <Panah arah="kanan" />
            </button>

            <p
              aria-hidden
              className="absolute bottom-3 right-3 rounded-pill border border-line bg-background/85 px-3 py-1 text-micro tabular-nums tracking-normal text-muted backdrop-blur"
            >
              {aktif + 1} / {jumlah}
            </p>
          </>
        )}
      </div>

      {/* Pengumuman untuk pembaca layar; penghitung di atas hanya visual. */}
      {banyakFoto && (
        <p aria-live="polite" className="sr-only">
          Foto {aktif + 1} dari {jumlah}
        </p>
      )}

      <ImageCredit credit={sekarang.imageCredit} className="mt-3" />

      {banyakFoto && (
        <ul
          ref={daftarThumb}
          className="mt-4 flex gap-3 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setAktif(index)}
                aria-label={`Tampilkan foto ${index + 1} dari ${jumlah}`}
                aria-current={index === aktif ? "true" : undefined}
                className={`relative block h-16 w-24 overflow-hidden rounded-field border-2 transition-opacity ${
                  index === aktif
                    ? "border-accent opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
