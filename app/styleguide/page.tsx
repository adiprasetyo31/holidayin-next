import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  buttonClass,
  linkClass,
  type ButtonVariant,
} from "@/src/components/ui/button";
import {
  colorTokens,
  contrastRatio,
  lineTokens,
  radiusTokens,
  scrimTokens,
  spacingTokens,
  typeScale,
  wcagLabel,
} from "@/src/lib/tokens";

// SEMENTARA: halaman acuan desain, bukan bagian dari situs publik.
// Dihapus bersama src/lib/tokens.ts setelah fondasi desain mantap.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

type Mode = "light" | "dark";

// Kelas ditulis utuh, bukan dirangkai dari variabel: Tailwind memindai berkas
// sebagai teks, jadi `text-${nama}` tidak akan pernah dihasilkan.
const TYPE_CLASS: Record<string, string> = {
  display: "font-display text-display",
  h1: "font-display text-h1",
  h2: "font-display text-h2",
  h3: "font-display text-h3",
  h4: "font-display text-h4",
  "body-lg": "font-sans text-body-lg",
  body: "font-sans text-body",
  caption: "font-sans text-caption",
  micro: "font-sans text-micro",
};

const SPACING_BAR_CLASS: Record<string, string> = {
  gutter: "w-gutter",
  block: "w-block",
  section: "w-section",
};

const RADIUS_CLASS: Record<string, string> = {
  field: "rounded-field",
  card: "rounded-card",
  pill: "rounded-pill",
};

const RAMP_CLASS = ["h-1", "h-2", "h-4", "h-6", "h-8", "h-12", "h-16"];

function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-micro tracking-normal text-muted">{children}</p>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h3 className="font-display text-h4">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Colors({ mode }: { mode: Mode }) {
  const background = mode === "light" ? "#F7F3EC" : "#1A1612";

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {colorTokens.map((token) => {
        const value = mode === "light" ? token.light : token.dark;
        const ratio = token.contrastOn ? contrastRatio(value, background) : null;

        return (
          <li
            key={token.name}
            className="flex gap-3 rounded-card border border-line p-3"
          >
            <span
              aria-hidden
              className="size-12 shrink-0 rounded-field border border-line-strong"
              style={{ background: value }}
            />
            <div className="min-w-0">
              <p className="font-mono text-caption font-medium">{token.name}</p>
              <Meta>
                {value}
                {ratio !== null
                  ? ` · ${ratio.toFixed(2)}:1 ${wcagLabel(ratio)}`
                  : ""}
              </Meta>
              <p className="mt-1 text-micro tracking-normal text-muted">
                {token.note}
              </p>
            </div>
          </li>
        );
      })}

      {lineTokens.map((token) => (
        <li
          key={token.name}
          className="flex gap-3 rounded-card border border-line p-3"
        >
          <span
            aria-hidden
            className="size-12 shrink-0 rounded-field border border-line-strong"
            style={{ background: mode === "light" ? token.light : token.dark }}
          />
          <div className="min-w-0">
            <p className="font-mono text-caption font-medium">{token.name}</p>
            <p className="font-mono text-micro tracking-normal break-all text-muted">
              {mode === "light" ? token.light : token.dark}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Scrim() {
  return (
    <div className="rounded-card bg-scrim p-5">
      <p className="text-micro font-medium uppercase text-on-scrim-muted">
        label kecil
      </p>
      <p className="mt-2 font-display text-h3 text-on-scrim">on-scrim</p>
      <p className="text-caption text-on-scrim-muted">on-scrim-muted</p>
      <p className="mt-3 font-mono text-micro tracking-normal text-on-scrim-muted">
        {scrimTokens.map((token) => token.name).join(" · ")} — tetap sama di
        kedua mode
      </p>
    </div>
  );
}

// highlight gagal kontras sebagai teks di atas kertas (2.84:1), jadi
// pemakaiannya dibatasi pada unsur non-teks. Label kecil memakai accent.
function HighlightUsage() {
  return (
    <div className="space-y-4">
      <div>
        <Meta>boleh — garis, tepi, ikon, aksen dekoratif</Meta>
        <div className="mt-2 space-y-3">
          <hr className="h-0.5 w-24 border-0 bg-highlight" />
          <div className="rounded-card border-l-4 border-highlight bg-surface px-4 py-3 text-caption">
            Kutipan atau sorotan dengan tepi emas.
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6 text-highlight"
            fill="currentColor"
          >
            <path d="M12 2l2.6 6.6L21 9.6l-4.8 4.5 1.3 6.6L12 17.4 6.5 20.7l1.3-6.6L3 9.6l6.4-1z" />
          </svg>
        </div>
      </div>

      <div>
        <Meta>tidak boleh — teks, termasuk label kecil huruf besar</Meta>
        <p className="mt-2 text-micro font-medium uppercase text-highlight">
          label seperti ini (2.84:1, gagal)
        </p>
        <p className="mt-2 text-micro font-medium uppercase text-accent">
          pakai accent sebagai gantinya
        </p>
      </div>
    </div>
  );
}

function TypeScale() {
  return (
    <ul className="space-y-5">
      {typeScale.map((step) => (
        <li key={step.name}>
          <Meta>
            text-{step.name} · {step.value} ·{" "}
            {step.face === "display" ? "Fraunces" : "Inter"}
          </Meta>
          <p className={`mt-1 ${TYPE_CLASS[step.name]}`}>
            Candi Prambanan saat senja
          </p>
        </li>
      ))}
    </ul>
  );
}

function Spacing() {
  return (
    <>
      <ul className="space-y-3">
        {spacingTokens.map((token) => (
          <li key={token.name}>
            <Meta>
              {token.name} · {token.value} · {token.use}
            </Meta>
            <span
              aria-hidden
              className={`mt-1 block h-4 rounded-sm bg-accent ${
                SPACING_BAR_CLASS[token.name]
              }`}
            />
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Meta>skala dasar (--spacing 0.25rem): 1 · 2 · 4 · 6 · 8 · 12 · 16</Meta>
        <ul aria-hidden className="mt-2 flex items-end gap-2">
          {RAMP_CLASS.map((height) => (
            <li key={height} className={`w-8 rounded-sm bg-stone ${height}`} />
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Meta>radius</Meta>
        <ul className="mt-2 flex flex-wrap gap-3">
          {radiusTokens.map((token) => (
            <li
              key={token.name}
              className={`border border-line-strong bg-surface-raised px-4 py-3 text-micro tracking-normal ${
                RADIUS_CLASS[token.name]
              }`}
            >
              {token.name} · {token.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Meta>bayangan</Meta>
        <ul className="mt-2 flex flex-wrap gap-4">
          <li className="rounded-card border border-line bg-surface px-5 py-4 text-micro tracking-normal shadow-card">
            shadow-card
          </li>
          <li className="rounded-card border border-line bg-surface px-5 py-4 text-micro tracking-normal shadow-raised">
            shadow-raised
          </li>
        </ul>
      </div>
    </>
  );
}

// Hover dan focus tidak bisa dipicu pada tangkapan statis, jadi keadaannya
// ditulis eksplisit agar keduanya terlihat berdampingan.
const BUTTON_ROWS: {
  variant: ButtonVariant;
  states: { name: string; className: string }[];
}[] = [
  {
    variant: "primary",
    states: [
      { name: "default", className: buttonClass() },
      { name: "hover", className: buttonClass({ className: "bg-accent-hover" }) },
      {
        name: "focus",
        className: buttonClass({
          className: "outline-2 outline-offset-2 outline-accent",
        }),
      },
    ],
  },
  {
    variant: "secondary",
    states: [
      { name: "default", className: buttonClass({ variant: "secondary" }) },
      {
        name: "hover",
        className: buttonClass({
          variant: "secondary",
          className: "border-accent text-accent",
        }),
      },
      {
        name: "focus",
        className: buttonClass({
          variant: "secondary",
          className: "outline-2 outline-offset-2 outline-accent",
        }),
      },
    ],
  },
  {
    variant: "ghost",
    states: [
      { name: "default", className: buttonClass({ variant: "ghost" }) },
      {
        name: "hover",
        className: buttonClass({ variant: "ghost", className: "bg-surface" }),
      },
      {
        name: "focus",
        className: buttonClass({
          variant: "ghost",
          className: "outline-2 outline-offset-2 outline-accent",
        }),
      },
    ],
  },
];

function Buttons() {
  return (
    <div className="space-y-6">
      {BUTTON_ROWS.map((row) => (
        <div key={row.variant}>
          <Meta>{row.variant}</Meta>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {row.states.map((state) => (
              <button key={state.name} type="button" className={state.className}>
                {state.name}
              </button>
            ))}
            <button
              type="button"
              disabled
              className={buttonClass({ variant: row.variant })}
            >
              disabled
            </button>
          </div>
        </div>
      ))}

      <div>
        <Meta>ukuran</Meta>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button type="button" className={buttonClass({ size: "sm" })}>
            sm
          </button>
          <button type="button" className={buttonClass({ size: "md" })}>
            md
          </button>
        </div>
      </div>

      <div>
        <Meta>tautan dalam teks</Meta>
        <p className="mt-2 text-body">
          Kompleks candi ini ada di{" "}
          <a href="#" className={linkClass}>
            perbatasan Sleman
          </a>
          , dan keadaan hover-nya{" "}
          <a href="#" className={`${linkClass} decoration-accent`}>
            terlihat seperti ini
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Panel({ mode }: { mode: Mode }) {
  return (
    <div
      data-theme={mode}
      className="rounded-card border border-line bg-background p-5 text-text sm:p-6"
    >
      <p className="font-mono text-caption font-medium text-accent">
        data-theme=&quot;{mode}&quot;
      </p>

      <div className="mt-6 space-y-8">
        <Section title="Warna">
          <Colors mode={mode} />
        </Section>
        <Section title="Di atas foto">
          <Scrim />
        </Section>
        <Section title="Highlight: hanya non-teks">
          <HighlightUsage />
        </Section>
        <Section title="Skala tipe">
          <TypeScale />
        </Section>
        <Section title="Spasi, radius, bayangan">
          <Spacing />
        </Section>
        <Section title="Tombol dan tautan">
          <Buttons />
        </Section>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-page px-gutter py-block">
      <header className="max-w-prose">
        <p className="text-micro font-medium uppercase text-accent">
          Sementara
        </p>
        <h1 className="mt-3 font-display text-h1">Styleguide</h1>
        <p className="mt-4 text-body text-muted">
          Acuan token desain HolidayIn: warna, tipografi, spasi, dan keadaan
          komponen. Kedua panel di bawah memakai markup yang sama; yang
          membedakan hanya atribut <code className="font-mono">data-theme</code>,
          jadi mode terang dan gelap bisa dibandingkan berdampingan tanpa
          mengubah setelan sistem. Halaman ini tidak diindeks dan tidak tertaut
          dari navigasi.
        </p>
        <p className="mt-4 text-caption text-muted">
          Rasio kontras dihitung terhadap{" "}
          <code className="font-mono">background</code> pada mode yang
          bersangkutan.{" "}
          <Link href="/" className={linkClass}>
            Kembali ke beranda
          </Link>
        </p>
      </header>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        <Panel mode="light" />
        <Panel mode="dark" />
      </div>
    </div>
  );
}
