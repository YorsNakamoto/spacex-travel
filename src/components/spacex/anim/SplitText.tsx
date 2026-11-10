"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { durations, easings, prefersReducedMotion, stagger } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Teks terpecah per kata dengan mask (overflow-hidden) — slide-up + blur-to-sharp.
 * mode "scroll": beranimasi saat masuk viewport; mode "mount": langsung saat
 * komponen terpasang (dipakai hero setelah intro, dikendalikan delay).
 * Reduced-motion → teks tampil utuh tanpa animasi.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  staggerTime = stagger.base,
  duration = durations.hero,
  mode = "scroll",
  blur = true,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  staggerTime?: number;
  duration?: number;
  mode?: "scroll" | "mount";
  /** Blur-to-sharp pada tiap kata. */
  blur?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = rootRef.current?.querySelectorAll<HTMLElement>("[data-word-inner]");
      if (!words?.length) return;

      const vars: gsap.TweenVars = {
        yPercent: 0,
        filter: "blur(0px)",
        duration,
        delay,
        ease: easings.inOutGsap,
        stagger: staggerTime,
      };
      if (mode === "scroll") {
        vars.scrollTrigger = { trigger: rootRef.current, start: "top 88%", once: true };
      }
      gsap.fromTo(
        words,
        { yPercent: 118, filter: blur ? "blur(8px)" : "blur(0px)" },
        vars
      );
    },
    { scope: rootRef }
  );

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={rootRef as never} className={cn(className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <span data-word-inner className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
