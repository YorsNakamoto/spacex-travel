"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { whatsappUrl, WHATSAPP_DEFAULT_MESSAGE, siteConfig } from "@/config/site";
import { MessageCircle } from "lucide-react";

/**
 * Tombol mengambang chat admin WhatsApp di pojok kanan bawah.
 * Muncul setelah intro; mengecil menjadi ikon saat scroll turun
 * (agar tidak menutupi tombol submit di mobile); ring pulse pelan.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    // Muncul setelah intro selesai (atau langsung bila di-skip)
    const show = () => setVisible(true);
    if (!document.documentElement.classList.contains("intro-pending")) {
      const id = setTimeout(show, 600);
      return () => clearTimeout(id);
    }
    window.addEventListener("spx:intro-done", show, { once: true });
    window.addEventListener("spx:intro-lift", show, { once: true });
    return () => {
      window.removeEventListener("spx:intro-done", show);
      window.removeEventListener("spx:intro-lift", show);
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 10) {
          setCompact(y > lastY && y > 300);
          lastY = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-500 sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Button
        asChild
        size="icon"
        aria-label={`Chat admin SpaceX via WhatsApp (${siteConfig.whatsappDisplay})`}
        className="animate-soft-pulse h-14 w-14 rounded-full border border-[oklch(0.85_0.1_155)]/40 bg-[oklch(0.72_0.16_155)] text-black shadow-[0_10px_36px_-8px_oklch(0.72_0.16_155)] transition-all hover:scale-105"
        style={{ width: compact ? 48 : undefined, height: compact ? 48 : undefined }}
      >
        <a
          href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
      </Button>

      {/* Label muncul saat kursor menyentuh area (desktop) */}
      <span className="pointer-events-none absolute right-[4.25rem] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a0f1c]/90 px-4 py-2 text-xs font-medium text-foreground opacity-0 shadow-xl backdrop-blur transition-all duration-300 [div:hover>&]:opacity-100 sm:block">
        Chat Admin — {siteConfig.whatsappDisplay}
      </span>
    </div>
  );
}
