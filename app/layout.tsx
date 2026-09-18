import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { SiteFooter } from "@/src/components/site-footer";
import { SiteHeader } from "@/src/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fraunces variabel: opsz dipakai agar judul besar memakai potongan huruf
// yang tepat, SOFT sedikit melembutkan sudutnya.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "HolidayIn - Panduan Wisata Yogyakarta",
    template: "%s | HolidayIn",
  },
  description:
    "Panduan destinasi wisata Daerah Istimewa Yogyakarta: candi, kawasan kraton, pantai selatan, dan perbukitan Gunung Kidul.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-body text-text">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-field focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
