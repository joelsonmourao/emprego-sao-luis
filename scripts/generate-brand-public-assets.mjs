#!/usr/bin/env node
/**
 * Gera derivados em apps/web/public a partir de Logo/ (somente leitura).
 *
 * As fontes oficiais em Logo/ são PNG RGB sem alpha (fundo branco/cinza opaco).
 * Este script:
 *  - remove o fundo claro por flood-fill a partir das bordas (alpha real);
 *  - gera logo para fundo claro (transparente) e para fundo escuro (placa branca);
 *  - gera favicons a partir do SVG de marca (legível em 16–32px), não do logo inteiro.
 *
 * node scripts/generate-brand-public-assets.mjs
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconSrc = resolve(root, "Logo/icon.png");
const logoSrc = resolve(root, "Logo/logo-horizontal.png");
const faviconSvgPath = resolve(root, "apps/web/public/favicon.svg");

function ensureDir(file) {
  mkdirSync(dirname(file), { recursive: true });
}

function rel(out) {
  return out.replace(/\\/g, "/").split("/ES/")[1] ?? out.replace(/\\/g, "/");
}

/** Fundo claro/acinzentado típico de export sem alpha (não remove traços brancos internos). */
function isLightBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  return min >= 218 && chroma <= 22;
}

/**
 * Remove fundo claro conectado às bordas → alpha real.
 * Preserva halo/traço branco interno da tipografia (não conectado às bordas).
 */
async function knockoutEdgeBackground(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    queue.push(p);
  };

  for (let x = 0; x < w; x += 1) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y);
    push(w - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    const i = p * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isLightBackgroundPixel(r, g, b)) continue;
    data[i + 3] = 0;
    const x = p % w;
    const y = (p / w) | 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } });
}

async function writePipeline(pipeline, out, { width, height = null, fit = "contain", flatten = null } = {}) {
  ensureDir(out);
  let p = pipeline;
  if (flatten) {
    p = p.flatten({ background: flatten });
  }
  p = p.resize({
    width,
    ...(height ? { height } : {}),
    fit,
    background: flatten
      ? { ...flatten, alpha: 1 }
      : { r: 0, g: 0, b: 0, alpha: 0 },
    withoutEnlargement: false
  });
  if (out.endsWith(".webp")) await p.webp({ quality: 92, alphaQuality: 100 }).toFile(out);
  else await p.png().toFile(out);
  const meta = await sharp(out).metadata();
  const { data, info } = await sharp(out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 10) transparent += 1;
  return {
    out: rel(out),
    bytes: statSync(out).size,
    w: meta.width,
    h: meta.height,
    hasAlpha: Boolean(meta.hasAlpha),
    pctTransparent: Number(((transparent / (info.width * info.height)) * 100).toFixed(1))
  };
}

/** Logo escuro (texto vinho/cinza) sobre placa branca — contraste no rodapé. */
async function writeLogoOnDarkPlate(transparentLogo, out, targetWidth = 800) {
  ensureDir(out);
  const resized = await transparentLogo
    .clone()
    .resize({ width: targetWidth - 48, fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer({ resolveWithObject: true });
  const padX = 24;
  const padY = 16;
  const canvasW = resized.info.width + padX * 2;
  const canvasH = resized.info.height + padY * 2;
  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: resized.data, top: padY, left: padX }])
    .webp({ quality: 92 })
    .toFile(out);
  const meta = await sharp(out).metadata();
  return { out: rel(out), bytes: statSync(out).size, w: meta.width, h: meta.height, hasAlpha: Boolean(meta.hasAlpha), plate: "white" };
}

const report = [];
const iconCut = await knockoutEdgeBackground(iconSrc);
const logoCut = await knockoutEdgeBackground(logoSrc);

// Ícone / logo com alpha real (fundos claros do site)
report.push(await writePipeline(iconCut.clone(), resolve(root, "apps/web/public/brand/icon.webp"), { width: 512, height: 512 }));
report.push(await writePipeline(iconCut.clone(), resolve(root, "apps/web/public/brand/icon.png"), { width: 512, height: 512 }));
report.push(await writePipeline(logoCut.clone(), resolve(root, "apps/web/public/brand/logo-horizontal.webp"), { width: 800 }));
report.push(await writePipeline(logoCut.clone(), resolve(root, "apps/web/public/brand/logo-horizontal.png"), { width: 800 }));
report.push(await writePipeline(logoCut.clone(), resolve(root, "apps/web/public/brand/logo-horizontal-sm.webp"), { width: 400 }));
// Open Graph / e-mail: plataformas sociais preencham alpha com preto — fundo branco opaco
report.push(
  await writePipeline(logoCut.clone(), resolve(root, "apps/web/public/brand/og-default.png"), {
    width: 1200,
    height: 630,
    fit: "contain",
    flatten: { r: 255, g: 255, b: 255 }
  })
);

// Instagram / painéis escuros: marca nítida em fundo branco sólido
report.push(
  await writePipeline(iconCut.clone(), resolve(root, "apps/web/public/brand/icon-instagram.webp"), {
    width: 320,
    height: 320,
    flatten: { r: 255, g: 255, b: 255 }
  })
);

// Rodapé escuro: placa branca (letras escuras da marca precisam de suporte claro)
report.push(await writeLogoOnDarkPlate(logoCut.clone(), resolve(root, "apps/web/public/brand/logo-horizontal-on-dark.webp"), 800));

// Favicons: SVG de marca (ES), não o logo horizontal inteiro
const svgBuffer = readFileSync(faviconSvgPath);
const favicons = [
  ["apps/web/public/favicon-16x16.png", 16],
  ["apps/web/public/favicon-32x32.png", 32],
  ["apps/web/public/favicon-48x48.png", 48],
  ["apps/web/public/apple-touch-icon.png", 180],
  ["apps/web/public/icon-192.png", 192],
  ["apps/web/public/icon-512.png", 512]
];
for (const [relPath, size] of favicons) {
  const out = resolve(root, relPath);
  ensureDir(out);
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size, { fit: "fill" })
    .png()
    .toFile(out);
  report.push({ out: rel(out), bytes: statSync(out).size, w: size, h: size, source: "favicon.svg" });
}

await sharp(resolve(root, "apps/web/public/favicon-32x32.png")).toFile(resolve(root, "apps/web/public/favicon.ico"));
report.push({ out: "apps/web/public/favicon.ico", bytes: statSync(resolve(root, "apps/web/public/favicon.ico")).size, w: 32, h: 32 });

writeFileSync(
  resolve(root, "apps/web/public/site.webmanifest"),
  `${JSON.stringify(
    {
      name: "Empregos São Luís",
      short_name: "Empregos SL",
      description: "Vagas de emprego em São Luís e Maranhão",
      start_url: "/",
      display: "standalone",
      background_color: "#F5F5F5",
      theme_color: "#9B2D30",
      lang: "pt-BR",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" }
      ]
    },
    null,
    2
  )}\n`
);

console.log(
  JSON.stringify(
    {
      ok: true,
      sources: {
        icon: { path: "Logo/icon.png", bytes: statSync(iconSrc).size, note: "RGB sem alpha — fundo removido no gerador" },
        logo: { path: "Logo/logo-horizontal.png", bytes: statSync(logoSrc).size, note: "RGB sem alpha — fundo removido no gerador" }
      },
      logoFolderUntouched: true,
      generated: report
    },
    null,
    2
  )
);
