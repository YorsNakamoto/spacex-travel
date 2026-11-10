"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Input dengan label mengambang (floating label).
 * Ref diteruskan agar kompatibel dengan react-hook-form `register`.
 * Warna focus-ring mengikuti CSS var --accent-active (berganti per model roket, Fase 6).
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
  const [focused, setFocused] = useState(false);
  const filled = typeof props.value === "string" && props.value.length > 0;
  const floated = focused || filled || props.type === "date";

  return (
    <div className={cn("relative", className)}>
      <input
        ref={ref}
        id={inputId}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={cn(
          "peer h-14 w-full rounded-2xl border bg-white/[0.04] px-4 pt-5 pb-1.5 text-[15px] text-foreground",
          "placeholder:text-transparent transition-[border-color,box-shadow] duration-200",
          "focus:outline-none focus:border-[var(--accent-active)] focus:shadow-[0_0_0_3px_var(--accent-active-soft)]",
          "[color-scheme:dark]",
          error
            ? "border-destructive/60"
            : "border-white/10 hover:border-white/20"
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-4 text-muted-foreground transition-all duration-200",
          floated
            ? "top-2 text-[10px] uppercase tracking-[0.14em]"
            : "top-1/2 -translate-y-1/2 text-sm"
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
