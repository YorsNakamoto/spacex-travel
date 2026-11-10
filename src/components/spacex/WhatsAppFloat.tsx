"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { whatsappUrl, WHATSAPP_DEFAULT_MESSAGE, siteConfig } from "@/config/site";
import { MessageCircle } from "lucide-react";

/**
 * Tombol mengambang chat admin WhatsApp di pojok kanan bawah.
 */
export function WhatsAppFloat() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 3.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6"
    >
      <Button
        asChild
        size="icon"
        aria-label={`Chat admin SpaceX via WhatsApp (${siteConfig.whatsappDisplay})`}
        className="animate-soft-pulse h-14 w-14 rounded-full border border-[oklch(0.85_0.1_155)]/40 bg-[oklch(0.72_0.16_155)] text-black shadow-[0_10px_36px_-8px_oklch(0.72_0.16_155)] transition-transform hover:scale-105"
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
      <span className="pointer-events-none absolute right-[4.25rem] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[oklch(0.17_0.025_285)]/90 px-4 py-2 text-xs font-medium text-foreground opacity-0 shadow-xl backdrop-blur transition-all duration-300 [div:hover>&]:opacity-100 sm:block">
        Chat Admin — {siteConfig.whatsappDisplay}
      </span>
    </motion.div>
  );
}
