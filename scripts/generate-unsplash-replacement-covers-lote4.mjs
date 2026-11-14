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
  { slug: "linkedin-emprego-sao-luis-perfil", title: "Perfil profissional que gera conversa", label: "CARREIRA", motif: "network" },
  { slug: "primeira-semana-emprego-novo", title: "Primeira semana no emprego novo", label: "INÍCIO", motif: "firstWeek" },
  { slug: "banco-de-horas-direitos-trabalhador", title: "Banco de horas sem dúvida", label: "DIREITOS", motif: "hoursBank" },
  { slug: "hora-extra-holerite-como-conferir", title: "Confira a hora extra no holerite", label: "HOLERITE", motif: "overtime" },
  { slug: "fgts-consultar-trabalhador-clt", title: "Acompanhe seu FGTS com segurança", label: "DIREITOS", motif: "fgts" },
  { slug: "seguro-desemprego-checklist-documentos", title: "Documentos do seguro-desemprego", label: "CHECKLIST", motif: "documents" },
  { slug: "periodo-experiencia-clt-o-que-saber", title: "Período de experiência CLT", label: "CONTRATO", motif: "experience" },
  { slug: "contrato-temporario-temporada-direitos", title: "Leia o contrato temporário", label: "CONTRATO", motif: "temporary" },
  { slug: "assedio-no-trabalho-o-que-fazer", title: "Assédio no trabalho: registre e busque apoio", label: "SEGURANÇA", motif: "harassment" },
  { slug: "saude-mental-trabalho-limites", title: "Saúde mental e limites no trabalho", label: "BEM-ESTAR", motif: "mentalHealth" },
  { slug: "home-office-remoto-checklist-vaga", title: "Checklist da vaga em home office", label: "TRABALHO REMOTO", motif: "homeOffice" },
  { slug: "mudanca-de-carreira-sao-luis-curriculo", title: "Mudança de carreira com direção", label: "TRANSIÇÃO", motif: "careerChange" }
];

const motifs = {
  network: `<circle cx="790" cy="210" r="48" fill="#fff"/><circle cx="1010" cy="210" r="48" fill="#F58220"/><circle cx="900" cy="405" r="58" fill="#fff"/><path d="M830 235l45 105M970 235l-45 105M838 210h124" stroke="#fff" stroke-width="19" stroke-linecap="round"/><rect x="830" y="330" width="140" height="100" rx="18" fill="#9B2D30" stroke="#fff" stroke-width="14"/>`,
  firstWeek: `<rect x="760" y="150" width="310" height="330" rx="28" fill="#fff"/><path d="M760 230h310M830 125v65M1000 125v65" stroke="#F58220" stroke-width="23" stroke-linecap="round"/><text x="835" y="350" font-family="Arial" font-size="112" font-weight="800" fill="#9B2D30">1</text><path d="m925 335 35 35 65-85" fill="none" stroke="#F58220" stroke-width="23" stroke-linecap="round"/>`,
  hoursBank: `<circle cx="900" cy="300" r="145" fill="#fff"/><path d="M900 205v105l75 48" fill="none" stroke="#9B2D30" stroke-width="24" stroke-linecap="round"/><rect x="995" y="360" width="95" height="95" rx="18" fill="#F58220"/><path d="M1018 408h49M1042 383v49" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`,
  overtime: `<rect x="760" y="150" width="305" height="330" rx="28" fill="#fff"/><circle cx="850" cy="300" r="70" fill="#9B2D30"/><path d="M850 255v50l35 22" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M955 245h65M955 315h65M955 385h65" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><circle cx="1025" cy="420" r="42" fill="#F58220"/><path d="M1005 420h40M1025 400v40" stroke="#fff" stroke-width="13"/>`,
  fgts: `<rect x="790" y="130" width="250" height="380" rx="35" fill="#fff"/><rect x="815" y="175" width="200" height="260" rx="16" fill="#9B2D30"/><path d="m850 310 45 45 85-110" fill="none" stroke="#fff" stroke-width="24" stroke-linecap="round"/><circle cx="915" cy="470" r="14" fill="#F58220"/>`,
  documents: `<path d="M760 205h140l35 45h145v225H760z" fill="#fff"/><path d="M795 305h235M795 365h170" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><path d="m900 420 32 32 70-88" fill="none" stroke="#F58220" stroke-width="24" stroke-linecap="round"/>`,
  experience: `<rect x="760" y="145" width="315" height="340" rx="25" fill="#fff"/><path d="M815 230h205M815 295h205M815 360h120" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><rect x="930" y="335" width="105" height="105" rx="18" fill="#F58220"/><text x="983" y="407" text-anchor="middle" font-family="Arial" font-size="54" font-weight="800" fill="#fff">90</text>`,
  temporary: `<path d="M815 145h200M815 485h200" stroke="#fff" stroke-width="24" stroke-linecap="round"/><path d="M840 170c0 95 65 110 75 145-10 35-75 50-75 145h150c0-95-65-110-75-145 10-35 75-50 75-145z" fill="#fff"/><path d="M870 420h90l-45-65z" fill="#F58220"/>`,
  harassment: `<path d="M760 160h315v245H900l-85 75 18-75h-73z" fill="#fff"/><path d="M835 245h170M835 305h120" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><path d="M1030 390l60 105H970z" fill="#F58220"/><path d="M1030 425v28" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="1030" cy="470" r="7" fill="#fff"/>`,
  mentalHealth: `<path d="M900 470s-155-92-155-215c0-75 92-112 155-42 63-70 155-33 155 42 0 123-155 215-155 215z" fill="#fff"/><path d="M780 325h70l32-70 48 135 35-65h75" fill="none" stroke="#F58220" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>`,
  homeOffice: `<path d="M770 265l145-120 145 120v205H770z" fill="#fff"/><rect x="820" y="275" width="190" height="125" rx="14" fill="#9B2D30"/><path d="M800 425h230" stroke="#F58220" stroke-width="23" stroke-linecap="round"/><circle cx="915" cy="338" r="28" fill="#fff"/>`,
  careerChange: `<circle cx="915" cy="315" r="145" fill="#fff"/><path d="M815 290c22-85 126-115 195-56l35-32v98h-98l34-34M1015 340c-22 85-126 115-195 56l-35 32v-98h98l-34 34" fill="none" stroke="#9B2D30" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/><circle cx="915" cy="315" r="34" fill="#F58220"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function wrapTitle(title, max = 23) { const words = title.split(/\s+/); const lines = []; let line = ""; for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; } if (line) lines.push(line); return lines.slice(0, 4); }
function coverSvg(item) { const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join(""); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="275" height="42" rx="21" fill="#9B2D30"/><text x="214" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`; }

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));
for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) { const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote4-${item.slug}.svg`); writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`); }
  else await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}
writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
