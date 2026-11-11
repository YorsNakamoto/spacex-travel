"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rocket, Mail, MessageCircle, MapPin, ArrowUp } from "lucide-react";
import { siteConfig, whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/config/site";
import { getLenis } from "@/lib/lenis-singleton";
import { NAV_SCROLL_OFFSET, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer "Earthrise" — siluet horizon Bulan dengan Bumi kecil terbit pelan
 * (parallax), wordmark SPACEX raksasa outline yang terisi mengikuti scroll,
 * link underline-slide, dan tombol roket kembali ke atas.
 */
export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // Wordmark outline → terisi mengikuti progres scroll melewati footer
  useGSAP(
    () => {
      if (prefersReducedMotion() || !fillRef.current) return;
      gsap.fromTo(
        fillRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );
      // Earthrise: Bumi kecil naik pelan (parallax ringan)
      gsap.fromTo(
        "[data-earthrise]",
        { yPercent: 55 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
          },
        }
      );
    },
    { scope: rootRef }
  );

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#070b14]"
      aria-label="Footer SpaceX"
    >
      {/* Horizon Bulan + Bumi terbit */}
      <svg
        viewBox="0 0 1440 220"
        className="pointer-events-none absolute -top-1 left-0 w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="earthGlow" cx="0.5" cy="0.75" r="0.8">
            <stop offset="0" stopColor="#2563eb" stopOpacity="0.55" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Bumi kecil terbit di balik horizon */}
        <g data-earthrise>
          <circle cx="720" cy="150" r="46" fill="url(#earthGlow)" />
          <circle cx="720" cy="150" r="26" fill="#1d4ed8" />
          <circle cx="712" cy="143" r="7" fill="#38bdf8" opacity="0.7" />
          <circle cx="728" cy="155" r="5" fill="#4ade80" opacity="0.6" />
        </g>
        {/* Siluet permukaan Bulan (kawah) */}
        <path
          d="M0 118 C 240 96 380 128 560 116 C 700 108 760 96 900 110 C 1080 128 1220 100 1440 120 L 1440 220 L 0 220 Z"
          fill="#0d1322"
        />
        <ellipse cx="240" cy="140" rx="26" ry="7" fill="#111a2e" />
        <ellipse cx="1120" cy="150" rx="32" ry="8" fill="#111a2e" />
        <ellipse cx="620" cy="136" rx="16" ry="5" fill="#131d33" />
        {/* Rim glow horizon */}
        <path
          d="M0 118 C 240 96 380 128 560 116 C 700 108 760 96 900 110 C 1080 128 1220 100 1440 120"
          fill="none"
          stroke="rgba(174,183,199,0.28)"
          strokeWidth="1"
        />
      </svg>

      <div className="container-x relative pt-56">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#beranda" className="flex items-center gap-2.5" aria-label={siteConfig.name}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Rocket className="h-4 w-4 text-ice" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-semibold tracking-[0.32em]">
                {siteConfig.wordmark}
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <p className="font-hud text-[10px] text-muted-foreground">Navigasi</p>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-slide text-sm text-foreground/80 transition-colors hover:text-ice"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <p className="font-hud text-[10px] text-muted-foreground">Hubungi Kami</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-slide flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-ice"
                >
                  <Mail className="h-4 w-4 text-ice" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-slide flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-[oklch(0.78_0.15_155)]"
                >
                  <MessageCircle
                    className="h-4 w-4 text-[oklch(0.72_0.16_155)]"
                    aria-hidden="true"
                  />
                  {siteConfig.whatsappDisplay} (WhatsApp Admin)
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-foreground/80">
                <MapPin className="h-4 w-4 text-ice" aria-hidden="true" />
                Kosmodrom SpaceX, Bumi — menuju Bulan
              </li>
            </ul>
          </div>
        </div>

        {/* Wordmark raksasa outline → terisi */}
        <div className="relative mt-14 select-none overflow-hidden" aria-hidden="true">
          <p className="footer-wordmark font-heading text-center text-[16vw] font-extrabold leading-[0.9] tracking-[0.08em] lg:text-[11rem]">
            {siteConfig.wordmark}
          </p>
          <span
            ref={fillRef}
            className="footer-wordmark-fill font-heading absolute inset-0 text-center text-[16vw] font-extrabold leading-[0.9] tracking-[0.08em] lg:text-[11rem]"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            {siteConfig.wordmark}
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} Travel. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1.5">
              Dibuat dengan penuh mimpi di Bumi
              <Rocket className="h-3.5 w-3.5 text-ice" aria-hidden="true" />
            </p>
            {/* Tombol roket ke atas */}
            <button
              type="button"
              onClick={toTop}
              aria-label="Kembali ke atas"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all hover:border-ice/40 hover:bg-ice/10"
            >
              <Rocket
                className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-ice"
                aria-hidden="true"
              />
              <ArrowUp className="sr-only" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
