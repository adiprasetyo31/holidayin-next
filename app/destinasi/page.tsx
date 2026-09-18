import type { Metadata } from "next";
import Link from "next/link";

import { DestinationCard } from "@/src/components/destination-card";
import { buttonClass } from "@/src/components/ui/button";
import {
  categories,
  destinasiHref,
  filterDestinations,
  firstParam,
  pageNumbers,
  regions,
} from "@/src/lib/destinations";

export const metadata: Metadata = {
  title: "Destinasi",
  description:
    "Daftar destinasi wisata Yogyakarta dengan penyaring wilayah, kategori, dan pencarian.",
};

const CHIP_BASE =
  "inline-block rounded-pill border px-4 py-2 text-caption transition-colors";
const CHIP_ON = "border-accent bg-accent text-on-accent";
const CHIP_OFF = "border-line bg-surface text-muted hover:text-text";

function chipClass(aktif: boolean): string {
  return `${CHIP_BASE} ${aktif ? CHIP_ON : CHIP_OFF}`;
}

export default async function DestinasiPage({
  searchParams,
}: PageProps<"/destinasi">) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const wilayah = firstParam(params.wilayah);
  const kategori = firstParam(params.kategori);
  const halaman = Number.parseInt(firstParam(params.hal), 10) || 1;

  const { items, page, totalPages, totalItems } = filterDestinations({
    query,
    region: wilayah,
    category: kategori,
    page: halaman,
  });

  const adaFilter = Boolean(query || wilayah || kategori);

  return (
    <div className="mx-auto max-w-page px-gutter py-section">
      <header>
        <h1 className="font-display text-h1">Destinasi</h1>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">
          Saring berdasarkan wilayah atau kategori, atau cari nama tempat dan
          kata kunci seperti &ldquo;sunset&rdquo; atau &ldquo;pantai&rdquo;.
        </p>
      </header>

      {/* Form GET biasa: pencarian tetap jalan tanpa JavaScript. */}
      <form action="/destinasi" className="mt-8 flex flex-wrap gap-3">
        {wilayah && <input type="hidden" name="wilayah" value={wilayah} />}
        {kategori && <input type="hidden" name="kategori" value={kategori} />}
        <label htmlFor="q" className="sr-only">
          Cari destinasi
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Cari destinasi, wilayah, atau kata kunci"
          className="min-w-0 flex-1 rounded-pill border border-line bg-surface px-5 py-3 text-caption text-text placeholder:text-muted"
        />
        <button type="submit" className={buttonClass({ variant: "primary" })}>
          Cari
        </button>
      </form>

      <nav aria-label="Saring wilayah" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={destinasiHref({ q: query, kategori })}
              aria-current={!wilayah ? "true" : undefined}
              className={chipClass(!wilayah)}
            >
              Semua wilayah
            </Link>
          </li>
          {regions.map((region) => {
            const aktif = wilayah === region.id;
            return (
              <li key={region.id}>
                <Link
                  href={destinasiHref({
                    q: query,
                    wilayah: region.id,
                    kategori,
                  })}
                  aria-current={aktif ? "true" : undefined}
                  className={chipClass(aktif)}
                >
                  {region.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Saring kategori" className="mt-3">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={destinasiHref({ q: query, wilayah })}
              aria-current={!kategori ? "true" : undefined}
              className={chipClass(!kategori)}
            >
              Semua kategori
            </Link>
          </li>
          {categories.map((category) => {
            const aktif = kategori === category.id;
            return (
              <li key={category.id}>
                <Link
                  href={destinasiHref({
                    q: query,
                    wilayah,
                    kategori: category.id,
                  })}
                  aria-current={aktif ? "true" : undefined}
                  className={chipClass(aktif)}
                >
                  {category.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="mt-8 text-caption text-muted" aria-live="polite">
        {totalItems > 0
          ? `Menampilkan ${items.length} dari ${totalItems} destinasi`
          : "Tidak ada destinasi yang cocok"}
        {adaFilter && (
          <>
            {" · "}
            <Link href="/destinasi" className="text-accent hover:underline">
              Atur ulang filter
            </Link>
          </>
        )}
      </p>

      {items.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((destination, index) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-card border border-line bg-surface p-8 text-caption leading-relaxed text-muted">
          Coba kata kunci lain, atau pilih wilayah dan kategori yang berbeda.
        </p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            <li>
              {page > 1 ? (
                <Link
                  href={destinasiHref({
                    q: query,
                    wilayah,
                    kategori,
                    hal: page - 1,
                  })}
                  rel="prev"
                  className="rounded-pill border border-line bg-surface px-4 py-2 text-caption hover:border-accent hover:text-accent"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-pill border border-line px-4 py-2 text-caption text-muted opacity-50">
                  Sebelumnya
                </span>
              )}
            </li>

            {pageNumbers(page, totalPages).map((n, index) =>
              n === "…" ? (
                <li key={`gap-${index}`} aria-hidden>
                  <span className="px-2 text-caption text-muted">&hellip;</span>
                </li>
              ) : (
                <li key={n}>
                  <Link
                    href={destinasiHref({ q: query, wilayah, kategori, hal: n })}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Halaman ${n}`}
                    className={`min-w-10 text-center ${chipClass(n === page)} ${
                      n === page ? "font-medium" : ""
                    }`}
                  >
                    {n}
                  </Link>
                </li>
              )
            )}

            <li>
              {page < totalPages ? (
                <Link
                  href={destinasiHref({
                    q: query,
                    wilayah,
                    kategori,
                    hal: page + 1,
                  })}
                  rel="next"
                  className="rounded-pill border border-line bg-surface px-4 py-2 text-caption hover:border-accent hover:text-accent"
                >
                  Berikutnya
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-pill border border-line px-4 py-2 text-caption text-muted opacity-50">
                  Berikutnya
                </span>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
