"use client";

import { Rocket, Mail, MessageCircle, MapPin } from "lucide-react";
import { siteConfig, whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/config/site";

/**
 * Footer minimalis yang selalu menempel di dasar halaman.
 */
export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[oklch(0.11_0.02_285)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#beranda" className="flex items-center gap-2.5" aria-label="SpaceX">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Rocket className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-semibold tracking-[0.32em]">
                SPACEX
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Hubungi Kami
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-[oklch(0.78_0.15_155)]"
                >
                  <MessageCircle className="h-4 w-4 text-[oklch(0.72_0.16_155)]" aria-hidden="true" />
                  {siteConfig.whatsappDisplay} (WhatsApp Admin)
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-foreground/80">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                Kosmodrom SpaceX, Bumi — menuju Bulan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} SpaceX Travel. Seluruh hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan penuh mimpi di Bumi
            <Rocket className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
