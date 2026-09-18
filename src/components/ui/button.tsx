import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-colors disabled:pointer-events-none disabled:opacity-45";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary:
    "border border-line-strong bg-surface text-text hover:border-accent hover:text-accent",
  ghost: "text-accent hover:bg-surface",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-caption",
  md: "px-6 py-3 text-caption",
};

/** Kelas tombol, dipisah agar <Link> bisa memakai gaya yang sama. */
export function buttonClass({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return [BASE, VARIANT[variant], SIZE[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button {...props} className={buttonClass({ variant, size, className })} />;
}

/** Tautan dalam teks berjalan. */
export const linkClass =
  "text-accent underline decoration-line-strong underline-offset-4 " +
  "transition-colors hover:decoration-accent";
