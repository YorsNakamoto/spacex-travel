"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Starfield } from "./Starfield";
import { RocketIllustration } from "./RocketIllustration";
import { Rocket, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 2 + i * 0.14, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="Sambutan SpaceX"
    >
      {/* Latar angkasa */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,oklch(0.25_0.09_290/0.55),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_90%,oklch(0.2_0.06_300/0.4),transparent_55%)]" />
      <Starfield density={110} seed={11} className="z-0" />

      {/* Bulan */}
      <motion.div
        aria-hidden="true"
        className="absolute right-[8%] top-[16%] hidden h-36 w-36 rounded-full md:block lg:h-44 lg:w-44"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 2.4, ease: "easeOut" }}
      >
        <div className="animate-moon-glow relative h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4f4f8,#c9c9d8_45%,#8f8fa8_75%,#6a6a85)]">
          {/* Kawah bulan */}
          <span className="absolute left-[22%] top-[30%] h-4 w-4 rounded-full bg-[#b4b4c6] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[55%] top-[52%] h-6 w-6 rounded-full bg-[#a9a9bd] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)]" />
          <span className="absolute left-[38%] top-[68%] h-3 w-3 rounded-full bg-[#bcbccd] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[64%] top-[24%] h-3 w-3 rounded-full bg-[#b0b0c3] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.25)]" />
        </div>
      </motion.div>

      {/* Roket melayang */}
      <motion.div
        aria-hidden="true"
        className="animate-float absolute bottom-[10%] right-[14%] hidden opacity-0 md:block"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.7, ease: "easeOut" }}
      >
        <RocketIllustration variant="hero" flame className="h-44 w-auto drop-shadow-[0_0_35px_rgba(167,139,250,0.35)]" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <div className="max-w-2xl">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-twinkle rounded-full bg-primary" style={{ ["--tw-duration" as string]: "2s" }} />
              Misi Berikutnya Segera Dimulai
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-heading mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Perjalanan
            <span className="text-glow block bg-gradient-to-r from-[#c4b5fd] via-[#e9d5ff] to-[#a78bfa] bg-clip-text text-transparent">
              ke Bulan
            </span>
            <span className="block">dimulai di sini.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            SpaceX menghadirkan jasa travel luar angkasa menuju Bulan dengan dua
            model roket legendaris — <strong className="font-semibold text-foreground">SpaceX Z1150</strong> dan{" "}
            <strong className="font-semibold text-[var(--gold-light)]">SpaceX Special 000</strong>.
            Aman, nyaman, dan berkesan seumur hidup.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-8 text-base font-semibold shadow-[0_0_36px_-8px_var(--primary)] transition-all hover:shadow-[0_0_48px_-6px_var(--primary)]"
            >
              <a href="#pesan">
                <Rocket className="mr-2 h-5 w-5" aria-hidden="true" />
                Pesan Tiket Sekarang
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/15 bg-white/5 px-8 text-base backdrop-blur hover:border-primary/40 hover:bg-white/10"
            >
              <a href="#harga">Lihat Harga &amp; Roket</a>
            </Button>
          </motion.div>

          {/* Statistik mini */}
          <motion.dl
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-14 grid max-w-lg grid-cols-3 gap-6"
          >
            {[
              { value: "12+", label: "Misi Berhasil" },
              { value: "48", label: "Penumpang Bahagia" },
              { value: "98%", label: "Kepuasan" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="order-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-heading order-1 text-2xl font-semibold text-foreground sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Indikator gulir */}
      <motion.a
        href="#tentang"
        aria-label="Gulir ke bawah"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
      >
        <motion.span
          className="flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.25em]"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Gulir
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
