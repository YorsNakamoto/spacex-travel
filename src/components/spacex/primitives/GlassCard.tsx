import { cn } from "@/lib/utils";

/** Kartu kaca dasar: glass + hairline + radius 20px. Dasar Spotlight/Tilt di Fase 2. */
export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-card", className)} {...props}>
      {children}
    </div>
  );
}
