import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DestinationCard } from "@/src/components/destination-card";
import { Gallery } from "@/src/components/gallery";
import {
  categoryLabel,
  destinasiHref,
  destinations,
  formatLastVerified,
  formatRate,
  getDestination,
  rateLabel,
  regionLabel,
} from "@/src/lib/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinasi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return {};

  return {
    title: destination.name,
    description: destination.shortDescription,
    openGraph: {
      title: destination.name,
      description: destination.shortDescription,
      images: [destination.images.card.src],
    },
  };
}

export default async function DetailDestinasi({
  params,
}: PageProps<"/destinasi/[slug]">) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const { info, location } = destination;
  const rates = info.ticket.rates;
  const adaInfoPraktis =
    Boolean(info.openingHours) || rates.length > 0 || Boolean(info.notes);

  // Foto kartu selalu jadi foto pertama; galeri boleh kosong, dan sebagian
  // destinasi memuat ulang foto kartu di dalam galeri, jadi disaring di sini.
  const foto = [destination.images.card, ...destination.images.gallery].filter(
    (image, index, all) => all.findIndex((x) => x.src === image.src) === index
  );

  // Sekategori dulu, dan yang sewilayah didahulukan supaya saran tetap masuk akal
  // sekarang setelah satu kategori bisa berisi belasan destinasi.
  const lainnya = destinations
    .filter((d) => d.category === destination.category && d.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.region === destination.region) -
        Number(a.region === destination.region)
    )
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Remah roti" className="text-sm text-muted">
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

      <header className="mt-6">
        <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
          <Link
            href={destinasiHref({ kategori: destination.category })}
            className="hover:underline"
          >
            {categoryLabel(destination.category)}
          </Link>
          <span aria-hidden className="text-stone">
            &middot;
          </span>
          <Link
            href={destinasiHref({ wilayah: destination.region })}
            className="hover:underline"
          >
            {regionLabel(destination.region)}
          </Link>
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {destination.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {destination.shortDescription}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Gallery images={foto} name={destination.name} />

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Deskripsi tempat
            </h2>
            <div className="mt-4 space-y-4">
              {destination.description.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-text/90">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {destination.tags.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {destination.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-stone/15 px-3 py-1 text-xs text-stone"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-6">
          {adaInfoPraktis && (
            <section className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-display text-lg font-semibold">
                Informasi terkait
              </h2>

              {info.openingHours && (
                <div className="mt-5">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                    Jam buka
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed">
                    {info.openingHours}
                  </p>
                </div>
              )}

              {rates.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                    Harga tiket
                  </h3>
                  <dl className="mt-2 space-y-2">
                    {rates.map((rate) => (
                      <div
                        key={`${rate.visitor}-${rate.day}`}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-sm text-muted">
                          {rateLabel(rate)}
                        </dt>
                        <dd className="text-sm font-medium">
                          {formatRate(rate)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {info.notes && (
                <p className="mt-5 text-xs leading-relaxed text-muted">
                  {info.notes}
                </p>
              )}
            </section>
          )}

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold">Lokasi</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {location.address}
            </p>
            <a
              href={location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              Buka di Google Maps
              <span aria-hidden>&rarr;</span>
            </a>
          </section>

          <p className="text-xs leading-relaxed text-muted">
            Info diperbarui {formatLastVerified(destination.lastVerified)}. Jam
            buka dan harga tiket dapat berubah sewaktu-waktu.
          </p>
        </aside>
      </div>

      {lainnya.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold">
            Destinasi serupa
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((item) => (
              <DestinationCard key={item.slug} destination={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
