"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <section aria-label={`Galeri foto ${name}`}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          key={current}
          src={current}
          alt={`${name} - foto ${active + 1} dari ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Tampilkan foto ${index + 1}`}
                aria-current={index === active}
                className={`relative block h-16 w-24 overflow-hidden rounded-lg border-2 transition-opacity ${
                  index === active
                    ? "border-accent"
                    : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
