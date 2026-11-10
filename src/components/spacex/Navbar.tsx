"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { siteConfig, whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/config/site";
import { getLenis } from "@/lib/lenis-singleton";
import { easings, prefersReducedMotion } from "@/lib/motion";
import {
  Rocket,
  Ticket,
  Users,
  Tag,
  MessageCircle,
  Sparkles,
  Mail,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

/** Logo wordmark — nama & tagline dari config (mudah di-rebrand). */
function LogoMark() {
  return (
    <a
      href="#beranda"
      className="group flex items-center gap-2.5"
      aria-label={`${siteConfig.name} — kembali ke beranda`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-ice/40">
        <Rocket
          className="h-4 w-4 text-ice transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
      <span className="font-heading text-base font-semibold tracking-[0.34em] text-foreground">
        {siteConfig.wordmark}
      </span>
    </a>
  );
}

/** Daftar fitur website yang tampil di menu garis-3 (hamburger). */
type WebsiteFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

const websiteFeatures: ReadonlyArray<WebsiteFeature> = [
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
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hiddenDown, setHiddenDown] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [entered, setEntered] = useState(false);

  const pillRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);

  // Entrance: turun setelah intro selesai (atau langsung bila di-skip)
  useEffect(() => {
    const done = () => setEntered(true);
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(done);
      return () => cancelAnimationFrame(raf);
    }
    if (!document.documentElement.classList.contains("intro-pending")) {
      const id = setTimeout(done, 150);
      return () => clearTimeout(id);
    }
    window.addEventListener("spx:intro-done", done, { once: true });
    window.addEventListener("spx:intro-lift", done, { once: true });
    return () => {
      window.removeEventListener("spx:intro-done", done);
      window.removeEventListener("spx:intro-lift", done);
    };
  }, []);

  // Glass saat scroll + sembunyi saat turun / muncul saat naik
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastScrollY.current;
        if (Math.abs(delta) > 8) {
          setHiddenDown(delta > 0 && y > 140);
          lastScrollY.current = y;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section aktif (pill + aria-current)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    siteConfig.nav.forEach((item) => {
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => entries[0]?.isIntersecting && setActiveSection(id),
        { rootMargin: "-40% 0px -45% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Pill indikator meluncur antar menu
  useGSAP(
    () => {
      const list = listRef.current;
      const pill = pillRef.current;
      if (!list || !pill) return;
      const active = list.querySelector<HTMLElement>(`a[href="#${activeSection}"]`);
      if (!active) return;
      gsap.to(pill, {
        x: active.offsetLeft,
        width: active.offsetWidth,
        duration: prefersReducedMotion() ? 0 : 0.45,
        ease: easings.outGsap,
      });
    },
    { dependencies: [activeSection] }
  );

  const closePanel = useCallback(() => setOpen(false), []);

  // Panel: reveal lingkaran dari burger + scroll lock + fokus
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const lenis = getLenis();
      const reduced = prefersReducedMotion();

      if (open) {
        lenis?.stop();
        document.body.style.overflow = "hidden";
        lastActiveRef.current = document.activeElement as HTMLElement | null;

        gsap.fromTo(
          panel,
          { clipPath: "circle(0% at calc(100% - 44px) 44px)" },
          {
            clipPath: "circle(150% at calc(100% - 44px) 44px)",
            duration: reduced ? 0.01 : 0.65,
            ease: easings.inOutGsap,
          }
        );
        gsap.fromTo(
          panel.querySelectorAll("[data-panel-item]"),
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: reduced ? 0 : 0.045,
            delay: reduced ? 0 : 0.2,
            ease: easings.outGsap,
          }
        );
        panel.querySelector<HTMLElement>("a, button")?.focus();
      } else {
        gsap.to(panel, {
          clipPath: "circle(0% at calc(100% - 44px) 44px)",
          duration: reduced ? 0.01 : 0.45,
          ease: easings.inOutGsap,
          onComplete: () => {
            lenis?.start();
            document.body.style.overflow = "";
            lastActiveRef.current?.focus?.();
          },
        });
      }
    },
    { dependencies: [open] }
  );

  // Focus trap + ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "glass border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]"
            : "border-transparent bg-transparent"
        } ${entered ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} ${
          hiddenDown && entered ? "-translate-y-full" : ""
        }`}
        style={{ transitionTimingFunction: easings.out }}
      >
        <nav
          className={`container-x flex items-center justify-between gap-4 transition-[height] duration-500 ${
            scrolled ? "h-14" : "h-16"
          }`}
          aria-label="Navigasi utama"
        >
          <LogoMark />

          {/* Tautan desktop + pill indikator */}
          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            <span
              ref={pillRef}
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-9 -translate-y-1/2 rounded-full border border-ice/25 bg-ice/[0.08]"
              style={{ width: 0 }}
            />
            {siteConfig.nav.map((item) => {
              const id = item.href.slice(1);
              const active = activeSection === id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active ? "true" : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="hidden rounded-full px-5 font-medium shadow-[0_0_24px_-8px_var(--ice)] transition-shadow hover:shadow-[0_0_32px_-4px_var(--ice)] sm:inline-flex"
            >
              <a href="#pesan">Pesan Sekarang</a>
            </Button>

            {/* Tombol garis-3 — pojok kanan atas */}
            <button
              type="button"
              aria-label={open ? "Tutup menu fitur website" : "Buka menu fitur website"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/[0.04] transition-colors hover:border-ice/40 hover:bg-white/10"
            >
              <span
                className={`h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[2px] w-[18px] rounded-full bg-foreground transition-all duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Panel fitur — fullscreen, reveal lingkaran dari burger */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Fitur website SpaceX"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-[90] bg-[#070b14]/95 backdrop-blur-2xl ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
      >
        <div className="container-x flex h-full flex-col overflow-y-auto pb-8 pt-24 sm:pt-28">
          {/* Navigasi (mobile) */}
          <ul className="mb-8 flex flex-col gap-1 lg:hidden">
            {siteConfig.nav.map((item) => (
              <li key={item.href} data-panel-item>
                <a
                  href={item.href}
                  onClick={closePanel}
                  className="font-heading block rounded-2xl px-4 py-3 text-3xl font-bold tracking-tight text-foreground/90 transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <p data-panel-item className="font-hud mb-4 text-[9px] text-muted-foreground">
            Fitur Website
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {websiteFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} data-panel-item>
                  <a
                    href={feature.href}
                    onClick={closePanel}
                    {...(feature.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/5"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-ice/40 group-hover:bg-ice/10">
                      <Icon className="h-5 w-5 text-ice" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 font-medium leading-none">
                        {feature.title}
                        {feature.external && (
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {feature.description}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div data-panel-item className="mt-8 flex flex-col gap-2 sm:max-w-sm">
            <p className="font-hud mb-1 text-[9px] text-muted-foreground">Hubungi Kami</p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 rounded-xl border-white/10 bg-white/[0.04] hover:border-ice/40"
            >
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="h-4 w-4 text-ice" aria-hidden="true" />
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
      </div>
    </>
  );
}
