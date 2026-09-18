/**
 * Panel pengganti foto. Dipakai bila images.card bernilai null, yaitu ketika
 * belum ada foto berlisensi Wikimedia Commons atau Unsplash yang layak untuk
 * tempat itu. Aturannya sama dengan info praktis: lebih baik kosong dan jujur
 * daripada diisi seadanya.
 *
 * Garis diagonalnya memakai highlight, warna emas kraton yang memang hanya
 * untuk hiasan, bukan untuk teks. Tulisannya sendiri memakai muted.
 */
export function NoPhoto({ tone = "default" }: { tone?: "default" | "on-scrim" }) {
  const onScrim = tone === "on-scrim";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        onScrim ? "bg-scrim" : "bg-surface"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-highlight) 0 1px, transparent 1px 14px)",
        }}
      />
      <p
        className={`relative text-micro ${
          onScrim ? "text-on-scrim-muted" : "text-muted"
        }`}
      >
        Foto belum tersedia
      </p>
    </div>
  );
}
