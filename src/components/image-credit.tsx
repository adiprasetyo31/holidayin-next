import type { ImageCredit as Credit } from "@/src/lib/destinations";

/**
 * Atribusi satu foto. Tidak merender apa pun bila kreditnya belum diketahui,
 * sesuai aturan "null berarti sembunyikan".
 *
 * text-micro membawa letter-spacing untuk label kapital, jadi dinetralkan di sini.
 */
export function ImageCredit({
  credit,
  tone = "default",
  className = "",
}: {
  credit: Credit | null;
  /** "on-scrim" untuk kredit yang duduk di atas foto, bukan di atas kertas. */
  tone?: "default" | "on-scrim";
  className?: string;
}) {
  if (!credit) return null;

  // accent terlalu gelap di atas scrim, jadi hover-nya ikut nada.
  const warna =
    tone === "on-scrim" ? "text-on-scrim-muted" : "text-muted";
  const tautan =
    "underline underline-offset-2 " +
    (tone === "on-scrim" ? "hover:text-on-scrim" : "hover:text-accent");

  return (
    <p className={`text-micro tracking-normal ${warna} ${className}`}>
      Foto:{" "}
      <a
        href={credit.sourceUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={tautan}
      >
        {credit.author}
      </a>{" "}
      &middot;{" "}
      <a
        href={credit.licenseUrl}
        target="_blank"
        rel="nofollow noopener noreferrer license"
        className={tautan}
      >
        {credit.license}
      </a>
    </p>
  );
}
