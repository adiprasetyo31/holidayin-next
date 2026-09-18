import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-section border-t border-line bg-surface">
      <div className="mx-auto grid max-w-page gap-10 px-gutter py-block sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="font-display text-h4 font-semibold">
            Holiday<span className="text-accent">In</span>
          </p>
          <p className="mt-3 max-w-md text-caption text-muted">
            Panduan singkat destinasi wisata di Daerah Istimewa Yogyakarta, mulai
            dari candi dan kawasan kraton hingga pantai selatan dan perbukitan
            Gunung Kidul.
          </p>
        </div>

        <div>
          <h2 className="text-caption font-semibold">Jelajahi</h2>
          <ul className="mt-3 space-y-2 text-caption text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/destinasi"
                className="transition-colors hover:text-accent"
              >
                Semua destinasi
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-page px-gutter py-5 text-micro tracking-normal text-muted">
          Informasi jam buka dan harga tiket dapat berubah sewaktu-waktu, mohon
          periksa kembali ke pengelola sebelum berkunjung.
        </p>
      </div>
    </footer>
  );
}
