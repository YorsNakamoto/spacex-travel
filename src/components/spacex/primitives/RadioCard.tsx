"use client";

import { cn } from "@/lib/utils";

/**
 * Kartu pilihan tunggal (radio) bergaya premium.
 * Dipakai untuk pemilihan model roket — aksen ice (Z1150) atau gold (Special 000).
 */
export function RadioCard({
  checked,
  onChange,
  children,
  accent = "ice",
  ariaLabel,
  className,
  disabled,
  radioId,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
  /** Aksen kartu: ice-blue (Z1150) atau champagne-gold (Special 000). */
  accent?: "ice" | "gold";
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  /** ID untuk penargetan animasi dari luar (mis. flash saat "Pesan Model Ini"). */
  radioId?: string;
}) {
  const isGold = accent === "gold";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      data-radio-id={radioId}
      onClick={() => onChange(!checked)}
      className={cn(
        "group relative w-full rounded-2xl border p-4 text-left transition-all duration-300",
        checked
          ? isGold
            ? "border-gold/60 bg-gold/10 shadow-[0_0_28px_-8px_var(--gold)]"
            : "border-ice/60 bg-ice/10 shadow-[0_0_28px_-8px_var(--ice)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {/* Indikator bulat */}
      <span
        className={cn(
          "absolute right-4 top-4 flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors",
          checked
            ? isGold
              ? "border-gold bg-gold"
              : "border-ice bg-ice"
            : "border-white/25"
        )}
        aria-hidden="true"
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-[#05070D]" />}
      </span>
      {children}
    </button>
  );
}
