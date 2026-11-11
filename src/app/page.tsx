import { IntroOverlay } from "@/components/spacex/IntroOverlay";
import { GrainOverlay } from "@/components/spacex/primitives/GrainOverlay";
import { SmoothScroll } from "@/components/spacex/anim";
import { AtmosphereLayer } from "@/components/spacex/AtmosphereLayer";
import { MissionHUD } from "@/components/spacex/MissionHUD";
import { Marquee } from "@/components/spacex/Marquee";
import { Navbar } from "@/components/spacex/Navbar";
import { HeroSection } from "@/components/spacex/HeroSection";
import { AboutSection } from "@/components/spacex/AboutSection";
import { FeaturesSection } from "@/components/spacex/FeaturesSection";
import { TeamSection } from "@/components/spacex/TeamSection";
import { PricingSection } from "@/components/spacex/PricingSection";
import { BookingSection } from "@/components/spacex/BookingSection";
import { Footer } from "@/components/spacex/Footer";
import { WhatsAppFloat } from "@/components/spacex/WhatsAppFloat";
import { RocketLaunchOverlay } from "@/components/spacex/RocketLaunchOverlay";
import { SuccessDialog } from "@/components/spacex/SuccessDialog";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Latar gradasi angkasa global */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(140%_100%_at_50%_-20%,rgba(17,26,46,0.9),transparent_55%),radial-gradient(100%_80%_at_85%_110%,rgba(10,15,28,0.8),transparent_60%)]"
      />

      {/* Transisi pembuka website */}
      <IntroOverlay />

      {/* Grain statis untuk kesan premium */}
      <GrainOverlay />

      {/* Smooth scroll Lenis + sinkronisasi ScrollTrigger */}
      <SmoothScroll />

      {/* Atmosfer berganti per section (peluncuran → … → pendaratan) */}
      <AtmosphereLayer />

      {/* Mission HUD: progres perjalanan Bumi → Bulan */}
      <MissionHUD />

      {/* Navbar menempel di atas header */}
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <Marquee />
        <AboutSection />
        <FeaturesSection />
        <Marquee />
        <TeamSection />
        <PricingSection />
        <Marquee />
        <BookingSection />
      </main>

      <Footer />

      {/* Tombol mengambang WhatsApp */}
      <WhatsAppFloat />

      {/* Animasi roket terbang saat pemesanan berhasil */}
      <RocketLaunchOverlay />

      {/* Dialog konfirmasi pemesanan */}
      <SuccessDialog />
    </div>
  );
}
