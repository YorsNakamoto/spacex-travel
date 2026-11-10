"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { durations, easings, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Angka berhitung naik saat masuk viewport, format id-ID, tabular numerals.
 * Reduced-motion → tampil nilai akhir langsung.
 */
export function CountUp({
  value,
  duration = durations.hero,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalText = `${prefix}${value.toLocaleString("id-ID")}${suffix}`;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      if (!el) return;

      const state = { n: 0 };
      const fmt = (n: number) => `${prefix}${Math.round(n).toLocaleString("id-ID")}${suffix}`;
      gsap.to(state, {
        n: value,
        duration,
        ease: easings.outGsap,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = fmt(state.n);
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {finalText}
    </span>
  );
}
