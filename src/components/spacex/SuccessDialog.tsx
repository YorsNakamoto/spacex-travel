"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RocketIllustration } from "./RocketIllustration";
import { useLaunchStore } from "@/store/launch-store";
import { siteConfig, whatsappUrl } from "@/config/site";
import { CheckCircle2, MessageCircle, AlertTriangle, PartyPopper } from "lucide-react";

/**
 * Dialog konfirmasi setelah animasi peluncuran selesai:
 * kode booking, ringkasan pesanan, status email, dan tombol
 * konfirmasi cepat ke WhatsApp admin.
 * Layout dirancang kompak agar muat pada viewport pendek.
 */
export function SuccessDialog() {
  const successOpen = useLaunchStore((s) => s.successOpen);
  const data = useLaunchStore((s) => s.data);
  const closeSuccess = useLaunchStore((s) => s.closeSuccess);

  if (!data) return null;

  const waMessage = [
    `Halo Admin SpaceX! Saya ${data.customerName} baru saja memesan tiket travel ke Bulan.`,
    "",
    `Kode Booking: ${data.bookingCode}`,
    `Model Roket: ${data.rocketName}`,
    `Tanggal Keberangkatan: ${data.departureDate}`,
    `Jumlah Penumpang: ${data.passengers} orang`,
    `Total: ${data.totalPriceLabel}`,
    "",
    "Mohon dibantu proses konfirmasinya. Terima kasih!",
  ].join("\n");

  const details = [
    { label: "Nama Pemesan", value: data.customerName },
    { label: "Model Roket", value: data.rocketName },
    { label: "Keberangkatan", value: data.departureDate },
    { label: "Penumpang", value: `${data.passengers} orang` },
    { label: "Total Biaya", value: data.totalPriceLabel },
  ];

  return (
    <Dialog open={successOpen} onOpenChange={(open) => !open && closeSuccess()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-white/10 bg-[oklch(0.15_0.025_285)]/95 p-0 backdrop-blur-xl sm:max-w-md">
        {/* Ilustrasi atas — kompak */}
        <div className="relative flex h-28 items-end justify-center overflow-hidden bg-[radial-gradient(80%_100%_at_50%_100%,oklch(0.3_0.1_290/0.35),transparent)]">
          <div className="animate-float absolute bottom-0">
            <RocketIllustration
              variant={data.rocketId}
              flame
              className="h-28 w-auto drop-shadow-[0_0_30px_rgba(167,139,250,0.4)]"
              title="Roket pemesanan Anda"
            />
          </div>
          <span className="animate-twinkle absolute left-8 top-5 h-1 w-1 rounded-full bg-white/80" style={{ ["--tw-duration" as string]: "2.4s" }} />
          <span className="animate-twinkle absolute right-12 top-8 h-1.5 w-1.5 rounded-full bg-white/70" style={{ ["--tw-duration" as string]: "3.2s", ["--tw-delay" as string]: "0.8s" }} />
          <span className="animate-twinkle absolute left-1/3 top-4 h-1 w-1 rounded-full bg-white/60" style={{ ["--tw-duration" as string]: "2.8s", ["--tw-delay" as string]: "1.4s" }} />
        </div>

        <div className="space-y-4 p-5">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <PartyPopper className="h-5 w-5 text-primary" aria-hidden="true" />
              Pemesanan Berhasil
            </DialogTitle>
            <DialogDescription className="text-xs">
              Roket Anda sudah meluncur! Simpan kode booking berikut:
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="rounded-2xl border border-primary/30 bg-primary/10 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Kode Booking
            </p>
            <p className="font-heading text-glow mt-0.5 text-2xl font-bold tracking-[0.12em] text-primary">
              {data.bookingCode}
            </p>
          </motion.div>

          <ul className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            {details.map((item) => (
              <li key={item.label} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="shrink-0 text-muted-foreground">{item.label}</span>
                <span className="text-right font-medium leading-snug">{item.value}</span>
              </li>
            ))}
          </ul>

          {/* Status email otomatis */}
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed ${
              data.emailSent
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                : "border-amber-400/30 bg-amber-400/10 text-amber-200"
            }`}
            role="status"
          >
            {data.emailSent ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {data.emailSent ? (
                <>
                  Detail pemesanan otomatis terkirim ke{" "}
                  <strong className="font-semibold">{siteConfig.email}</strong>.
                </>
              ) : (
                <>
                  Tersimpan di sistem kami. Email ke{" "}
                  <strong className="font-semibold">{siteConfig.email}</strong> menunggu
                  aktivasi kotak masuk (cukup buka email aktivisasi yang terkirim sekali).
                  Sementara itu, konfirmasi via WhatsApp di bawah ini.
                </>
              )}
            </span>
          </div>

          <Separator className="bg-white/10" />

          <DialogFooter className="flex flex-col gap-2.5 sm:flex-col">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full bg-[oklch(0.72_0.16_155)] text-base font-semibold text-black shadow-[0_0_28px_-8px_oklch(0.72_0.16_155)] hover:bg-[oklch(0.78_0.15_155)]"
            >
              <a href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Konfirmasi via WhatsApp Admin
              </a>
            </Button>
            <Button
              variant="ghost"
              onClick={closeSuccess}
              className="w-full rounded-full text-sm text-muted-foreground hover:text-foreground"
            >
              Tutup &amp; kembali menjelajah
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
