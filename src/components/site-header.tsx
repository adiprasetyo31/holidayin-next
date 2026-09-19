"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/destinasi", label: "Destinasi" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Menu seluler ditutup saat pindah halaman, termasuk lewat tombol kembali.
  // Disetel saat render, bukan di dalam effect, supaya tidak memicu render
  // susulan (lihat react-hooks/set-state-in-effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Menu juga ditutup saat menekan Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-gutter py-4">
        <Link
          href="/"
          className="font-display text-h4 font-semibold tracking-tight text-text"
        >
          Holiday<span className="text-accent">In</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-pill px-4 py-2 text-caption transition-colors ${
                    isActive(item.href)
                      ? "bg-surface font-medium text-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-seluler"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="rounded-field border border-line p-2.5 text-text transition-colors hover-fine:border-accent hover-fine:text-accent sm:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M5 5l10 10" />
                <path d="M15 5L5 15" />
              </>
            ) : (
              <>
                <path d="M3 6h14" />
                <path d="M3 10h14" />
                <path d="M3 14h14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="menu-seluler"
          aria-label="Navigasi seluler"
          className="border-t border-line bg-background sm:hidden"
        >
          <ul className="mx-auto max-w-page px-gutter py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-field px-3 py-3 text-caption ${
                    isActive(item.href)
                      ? "bg-surface font-medium text-accent"
                      : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
