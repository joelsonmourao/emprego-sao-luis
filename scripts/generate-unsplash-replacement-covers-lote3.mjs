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
  { slug: "dinamica-de-grupo-entrevista-dicas", title: "Dinâmica de grupo com clareza", label: "ENTREVISTA", motif: "group" },
  { slug: "teste-online-processo-seletivo-dicas", title: "Teste online sem improviso", label: "SELEÇÃO", motif: "test" },
  { slug: "como-ler-holerite-descontos", title: "Leia os descontos do holerite", label: "DIREITOS", motif: "payslip" },
  { slug: "escala-6x1-o-que-perguntar", title: "Escala 6×1: o que perguntar", label: "JORNADA", motif: "schedule" },
  { slug: "vagas-restaurante-sao-luis-dicas", title: "Trabalho em restaurante", label: "SÃO LUÍS", motif: "restaurant" },
  { slug: "servicos-gerais-epi-vaga", title: "Serviços gerais e uso de EPI", label: "SEGURANÇA", motif: "ppe" },
  { slug: "como-usar-empregos-sao-luis", title: "Como usar o portal com segurança", label: "GUIA", motif: "portal" },
  { slug: "entrevista-presencial-sao-luis-dicas", title: "Entrevista presencial em São Luís", label: "ENTREVISTA", motif: "meeting" },
  { slug: "mapa-setores-vagas-sao-luis", title: "Setores de trabalho em São Luís", label: "MERCADO", motif: "map" },
  { slug: "experiencia-informal-curriculo-como-colocar", title: "Experiência informal no currículo", label: "CURRÍCULO", motif: "experience" },
  { slug: "vagas-comercio-servicos-sao-luis-perfil", title: "Comércio e serviços: perfil da vaga", label: "MERCADO", motif: "store" },
  { slug: "quantas-vagas-candidatar-por-semana", title: "Organize candidaturas da semana", label: "PLANEJAMENTO", motif: "weekly" }
];

const motifs = {
  group: `<circle cx="820" cy="260" r="55" fill="#fff"/><circle cx="915" cy="220" r="62" fill="#F58220"/><circle cx="1010" cy="260" r="55" fill="#fff"/><path d="M755 430c12-85 118-85 132 0M830 430c18-112 152-112 170 0M943 430c12-85 118-85 132 0" fill="none" stroke="#fff" stroke-width="24"/>`,
  test: `<rect x="765" y="150" width="300" height="330" rx="28" fill="#fff"/><path d="M825 235h170M825 300h170M825 365h170" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><circle cx="805" cy="235" r="14" fill="#F58220"/><circle cx="805" cy="300" r="14" fill="#F58220"/><path d="m790 365 15 15 30-38" fill="none" stroke="#F58220" stroke-width="13" stroke-linecap="round"/>`,
  payslip: `<rect x="780" y="130" width="270" height="370" rx="24" fill="#fff"/><path d="M825 205h180M825 265h125M825 325h180M825 385h90" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="M945 380h60" stroke="#F58220" stroke-width="24" stroke-linecap="round"/>`,
  schedule: `<rect x="760" y="155" width="310" height="315" rx="28" fill="#fff"/><path d="M760 235h310M825 125v65M1005 125v65" stroke="#F58220" stroke-width="23" stroke-linecap="round"/><text x="915" y="380" text-anchor="middle" font-family="Arial" font-size="116" font-weight="800" fill="#9B2D30">6×1</text>`,
  restaurant: `<circle cx="915" cy="320" r="150" fill="#fff"/><path d="M790 425h250M810 395c20-150 190-150 210 0" fill="none" stroke="#9B2D30" stroke-width="23" stroke-linecap="round"/><circle cx="915" cy="220" r="18" fill="#F58220"/><path d="M760 160v140M745 160v65M775 160v65M1060 160v140" stroke="#fff" stroke-width="18" stroke-linecap="round"/>`,
  ppe: `<path d="M790 220c0-75 55-125 125-125s125 50 125 125v45H790z" fill="#F58220"/><path d="M760 265h310" stroke="#fff" stroke-width="25" stroke-linecap="round"/><path d="M815 305h200v155H815z" fill="#fff"/><path d="m860 375 35 35 70-85" fill="none" stroke="#9B2D30" stroke-width="24" stroke-linecap="round"/>`,
  portal: `<rect x="745" y="145" width="340" height="330" rx="30" fill="#fff"/><path d="M745 220h340" stroke="#9B2D30" stroke-width="22"/><circle cx="790" cy="183" r="12" fill="#F58220"/><circle cx="830" cy="183" r="12" fill="#F58220"/><path d="M800 285h230M800 345h150" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><path d="m945 420 42-42 42 42" fill="none" stroke="#F58220" stroke-width="22"/>`,
  meeting: `<rect x="760" y="185" width="310" height="240" rx="25" fill="#fff"/><circle cx="845" cy="280" r="50" fill="#9B2D30"/><circle cx="985" cy="280" r="50" fill="#F58220"/><path d="M790 410c12-78 110-78 122 0M925 410c12-78 110-78 122 0" fill="#9B2D30"/><path d="M850 470h130" stroke="#fff" stroke-width="20" stroke-linecap="round"/>`,
  map: `<path d="m760 175 105-45 105 45 105-45v335l-105 45-105-45-105 45z" fill="#fff"/><path d="M865 130v335M970 175v335" stroke="#9B2D30" stroke-width="18"/><path d="M915 225c-48 0-85 36-85 82 0 58 85 115 85 115s85-57 85-115c0-46-37-82-85-82z" fill="#F58220"/><circle cx="915" cy="305" r="28" fill="#fff"/>`,
  experience: `<rect x="770" y="145" width="290" height="345" rx="25" fill="#fff"/><circle cx="845" cy="240" r="48" fill="#F58220"/><path d="M805 335c12-75 110-75 125 0M955 225h65M955 275h65M815 410h205" fill="none" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="m945 355 25 25 50-62" fill="none" stroke="#F58220" stroke-width="18"/>`,
  store: `<path d="M760 225h310l-35-90H795z" fill="#fff"/><path d="M780 225v235h270V225" fill="#fff"/><path d="M760 225c0 50 72 50 72 0 0 50 72 50 72 0 0 50 72 50 72 0 0 50 72 50 72 0" fill="#F58220"/><rect x="835" y="330" width="160" height="130" fill="#9B2D30"/>`,
  weekly: `<rect x="760" y="150" width="310" height="325" rx="28" fill="#fff"/><path d="M760 230h310M830 125v65M1000 125v65" stroke="#F58220" stroke-width="23" stroke-linecap="round"/><path d="m815 305 25 25 45-58M815 395l25 25 45-58M920 305h105M920 395h105" fill="none" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function wrapTitle(title, max = 23) { const words = title.split(/\s+/); const lines = []; let line = ""; for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; } if (line) lines.push(line); return lines.slice(0, 4); }
function coverSvg(item) { const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join(""); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="245" height="42" rx="21" fill="#9B2D30"/><text x="198" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`; }

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));
for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) { const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote3-${item.slug}.svg`); writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`); }
  else await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}
writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
