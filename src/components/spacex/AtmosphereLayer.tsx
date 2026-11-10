"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Latar dinamis: satu layer fixed berisi 5 gradasi atmosfer yang bertukar
 * halus mengikuti section (hanya properti opacity — murah di GPU).
 * Peluncuran → Orbit → Ruang dalam → Mendekati Bulan → Pendaratan.
 * Reduced-motion: hanya lapisan pertama yang tampil (statis).
 */
const LAYERS = [
  { id: "beranda", className: "bg-[radial-gradient(120%_90%_at_70%_8%,rgba(56,116,166,0.20),transparent_58%)]" },
  { id: "tentang", className: "bg-[radial-gradient(100%_80%_at_80%_30%,rgba(64,96,150,0.16),transparent_60%)]" },
  { id: "layanan", className: "bg-[radial-gradient(120%_100%_at_20%_60%,rgba(23,32,58,0.9),transparent_65%)]" },
  { id: "tim", className: "bg-[radial-gradient(110%_90%_at_75%_70%,rgba(201,154,59,0.10),transparent_55%)]" },
  { id: "pesan", className: "bg-[radial-gradient(120%_100%_at_50%_100%,rgba(125,211,252,0.10),transparent_60%)]" },
] as const;

export function AtmosphereLayer() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      LAYERS.forEach((layer, i) => {
        const el = document.querySelector<HTMLElement>(`[data-atmo="${layer.id}"]`);
        const section = document.getElementById(layer.id);
        if (!el || !section) return;
        gsap.fromTo(
          el,
          { opacity: i === 0 ? 1 : 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "center 45%",
              scrub: true,
              ...(i > 0 ? {} : {}),
            },
          }
        );
        // pudarkan layer sebelumnya saat keluar
        if (i > 0) {
          const prev = LAYERS[i - 1];
          const prevEl = document.querySelector<HTMLElement>(`[data-atmo="${prev.id}"]`);
          if (prevEl) {
            gsap.to(prevEl, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "center 45%",
                scrub: true,
              },
            });
          }
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      {LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          data-atmo={layer.id}
          className={`absolute inset-0 transition-none ${layer.className}`}
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
