import data from "@/src/data/destinations.json";

export type RateVisitor = "local" | "foreign";
export type RateDay = "all" | "weekday" | "weekend";

export type TicketRate = {
  visitor: RateVisitor;
  day: RateDay;
  min: number;
  max: number;
};

/** Atribusi satu foto. null hanya untuk foto warisan yang lisensinya tak diketahui. */
export type ImageCredit = {
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

export type DestinationImage = {
  src: string;
  imageCredit: ImageCredit | null;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  category: string;
  tags: string[];
  shortDescription: string;
  description: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  info: {
    openingHours: string | null;
    ticket: { currency: string; rates: TicketRate[] };
    notes: string | null;
  };
  images: { card: DestinationImage; gallery: DestinationImage[] };
  source: { listPage: string; detailPage: string } | null;
  needsVerification: string[];
  sources: string[];
  lastVerified: string;
};

export type Category = { id: string; label: string };
export type Region = { id: string; label: string };

export const destinations = data.destinations as Destination[];
export const categories = data.categories as Category[];
export const regions = data.regions as Region[];

export const PER_PAGE = 12;

/** Kategori yang benar-benar terisi, bukan seluruh daftar kategori. */
export const filledCategories: Category[] = categories.filter((c) =>
  destinations.some((d) => d.category === c.id)
);

/** Wilayah yang benar-benar terisi, bukan seluruh daftar wilayah. */
export const filledRegions: Region[] = regions.filter((r) =>
  destinations.some((d) => d.region === r.id)
);

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function regionLabel(id: string): string {
  return regions.find((r) => r.id === id)?.label ?? id;
}

export function countByCategory(id: string): number {
  return destinations.filter((d) => d.category === id).length;
}

export function countByRegion(id: string): number {
  return destinations.filter((d) => d.region === id).length;
}

/** "Rp50.000" untuk harga tetap, "Rp20.000 - Rp25.000" untuk kisaran. */
export function formatRate(rate: TicketRate): string {
  const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
  return rate.min === rate.max ? rp(rate.min) : `${rp(rate.min)} - ${rp(rate.max)}`;
}

const VISITOR_LABEL: Record<RateVisitor, string> = {
  local: "Wisatawan domestik",
  foreign: "Wisatawan mancanegara",
};

const DAY_LABEL: Record<RateDay, string> = {
  all: "",
  weekday: "Senin - Jumat",
  weekend: "Akhir pekan & libur nasional",
};

/** Label satu baris tarif; hari disembunyikan bila tarifnya berlaku setiap hari. */
export function rateLabel(rate: TicketRate): string {
  const day = DAY_LABEL[rate.day];
  return day ? `${VISITOR_LABEL[rate.visitor]}, ${day}` : VISITOR_LABEL[rate.visitor];
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

/** Cocokkan kueri ke nama, ringkasan, tag, kategori, dan lokasi. */
function matchesQuery(destination: Destination, query: string): boolean {
  const haystack = [
    destination.name,
    destination.shortDescription,
    destination.location.address,
    regionLabel(destination.region),
    categoryLabel(destination.category),
    ...destination.tags,
  ]
    .join(" ")
    .toLowerCase();

  return normalize(query)
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

export type FilterInput = {
  query?: string;
  category?: string;
  region?: string;
  page?: number;
};

export type FilterResult = {
  items: Destination[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export function filterDestinations({
  query = "",
  category = "",
  region = "",
  page = 1,
}: FilterInput): FilterResult {
  let items = destinations;

  if (region && regions.some((r) => r.id === region)) {
    items = items.filter((d) => d.region === region);
  }
  if (category && categories.some((c) => c.id === category)) {
    items = items.filter((d) => d.category === category);
  }
  if (query.trim()) {
    items = items.filter((d) => matchesQuery(d, query));
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * PER_PAGE;

  return {
    items: items.slice(start, start + PER_PAGE),
    page: current,
    totalPages,
    totalItems,
  };
}

/** Bangun querystring /destinasi tanpa parameter kosong. */
export function destinasiHref(params: {
  q?: string;
  wilayah?: string;
  kategori?: string;
  hal?: number;
}): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.wilayah) search.set("wilayah", params.wilayah);
  if (params.kategori) search.set("kategori", params.kategori);
  if (params.hal && params.hal > 1) search.set("hal", String(params.hal));
  const qs = search.toString();
  return qs ? `/destinasi?${qs}` : "/destinasi";
}

/**
 * Daftar nomor halaman dengan elipsis, supaya deretan chip tidak meledak
 * saat jumlah halaman bertambah. Selalu memuat halaman 1, terakhir, dan tetangga aktif.
 */
export function pageNumbers(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const keep = new Set([1, totalPages, page, page - 1, page + 1]);
  const out: (number | "…")[] = [];

  for (let n = 1; n <= totalPages; n += 1) {
    if (keep.has(n)) {
      out.push(n);
    } else if (out[out.length - 1] !== "…") {
      out.push("…");
    }
  }

  return out;
}

const BULAN = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-18" -> "September 2026". Mengembalikan apa adanya bila tanggal tak terbaca. */
export function formatLastVerified(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : BULAN.format(date);
}

/** Ambil satu nilai dari searchParams yang bisa berupa string atau array. */
export function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
