"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rocket } from "lucide-react";
import { siteConfig, formatIDNumber } from "@/config/site";
import { getLenis } from "@/lib/lenis-singleton";
import { NAV_SCROLL_OFFSET } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Peta section → fase perjalanan Bumi → Bulan. */
const PHASES = [
  { id: "beranda", label: "Peluncuran" },
  { id: "tentang", label: "Orbit" },
  { id: "layanan", label: "Transit" },
  { id: "tim", label: "Mendekati Bulan" },
  { id: "harga", label: "Mendekati Bulan" },
  { id: "pesan", label: "Pendaratan" },
] as const;

/**
 * Mission HUD — mengubah progres scroll menjadi perjalanan Bumi → Bulan.
 * Desktop (≥1280px): rel tipis di tepi kanan — odometer km 0 → 384.400,
 * label fase aktif, titik per section (klik untuk lompat), penanda roket mini.
 * Mobile: progress bar tipis di atas + label fase kecil.
 */
export function MissionHUD() {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => setProgress(self.progress),
    });

    const observers: IntersectionObserver[] = [];
    PHASES.forEach((phase, i) => {
      const el = document.getElementById(phase.id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-40% 0px -45% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => {
      st.kill();
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const km = Math.round(progress * siteConfig.stats.distanceKm);
  const phase = PHASES[activeIndex];

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -NAV_SCROLL_OFFSET, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: progress bar tipis + label fase */}
      <div
        className="pointer-events-none fixed inset-x-0 top-16 z-30 xl:hidden"
        aria-hidden="true"
      >
        <div className="h-px w-full bg-white/10">
          <div
            ref={barRef}
            className="h-px bg-gradient-to-r from-ice-deep to-ice transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="font-hud mt-1.5 pl-4 text-[8px] text-muted-foreground">
          {formatIDNumber(km)} km · {phase.label}
        </p>
      </div>

      {/* Desktop: rel kanan */}
      <nav
        aria-label="Progres perjalanan"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
      >
        <p className="font-hud text-[8px] text-muted-foreground [writing-mode:vertical-rl]">
          {formatIDNumber(km)} km
        </p>
        <div className="relative flex flex-col items-center">
          {/* Jalur */}
          <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/10" />
          <span
            className="absolute left-1/2 top-2 w-px -translate-x-1/2 bg-gradient-to-b from-ice-deep to-ice"
            style={{ height: `calc(${progress * 100}% - 8px)`, maxHeight: "calc(100% - 16px)" }}
          />
          {/* Penanda roket mini pada posisi progres */}
          <Rocket
            className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 text-ice transition-all duration-150"
            style={{ top: `calc(${progress * 100}% - 7px)` }}
            aria-hidden="true"
          />
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => jump(p.id)}
              aria-label={`Lompat ke bagian ${p.label}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className="group relative z-10 my-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors"
              style={{
                borderColor: i <= activeIndex ? "var(--ice)" : "rgba(255,255,255,0.2)",
                background: i === activeIndex ? "var(--ice)" : "#0a0f1c",
              }}
            >
              <span className="font-hud pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {p.label}
              </span>
            </button>
          ))}
        </div>
        <p className="font-hud text-[8px] text-muted-foreground [writing-mode:vertical-rl]">
          {phase.label}
        </p>
      </nav>
    </>
  );
}
