"""Optimasi foto tim SpaceX: resize ke 600x800 (3:4), konversi JPEG, kompresi."""
from PIL import Image
import os

SRC = "/home/z/my-project/public/team"
TARGET_SIZE = (600, 800)
QUALITY = 85

files = {
    "owner.jpg": "owner.jpg",
    "direktur.jpg": "direktur.jpg",
    "asisten-direktur.jpg": "asisten-direktur.jpg",
    "ceo.jpg": "ceo.jpg",
    "staff-1.png": "staff-1.jpg",
    "staff-2.png": "staff-2.jpg",
}

def center_crop_3_4(img):
    """Crop tengah agar rasio 3:4, lalu resize ke 600x800."""
    w, h = img.size
    target_ratio = 3 / 4
    current_ratio = w / h
    if current_ratio > target_ratio:
        # terlalu lebar -> crop lebar
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        # terlalu tinggi -> crop tinggi (jaga bagian atas untuk foto wajah)
        new_h = int(w / target_ratio)
        top = max(0, int((h - new_h) * 0.15))  # sedikit condong ke atas
        box = (0, top, w, top + new_h)
    img = img.crop(box)
    return img.resize(TARGET_SIZE, Image.LANCZOS)

for src_name, out_name in files.items():
    path = os.path.join(SRC, src_name)
    if not os.path.exists(path):
        print(f"SKIP (tidak ada): {path}")
        continue
    img = Image.open(path).convert("RGB")
    out = center_crop_3_4(img)
    out_path = os.path.join(SRC, out_name)
    out.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb = os.path.getsize(out_path) / 1024
    print(f"OK {out_name}: {out.size}, {kb:.0f} KB")
    # hapus sumber PNG besar jika berbeda dari output
    if src_name != out_name and os.path.exists(path):
        os.remove(path)
        print(f"   dihapus sumber: {src_name}")

print("\nSelesai. Isi folder:")
for f in sorted(os.listdir(SRC)):
    print(f"  {f} ({os.path.getsize(os.path.join(SRC, f))/1024:.0f} KB)")
