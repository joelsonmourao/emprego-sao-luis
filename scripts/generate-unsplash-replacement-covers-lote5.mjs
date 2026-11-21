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
  { slug: "carta-apresentacao-emprego-curta", title: "Carta de apresentação sem texto genérico", label: "CANDIDATURA", motif: "letter" },
  { slug: "referencias-profissionais-emprego", title: "Referências profissionais bem combinadas", label: "CONTATOS", motif: "references" },
  { slug: "agradecimento-pos-entrevista-mensagem", title: "Agradecimento depois da entrevista", label: "ENTREVISTA", motif: "thanks" },
  { slug: "o-que-vestir-entrevista-emprego", title: "Vestimenta adequada ao setor", label: "ENTREVISTA", motif: "clothing" },
  { slug: "excel-basico-vagas-emprego", title: "Excel básico que aparece nas vagas", label: "HABILIDADES", motif: "spreadsheet" },
  { slug: "ingles-no-curriculo-nivel-honesto", title: "Inglês no currículo com nível honesto", label: "CURRÍCULO", motif: "language" },
  { slug: "emprego-apos-40-anos-curriculo", title: "Experiência profissional depois dos 40", label: "CARREIRA", motif: "experience40" },
  { slug: "retorno-trabalho-apos-maternidade", title: "Retorno ao trabalho após maternidade", label: "RETORNO", motif: "returnWork" },
  { slug: "vagas-call-center-sao-luis", title: "Call center em São Luís: o que avaliar", label: "VAGA LOCAL", motif: "callCenter" },
  { slug: "vaga-recepcionista-clinica-sao-luis", title: "Recepção de clínica em São Luís", label: "VAGA LOCAL", motif: "reception" },
  { slug: "vagas-estoque-logistica-sao-luis", title: "Estoque e logística em São Luís", label: "VAGA LOCAL", motif: "logistics" },
  { slug: "vagas-vendedor-loja-comissao-dicas", title: "Vendas no balcão: meta e comissão", label: "VENDAS", motif: "sales" }
];

const motifs = {
  letter: `<rect x="765" y="170" width="320" height="245" rx="24" fill="#fff"/><path d="m790 205 135 105 135-105" fill="none" stroke="#9B2D30" stroke-width="20"/><path d="M805 375h160" stroke="#F58220" stroke-width="18" stroke-linecap="round"/><path d="m985 350 25 25 60-65" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round"/>`,
  references: `<circle cx="830" cy="245" r="64" fill="#fff"/><circle cx="1000" cy="245" r="64" fill="#fff"/><circle cx="915" cy="410" r="70" fill="#F58220"/><path d="M865 265l35 95M965 265l-35 95" stroke="#fff" stroke-width="20" stroke-linecap="round"/><path d="M800 245h230" stroke="#9B2D30" stroke-width="16" stroke-linecap="round"/>`,
  thanks: `<path d="M770 155h310v240H920l-92 74 24-74h-82z" fill="#fff"/><path d="M830 240h190M830 302h135" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><path d="M1007 414c-42-48-95 18-22 73 73-55 20-121-22-73" fill="#F58220"/>`,
  clothing: `<path d="m845 155 70 48 70-48 94 72-52 78-45-31v205H848V274l-45 31-52-78z" fill="#fff"/><path d="M875 185c8 52 72 52 80 0M915 205v215" fill="none" stroke="#9B2D30" stroke-width="18"/><circle cx="915" cy="280" r="11" fill="#F58220"/><circle cx="915" cy="335" r="11" fill="#F58220"/>`,
  spreadsheet: `<rect x="755" y="145" width="330" height="340" rx="24" fill="#fff"/><path d="M755 225h330M865 225v260M975 225v260M755 315h330M755 405h330" stroke="#9B2D30" stroke-width="15"/><rect x="770" y="160" width="300" height="50" rx="12" fill="#F58220"/><path d="m905 360 30 30 75-88" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round"/>`,
  language: `<path d="M760 165h300v220H900l-80 70 18-70h-78z" fill="#fff"/><text x="845" y="300" font-family="Arial" font-size="92" font-weight="800" fill="#9B2D30">A</text><text x="945" y="300" font-family="Arial" font-size="78" font-weight="800" fill="#F58220">B2</text><path d="M815 345h190" stroke="#9B2D30" stroke-width="16" stroke-linecap="round"/>`,
  experience40: `<circle cx="915" cy="315" r="155" fill="#fff"/><text x="915" y="350" text-anchor="middle" font-family="Arial" font-size="118" font-weight="800" fill="#9B2D30">40+</text><path d="M820 390h190" stroke="#F58220" stroke-width="22" stroke-linecap="round"/><path d="m840 245 38 32 72-72" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  returnWork: `<path d="M770 265l145-115 145 115v205H770z" fill="#fff"/><rect x="845" y="295" width="140" height="120" rx="18" fill="#9B2D30"/><path d="M880 295v-38h70v38" fill="none" stroke="#F58220" stroke-width="18"/><path d="M790 220c-42 16-66 60-54 102M735 322l-25-40M735 322l42-12" fill="none" stroke="#F58220" stroke-width="18" stroke-linecap="round"/>`,
  callCenter: `<path d="M780 315a135 135 0 0 1 270 0" fill="none" stroke="#fff" stroke-width="32"/><rect x="755" y="305" width="70" height="125" rx="30" fill="#F58220"/><rect x="1005" y="305" width="70" height="125" rx="30" fill="#F58220"/><path d="M1040 420c0 55-50 75-105 75" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/><circle cx="915" cy="495" r="18" fill="#fff"/>`,
  reception: `<rect x="750" y="355" width="350" height="120" rx="20" fill="#fff"/><rect x="805" y="180" width="240" height="165" rx="20" fill="#9B2D30" stroke="#fff" stroke-width="15"/><path d="M865 240h120M925 205v120" stroke="#F58220" stroke-width="20" stroke-linecap="round"/><circle cx="825" cy="415" r="18" fill="#F58220"/>`,
  logistics: `<path d="M755 235h205v190H755zM960 290h85l70 75v60H960z" fill="#fff"/><path d="M985 315h50l35 40h-85z" fill="#9B2D30"/><circle cx="820" cy="440" r="42" fill="#F58220"/><circle cx="1040" cy="440" r="42" fill="#F58220"/><path d="M790 280h130M790 330h95" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/>`,
  sales: `<path d="M785 195h255l45 95-45 45v145H785V335l-45-45z" fill="#fff"/><path d="M740 290h345M815 195l-20 95M885 195l-8 95M955 195l8 95M1025 195l20 95" stroke="#9B2D30" stroke-width="15"/><rect x="830" y="360" width="165" height="70" rx="14" fill="#F58220"/><path d="M860 395h105" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function wrapTitle(title, max = 23) { const words = title.split(/\s+/); const lines = []; let line = ""; for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; } if (line) lines.push(line); return lines.slice(0, 4); }
function coverSvg(item) { const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join(""); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="275" height="42" rx="21" fill="#9B2D30"/><text x="214" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`; }

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));
for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) { const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote5-${item.slug}.svg`); writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`); }
  else await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}
writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
