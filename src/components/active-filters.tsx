import Link from "next/link";

export type ActiveFilter = {
  /** Teks pada chip, mis. nama wilayah atau kueri pencarian. */
  label: string;
  /** Tujuan setelah filter ini dilepas. */
  removeHref: string;
  /** Dibacakan pembaca layar, mis. "Hapus filter wilayah Sleman". */
  removeLabel: string;
};

/**
 * Deretan chip filter yang sedang aktif, masing-masing bisa dilepas satuan.
 * Tidak merender apa pun bila tidak ada filter aktif.
 */
export function ActiveFilters({ filters }: { filters: ActiveFilter[] }) {
  if (filters.length === 0) return null;

  return (
    <ul aria-label="Filter aktif" className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <li key={filter.removeLabel}>
          <Link
            href={filter.removeHref}
            aria-label={filter.removeLabel}
            className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface py-1.5 pl-3 pr-2 text-caption text-text transition-colors hover:border-accent hover:text-accent"
          >
            {filter.label}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
