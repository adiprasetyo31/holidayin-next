import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak pernah ada.
      </p>
      <Link
        href="/destinasi"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Lihat semua destinasi
      </Link>
    </div>
  );
}
