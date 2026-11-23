import { statSync } from "node:fs";
import sharp from "sharp";

for (const p of [
  "apps/web/public/brand/icon-instagram.webp",
  "apps/web/public/brand/logo-horizontal-on-dark.webp"
]) {
  const m = await sharp(p).metadata();
  console.log(JSON.stringify({ p, w: m.width, h: m.height, hasAlpha: m.hasAlpha, size: statSync(p).size }));
}
