/**
 * Konfigurasi utama website SpaceX Travel.
 * Ubah data perusahaan, kontak, dan navigasi di satu tempat ini.
 */
export const siteConfig = {
  name: "SpaceX",
  tagline: "Jasa Travel ke Bulan",
  description:
    "SpaceX adalah penyedia jasa perjalanan luar angkasa ke Bulan dengan pengalaman peluncuran yang aman, nyaman, dan berkesan seumur hidup.",
  email: "ceomxentyors@gmail.com",
  whatsappDisplay: "0823-1096-4091",
  whatsappIntl: "6282310964091",
  foundedYear: 2021,
  nav: [
    { href: "#beranda", label: "Beranda" },
    { href: "#tentang", label: "Tentang" },
    { href: "#layanan", label: "Layanan" },
    { href: "#tim", label: "Tim" },
    { href: "#harga", label: "Harga" },
    { href: "#pesan", label: "Pesan" },
  ],
} as const;

/** URL WhatsApp dengan pesan yang sudah terisi otomatis. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappIntl}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Halo Admin SpaceX! Saya ingin bertanya tentang jasa travel ke Bulan.";
