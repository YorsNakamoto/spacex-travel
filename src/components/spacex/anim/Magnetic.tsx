"use client";

import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Tombol/elemen magnetik: mengikuti kursor maksimal ±maxShift px,
 * kembali memantul-lembut saat kursor pergi. Hanya aktif pada pointer presisi.
 */
export function Magnetic({
  children,
  maxShift = 8,
  className,
}: {
  children: React.ReactNode;
  maxShift?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: gsap.utils.clamp(-maxShift, maxShift, dx * 0.35),
      y: gsap.utils.clamp(-maxShift, maxShift, dy * 0.35),
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </span>
  );
}
