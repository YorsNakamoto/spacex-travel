"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Input dengan label mengambang (pure CSS: peer + placeholder-shown).
 * Ref diteruskan agar kompatibel dengan react-hook-form `register`
 * (input uncontrolled). Warna focus mengikuti var --accent-active
 * (berganti halus mengikuti model roket terpilih).
 */
export const FloatingInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    /** Pesan error validasi (Bahasa Indonesia) — tampil di bawah input. */
    error?: string;
  }
>(function FloatingInput({ label, error, className, id, ...props }, ref) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={cn("relative", className)}>
      <input
        ref={ref}
        id={inputId}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "peer h-14 w-full rounded-2xl border bg-white/[0.04] px-4 pt-5 pb-1.5 text-[15px] text-foreground",
          "placeholder:text-transparent transition-[border-color,box-shadow] duration-200",
          "focus:outline-none focus:border-[var(--accent-active,#7dd3fc)] focus:shadow-[0_0_0_3px_var(--accent-active-soft,rgba(125,211,252,0.14))]",
          "[color-scheme:dark]",
          error ? "border-destructive/60" : "border-white/10 hover:border-white/20"
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-4 text-sm text-muted-foreground transition-all duration-200",
          // Terapung saat terisi / fokus
          "top-2 text-[10px] uppercase tracking-[0.14em]",
          // Turun ke tengah saat kosong & belum fokus
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal",
          "peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:translate-y-0 peer-focus:text-[var(--accent-active,#7dd3fc)]"
        )}
      >
        {label}
      </label>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
