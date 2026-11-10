import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { getRocketById, formatRupiah } from "@/config/rockets";

/**
 * POST /api/booking
 * Menerima data pemesanan travel ke Bulan, menyimpannya ke database,
 * lalu mengirimkannya secara otomatis ke email perusahaan
 * (ceomxentyors@gmail.com) melalui layanan FormSubmit.
 */

const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama terlalu panjang"),
  email: z.string().trim().email("Format email tidak valid").max(150),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor telepon minimal 9 digit")
    .max(20, "Nomor telepon terlalu panjang")
    .regex(/^[+0-9()\-\s]+$/, "Nomor telepon hanya boleh berisi angka"),
  rocketModel: z.enum(["z1150", "special000"], {
    message: "Pilih salah satu model roket",
  }),
  departureDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Tanggal tidak valid")
    .refine(
      (v) => new Date(v).getTime() > Date.now() - 86_400_000,
      "Tanggal keberangkatan minimal hari ini"
    ),
  passengers: z.coerce
    .number()
    .int("Jumlah penumpang harus angka bulat")
    .min(1, "Minimal 1 penumpang")
    .max(4, "Maksimal 4 penumpang per pemesanan"),
  notes: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().or(z.literal("")),
});

function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SPX-${code}`;
}

function formatDateID(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

/** Kirim detail pemesanan ke email perusahaan via FormSubmit (tanpa perlu kredensial SMTP). */
async function sendBookingEmail(data: {
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string;
  rocketName: string;
  departureDate: string;
  passengers: number;
  notes?: string;
  totalPrice: number;
}): Promise<{ sent: boolean; message: string }> {
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${siteConfig.email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Pemesanan Baru ${data.bookingCode} — Travel ke Bulan SpaceX`,
          _template: "table",
          _captcha: "false",
          "Kode Booking": data.bookingCode,
          "Nama Lengkap": data.fullName,
          Email: data.email,
          Telepon: data.phone,
          "Model Roket": data.rocketName,
          "Tanggal Keberangkatan": data.departureDate,
          "Jumlah Penumpang": `${data.passengers} orang`,
          "Catatan": data.notes || "-",
          "Total Harga": formatRupiah(data.totalPrice),
        }),
      }
    );

    if (!response.ok) {
      return {
        sent: false,
        message: "Layanan email sedang tidak dapat dihubungi.",
      };
    }

    const result = (await response.json()) as { success?: string | boolean; message?: string };
    if (result.success === "true" || result.success === true) {
      return { sent: true, message: "Email pemesanan berhasil terkirim." };
    }
    return {
      sent: false,
      message:
        result.message ||
        "Email menunggu aktivasi: buka email perusahaan sekali untuk mengaktifkan pengiriman otomatis.",
    };
  } catch {
    return {
      sent: false,
      message: "Gagal menghubungi layanan email. Pemesanan tetap tersimpan.",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Data pemesanan tidak valid";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const rocket = getRocketById(data.rocketModel);
    if (!rocket) {
      return NextResponse.json(
        { success: false, message: "Model roket tidak dikenali" },
        { status: 400 }
      );
    }

    const bookingCode = generateBookingCode();
    const totalPrice = rocket.price * data.passengers;
    const departureDateLabel = formatDateID(data.departureDate);

    // 1) Simpan pemesanan ke database
    const booking = await db.booking.create({
      data: {
        bookingCode,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        rocketModel: rocket.name,
        departureDate: new Date(data.departureDate),
        passengers: data.passengers,
        notes: data.notes || null,
        status: "PENDING",
      },
    });

    // 2) Kirim email otomatis ke ceomxentyors@gmail.com
    const emailResult = await sendBookingEmail({
      bookingCode: booking.bookingCode,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      rocketName: rocket.name,
      departureDate: departureDateLabel,
      passengers: data.passengers,
      notes: data.notes,
      totalPrice,
    });

    if (emailResult.sent) {
      await db.booking.update({
        where: { id: booking.id },
        data: { emailSent: true, status: "MENUNGGU_KONFIRMASI" },
      });
    }

    return NextResponse.json({
      success: true,
      bookingCode: booking.bookingCode,
      rocketName: rocket.name,
      rocketId: rocket.id,
      priceLabel: rocket.priceLabel,
      totalPrice,
      totalPriceLabel: formatRupiah(totalPrice),
      departureDate: departureDateLabel,
      passengers: data.passengers,
      emailSent: emailResult.sent,
      emailMessage: emailResult.message,
    });
  } catch (error) {
    console.error("[/api/booking] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan saat memproses pemesanan. Silakan coba lagi atau hubungi admin via WhatsApp.",
      },
      { status: 500 }
    );
  }
}
