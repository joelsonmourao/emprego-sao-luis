#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coversDir = resolve(root, "apps/web/public/covers/sl-local");
const creditsPath = resolve(coversDir, "credits.json");
const svgOnly = process.argv.includes("--svg-only");
const sharp = svgOnly ? null : (await import("sharp")).default;

const items = [
  {
    slug: "esgotamento-busca-emprego-sinais",
    title: "Busca de emprego: hora de pausar",
    label: "BEM-ESTAR",
    motif: "pause",
  },
  {
    slug: "mensagem-fria-recrutador-linkedin",
    title: "Mensagem a recrutador sem spam",
    label: "CONTATO",
    motif: "message",
  },
  {
    slug: "busca-emprego-sao-luis-2026",
    title: "Busca de emprego em São Luís",
    label: "PLANO 2026",
    motif: "compass",
  },
];

const motifs = {
  pause: `<rect x="790" y="170" width="270" height="310" rx="32" fill="#fff"/><rect x="860" y="245" width="46" height="160" rx="18" fill="#9B2D30"/><rect x="944" y="245" width="46" height="160" rx="18" fill="#9B2D30"/><path d="M830 505h190" stroke="#F58220" stroke-width="20" stroke-linecap="round"/><path d="M1085 245v140" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M1048 315h74" stroke="#fff" stroke-width="22" stroke-linecap="round"/>`,
  message: `<path d="M760 175h350v245H930l-102 82 26-82h-94z" fill="#fff"/><path d="M825 245h220M825 305h170M825 365h115" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><circle cx="1042" cy="448" r="64" fill="#F58220"/><path d="M1011 448h62M1042 417v62" stroke="#fff" stroke-width="17" stroke-linecap="round"/>`,
  compass: `<circle cx="925" cy="315" r="174" fill="#fff"/><circle cx="925" cy="315" r="124" fill="none" stroke="#9B2D30" stroke-width="18"/><path d="m1005 225-48 123-112 57 48-123z" fill="#F58220"/><circle cx="925" cy="315" r="18" fill="#9B2D30"/><path d="M925 120v42M925 468v42M730 315h42M1078 315h42" stroke="#fff" stroke-width="17" stroke-linecap="round"/>`,
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapTitle(title, max = 20) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function coverSvg(item) {
  const title = wrapTitle(item.title)
    .map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="275" height="42" rx="21" fill="#9B2D30"/><text x="214" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`;
}

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));

for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) {
    const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote8-${item.slug}.svg`);
    writeFileSync(svgPath, svg);
    console.log(`${item.slug}\t${svgPath}`);
  } else {
    await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  }
  bySlug.set(item.slug, {
    slug: item.slug,
    source: "original",
    photographer: "Equipe editorial Empregos São Luís",
    credit: "Ilustração editorial original: Empregos São Luís",
    caption: `Ilustração editorial original para “${item.title}”.`,
    alt: `Ilustração de capa: ${item.title}`,
    licenseStatus: "owned",
    licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.",
    createdAt: "2026-10-13",
  });
}

writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
