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
  { slug: "ler-contrato-trabalho-clt", title: "Contrato CLT: leia antes de assinar", label: "DIREITOS", motif: "contract" },
  { slug: "mitos-direitos-trabalhistas-whatsapp", title: "Mitos trabalhistas: confira a fonte", label: "CHECAGEM", motif: "verify" },
  { slug: "salario-custo-de-vida-sao-luis", title: "Salário e custo de vida em São Luís", label: "PLANEJAMENTO", motif: "budget" },
  { slug: "negociar-horario-deslocamento-emprego", title: "Deslocamento: horário e auxílio", label: "NEGOCIAÇÃO", motif: "commute" },
  { slug: "trabalhar-fim-de-semana-folga-adicional", title: "Fim de semana: folga e adicional", label: "JORNADA", motif: "weekend" },
  { slug: "transferencia-interna-emprego-como-pedir", title: "Transferência interna com clareza", label: "CARREIRA", motif: "transfer" },
  { slug: "avaliacao-de-desempenho-preparacao", title: "Avaliação: prepare-se sem teatro", label: "DESEMPENHO", motif: "review" },
  { slug: "entrevista-desligamento-o-que-falar", title: "Entrevista de desligamento", label: "SAÍDA", motif: "exit" },
  { slug: "vaga-sazonal-comercio-sao-luis", title: "Vaga sazonal no comércio local", label: "VAGA LOCAL", motif: "seasonal" },
  { slug: "empatia-atendimento-cliente-entrevista", title: "Empatia no atendimento ao cliente", label: "ATENDIMENTO", motif: "empathy" },
  { slug: "gap-habilidades-candidatura-como-fechar", title: "Feche lacunas antes da candidatura", label: "HABILIDADES", motif: "skills" },
  { slug: "certificado-ou-experiencia-curriculo", title: "Certificado ou experiência no currículo", label: "CURRÍCULO", motif: "certificate" }
];

const motifs = {
  contract: `<rect x="770" y="145" width="300" height="345" rx="22" fill="#fff"/><path d="M825 220h190M825 280h160M825 340h185" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="m825 420 45 38 95-105" fill="none" stroke="#F58220" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`,
  verify: `<path d="M765 170h320v230H925l-85 70 22-70h-97z" fill="#fff"/><path d="M820 235h205M820 295h135" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><circle cx="1035" cy="405" r="74" fill="#F58220"/><path d="m995 405 28 28 52-65" fill="none" stroke="#fff" stroke-width="19" stroke-linecap="round"/>`,
  budget: `<circle cx="925" cy="315" r="165" fill="#fff"/><path d="M925 185v260M860 235h105c45 0 45 70 0 70h-80c-45 0-45 70 0 70h110" fill="none" stroke="#9B2D30" stroke-width="22" stroke-linecap="round"/><path d="M760 485h330" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  commute: `<path d="M760 365h320l-25-120c-8-38-38-65-78-65h-115c-40 0-70 27-78 65z" fill="#fff"/><path d="M815 260h220M830 365h190" stroke="#9B2D30" stroke-width="20" stroke-linecap="round"/><circle cx="835" cy="410" r="38" fill="#F58220"/><circle cx="1005" cy="410" r="38" fill="#F58220"/><path d="M755 485h340" stroke="#fff" stroke-width="18" stroke-dasharray="28 24"/>`,
  weekend: `<rect x="755" y="155" width="340" height="330" rx="25" fill="#fff"/><path d="M755 235h340M830 130v70M1020 130v70" stroke="#9B2D30" stroke-width="22" stroke-linecap="round"/><path d="M820 300h70v70h-70zM915 300h70v70h-70zM1010 300h45v70h-45z" fill="#9B2D30"/><path d="m835 430 35 30 75-82" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  transfer: `<rect x="755" y="175" width="145" height="245" rx="18" fill="#fff"/><rect x="960" y="175" width="145" height="245" rx="18" fill="#fff"/><path d="M865 275h130m0 0-45-45m45 45-45 45M995 385H865m0 0 45-45m-45 45 45 45" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`,
  review: `<path d="M770 150h310v330H770z" fill="#fff"/><path d="M830 230h190M830 295h145M830 360h180" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="M815 425h55l28-55 42 95 35-70h70" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`,
  exit: `<rect x="785" y="155" width="265" height="330" rx="20" fill="#fff"/><path d="M835 230h110M835 290h110M835 350h110" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><path d="M1000 320h105m0 0-50-50m50 50-50 50" fill="none" stroke="#F58220" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/><path d="M1000 220v200" stroke="#9B2D30" stroke-width="18"/>`,
  seasonal: `<path d="M770 235h310v230H770z" fill="#fff"/><path d="M740 235h370l-48-90H788z" fill="#F58220"/><path d="M835 300h180M835 360h140" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><circle cx="1050" cy="185" r="45" fill="#fff"/><path d="M1050 110v40M1050 220v40M975 185h40M1085 185h40" stroke="#fff" stroke-width="15" stroke-linecap="round"/>`,
  empathy: `<circle cx="840" cy="275" r="78" fill="#fff"/><circle cx="1010" cy="275" r="78" fill="#fff"/><path d="M770 455c12-90 58-135 140-135M1080 455c-12-90-58-135-140-135" fill="none" stroke="#fff" stroke-width="35" stroke-linecap="round"/><path d="M925 455c-115-75-102-172-39-172 31 0 39 23 39 23s8-23 39-23c63 0 76 97-39 172z" fill="#F58220"/>`,
  skills: `<path d="M770 435h110v-90H770zm150 0h110V275H920zm150 0h55V195h-55z" fill="#fff"/><path d="m780 285 70-65 75 45 100-115 72 55" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><circle cx="850" cy="220" r="17" fill="#fff"/><circle cx="925" cy="265" r="17" fill="#fff"/><circle cx="1025" cy="150" r="17" fill="#fff"/>`,
  certificate: `<rect x="770" y="145" width="310" height="300" rx="24" fill="#fff"/><path d="M825 220h200M825 280h150M825 340h175" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><circle cx="1010" cy="420" r="70" fill="#F58220"/><path d="m975 420 24 25 47-58" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="m980 475-25 70 55-28 55 28-25-70" fill="#F58220"/>`
};

function escapeXml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function wrapTitle(title, max = 23) { const words = title.split(/\s+/); const lines = []; let line = ""; for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; } if (line) lines.push(line); return lines.slice(0, 4); }
function coverSvg(item) { const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join(""); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/><rect x="76" y="72" width="275" height="42" rx="21" fill="#9B2D30"/><text x="214" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text><text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`; }

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));
for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) { const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote7-${item.slug}.svg`); writeFileSync(svgPath, svg); console.log(`${item.slug}\t${svgPath}`); }
  else await sharp(svg).resize(1200, 630).webp({ quality: 88 }).toFile(resolve(coversDir, `${item.slug}.webp`));
  bySlug.set(item.slug, { slug: item.slug, source: "original", photographer: "Equipe editorial Empregos São Luís", credit: "Ilustração editorial original: Empregos São Luís", caption: `Ilustração editorial original para “${item.title}”.`, alt: `Ilustração de capa: ${item.title}`, licenseStatus: "owned", licenseBasis: "Criação gráfica original produzida para o portal; sem fotografia, rosto, logotipo de terceiro ou banco externo.", createdAt: "2026-10-13" });
}
writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
