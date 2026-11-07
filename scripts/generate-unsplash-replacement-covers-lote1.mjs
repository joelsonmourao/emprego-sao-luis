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
  { slug: "curriculo-ats-palavras-chave-sao-luis", title: "Currículo ATS em São Luís", label: "CURRÍCULO", motif: "ats" },
  { slug: "soft-skills-hard-skills-curriculo", title: "Soft e hard skills sem inventar", label: "COMPETÊNCIAS", motif: "skills" },
  { slug: "primeiro-emprego-sao-luis-checklist", title: "Checklist do primeiro emprego", label: "PRIMEIRO EMPREGO", motif: "first" },
  { slug: "cursos-no-curriculo-sem-enchimento", title: "Cursos no currículo com propósito", label: "FORMAÇÃO", motif: "course" },
  { slug: "marca-pessoal-candidatura-sao-luis", title: "Marca pessoal útil e acessível", label: "CARREIRA", motif: "brand" },
  { slug: "vagas-afirmativas-como-candidatar", title: "Vagas afirmativas com segurança", label: "INCLUSÃO", motif: "inclusion" },
  { slug: "imposto-de-renda-2026-trabalhador-clt", title: "IR 2026 para trabalhador CLT", label: "FINANÇAS", motif: "tax" },
  { slug: "decimo-terceiro-salario-pagamento-clt", title: "13º salário: confira o holerite", label: "DIREITOS", motif: "bonus" },
  { slug: "ferias-clt-periodo-aquisitivo", title: "Férias CLT e período aquisitivo", label: "DIREITOS", motif: "vacation" },
  { slug: "abono-pecuniario-ferias-holerite", title: "Abono pecuniário sem confusão", label: "DIREITOS", motif: "cashout" },
  { slug: "ponto-eletronico-atraso-trabalho", title: "Ponto e atraso no trabalho", label: "ROTINA", motif: "clock" },
  { slug: "feriado-ponto-facultativo-sao-luis", title: "Feriado ou ponto facultativo", label: "SÃO LUÍS", motif: "calendar" }
];

const motifs = {
  ats: `<rect x="780" y="145" width="265" height="340" rx="24" fill="#fff"/><path d="M830 220h165M830 275h115M830 330h145" stroke="#9B2D30" stroke-width="18" stroke-linecap="round"/><circle cx="1010" cy="425" r="78" fill="#F58220"/><path d="m975 425 25 25 48-58" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`,
  skills: `<circle cx="835" cy="275" r="105" fill="#fff"/><circle cx="995" cy="355" r="105" fill="#F58220"/><path d="M835 230v90M790 275h90" stroke="#9B2D30" stroke-width="22" stroke-linecap="round"/><path d="m955 355 30 30 55-70" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M905 315h30" stroke="#fff" stroke-width="18"/>`,
  first: `<path d="M795 455V245l120-95 120 95v210" fill="#fff"/><rect x="865" y="330" width="100" height="125" rx="10" fill="#9B2D30"/><path d="M760 455h315" stroke="#F58220" stroke-width="24" stroke-linecap="round"/><circle cx="915" cy="255" r="45" fill="#F58220"/><path d="m892 255 17 18 32-40" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round"/>`,
  course: `<path d="m760 220 155-75 155 75-155 75z" fill="#fff"/><path d="M805 260v105c75 70 145 70 220 0V260" fill="none" stroke="#fff" stroke-width="24"/><path d="M1070 220v170" stroke="#F58220" stroke-width="18"/><circle cx="1070" cy="410" r="25" fill="#F58220"/><rect x="820" y="410" width="190" height="55" rx="27" fill="#9B2D30"/>`,
  brand: `<circle cx="915" cy="305" r="165" fill="#fff"/><circle cx="915" cy="270" r="62" fill="#9B2D30"/><path d="M810 430c18-92 190-92 210 0" fill="#F58220"/><path d="M785 190 750 155M1045 190l35-35M750 315h-50M1080 315h50" stroke="#fff" stroke-width="18" stroke-linecap="round"/>`,
  inclusion: `<circle cx="850" cy="260" r="68" fill="#fff"/><circle cx="990" cy="260" r="68" fill="#F58220"/><circle cx="920" cy="390" r="68" fill="#fff"/><path d="M850 260 920 390l70-130" fill="none" stroke="#9B2D30" stroke-width="20"/><circle cx="920" cy="315" r="32" fill="#1A1A1A"/>`,
  tax: `<rect x="790" y="135" width="260" height="355" rx="22" fill="#fff"/><path d="M835 205h170M835 260h110M835 315h150" stroke="#9B2D30" stroke-width="17" stroke-linecap="round"/><text x="920" y="430" text-anchor="middle" font-family="Arial" font-size="88" font-weight="800" fill="#F58220">IR</text>`,
  bonus: `<rect x="775" y="185" width="280" height="250" rx="30" fill="#fff"/><circle cx="915" cy="310" r="82" fill="#9B2D30"/><text x="915" y="342" text-anchor="middle" font-family="Arial" font-size="82" font-weight="800" fill="#fff">13</text><path d="M815 470h200" stroke="#F58220" stroke-width="25" stroke-linecap="round"/>`,
  vacation: `<circle cx="915" cy="310" r="175" fill="#fff"/><path d="M915 150v320M755 310h320" stroke="#9B2D30" stroke-width="18"/><path d="M915 150c-95 85-95 235 0 320M915 150c95 85 95 235 0 320" fill="none" stroke="#9B2D30" stroke-width="15"/><path d="M1040 180c42 25 60 58 68 95" stroke="#F58220" stroke-width="22" stroke-linecap="round"/>`,
  cashout: `<path d="M760 190h310v250H760z" fill="#fff"/><circle cx="915" cy="315" r="78" fill="#9B2D30"/><path d="M915 260v110M880 285c15-35 75-30 75 5 0 40-75 20-75 60 0 35 60 40 78 3" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round"/><path d="M790 470h250" stroke="#F58220" stroke-width="24" stroke-linecap="round"/>`,
  clock: `<circle cx="915" cy="310" r="170" fill="#fff"/><circle cx="915" cy="310" r="125" fill="none" stroke="#9B2D30" stroke-width="20"/><path d="M915 310V220M915 310l80 55" stroke="#1A1A1A" stroke-width="23" stroke-linecap="round"/><circle cx="915" cy="310" r="20" fill="#F58220"/>`,
  calendar: `<rect x="765" y="155" width="300" height="315" rx="28" fill="#fff"/><path d="M765 235h300" stroke="#9B2D30" stroke-width="24"/><path d="M830 125v65M1000 125v65" stroke="#F58220" stroke-width="25" stroke-linecap="round"/><g fill="#9B2D30"><circle cx="835" cy="300" r="18"/><circle cx="915" cy="300" r="18"/><circle cx="995" cy="300" r="18"/><circle cx="835" cy="380" r="18"/><circle cx="995" cy="380" r="18"/></g><circle cx="915" cy="380" r="32" fill="#F58220"/>`
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapTitle(title, max = 23) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function coverSvg(item) {
  const title = wrapTitle(item.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 64}">${escapeXml(line)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#451719"/></linearGradient><radialGradient id="halo"><stop stop-color="#E41E26" stop-opacity=".65"/><stop offset="1" stop-color="#9B2D30" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="url(#bg)"/><circle cx="930" cy="310" r="365" fill="url(#halo)"/><path d="M0 545c245-62 445 45 690-15s340-18 510 26v74H0z" fill="#9B2D30" opacity=".86"/>
    <rect x="76" y="72" width="245" height="42" rx="21" fill="#9B2D30"/><text x="198" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff" letter-spacing="1.5">${escapeXml(item.label)}</text>
    <text x="76" y="185" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text><text x="76" y="515" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#F58220">EMPREGOS SÃO LUÍS</text>${motifs[item.motif]}</svg>`;
}

const credits = JSON.parse(readFileSync(creditsPath, "utf8"));
const bySlug = new Map(credits.map((item) => [item.slug, item]));

for (const item of items) {
  const svg = Buffer.from(coverSvg(item));
  if (svgOnly) {
    const svgPath = resolve(tmpdir(), `es-cover-unsplash-lote1-${item.slug}.svg`);
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
    createdAt: "2026-10-13"
  });
}

writeFileSync(creditsPath, `${JSON.stringify(credits.map((item) => bySlug.get(item.slug)), null, 2)}\n`, "utf8");
console.log(`[covers] ${items.length} capas Unsplash substituídas por ilustrações originais.`);
