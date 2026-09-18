import {
  formatLastVerified,
  formatRate,
  mapsHref,
  rateLabel,
  type Destination,
} from "@/src/lib/destinations";

function Blok({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-line pt-5 first:mt-0 first:border-0 first:pt-0">
      <h3 className="text-micro font-medium uppercase text-muted">{judul}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/**
 * Kartu informasi praktis. Urutannya tetap: jam buka, harga tiket, catatan,
 * lokasi, lalu tanggal pembaruan di paling bawah. Setiap blok hilang sepenuhnya
 * bila datanya tidak ada, sesuai aturan "null berarti sembunyikan".
 */
export function DestinationInfoCard({
  destination,
}: {
  destination: Destination;
}) {
  const { info, location } = destination;
  const rates = info.ticket.rates;

  return (
    <section
      aria-labelledby="informasi-praktis"
      className="rounded-card border border-line bg-surface p-6"
    >
      <h2 id="informasi-praktis" className="font-display text-h4">
        Informasi praktis
      </h2>

      <div className="mt-5">
        {info.openingHours && (
          <Blok judul="Jam buka">
            <p className="text-caption">{info.openingHours}</p>
          </Blok>
        )}

        {rates.length > 0 && (
          <Blok judul="Harga tiket">
            <dl className="space-y-2">
              {rates.map((rate) => (
                <div
                  key={`${rate.visitor}-${rate.day}`}
                  // Label boleh membungkus, harga tidak. Keduanya rata atas
                  // supaya harga tetap sejajar baris pertama label yang panjang.
                  className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1"
                >
                  <dt className="text-caption text-muted">{rateLabel(rate)}</dt>
                  <dd className="whitespace-nowrap text-caption font-medium tabular-nums">
                    {formatRate(rate)}
                  </dd>
                </div>
              ))}
            </dl>
          </Blok>
        )}

        {info.notes && (
          <Blok judul="Catatan">
            <p className="text-caption leading-relaxed text-muted">
              {info.notes}
            </p>
          </Blok>
        )}

        <Blok judul="Lokasi">
          <p className="text-caption leading-relaxed text-muted">
            {location.address}
          </p>
          <a
            href={mapsHref(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-caption font-medium text-accent hover:underline"
          >
            Buka di Google Maps
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
            <span className="sr-only">(membuka tab baru)</span>
          </a>
        </Blok>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-micro leading-relaxed tracking-normal text-muted">
        Info diperbarui {formatLastVerified(destination.lastVerified)}. Jam buka
        dan harga tiket dapat berubah sewaktu-waktu.
      </p>
    </section>
  );
}
