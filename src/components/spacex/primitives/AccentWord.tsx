import { cn } from "@/lib/utils";

/**
 * Kata kunci aksen editorial — serif italic dengan kilau perak/emas.
 * Pakai untuk SATU kata per heading (mis. "Bulan").
 */
export function AccentWord({
  children,
  shimmer = true,
  className,
}: {
  children: React.ReactNode;
  /** Aktifkan kilau gradient perlahan (nonaktifkan saat reduced-motion global). */
  shimmer?: boolean;
  className?: string;
}) {
  return (
    <em
      className={cn(
        "font-accent pr-[0.08em]",
        shimmer ? "text-shimmer" : "text-gold-light",
        className
      )}
    >
      {children}
    </em>
  );
}
