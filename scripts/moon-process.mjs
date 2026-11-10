import sharp from "sharp";
// Equirectangular 1024x512 → potong hemisphere depan (tengah 512x512, sedikit turun)
const src = "/tmp/moon-src.jpg";
const out = "src/assets/moon.webp";
await sharp(src)
  .extract({ left: 256, top: 64, width: 512, height: 384 }) // area wajah bulan paling detail
  .resize(640, 640, { fit: "cover", position: "centre" })
  .webp({ quality: 84 })
  .toFile(out);
const meta = await sharp(out).metadata();
console.log("moon.webp:", meta.width + "x" + meta.height, Math.round((await sharp(out).toBuffer()).length / 1024) + "KB");
// Blur placeholder mini (base64)
const tiny = await sharp(out).resize(16, 16).webp({ quality: 30 }).toBuffer();
console.log("BLUR_B64=data:image/webp;base64," + tiny.toString("base64"));
