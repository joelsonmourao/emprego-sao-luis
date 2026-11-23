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
  { slug: "ctps-digital-carteira-trabalho-consultar", title: "Consulte a Carteira de Trabalho Digital", label: "DOCUMENTOS", motif: "ctps" },
  { slug: "auxiliar-administrativo-vagas-sao-luis", title: "Rotina de auxiliar administrativo", label: "CARREIRA", motif: "office" },
  { slug: "entrevista-por-video-emprego", title: "Entrevista por vídeo sem improviso", label: "ENTREVISTA", motif: "video" },
  { slug: "pretensao-salarial-entrevista-dicas", title: "Como falar de pretensão salarial", label: "ENTREVISTA", motif: "salary" },
  { slug: "comparar-beneficios-vaga-emprego", title: "Compare benefícios da vaga", label: "DECISÃO", motif: "compare" },
  { slug: "golpe-vaga-emprego-sao-luis", title: "Reconheça golpes em falsas vagas", label: "SEGURANÇA", motif: "shield" },
  { slug: "documentos-admissao-emprego-maranhao", title: "Documentos para a admissão", label: "ADMISSÃO", motif: "folder" },
  { slug: "seguranca-candidatas-entrevista-emprego", title: "Segurança antes da entrevista", label: "CANDIDATURA", motif: "location" },
  { slug: "vagas-pcd-inclusao-emprego", title: "Vagas PcD e inclusão no trabalho", label: "INCLUSÃO", motif: "access" },
  { slug: "freelancer-ou-clt-vantagens", title: "Freelancer ou CLT: compare", label: "CONTRATO", motif: "balance" },
  { slug: "curriculo-pdf-erros-triagem", title: "Currículo em PDF sem erros", label: "CURRÍCULO", motif: "pdf" },
  { slug: "email-candidatura-emprego-modelo", title: "E-mail de candidatura claro", label: "CANDIDATURA", motif: "mail" }
];

const motifs = {
  ctps: `<rect x="785" y="145" width="265" height="350" rx="28" fill="#fff"/><rect x="815" y="185" width="205" height="74" rx="15" fill="#9B2D30"/><circle cx="850" cy="340" r="42" fill="#F58220"/><path d="M920 320h75M920 360h55M820 430h175" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/>`,
  office: `<rect x="760" y="175" width="310" height="285" rx="25" fill="#fff"/><path d="M815 235h200M815 295h145M815 355h185" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><rect x="840" y="420" width="150" height="55" rx="12" fill="#F58220"/><path d="M875 420v-38h80v38" fill="none" stroke="#fff" stroke-width="16"/>`,
  video: `<rect x="755" y="155" width="315" height="315" rx="32" fill="#fff"/><circle cx="890" cy="275" r="58" fill="#9B2D30"/><path d="M795 425c18-92 175-92 193 0" fill="#F58220"/><path d="m990 245 75-42v140l-75-42z" fill="#9B2D30"/>`,
  salary: `<circle cx="915" cy="315" r="175" fill="#fff"/><path d="M915 190v250M865 225c24-48 112-36 112 22 0 66-122 31-122 100 0 56 91 65 126 10" fill="none" stroke="#9B2D30" stroke-width="22" stroke-linecap="round"/><path d="M785 480h260" stroke="#F58220" stroke-width="25" stroke-linecap="round"/>`,
  compare: `<rect x="760" y="170" width="130" height="280" rx="24" fill="#fff"/><rect x="940" y="170" width="130" height="280" rx="24" fill="#F58220"/><path d="m790 260 28 28 48-65M790 365h70M970 260l28 28 48-65M970 365h70" fill="none" stroke="#9B2D30" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M890 310h50" stroke="#fff" stroke-width="20"/>`,
  shield: `<path d="M915 135 1060 190v115c0 95-58 155-145 205-87-50-145-110-145-205V190z" fill="#fff"/><path d="M915 215v115" stroke="#9B2D30" stroke-width="30" stroke-linecap="round"/><circle cx="915" cy="395" r="20" fill="#F58220"/><path d="M805 190 760 145M1025 190l45-45" stroke="#F58220" stroke-width="18" stroke-linecap="round"/>`,
  folder: `<path d="M755 225h125l45-55h155v285H755z" fill="#fff"/><path d="M755 255h325" stroke="#F58220" stroke-width="24"/><rect x="820" y="300" width="195" height="110" rx="14" fill="#9B2D30"/><path d="M850 335h135M850 375h95" stroke="#fff" stroke-width="14" stroke-linecap="round"/>`,
  location: `<path d="M915 130c-103 0-185 77-185 175 0 125 185 235 185 235s185-110 185-235c0-98-82-175-185-175z" fill="#fff"/><circle cx="915" cy="300" r="82" fill="#9B2D30"/><path d="m875 300 28 28 58-70" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`,
  access: `<circle cx="915" cy="180" r="55" fill="#F58220"/><path d="M915 250v115M825 285h180M915 365l-75 105M915 365l90 90" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round"/><circle cx="915" cy="350" r="155" fill="none" stroke="#9B2D30" stroke-width="22" stroke-dasharray="210 60"/>`,
  balance: `<path d="M915 145v330M775 210h280M820 210l-85 165h170zM1010 210l-85 165h170z" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><circle cx="915" cy="145" r="34" fill="#F58220"/><path d="M820 475h190" stroke="#9B2D30" stroke-width="30" stroke-linecap="round"/>`,
  pdf: `<path d="M800 140h200l85 85v275H800z" fill="#fff"/><path d="M1000 140v85h85" fill="#F58220"/><rect x="835" y="285" width="215" height="80" rx="16" fill="#9B2D30"/><text x="942" y="341" text-anchor="middle" font-family="Arial" font-size="58" font-weight="800" fill="#fff">PDF</text><path d="M850 415h185" stroke="#F58220" stroke-width="18"/>`,
  mail: `<rect x="755" y="175" width="325" height="275" rx="26" fill="#fff"/><path d="m775 205 142 120 143-120M775 425l100-95M1060 425l-100-95" fill="none" stroke="#9B2D30" stroke-width="20" stroke-linejoin="round"/><circle cx="1045" cy="165" r="62" fill="#F58220"/><path d="m1015 165 20 20 40-50" fill="none" stroke="#fff" stroke-width="17" stroke-linecap="round"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

function wrapTitle(title, max = 23) {
  const words = title.split(/\s+/); const lines = []; let line = "";
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines.slice(0, 4);
}

function coverSvg(item) {
  const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="245" height="42" rx="21" fill="#9B2D30"/><text x="198" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`;
}

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));

for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) {
    const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote2-${item.slug}.svg`);
    writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`);
  } else {
    await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  }
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}

writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
