#!/usr/bin/env node
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coversDir = resolve(root, "apps/web/public/covers/adsense-quality");
const creditsPath = resolve(coversDir, "credits.json");
const sharp = (await import("sharp")).default;

const items = [
  {
    slug: "objetivo-profissional-curriculo",
    title: "Objetivo profissional no currículo",
    label: "CURRÍCULO",
    motif: "target",
    alt: "Ilustração de alvo e currículo para definir um objetivo profissional"
  },
  {
    slug: "perguntas-comuns-entrevista-emprego",
    title: "Perguntas comuns na entrevista",
    label: "ENTREVISTA",
    motif: "dialogue",
    alt: "Ilustração de diálogo entre candidato e recrutador durante entrevista"
  },
  {
    slug: "pesquisar-empresa-antes-entrevista",
    title: "Pesquise a empresa antes da entrevista",
    label: "PREPARAÇÃO",
    motif: "search",
    alt: "Ilustração de lupa sobre informações de uma empresa antes da entrevista"
  },
  {
    slug: "acompanhar-candidatura-emprego",
    title: "Acompanhe cada candidatura",
    label: "ORGANIZAÇÃO",
    motif: "pipeline",
    alt: "Ilustração de etapas para acompanhar candidaturas de emprego"
  },
  {
    slug: "linkedin-primeiro-emprego",
    title: "LinkedIn para o primeiro emprego",
    label: "PERFIL",
    motif: "profile",
    alt: "Ilustração de perfil profissional para a busca do primeiro emprego"
  },
  {
    slug: "jovem-aprendiz-como-funciona",
    title: "Como funciona o Jovem Aprendiz",
    label: "APRENDIZAGEM",
    motif: "mentor",
    alt: "Ilustração de jovem aprendendo uma atividade com acompanhamento profissional"
  },
  {
    slug: "estagio-x-jovem-aprendiz",
    title: "Estágio ou Jovem Aprendiz?",
    label: "COMPARATIVO",
    motif: "fork",
    alt: "Ilustração de dois caminhos para comparar estágio e Jovem Aprendiz"
  },
  {
    slug: "organizar-busca-emprego",
    title: "Organize sua busca de emprego",
    label: "PLANEJAMENTO",
    motif: "board",
    alt: "Ilustração de quadro semanal para organizar a busca de emprego"
  }
];

const motifs = {
  target: `<circle cx="1000" cy="360" r="172" fill="#fff"/><circle cx="1000" cy="360" r="118" fill="none" stroke="#9B2D30" stroke-width="24"/><circle cx="1000" cy="360" r="56" fill="#F58220"/><path d="m790 170 178 158" stroke="#fff" stroke-width="26" stroke-linecap="round"/><path d="m790 170 15 82 64-70z" fill="#F58220"/>`,
  dialogue: `<rect x="770" y="190" width="300" height="176" rx="34" fill="#fff"/><path d="m835 366-48 73 107-73" fill="#fff"/><circle cx="840" cy="278" r="14" fill="#9B2D30"/><circle cx="920" cy="278" r="14" fill="#9B2D30"/><circle cx="1000" cy="278" r="14" fill="#9B2D30"/><path d="M930 430h165" stroke="#F58220" stroke-width="24" stroke-linecap="round"/>`,
  search: `<circle cx="940" cy="320" r="140" fill="#fff"/><circle cx="940" cy="320" r="92" fill="none" stroke="#9B2D30" stroke-width="23"/><path d="m1045 425 92 92" stroke="#F58220" stroke-width="34" stroke-linecap="round"/><path d="M895 290h90M895 340h62" stroke="#1A1A1A" stroke-width="18" stroke-linecap="round"/>`,
  pipeline: `<g fill="#fff"><rect x="760" y="210" width="130" height="230" rx="25"/><rect x="930" y="210" width="130" height="230" rx="25"/></g><path d="M815 275h190" stroke="#F58220" stroke-width="22" stroke-linecap="round"/><path d="m986 240 52 35-52 35" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="m786 360 30 30 51-66M955 360l30 30 51-66" fill="none" stroke="#9B2D30" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  profile: `<rect x="790" y="160" width="300" height="340" rx="38" fill="#fff"/><circle cx="940" cy="280" r="65" fill="#9B2D30"/><path d="M830 450c20-80 70-110 110-110s90 30 110 110" fill="#F58220"/><circle cx="1080" cy="185" r="58" fill="#F58220"/><path d="M1050 185h60M1080 155v60" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`,
  mentor: `<circle cx="865" cy="255" r="62" fill="#fff"/><circle cx="1030" cy="255" r="62" fill="#F58220"/><path d="M770 470c12-112 58-160 95-160s83 48 95 160M935 470c12-112 58-160 95-160s83 48 95 160" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round"/><path d="M910 320h80" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  fork: `<path d="M930 510V350M930 350 800 220M930 350l130-130" fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><circle cx="800" cy="220" r="58" fill="#F58220"/><circle cx="1060" cy="220" r="58" fill="#fff"/><text x="800" y="233" text-anchor="middle" font-family="Arial" font-size="38" font-weight="800" fill="#fff">E</text><text x="1060" y="233" text-anchor="middle" font-family="Arial" font-size="38" font-weight="800" fill="#9B2D30">A</text>`,
  board: `<rect x="760" y="170" width="350" height="330" rx="38" fill="#fff"/><path d="M760 245h350" stroke="#9B2D30" stroke-width="24"/><path d="M835 140v70M1035 140v70" stroke="#fff" stroke-width="22" stroke-linecap="round"/><g fill="#9B2D30"><rect x="810" y="300" width="45" height="45" rx="8"/><rect x="810" y="375" width="45" height="45" rx="8"/></g><path d="m818 320 15 15 30-38M818 395l15 15 30-38" fill="none" stroke="#F58220" stroke-width="12" stroke-linecap="round"/><path d="M890 322h150M890 397h110" stroke="#1A1A1A" stroke-width="16" stroke-linecap="round"/>`
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapTitle(title, max = 19) {
  const lines = [];
  let line = "";
  for (const word of title.split(/\s+/)) {
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
  const title = wrapTitle(item.title)
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#481719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".68"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="720" fill="url(#bg)"/><circle cx="980" cy="360" r="410" fill="url(#halo)"/><path d="M0 625c260-65 470 48 740-18s360-18 540 30v83H0z" fill="#9B2D30" opacity=".86"/><rect x="80" y="78" width="260" height="46" rx="23" fill="#9B2D30"/><text x="210" y="108" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#fff" letter-spacing="1.6">${escapeXml(item.label)}</text><text x="80" y="218" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="80" y="590" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`;
}

for (const item of items) {
  await sharp(Buffer.from(coverSvg(item)))
    .resize(1280, 720)
    .webp({ quality: 88 })
    .toFile(resolve(coversDir, `${item.slug}.webp`));
}

const credits = {
  packageId: "adsense-quality-guides-v2-original",
  covers: items.map((item) => ({
    slug: item.slug,
    file: `${item.slug}.webp`,
    width: 1280,
    height: 720,
    source: "original",
    photographer: "Equipe editorial Empregos São Luís",
    credit: "Ilustração editorial original: Empregos São Luís",
    caption: `Ilustração editorial original para “${item.title}”.`,
    alt: item.alt,
    licenseStatus: "owned",
    licenseBasis:
      "Criação vetorial original produzida pela equipe editorial do portal, sem fotografia, rosto, logotipo de terceiro ou banco de imagens externo.",
    createdAt: "2026-10-13",
    status: "GERADA_E_OTIMIZADA"
  }))
};
writeFileSync(creditsPath, `${JSON.stringify(credits, null, 2)}\n`, "utf8");

const manifest = items
  .map((item) => ({
    file: `${item.slug}.webp`,
    width: 1280,
    height: 720,
    bytes: statSync(resolve(coversDir, `${item.slug}.webp`)).size
  }))
  .sort((a, b) => a.file.localeCompare(b.file));
writeFileSync(resolve(coversDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas adsense-quality próprias geradas e documentadas.`);
