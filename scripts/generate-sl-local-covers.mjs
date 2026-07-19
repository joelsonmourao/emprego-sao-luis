#!/usr/bin/env node
/**
 * Gera 45 capas únicas (1200×630) em apps/web/public/covers/sl-local/.
 * node scripts/generate-sl-local-covers.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { catalog, slugFor } from "./data/sl-local-editorial-catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "apps/web/public/covers/sl-local");
const W = 1200;
const H = 630;

mkdirSync(outDir, { recursive: true });

function hsl(h, s, l, a = 1) {
  return `hsla(${h % 360} ${s}% ${l}% / ${a})`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, max = 34) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function buildSvg(item, index) {
  const h = item.coverHue;
  const h2 = (h + 40) % 360;
  const h3 = (h + 200) % 360;
  const shape = index % 5;
  const lines = wrapTitle(item.title);
  const titleY = 420;
  const lineSvg = lines
    .map(
      (t, i) =>
        `<text x="64" y="${titleY + i * 42}" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700">${escapeXml(t)}</text>`
    )
    .join("");

  let decor = "";
  if (shape === 0) {
    decor = `<circle cx="980" cy="160" r="180" fill="${hsl(h3, 45, 55, 0.35)}" />
      <circle cx="1040" cy="220" r="110" fill="${hsl(h2, 50, 40, 0.4)}" />`;
  } else if (shape === 1) {
    decor = `<polygon points="720,0 1200,0 1200,630 860,630" fill="${hsl(h3, 40, 35, 0.45)}" />
      <rect x="900" y="80" width="220" height="220" rx="24" fill="${hsl(h2, 55, 60, 0.35)}" />`;
  } else if (shape === 2) {
    decor = `<ellipse cx="200" cy="120" rx="260" ry="140" fill="${hsl(h3, 50, 50, 0.3)}" />
      <rect x="780" y="300" width="360" height="260" rx="40" fill="${hsl(h2, 45, 30, 0.4)}" />`;
  } else if (shape === 3) {
    decor = `<path d="M600 0 L1200 200 L1200 630 L400 630 Z" fill="${hsl(h3, 42, 38, 0.4)}" />
      <circle cx="180" cy="480" r="140" fill="${hsl(h2, 48, 55, 0.35)}" />`;
  } else {
    decor = `<rect x="0" y="0" width="420" height="630" fill="${hsl(h3, 38, 32, 0.5)}" />
      <circle cx="950" cy="480" r="200" fill="${hsl(h2, 52, 58, 0.32)}" />`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hsl(h, 48, 28)}"/>
      <stop offset="55%" stop-color="${hsl(h2, 42, 36)}"/>
      <stop offset="100%" stop-color="${hsl((h + 80) % 360, 38, 22)}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="40%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.72)"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${decor}
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.55"/>
  <text x="64" y="72" fill="${hsl(h2, 70, 85)}" font-family="system-ui, sans-serif" font-size="18" font-weight="700" letter-spacing="3">EMPREGOS SÃO LUÍS</text>
  <text x="64" y="110" fill="rgba(255,255,255,0.75)" font-family="system-ui, sans-serif" font-size="16">${escapeXml(item.section.toUpperCase())} · GUIA LOCAL</text>
  ${lineSvg}
  <text x="64" y="590" fill="rgba(255,255,255,0.55)" font-family="system-ui, sans-serif" font-size="14">Ilustração editorial exclusiva · ${escapeXml(slugFor(item))}</text>
</svg>`;
}

let ok = 0;
for (let i = 0; i < catalog.length; i += 1) {
  const item = catalog[i];
  const slug = slugFor(item);
  const svg = Buffer.from(buildSvg(item, i));
  const out = resolve(outDir, `${slug}.webp`);
  await sharp(svg).webp({ quality: 86 }).toFile(out);
  ok += 1;
  process.stdout.write(`\r[covers] ${ok}/${catalog.length}`);
}
console.log(`\n[covers] Geradas ${ok} capas em apps/web/public/covers/sl-local/`);
