import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
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

/** Data lengkap satu pemesanan yang dikirim lewat email. */
type BookingEmailData = {
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string;
  rocketName: string;
  departureDate: string;
  passengers: number;
  notes?: string;
  totalPrice: number;
};

/** Buat baris tabel HTML untuk detail pemesanan. */
function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid #2a2440;color:#a8a2c4;font-size:13px;width:38%;">${label}</td>
    <td style="padding:10px 14px;border-bottom:1px solid #2a2440;color:#f0eefb;font-size:13px;font-weight:600;">${value}</td>
  </tr>`;
}

function bookingDetailsTable(data: BookingEmailData): string {
  return `<table style="border-collapse:collapse;width:100%;background:#171327;border:1px solid #2a2440;border-radius:12px;overflow:hidden;" cellpadding="0" cellspacing="0">
    ${detailRow("Kode Booking", `<span style="color:#a78bfa;font-size:15px;">${data.bookingCode}</span>`)}
    ${detailRow("Nama Lengkap", data.fullName)}
    ${detailRow("Email", data.email)}
    ${detailRow("Telepon / WhatsApp", data.phone)}
    ${detailRow("Model Roket", data.rocketName)}
    ${detailRow("Tanggal Keberangkatan", data.departureDate)}
    ${detailRow("Jumlah Penumpang", `${data.passengers} orang`)}
    ${detailRow("Catatan", data.notes || "-")}
    ${detailRow("Total Harga", formatRupiah(data.totalPrice))}
  </table>`;
}

function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<body style="margin:0;padding:0;background:#0d0b17;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#1a1530,#0d0b17);border:1px solid #2a2440;border-radius:16px 16px 0 0;">
      <div style="font-size:28px;">🚀</div>
      <div style="color:#f0eefb;font-size:20px;font-weight:bold;letter-spacing:4px;margin-top:6px;">SPACEX</div>
      <div style="color:#a8a2c4;font-size:12px;margin-top:4px;">Jasa Travel ke Bulan</div>
    </div>
    <div style="background:#12101f;border:1px solid #2a2440;border-top:none;border-radius:0 0 16px 16px;padding:28px 24px;">
      <h2 style="color:#f0eefb;font-size:18px;margin:0 0 16px;">${title}</h2>
      ${bodyHtml}
      <p style="color:#7d7799;font-size:11px;margin:24px 0 0;line-height:1.6;">
        Email otomatis dari sistem pemesanan SpaceX Travel — jangan balas email ini.<br>
        Butuh bantuan? Chat admin: ${siteConfig.whatsappDisplay} · ${siteConfig.email}
      </p>
    </div>
  </div>
</body>
</html>`;
}

/** Fallback lama: kirim notifikasi ke email perusahaan via FormSubmit (tanpa kredensial). */
async function sendCompanyEmailViaFormSubmit(data: BookingEmailData): Promise<boolean> {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${siteConfig.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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
        Catatan: data.notes || "-",
        "Total Harga": formatRupiah(data.totalPrice),
      }),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: string | boolean };
    return result.success === "true" || result.success === true;
  } catch {
    return false;
  }
}

/**
 * Kirim dua email via SMTP Gmail (nodemailer):
 * 1. Notifikasi lengkap ke email perusahaan (ceomxentyors@gmail.com).
 * 2. Bukti pemesanan ke email pembeli.
 * Bila SMTP belum dikonfigurasi, jatuh ke fallback FormSubmit (perusahaan saja).
 */
async function sendBookingEmails(
  data: BookingEmailData
): Promise<{ companySent: boolean; customerSent: boolean; message: string }> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // --- Jalur utama: SMTP Gmail dengan App Password ---
  if (smtpUser && smtpPass) {
    try {
      const smtpPort = Number(process.env.SMTP_PORT || 465);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Email 1 — notifikasi ke perusahaan
      await transporter.sendMail({
        from: `"SpaceX Booking" <${smtpUser}>`,
        to: siteConfig.email,
        replyTo: data.email,
        subject: `🚀 Pemesanan Baru ${data.bookingCode} — ${data.rocketName}`,
        html: emailShell(
          "Pemesanan Baru Masuk!",
          `<p style="color:#c9c4e2;font-size:13px;margin:0 0 16px;line-height:1.6;">
             Pelanggan baru saja memesan perjalanan ke Bulan. Segera hubungi pelanggan untuk konfirmasi.
           </p>
           ${bookingDetailsTable(data)}`
        ),
      });

      // Email 2 — bukti pemesanan ke pembeli
      await transporter.sendMail({
        from: `"SpaceX Travel" <${smtpUser}>`,
        to: data.email,
        subject: `✅ Bukti Pemesanan ${data.bookingCode} — Perjalanan Anda ke Bulan`,
        html: emailShell(
          `Terima kasih, ${data.fullName}!`,
          `<p style="color:#c9c4e2;font-size:13px;margin:0 0 16px;line-height:1.6;">
             Pemesanan perjalanan Anda ke Bulan telah kami terima. Simpan email ini sebagai
             bukti pemesanan. Tim kami akan segera menghubungi Anda untuk konfirmasi pembayaran
             dan jadwal pelatihan pra-penerbangan.
           </p>
           ${bookingDetailsTable(data)}
           <div style="margin-top:20px;padding:14px 16px;background:#1d1836;border:1px solid #2a2440;border-radius:12px;">
             <p style="color:#a8a2c4;font-size:12px;margin:0 0 8px;">Langkah selanjutnya:</p>
             <ol style="color:#c9c4e2;font-size:12px;margin:0;padding-left:18px;line-height:1.9;">
               <li>Simpan kode booking <b style="color:#a78bfa;">${data.bookingCode}</b> Anda.</li>
               <li>Konfirmasi cepat via WhatsApp admin: <b>${siteConfig.whatsappDisplay}</b>.</li>
               <li>Tim kami menghubungi Anda maksimal 1×24 jam.</li>
             </ol>
           </div>`
        ),
      });

      return {
        companySent: true,
        customerSent: true,
        message: "Email pemesanan terkirim ke perusahaan dan bukti dikirim ke email Anda.",
      };
    } catch (error) {
      console.error("[/api/booking] SMTP gagal:", error);
      // Jatuh ke fallback di bawah agar notifikasi perusahaan tetap berusaha terkirim.
    }
  }

  // --- Fallback: FormSubmit (hanya notifikasi perusahaan) ---
  const fallbackSent = await sendCompanyEmailViaFormSubmit(data);
  const smtpHint = smtpUser && smtpPass ? "" : " (SMTP belum dikonfigurasi)";
  if (fallbackSent) {
    return {
      companySent: true,
      customerSent: false,
      message: `Notifikasi terkirim ke perusahaan${smtpHint}. Bukti email ke pembeli menunggu konfigurasi SMTP.`,
    };
  }
  return {
    companySent: false,
    customerSent: false,
    message: `Layanan email belum aktif${smtpHint}. Pemesanan tetap tercatat — hubungi admin via WhatsApp.`,
  };
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

    // 1) Simpan pemesanan ke database (non-fatal: bila database tidak
    //    tersedia, misal di lingkungan serverless, pemesanan tetap lanjut
    //    dan email tetap dikirim)
    let bookingId: string | null = null;
    try {
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
      bookingId = booking.id;
    } catch (dbError) {
      console.warn("[/api/booking] Database tidak tersedia, lanjut tanpa menyimpan:", dbError);
    }

    // 2) Kirim email otomatis: notifikasi ke perusahaan + bukti ke pembeli
    const emailResult = await sendBookingEmails({
      bookingCode,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      rocketName: rocket.name,
      departureDate: departureDateLabel,
      passengers: data.passengers,
      notes: data.notes,
      totalPrice,
    });

    if (emailResult.companySent && bookingId) {
      try {
        await db.booking.update({
          where: { id: bookingId },
          data: { emailSent: true, status: "MENUNGGU_KONFIRMASI" },
        });
      } catch (dbError) {
        console.warn("[/api/booking] Gagal memperbarui status email:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      bookingCode,
      rocketName: rocket.name,
      rocketId: rocket.id,
      priceLabel: rocket.priceLabel,
      totalPrice,
      totalPriceLabel: formatRupiah(totalPrice),
      departureDate: departureDateLabel,
      passengers: data.passengers,
      emailSent: emailResult.companySent,
      customerEmailSent: emailResult.customerSent,
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
