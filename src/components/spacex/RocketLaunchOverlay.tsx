"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RocketIllustration } from "./RocketIllustration";
import { useLaunchStore } from "@/store/launch-store";

/**
 * Animasi layar penuh: hitung mundur 3-2-1, lalu roket terbang
 * ke langit dengan efek warp bintang dan partikel knalpot.
 * Dipicu otomatis setiap kali pemesanan berhasil.
 *
 * Panggung animasi dipisah ke komponen anak agar setiap sesi
 * peluncuran selalu dimulai dengan state yang bersih.
 */
function LaunchStage({
  rocketId,
  onFinish,
}: {
  rocketId: "z1150" | "special000";
  onFinish: () => void;
}) {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [showSuccessText, setShowSuccessText] = useState(false);

  // Garis warp bintang dengan posisi acak yang stabil selama animasi
  const warpStars = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: `${(i * 2.94 + (i % 5) * 1.7).toFixed(1)}%`,
        width: 1 + (i % 3),
        duration: `${(0.55 + ((i * 7) % 5) * 0.13).toFixed(2)}s`,
        delay: `${((i * 13) % 20) * 0.05}s`,
      })),
    []
  );

  useEffect(() => {
    // Rangkaian waktu animasi (semua pembaruan state lewat timer asinkron)
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCountdown(2), 800));
    timers.push(setTimeout(() => setCountdown(1), 1600));
    timers.push(setTimeout(() => setCountdown(null), 2400)); // LUNCUR!
    timers.push(setTimeout(() => setShowSuccessText(true), 4700));
    timers.push(setTimeout(() => onFinish(), 5600));
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <motion.div
      key="launch-overlay"
      className="fixed inset-0 z-[150] overflow-hidden bg-[oklch(0.09_0.02_285)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      role="status"
      aria-live="assertive"
      aria-label="Animasi peluncuran roket — pemesanan berhasil"
    >
      {/* Bintang warp melesat saat roket terbang */}
      {countdown === null && (
        <div aria-hidden="true" className="absolute inset-0">
          {warpStars.map((star) => (
            <span
              key={star.id}
              className="animate-warp absolute top-0 bg-gradient-to-b from-transparent via-white/80 to-transparent"
              style={
                {
                  left: star.left,
                  width: `${star.width}px`,
                  height: "26vh",
                  "--warp-duration": star.duration,
                  "--warp-delay": star.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Cahaya mesin di dasar layar */}
      {countdown === null && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-56 w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.4] }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* Teks tengah: hitung mundur → Meluncur! → Pemesanan Berhasil!
          Satu AnimatePresence mode="wait" agar tiap teks keluar
          sempurna sebelum teks berikutnya masuk (tanpa tumpang tindih). */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {countdown !== null && (
            <motion.span
              key={`count-${countdown}`}
              className="font-heading text-glow text-[9rem] font-bold text-foreground sm:text-[12rem]"
              initial={{ opacity: 0, scale: 1.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.55 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              {countdown}
            </motion.span>
          )}

          {countdown === null && !showSuccessText && (
            <motion.span
              key="liftoff"
              className="font-heading text-glow text-4xl font-bold uppercase tracking-[0.35em] text-primary sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              Meluncur!
            </motion.span>
          )}

          {showSuccessText && (
            <motion.div
              key="success-text"
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-heading text-glow text-4xl font-bold sm:text-5xl">
                Pemesanan Berhasil!
              </p>
              <p className="text-sm text-muted-foreground">
                Roket Anda telah lepas landas menuju Bulan.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Roket yang terbang */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ y: 0, x: "-50%" }}
        animate={
          countdown === null
            ? { y: "-125vh", rotate: [0, -2, 2, -1, 0] }
            : { y: [0, -8, 0] }
        }
        transition={
          countdown === null
            ? { duration: 3.1, ease: [0.5, 0, 0.85, 0.36] }
            : { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ willChange: "transform" }}
      >
        <RocketIllustration
          variant={rocketId}
          flame={countdown === null}
          className="h-64 w-auto drop-shadow-[0_0_50px_rgba(167,139,250,0.45)] sm:h-80"
          title="Roket SpaceX meluncur"
        />

        {/* Partikel knalpot */}
        {countdown === null && (
          <div aria-hidden="true" className="absolute inset-x-0 top-full -mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="animate-exhaust absolute left-1/2 -translate-x-1/2 rounded-full bg-primary/30 blur-md"
                style={
                  {
                    width: `${18 + i * 7}px`,
                    height: `${18 + i * 7}px`,
                    marginLeft: `${(i - 2) * 16}px`,
                    "--ex-delay": `${i * 0.18}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function RocketLaunchOverlay() {
  const isLaunching = useLaunchStore((s) => s.isLaunching);
  const finishLaunch = useLaunchStore((s) => s.finishLaunch);
  const rocketId = useLaunchStore((s) => s.data?.rocketId ?? "z1150");

  return (
    <AnimatePresence>
      {isLaunching && (
        <LaunchStage key="launch-stage" rocketId={rocketId} onFinish={finishLaunch} />
      )}
    </AnimatePresence>
  );
}
