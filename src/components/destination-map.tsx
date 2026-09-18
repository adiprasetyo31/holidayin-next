"use client";

import dynamic from "next/dynamic";

/**
 * Pembungkus tipis yang memegang impor dinamisnya. ssr: false tidak boleh dipakai
 * dari komponen server di App Router, jadi panggilannya harus duduk di berkas
 * klien seperti ini; halaman detail tetap bisa jadi komponen server.
 */
const Peta = dynamic(() => import("./destination-map.client"), {
  ssr: false,
  // Rangka dengan rasio yang sama, supaya tidak ada geser tata letak saat termuat.
  loading: () => (
    <div className="aspect-[16/10] w-full rounded-card border border-line bg-surface" />
  ),
});

export function DestinationMap(props: {
  lat: number;
  lng: number;
  name: string;
}) {
  return <Peta {...props} />;
}
