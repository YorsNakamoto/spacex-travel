"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { teamMembers } from "@/config/team";
import { whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/config/site";
import { Crown, MessageCircle } from "lucide-react";

/** Warna badge per peran. */
const roleBadge: Record<string, string> = {
  Owner: "border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold-light)]",
  CEO: "border-primary/40 bg-primary/10 text-primary",
  Direktur: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Asisten Direktur": "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

export function TeamSection() {
  return (
    <section
      id="tim"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Tim SpaceX"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tim Kami"
          title="Orang-orang di balik setiap misi"
          description="Struktur tim proyek SpaceX: seorang Owner, seorang Direktur, seorang Asisten Direktur, seorang CEO, serta dua staf wanita yang berdedikasi tinggi."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.08 * (i % 3) }}
            >
              <Card className="group h-full overflow-hidden rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_16px_48px_-16px_var(--primary)]">
                {/* Foto tim */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={`Foto ${member.name} — ${member.role} SpaceX`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.02_285)] via-transparent to-transparent" />
                  {member.highlight && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-[oklch(0.14_0.02_285)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-light)] backdrop-blur">
                      <Crown className="h-3 w-3" aria-hidden="true" />
                      Pendiri
                    </span>
                  )}
                </div>

                <CardContent className="space-y-2.5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-heading text-lg font-semibold leading-tight">
                      {member.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        roleBadge[member.role] ||
                        "border-white/15 bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>

                <CardFooter className="px-5 pb-5 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-muted-foreground transition-colors hover:border-[oklch(0.72_0.16_155)]/40 hover:text-foreground"
                  >
                    <a
                      href={whatsappUrl(
                        `Halo Admin SpaceX! Saya ingin berbicara dengan ${member.name} (${member.role}).`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Hubungi via WhatsApp
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
