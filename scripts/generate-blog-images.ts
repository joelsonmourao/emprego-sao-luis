import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { empregoSaoLuisBlogPostsAll } from "../data/blog-posts-all";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/images/blog");

const PALETTE = {
  charcoal: "#1A1A1A",
  green: "#1F2B24",
  brick: "#7B2C28",
  orange: "#F28C1B",
  beige: "#F5F2EB",
  white: "#FFFFFF"
};

const ACCENTS = [PALETTE.orange, PALETTE.brick, PALETTE.green];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(slug: string, title: string, index: number) {
  const accent = ACCENTS[index % ACCENTS.length];
  const shortTitle = title.length > 52 ? `${title.slice(0, 49)}…` : title;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${escapeXml(`Capa: ${title}`)}">
  <defs>
    <linearGradient id="bg-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.beige}"/>
      <stop offset="55%" stop-color="${PALETTE.white}"/>
      <stop offset="100%" stop-color="${PALETTE.beige}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg-${slug})"/>
  <circle cx="680" cy="80" r="120" fill="${accent}" opacity="0.12"/>
  <circle cx="120" cy="360" r="90" fill="${PALETTE.brick}" opacity="0.08"/>
  <rect x="48" y="48" width="704" height="354" rx="28" fill="${PALETTE.white}" opacity="0.92"/>
  <rect x="48" y="48" width="704" height="8" rx="4" fill="${accent}"/>
  <g transform="translate(88,108)">
    <rect x="0" y="0" width="56" height="56" rx="14" fill="${PALETTE.green}"/>
    <text x="28" y="38" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="${PALETTE.orange}">ES</text>
    <text x="76" y="24" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="${PALETTE.green}" letter-spacing="2">EMPREGO SÃO LUÍS</text>
    <text x="76" y="44" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="${PALETTE.charcoal}" opacity="0.7">Maranhão · Vagas · Carreira</text>
  </g>
  <text x="88" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="${PALETTE.charcoal}">
    ${escapeXml(shortTitle)}
  </text>
  <rect x="88" y="250" width="180" height="6" rx="3" fill="${accent}" opacity="0.85"/>
  <text x="88" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="${PALETTE.charcoal}" opacity="0.75">Conteúdo útil para candidatos de São Luís e região</text>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const [index, post] of empregoSaoLuisBlogPostsAll.entries()) {
  fs.writeFileSync(path.join(outDir, `${post.slug}.svg`), buildSvg(post.slug, post.title, index), "utf8");
}

console.log(`Geradas ${empregoSaoLuisBlogPostsAll.length} capas em public/images/blog/`);
