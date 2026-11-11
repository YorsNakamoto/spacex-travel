"use client";

import { useRef } from "react";
import gsap from "gsap";
import { siteConfig } from "@/config/site";

/**
 * Marquee tipis antar section — berulang tanpa jeda.
 * Kecepatan bereaksi terhadap kecepatan scroll (gsap.ticker menghitung
 * delta scroll → timeScale halus). Reduced-motion: statis (tanpa animasi).
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  const items = [...siteConfig.marqueeItems, ...siteConfig.marqueeItems, ...siteConfig.marqueeItems];

  const onPointerEnter = () => {
    if (prefersReduced()) return;
    gsap.to(trackRef.current, { timeScale: 0.35, duration: 0.4 });
  };
  const onPointerLeave = () => {
    if (prefersReduced()) return;
    gsap.to(trackRef.current, { timeScale: 1, duration: 0.4 });
  };

  // Kecepatan scroll → timeScale (1 = dasar, hingga ~3 saat cepat)
  const onScroll = () => {
    const track = trackRef.current;
    if (!track || prefersReduced()) return;
    const y = window.scrollY;
    const velocity = Math.min(Math.abs(y - lastY.current) / 60, 2.4);
    lastY.current = y;
    gsap.to(track, { timeScale: 1 + velocity, duration: 0.5, overwrite: "auto" });
  };

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/[0.07] bg-white/[0.015] py-3"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onScrollCapture={onScroll}
    >
      <div
        ref={trackRef}
        className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap pr-8"
        style={{ ["--marquee-duration" as string]: "30s" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-hud text-[10px] text-muted-foreground/80">{item}</span>
            <span className="h-1 w-1 rounded-full bg-ice/50" />
          </span>
        ))}
      </div>
      {/* Fade tepi */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#05070d] to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#05070d] to-transparent" />
    </div>
  );
}

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
