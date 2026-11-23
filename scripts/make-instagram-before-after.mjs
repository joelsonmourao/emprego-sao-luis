#!/usr/bin/env node
/** Gera comparação local antes/depois (tmp/, não versionar). Logo/ intacta. */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const out = resolve("tmp/admin-visual");
mkdirSync(out, { recursive: true });

// Simula o ativo antigo ampliado (96px → 192 CSS) vs atual 320px
await sharp("Logo/icon.png")
  .resize(96, 96, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png()
  .toFile(resolve(out, "instagram-icon-BEFORE-96.png"));

await sharp("apps/web/public/brand/icon-instagram.webp").png().toFile(resolve(out, "instagram-icon-AFTER-320.png"));

const before = await sharp(resolve(out, "instagram-icon-BEFORE-96.png")).resize(192, 192, { kernel: "nearest" }).png().toBuffer();
const after = await sharp(resolve(out, "instagram-icon-AFTER-320.png")).resize(192, 192).png().toBuffer();

await sharp({
  create: { width: 404, height: 220, channels: 3, background: { r: 26, g: 26, b: 26 } }
})
  .composite([
    { input: before, top: 14, left: 14 },
    { input: after, top: 14, left: 210 }
  ])
  .png()
  .toFile(resolve(out, "instagram-BEFORE-AFTER-compare.png"));

console.log(JSON.stringify({ ok: true, out: "tmp/admin-visual/instagram-BEFORE-AFTER-compare.png" }));
