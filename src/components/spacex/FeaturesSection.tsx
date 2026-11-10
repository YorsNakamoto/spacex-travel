"use client";

import { useState } from "react";
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

/**
 * Layanan — daftar editorial interaktif bernomor 01–06.
 * Desktop: hover/tap melebar menampilkan deskripsi, garis aksen tumbuh,
 * baris lain meredup (CSS .service-list). Mobile: perilaku accordion (tap).
 * Konten & nomor urut tetap; tanpa dependency baru.
 */
export function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="layanan"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Layanan SpaceX"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Layanan Kami"
          title="Semua yang Anda butuhkan untuk sampai ke Bulan"
          description="Dari pelatihan hingga moonwalk — setiap detail perjalanan sudah kami siapkan dengan sempurna."
          accentWord="Bulan"
        />

        <ul className="service-list mt-16 border-t border-white/10">
          {services.map((service, i) => {
            const Icon = service.icon;
            const num = String(i + 1).padStart(2, "0");
            const open = openIndex === i;
            return (
              <li
                key={service.title}
                className={`service-row border-b border-white/10 ${open ? "service-open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-7 text-left sm:gap-x-8"
                >
                  {/* Nomor */}
                  <span
                    className={`font-hud tnum text-xs transition-colors duration-300 ${
                      open ? "text-ice" : "text-muted-foreground/60"
                    }`}
                  >
                    {num}
                  </span>

                  {/* Judul + deskripsi expandable */}
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={`font-heading text-xl font-semibold tracking-tight transition-colors duration-300 sm:text-3xl ${
                        open ? "text-foreground" : "text-foreground/85"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-xl pt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                          {service.description}
                        </span>
                      </span>
                    </span>
                    {/* Garis aksen tumbuh */}
                    <span
                      aria-hidden="true"
                      className={`mt-4 block h-px origin-left bg-gradient-to-r from-ice to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>

                  {/* Ikon */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500 ${
                      open
                        ? "rotate-0 border-ice/40 bg-ice/10 text-ice"
                        : "border-white/10 bg-white/[0.03] text-muted-foreground group-hover:border-ice/30 group-hover:text-ice"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-transform duration-500 ${open ? "scale-110" : ""}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
