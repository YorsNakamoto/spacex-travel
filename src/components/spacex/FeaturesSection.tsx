"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";
import {
  Rocket,
  GraduationCap,
  UtensilsCrossed,
  Camera,
  ShieldCheck,
  Satellite,
} from "lucide-react";

const services = [
  {
    icon: Rocket,
    title: "Peluncuran Terjadwal",
    description:
      "Pilih tanggal keberangkatan sesuai jendela orbit terbaik. Kami menjaga presisi waktu pada setiap misi.",
  },
  {
    icon: GraduationCap,
    title: "Pelatihan Astronot",
    description:
      "Program pelatihan pra-penerbangan singkat agar Anda siap menikmati perjalanan dengan aman dan percaya diri.",
  },
  {
    icon: UtensilsCrossed,
    title: "Kuliner Angkasa",
    description:
      "Menu makanan khas astronot yang dirancang chef — bergizi, lezat, dan dikemas untuk gravitasi nol.",
  },
  {
    icon: Camera,
    title: "Dokumentasi Misi",
    description:
      "Foto dan video profesional di permukaan Bulan sebagai kenang-kenangan yang tidak akan pernah terlupakan.",
  },
  {
    icon: ShieldCheck,
    title: "Asuransi Perjalanan",
    description:
      "Setiap tiket telah termasuk perlindungan asuransi penerbangan luar angkasa kelas premium.",
  },
  {
    icon: Satellite,
    title: "Komunikasi ke Bumi",
    description:
      "Tetap terhubung dengan keluarga di Bumi melalui kanal komunikasi satelit sepanjang perjalanan.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="layanan"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Layanan SpaceX"
    >
      {/* Pemisah lembut */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Layanan Kami"
          title="Semua yang Anda butuhkan untuk sampai ke Bulan"
          description="Dari pelatihan hingga moonwalk — setiap detail perjalanan sudah kami siapkan dengan sempurna."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.08 * (i % 3) }}
              >
                <Card className="group h-full rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.05] hover:shadow-[0_12px_40px_-16px_var(--primary)]">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-5.5 w-5.5 text-primary" aria-hidden="true" />
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-semibold">{service.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.description}
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
