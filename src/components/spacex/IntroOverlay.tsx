"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Transisi pembuka website: layar penyambung dengan logo & garis progres
 * yang memudar dengan halus menuju konten utama.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1900);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          aria-hidden="true"
        >
          {/* Halo lembut di belakang logo */}
          <div className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Logo roket kecil */}
            <motion.svg
              viewBox="0 0 64 64"
              className="h-20 w-20"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [10, -6, 0], opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="introFlame" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f97316" />
                  <stop offset="1" stopColor="#fde047" />
                </linearGradient>
              </defs>
              <g transform="translate(32 34) rotate(45) translate(-32 -32)">
                <path
                  d="M32 10c5 5 8 12 8 19v7l-4 3h-8l-4-3v-7c0-7 3-14 8-19z"
                  fill="#ffffff"
                />
                <circle cx="32" cy="27" r="4" fill="#151528" stroke="#a78bfa" strokeWidth="1.5" />
                <path d="M24 36l-5 9 7-2z" fill="#a78bfa" />
                <path d="M40 36l5 9-7-2z" fill="#a78bfa" />
                <path d="M29 42h6l-3 10z" fill="url(#introFlame)" />
              </g>
            </motion.svg>

            <div className="flex flex-col items-center gap-2">
              <p className="font-heading text-3xl font-semibold tracking-[0.45em] text-foreground">
                SPACEX
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Jasa Travel ke Bulan
              </p>
            </div>

            {/* Garis progres */}
            <div className="h-px w-44 overflow-hidden bg-white/10">
              <div className="animate-progress h-full bg-primary" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
