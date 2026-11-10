import { IntroOverlay } from "@/components/spacex/IntroOverlay";
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
        className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(140%_100%_at_50%_-20%,oklch(0.22_0.07_290/0.5),transparent_55%),radial-gradient(100%_80%_at_85%_110%,oklch(0.2_0.05_300/0.35),transparent_60%)]"
      />

      {/* Transisi pembuka website */}
      <IntroOverlay />

      {/* Navbar menempel di atas header */}
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <TeamSection />
        <PricingSection />
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
