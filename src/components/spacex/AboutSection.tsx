"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";
import { Starfield } from "./Starfield";
import { siteConfig, formatIDNumber } from "@/config/site";
import { ShieldCheck, Clock, Users, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Keselamatan Terjamin",
    description:
      `Setiap roket melewati ${siteConfig.stats.systemChecks} tahap pemeriksaan sebelum dinyatakan siap meluncur. Keselamatan penumpang adalah hal nomor satu bagi kami.`,
  },
  {
    icon: Clock,
    title: "Jadwal Tepat Waktu",
    description:
      "Jendela peluncuran dihitung dengan presisi orbit tinggi sehingga Anda tiba di Bulan sesuai rencana, tanpa penundaan berarti.",
  },
  {
    icon: Users,
    title: "Tim Profesional",
    description:
      "Dipimpin owner, direktur, asisten direktur, dan CEO berpengalaman, didukung staf yang siap melayani setiap kebutuhan Anda.",
  },
  {
    icon: HeartHandshake,
    title: "Pelayanan Sepanjang Perjalanan",
    description:
      "Mulai dari pelatihan pra-penerbangan hingga kembali ke Bumi — kami mendampingi Anda pada setiap langkah misi.",
  },
] as const;

/** Statistik dari satu sumber data: siteConfig.stats. */
const stats = [
  { value: `${new Date().getFullYear() - siteConfig.foundedYear}+`, label: "Tahun Beroperasi" },
  { value: `${siteConfig.stats.missions}`, label: "Misi Berhasil" },
  { value: `${formatIDNumber(siteConfig.stats.distanceKm)} km`, label: "Jarak Ditempuh per Misi" },
  { value: `${siteConfig.stats.incidents}`, label: "Insiden Keselamatan" },
];

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Tentang SpaceX"
    >
      <Starfield density={40} seed={77} className="opacity-60" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tentang Kami"
          title="Perusahaan travel luar angkasa pertama yang memikirkan Anda"
          description={`Sejak ${siteConfig.foundedYear}, SpaceX berdedikasi mengubah mimpi manusia melihat Bulan dari dekat menjadi kenyataan — dengan cara yang aman, terjangkau, dan tak terlupakan.`}
        />

        {/* Statistik */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur transition-colors hover:border-primary/30"
            >
              <dd className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>

        {/* Nilai perusahaan */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="h-full rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-16px_var(--primary)]">
                  <CardContent className="flex gap-4 p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-semibold">{value.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
