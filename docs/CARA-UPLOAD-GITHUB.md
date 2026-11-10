# 🚀 Cara Upload Website SpaceX ke GitHub

Project ini sudah **100% selesai dan ter-commit di git** (branch `main`).
Tinggal 3 langkah singkat di bawah ini untuk menaruhnya di GitHub.

---

## Langkah 1 — Buat Repository di GitHub

1. Buka **https://github.com/new** (login dulu kalau diminta).
2. Isi **Repository name**, contoh: `spacex-travel`.
3. Pilih **Public** (agar bisa deploy gratis ke Vercel) atau Private.
4. **Jangan** centang "Add a README" — biarkan kosong semua.
5. Klik **Create repository**.

## Langkah 2 — Push Project

Salin-tempel perintah berikut di terminal (ganti `USERNAME` dengan username GitHub Anda dan sesuaikan nama repo):

```bash
cd /home/z/my-project
git remote add origin https://github.com/USERNAME/spacex-travel.git
git branch -M main
git push -u origin main
```

GitHub akan meminta login. Gunakan **Personal Access Token** sebagai password
(bukan password akun). Cara buat token: GitHub → Settings → Developer settings →
Personal access tokens → **Tokens (classic)** → Generate new token → centang `repo`.

> Alternatif tanpa token: install GitHub CLI lalu jalankan `gh auth login`,
> kemudian cukup `git push -u origin main`.

## Langkah 3 — Online-kan Website (Gratis, Vercel)

1. Buka **https://vercel.com** → login **with GitHub**.
2. **Add New → Project** → pilih repo `spacex-travel`.
3. Biarkan semua pengaturan default (Vercel otomatis mendeteksi Next.js).
4. Klik **Deploy** → tunggu ±1 menit → website online dengan URL seperti
   `https://spacex-travel.vercel.app`.

---

## ⚠️ Penting: Aktifkan Email Pemesanan (sekali saja)

Pemesanan otomatis dikirim ke **ceomxentyors@gmail.com** melalui layanan
**FormSubmit** (gratis, tanpa password email). Saat pertama kali ada pemesanan:

1. FormSubmit mengirim email konfirmasi ke `ceomxentyors@gmail.com`.
2. Buka email tersebut dan klik tombol **Activate**.
3. Selesai — semua pemesanan berikutnya masuk otomatis ke email tersebut.

## 📱 WhatsApp Admin

Tombol WhatsApp (floating hijau kanan-bawah) mengarah ke **0823-1096-4091**
(`wa.me/6282310964091`) dengan pesan sapaan yang sudah terisi otomatis.

## 🗂️ Data Pemesanan

Setiap pemesanan juga tersimpan di database SQLite (`db/custom.db`) — jadi
meski email gagal terkirim, data tidak hilang. Kode booking berformat
`SPX-XXXXXX`.
