import sharp from "sharp";
import { readdirSync } from "node:fs";
const files = readdirSync("public/team").filter((f) => f.endsWith(".jpg"));
const out = {};
for (const f of files) {
  const buf = await sharp(`public/team/${f}`).resize(12, 16, { fit: "cover" }).webp({ quality: 30 }).toBuffer();
  const key = "/team/" + f;
  out[key] = "data:image/webp;base64," + buf.toString("base64");
}
const ts = `/**
 * Blur placeholder (base64 webp 12px) untuk foto tim — digenerate
 * oleh scripts/team-blur.mjs (sharp). Jangan edit manual.
 */
export const teamBlur: Record<string, string> = ${JSON.stringify(out, null, 2)};
`;
import { writeFileSync } from "node:fs";
writeFileSync("src/config/team-blur.ts", ts);
console.log("team-blur.ts ditulis:", Object.keys(out).length, "foto");
