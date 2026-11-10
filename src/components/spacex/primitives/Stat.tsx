import { cn } from "@/lib/utils";

/** Statistik dengan angka tabular — CountUp disambungkan di Fase 2. */
export function Stat({
  value,
  label,
  unit,
  className,
  valueClassName,
}: {
  value: string | number;
  label: string;
  /** Satuan kecil di samping angka (mis. "km", "%"). */
  unit?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className={cn("font-heading tnum text-2xl font-bold text-foreground sm:text-3xl", valueClassName)}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>}
      </p>
      <p className="font-hud text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
