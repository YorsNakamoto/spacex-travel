import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto("file:///Users/maxentyors/Documents/SPACE X/scripts/og-image.html", { waitUntil: "networkidle" });
await p.waitForTimeout(2500); // font Google termuat
await p.screenshot({ path: "public/og-image.png" });
await b.close();
console.log("og-image.png dibuat");
