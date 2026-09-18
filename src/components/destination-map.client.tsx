"use client";

import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

/**
 * Ubin CARTO, bukan ubin baku OSM: warnanya nyaris abu-abu, jadi tidak beradu
 * dengan palet sogan. Tanpa kunci API, tapi atribusinya wajib menyebut keduanya.
 */
const UBIN = {
  terang: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  gelap: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

const ATRIBUSI =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; ' +
  '&copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Ikon bawaan Leaflet menunjuk berkas PNG yang jalurnya rusak di bawah bundler,
 * jadi penandanya digambar sendiri. Warnanya memakai custom property supaya ikut
 * berganti saat mode gelap aktif.
 */
const PENANDA = `
<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M16 39C16 39 29 24.5 29 15A13 13 0 1 0 3 15C3 24.5 16 39 16 39Z"
        fill="var(--accent)" stroke="var(--background)" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="16" cy="15" r="4.5" fill="var(--background)"/>
</svg>`;

export default function DestinationMapClient({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const wadah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wadah.current;
    if (!el) return;

    let batal = false;
    let bersihkan = () => {};

    // Leaflet menyentuh window saat diimpor, jadi impornya ditunda ke dalam efek.
    import("leaflet").then((L) => {
      if (batal || !el) return;

      const kurangiGerak = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Panel styleguide menyetel [data-theme] sendiri; di luar itu ikut sistem.
      const panel = el.closest("[data-theme]");
      const preferensi = window.matchMedia("(prefers-color-scheme: dark)");
      const sedangGelap = () =>
        panel instanceof HTMLElement && panel.dataset.theme
          ? panel.dataset.theme === "dark"
          : preferensi.matches;

      const peta = L.map(el, {
        center: [lat, lng],
        zoom: 14,
        // Gulir halaman tidak boleh tersandera peta saat melewatinya.
        scrollWheelZoom: false,
        zoomAnimation: !kurangiGerak,
        fadeAnimation: !kurangiGerak,
        markerZoomAnimation: !kurangiGerak,
      });

      const ubin = L.tileLayer(sedangGelap() ? UBIN.gelap : UBIN.terang, {
        attribution: ATRIBUSI,
        maxZoom: 19,
      }).addTo(peta);

      L.marker([lat, lng], {
        title: name,
        alt: `Lokasi ${name}`,
        keyboard: false,
        icon: L.divIcon({
          html: PENANDA,
          // Kelas bawaan divIcon menggambar kotak putih bergaris di balik ikon.
          className: "",
          iconSize: [32, 40],
          iconAnchor: [16, 40],
        }),
      }).addTo(peta);

      const ikutTema = () => ubin.setUrl(sedangGelap() ? UBIN.gelap : UBIN.terang);
      preferensi.addEventListener("change", ikutTema);

      bersihkan = () => {
        preferensi.removeEventListener("change", ikutTema);
        peta.remove();
      };
    });

    return () => {
      batal = true;
      bersihkan();
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={wadah}
      tabIndex={0}
      role="region"
      aria-label={`Peta lokasi ${name}. Gunakan tombol panah untuk menggeser.`}
      // isolate menahan tumpukan z-index Leaflet supaya tidak menembus header.
      className="relative isolate z-0 aspect-[16/10] w-full overflow-hidden rounded-card border border-line bg-surface [&_.leaflet-container]:bg-surface [&_.leaflet-control-attribution]:bg-surface/85 [&_.leaflet-control-attribution]:text-micro [&_.leaflet-control-attribution]:tracking-normal [&_.leaflet-control-attribution]:text-muted [&_.leaflet-control-attribution_a]:text-accent"
    />
  );
}
