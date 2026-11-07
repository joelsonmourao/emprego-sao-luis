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
  { slug: "vagas-hotelaria-temporada-sao-luis", title: "Hotelaria em São Luís: rotina e atendimento", label: "VAGA LOCAL", motif: "hotel" },
  { slug: "plano-90-dias-emprego-sao-luis", title: "Plano de 90 dias para buscar emprego", label: "PLANEJAMENTO", motif: "calendar" },
  { slug: "convencao-coletiva-holerite-trabalhador", title: "Convenção coletiva e holerite", label: "DIREITOS", motif: "agreement" },
  { slug: "atestado-medico-trabalho-como-entregar", title: "Atestado médico: entrega e registro", label: "DIREITOS", motif: "medical" },
  { slug: "acidente-de-trabalho-o-que-fazer", title: "Acidente de trabalho: primeiros passos", label: "SEGURANÇA", motif: "helmet" },
  { slug: "trabalhador-terceirizado-direitos", title: "Trabalho terceirizado sem dúvida de vínculo", label: "DIREITOS", motif: "network" },
  { slug: "trabalho-noturno-adicional-o-que-perguntar", title: "Trabalho noturno: jornada e adicional", label: "JORNADA", motif: "night" },
  { slug: "conflito-com-chefe-trabalho-dicas", title: "Conflito com a chefia: diálogo objetivo", label: "TRABALHO", motif: "dialogue" },
  { slug: "inteligencia-emocional-entrevista", title: "Calma e clareza durante a entrevista", label: "ENTREVISTA", motif: "emotion" },
  { slug: "gestao-de-tempo-trabalho-dicas", title: "Gestão do tempo no emprego novo", label: "ORGANIZAÇÃO", motif: "clock" },
  { slug: "alfabetizacao-digital-emprego-basico", title: "Habilidades digitais para começar", label: "HABILIDADES", motif: "laptop" },
  { slug: "comparar-portais-emprego-seguranca", title: "Comparar vagas e evitar golpes", label: "BUSCA SEGURA", motif: "compare" }
];

const motifs = {
  hotel: `<path d="M760 245h335v220H760z" fill="#fff"/><path d="M790 330h275M825 270h95v60h-95zM935 270h95v60h-95z" fill="none" stroke="#9B2D30" stroke-width="18"/><circle cx="925" cy="190" r="48" fill="#F58220"/><path d="M925 155v70M890 225h70" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`,
  calendar: `<rect x="760" y="150" width="330" height="335" rx="24" fill="#fff"/><path d="M760 230h330M835 130v65M1015 130v65" stroke="#9B2D30" stroke-width="22" stroke-linecap="round"/><text x="925" y="385" text-anchor="middle" font-family="Arial" font-size="120" font-weight="800" fill="#9B2D30">90</text><path d="m985 430 30 30 62-78" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  agreement: `<rect x="780" y="145" width="285" height="330" rx="20" fill="#fff"/><path d="M830 225h185M830 285h150M830 345h180" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="m820 420 55-45 58 36 55-40 62 50" fill="none" stroke="#F58220" stroke-width="24" stroke-linejoin="round"/>`,
  medical: `<rect x="775" y="155" width="300" height="320" rx="26" fill="#fff"/><path d="M870 210h110v70h70v110h-70v70H870v-70h-70V280h70z" fill="#9B2D30"/><path d="M815 190h220" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  helmet: `<path d="M775 370a150 150 0 0 1 300 0v50H775z" fill="#fff"/><path d="M835 360V245c0-42 35-75 78-75h24c43 0 78 33 78 75v115" fill="#9B2D30" stroke="#fff" stroke-width="18"/><path d="M925 175v185M765 420h320" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  network: `<circle cx="925" cy="190" r="62" fill="#F58220"/><circle cx="795" cy="410" r="62" fill="#fff"/><circle cx="1055" cy="410" r="62" fill="#fff"/><path d="m885 235-62 125M965 235l62 125M855 410h140" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M895 190h60" stroke="#fff" stroke-width="18" stroke-linecap="round"/>`,
  night: `<circle cx="925" cy="310" r="160" fill="#fff"/><path d="M980 180a130 130 0 1 0 80 210 150 150 0 0 1-80-210" fill="#9B2D30"/><circle cx="820" cy="225" r="15" fill="#F58220"/><circle cx="1040" cy="275" r="12" fill="#F58220"/><path d="M925 310v-75M925 310l65 45" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  dialogue: `<path d="M755 160h230v180H845l-70 60 15-60h-35z" fill="#fff"/><path d="M865 285h235v175H965l-78 55 18-55h-40z" fill="#F58220"/><path d="M805 225h125M925 350h120M925 400h80" stroke="#9B2D30" stroke-width="16" stroke-linecap="round"/>`,
  emotion: `<path d="M925 455c-190-125-170-285-65-285 52 0 65 38 65 38s13-38 65-38c105 0 125 160-65 285z" fill="#fff"/><path d="M805 330h75l35-70 45 135 35-65h65" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`,
  clock: `<circle cx="925" cy="310" r="155" fill="#fff"/><path d="M925 205v110l80 55" fill="none" stroke="#9B2D30" stroke-width="24" stroke-linecap="round"/><path d="m790 425 40 40 85-100" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round"/>`,
  laptop: `<rect x="765" y="155" width="320" height="250" rx="22" fill="#fff"/><path d="M800 190h250v175H800z" fill="#9B2D30"/><path d="m835 280 45 45 90-110" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round"/><path d="M735 425h380l-45 60H780z" fill="#fff"/>`,
  compare: `<rect x="745" y="170" width="155" height="260" rx="18" fill="#fff"/><rect x="950" y="170" width="155" height="260" rx="18" fill="#fff"/><path d="M780 225h85M780 280h85M985 225h85M985 280h85" stroke="#9B2D30" stroke-width="15" stroke-linecap="round"/><path d="M925 245v110M890 280h70" stroke="#F58220" stroke-width="22" stroke-linecap="round"/><path d="M925 500c-82-38-95-105-95-105l95-40 95 40s-13 67-95 105z" fill="#F58220"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function wrapTitle(title, max = 23) { const words = title.split(/\s+/); const lines = []; let line = ""; for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; } if (line) lines.push(line); return lines.slice(0, 4); }
function coverSvg(item) { const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join(""); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="275" height="42" rx="21" fill="#9B2D30"/><text x="214" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`; }

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));
for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) { const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote6-${item.slug}.svg`); writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`); }
  else await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}
writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
