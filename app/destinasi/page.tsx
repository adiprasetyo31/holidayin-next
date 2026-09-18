import type { Metadata } from "next";
import Link from "next/link";

import { DestinationCard } from "@/src/components/destination-card";
import {
  categories,
  destinasiHref,
  filterDestinations,
  firstParam,
} from "@/src/lib/destinations";

export const metadata: Metadata = {
  title: "Destinasi",
  description:
    "Daftar destinasi wisata Yogyakarta dengan penyaring kategori dan pencarian.",
};

export default async function DestinasiPage({
  searchParams,
}: PageProps<"/destinasi">) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const kategori = firstParam(params.kategori);
  const halaman = Number.parseInt(firstParam(params.hal), 10) || 1;

  const { items, page, totalPages, totalItems } = filterDestinations({
    query,
    category: kategori,
    page: halaman,
  });

  const adaFilter = Boolean(query || kategori);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">Destinasi</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Saring berdasarkan kategori atau cari nama tempat, kabupaten, dan kata
          kunci seperti &ldquo;sunset&rdquo; atau &ldquo;pantai&rdquo;.
        </p>
      </header>

      {/* Form GET biasa: pencarian tetap jalan tanpa JavaScript. */}
      <form action="/destinasi" className="mt-8 flex flex-wrap gap-3">
        {kategori && <input type="hidden" name="kategori" value={kategori} />}
        <label htmlFor="q" className="sr-only">
          Cari destinasi
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Cari destinasi, kabupaten, atau kata kunci"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3 text-sm text-text placeholder:text-muted"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Cari
        </button>
      </form>

      <nav aria-label="Saring kategori" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={destinasiHref({ q: query })}
              aria-current={!kategori ? "true" : undefined}
              className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors ${
                !kategori
                  ? "border-accent bg-accent text-background"
                  : "border-line bg-surface text-muted hover:text-text"
              }`}
            >
              Semua
            </Link>
          </li>
          {categories.map((category) => {
            const aktif = kategori === category.id;
            return (
              <li key={category.id}>
                <Link
                  href={destinasiHref({ q: query, kategori: category.id })}
                  aria-current={aktif ? "true" : undefined}
                  className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors ${
                    aktif
                      ? "border-accent bg-accent text-background"
                      : "border-line bg-surface text-muted hover:text-text"
                  }`}
                >
                  {category.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
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
        <p className="mt-6 rounded-2xl border border-line bg-surface p-8 text-sm leading-relaxed text-muted">
          Coba kata kunci lain, atau pilih kategori yang berbeda.
        </p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            <li>
              {page > 1 ? (
                <Link
                  href={destinasiHref({ q: query, kategori, hal: page - 1 })}
                  rel="prev"
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm hover:border-accent hover:text-accent"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-full border border-line px-4 py-2 text-sm text-muted opacity-50">
                  Sebelumnya
                </span>
              )}
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <Link
                  href={destinasiHref({ q: query, kategori, hal: n })}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Halaman ${n}`}
                  className={`inline-block min-w-10 rounded-full border px-4 py-2 text-center text-sm transition-colors ${
                    n === page
                      ? "border-accent bg-accent font-medium text-background"
                      : "border-line bg-surface text-muted hover:text-text"
                  }`}
                >
                  {n}
                </Link>
              </li>
            ))}

            <li>
              {page < totalPages ? (
                <Link
                  href={destinasiHref({ q: query, kategori, hal: page + 1 })}
                  rel="next"
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm hover:border-accent hover:text-accent"
                >
                  Berikutnya
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-full border border-line px-4 py-2 text-sm text-muted opacity-50">
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
