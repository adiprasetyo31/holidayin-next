import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DestinationDescription } from "@/src/components/destination-description";
import { DestinationGallery } from "@/src/components/destination-gallery";
import { DestinationInfoCard } from "@/src/components/destination-info-card";
import { DestinationTitle } from "@/src/components/destination-title";
import { RelatedDestinations } from "@/src/components/related-destinations";
import { destinations, getDestination } from "@/src/lib/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinasi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return {};

  const path = `/destinasi/${destination.slug}`;

  // images.card selalu ada untuk destinasi published, tapi tipenya tetap boleh
  // null, jadi tag og:image dihilangkan alih-alih diisi jalur kosong.
  // metadataBase melengkapi jalur relatif ini menjadi URL absolut.
  const images = destination.images.card
    ? [
        {
          url: destination.images.card.src,
          width: 1600,
          height: 1200,
          alt: destination.name,
        },
      ]
    : [];

  return {
    title: destination.name,
    description: destination.shortDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: destination.name,
      description: destination.shortDescription,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: destination.name,
      description: destination.shortDescription,
      images,
    },
  };
}

export default async function DetailDestinasi({
  params,
}: PageProps<"/destinasi/[slug]">) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  // Foto kartu selalu jadi foto pertama; sebagian destinasi memuat ulang foto
  // kartu di dalam galerinya, jadi yang kembar disaring di sini.
  const foto = [
    ...(destination.images.card ? [destination.images.card] : []),
    ...destination.images.gallery,
  ].filter(
    (image, index, all) => all.findIndex((x) => x.src === image.src) === index
  );

  return (
    <article>
      <DestinationTitle destination={destination} />

      <div className="mx-auto max-w-page px-gutter pt-block pb-section">
        {/*
          Satu kisi, tiga anak. Urutan DOM-nya galeri, kartu info, lalu uraian,
          yang langsung menjadi urutan di layar sempit. Pada layar lebar
          penempatannya diatur eksplisit sehingga uraian kembali ke kolom kiri
          di bawah galeri, dan kartu info menempati kolom kanan.

          min-w-0 di tiap anak kisi wajib: tanpa itu min-width auto membuat anak
          menolak menyusut di bawah lebar isinya, dan deretan thumbnail yang lebih
          lebar dari layar akan mendorong seluruh halaman menggulir ke samping.
        */}
        <div className="grid gap-block lg:grid-cols-[2fr_1fr] lg:gap-x-12">
          {foto.length > 0 && (
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <DestinationGallery images={foto} name={destination.name} />
            </div>
          )}

          {/* self-start menahan kartu pada tingginya sendiri, sejajar puncak galeri,
              alih-alih diregangkan setinggi dua baris kisi. */}
          <aside className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start">
            <DestinationInfoCard destination={destination} />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <DestinationDescription destination={destination} />
          </div>
        </div>

        {/* Bagian ulasan fase berikutnya disisipkan di sini. */}

        <div className="mt-section">
          <RelatedDestinations destination={destination} />
        </div>
      </div>
    </article>
  );
}
