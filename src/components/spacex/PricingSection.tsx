"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "./SectionHeading";
import { RocketIllustration } from "./RocketIllustration";
import { rocketModels, formatRupiah } from "@/config/rockets";
import { Check, Zap, Clock, Sparkles } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="harga"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Daftar harga dan model roket"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-[var(--gold)]/5 blur-3xl" />
      <div className="absolute left-[-8%] bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Harga & Model Roket"
          title="Pilih model roket Anda"
          description="Dua model roket ikonik dengan pengalaman yang berbeda. Klik “Pesan Model Ini” untuk langsung mengisi formulir pemesanan."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-7 lg:grid-cols-2">
          {rocketModels.map((rocket, i) => {
            const isGold = rocket.accent === "gold";
            return (
              <motion.div
                key={rocket.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.12 * i }}
                className="relative"
              >
                {rocket.popular && (
                  <Badge className="gold-glow absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[var(--gold)]/40 bg-[oklch(0.2_0.05_85)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--gold-light)] shadow-lg">
                    <Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />
                    Paling Diminati
                  </Badge>
                )}

                <Card
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white/[0.03] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${
                    isGold
                      ? "border-[var(--gold)]/25 hover:border-[var(--gold)]/50 hover:shadow-[0_16px_56px_-18px_var(--gold)]"
                      : "border-white/10 hover:border-primary/40 hover:shadow-[0_16px_56px_-18px_var(--primary)]"
                  }`}
                >
                  {/* Ilustrasi roket sebagai latar kartu */}
                  <div className="pointer-events-none absolute -right-10 top-6 opacity-[0.13]">
                    <RocketIllustration
                      variant={rocket.id}
                      className="h-56 w-auto"
                      title={`Roket ${rocket.name}`}
                    />
                  </div>

                  <CardHeader className="relative space-y-3 p-7 pb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          isGold
                            ? "border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold-light)]"
                            : "border border-primary/30 bg-primary/10 text-primary"
                        }`}
                      >
                        {rocket.series}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold tracking-tight">
                      {rocket.name}
                    </h3>
                    <p className="max-w-[80%] text-sm leading-relaxed text-muted-foreground">
                      {rocket.description}
                    </p>
                  </CardHeader>

                  <CardContent className="relative flex flex-1 flex-col gap-5 p-7 pt-0">
                    <div>
                      <p className="flex items-baseline gap-1.5">
                        <span
                          className={`font-heading text-4xl font-bold tracking-tight ${
                            isGold ? "text-[var(--gold-light)]" : "text-foreground"
                          }`}
                        >
                          {rocket.priceLabel}
                        </span>
                        <span className="text-sm text-muted-foreground">/ penumpang</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatRupiah(rocket.price)} · sekali jalan
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {rocket.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                        <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        Peluncuran terjadwal
                      </span>
                    </div>

                    <Separator className="bg-white/10" />

                    <ul className="space-y-2.5">
                      {rocket.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isGold ? "text-[var(--gold)]" : "text-primary"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-7 pt-0">
                    <Button
                      asChild
                      size="lg"
                      className={`h-12 w-full rounded-full text-base font-semibold ${
                        isGold
                          ? "border border-[var(--gold)]/40 bg-gradient-to-r from-[oklch(0.78_0.15_85)] to-[oklch(0.85_0.12_90)] text-black shadow-[0_0_32px_-8px_var(--gold)] hover:from-[oklch(0.82_0.14_85)] hover:to-[oklch(0.88_0.1_90)]"
                          : "shadow-[0_0_32px_-8px_var(--primary)] hover:shadow-[0_0_40px_-6px_var(--primary)]"
                      }`}
                    >
                      {/* data-rocket dipakai BookingSection untuk pre-select model */}
                      <a href="#pesan" data-rocket-select={rocket.id}>
                        Pesan Model Ini
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
