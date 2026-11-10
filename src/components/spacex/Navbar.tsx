"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig, whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/config/site";
import {
  Rocket,
  Ticket,
  Users,
  Tag,
  MessageCircle,
  Sparkles,
  Mail,
  Menu,
  ArrowUpRight,
} from "lucide-react";

/** Logo wordmark SpaceX dengan ikon roket. */
function LogoMark() {
  return (
    <a
      href="#beranda"
      className="group flex items-center gap-2.5"
      aria-label="SpaceX — kembali ke beranda"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-primary/40">
        <Rocket className="h-4.5 w-4.5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-[0.32em] text-foreground">
        SPACEX
      </span>
    </a>
  );
}

/** Daftar fitur website yang tampil di menu garis-3 (hamburger). */
const websiteFeatures = [
  {
    icon: Ticket,
    title: "Pemesanan Tiket Online",
    description: "Formulir pemesanan yang otomatis terkirim ke email perusahaan.",
    href: "#pesan",
  },
  {
    icon: Rocket,
    title: "Pemilihan Model Roket",
    description: "Dua model legendaris: SpaceX Z1150 & SpaceX Special 000.",
    href: "#harga",
  },
  {
    icon: Tag,
    title: "Daftar Harga Paket",
    description: "Harga transparan per penumpang untuk setiap model roket.",
    href: "#harga",
  },
  {
    icon: Users,
    title: "Profil Tim Kami",
    description: "Owner, Direktur, Asisten Direktur, CEO, dan para staf.",
    href: "#tim",
  },
  {
    icon: Sparkles,
    title: "Animasi Peluncuran",
    description: "Tonton roket meluncur setelah pemesanan Anda berhasil.",
    href: "#pesan",
  },
  {
    icon: MessageCircle,
    title: "Chat Admin WhatsApp",
    description: "Konsultasi langsung dengan admin dalam hitungan detik.",
    href: whatsappUrl(WHATSAPP_DEFAULT_MESSAGE),
    external: true,
  },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "glass border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Navigasi utama"
      >
        <LogoMark />

        {/* Tautan navigasi utama (desktop) */}
        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="hidden rounded-full px-5 font-medium shadow-[0_0_24px_-6px_var(--primary)] hover:shadow-[0_0_32px_-4px_var(--primary)] sm:inline-flex"
          >
            <a href="#pesan">Pesan Sekarang</a>
          </Button>

          {/* Tombol garis-3 (hamburger) — pojok kanan atas */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Buka menu fitur website"
                className="group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-primary/40 hover:bg-white/10"
              >
                <span className="h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 group-hover:bg-primary" />
                <span className="h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 group-hover:bg-primary" />
                <span className="h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 group-hover:bg-primary" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="max-h-[100dvh] w-[88vw] max-w-sm overflow-y-auto border-white/10 bg-[oklch(0.15_0.025_285)]/95 p-0 backdrop-blur-xl"
            >
              <SheetHeader className="space-y-2 px-6 pb-4 pt-6">
                <SheetTitle className="font-heading text-left text-xl font-semibold tracking-wide">
                  Fitur Website
                </SheetTitle>
                <SheetDescription className="text-left">
                  Jelajahi seluruh layanan dan fitur yang tersedia di SpaceX.
                </SheetDescription>
              </SheetHeader>

              <Separator className="bg-white/10" />

              <div className="max-h-[62vh] overflow-y-auto px-4 py-4">
                <ul className="space-y-1.5">
                  {websiteFeatures.map((feature) => {
                    const Icon = feature.icon;
                    const content = (
                      <>
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 font-medium leading-none">
                            {feature.title}
                            {feature.external && (
                              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                            )}
                          </span>
                          <span className="text-xs leading-snug text-muted-foreground">
                            {feature.description}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={feature.title}>
                        {"external" in feature && feature.external ? (
                          <a
                            href={feature.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
                          >
                            {content}
                          </a>
                        ) : (
                          <a
                            href={feature.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
                          >
                            {content}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Hubungi Kami
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 rounded-xl border-white/10 bg-white/5 hover:border-primary/40"
                  >
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                      {siteConfig.email}
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full justify-start gap-2 rounded-xl bg-[oklch(0.72_0.16_155)] font-semibold text-black hover:bg-[oklch(0.78_0.15_155)]"
                  >
                    <a
                      href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Chat Admin — {siteConfig.whatsappDisplay}
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
