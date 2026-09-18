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
   gepeng dan saling tindih saat ruang mendatar habis. Di layar sempit deretan
   pil menjadi satu baris yang digeser; mulai md pil kembali membungkus.
   relative menahan span sr-only di dalam pil; tanpa itu posisi absolutnya
   mengacu ke pembungkus di luar area gulir dan halaman melebar ke samping. */
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

      <div className="relative mt-2">
        <ul
          className={
            "flex snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-none " +
            "pr-8 pb-1 md:flex-wrap md:snap-none md:overflow-x-visible md:pr-0 md:pb-0"
          }
        >
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
              <li key={option.id || "semua"} className="shrink-0 snap-start">
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

        {/* Isyarat bahwa baris masih bisa digeser. Hanya di layar sempit,
            karena mulai md pil sudah membungkus. */}
        <div
          aria-hidden
          className={
            "pointer-events-none absolute inset-y-0 right-0 w-10 " +
            "bg-gradient-to-l from-background to-transparent md:hidden"
          }
        />
      </div>
    </nav>
  );
}
