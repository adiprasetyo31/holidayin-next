import Image from "next/image";
import Link from "next/link";

import { NoPhoto } from "@/src/components/no-photo";
import {
  categoryLabel,
  regionLabel,
  type Destination,
} from "@/src/lib/destinations";

export function DestinationCard({
  destination,
  priority = false,
}: {
  destination: Destination;
  priority?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-raised">
      <Link href={`/destinasi/${destination.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-background">
          {destination.images.card ? (
            <Image
              src={destination.images.card.src}
              alt={destination.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <NoPhoto />
          )}
        </div>

        <div className="p-5">
          <p className="text-micro font-medium uppercase text-accent">
            {categoryLabel(destination.category)}
          </p>
          <h3 className="mt-2 font-display text-h4">{destination.name}</h3>
          <p className="mt-2 line-clamp-3 text-caption text-muted">
            {destination.shortDescription}
          </p>
          <p className="mt-4 text-micro tracking-normal text-stone">
            {regionLabel(destination.region)}
          </p>
        </div>
      </Link>
    </article>
  );
}
