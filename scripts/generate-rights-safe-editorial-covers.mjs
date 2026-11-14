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
    slug: "pedir-feedback-entrevista-emprego",
    title: "Como pedir feedback depois da entrevista",
    label: "ENTREVISTA",
    motif: "feedback"
  },
  {
    slug: "plano-semanal-vagas-sao-luis",
    title: "Plano semanal para buscar vagas em São Luís",
    label: "ORGANIZAÇÃO",
    motif: "calendar"
  },
  {
    slug: "produtividade-busca-emprego-sao-luis",
    title: "Produtividade sem candidatura em massa",
    label: "ROTINA",
    motif: "timer"
  },
  {
    slug: "rejeicao-processo-seletivo-como-reagir",
    title: "Como reagir à rejeição em um processo seletivo",
    label: "CARREIRA",
    motif: "route"
  },
  {
    slug: "retorno-mercado-trabalho-gap-curriculo",
    title: "Retorno ao mercado após uma pausa profissional",
    label: "CURRÍCULO",
    motif: "return"
  },
  {
    slug: "transporte-entrevista-emprego-sao-luis",
    title: "Planeje o transporte para a entrevista",
    label: "SÃO LUÍS",
    motif: "bus"
  }
];

const motifs = {
  feedback: `
    <rect x="760" y="155" width="300" height="190" rx="34" fill="#FFFFFF" opacity=".96"/>
    <path d="M822 345 785 404l91-59" fill="#FFFFFF" opacity=".96"/>
    <circle cx="830" cy="250" r="14" fill="#9B2D30"/><circle cx="910" cy="250" r="14" fill="#9B2D30"/><circle cx="990" cy="250" r="14" fill="#9B2D30"/>
    <path d="M805 438h205" stroke="#F58220" stroke-width="18" stroke-linecap="round"/>
  `,
  calendar: `
    <rect x="760" y="145" width="310" height="330" rx="36" fill="#FFFFFF"/>
    <path d="M760 225h310" stroke="#9B2D30" stroke-width="26"/>
    <path d="M825 120v78M1005 120v78" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round"/>
    <g fill="#9B2D30"><circle cx="830" cy="290" r="18"/><circle cx="915" cy="290" r="18"/><circle cx="1000" cy="290" r="18"/><circle cx="830" cy="370" r="18"/></g>
    <path d="m890 375 36 38 77-88" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  timer: `
    <circle cx="915" cy="315" r="160" fill="#FFFFFF"/>
    <circle cx="915" cy="315" r="115" fill="none" stroke="#9B2D30" stroke-width="24"/>
    <path d="M915 315V228M915 315l72 45" stroke="#1A1A1A" stroke-width="25" stroke-linecap="round"/>
    <path d="M875 120h80M915 120v35" stroke="#FFFFFF" stroke-width="22" stroke-linecap="round"/>
    <circle cx="915" cy="315" r="16" fill="#F58220"/>
  `,
  route: `
    <path d="M770 445c55-220 160-220 225-80 45 98 85 2 92-125" fill="none" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round" stroke-dasharray="2 55"/>
    <circle cx="790" cy="420" r="42" fill="#F58220"/><circle cx="1080" cy="225" r="42" fill="#FFFFFF"/>
    <path d="m1038 160 42 65 48-78" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  return: `
    <path d="M1050 335a145 145 0 1 1-55-113" fill="none" stroke="#FFFFFF" stroke-width="34" stroke-linecap="round"/>
    <path d="m970 165 42 63-72 23" fill="#FFFFFF"/>
    <path d="M840 340h145M915 270v140" stroke="#F58220" stroke-width="24" stroke-linecap="round"/>
  `,
  bus: `
    <rect x="745" y="170" width="345" height="260" rx="45" fill="#FFFFFF"/>
    <rect x="790" y="220" width="255" height="90" rx="18" fill="#9B2D30" opacity=".9"/>
    <path d="M775 350h285" stroke="#1A1A1A" stroke-width="18"/>
    <circle cx="820" cy="445" r="38" fill="#1A1A1A"/><circle cx="1015" cy="445" r="38" fill="#1A1A1A"/>
    <circle cx="820" cy="445" r="15" fill="#F58220"/><circle cx="1015" cy="445" r="15" fill="#F58220"/>
  `
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapTitle(title, max = 22) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function coverSvg(item) {
  const lines = wrapTitle(item.title);
  const title = lines.map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 68}">${escapeXml(line)}</tspan>`).join("");
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1A1A1A"/><stop offset="1" stop-color="#3A1517"/></linearGradient>
      <radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".7"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="950" cy="315" r="360" fill="url(#halo)"/>
    <path d="M0 560C260 500 430 610 700 545s330-35 500 5v80H0Z" fill="#9B2D30" opacity=".82"/>
    <rect x="76" y="72" width="190" height="42" rx="21" fill="#9B2D30"/>
    <text x="171" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" font-weight="700" fill="#FFFFFF" letter-spacing="2">${escapeXml(item.label)}</text>
    <text x="76" y="185" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#FFFFFF">${title}</text>
    <text x="76" y="520" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>
    ${motifs[item.motif]}
  </svg>`;
}

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));

for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) {
    const svgPath = resolve(tmpdir(), `es-cover-${item.slug}.svg`);
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
    licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia ou banco externo.",
    createdAt: "2026-10-13"
  });
}

writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas originais preparadas e direitos registrados.`);
