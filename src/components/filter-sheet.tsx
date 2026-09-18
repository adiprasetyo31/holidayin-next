"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { buttonClass } from "@/src/components/ui/button";

export type SheetOption = { id: string; label: string };

const FOKUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Jalur href dibangun di sini, bukan lewat destinasiHref dari pustaka data.
 * Modul itu mengimpor destinations.json di puncaknya, jadi memakainya dari
 * komponen klien akan ikut mengirim seluruh data destinasi ke peramban.
 */
function href(q: string, wilayah: string, kategori: string): string {
  const cari = new URLSearchParams();
  if (q.trim()) cari.set("q", q.trim());
  if (wilayah) cari.set("wilayah", wilayah);
  if (kategori) cari.set("kategori", kategori);
  const qs = cari.toString();
  return qs ? `/destinasi?${qs}` : "/destinasi";
}

// shrink-0 dan whitespace-nowrap menjaga pil tetap seukuran isinya: tanpa itu
// pil memipih saat barisnya penuh dan angka di ujungnya ikut terpotong.
const PILL =
  "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap " +
  "rounded-pill border px-4 text-caption transition-colors";
const PILL_ON = "border-accent bg-accent text-on-accent";
const PILL_OFF =
  "border-line bg-transparent text-text hover:border-accent hover:text-accent";
const PILL_EMPTY = "border-line bg-transparent text-muted opacity-60";

function Grup({
  judul,
  options,
  dipilih,
  onPilih,
  hitung,
}: {
  judul: string;
  options: SheetOption[];
  dipilih: string;
  onPilih: (id: string) => void;
  hitung: (id: string) => number;
}) {
  return (
    <section>
      <h3 className="text-caption font-medium text-text">{judul}</h3>
      {/* flex-wrap, bukan baris yang digeser: semua pilihan terlihat sekaligus. */}
      <ul className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const aktif = o.id === dipilih;
          const jumlah = hitung(o.id);
          // Pilihan tanpa hasil jadi jalan buntu. "Semua" tidak pernah dimatikan
          // supaya filter selalu bisa dibatalkan dari dalam lembar.
          const kosong = !aktif && jumlah === 0 && o.id !== "";
          return (
            <li key={o.id || "semua"}>
              <button
                type="button"
                disabled={kosong}
                aria-pressed={aktif}
                onClick={() => onPilih(o.id)}
                className={`${PILL} ${
                  aktif ? PILL_ON : kosong ? PILL_EMPTY : PILL_OFF
                }`}
              >
                {o.label}
                <span className={aktif ? "text-on-accent/70" : "text-muted"}>
                  {jumlah}
                  <span className="sr-only"> destinasi</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Tombol "Filter" beserta lembar bawah yang dibukanya. Hanya dipakai di bawah
 * md; mulai md filter tampil sebagai deretan pil di halaman.
 *
 * Pilihan di dalam lembar bersifat sementara sampai ditekan "Tampilkan", jadi
 * jumlah hasil bisa berubah hidup mengikuti pilihan tanpa memuat ulang halaman.
 * Semua kombinasi jumlahnya sudah dihitung di server dan dikirim lewat counts.
 */
export function FilterSheet({
  query,
  regions,
  categories,
  activeRegion,
  activeCategory,
  counts,
}: {
  query: string;
  regions: SheetOption[];
  categories: SheetOption[];
  activeRegion: string;
  activeCategory: string;
  /** Kunci "wilayah|kategori", nilainya jumlah hasil. */
  counts: Record<string, number>;
}) {
  const [buka, setBuka] = useState(false);
  const [tampil, setTampil] = useState(false);
  const [wilayah, setWilayah] = useState(activeRegion);
  const [kategori, setKategori] = useState(activeCategory);
  const panel = useRef<HTMLDivElement>(null);
  const pemicu = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const jumlahAktif = (activeRegion ? 1 : 0) + (activeCategory ? 1 : 0);
  const hasil = counts[`${wilayah}|${kategori}`] ?? 0;

  const tutup = useCallback(() => {
    setTampil(false);
    // Panel dilepas setelah animasi turun selesai, bukan seketika.
    window.setTimeout(() => {
      setBuka(false);
      pemicu.current?.focus();
    }, 200);
  }, []);

  // Saat dibuka, pilihan sementara disamakan dulu dengan filter yang berlaku.
  function bukaLembar() {
    setWilayah(activeRegion);
    setKategori(activeCategory);
    setBuka(true);
  }

  useEffect(() => {
    if (!buka) return;

    // Animasi naik dijalankan pada bingkai berikutnya supaya transisinya sempat
    // berjalan dari posisi awal, bukan langsung melompat ke posisi akhir.
    const bingkai = requestAnimationFrame(() => setTampil(true));

    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panel.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        tutup();
        return;
      }
      if (e.key !== "Tab") return;

      const fokusable = panel.current?.querySelectorAll<HTMLElement>(FOKUSABLE);
      if (!fokusable || fokusable.length === 0) return;
      const pertama = fokusable[0];
      const terakhir = fokusable[fokusable.length - 1];
      const aktif = document.activeElement;

      // Jerat fokus: Tab berputar di dalam panel, tidak lolos ke halaman.
      if (e.shiftKey && (aktif === pertama || aktif === panel.current)) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && aktif === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(bingkai);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = sebelumnya;
    };
  }, [buka, tutup]);

  function terapkan() {
    router.push(href(query, wilayah, kategori));
    tutup();
  }

  return (
    <>
      <button
        ref={pemicu}
        type="button"
        onClick={bukaLembar}
        aria-haspopup="dialog"
        aria-expanded={buka}
        className={buttonClass({
          variant: "secondary",
          className: "shrink-0 px-5",
        })}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
        Filter
        {jumlahAktif > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-accent px-1.5 text-micro tracking-normal text-on-accent">
            {jumlahAktif}
            <span className="sr-only"> filter aktif</span>
          </span>
        )}
      </button>

      {buka &&
        createPortal(
          <div className="fixed inset-0 z-[60]">
            <div
              // Latar gelap; menyentuhnya menutup lembar.
              onClick={tutup}
              className={`absolute inset-0 bg-scrim/60 transition-opacity duration-200 motion-reduce:transition-none ${
                tampil ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-lembar-filter"
              tabIndex={-1}
              className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-card border-t border-line bg-background transition-transform duration-200 ease-out motion-reduce:transition-none ${
                tampil ? "translate-y-0" : "translate-y-full"
              }`}
            >
              {/* Batang pegangan: penanda visual bahwa panel ini muncul dari bawah. */}
              <div aria-hidden className="flex justify-center pt-3 pb-1">
                <span className="h-1 w-10 rounded-pill bg-line-strong" />
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-line px-gutter pb-4 pt-2">
                <h2 id="judul-lembar-filter" className="font-display text-h4">
                  Filter
                </h2>
                <button
                  type="button"
                  onClick={tutup}
                  aria-label="Tutup"
                  className="grid h-9 w-9 place-items-center rounded-pill text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-gutter py-5">
                <Grup
                  judul="Wilayah"
                  options={regions}
                  dipilih={wilayah}
                  onPilih={setWilayah}
                  hitung={(id) => counts[`${id}|${kategori}`] ?? 0}
                />
                <Grup
                  judul="Kategori"
                  options={categories}
                  dipilih={kategori}
                  onPilih={setKategori}
                  hitung={(id) => counts[`${wilayah}|${id}`] ?? 0}
                />
              </div>

              {/* Kaki menempel: pilihan panjang tetap bisa digulir di atasnya. */}
              <div className="sticky bottom-0 flex gap-3 border-t border-line bg-background px-gutter py-4">
                <button
                  type="button"
                  onClick={() => {
                    setWilayah("");
                    setKategori("");
                  }}
                  className={buttonClass({
                    variant: "secondary",
                    className: "flex-1",
                  })}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={terapkan}
                  className={buttonClass({ className: "flex-[2]" })}
                >
                  Tampilkan {hasil} destinasi
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
