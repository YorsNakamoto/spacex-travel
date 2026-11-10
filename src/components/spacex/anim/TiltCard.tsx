"use client";

import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Kartu miring halus mengikuti kursor (maks ±6°), reset lembut saat keluar.
 * Hanya pointer presisi; transform GPU-friendly.
 */
export function TiltCard({
  children,
  maxTilt = 6,
  className,
}: {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotationY: px * maxTilt * 2,
      rotationX: -py * maxTilt * 2,
      transformPerspective: 900,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
