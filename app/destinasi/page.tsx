import type { Metadata } from "next";
import Link from "next/link";

import { DestinationCard } from "@/src/components/destination-card";
import { FilterPills, type FilterOption } from "@/src/components/filter-pills";
import { buttonClass } from "@/src/components/ui/button";
import {
  categories,
  categoryShortLabel,
  countDestinations,
  destinasiHref,
  filterDestinations,
  firstParam,
  pageNumbers,
  regionShortLabel,
  regions,
} from "@/src/lib/destinations";

export const metadata: Metadata = {
  title: "Destinasi",
  description:
    "Daftar destinasi wisata Yogyakarta dengan penyaring wilayah, kategori, dan pencarian.",
};

const CHIP_BASE =
  "inline-flex h-10 items-center justify-center rounded-pill border px-4 text-caption transition-colors";
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

  // Angka pada tiap pil adalah hasil bila pil itu dipilih: kueri dan filter
  // grup lain tetap berlaku, filter grup sendiri diganti.
  const opsiWilayah: FilterOption[] = [
    {
      id: "",
      label: "Semua",
      count: countDestinations({ query, category: kategori }),
      href: destinasiHref({ q: query, kategori }),
    },
    ...regions.map((region) => ({
      id: region.id,
      label: regionShortLabel(region.id),
      count: countDestinations({ query, category: kategori, region: region.id }),
      href: destinasiHref({ q: query, wilayah: region.id, kategori }),
    })),
  ];

  const opsiKategori: FilterOption[] = [
    {
      id: "",
      label: "Semua",
      count: countDestinations({ query, region: wilayah }),
      href: destinasiHref({ q: query, wilayah }),
    },
    ...categories.map((category) => ({
      id: category.id,
      label: categoryShortLabel(category.id),
      count: countDestinations({ query, region: wilayah, category: category.id }),
      href: destinasiHref({ q: query, wilayah, kategori: category.id }),
    })),
  ];

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

      <div className="mt-8 space-y-6">
        <FilterPills
          legend="Wilayah"
          legendId="filter-wilayah"
          activeId={wilayah}
          options={opsiWilayah}
        />
        <FilterPills
          legend="Kategori"
          legendId="filter-kategori"
          activeId={kategori}
          options={opsiKategori}
        />
      </div>

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
                  className="inline-flex h-10 items-center rounded-pill border border-line bg-surface px-4 text-caption hover:border-accent hover:text-accent"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span className="inline-flex h-10 cursor-not-allowed items-center rounded-pill border border-line px-4 text-caption text-muted opacity-50">
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
                  className="inline-flex h-10 items-center rounded-pill border border-line bg-surface px-4 text-caption hover:border-accent hover:text-accent"
                >
                  Berikutnya
                </Link>
              ) : (
                <span className="inline-flex h-10 cursor-not-allowed items-center rounded-pill border border-line px-4 text-caption text-muted opacity-50">
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
