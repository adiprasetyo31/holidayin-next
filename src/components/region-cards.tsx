import Image from "next/image";
import Link from "next/link";

import {
  countByRegion,
  destinasiHref,
  destinations,
  filledRegions,
  regionShortLabel,
} from "@/src/lib/destinations";

/**
 * Destinasi pewakil tiap wilayah, dipilih tangan karena yang paling dikenal
 * belum tentu yang pertama secara abjad: tanpa daftar ini Bantul diwakili foto
 * gerabah dan Kulon Progo foto burung.
 *
 * Bila slugnya hilang atau belum terbit, kartu jatuh ke destinasi terbit
 * pertama di wilayah itu, jadi daftar ini tidak pernah membuat kartu kosong.
 */
const PEWAKIL: Record<string, string> = {
  "kota-yogyakarta": "keraton-yogyakarta",
  sleman: "candi-prambanan",
  bantul: "pantai-parangtritis",
  gunungkidul: "goa-jomblang",
  "kulon-progo": "kalibiru",
};

/**
 * Foto pewakil satu wilayah. destinations sudah tersaring ke yang published,
 * jadi pencarian di sini tidak perlu memeriksa published lagi.
 */
function fotoWilayah(regionId: string) {
  const pilihan = destinations.find(
    (d) => d.slug === PEWAKIL[regionId] && d.region === regionId && d.images.card
  );
  const cadangan = destinations.find(
    (d) => d.region === regionId && d.images.card
  );
  return (pilihan ?? cadangan)?.images.card;
}

/**
 * Kartu foto per wilayah. Ini navigasi, bukan penyaring: tiap kartu membuka
 * /destinasi dengan wilayahnya sudah terpilih.
 *
 * Kota Yogyakarta melebar dua kolom di layar sempit supaya lima wilayah tetap
 * rapi dalam kisi dua kolom, dengan pola 1 + 2 + 2 dan tanpa sel kosong.
 */
export function RegionCards() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {filledRegions.map((region, index) => {
        const foto = fotoWilayah(region.id);
        const jumlah = countByRegion(region.id);
        const melebar = index === 0;

        return (
          <li
            key={region.id}
            className={melebar ? "col-span-2 sm:col-span-1" : undefined}
          >
            <Link
              href={destinasiHref({ wilayah: region.id })}
              className="group relative block overflow-hidden rounded-card border border-line"
            >
              {/* Rasio mengikuti lebar kolom: kartu lebar di seluler dibuat
                  lebih landai supaya tingginya tidak mendominasi layar. */}
              <div
                className={`relative ${
                  melebar ? "aspect-[2/1]" : "aspect-[4/5]"
                } sm:aspect-[3/4] lg:aspect-[3/4]`}
              >
                {foto ? (
                  <Image
                    src={foto.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface" />
                )}

                {/* Tirai bawah supaya teks putih tetap terbaca di atas foto apa pun. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-h4 leading-tight text-on-scrim">
                    {regionShortLabel(region.id)}
                  </p>
                  <p className="mt-0.5 text-caption text-on-scrim-muted">
                    {jumlah} destinasi
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
