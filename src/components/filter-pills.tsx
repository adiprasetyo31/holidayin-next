import Link from "next/link";

export type FilterOption = {
  /** "" untuk pilihan "Semua". */
  id: string;
  label: string;
  count: number;
  href: string;
};

type FilterPillsProps = {
  /** Judul kecil di atas deretan pil, mis. "Wilayah". */
  legend: string;
  /** id unik untuk menyambungkan <nav> ke judulnya. */
  legendId: string;
  options: FilterOption[];
  /** id pilihan yang aktif, "" berarti "Semua". */
  activeId: string;
};

/* Tinggi dikunci 40px dan teks tidak boleh membungkus: itu yang membuat pil
   gepeng dan saling tindih saat ruang mendatar habis. Deretan pil membungkus
   ke baris berikutnya, tidak pernah digeser ke samping, jadi tidak ada pilihan
   yang terpotong. Di bawah md filter tampil sebagai lembar bawah, bukan pil.
   relative menahan span sr-only di dalam pil. */
const PILL_BASE =
  "relative inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap " +
  "rounded-pill border px-4 text-caption transition-colors";
const PILL_ON = "border-accent bg-accent text-on-accent";
const PILL_OFF =
  "border-line bg-transparent text-text hover:border-accent hover:text-accent";
const PILL_EMPTY = "border-line bg-transparent text-muted opacity-60";

export function FilterPills({
  legend,
  legendId,
  options,
  activeId,
}: FilterPillsProps) {
  return (
    <nav aria-labelledby={legendId}>
      <h2 id={legendId} className="text-caption text-muted">
        {legend}
      </h2>

      <div className="mt-2">
        <ul className="flex flex-wrap gap-2">
          {options.map((option) => {
            const aktif = option.id === activeId;
            // Pilihan tanpa hasil jadi jalan buntu, jadi tautannya dilepas.
            // "Semua" tidak pernah dimatikan supaya filter selalu bisa dibatalkan.
            const mati = !aktif && option.count === 0 && option.id !== "";

            const isi = (
              <>
                {option.label}
                <span className={aktif ? "text-on-accent/70" : "text-muted"}>
                  {option.count}
                  <span className="sr-only"> destinasi</span>
                </span>
              </>
            );

            return (
              <li key={option.id || "semua"}>
                {mati ? (
                  <span className={`${PILL_BASE} ${PILL_EMPTY}`}>{isi}</span>
                ) : (
                  <Link
                    href={option.href}
                    aria-current={aktif ? "true" : undefined}
                    className={`${PILL_BASE} ${aktif ? PILL_ON : PILL_OFF}`}
                  >
                    {isi}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
