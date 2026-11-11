"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { RocketIllustration } from "./RocketIllustration";
import { rocketModels } from "@/config/rockets";
import { CountUp } from "./anim/CountUp";
import { useDrawIcons } from "@/hooks/use-draw-icons";
import { useRef } from "react";
import { Check, Zap, Clock, Sparkles } from "lucide-react";

/**
 * Harga — dua kartu premium berdampingan.
 * Z1150 beraksen ice-blue; Special 000 beraksen emas dengan border-beam
 * berputar + badge "Paling Diminati" shimmer. Ilustrasi roket SVG orisinal
 * per model (idle float + thrust saat hover). Harga ticker saat masuk
 * viewport; fasilitas muncul bertahap dengan centang tergambar.
 * "Pesan Model Ini" → smooth scroll ke form + pre-select (data-rocket-select,
 * mekanisme lama dipertahankan).
 */
export function PricingSection() {
  const rootRef = useRef<HTMLElement>(null);
  useDrawIcons(rootRef);
  return (
    <section
      id="harga"
      ref={rootRef}
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Daftar harga dan model roket"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Harga & Model Roket"
          title="Pilih model roket Anda"
          description="Dua model roket ikonik dengan pengalaman yang berbeda. Klik “Pesan Model Ini” untuk langsung mengisi formulir pemesanan."
          accentWord="roket"
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-7 lg:grid-cols-2">
          {rocketModels.map((rocket, i) => {
            const isGold = rocket.accent === "gold";
            const accentVar = isGold ? "var(--gold)" : "var(--ice)";
            return (
              <div key={rocket.id} className="relative" data-price-card={rocket.id}>
                {rocket.popular && (
                  <Badge className="badge-shimmer gold-glow absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold/40 bg-[#17131f] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light shadow-lg">
                    <Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />
                    Paling Diminati
                  </Badge>
                )}

                {/* Border-beam berputar (kartu emas) */}
                <div
                  className={`group relative h-full overflow-hidden rounded-3xl border bg-white/[0.03] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${
                    isGold
                      ? "border-gold/25 hover:border-gold/50 hover:shadow-[0_16px_56px_-18px_var(--gold)]"
                      : "border-white/10 hover:border-ice/40 hover:shadow-[0_16px_56px_-18px_var(--ice)]"
                  }`}
                >
                  {isGold && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-3xl p-[1px]"
                    >
                      <span
                        className="absolute inset-[-60%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_78%,rgba(232,194,122,0.75)_90%,transparent_100%)]"
                        style={{ animationDuration: "6.5s" }}
                      />
                    </span>
                  )}

                  {/* Ilustrasi roket: idle float + thrust saat hover */}
                  <div className="pointer-events-none absolute -right-8 top-4 opacity-[0.16] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-4 group-hover:opacity-[0.3]">
                    <div className="animate-float-slow">
                      <RocketIllustration
                        variant={rocket.id}
                        flame
                        className="h-60 w-auto"
                        title={`Roket ${rocket.name}`}
                      />
                    </div>
                  </div>

                  <CardHeader className="relative space-y-3 p-7 pb-4">
                    <span
                      className={`font-hud inline-flex w-fit items-center rounded-full px-3 py-1 text-[9px] ${
                        isGold
                          ? "border border-gold/30 bg-gold/10 text-gold-light"
                          : "border border-ice/30 bg-ice/10 text-ice"
                      }`}
                    >
                      {rocket.series}
                    </span>
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
                            isGold ? "text-gold-light" : "text-foreground"
                          }`}
                        >
                          {rocket.priceLabel}
                        </span>
                        <span className="text-sm text-muted-foreground">/ penumpang</span>
                      </p>
                      {/* Ticker digit harga penuh */}
                      <p className="font-heading tnum mt-1 text-xs text-muted-foreground/80">
                        <CountUp value={rocket.price} duration={1.6} />
                        {" · sekali jalan"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground`}
                      >
                        <Clock
                          className="h-3.5 w-3.5"
                          style={{ color: accentVar }}
                          aria-hidden="true"
                        />
                        {rocket.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                        <Zap
                          className="h-3.5 w-3.5"
                          style={{ color: accentVar }}
                          aria-hidden="true"
                        />
                        Peluncuran terjadwal
                      </span>
                    </div>

                    <ul className="space-y-2.5 border-t border-white/10 pt-5">
                      {rocket.features.map((feature, fi) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm"
                          style={{
                            transitionDelay: `${fi * 40}ms`,
                          }}
                        >
                          <span
                            className="draw-icon mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center"
                            style={{ ["--draw-delay" as string]: `${fi * 70}ms` }}
                          >
                            <Check
                              className="h-4 w-4"
                              style={{ color: accentVar }}
                              aria-hidden="true"
                            />
                          </span>
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
                          ? "bg-gradient-to-r from-gold-light to-[#c99a3b] text-black shadow-[0_0_32px_-8px_var(--gold)] hover:from-[#f3d9a4] hover:to-[#d8a94b]"
                          : "bg-ice text-[#05070d] shadow-[0_0_32px_-8px_var(--ice)] hover:bg-[#a5ddfd]"
                      }`}
                    >
                      {/* data-rocket-select dipakai BookingSection untuk pre-select model */}
                      <a href="#pesan" data-rocket-select={rocket.id}>
                        Pesan Model Ini
                      </a>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
