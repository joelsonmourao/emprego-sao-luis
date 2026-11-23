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
  { slug: "entrevista-comportamental-exemplos", title: "Respostas comportamentais sem travar", label: "ENTREVISTA", motif: "star" },
  { slug: "trabalho-hibrido-sao-luis-checklist", title: "Trabalho híbrido em São Luís", label: "TRABALHO", motif: "hybrid" },
  { slug: "networking-emprego-sao-luis", title: "Networking em São Luís com propósito", label: "CARREIRA", motif: "network" },
  { slug: "pedido-demissao-aviso-previo-acerto", title: "Pedido de demissão e aviso prévio", label: "DIREITOS", motif: "exit" },
  { slug: "candidatura-whatsapp-emprego-mensagem", title: "Candidatura por WhatsApp", label: "CANDIDATURA", motif: "phone" },
  { slug: "follow-up-apos-entrevista-mensagem", title: "Follow-up depois da entrevista", label: "ENTREVISTA", motif: "followup" },
  { slug: "como-pedir-aumento-salario", title: "Como conversar sobre aumento", label: "NEGOCIAÇÃO", motif: "growth" },
  { slug: "vale-alimentacao-ou-refeicao-diferenca", title: "Vale-alimentação ou refeição", label: "BENEFÍCIOS", motif: "meal" },
  { slug: "comparar-duas-propostas-emprego", title: "Como comparar duas propostas", label: "DECISÃO", motif: "balance" },
  { slug: "vagas-motorista-entregador-sao-luis", title: "Motorista e entregas em São Luís", label: "LOGÍSTICA", motif: "driver" },
  { slug: "sindicato-trabalhador-direitos-basico", title: "Sindicato e direitos do trabalhador", label: "DIREITOS", motif: "shield" },
  { slug: "portfolio-simples-candidato-emprego", title: "Portfólio simples para candidatura", label: "PORTFÓLIO", motif: "folder" }
];

const motifs = {
  star: `<g fill="#FFFFFF"><rect x="765" y="155" width="125" height="125" rx="24"/><rect x="930" y="155" width="125" height="125" rx="24"/><rect x="765" y="320" width="125" height="125" rx="24"/><rect x="930" y="320" width="125" height="125" rx="24"/></g><g fill="#9B2D30" font-family="Arial" font-size="44" font-weight="800" text-anchor="middle"><text x="827" y="234">S</text><text x="992" y="234">T</text><text x="827" y="399">A</text><text x="992" y="399">R</text></g><path d="m868 475 52 36 92-95" fill="none" stroke="#F58220" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/>`,
  hybrid: `<path d="M755 300 865 205l110 95v155H755Z" fill="#FFFFFF"/><path d="M810 455V340h110v115" fill="#9B2D30"/><rect x="940" y="180" width="145" height="275" rx="22" fill="#FFFFFF"/><g fill="#9B2D30"><rect x="973" y="220" width="32" height="40"/><rect x="1020" y="220" width="32" height="40"/><rect x="973" y="282" width="32" height="40"/><rect x="1020" y="282" width="32" height="40"/></g><path d="M900 130h40v80" fill="none" stroke="#F58220" stroke-width="20" stroke-linecap="round"/>`,
  network: `<g stroke="#FFFFFF" stroke-width="16"><path d="M800 220 915 315l135-110M915 315 800 430M915 315l145 125"/></g><g fill="#FFFFFF"><circle cx="800" cy="220" r="48"/><circle cx="1050" cy="205" r="48"/><circle cx="800" cy="430" r="48"/><circle cx="1060" cy="440" r="48"/></g><circle cx="915" cy="315" r="66" fill="#F58220"/><circle cx="915" cy="315" r="24" fill="#9B2D30"/>`,
  exit: `<rect x="775" y="145" width="245" height="330" rx="22" fill="#FFFFFF"/><path d="M835 225h125M835 280h125M835 335h85" stroke="#9B2D30" stroke-width="19" stroke-linecap="round"/><path d="M895 430h190M1025 370l65 60-65 60" fill="none" stroke="#F58220" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><circle cx="835" cy="410" r="17" fill="#1A1A1A"/>`,
  phone: `<rect x="795" y="125" width="245" height="385" rx="42" fill="#FFFFFF"/><rect x="825" y="185" width="185" height="225" rx="22" fill="#9B2D30"/><path d="M860 245h115M860 300h80M860 355h105" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/><circle cx="918" cy="465" r="20" fill="#F58220"/><path d="m1008 330 70 35-70 35z" fill="#F58220"/>`,
  followup: `<rect x="760" y="180" width="300" height="205" rx="28" fill="#FFFFFF"/><path d="m780 205 130 105 130-105" fill="none" stroke="#9B2D30" stroke-width="22" stroke-linejoin="round"/><circle cx="1015" cy="420" r="92" fill="#F58220"/><path d="M1015 420v-50M1015 420l42 25" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round"/><path d="M790 455h120" stroke="#FFFFFF" stroke-width="22" stroke-linecap="round"/>`,
  growth: `<g fill="#FFFFFF"><rect x="770" y="365" width="70" height="115" rx="12"/><rect x="875" y="300" width="70" height="180" rx="12"/><rect x="980" y="225" width="70" height="255" rx="12"/></g><path d="m770 300 120-95 85 45 110-120" fill="none" stroke="#F58220" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/><path d="m1030 130 58-5-10 58" fill="none" stroke="#F58220" stroke-width="25" stroke-linecap="round"/>`,
  meal: `<circle cx="845" cy="315" r="135" fill="#FFFFFF"/><circle cx="845" cy="315" r="78" fill="none" stroke="#9B2D30" stroke-width="18"/><path d="M1035 180v270M995 180v100c0 42 80 42 80 0V180" fill="none" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round"/><path d="M1095 180c-45 62-35 135 0 155v115" fill="none" stroke="#F58220" stroke-width="22" stroke-linecap="round"/>`,
  balance: `<path d="M915 150v310M800 205h230" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round"/><path d="m820 205-70 140h140zM1010 205l-70 140h140z" fill="#FFFFFF" opacity=".96"/><circle cx="915" cy="150" r="30" fill="#F58220"/><path d="M820 470h190" stroke="#F58220" stroke-width="25" stroke-linecap="round"/>`,
  driver: `<circle cx="900" cy="315" r="155" fill="#FFFFFF"/><circle cx="900" cy="315" r="105" fill="none" stroke="#9B2D30" stroke-width="23"/><circle cx="900" cy="315" r="35" fill="#F58220"/><path d="M900 280v-70M870 335l-62 65M930 335l62 65" stroke="#1A1A1A" stroke-width="21" stroke-linecap="round"/><path d="M1050 180c62 0 62 96 0 145-62-49-62-145 0-145Z" fill="#F58220"/><circle cx="1050" cy="230" r="20" fill="#FFFFFF"/>`,
  shield: `<path d="M915 135 1070 195v115c0 105-66 175-155 220-89-45-155-115-155-220V195Z" fill="#FFFFFF"/><path d="M915 205v235M845 285h140" stroke="#9B2D30" stroke-width="24" stroke-linecap="round"/><circle cx="915" cy="330" r="45" fill="#F58220" opacity=".92"/>`,
  folder: `<path d="M755 205h145l42 50h155v225H755Z" fill="#FFFFFF"/><rect x="805" y="160" width="210" height="250" rx="22" fill="#F7E9E9" transform="rotate(-5 910 285)"/><path d="M840 230h130M840 285h110M840 340h90" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><path d="M755 270h342v210H755Z" fill="#FFFFFF"/><circle cx="1030" cy="425" r="34" fill="#F58220"/>`
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
  const title = wrapTitle(item.title)
    .map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1A1A1A"/><stop offset="1" stop-color="#3A1517"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".7"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="url(#bg)"/><circle cx="950" cy="315" r="360" fill="url(#halo)"/><path d="M0 560C260 500 430 610 700 545s330-35 500 5v80H0Z" fill="#9B2D30" opacity=".82"/>
    <rect x="76" y="72" width="205" height="42" rx="21" fill="#9B2D30"/><text x="178" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF" letter-spacing="1.6">${escapeXml(item.label)}</text>
    <text x="76" y="185" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF">${title}</text><text x="76" y="520" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`;
}

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));

for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) {
    const svgPath = resolve(tmpdir(), `es-cover-picsum-${item.slug}.svg`);
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
console.log(`[covers] ${items.length} capas Picsum substituídas por ilustrações originais.`);
