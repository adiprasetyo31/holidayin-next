import type { Destination } from "@/src/lib/destinations";

/**
 * Uraian lengkap lalu tag. Ringkasannya sengaja tidak diulang di sini:
 * shortDescription sudah tampil di kartu destinasi dan dipakai sebagai meta
 * description halaman, jadi di halaman detail bagian ini langsung dibuka judul.
 */
export function DestinationDescription({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <section aria-labelledby="deskripsi-tempat">
      <h2 id="deskripsi-tempat" className="font-display text-h2">
        Deskripsi tempat
      </h2>
      <div className="mt-6 max-w-prose space-y-4">
        {destination.description.map((paragraph) => (
          <p key={paragraph} className="text-body text-text/90">
            {paragraph}
          </p>
        ))}
      </div>

      {destination.tags.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {destination.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill bg-stone/15 px-3 py-1 text-micro tracking-normal text-stone"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
