"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Jeda sebelum ketikan diteruskan ke URL, supaya tiap huruf tidak memuat ulang. */
const JEDA_MS = 300;

/**
 * Kotak pencarian: ikon di dalam, tombol hapus saat ada teks, dan hasil yang
 * menyaring sendiri sambil mengetik.
 *
 * Tetap dibungkus form GET oleh pemanggilnya, jadi tanpa JavaScript menekan
 * Enter masih mengirim kuerinya seperti biasa. Karena itu pula tombol "Cari"
 * tidak diperlukan lagi.
 */
export function SearchField({ defaultValue }: { defaultValue: string }) {
  const [nilai, setNilai] = useState(defaultValue);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Kueri di URL bisa berubah dari luar, misalnya lewat tombol kembali atau
  // chip filter aktif. Kotaknya ikut menyesuaikan saat render, bukan lewat
  // efek, supaya tidak memicu render berantai.
  const [terakhirDariUrl, setTerakhirDariUrl] = useState(defaultValue);
  if (defaultValue !== terakhirDariUrl) {
    setTerakhirDariUrl(defaultValue);
    setNilai(defaultValue);
  }

  function jalurUntuk(q: string): string {
    const berikutnya = new URLSearchParams(searchParams);
    if (q.trim()) berikutnya.set("q", q.trim());
    else berikutnya.delete("q");
    // Kueri baru berarti daftar hasil baru, jadi kembali ke halaman pertama.
    berikutnya.delete("hal");
    const qs = berikutnya.toString();
    return qs ? `/destinasi?${qs}` : "/destinasi";
  }

  function ketik(q: string) {
    setNilai(q);
  }

  // Penelusuran hidup: URL diganti setelah ketikan berhenti sejenak. replace,
  // bukan push, supaya riwayat peramban tidak penuh satu entri per huruf.
  useEffect(() => {
    if (nilai === (searchParams.get("q") ?? "")) return;
    const waktu = window.setTimeout(() => {
      router.replace(jalurUntuk(nilai), { scroll: false });
    }, JEDA_MS);
    return () => window.clearTimeout(waktu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nilai]);

  function bersihkan() {
    setNilai("");
    input.current?.focus();
    if (searchParams.get("q")) {
      router.replace(jalurUntuk(""), { scroll: false });
    }
  }

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="q" className="sr-only">
        Cari destinasi
      </label>

      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      <input
        ref={input}
        id="q"
        name="q"
        type="text"
        value={nilai}
        onChange={(e) => ketik(e.target.value)}
        placeholder="Cari destinasi"
        // Ikon duduk di x=16 selebar 18px, jadi teks baru boleh mulai setelah
        // 48px; pr-12 menyediakan ruang yang sama untuk tombol hapus di kanan.
        className="w-full rounded-pill border border-line bg-surface py-3 pl-12 pr-12 text-caption text-text placeholder:text-muted"
      />

      {nilai.length > 0 && (
        <button
          type="button"
          onClick={bersihkan}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-pill text-muted transition-colors hover:bg-background hover:text-text"
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
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
