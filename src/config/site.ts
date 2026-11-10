/**
 * Konfigurasi utama website SpaceX Travel.
 * Satu-satunya sumber data untuk brand, kontak, statistik, dan navigasi.
 * Ubah nilai di sini — seluruh halaman mengikuti secara otomatis.
 */
export const siteConfig = {
  /** Brand — "SpaceX" adalah merek dagang perusahaan nyata;
   *  ganti name/wordmark/tagline di sini bila ingin nama orisinal. */
  name: "SpaceX",
  wordmark: "SPACEX",
  tagline: "Jasa Travel ke Bulan",

  description:
    "SpaceX adalah penyedia jasa perjalanan luar angkasa ke Bulan dengan pengalaman peluncuran yang aman, nyaman, dan berkesan seumur hidup.",
  email: "ceomxentyors@gmail.com",
  whatsappDisplay: "0823-1096-4091",
  whatsappIntl: "6282310964091",
  foundedYear: 2021,

  /** Jendela peluncuran berikutnya (ISO, zona WIB) — dipakai countdown T-minus di Hero. */
  nextLaunchDate: "2026-12-16T09:00:00+07:00",

  nav: [
    { href: "#beranda", label: "Beranda" },
    { href: "#tentang", label: "Tentang" },
    { href: "#layanan", label: "Layanan" },
    { href: "#tim", label: "Tim" },
    { href: "#harga", label: "Harga" },
    { href: "#pesan", label: "Pesan" },
  ],

  /** Statistik perusahaan — SATU sumber untuk Hero, Tentang, HUD, dan marquee. */
  stats: {
    /** Misi berhasil ke Bulan */
    missions: 12,
    /** Total penumpang yang telah terbang */
    passengers: 48,
    /** Persentase kepuasan penumpang */
    satisfaction: 98,
    /** Jarak Bumi — Bulan (km) */
    distanceKm: 384_400,
    /** Insiden keselamatan sejak berdiri */
    incidents: 0,
    /** Tahap pemeriksaan roket sebelum peluncuran */
    systemChecks: 214,
  },

  /** Item marquee tipis antar section. */
  marqueeItems: [
    "Z1150",
    "SPECIAL 000",
    "384.400 KM",
    "0 INSIDEN",
    "214 PEMERIKSAAN",
  ],
} as const;

/** Format angka gaya Indonesia (384400 → "384.400"). */
export function formatIDNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

/** URL WhatsApp dengan pesan yang sudah terisi otomatis. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappIntl}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Halo Admin SpaceX! Saya ingin bertanya tentang jasa travel ke Bulan.";
