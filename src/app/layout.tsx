import type { Metadata } from "next";
import { Sora, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/** Heading — geometris modern, wibawa premium. */
const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/** Body — keterbacaan maksimal untuk paragraf & formulir. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

/** Aksen editorial — italic serif untuk satu kata kunci per heading (mis. "Bulan"). */
const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "SpaceX — Jasa Travel ke Bulan",
  description:
    "SpaceX adalah penyedia jasa travel ke Bulan. Pilih model roket SpaceX Z1150 atau SpaceX Special 000, dan pesan perjalanan luar angkasa impian Anda sekarang.",
  keywords: [
    "SpaceX",
    "travel ke bulan",
    "jasa travel luar angkasa",
    "SpaceX Z1150",
    "SpaceX Special 000",
    "tiket ke bulan",
  ],
  authors: [{ name: "SpaceX Team" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SpaceX — Jasa Travel ke Bulan",
    description:
      "Perjalanan luar angkasa ke Bulan dengan roket SpaceX Z1150 dan SpaceX Special 000. Pesan sekarang!",
    siteName: "SpaceX",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Keputusan intro sebelum paint pertama (anti-flash):
   * - putar bila belum pernah diputar sesi ini DAN hash kosong / #beranda
   * - selain itu: sembunyikan overlay (intro-skip)
   * "spx:intro-*" events & sessionStorage dibaca IntroOverlay.
   */
  const introBootstrap = `(function(){try{var h=location.hash;var ok=(h===""||h==="#beranda");var played=false;try{played=sessionStorage.getItem("spx-intro")==="1"}catch(e){}var d=document.documentElement;if(!ok||played){d.classList.add("intro-skip")}else{d.classList.add("intro-pending")}}catch(e){}})();`;

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} ${instrumentSerif.variable} font-body antialiased bg-background text-foreground`}
      >
        <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
