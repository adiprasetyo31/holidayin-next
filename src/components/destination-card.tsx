import Image from "next/image";
import Link from "next/link";

import { categoryLabel, type Destination } from "@/src/lib/destinations";

export function DestinationCard({
  destination,
  priority = false,
}: {
  destination: Destination;
  priority?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-lg hover:shadow-[var(--shadow)]">
      <Link href={`/destinasi/${destination.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-background">
          <Image
            src={destination.images.card}
            alt={destination.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {categoryLabel(destination.category)}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
            {destination.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {destination.shortDescription}
          </p>
          <p className="mt-4 text-xs text-stone">{destination.location.regency}</p>
        </div>
      </Link>
    </article>
  );
}
