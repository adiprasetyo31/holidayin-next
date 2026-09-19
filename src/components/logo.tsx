/**
 * Tanda candi HolidayIn: menara bertingkat dengan pintu di bawahnya, sama
 * persis dengan app/icon.svg.
 *
 * Geometrinya diekspor terpisah karena tanda ini dipakai di tiga tempat dengan
 * cara mewarnai yang berbeda: komponen Logo memakai token warna supaya ikut
 * berganti di mode gelap, sementara app/apple-icon.tsx dan gambar Open Graph
 * digambar oleh next/og yang tidak mengenal kelas Tailwind sehingga warnanya
 * ditulis sebagai nilai tetap. Yang tidak boleh berbeda adalah bentuknya, jadi
 * hanya bentuk itu yang tinggal di sini.
 */
export const MARK_VIEW_BOX = "0 0 64 64";

/** Puncak menara. */
export const MARK_SPIRE = "28,24 32,11 36,24";

/** Tingkat badan candi, dari puncak ke kaki. */
export const MARK_TIERS = [
  { x: 25, y: 23, width: 14, height: 7 },
  { x: 20, y: 30, width: 24, height: 8 },
  { x: 16, y: 38, width: 32, height: 8 },
  { x: 12, y: 46, width: 40, height: 6 },
] as const;

/** Pintu: dilubangi dengan warna ubin, bukan warna candi. */
export const MARK_DOOR = { x: 29, y: 40, width: 6, height: 12 } as const;

/** Sudut tumpul ubin. apple-icon memakai 0 karena iOS memasang topengnya sendiri. */
export const MARK_RADIUS = 14;

/**
 * Tanda candi berukuran 24px. Hiasan semata: pemakainya selalu menyertakan
 * kata "HolidayIn" sebagai teks, jadi tanda ini disembunyikan dari pembaca
 * layar agar namanya tidak terbaca dua kali.
 *
 * Ubinnya memakai accent dan candinya memakai background, jadi di mode gelap
 * keduanya ikut bertukar mengikuti token tanpa perlu varian terpisah.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEW_BOX}
      aria-hidden
      focusable="false"
      className={`size-6 shrink-0 ${className}`}
    >
      <rect width="64" height="64" rx={MARK_RADIUS} className="fill-accent" />
      <g className="fill-background">
        <polygon points={MARK_SPIRE} />
        {MARK_TIERS.map((tier) => (
          <rect key={tier.y} {...tier} />
        ))}
      </g>
      <rect {...MARK_DOOR} className="fill-accent" />
    </svg>
  );
}
