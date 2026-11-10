"""SMTP catcher lokal untuk menguji pengiriman email booking.
Menerima semua email di port 1025 dan mencatatnya ke /tmp/smtp-caught.txt."""
import asyncio
from aiosmtpd.controller import Controller

COUNT = {"n": 0}

class Handler:
    async def handle_DATA(self, server, session, envelope):
        COUNT["n"] += 1
        with open("/tmp/smtp-caught.txt", "a") as f:
            f.write(f"\n===== EMAIL #{COUNT['n']} =====\n")
            f.write(f"FROM: {envelope.mail_from}\n")
            f.write(f"TO: {', '.join(envelope.rcpt_tos)}\n")
            content = envelope.content.decode("utf-8", errors="replace")
            # Cukup catat baris penting
            for line in content.splitlines():
                if line.startswith(("Subject:", "To:", "From:")):
                    f.write(line + "\n")
            for marker in ["Pemesanan Baru Masuk", "Terima kasih", "Bukti Pemesanan", "Kode Booking"]:
                if marker in content:
                    f.write(f"[KONTEN: mengandung '{marker}']\n")
        print(f"EMAIL #{COUNT['n']} diterima: {envelope.mail_from} -> {envelope.rcpt_tos}")
        return "250 Message accepted"

async def main():
    handler = Handler()
    controller = Controller(handler, hostname="127.0.0.1", port=1025)
    controller.start()
    print("SMTP catcher berjalan di port 1025...")
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
