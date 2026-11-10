"use client";

import { useMemo } from "react";

/**
 * Latar bintang dengan efek kedip dan bintang jatuh.
 * Menggunakan PRNG berbibit agar hasil render server & client identik
 * (mencegah hydration mismatch).
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
};

type ShootingStar = {
  left: string;
  top: string;
  delay: string;
  duration: string;
};

export function Starfield({
  density = 90,
  shooting = 2,
  seed = 42,
  className = "",
}: {
  density?: number;
  shooting?: number;
  seed?: number;
  className?: string;
}) {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: density }, () => ({
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      size: 1 + rand() * 1.8,
      duration: `${(2.2 + rand() * 3.5).toFixed(2)}s`,
      delay: `${(rand() * 5).toFixed(2)}s`,
      opacity: 0.35 + rand() * 0.6,
    }));
  }, [density, seed]);

  const shootingStars = useMemo<ShootingStar[]>(() => {
    const rand = mulberry32(seed + 7);
    return Array.from({ length: shooting }, (_, i) => ({
      left: `${(55 + rand() * 40).toFixed(2)}%`,
      top: `${(rand() * 35).toFixed(2)}%`,
      delay: `${(i * 4 + rand() * 3).toFixed(2)}s`,
      duration: `${(8 + rand() * 4).toFixed(2)}s`,
    }));
  }, [shooting, seed]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((star, i) => (
        <span
          key={`star-${i}`}
          className="animate-twinkle absolute rounded-full bg-[var(--star)]"
          style={
            {
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              "--tw-duration": star.duration,
              "--tw-delay": star.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {shootingStars.map((s, i) => (
        <span
          key={`shooting-${i}`}
          className="animate-shooting absolute h-px w-24 -translate-y-full"
          style={
            {
              left: s.left,
              top: s.top,
              background:
                "linear-gradient(to left, oklch(0.96 0.01 280 / 90%), transparent)",
              transformOrigin: "right center",
              "--sh-delay": s.delay,
              "--sh-duration": s.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
