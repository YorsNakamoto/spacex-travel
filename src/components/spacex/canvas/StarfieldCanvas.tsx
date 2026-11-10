"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { isLowEndDevice, prefersReducedMotion } from "@/lib/motion";

/**
 * Latar bintang canvas 2D — 3 kedalaman (parallax drift pelan + kedip halus).
 * - PRNG berbibit: bintang dibuat SETELAH mount (tanpa hydration mismatch).
 * - Hemat: berhenti rAF saat tab tersembunyi / keluar viewport (IntersectionObserver).
 * - DPR dibatasi 1.75; perangkat low-end → jumlah bintang & trail dikurangi.
 * - Reduced-motion / tanpa canvas: render statis satu frame (fallback tetap indah).
 */
export function StarfieldCanvas({
  className,
  density = 150,
  seed = 42,
}: {
  className?: string;
  /** Jumlah bintang dasar (dipangkas otomatis di perangkat low-end). */
  density?: number;
  seed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const lowEnd = isLowEndDevice();
    const count = Math.round(density * (lowEnd ? 0.55 : 1) * (reduced ? 0.7 : 1));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    // PRNG berbibit
    let s = seed;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    type Star = { x: number; y: number; r: number; depth: number; phase: number; speed: number };
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s = seed; // reset bibit agar layout konsisten antar resize
      stars = Array.from({ length: count }, () => {
        const depth = rand(); // 0 = jauh, 1 = dekat
        return {
          x: rand() * w,
          y: rand() * h,
          r: 0.4 + depth * 1.5,
          depth,
          phase: rand() * Math.PI * 2,
          speed: 0.5 + rand() * 1.2,
        };
      });
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        const tw = 0.55 + 0.45 * Math.sin(star.phase + performance.now() * 0.0004 * star.speed);
        ctx.globalAlpha = 0.25 + star.depth * 0.6 * tw;
        ctx.fillStyle = "#eaf2ff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    build();

    if (reduced) {
      drawStatic();
    } else {
      let raf = 0;
      let running = true;
      let visible = true;
      const drift = (t: number) => {
        if (!running) return;
        if (visible) {
          ctx.clearRect(0, 0, w, h);
          for (const star of stars) {
            // drift pelan ke bawah (roket "naik" → bintang turun), kecepatan ~ kedalaman
            star.y += 0.012 * (0.3 + star.depth);
            if (star.y > h + 2) star.y = -2;
            const tw = 0.55 + 0.45 * Math.sin(star.phase + t * 0.0004 * star.speed);
            ctx.globalAlpha = 0.25 + star.depth * 0.6 * tw;
            ctx.fillStyle = "#eaf2ff";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        raf = requestAnimationFrame(drift);
      };
      raf = requestAnimationFrame(drift);

      const onVisibility = () => {
        visible = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVisibility);

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && document.visibilityState === "visible";
      });
      io.observe(canvas);

      const onResize = () => build();
      window.addEventListener("resize", onResize);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        io.disconnect();
      };
    }
  }, [density, seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
