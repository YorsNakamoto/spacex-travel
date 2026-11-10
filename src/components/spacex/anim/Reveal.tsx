"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { durations, easings, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = "fade" | "up" | "mask";

/**
 * Reveal saat elemen masuk viewport (sekali, sekali jalan).
 * - "fade": opacity saja.
 * - "up": naik + fade.
 * - "mask": slide-up bertopeng overflow-hidden (untuk reveal per baris).
 * Reduced-motion → konten langsung tampil tanpa animasi.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = durations.reveal,
  y = 28,
  className,
  innerClassName,
  as: Tag = "div",
  start = "top 85%",
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  innerClassName?: string;
  as?: "div" | "span" | "p" | "h2" | "h3" | "li";
  start?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const target = variant === "mask" ? innerRef.current : outerRef.current;
      if (!target) return;

      const from: gsap.TweenVars =
        variant === "fade"
          ? { autoAlpha: 0 }
          : variant === "mask"
            ? { yPercent: 115 }
            : { autoAlpha: 0, y };

      gsap.from(target, {
        ...from,
        duration,
        delay,
        ease: variant === "mask" ? easings.inOutGsap : easings.outGsap,
        scrollTrigger: { trigger: outerRef.current, start, once: true },
      });
    },
    { scope: outerRef }
  );

  const Component = Tag as "div";

  if (variant === "mask") {
    return (
      <Component ref={outerRef} className={cn("block overflow-hidden", className)}>
        <div ref={innerRef} className={cn("will-change-transform", innerClassName)}>
          {children}
        </div>
      </Component>
    );
  }

  return (
    <Component ref={outerRef} className={className}>
      {children}
    </Component>
  );
}
