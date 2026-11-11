"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Aktifkan efek ikon menggambar diri dalam cakupan `ref`:
 * mount → tambah class `draw-ready`; masuk viewport → `.drawn` pada tiap
 * .draw-icon dengan jeda bertingkat. Tanpa JS / reduced-motion: ikon utuh.
 */
export function useDrawIcons(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    root.classList.add("draw-ready");
    const icons = root.querySelectorAll<HTMLElement>(".draw-icon");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          icons.forEach((el, i) => {
            if (!el.style.getPropertyValue("--draw-delay")) {
              el.style.setProperty("--draw-delay", `${i * 70}ms`);
            }
            el.classList.add("drawn");
          });
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [ref]);
}
