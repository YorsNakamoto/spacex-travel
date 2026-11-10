"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Kartu kaca dengan sorotan radial mengikuti kursor (highlight halus).
 * Posisi disalurkan lewat CSS var --spotlight-x/y — hanya properti gaya,
 * tanpa re-render. Non-pointer device: sorotan tetap statis redup.
 */
export function SpotlightCard({
  children,
  className,
  size = 560,
  color = "rgba(125, 211, 252, 0.07)",
}: {
  children: React.ReactNode;
  className?: string;
  /** Diameter sorotan (px). */
  size?: number;
  /** Warna radial sorotan. */
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn("glass-card group/spot relative overflow-hidden", className)}
      style={{ "--spotlight-x": "50%", "--spotlight-y": "50%" } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--spotlight-x) var(--spotlight-y), ${color}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
