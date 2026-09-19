import { ImageResponse } from "next/og";

import {
  MARK_DOOR,
  MARK_SPIRE,
  MARK_TIERS,
  MARK_VIEW_BOX,
} from "@/src/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// next/og tidak membaca kelas Tailwind, jadi warnanya ditulis apa adanya.
// Nilainya sama dengan token accent dan background pada mode terang; ikon
// aplikasi tidak ikut berganti mengikuti tema perangkat.
const ACCENT = "#9C5B2E";
const PAPER = "#F7F3EC";

/**
 * Ikon layar utama iOS. Bentuknya sama dengan app/icon.svg, hanya tanpa sudut
 * tumpul: iOS memasang topengnya sendiri, dan ubin yang sudah dibulatkan akan
 * terpotong dua kali sehingga tepinya terlihat putih.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg {...size} viewBox={MARK_VIEW_BOX} xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill={ACCENT} />
        <g fill={PAPER}>
          <polygon points={MARK_SPIRE} />
          {MARK_TIERS.map((tier) => (
            <rect key={tier.y} {...tier} />
          ))}
        </g>
        <rect {...MARK_DOOR} fill={ACCENT} />
      </svg>
    ),
    size
  );
}
