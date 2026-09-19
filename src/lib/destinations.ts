import data from "@/src/data/destinations.json";
import {
  categoryShortLabelFor,
  regionShortLabelFor,
} from "@/src/lib/taxonomy";

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
  /** false berarti datanya belum siap tayang; lihat catatan pada `destinations`. */
  published: boolean;
  /** true untuk yang tampil di bagian pilihan beranda. Selalu published. */
  featured: boolean;
  tags: string[];
  shortDescription: string;
  description: string[];
  location: {
    address: string;
    /** null berpasangan dengan lng: koordinatnya belum diketahui, peta disembunyikan. */
    lat: number | null;
    lng: number | null;
    mapsUrl: string;
  };
  info: {
    openingHours: string | null;
    ticket: { currency: string; rates: TicketRate[] };
    notes: string | null;
  };
  /**
   * card null berarti belum ada foto berlisensi yang layak untuk tempat ini.
   * Kartu dan hero memakai panel polos, bukan foto seadanya.
   */
  images: { card: DestinationImage | null; gallery: DestinationImage[] };
  source: { listPage: string; detailPage: string } | null;
  needsVerification: string[];
  sources: string[];
  lastVerified: string;
};

export type Category = { id: string; label: string };
export type Region = { id: string; label: string };

/**
 * Seluruh isi berkas data, termasuk yang belum siap tayang. Hanya dipakai alat
 * bantu dan pengujian; halaman situs memakai `destinations`.
 */
export const allDestinations = data.destinations as Destination[];

/**
 * Destinasi yang tampil di situs. Yang published-nya false disaring di sini,
 * satu tempat saja, sehingga daftar, filter, pencarian, saran destinasi lain,
 * angka di beranda, dan rute statis ikut terpengaruh tanpa perlu menyaring ulang.
 */
export const destinations = allDestinations.filter((d) => d.published);
export const categories = data.categories as Category[];
export const regions = data.regions as Region[];

/**
 * Destinasi pilihan untuk beranda, mengikuti urutan di berkas data. Disaring
 * dari destinations yang sudah published, jadi satu destinasi tidak akan pernah
 * muncul di beranda sementara halaman detailnya tidak ada.
 */
export const featuredDestinations: Destination[] = destinations.filter(
  (d) => d.featured
);

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

/**
 * Label pendek untuk pil filter dan navigasi beranda. Daftarnya tinggal di
 * src/lib/taxonomy.ts supaya komponen klien bisa ikut memakainya tanpa menarik
 * destinations.json; di sini hanya dibungkus agar label panjang dari data
 * tetap jadi cadangan bila ada id baru yang belum terdaftar.
 */
export function regionShortLabel(id: string): string {
  return regionShortLabelFor(id, regionLabel(id));
}

export function categoryShortLabel(id: string): string {
  return categoryShortLabelFor(id, categoryLabel(id));
}

export function countByCategory(id: string): number {
  return destinations.filter((d) => d.category === id).length;
}

export function countByRegion(id: string): number {
  return destinations.filter((d) => d.region === id).length;
}

export type RelatedResult = {
  items: Destination[];
  /** true bila seluruh slot terisi dari wilayah yang sama; dipakai untuk judul. */
  sameRegion: boolean;
};

/**
 * Saran destinasi berikutnya, berlapis: sewilayah dulu, lalu ditambal sekategori
 * dari wilayah lain, lalu sisanya. Dua wilayah hanya berisi dua destinasi, jadi
 * tanpa lapisan tambal barisnya akan bolong di sebagian halaman.
 */
export function getRelated(destination: Destination, limit = 3): RelatedResult {
  const lain = destinations.filter((d) => d.slug !== destination.slug);

  const items = lain.filter((d) => d.region === destination.region).slice(0, limit);
  const sameRegion = items.length >= limit;

  for (const kandidat of [
    lain.filter((d) => d.category === destination.category),
    lain,
  ]) {
    if (items.length >= limit) break;
    for (const d of kandidat) {
      if (items.length >= limit) break;
      if (!items.some((sudah) => sudah.slug === d.slug)) items.push(d);
    }
  }

  return { items, sameRegion };
}

/**
 * Tautan peta untuk satu destinasi. Koordinat didahulukan karena formatnya
 * resmi dan menunjuk titik yang persis; mapsUrl dipakai sebagai cadangan untuk
 * destinasi yang koordinatnya belum diketahui.
 */
export function mapsHref(location: Destination["location"]): string {
  const { lat, lng } = location;
  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return location.mapsUrl;
}

/** "Rp50.000" untuk harga tetap, "Rp20.000 - Rp25.000" untuk kisaran. */
export function formatRate(rate: TicketRate): string {
  const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
  return rate.min === rate.max ? rp(rate.min) : `${rp(rate.min)} - ${rp(rate.max)}`;
}

const VISITOR_LABEL: Record<RateVisitor, string> = {
  local: "Domestik",
  foreign: "Mancanegara",
};

// "hari kerja" dan bukan "Senin - Jumat": pembagian hari kerja dan akhir pekan
// tidak selalu jatuh di batas yang sama. Vredeburg, misalnya, memakai tarif
// akhir pekan mulai Jumat. Hari persisnya ditulis di info.notes tiap destinasi.
const DAY_LABEL: Record<RateDay, string> = {
  all: "",
  weekday: "hari kerja",
  weekend: "akhir pekan",
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

/** Hasil saringan tanpa halaman. Dipakai filterDestinations dan countDestinations. */
function selectDestinations({
  query = "",
  category = "",
  region = "",
}: Omit<FilterInput, "page">): Destination[] {
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

  return items;
}

/** Jumlah destinasi yang cocok, untuk angka di samping label pil filter. */
export function countDestinations(input: Omit<FilterInput, "page">): number {
  return selectDestinations(input).length;
}

export function filterDestinations({ page = 1, ...rest }: FilterInput): FilterResult {
  const items = selectDestinations(rest);

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
