// Pemeriksa bentuk src/data/destinations.json.
// Data ditulis tangan dan hanya di-cast di src/lib/destinations.ts, jadi
// TypeScript tidak menangkap data yang melenceng. Skrip ini yang menangkapnya.
//
// Jalankan: npm run check:data
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/destinations.json");
const IMAGE_DIR = path.join(ROOT, "public/images/destinasi");

const errors = [];
const warnings = [];

const fail = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);

const data = JSON.parse(readFileSync(DATA, "utf8"));

// --- daftar acuan -----------------------------------------------------------

for (const key of ["regions", "categories", "destinations"]) {
  if (!Array.isArray(data[key])) fail("_root", `${key} bukan array`);
}

const regionIds = new Set(data.regions.map((r) => r.id));
const categoryIds = new Set(data.categories.map((c) => c.id));

for (const [name, list] of [
  ["regions", data.regions],
  ["categories", data.categories],
]) {
  for (const item of list) {
    if (!item.id || !item.label) fail(name, `entri tanpa id/label: ${JSON.stringify(item)}`);
  }
}

// --- destinasi --------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VISITORS = new Set(["local", "foreign"]);
const DAYS = new Set(["all", "weekday", "weekend"]);

// Field yang boleh disebut di needsVerification.
const VERIFIABLE = new Set([
  "info.openingHours",
  "info.ticket",
  "info.notes",
  "location.address",
  "location.lat",
  "location.lng",
  "location.mapsUrl",
]);

const seenSlugs = new Set();
const referenced = new Set();

for (const d of data.destinations) {
  const at = d.slug ?? "(tanpa slug)";

  if (!d.slug) fail(at, "slug kosong");
  if (seenSlugs.has(d.slug)) fail(at, "slug ganda");
  seenSlugs.add(d.slug);

  if (!d.name) fail(at, "name kosong");
  if (!regionIds.has(d.region)) fail(at, `region tidak dikenal: ${d.region}`);
  if (!categoryIds.has(d.category)) fail(at, `category tidak dikenal: ${d.category}`);

  if (!Array.isArray(d.tags) || d.tags.length === 0) fail(at, "tags kosong");
  if (!d.shortDescription) fail(at, "shortDescription kosong");
  if (!Array.isArray(d.description) || d.description.length === 0) {
    fail(at, "description kosong");
  }

  // Lokasi
  const loc = d.location ?? {};
  if ("regency" in loc) fail(at, "location.regency sudah digantikan oleh region");
  if (!loc.address) fail(at, "location.address kosong");
  // Keduanya boleh null bersamaan: koordinat belum diketahui, peta disembunyikan.
  // Satu terisi satu null selalu galat, itu tanda data separuh jadi.
  if (loc.lat === null && loc.lng === null) {
    warn(at, "location.lat/lng masih null, peta tidak ditampilkan");
  } else if (typeof loc.lat !== "number" || typeof loc.lng !== "number") {
    fail(at, "location.lat/lng bukan angka (pakai null di keduanya bila tak ada)");
  } else {
    // Kotak kasar DIY, cukup untuk menangkap koordinat tertukar atau salah tanda.
    if (loc.lat < -8.3 || loc.lat > -7.4) fail(at, `lat di luar DIY: ${loc.lat}`);
    if (loc.lng < 110.0 || loc.lng > 110.9) fail(at, `lng di luar DIY: ${loc.lng}`);
  }
  if (!loc.mapsUrl) fail(at, "location.mapsUrl kosong");

  // Informasi praktis
  const info = d.info ?? {};
  if (!("openingHours" in info)) fail(at, "info.openingHours hilang (pakai null bila tak ada)");
  if (!info.ticket || !Array.isArray(info.ticket.rates)) {
    fail(at, "info.ticket.rates bukan array");
  } else {
    if (info.ticket.currency !== "IDR") fail(at, `mata uang bukan IDR: ${info.ticket.currency}`);
    const combos = new Set();
    for (const r of info.ticket.rates) {
      if (!VISITORS.has(r.visitor)) fail(at, `visitor tidak dikenal: ${r.visitor}`);
      if (!DAYS.has(r.day)) fail(at, `day tidak dikenal: ${r.day}`);
      if (typeof r.min !== "number" || typeof r.max !== "number") {
        fail(at, "tarif min/max bukan angka");
      } else if (r.min > r.max) {
        fail(at, `tarif min > max (${r.min} > ${r.max})`);
      }
      const combo = `${r.visitor}-${r.day}`;
      if (combos.has(combo)) fail(at, `baris tarif ganda: ${combo}`);
      combos.add(combo);
    }
  }
  if (!("notes" in info)) fail(at, "info.notes hilang (pakai null bila tak ada)");

  // Gambar
  const images = d.images ?? {};
  const semua = [images.card, ...(images.gallery ?? [])].filter(Boolean);
  // card boleh null: belum ada foto berlisensi yang layak, UI memakai panel polos.
  // Yang tidak boleh adalah card kosong sementara galerinya terisi, itu tanda
  // foto terbaiknya lupa diangkat jadi foto kartu.
  if (!("card" in images)) fail(at, "images.card hilang (pakai null bila tak ada foto)");
  if (images.card === null) {
    if ((images.gallery ?? []).length > 0) {
      fail(at, "images.card null tetapi galeri terisi; angkat satu foto jadi card");
    } else {
      warn(at, "belum ada foto berlisensi, kartu dan hero memakai panel polos");
    }
  } else if (!images.card?.src) {
    fail(at, "images.card ada tetapi tanpa src");
  }
  if (!Array.isArray(images.gallery)) fail(at, "images.gallery bukan array");

  for (const image of semua) {
    if (typeof image.src !== "string" || !image.src.startsWith("/images/")) {
      fail(at, `src gambar tidak valid: ${image.src}`);
      continue;
    }
    referenced.add(path.basename(image.src));
    if (!existsSync(path.join(ROOT, "public", image.src))) {
      fail(at, `berkas gambar tidak ada: ${image.src}`);
    }

    const c = image.imageCredit;
    if (c === null) {
      warn(at, `${path.basename(image.src)} belum punya imageCredit`);
    } else if (!c || !c.author || !c.sourceUrl || !c.license || !c.licenseUrl) {
      fail(at, `imageCredit tidak lengkap pada ${image.src}`);
    } else if (
      !/^https:\/\/(commons\.wikimedia\.org|upload\.wikimedia\.org|unsplash\.com)\//.test(
        c.sourceUrl
      )
    ) {
      fail(at, `sumber foto di luar Wikimedia/Unsplash: ${c.sourceUrl}`);
    }
  }

  // Penelusuran sumber
  if (!Array.isArray(d.sources) || d.sources.length === 0) fail(at, "sources kosong");
  if (!ISO_DATE.test(d.lastVerified ?? "")) fail(at, `lastVerified bukan YYYY-MM-DD: ${d.lastVerified}`);
  if (!Array.isArray(d.needsVerification)) {
    fail(at, "needsVerification bukan array");
  } else {
    for (const field of d.needsVerification) {
      if (!VERIFIABLE.has(field)) fail(at, `needsVerification menyebut field asing: ${field}`);
    }
  }
}

// --- berkas gambar yatim ----------------------------------------------------

if (existsSync(IMAGE_DIR)) {
  for (const file of readdirSync(IMAGE_DIR)) {
    if (!referenced.has(file)) warn("public/images/destinasi", `berkas tak terpakai: ${file}`);
  }
}

// --- laporan ----------------------------------------------------------------

for (const w of warnings) console.warn(`  peringatan  ${w}`);
for (const e of errors) console.error(`  galat       ${e}`);

const ringkas = `${data.destinations.length} destinasi, ${data.regions.length} wilayah, ${data.categories.length} kategori`;

if (errors.length > 0) {
  console.error(`\nGAGAL: ${errors.length} galat, ${warnings.length} peringatan (${ringkas}).`);
  process.exit(1);
}

console.log(`\nOK: ${ringkas}. ${warnings.length} peringatan.`);
