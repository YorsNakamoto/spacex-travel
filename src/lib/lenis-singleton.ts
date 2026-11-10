import type Lenis from "lenis";

/**
 * Singleton instance Lenis agar komponen lain (mis. intro overlay Fase 3)
 * bisa memanggil lenis.stop() / lenis.start() tanpa prop-drilling.
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
