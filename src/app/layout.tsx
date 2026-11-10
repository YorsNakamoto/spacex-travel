import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
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
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
