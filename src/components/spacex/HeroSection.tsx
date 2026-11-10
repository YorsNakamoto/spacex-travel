"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { StarfieldCanvas } from "./canvas/StarfieldCanvas";
import { TMinus } from "./TMinus";
import { Magnetic } from "./anim/Magnetic";
import { CountUp } from "./anim/CountUp";
import { GlassCard } from "./primitives/GlassCard";
import { AccentWord } from "./primitives/AccentWord";
import { siteConfig } from "@/config/site";
import { easings, isLowEndDevice, prefersReducedMotion } from "@/lib/motion";
import { Rocket, ChevronDown } from "lucide-react";
import moonImg from "@/assets/moon.webp";

/** Entri hero: main penuh (event intro-lift) atau langsung (skip/repeat). */
function useHeroEntrance(): boolean {
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);

  useGSAP(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }

    // Intro akan diputar → tunggu momen layer terangkat
    if (document.documentElement.classList.contains("intro-pending")) {
      const go = () => setReady(true);
      window.addEventListener("spx:intro-lift", go, { once: true });
      window.addEventListener("spx:intro-done", go, { once: true });
      return () => {
        window.removeEventListener("spx:intro-lift", go);
        window.removeEventListener("spx:intro-done", go);
      };
    }
    // Intro di-skip pra-hidrasi → masuk seketika
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  });

  return ready;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const ready = useHeroEntrance();

  // Entrance: Bulan naik + glow, lalu eyebrow → kata headline → CTA → statistik
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      gsap.set(
        [
          "[data-hero-moon]",
          "[data-hero-eyebrow]",
          "[data-hero-word]",
          "[data-hero-sub]",
          "[data-hero-cta]",
          "[data-hero-stats]",
          "[data-hero-scroll]",
        ],
        { autoAlpha: 0 }
      );

      const tl = gsap.timeline({ defaults: { ease: easings.outGsap } });
      tl.fromTo(
        "[data-hero-moon]",
        { autoAlpha: 0, y: 90, scale: 1.15 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: easings.inOutGsap },
        0
      )
        .fromTo(
          "[data-hero-eyebrow]",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.25
        )
        .fromTo(
          "[data-hero-word]",
          { autoAlpha: 0, yPercent: 118, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.0,
            ease: easings.inOutGsap,
            stagger: 0.09,
          },
          0.4
        )
        .fromTo("[data-hero-sub]", { y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95)
        .fromTo("[data-hero-cta]", { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.15)
        .fromTo(
          "[data-hero-stats]",
          { y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          1.3
        )
        .to("[data-hero-scroll]", { autoAlpha: 1, duration: 0.8 }, 1.8);

      return () => {
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  // Pre-hide saat intro masih berjalan (agar entrance tak terlihat lebih dulu)
  useGSAP(
    () => {
      if (ready || prefersReducedMotion()) return;
      if (document.documentElement.classList.contains("intro-pending")) {
        gsap.set(
          [
            "[data-hero-moon]",
            "[data-hero-eyebrow]",
            "[data-hero-word]",
            "[data-hero-sub]",
            "[data-hero-cta]",
            "[data-hero-stats]",
            "[data-hero-scroll]",
          ],
          { autoAlpha: 0 }
        );
      }
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  // Parallax mouse halus (≤12px, hanya pointer presisi)
  useGSAP(() => {
    if (prefersReducedMotion() || isLowEndDevice()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      gsap.to(moonRef.current, {
        x: dx * 12,
        y: dy * 12,
        duration: 0.9,
        ease: "power2.out",
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const words = ["Perjalanan", "ke", "dimulai", "di", "sini."];

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="Sambutan SpaceX"
    >
      {/* Latar berlapis */}
      <StarfieldCanvas density={isLowEndDevice() ? 90 : 150} seed={11} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_18%,rgba(56,116,166,0.16),transparent_60%),radial-gradient(70%_60%_at_15%_95%,rgba(17,26,46,0.8),transparent_65%)]"
      />

      {/* Bulan — NASA LROC (domain publik), rim-glow + float sangat pelan */}
      <div
        ref={moonRef}
        data-hero-moon
        aria-hidden="true"
        className="absolute right-[6%] top-[13%] hidden h-64 w-64 will-change-transform md:block lg:right-[9%] lg:top-[15%] lg:h-80 lg:w-80"
      >
        <div className="animate-float-slow relative h-full w-full">
          <div className="animate-moon-glow absolute inset-0 rounded-full" />
          <Image
            src={moonImg}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 0px, 320px"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQABAABABoJZwAAtl3GmeDAADyk3dJnd96jiSD3TgwsZHx3XsNJQTOQnPKstze2tkL4/OBAAA="
            className="rounded-full object-cover [mask-image:radial-gradient(circle,#000_98%,transparent_100%)]"
          />
          {/* Rim light dingin di tepi kiri-atas */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_-18px_-10px_50px_rgba(5,7,13,0.55),inset_10px_8px_36px_rgba(190,220,255,0.2)]" />
        </div>
      </div>

      <div className="container-x relative z-10 pb-28 pt-36">
        <div className="max-w-2xl">
          {/* Eyebrow + live dot + T-minus */}
          <div data-hero-eyebrow>
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur">
              <span className="animate-live-dot h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              <span className="font-hud text-[10px] text-muted-foreground">
                Misi Berikutnya Segera Dimulai
              </span>
            </div>
            <TMinus className="mb-7" />
          </div>

          {/* Headline per kata — "Bulan" aksen serif shimmer */}
          <h1 className="font-heading text-[2.75rem] font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span data-hero-word className="inline-block will-change-transform">
                Perjalanan
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.1em]">
              <span data-hero-word className="inline-block will-change-transform">
                ke&nbsp;
                <AccentWord className="text-[1.08em] leading-none">Bulan</AccentWord>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span data-hero-word className="inline-block will-change-transform">
                dimulai di sini.
              </span>
            </span>
          </h1>

          <p data-hero-sub className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground opacity-0 sm:text-lg">
            {siteConfig.name} menghadirkan jasa travel luar angkasa menuju Bulan dengan dua
            model roket legendaris —{" "}
            <strong className="font-semibold text-foreground">SpaceX Z1150</strong> dan{" "}
            <strong className="font-semibold text-gold-light">SpaceX Special 000</strong>.
            Aman, nyaman, dan berkesan seumur hidup.
          </p>

          {/* CTA */}
          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3.5 opacity-0">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="group relative h-12 overflow-hidden rounded-full px-8 text-base font-semibold shadow-[0_0_36px_-8px_var(--ice)] transition-shadow hover:shadow-[0_0_48px_-6px_var(--ice)]"
              >
                <a href="#pesan">
                  <Rocket
                    className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  Pesan Tiket Sekarang
                  {/* Shine sweep */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
                  />
                </a>
              </Button>
            </Magnetic>

            {/* Ghost + border cahaya berputar */}
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="relative h-12 rounded-full px-8 text-base text-foreground"
            >
              <a href="#harga" className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full p-[1px]"
                >
                  <span
                    className="absolute inset-[-40%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_70%,rgba(125,211,252,0.6)_85%,transparent_100%)]"
                    style={{ animationDuration: "7s" }}
                  />
                  <span className="absolute inset-[1px] rounded-full bg-[#0a0f1c]" />
                </span>
                <span className="relative">Lihat Harga &amp; Roket</span>
              </a>
            </Button>
          </div>

          {/* 3 statistik glass + count-up */}
          <div
            data-hero-stats
            className="mt-14 grid max-w-xl grid-cols-3 gap-3 opacity-0 sm:gap-4"
          >
            {[
              { value: siteConfig.stats.missions, label: "Misi Berhasil", suffix: "" },
              { value: siteConfig.stats.passengers, label: "Penumpang Bahagia", suffix: "" },
              { value: siteConfig.stats.satisfaction, label: "Kepuasan", suffix: "%" },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-4 sm:p-5">
                <p className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-hud mt-1.5 text-[9px] text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Indikator gulir */}
      <a
        data-hero-scroll
        href="#tentang"
        aria-label="Gulir ke bawah"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground opacity-0 transition-colors hover:text-foreground"
      >
        <span className="flex flex-col items-center gap-2">
          <span className="font-hud text-[9px]">Gulir</span>
          <span className="relative h-8 w-px overflow-hidden bg-white/10">
            <span className="animate-scroll-line absolute left-0 top-0 h-3 w-px bg-ice" />
          </span>
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
