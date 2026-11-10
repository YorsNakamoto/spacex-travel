"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./anim/SpotlightCard";
import { CountUp } from "./anim/CountUp";
import { siteConfig, formatIDNumber } from "@/config/site";
import { prefersReducedMotion } from "@/lib/motion";
import { ShieldCheck, Clock, Users, HeartHandshake } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: ShieldCheck,
    title: "Keselamatan Terjamin",
    description: `Setiap roket melewati ${siteConfig.stats.systemChecks} tahap pemeriksaan sebelum dinyatakan siap meluncur. Keselamatan penumpang adalah hal nomor satu bagi kami.`,
    span: "lg:col-span-2",
  },
  {
    icon: Clock,
    title: "Jadwal Tepat Waktu",
    description:
      "Jendela peluncuran dihitung dengan presisi orbit tinggi sehingga Anda tiba di Bulan sesuai rencana, tanpa penundaan berarti.",
    span: "",
  },
  {
    icon: Users,
    title: "Tim Profesional",
    description:
      "Dipimpin owner, direktur, asisten direktur, dan CEO berpengalaman, didukung staf yang siap melayani setiap kebutuhan Anda.",
    span: "",
  },
  {
    icon: HeartHandshake,
    title: "Pelayanan Sepanjang Perjalanan",
    description:
      "Mulai dari pelatihan pra-penerbangan hingga kembali ke Bumi — kami mendampingi Anda pada setiap langkah misi.",
    span: "lg:col-span-2",
  },
] as const;

export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);

  // Ikon menggambar diri: tandai siap setelah mount, picu .drawn saat masuk viewport
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    root.classList.add("draw-ready");
    const icons = root.querySelectorAll<HTMLElement>(".draw-icon");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          icons.forEach((el, i) => {
            el.style.setProperty("--draw-delay", `${i * 90}ms`);
            el.classList.add("drawn");
          });
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // Ring hijau "0 insiden" berdenyut sekali saat masuk viewport
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const ring = rootRef.current?.querySelector("[data-incident-ring]");
      if (!ring) return;
      gsap.fromTo(
        ring,
        { scale: 0.55, opacity: 0.9 },
        {
          scale: 1.5,
          opacity: 0,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: ring, start: "top 85%", once: true },
        }
      );
    },
    { scope: rootRef }
  );

  const years = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <section
      id="tentang"
      ref={rootRef}
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Tentang SpaceX"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Tentang Kami"
          title="Perusahaan travel luar angkasa pertama yang memikirkan Anda"
          description={`Sejak ${siteConfig.foundedYear}, ${siteConfig.name} berdedikasi mengubah mimpi manusia melihat Bulan dari dekat menjadi kenyataan — dengan cara yang aman, terjangkau, dan tak terlupakan.`}
          align="left"
          accentWord="Bulan"
        />

        {/* Statistik — count-up + garis Bumi → Bulan */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Tahun */}
          <div className="glass-card p-6">
            <p className="font-heading tnum text-3xl font-bold text-foreground sm:text-4xl">
              <CountUp value={years} suffix="+" />
            </p>
            <p className="font-hud mt-2 text-[9px] text-muted-foreground">Tahun Beroperasi</p>
          </div>

          {/* Misi */}
          <div className="glass-card p-6">
            <p className="font-heading tnum text-3xl font-bold text-foreground sm:text-4xl">
              <CountUp value={siteConfig.stats.missions} />
            </p>
            <p className="font-hud mt-2 text-[9px] text-muted-foreground">Misi Berhasil</p>
          </div>

          {/* Jarak dengan garis Bumi → Bulan bertitik berjalan */}
          <div className="glass-card col-span-2 p-6">
            <p className="font-heading tnum text-3xl font-bold text-foreground sm:text-4xl">
              <CountUp value={siteConfig.stats.distanceKm} />{" "}
              <span className="text-base font-medium text-muted-foreground">km</span>
            </p>
            <p className="font-hud mt-2 text-[9px] text-muted-foreground">
              Jarak Bumi — Bulan per Misi
            </p>
            <svg
              viewBox="0 0 320 40"
              className="mt-4 w-full"
              aria-hidden="true"
              role="presentation"
            >
              {/* Orbit elips tipis */}
              <path
                d="M14 30 Q 160 -6 306 30"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
              {/* Bumi */}
              <circle cx="14" cy="30" r="6" fill="#2563eb" opacity="0.9" />
              <circle cx="14" cy="30" r="9" fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="1" />
              {/* Bulan */}
              <circle cx="306" cy="30" r="5" fill="#cbd5e1" />
              {/* Titik roket berjalan sepanjang lintasan (SMIL) */}
              <circle className="animate-orbit-dot" r="2.5" fill="var(--ice)">
                <animateMotion
                  dur="7s"
                  repeatCount="indefinite"
                  path="M14 30 Q 160 -6 306 30"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
            </svg>
          </div>

          {/* 0 insiden + ring hijau berdenyut sekali */}
          <div className="glass-card relative col-span-2 overflow-hidden p-6 lg:col-span-2">
            <span
              data-incident-ring
              aria-hidden="true"
              className="absolute right-6 top-6 h-10 w-10 rounded-full border-2 border-success/60 opacity-0"
            />
            <p className="font-heading tnum text-3xl font-bold text-success sm:text-4xl">
              <CountUp value={siteConfig.stats.incidents} />
            </p>
            <p className="font-hud mt-2 text-[9px] text-muted-foreground">
              Insiden Keselamatan Sejak {siteConfig.foundedYear}
            </p>
          </div>
        </div>

        {/* 4 keunggulan — grid bento + SpotlightCard + ikon menggambar diri */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <SpotlightCard
                key={value.title}
                className={`p-6 ${value.span}`}
                color="rgba(125, 211, 252, 0.06)"
              >
                <span className="draw-icon mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-ice/[0.07]">
                  <Icon className="h-5 w-5 text-ice" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
