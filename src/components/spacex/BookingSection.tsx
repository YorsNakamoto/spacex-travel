"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SectionHeading } from "./SectionHeading";
import { RocketIllustration } from "./RocketIllustration";
import { FloatingInput } from "./primitives/FloatingInput";
import { RadioCard } from "./primitives/RadioCard";
import { rocketModels, formatRupiah } from "@/config/rockets";
import { useLaunchStore, type BookingSuccessData } from "@/store/launch-store";
import { siteConfig } from "@/config/site";
import { easings } from "@/lib/motion";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Rocket,
  MessageSquareText,
  Loader2,
  Send,
  Info,
  Minus,
  Plus,
} from "lucide-react";

const bookingFormSchema = z.object({
  fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter").max(100),
  email: z.string().trim().email("Format email tidak valid"),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor telepon minimal 9 digit")
    .regex(/^[+0-9()\-\s]+$/, "Nomor telepon hanya boleh berisi angka"),
  rocketModel: z.enum(["z1150", "special000"], {
    message: "Pilih salah satu model roket",
  }),
  departureDate: z
    .string()
    .min(1, "Tanggal keberangkatan wajib diisi")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Tanggal tidak valid")
    .refine(
      (v) => new Date(v).getTime() > Date.now() - 86_400_000,
      "Tanggal keberangkatan minimal hari ini"
    ),
  passengers: z.string(),
  notes: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().or(z.literal("")),
  // Honeypot anti-spam — wajib kosong (manusia tidak melihat kolom ini)
  website: z.string().max(0).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingSection() {
  const { toast } = useToast();
  const launch = useLaunchStore((s) => s.launch);
  const rootRef = useRef<HTMLElement>(null);
  const passRef = useRef<HTMLDivElement>(null);
  const [stamped, setStamped] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      rocketModel: undefined,
      departureDate: "",
      passengers: "1",
      notes: "",
      website: "",
    },
  });

  // Pre-select model roket saat pengguna menekan "Pesan Model Ini" di bagian harga
  // (delegasi klik [data-rocket-select] — mekanisme lama dipertahankan)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest?.(
        "[data-rocket-select]"
      ) as HTMLElement | null;
      if (target) {
        const id = target.getAttribute("data-rocket-select");
        if (id === "z1150" || id === "special000") {
          setValue("rocketModel", id, { shouldValidate: true });
          // Flash pada kartu radio yang dipilih
          requestAnimationFrame(() => {
            const radio = document.querySelector(`[data-radio-id="${id}"]`);
            radio?.animate(
              [
                { boxShadow: "0 0 0 0 rgba(125,211,252,0)" },
                { boxShadow: "0 0 34px 2px rgba(125,211,252,0.45)" },
                { boxShadow: "0 0 0 0 rgba(125,211,252,0)" },
              ],
              { duration: 900, easing: "cubic-bezier(0.16,1,0.3,1)" }
            );
          });
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setValue]);

  const selectedModelId = useWatch({ control, name: "rocketModel" });
  const passengers = useWatch({ control, name: "passengers" });
  const honeypot = watch("website");

  const selectedModel = useMemo(
    () => rocketModels.find((r) => r.id === selectedModelId),
    [selectedModelId]
  );

  const estimate = useMemo(() => {
    if (!selectedModel) return null;
    const count = Number(passengers) || 1;
    return {
      name: selectedModel.name,
      total: selectedModel.price * count,
      totalLabel: formatRupiah(selectedModel.price * count),
      count,
    };
  }, [selectedModel, passengers]);

  const today = new Date().toISOString().split("T")[0];

  // Aksen aktif berganti mengikuti model terpilih (ice ↔ gold)
  const accentActive =
    selectedModelId === "special000"
      ? { "--accent-active": "var(--gold)", "--accent-active-soft": "rgba(232,194,122,0.16)" }
      : {
          "--accent-active": "var(--ice)",
          "--accent-active-soft": "rgba(125,211,252,0.14)",
        };

  // Error → shake halus pada boarding pass
  const shake = () => {
    if (!passRef.current || prefersReduced()) return;
    gsap.fromTo(
      passRef.current,
      { x: 0 },
      {
        x: 0,
        keyframes: [{ x: -7 }, { x: 7 }, { x: -4 }, { x: 4 }, { x: 0 }],
        duration: 0.45,
        ease: easings.out,
      }
    );
  };

  const onSubmit = async (values: BookingFormValues) => {
    // Honeypot terisi → kemungkinan bot: berhenti diam-diam
    if (honeypot) return;

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          rocketModel: values.rocketModel,
          departureDate: values.departureDate,
          passengers: Number(values.passengers),
          notes: values.notes,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        shake();
        toast({
          title: "Pemesanan gagal",
          description: result.message || "Silakan periksa kembali data Anda.",
          variant: "destructive",
        });
        return;
      }

      // Stempel TERKONFIRMASI menghantam tiket, lalu roket meluncur
      const successData: BookingSuccessData = {
        bookingCode: result.bookingCode,
        rocketName: result.rocketName,
        rocketId: result.rocketId,
        totalPriceLabel: result.totalPriceLabel,
        departureDate: result.departureDate,
        passengers: result.passengers,
        emailSent: result.emailSent,
        customerEmailSent: result.customerEmailSent === true,
        emailMessage: result.emailMessage,
        customerName: values.fullName,
        customerPhone: values.phone,
      };

      setStamped(true);
      window.setTimeout(() => launch(successData), 1100);
    } catch {
      shake();
      toast({
        title: "Koneksi bermasalah",
        description:
          "Tidak dapat menghubungi server. Silakan coba lagi atau chat admin via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const fieldClass =
    "h-11 rounded-xl border-white/10 bg-white/[0.04] text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:border-primary/50";

  return (
    <section
      id="pesan"
      ref={rootRef}
      style={accentActive as React.CSSProperties}
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Formulir pemesanan"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Pemesanan"
          title="Pesan perjalanan Anda ke Bulan"
          description={`Isi tiket di bawah — detail pemesanan akan otomatis terkirim ke email ${siteConfig.email} dan tim kami akan menghubungi Anda.`}
          accentWord="Bulan"
        />

        {/* BOARDING PASS */}
        <div
          ref={passRef}
          className="glass-card mx-auto mt-14 max-w-4xl overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          <div className="grid lg:grid-cols-[300px_1fr]">
            {/* ===== Stub kiri: rute & ringkasan ===== */}
            <aside className="relative border-b border-dashed border-white/15 bg-white/[0.02] p-7 lg:border-b-0 lg:border-r">
              <p className="font-hud text-[9px] text-muted-foreground">Boarding Pass · SpaceX</p>

              {/* Rute BUMI → BULAN */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold leading-none">BUMI</span>
                  <span className="mt-1 text-[10px] text-muted-foreground">Kosmodrom</span>
                </div>
                <div className="relative flex-1">
                  <span className="block h-px w-full border-t border-dashed border-white/25" />
                  <Rocket
                    className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[var(--accent-active)]"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-heading text-xl font-bold leading-none">BULAN</span>
                  <span className="mt-1 text-[10px] text-muted-foreground">Sea of Tranquility</span>
                </div>
              </div>

              {/* Ringkasan live */}
              <dl className="mt-7 space-y-3.5 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">Model Roket</dt>
                  <dd className="font-medium text-foreground">
                    {selectedModel ? selectedModel.name : <span className="text-muted-foreground/50">—</span>}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">Penumpang</dt>
                  <dd className="font-medium tnum text-foreground">{estimate?.count ?? 1} orang</dd>
                </div>
                <div className="border-t border-dashed border-white/15 pt-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Estimasi Total</dt>
                    <dd
                      className="font-heading tnum text-lg font-bold"
                      style={{ color: "var(--accent-active)" }}
                    >
                      {estimate ? estimate.totalLabel : "Rp—"}
                    </dd>
                  </div>
                </div>
              </dl>

              {/* Barcode dekoratif */}
              <div className="barcode mt-7 h-10 w-full opacity-40" aria-hidden="true" />
              <p className="font-hud mt-3 text-center text-[9px] text-muted-foreground/60">
                SPX · {siteConfig.whatsappDisplay}
              </p>

              {/* Stempel TERKONFIRMASI */}
              {stamped && (
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className="stamp-text -rotate-12 rounded-xl border-2 border-success/70 px-5 py-2 text-lg font-bold uppercase"
                    style={{ animation: "stamp-in .55s cubic-bezier(.34,1.56,.64,1) both" }}
                  >
                    Terkonfirmasi
                  </span>
                </div>
              )}
            </aside>

            {/* ===== Form kanan ===== */}
            <div className="p-7">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Honeypot — tersembunyi dari manusia */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Jangan isi kolom ini</label>
                  <Input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
                </div>

                {/* Pilihan model roket */}
                <Controller
                  control={control}
                  name="rocketModel"
                  render={({ field }) => (
                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">
                        Model Roket <span className="text-[var(--accent-active)]">*</span>
                      </Label>
                      <div
                        role="radiogroup"
                        aria-label="Pilih model roket"
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {rocketModels.map((model) => {
                          const isGold = model.accent === "gold";
                          return (
                            <RadioCard
                              key={model.id}
                              radioId={model.id}
                              accent={isGold ? "gold" : "ice"}
                              checked={field.value === model.id}
                              onChange={() => field.onChange(model.id)}
                              ariaLabel={`Pilih ${model.name}, ${model.priceLabel} per penumpang`}
                            >
                              <span className="flex items-center gap-3 pr-8">
                                <RocketIllustration
                                  variant={model.id}
                                  className="h-14 w-auto shrink-0"
                                  title={`Roket ${model.name}`}
                                />
                                <span className="flex flex-col">
                                  <span className="font-heading text-sm font-semibold leading-tight">
                                    {model.name}
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${
                                      isGold ? "text-gold-light" : "text-ice"
                                    }`}
                                  >
                                    {model.priceLabel}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {model.duration}
                                  </span>
                                </span>
                              </span>
                            </RadioCard>
                          );
                        })}
                      </div>
                      {errors.rocketModel && (
                        <p className="text-sm text-destructive" role="alert">
                          {errors.rocketModel.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FloatingInput
                      id="fullName"
                      label="Nama Lengkap *"
                      autoComplete="name"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="email"
                      type="email"
                      label="Email *"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      label="Nomor Telepon / WhatsApp *"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="departureDate"
                      type="date"
                      label="Tanggal Keberangkatan *"
                      min={today}
                      error={errors.departureDate?.message}
                      {...register("departureDate")}
                    />
                  </div>

                  {/* Stepper jumlah penumpang */}
                  <div className="sm:col-span-2">
                    <Label className="mb-2 block text-sm font-medium">
                      Jumlah Penumpang <span className="text-[var(--accent-active)]">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="passengers"
                      render={({ field }) => {
                        const n = Number(field.value) || 1;
                        return (
                          <div className="flex h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-2">
                            <button
                              type="button"
                              onClick={() => field.onChange(String(Math.max(1, n - 1)))}
                              disabled={n <= 1}
                              aria-label="Kurangi penumpang"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-colors hover:border-[var(--accent-active)]/40 hover:text-foreground disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <p className="flex items-baseline gap-2">
                              <span className="font-heading tnum text-xl font-bold">{n}</span>
                              <span className="text-xs text-muted-foreground">
                                penumpang — maksimal 4 per pemesanan
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() => field.onChange(String(Math.min(4, n + 1)))}
                              disabled={n >= 4}
                              aria-label="Tambah penumpang"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-colors hover:border-[var(--accent-active)]/40 hover:text-foreground disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="notes" className="mb-2 block text-sm font-medium">
                      <MessageSquareText
                        className="mr-1.5 inline h-3.5 w-3.5 text-[var(--accent-active)]"
                        aria-hidden="true"
                      />
                      Catatan Khusus{" "}
                      <span className="text-muted-foreground">(opsional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="cth: saya ingin kursi dekat jendela, ulang tahun di Bulan, dsb."
                      rows={3}
                      className="min-h-[88px] resize-none rounded-xl border-white/10 bg-white/[0.04] placeholder:text-muted-foreground/60 focus-visible:border-[var(--accent-active)]"
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <p className="mt-1.5 text-sm text-destructive" role="alert">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info pengiriman email */}
                <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-active)]" aria-hidden="true" />
                  Detail pemesanan otomatis terkirim ke email perusahaan{" "}
                  <strong className="font-medium text-foreground">{siteConfig.email}</strong> dan
                  bukti pemesanan dikirim ke email Anda. Untuk respons tercepat, konfirmasi juga
                  melalui WhatsApp admin{" "}
                  <strong className="font-medium text-foreground">{siteConfig.whatsappDisplay}</strong>.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-13 w-full rounded-full py-3.5 text-base font-semibold shadow-[0_0_36px_-8px_var(--accent-active)] transition-all hover:shadow-[0_0_48px_-6px_var(--accent-active)] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Memproses Pemesanan…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                      Konfirmasi Pemesanan
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
