/**
 * Uji visual otomatis website SpaceX menggunakan Playwright.
 * Memeriksa: halaman utama, menu hamburger, form pemesanan,
 * animasi roket terbang, dan dialog sukses.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];
const shot = (name) => `test-artifacts/${name}.png`;

function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} — ${name}${detail ? ` (${detail})` : ""}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  // 1) Buka beranda + tunggu intro selesai
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3500); // intro overlay ~2.8s
  await page.screenshot({ path: shot("01-beranda") });

  const title = await page.title();
  log("Judul halaman", title.includes("SpaceX"), title);

  const navVisible = await page.getByRole("navigation", { name: "Navigasi utama" }).isVisible();
  log("Navbar tampil di atas", navVisible);

  // 2) Menu garis-3 (hamburger)
  await page.getByRole("button", { name: "Buka menu fitur website" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot("02-menu-garis3") });
  const menuText = await page.getByText("Fitur Website").isVisible();
  log("Menu garis-3 berisi daftar fitur", menuText);
  const waInMenu = await page.getByText("Chat Admin — 0823-1096-4091").first().isVisible();
  log("Kontak WhatsApp di menu", waInMenu);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 3) Bagian tim — nama-nama sesuai perintah
  await page.locator("#tim").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: shot("03-tim") });
  for (const name of ["Maxentyo Raja S", "R Adhitya", "Firas Al Fatih", "Muhammad Iqbal"]) {
    const visible = await page.getByText(name, { exact: true }).first().isVisible();
    log(`Tim: ${name}`, visible);
  }

  // 4) Bagian harga — dua model roket
  await page.locator("#harga").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: shot("04-harga") });
  const z1150 = await page.getByText("SpaceX Z1150").first().isVisible();
  const special = await page.getByText("SpaceX Special 000").first().isVisible();
  log("Pricing: SpaceX Z1150", z1150);
  log("Pricing: SpaceX Special 000", special);

  // 5) Form pemesanan — isi lengkap dan kirim
  await page.locator("#pesan").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.getByRole("radio", { name: /SpaceX Special 000/ }).click();
  await page.fill("#fullName", "Test Visual Playwright");
  await page.fill("#email", "tes.visual@example.com");
  await page.fill("#phone", "081234567890");
  const tomorrow = new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0];
  await page.fill("#departureDate", tomorrow);
  await page.screenshot({ path: shot("05-form-terisi") });

  // Tangkap respons jaringan API booking
  const apiResponsePromise = page.waitForResponse((r) => r.url().includes("/api/booking"), { timeout: 30000 });
  await page.getByRole("button", { name: "Konfirmasi Pemesanan" }).click();
  const apiResponse = await apiResponsePromise;
  const body = await apiResponse.json();
  log("API booking sukses", body.success === true, `kode=${body.bookingCode}`);

  // 6) Animasi roket terbang (countdown → meluncur)
  await page.waitForTimeout(900);
  await page.screenshot({ path: shot("06-animasi-countdown") });
  const overlayVisible = await page.getByRole("status", { name: /Animasi peluncuran/ }).isVisible().catch(() => false);
  log("Overlay animasi roket muncul", overlayVisible);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: shot("07-animasi-meluncur") });

  // 7) Dialog sukses
  await page.waitForTimeout(3500);
  await page.screenshot({ path: shot("08-dialog-sukses") });
  const successText = await page.getByText("Pemesanan Berhasil").first().isVisible().catch(() => false);
  log("Dialog 'Pemesanan Berhasil!' tampil", successText);
  const bookingCodeShown = await page.getByText(`SPX-`).first().isVisible().catch(() => false);
  log("Kode booking tampil di dialog", bookingCodeShown);

  // 8) Tombol WhatsApp mengambang
  const waFloat = await page.locator('a[href*="wa.me"]').first().isVisible();
  const waHref = await page.locator('a[href*="wa.me"]').first().getAttribute("href");
  log("Tombol WhatsApp float", waFloat && waHref.includes("6282310964091"), waHref || "");
} catch (err) {
  console.error("ERROR:", err.message);
  await page.screenshot({ path: shot("99-error") }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== RINGKASAN: ${results.length - failed.length}/${results.length} lulus ===`);
}
