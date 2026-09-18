import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DestinationCard } from "@/src/components/destination-card";
import { DestinationMap } from "@/src/components/destination-map";
import { Gallery } from "@/src/components/gallery";
import { ImageCredit } from "@/src/components/image-credit";
import { NoPhoto } from "@/src/components/no-photo";
import {
  categoryLabel,
  destinasiHref,
  destinations,
  formatLastVerified,
  formatRate,
  getDestination,
  getRelated,
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
      images: destination.images.card ? [destination.images.card.src] : [],
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
  const { lat, lng } = location;
  const rates = info.ticket.rates;
  const adaInfoPraktis =
    Boolean(info.openingHours) || rates.length > 0 || Boolean(info.notes);

  const hero = destination.images.card;

  // Foto kartu selalu jadi foto pertama; galeri boleh kosong, dan sebagian
  // destinasi memuat ulang foto kartu di dalam galeri, jadi disaring di sini.
  const foto = [
    ...(destination.images.card ? [destination.images.card] : []),
    ...destination.images.gallery,
  ].filter(
    (image, index, all) => all.findIndex((x) => x.src === image.src) === index
  );

  const { items: lainnya, sameRegion } = getRelated(destination);
  const judulLainnya = sameRegion
    ? `Destinasi lain di ${regionLabel(destination.region)}`
    : "Destinasi lain";

  return (
    <article>
      <header className="relative isolate flex min-h-[24rem] flex-col justify-between overflow-hidden sm:min-h-[28rem] lg:min-h-[32rem]">
        {hero ? (
          <>
            <Image
              src={hero.src}
              alt={destination.name}
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-b from-scrim/70 via-scrim/45 to-scrim/90"
            />
          </>
        ) : (
          <div className="absolute inset-0 -z-10">
            <NoPhoto tone="on-scrim" />
          </div>
        )}

        <nav
          aria-label="Remah roti"
          className="mx-auto w-full max-w-page px-gutter pt-block text-caption text-on-scrim-muted"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-on-scrim">
                Beranda
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/destinasi" className="hover:text-on-scrim">
                Destinasi
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-on-scrim">{destination.name}</li>
          </ol>
        </nav>

        <div className="mx-auto w-full max-w-page px-gutter pb-block">
          {/* accent terlalu gelap di atas tirai, jadi label ikut nada on-scrim. */}
          <p className="flex flex-wrap items-center gap-2 text-micro font-medium uppercase text-on-scrim-muted">
            <Link
              href={destinasiHref({ kategori: destination.category })}
              className="hover:text-on-scrim"
            >
              {categoryLabel(destination.category)}
            </Link>
            <span aria-hidden>&middot;</span>
            <Link
              href={destinasiHref({ wilayah: destination.region })}
              className="hover:text-on-scrim"
            >
              {regionLabel(destination.region)}
            </Link>
          </p>
          <h1 className="mt-3 max-w-prose font-display text-h1 text-on-scrim">
            {destination.name}
          </h1>
          <ImageCredit
            credit={hero?.imageCredit ?? null}
            tone="on-scrim"
            className="mt-4"
          />
        </div>
      </header>

      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="grid gap-block lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <div>
            <p className="max-w-prose text-body-lg text-muted">
              {destination.shortDescription}
            </p>

            <section className="mt-block">
              <h2 className="font-display text-h2">Deskripsi tempat</h2>
              <div className="mt-6 max-w-prose space-y-4">
                {destination.description.map((paragraph) => (
                  <p key={paragraph} className="text-body text-text/90">
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
                    className="rounded-pill bg-stone/15 px-3 py-1 text-micro tracking-normal text-stone"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6">
            {adaInfoPraktis && (
              <section className="rounded-card border border-line bg-surface p-6">
                <h2 className="font-display text-h4">Informasi praktis</h2>

                {info.openingHours && (
                  <div className="mt-5">
                    <h3 className="text-micro font-medium uppercase text-muted">
                      Jam buka
                    </h3>
                    <p className="mt-1 text-caption">{info.openingHours}</p>
                  </div>
                )}

                {rates.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-micro font-medium uppercase text-muted">
                      Harga tiket
                    </h3>
                    <dl className="mt-2 space-y-2">
                      {rates.map((rate) => (
                        <div
                          key={`${rate.visitor}-${rate.day}`}
                          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2 last:border-0 last:pb-0"
                        >
                          <dt className="text-caption text-muted">
                            {rateLabel(rate)}
                          </dt>
                          <dd className="text-caption font-medium">
                            {formatRate(rate)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {info.notes && (
                  <p className="mt-5 text-micro leading-relaxed tracking-normal text-muted">
                    {info.notes}
                  </p>
                )}
              </section>
            )}

            <p className="text-micro leading-relaxed tracking-normal text-muted">
              Info diperbarui {formatLastVerified(destination.lastVerified)}. Jam
              buka dan harga tiket dapat berubah sewaktu-waktu.
            </p>
          </aside>
        </div>

        <section className="mt-section">
          <h2 className="font-display text-h2">Lokasi</h2>
          <div
            className={
              lat !== null && lng !== null
                ? "mt-6 grid gap-block lg:grid-cols-[1.6fr_1fr] lg:gap-12"
                : "mt-6"
            }
          >
            {/* Peta dilewati sepenuhnya bila koordinatnya belum diketahui. */}
            {lat !== null && lng !== null && (
              <DestinationMap lat={lat} lng={lng} name={destination.name} />
            )}
            <div>
              <p className="max-w-prose text-caption leading-relaxed text-muted">
                {location.address}
              </p>
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-caption font-medium text-accent hover:underline"
              >
                Buka di Google Maps
                <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {foto.length > 0 && (
          <section className="mt-section">
            <h2 className="font-display text-h2">Galeri foto</h2>
            <div className="mt-6">
              <Gallery images={foto} name={destination.name} />
            </div>
          </section>
        )}

        {lainnya.length > 0 && (
          <section className="mt-section">
            <h2 className="font-display text-h2">{judulLainnya}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lainnya.map((item) => (
                <DestinationCard key={item.slug} destination={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
