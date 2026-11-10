"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenisInstance, getLenis } from "@/lib/lenis-singleton";
import { NAV_SCROLL_OFFSET, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll (Lenis) yang disinkronkan ke ticker GSAP sehingga
 * ScrollTrigger mengikuti posisi scroll Lenis dengan presisi.
 * - Nonaktif pada prefers-reduced-motion (scroll native + CSS smooth).
 * - Klik anchor #section di-animasikan via lenis.scrollTo (offset navbar,
 *   easing ±1,2s) tanpa mengganggu handler klik lain (mis. pre-select model).
 * - Touch device tetap memakai scroll native (syncTouch false default).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    setLenisInstance(lenis);

    // Tandai html agar CSS scroll-behavior:smooth tidak bertabrakan
    document.documentElement.classList.add("lenis-active");

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // Anchor smooth-scroll dengan offset navbar
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      getLenis()?.scrollTo(target as HTMLElement, {
        offset: -NAV_SCROLL_OFFSET,
        duration: 1.2,
      });
      // Anchor tetap tercatat di URL agar bisa dibagikan
      window.history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      document.documentElement.classList.remove("lenis-active");
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
