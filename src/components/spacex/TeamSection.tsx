"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./anim/TiltCard";
import { teamMembers } from "@/config/team";
import { siteConfig, whatsappUrl } from "@/config/site";
import { prefersReducedMotion, stagger } from "@/lib/motion";
import { MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/** Warna chip peran. */
const roleTone: Record<string, string> = {
  Owner: "text-gold-light border-gold/40 bg-gold/10",
  CEO: "text-ice border-ice/40 bg-ice/10",
  Direktur: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  "Asisten Direktur": "text-rose-300 border-rose-400/30 bg-rose-400/10",
};

export function TeamSection() {
  const rootRef = useRef<HTMLElement>(null);

  // Foto reveal clip-path wipe saat masuk viewport
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const photos = rootRef.current?.querySelectorAll<HTMLElement>("[data-crew-photo]");
      if (!photos?.length) return;
      photos.forEach((photo, i) => {
        gsap.fromTo(
          photo,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.1,
            ease: "power4.inOut",
            delay: (i % 3) * stagger.tight * 2,
            scrollTrigger: { trigger: photo, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="tim"
      ref={rootRef}
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Tim SpaceX"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Tim Kami"
          title="Orang-orang di balik setiap misi"
          description="Struktur tim proyek SpaceX: seorang Owner, seorang Direktur, seorang Asisten Direktur, seorang CEO, serta dua staf wanita yang berdedikasi tinggi."
          accentWord="misi"
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => {
            const crewCode = `CREW-${String(i + 1).padStart(2, "0")}`;
            const featured = Boolean(member.highlight);
            const tone = roleTone[member.role] ?? "text-muted-foreground border-white/15 bg-white/5";
            const waHref = whatsappUrl(
              `Halo Admin SpaceX! Saya ingin berbicara dengan ${member.name} (${member.role}).`
            );

            return (
              <TiltCard
                key={member.name}
                maxTilt={4}
                className={`${featured ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                <article
                  className={`group glass-card relative overflow-hidden ${
                    featured
                      ? "flex flex-col md:flex-row md:items-stretch"
                      : "flex flex-col"
                  }`}
                >
                  {/* Foto + overlay crew code + tombol WA slide-up */}
                  <div
                    className={`relative overflow-hidden ${
                      featured ? "aspect-[4/3] md:aspect-auto md:w-[42%]" : "aspect-[3/4]"
                    }`}
                  >
                    <div data-crew-photo className="absolute inset-0 will-change-[clip-path]">
                      <Image
                        src={member.photo}
                        alt={`Foto ${member.name} — ${member.role} ${siteConfig.name}`}
                        fill
                        placeholder="blur"
                        blurDataURL={member.blur}
                        sizes={
                          featured
                            ? "(max-width: 768px) 100vw, 40vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>
                    {/* Crew code chip */}
                    <span className="font-hud absolute left-3.5 top-3.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[9px] text-foreground/90 backdrop-blur">
                      {crewCode}
                    </span>
                    {/* Gradient bawah agar tombol terbaca */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
                    />
                    {/* Tombol WhatsApp slide-up — selalu tampil di perangkat sentuh */}
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-x-4 bottom-4 flex h-11 translate-y-[130%] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 text-sm font-medium text-foreground backdrop-blur transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 hover:border-[oklch(0.72_0.16_155)]/50 hover:bg-[oklch(0.72_0.16_155)]/20"
                      aria-label={`Chat ${member.name} via WhatsApp`}
                    >
                      <MessageCircle className="h-4 w-4 text-[oklch(0.78_0.15_155)]" aria-hidden="true" />
                      Hubungi via WhatsApp
                    </a>
                  </div>

                  {/* Info */}
                  <div className={`flex flex-1 flex-col p-6 ${featured ? "md:justify-center md:p-8" : ""}`}>
                    <p className={`font-hud mb-2 inline-flex w-fit rounded-full border px-3 py-1 text-[9px] ${tone}`}>
                      {member.role}
                    </p>
                    <h3
                      className={`font-heading font-semibold tracking-tight ${
                        featured ? "text-2xl sm:text-3xl" : "text-lg"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p
                      className={`mt-2.5 leading-relaxed text-muted-foreground ${
                        featured ? "max-w-lg text-[15px]" : "text-sm"
                      }`}
                    >
                      {member.description}
                    </p>
                    {/* Tombol WA versi inline untuk kartu featured (desktop) */}
                    {featured && (
                      <div className="mt-6 hidden md:block">
                        <Button
                          asChild
                          size="sm"
                          className="rounded-full bg-[oklch(0.72_0.16_155)] px-6 font-semibold text-black hover:bg-[oklch(0.78_0.15_155)]"
                        >
                          <a href={waHref} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                            Hubungi via WhatsApp
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
