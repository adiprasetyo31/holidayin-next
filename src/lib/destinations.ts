import data from "@/src/data/destinations.json";

export type RateVisitor = "local" | "foreign";
export type RateDay = "all" | "weekday" | "weekend";

export type TicketRate = {
  visitor: RateVisitor;
  day: RateDay;
  min: number;
  max: number;
};

export type Destination = {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  shortDescription: string;
  description: string[];
  location: {
    address: string;
    regency: string;
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  info: {
    openingHours: string | null;
    ticket: { currency: string; rates: TicketRate[] };
    notes: string | null;
  };
  images: { card: string; gallery: string[] };
  source: { listPage: string; detailPage: string };
  needsVerification: string[];
  sources: string[];
  lastVerified: string;
};

export type Category = { id: string; label: string };

export const destinations = data.destinations as Destination[];
export const categories = data.categories as Category[];

export const PER_PAGE = 6;

/** Wilayah (kabupaten/kota) yang punya minimal satu destinasi. */
export const regencies: string[] = [
  ...new Set(destinations.map((d) => d.location.regency)),
].sort();

/** Kategori yang benar-benar terisi, bukan seluruh daftar kategori. */
export const filledCategories: Category[] = categories.filter((c) =>
  destinations.some((d) => d.category === c.id)
);

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function countByCategory(id: string): number {
  return destinations.filter((d) => d.category === id).length;
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
    destination.location.regency,
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
  page = 1,
}: FilterInput): FilterResult {
  let items = destinations;

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
  kategori?: string;
  hal?: number;
}): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.kategori) search.set("kategori", params.kategori);
  if (params.hal && params.hal > 1) search.set("hal", String(params.hal));
  const qs = search.toString();
  return qs ? `/destinasi?${qs}` : "/destinasi";
}

/** Ambil satu nilai dari searchParams yang bisa berupa string atau array. */
export function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
