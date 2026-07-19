#!/usr/bin/env node
/**
 * Gera derivados otimizados em apps/web/public a partir de Logo/ (somente leitura).
 * Não altera Logo/, não muda paleta do site — apenas reamostra ativos oficiais.
 *
 * node scripts/generate-brand-public-assets.mjs
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconSrc = resolve(root, "Logo/icon.png");
const logoSrc = resolve(root, "Logo/logo-horizontal.png");

function ensureDir(file) {
  mkdirSync(dirname(file), { recursive: true });
}

function rel(out) {
  return out.replace(/\\/g, "/").split("/ES/")[1] ?? out.replace(/\\/g, "/");
}

/** Remove fundo quase branco (artefato de export) preservando cores da marca. */
async function knockoutNearWhite(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= 248 && g >= 248 && b >= 248) data[i + 3] = 0;
  }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  });
}

async function writeResized(src, out, { width, height = null, fit = "contain", flattenWhite = false }) {
  ensureDir(out);
  let pipeline = typeof src === "string" ? sharp(src) : src;
  if (flattenWhite) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }
  pipeline = pipeline.resize({
    width,
    ...(height ? { height } : {}),
    fit,
    background: flattenWhite
      ? { r: 255, g: 255, b: 255, alpha: 1 }
      : { r: 0, g: 0, b: 0, alpha: 0 },
    withoutEnlargement: false
  });
  if (out.endsWith(".webp")) await pipeline.webp({ quality: 90 }).toFile(out);
  else await pipeline.png().toFile(out);
  const meta = await sharp(out).metadata();
  return { out: rel(out), bytes: statSync(out).size, w: meta.width, h: meta.height, hasAlpha: Boolean(meta.hasAlpha) };
}

const report = [];

report.push(await writeResized(iconSrc, resolve(root, "apps/web/public/brand/icon.webp"), { width: 512, height: 512 }));
report.push(await writeResized(iconSrc, resolve(root, "apps/web/public/brand/icon.png"), { width: 512, height: 512 }));

// Instagram em painel escuro: marca nítida em fundo branco sólido (letras escuras legíveis)
report.push(
  await writeResized(await knockoutNearWhite(iconSrc), resolve(root, "apps/web/public/brand/icon-instagram.webp"), {
    width: 320,
    height: 320,
    flattenWhite: true
  })
);

report.push(await writeResized(logoSrc, resolve(root, "apps/web/public/brand/logo-horizontal.webp"), { width: 800 }));
report.push(await writeResized(logoSrc, resolve(root, "apps/web/public/brand/logo-horizontal.png"), { width: 800 }));
report.push(await writeResized(logoSrc, resolve(root, "apps/web/public/brand/logo-horizontal-sm.webp"), { width: 400 }));

// Logo para fundos escuros (rodapé): sem caixa branca
report.push(
  await writeResized(await knockoutNearWhite(logoSrc), resolve(root, "apps/web/public/brand/logo-horizontal-on-dark.webp"), {
    width: 800
  })
);

const favicons = [
  ["apps/web/public/favicon-16x16.png", 16],
  ["apps/web/public/favicon-32x32.png", 32],
  ["apps/web/public/favicon-48x48.png", 48],
  ["apps/web/public/apple-touch-icon.png", 180],
  ["apps/web/public/icon-192.png", 192],
  ["apps/web/public/icon-512.png", 512]
];
for (const [relPath, size] of favicons) {
  // Favicon legível: fundo branco sólido + ícone oficial
  report.push(
    await writeResized(await knockoutNearWhite(iconSrc), resolve(root, relPath), {
      width: size,
      height: size,
      fit: "contain",
      flattenWhite: true
    })
  );
}

await sharp(resolve(root, "apps/web/public/favicon-32x32.png")).toFile(resolve(root, "apps/web/public/favicon.ico"));
report.push({
  out: "apps/web/public/favicon.ico",
  bytes: statSync(resolve(root, "apps/web/public/favicon.ico")).size,
  w: 32,
  h: 32
});

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
        icon: { path: "Logo/icon.png", bytes: statSync(iconSrc).size },
        logo: { path: "Logo/logo-horizontal.png", bytes: statSync(logoSrc).size }
      },
      logoFolderUntouched: true,
      generated: report
    },
    null,
    2
  )
);
