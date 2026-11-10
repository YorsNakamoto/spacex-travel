"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SectionHeading } from "./SectionHeading";
import { RocketIllustration } from "./RocketIllustration";
import { rocketModels, formatRupiah } from "@/config/rockets";
import { useLaunchStore, type BookingSuccessData } from "@/store/launch-store";
import { siteConfig } from "@/config/site";
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
  passengers: z.string().default("1"),
  notes: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().or(z.literal("")),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingSection() {
  const { toast } = useToast();
  const launch = useLaunchStore((s) => s.launch);

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
    },
  });

  // Pre-select model roket saat pengguna menekan tombol "Pesan Model Ini" di bagian harga
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest?.(
        "[data-rocket-select]"
      ) as HTMLElement | null;
      if (target) {
        const id = target.getAttribute("data-rocket-select");
        if (id === "z1150" || id === "special000") {
          setValue("rocketModel", id, { shouldValidate: true });
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setValue]);

  const selectedModel = useWatch({ control, name: "rocketModel" });
  const passengers = useWatch({ control, name: "passengers" });

  const estimate = useMemo(() => {
    const model = rocketModels.find((r) => r.id === selectedModel);
    if (!model) return null;
    const count = Number(passengers) || 1;
    return {
      name: model.name,
      total: model.price * count,
      totalLabel: formatRupiah(model.price * count),
      count,
    };
  }, [selectedModel, passengers]);

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          passengers: Number(values.passengers),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          title: "Pemesanan gagal",
          description: result.message || "Silakan periksa kembali data Anda.",
          variant: "destructive",
        });
        return;
      }

      // Pemesanan sukses → picu animasi roket terbang, lalu dialog konfirmasi
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
      launch(successData);
    } catch {
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
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Formulir pemesanan"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute left-1/2 top-24 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pemesanan"
          title="Pesan perjalanan Anda ke Bulan"
          description={`Isi formulir di bawah — detail pemesanan akan otomatis terkirim ke email ${siteConfig.email} dan tim kami akan menghubungi Anda.`}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12"
        >
          <Card className="overflow-hidden rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur">
            <CardHeader className="space-y-1.5 p-7 pb-4">
              <CardTitle className="font-heading flex items-center gap-2.5 text-xl">
                <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />
                Formulir Pemesanan Tiket
              </CardTitle>
              <CardDescription>
                Semua kolom bertanda * wajib diisi. Pemesanan terkonfirmasi setelah tim kami menghubungi Anda.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-7 pt-0">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Pilihan model roket */}
                <Controller
                  control={control}
                  name="rocketModel"
                  render={({ field }) => (
                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">
                        Model Roket <span className="text-primary">*</span>
                      </Label>
                      <div
                        role="radiogroup"
                        aria-label="Pilih model roket"
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {rocketModels.map((model) => {
                          const isSelected = field.value === model.id;
                          const isGold = model.accent === "gold";
                          return (
                            <button
                              type="button"
                              key={model.id}
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => field.onChange(model.id)}
                              className={`group relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                                isSelected
                                  ? isGold
                                    ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 shadow-[0_0_28px_-8px_var(--gold)]"
                                    : "border-primary/60 bg-primary/10 shadow-[0_0_28px_-8px_var(--primary)]"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                              }`}
                            >
                              <span className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  {model.series}
                                </span>
                                <span
                                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors ${
                                    isSelected
                                      ? isGold
                                        ? "border-[var(--gold)] bg-[var(--gold)]"
                                        : "border-primary bg-primary"
                                      : "border-white/25"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                                  )}
                                </span>
                              </span>
                              <span className="flex items-center gap-3">
                                <RocketIllustration
                                  variant={model.id}
                                  className="h-14 w-auto shrink-0"
                                  title={`Roket ${model.name}`}
                                />
                                <span className="flex flex-col">
                                  <span className="font-heading font-semibold leading-tight">
                                    {model.name}
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${
                                      isGold ? "text-[var(--gold-light)]" : "text-primary"
                                    }`}
                                  >
                                    {model.priceLabel}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {model.duration}
                                  </span>
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.rocketModel && (
                        <p className="text-sm text-destructive">{errors.rocketModel.message}</p>
                      )}
                    </div>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Nama lengkap */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      <User className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Nama Lengkap <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="cth: Budi Santoso"
                      autoComplete="name"
                      className={fieldClass}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      <Mail className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Email <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cth: nama@email.com"
                      autoComplete="email"
                      className={fieldClass}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Telepon */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      <Phone className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Nomor Telepon / WhatsApp <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="cth: 0812 3456 7890"
                      autoComplete="tel"
                      className={fieldClass}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Tanggal keberangkatan */}
                  <div className="space-y-2">
                    <Label htmlFor="departureDate" className="text-sm font-medium">
                      <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Tanggal Keberangkatan <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="departureDate"
                      type="date"
                      min={today}
                      className={`${fieldClass} [color-scheme:dark]`}
                      {...register("departureDate")}
                    />
                    {errors.departureDate && (
                      <p className="text-sm text-destructive">{errors.departureDate.message}</p>
                    )}
                  </div>

                  {/* Jumlah penumpang */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">
                      <Users className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Jumlah Penumpang <span className="text-primary">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="passengers"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <SelectTrigger className={`w-full ${fieldClass}`}>
                            <SelectValue placeholder="Pilih jumlah penumpang" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-[oklch(0.17_0.025_285)]">
                            {[1, 2, 3, 4].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} penumpang{n > 1 ? " — maksimal 4 per pemesanan" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Catatan */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      <MessageSquareText className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Catatan Khusus <span className="text-muted-foreground">(opsional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="cth: saya ingin kursi dekat jendela, ulang tahun di Bulan, dsb."
                      rows={3}
                      className="min-h-[88px] resize-none rounded-xl border-white/10 bg-white/[0.04] placeholder:text-muted-foreground/60 focus-visible:border-primary/50"
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive">{errors.notes.message}</p>
                    )}
                  </div>
                </div>

                {/* Estimasi harga */}
                {estimate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/[0.07] px-5 py-4"
                    aria-live="polite"
                  >
                    <span className="text-sm text-muted-foreground">
                      Estimasi total — {estimate.name} × {estimate.count} penumpang
                    </span>
                    <span className="font-heading text-lg font-bold text-primary">
                      {estimate.totalLabel}
                    </span>
                  </motion.div>
                )}

                {/* Info pengiriman email */}
                <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  Detail pemesanan otomatis terkirim ke email perusahaan{" "}
                  <span className="font-medium text-foreground">{siteConfig.email}</span>. Untuk
                  respons tercepat, konfirmasi juga melalui WhatsApp admin{" "}
                  <span className="font-medium text-foreground">{siteConfig.whatsappDisplay}</span>.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-13 w-full rounded-full py-3.5 text-base font-semibold shadow-[0_0_36px_-8px_var(--primary)] transition-all hover:shadow-[0_0_48px_-6px_var(--primary)] disabled:opacity-70"
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
