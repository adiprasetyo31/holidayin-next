import { DestinationCard } from "@/src/components/destination-card";
import { getRelated, regionLabel, type Destination } from "@/src/lib/destinations";

/**
 * Saran destinasi berikutnya. Dipisah jadi komponen sendiri supaya bagian lain,
 * misalnya ulasan pada fase berikutnya, bisa disisipkan sebelum bagian ini.
 */
export function RelatedDestinations({
  destination,
}: {
  destination: Destination;
}) {
  const { items, sameRegion } = getRelated(destination);
  if (items.length === 0) return null;

  const judul = sameRegion
    ? `Destinasi lain di ${regionLabel(destination.region)}`
    : "Destinasi lain";

  return (
    <section aria-labelledby="destinasi-lain">
      <h2 id="destinasi-lain" className="font-display text-h2">
        {judul}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DestinationCard key={item.slug} destination={item} />
        ))}
      </div>
    </section>
  );
}
