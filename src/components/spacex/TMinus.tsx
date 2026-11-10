"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/** Hitung sisa waktu T-minus ke tanggal peluncuran berikutnya. */
function timeLeft(): { d: number; h: number; m: number; s: number; past: boolean } {
  const diff = new Date(siteConfig.nextLaunchDate).getTime() - Date.now();
  const clamped = Math.max(0, diff);
  return {
    d: Math.floor(clamped / 86_400_000),
    h: Math.floor(clamped / 3_600_000) % 24,
    m: Math.floor(clamped / 60_000) % 60,
    s: Math.floor(clamped / 1_000) % 60,
    past: diff <= 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Countdown T-minus real-time (hari : jam : menit : detik) ke
 * siteConfig.nextLaunchDate. Digit tabular agar stabil; label Indonesia.
 */
export function TMinus({ className }: { className?: string }) {
  const [t, setT] = useState<ReturnType<typeof timeLeft> | null>(null);

  useEffect(() => {
    const tick = () => setT(timeLeft());
    const raf = requestAnimationFrame(tick); // nilai awal setelah paint (hindari mismatch SSR)
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  // Render stabil SSR (hindari mismatch): tampil "—" sampai terpasang di client
  const cells = t
    ? [
        { v: String(t.d), l: "hari" },
        { v: pad(t.h), l: "jam" },
        { v: pad(t.m), l: "menit" },
        { v: pad(t.s), l: "detik" },
      ]
    : [
        { v: "–", l: "hari" },
        { v: "–", l: "jam" },
        { v: "–", l: "menit" },
        { v: "–", l: "detik" },
      ];

  return (
    <div className={className} role="timer" aria-label="Hitung mundur peluncuran berikutnya">
      <p className="font-hud mb-1.5 text-[9px] text-muted-foreground">
        {t?.past ? "Jendela peluncuran terbuka" : "T-minus menuju peluncuran"}
      </p>
      <div className="flex items-baseline gap-1" aria-hidden="true">
        {cells.map((c, i) => (
          <span key={c.l} className="flex items-baseline">
            <span className="font-heading tnum text-xl font-semibold text-foreground sm:text-2xl">
              {c.v}
            </span>
            <span className="ml-0.5 text-[10px] text-muted-foreground">{c.l}</span>
            {i < cells.length - 1 && (
              <span className="mx-1.5 text-muted-foreground/50">:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
