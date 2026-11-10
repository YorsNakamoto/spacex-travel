"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { easings, prefersReducedMotion, stagger } from "@/lib/motion";
import { AccentWord } from "./primitives/AccentWord";

gsap.registerPlugin(ScrollTrigger);

/**
 * Kepala section seragam: eyebrow HUD + judul reveal per kata (bertopeng)
 * dengan dukungan satu kata aksen serif + deskripsi fade.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  /** Satu kata dalam `title` yang diberi gaya serif italic shimmer. */
  accentWord,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  accentWord?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = rootRef.current?.querySelectorAll<HTMLElement>("[data-sh-word]");
      const eyebrowEl = rootRef.current?.querySelector<HTMLElement>("[data-sh-eyebrow]");
      const descEl = rootRef.current?.querySelector<HTMLElement>("[data-sh-desc]");
      if (!words?.length) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
      });
      tl.fromTo(
        words,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: easings.inOutGsap,
          stagger: stagger.tight,
        }
      );
      if (eyebrowEl) tl.fromTo(eyebrowEl, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0);
      if (descEl) tl.fromTo(descEl, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.35);
    },
    { scope: rootRef }
  );

  const renderTitle = () => {
    const words = title.split(/\s+/).filter(Boolean);
    return words.map((word, i) => {
      const clean = word.replace(/[.,!?]/g, "");
      const isAccent = accentWord && clean.toLowerCase() === accentWord.toLowerCase();
      return (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom"
        >
          <span data-sh-word className="inline-block will-change-transform">
            {isAccent ? (
              <AccentWord className="text-[1.06em]">{word}</AccentWord>
            ) : (
              word
            )}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      );
    });
  };

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-4", alignClass, className)}>
      <span
        data-sh-eyebrow
        className="font-hud inline-flex items-center gap-2.5 text-[10px] text-ice"
      >
        <span className="h-px w-6 bg-ice/40" aria-hidden="true" />
        {eyebrow}
        {align === "center" && <span className="h-px w-6 bg-ice/40" aria-hidden="true" />}
      </span>
      <h2 className="font-heading max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
        {renderTitle()}
      </h2>
      {description && (
        <p data-sh-desc className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
