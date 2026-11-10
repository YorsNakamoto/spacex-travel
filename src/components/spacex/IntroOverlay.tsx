"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";
import { siteConfig } from "@/config/site";

gsap.registerPlugin();

/**
 * OPENING — "System Check → Countdown → Liftoff" (±4,4 detik)
 * 0.0–0.3  bintang fade-in + grain
 * 0.3–1.8  HUD "PEMERIKSAAN SISTEM": counter 000→214, garis progres,
 *          4 status ✓ berurutan (digate pemuatan font/aset, min tercapai dari durasi tetap)
 * 1.8–2.7  countdown 3-2-1 roll bertopeng + cincin SVG menggambar (penuh di "1")
 * 2.7–3.6  wordmark SPACEX (tracking lebar→rapat, blur→tajam), cahaya mesin,
 *          bintang warp sekejap
 * 3.5–4.5  layer intro terangkat ke atas mengungkap hero (power4.inOut)
 *
 * Aturan: sekali per sesi (sessionStorage "spx-intro"), skip bila URL punya
 * hash selain #beranda, tombol "LEWATI" sejak detik 0, scroll terkunci,
 * reduced-motion → fade 400ms. Keputusan skip diambil skrip pra-hidrasi
 * di layout (class html.intro-skip / html.intro-pending) agar tanpa flash.
 * Event "spx:intro-lift" dikirim tepat sebelum layer terangkat (dipakai
 * hero Fase 4 untuk menyinkronkan entrance-nya).
 */

const CHECKS = ["Mesin utama", "Navigasi", "Penopang kehidupan", "Komunikasi"];
const SESSION_KEY = "spx-intro";

/** PRNG berbibit — posisi bintang deterministik (aman SSR/hydration). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + (t >>> 7) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INTRO_STARS = Array.from({ length: 42 }, ((rand = mulberry32(7)) => () => ({
  left: (rand() * 100).toFixed(2),
  top: (rand() * 100).toFixed(2),
  size: (1 + rand() * 1.6).toFixed(2),
  delay: (rand() * 0.2).toFixed(2),
}))());

const WARP_STARS = Array.from({ length: 26 }, ((rand = mulberry32(23)) => () => ({
  left: (rand() * 100).toFixed(1),
  width: (1 + rand() * 2).toFixed(1),
  duration: (0.5 + rand() * 0.4).toFixed(2),
  delay: (rand() * 0.3).toFixed(2),
}))());

/** Ring SVG: keliling lingkaran r=64. */
const RING_R = 64;
const RING_C = 2 * Math.PI * RING_R;

/** Janji siapnya aset nyata (font + seluruh resource window) untuk gate progres. */
function whenAssetsReady(): Promise<void> {
  const fontsReady: Promise<unknown> =
    typeof document !== "undefined" && "fonts" in document
      ? (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
      : Promise.resolve();
  const windowLoaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true })
        );
  return Promise.all([fontsReady, windowLoaded]).then(() => undefined);
}

/** Gate aset dengan batas keras — intro tidak pernah menunggu >2s tambahan. */
function assetsGate(): Promise<void> {
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  return Promise.race([whenAssetsReady(), sleep(2000)]);
}

export function IntroOverlay() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const html = document.documentElement;
      const unlock = () => {
        document.body.style.overflow = "";
      };
      const markDone = () => {
        html.classList.remove("intro-pending"); // buka kunci scroll CSS
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* storage bisa saja diblokir — abaikan */
        }
      };

      // ---- Skip pra-hidrasi (repeat visit / hash ≠ #beranda) ----
      if (!html.classList.contains("intro-pending")) {
        setMounted(false);
        window.dispatchEvent(new CustomEvent("spx:intro-done"));
        return;
      }

      // ---- Reduced-motion → fade 400ms ----
      if (prefersReducedMotion()) {
        markDone();
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.4,
          onComplete: () => {
            setMounted(false);
            window.dispatchEvent(new CustomEvent("spx:intro-done"));
          },
        });
        return;
      }

      // ---- Jalur pemutaran penuh ----
      document.body.style.overflow = "hidden";
      let finished = false;
      let lifted = false;
      const q = gsap.utils.selector(root);

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          finished = true;
          lifted = true;
          unlock();
          setMounted(false);
          window.dispatchEvent(new CustomEvent("spx:intro-done"));
        },
      });

      // 0–0.3s · bintang & grain fade-in
      tl.fromTo(
        q("[data-intro-stars]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 },
        0
      );

      // 0.3–1.8s · PEMERIKSAAN SISTEM
      tl.fromTo(
        q("[data-hud]"),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35 },
        0.3
      );

      const counter = { v: 0 };
      const counterEl = root.querySelector("[data-counter]");
      tl.to(
        counter,
        {
          v: siteConfig.stats.systemChecks,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counterEl) {
              counterEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
            }
          },
        },
        0.3
      );

      tl.fromTo(
        q("[data-progressline]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "none" },
        0.3
      );

      tl.fromTo(
        q("[data-check]"),
        { autoAlpha: 0, x: -10 },
        { autoAlpha: 1, x: 0, duration: 0.22, stagger: 0.18 },
        0.55
      );

      // Gate: tunggu aset nyata (maks 2s ekstra) bila belum siap di detik 1,8
      const assets = assetsGate();
      tl.addPause(1.8, () => {
        assets.then(() => {
          if (!finished && tl.paused()) tl.play();
        });
      });

      // 1.8–2.7s · countdown 3-2-1 (roll bertopeng) + cincin menggambar
      tl.to(q("[data-hud]"), { autoAlpha: 0, y: -10, duration: 0.25 }, 1.8);
      tl.fromTo(
        q("[data-countwrap]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.15 },
        1.8
      );
      tl.fromTo(
        q("[data-ring]"),
        { strokeDashoffset: RING_C },
        { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" },
        1.8
      );

      (["3", "2", "1"] as const).forEach((digit, i) => {
        const el = root.querySelector<HTMLElement>(`[data-digit="${digit}"]`);
        if (!el) return;
        const t = 1.8 + i * 0.3;
        tl.fromTo(
          el,
          { yPercent: 130, autoAlpha: 1 },
          { yPercent: 0, duration: 0.24, ease: "power3.out" },
          t
        );
        if (digit !== "1") {
          tl.to(el, { yPercent: -130, duration: 0.2, ease: "power2.in" }, t + 0.27);
        }
      });

      // 2.7–3.6s · wordmark + cahaya mesin + warp
      tl.to(q("[data-countwrap]"), { autoAlpha: 0, scale: 1.08, duration: 0.3 }, 2.7);
      tl.fromTo(
        q("[data-wordmark]"),
        {
          autoAlpha: 0,
          letterSpacing: "0.9em",
          filter: "blur(14px)",
        },
        {
          autoAlpha: 1,
          letterSpacing: "0.32em",
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power3.out",
        },
        2.75
      );
      tl.fromTo(q("[data-tagline]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.05);
      tl.fromTo(
        q("[data-enginelight]"),
        { scaleY: 0, autoAlpha: 0 },
        { scaleY: 1, autoAlpha: 1, duration: 0.6, ease: "power2.in", transformOrigin: "bottom center" },
        2.85
      );
      tl.set(q("[data-warp]"), { display: "block" }, 2.8);
      tl.fromTo(q("[data-warp]"), { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.12 }, 2.82);
      tl.to(q("[data-warp]"), { autoAlpha: 0, duration: 0.5 }, 3.2);

      // 3.5–4.45s · layer terangkat mengungkap hero
      tl.call(
        () => {
          lifted = true;
          markDone();
          window.dispatchEvent(new CustomEvent("spx:intro-lift"));
        },
        undefined,
        3.5
      );
      tl.to(
        root,
        { yPercent: -100, duration: 0.95, ease: "power4.inOut" },
        3.5
      );

      // Tombol LEWATI: langsung selesai dengan fade singkat
      const skip = () => {
        if (finished) return;
        finished = true;
        tl.kill();
        unlock();
        markDone();
        if (!lifted) window.dispatchEvent(new CustomEvent("spx:intro-lift"));
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.4,
          onComplete: () => {
            setMounted(false);
            window.dispatchEvent(new CustomEvent("spx:intro-done"));
          },
        });
      };
      skipRef.current = skip;
    },
    { scope: rootRef }
  );

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      data-intro-overlay
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#05070D]"
      role="dialog"
      aria-label="Animasi pembuka SpaceX"
    >
      {/* Bintang kecil */}
      <div data-intro-stars className="absolute inset-0 opacity-0" aria-hidden="true">
        {INTRO_STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--star)]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Warp bintang (momen liftoff) */}
      <div data-warp className="absolute inset-0 hidden" aria-hidden="true">
        {WARP_STARS.map((s, i) => (
          <span
            key={i}
            className="animate-warp absolute top-0 bg-gradient-to-b from-transparent via-white/80 to-transparent"
            style={{
              left: `${s.left}%`,
              width: `${s.width}px`,
              height: "22vh",
              ["--warp-duration" as string]: `${s.duration}s`,
              ["--warp-delay" as string]: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Cahaya mesin dari bawah */}
      <div
        data-enginelight
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.28),transparent)] blur-3xl"
        aria-hidden="true"
      />

      {/* Grain halus */}
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* HUD PEMERIKSAAN SISTEM */}
      <div data-hud className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 opacity-0">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-baseline justify-between font-hud text-[11px] text-muted-foreground">
            <span>Pemeriksaan Sistem</span>
            <span className="tnum text-ice" data-counter>
              000
            </span>
          </div>
          <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
            <div
              data-progressline
              className="h-full w-full origin-left bg-gradient-to-r from-ice-deep to-ice"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {CHECKS.map((label) => (
              <li
                key={label}
                data-check
                className="flex items-center justify-between gap-2 font-hud text-[10px] text-muted-foreground opacity-0"
              >
                <span>{label}</span>
                <span className="text-success">✓</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COUNTDOWN 3-2-1 + cincin */}
      <div data-countwrap className="absolute inset-0 flex items-center justify-center opacity-0">
        <svg
          viewBox={`0 0 ${RING_R * 2 + 24} ${RING_R * 2 + 24}`}
          className="absolute h-56 w-56 -rotate-90"
          aria-hidden="true"
        >
          <circle
            data-ring
            cx={RING_R + 12}
            cy={RING_R + 12}
            r={RING_R}
            fill="none"
            stroke="var(--ice)"
            strokeWidth="1.5"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C}
            strokeLinecap="round"
          />
        </svg>
        <div className="relative h-40 w-28 overflow-hidden">
          {(["3", "2", "1"] as const).map((digit) => (
            <span
              key={digit}
              data-digit={digit}
              className="font-heading absolute inset-0 flex items-center justify-center text-[7rem] font-extralight leading-none text-foreground/90 will-change-transform"
              style={{ transform: "translateY(130%)", visibility: "hidden" }}
              aria-hidden="true"
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      {/* WORDMARK */}
      <div className="relative flex flex-col items-center gap-3 text-center">
        <p
          data-wordmark
          className="font-heading text-4xl font-bold text-foreground opacity-0 sm:text-5xl"
          style={{ letterSpacing: "0.9em", paddingLeft: "0.9em" }}
        >
          {siteConfig.wordmark}
        </p>
        <p data-tagline className="font-hud text-[10px] text-muted-foreground opacity-0">
          {siteConfig.tagline}
        </p>
      </div>

      {/* Tombol Lewati */}
      <button
        type="button"
        onClick={() => skipRef.current?.()}
        className="glass absolute right-5 top-5 rounded-full border border-white/10 px-4 py-2 font-hud text-[10px] text-muted-foreground transition-colors hover:border-ice/40 hover:text-foreground"
      >
        Lewati
      </button>
    </div>
  );
}
