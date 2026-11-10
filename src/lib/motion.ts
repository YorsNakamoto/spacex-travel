/**
 * Token motion terpusat — dipakai GSAP (Fase 2+) dan CSS.
 * Skala waktu: micro 150–250ms · UI 400–600ms · reveal 800–1200ms.
 * Easing utama "out" untuk reveal; "inOut" hanya untuk transisi besar
 * (intro, panel, pergantian layar). Tanpa bounce/elastic.
 */
export const easings = {
  /** cubic-bezier(0.16, 1, 0.3, 1) — reveal & micro-interaction */
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Bentuk GSAP dari easing yang sama (CustomEase belum diperlukan). */
  outGsap: "power3.out",
  /** cubic-bezier(0.76, 0, 0.24, 1) — transisi besar/panural */
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)",
  inOutGsap: "power4.inOut",
  linear: "linear",
} as const;

/** Durasi dalam detik (ramah GSAP). */
export const durations = {
  /** 200ms — hover, focus, micro-feedback */
  micro: 0.2,
  /** 500ms — transisi UI umum */
  ui: 0.5,
  /** 1s — reveal konten saat scroll */
  reveal: 1.0,
  /** 1,2s — momen hero / pembuka */
  hero: 1.2,
} as const;

/** Jeda berantai antar elemen (detik). */
export const stagger = {
  /** 60ms — antar item dalam satu kelompok kecil */
  tight: 0.06,
  /** 90ms — antar baris/kartu section */
  base: 0.09,
} as const;

/** Offset tinggi navbar (px) untuk smooth-scroll anchor. */
export const NAV_SCROLL_OFFSET = 88;

/** Deteksi preferensi reduced-motion (aman dipanggil di client). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Deteksi perangkat low-end untuk mengurangi efek berat (Fase 4+). */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const saveData = nav.connection?.saveData === true;
  return lowCores || lowMemory || saveData;
}
