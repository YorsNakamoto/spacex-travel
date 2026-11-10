/**
 * Ilustrasi roket SVG minimalis yang dipakai di berbagai bagian situs
 * (hero, kartu harga, dan animasi peluncuran).
 */
type RocketIllustrationProps = {
  variant?: "z1150" | "special000" | "hero";
  className?: string;
  /** tampilkan api knalpot */
  flame?: boolean;
  /** animasi api berkobar */
  animatedFlame?: boolean;
  title?: string;
};

export function RocketIllustration({
  variant = "z1150",
  className,
  flame = false,
  animatedFlame = true,
  title,
}: RocketIllustrationProps) {
  const palettes = {
    // Roket putih keunguan — SpaceX Z1150
    z1150: {
      body: "url(#bodyZ1150)",
      bodyStroke: "#c4b5fd",
      nose: "#a78bfa",
      window: "#151528",
      windowRing: "#a78bfa",
      fin: "#8b5cf6",
      nozzle: "#3f3f5c",
      flameOuter: "#f97316",
      flameMid: "#fbbf24",
      flameCore: "#fef3c7",
    },
    // Roket hitam beraksen emas — SpaceX Special 000
    special000: {
      body: "url(#bodyS000)",
      bodyStroke: "#d4af37",
      nose: "#eab308",
      window: "#101018",
      windowRing: "#eab308",
      fin: "#b8912f",
      nozzle: "#55552e",
      flameOuter: "#f59e0b",
      flameMid: "#fde047",
      flameCore: "#fffbeb",
    },
    // Roket putih bersih untuk hero
    hero: {
      body: "url(#bodyHero)",
      bodyStroke: "#e2e2f5",
      nose: "#a78bfa",
      window: "#151528",
      windowRing: "#a78bfa",
      fin: "#8b5cf6",
      nozzle: "#3f3f5c",
      flameOuter: "#f97316",
      flameMid: "#fbbf24",
      flameCore: "#fef3c7",
    },
  } as const;

  const p = palettes[variant];
  const flameId = `flame-${variant}`;

  return (
    <svg
      viewBox="0 0 160 320"
      className={className}
      role="img"
      aria-label={title || "Ilustrasi roket SpaceX"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyZ1150" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6e6f7" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfcfee" />
        </linearGradient>
        <linearGradient id="bodyS000" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1c2e" />
          <stop offset="0.5" stopColor="#32324a" />
          <stop offset="1" stopColor="#14141f" />
        </linearGradient>
        <linearGradient id="bodyHero" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dcdcf0" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9c9e8" />
        </linearGradient>
        <linearGradient id={flameId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.flameOuter} />
          <stop offset="0.55" stopColor={p.flameMid} />
          <stop offset="1" stopColor={p.flameCore} />
        </linearGradient>
        <radialGradient id="flameGlow" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor={p.flameMid} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.flameMid} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Api knalpot */}
      {flame && (
        <g className={animatedFlame ? "animate-flame" : undefined}>
          <ellipse cx="80" cy="292" rx="34" ry="26" fill="url(#flameGlow)" />
          <path
            d="M62 276 C62 300 72 316 80 316 C88 316 98 300 98 276 Z"
            fill={`url(#${flameId})`}
          />
          <path
            d="M70 276 C70 292 76 302 80 302 C84 302 90 292 90 276 Z"
            fill={p.flameCore}
            opacity="0.9"
          />
        </g>
      )}

      {/* Sirip kiri & kanan */}
      <path d="M42 208 C30 226 26 248 26 266 L46 252 Z" fill={p.fin} />
      <path d="M118 208 C130 226 134 248 134 266 L114 252 Z" fill={p.fin} />

      {/* Badan roket */}
      <path
        d="M80 8 C106 40 112 84 112 130 L112 236 C112 244 108 250 100 252 L60 252 C52 250 48 244 48 236 L48 130 C48 84 54 40 80 8 Z"
        fill={p.body}
        stroke={p.bodyStroke}
        strokeWidth="1.5"
      />

      {/* Kerucut hidung */}
      <path d="M80 8 C92 23 99 42 103 64 L57 64 C61 42 68 23 80 8 Z" fill={p.nose} />

      {/* Jendela */}
      <circle cx="80" cy="118" r="24" fill={p.window} stroke={p.windowRing} strokeWidth="5" />
      <circle cx="73" cy="111" r="7" fill="#ffffff" opacity="0.35" />

      {/* Garis aksen badan */}
      <path d="M52 176 L108 176" stroke={p.windowRing} strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* Nozzle mesin */}
      <path d="M62 252 L98 252 L94 270 L66 270 Z" fill={p.nozzle} />
    </svg>
  );
}
