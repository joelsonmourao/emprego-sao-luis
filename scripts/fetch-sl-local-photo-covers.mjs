#!/usr/bin/env node
/**
 * Baixa fotos reais (Unsplash, fallback Picsum) → apps/web/public/covers/sl-local/{slug}.webp
 *   node scripts/fetch-sl-local-photo-covers.mjs
 *   node scripts/fetch-sl-local-photo-covers.mjs --force
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { catalog, slugFor } from "./data/sl-local-editorial-catalog.mjs";

const force = process.argv.includes("--force");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "apps/web/public/covers/sl-local");
const creditsPath = resolve(outDir, "credits.json");
mkdirSync(outDir, { recursive: true });

/** Fotos Unsplash (trabalho / escritório / pessoas) — uma por índice até o fim do catálogo. */
/** @type {Array<{ id: string; photographer: string }>} */
const stock = [
  { id: "1521737711867-e3b97375f902", photographer: "LinkedIn Sales Solutions" },
  { id: "1454165804606-c3d57bc86b40", photographer: "Scott Graham" },
  { id: "1551836022-d5d88e9218df", photographer: "Amy Hirschi" },
  { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters" },
  { id: "1556761175-5973dc0f32e7", photographer: "LinkedIn Sales Solutions" },
  { id: "1522202176988-66273c2fd55f", photographer: "Brooke Cagle" },
  { id: "1516321318423-f06f85e504b3", photographer: "Compare Fibre" },
  { id: "1586281380349-632531db7ed4", photographer: "Resume Genius" },
  { id: "1560250097-0b93528c311a", photographer: "LinkedIn Sales Solutions" },
  { id: "1573496359142-b8d87734a5a2", photographer: "Christina Wocintechchat" },
  { id: "1557804506-669a67965ba0", photographer: "Mimi Thian" },
  { id: "1600880292203-757bb62b4baf", photographer: "Jason Goodman" },
  { id: "1552664730-d307ca884978", photographer: "Headway" },
  { id: "1507679799987-c73779587ccf", photographer: "Hunter Johnson" },
  { id: "1517245386807-bb43f82c33c4", photographer: "Brooke Cagle" },
  { id: "1556742049-0cfed4f6a45d", photographer: "Blake Wisz" },
  { id: "1556740758-90decb4dfe80", photographer: "Blake Wisz" },
  { id: "1441986300917-64674bd600d8", photographer: "Austin Distel" },
  { id: "1556740738-b6a63e27c4df", photographer: "Blake Wisz" },
  { id: "1472851294608-73414d2799e8", photographer: "Christian Wiediger" },
  { id: "1497366216548-37526070297c", photographer: "Nastuh Abootalebi" },
  { id: "1497366754035-f200968a6e72", photographer: "Nastuh Abootalebi" },
  { id: "1497215728101-536fc9f2276d", photographer: "Alesia Kazantceva" },
  { id: "1486406146926-c627a92ad1ab", photographer: "Sean Pollock" },
  { id: "1460925895917-afdab827c52f", photographer: "Carlos Muza" },
  { id: "1553877522-43269d4ea984", photographer: "You X Ventures" },
  { id: "1519389950473-47ba0277781c", photographer: "Marvin Meyer" },
  { id: "1531482615713-2afd69097998", photographer: "Christina Wocintechchat" },
  { id: "1573164713714-d95e436ab8d6", photographer: "Christina Wocintechchat" },
  { id: "1596524430615-b46475ddff6e", photographer: "Christina Wocintechchat" },
  { id: "1522071820081-009f0129c71c", photographer: "Austin Distel" },
  { id: "1563986768609-322da13575f3", photographer: "Christin Hume" },
  { id: "1516321497487-e849bc9f4b8e", photographer: "Compare Fibre" },
  { id: "1434030216411-0b793f4b4173", photographer: "Green Chameleon" },
  { id: "1503676260728-1c00da094a0b", photographer: "Element5 Digital" },
  { id: "1450101499163-c8848c66ca85", photographer: "Scott Graham" },
  { id: "1498050108023-c5249f4df085", photographer: "Lee Campbell" },
  { id: "1515378791036-0648a3ef77b2", photographer: "Andrew Neel" },
  { id: "1521737604893-d14cc237f11d", photographer: "LinkedIn Sales Solutions" },
  { id: "1517048676732-d65bc937f952", photographer: "Christina Wocintechchat" },
  { id: "1523240795612-9a054b0db644", photographer: "Priscilla Du Preez" },
  { id: "1573497019940-1cfe6d66f2e8", photographer: "Christina Wocintechchat" },
  { id: "1542744173-8e7e53415bb0", photographer: "Campaign Creators" },
  { id: "1559136555-9303baacfa92", photographer: "You X Ventures" },
  { id: "1504384308090-c894fdcc538d", photographer: "Marvin Meyer" },
  { id: "1497215842964-222b430dc094", photographer: "Alesia Kazantceva" },
  { id: "1556761175-b39cc9c0f0b6", photographer: "LinkedIn Sales Solutions" },
  { id: "1517245386807-bb43f82c33c4", photographer: "Brooke Cagle" },
  { id: "1552664730-d307ca884978", photographer: "Headway" },
  { id: "1431540015162-d9a8a6a0d4d4", photographer: "Todd Quackenbush" },
  { id: "1522202176988-66273c2fd55f", photographer: "Brooke Cagle" },
  { id: "1556761175-5973dc0f32e7", photographer: "LinkedIn Sales Solutions" },
  { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters" },
  { id: "1454165804606-c3d57bc86b40", photographer: "Scott Graham" },
  { id: "1497215728101-536fc9f2276d", photographer: "Alesia Kazantceva" },
  { id: "1460925895917-afdab827c52f", photographer: "Carlos Muza" },
  { id: "1553877522-43269d4ea984", photographer: "You X Ventures" },
  { id: "1519389950473-47ba0277781c", photographer: "Marvin Meyer" },
  { id: "1573164713714-d95e436ab8d6", photographer: "Christina Wocintechchat" },
  { id: "1522071820081-009f0129c71c", photographer: "Austin Distel" },
  { id: "1543269865-cbf427effbad", photographer: "Brooke Cagle" },
  { id: "1517245386807-bb43f82c33c4", photographer: "Brooke Cagle" },
  { id: "1551836022-d5d88e9218df", photographer: "Amy Hirschi" },
  { id: "1573497019940-1cfe6d66f2e8", photographer: "Christina Wocintechchat" },
  { id: "1556761175-5973dc0f32e7", photographer: "LinkedIn Sales Solutions" },
  { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters" },
  { id: "1521737711867-e3b97375f902", photographer: "LinkedIn Sales Solutions" },
  { id: "1600880292203-757bb62b4baf", photographer: "Jason Goodman" },
  { id: "1557804506-669a67965ba0", photographer: "Mimi Thian" },
  { id: "1573496359142-b8d87734a5a2", photographer: "Christina Wocintechchat" },
  { id: "1516321318423-f06f85e504b3", photographer: "Compare Fibre" },
  { id: "1586281380349-632531db7ed4", photographer: "Resume Genius" },
  { id: "1560250097-0b93528c311a", photographer: "LinkedIn Sales Solutions" },
  { id: "1507679799987-c73779587ccf", photographer: "Hunter Johnson" },
  { id: "1556742049-0cfed4f6a45d", photographer: "Blake Wisz" },
  { id: "1556740758-90decb4dfe80", photographer: "Blake Wisz" },
  { id: "1441986300917-64674bd600d8", photographer: "Austin Distel" },
  { id: "1472851294608-73414d2799e8", photographer: "Christian Wiediger" },
  { id: "1497366216548-37526070297c", photographer: "Nastuh Abootalebi" },
  { id: "1486406146926-c627a92ad1ab", photographer: "Sean Pollock" },
  { id: "1515378791036-0648a3ef77b2", photographer: "Andrew Neel" },
  { id: "1521737604893-d14cc237f11d", photographer: "LinkedIn Sales Solutions" },
  { id: "1517048676732-d65bc937f952", photographer: "Christina Wocintechchat" },
  { id: "1523240795612-9a054b0db644", photographer: "Priscilla Du Preez" },
  { id: "1542744173-8e7e53415bb0", photographer: "Campaign Creators" },
  { id: "1504384308090-c894fdcc538d", photographer: "Marvin Meyer" },
  { id: "1497215842964-222b430dc094", photographer: "Alesia Kazantceva" },
  { id: "1563986768609-322da13575f3", photographer: "Christin Hume" },
  { id: "1516321497487-e849bc9f4b8e", photographer: "Compare Fibre" },
  { id: "1434030216411-0b793f4b4173", photographer: "Green Chameleon" },
  { id: "1503676260728-1c00da094a0b", photographer: "Element5 Digital" },
  { id: "1450101499163-c8848c66ca85", photographer: "Scott Graham" },
  { id: "1498050108023-c5249f4df085", photographer: "Lee Campbell" },
  { id: "1596524430615-b46475ddff6e", photographer: "Christina Wocintechchat" },
  { id: "1531482615713-2afd69097998", photographer: "Christina Wocintechchat" },
  { id: "1556740738-b6a63e27c4df", photographer: "Blake Wisz" },
  { id: "1497366754035-f200968a6e72", photographer: "Nastuh Abootalebi" },
  { id: "1543269865-cbf427effbad", photographer: "Brooke Cagle" },
  { id: "1552664730-d307ca884978", photographer: "Headway" },
  { id: "1519389950473-47ba0277781c", photographer: "Marvin Meyer" },
  { id: "1522202176988-66273c2fd55f", photographer: "Brooke Cagle" },
  { id: "1573164713714-d95e436ab8d6", photographer: "Christina Wocintechchat" },
  { id: "1600880292203-757bb62b4baf", photographer: "Jason Goodman" },
  { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters" },
  { id: "1454165804606-c3d57bc86b40", photographer: "Scott Graham" }
];

const previous = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : [];
const metaBySlug = new Map(previous.map((row) => [row.slug, row]));

let written = 0;
let skipped = 0;

for (let i = 0; i < catalog.length; i += 1) {
  const item = catalog[i];
  const slug = slugFor(item);
  const outFile = resolve(outDir, `${slug}.webp`);
  if (!force && existsSync(outFile) && metaBySlug.get(slug)?.source === "unsplash") {
    skipped += 1;
    process.stdout.write(`\r[photos] skip ${i + 1}/${catalog.length} ${slug}                    `);
    continue;
  }

  const photo = stock[i % stock.length];
  // Crop levemente diferente por índice evita capa idêntica quando a foto se repete.
  const focus = ["centre", "entropy", "attention"][i % 3];
  const primary = `https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=1400&h=735&q=82&sig=${i}`;
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(`${slug}-${i}`)}/1400/735`;

  process.stdout.write(`\r[photos] ${i + 1}/${catalog.length} ${slug}                    `);
  let res = await fetch(primary, { redirect: "follow", signal: AbortSignal.timeout(45_000) });
  let source = "unsplash";
  let photographer = photo.photographer;
  if (!res.ok) {
    res = await fetch(fallback, { redirect: "follow", signal: AbortSignal.timeout(45_000) });
    source = "picsum";
    photographer = "Picsum Photos";
  }
  if (!res.ok) {
    console.error(`\nFalha ${res.status}: ${primary}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(1200, 630, { fit: "cover", position: focus })
    .webp({ quality: 84 })
    .toFile(outFile);
  metaBySlug.set(slug, {
    slug,
    photoId: photo.id,
    source,
    photographer,
    credit: source === "unsplash" ? `Foto: ${photographer} / Unsplash` : `Foto: ${photographer}`,
    caption: `Foto ilustrativa para “${item.title}”.`,
    alt: `Capa: ${item.title}`
  });
  written += 1;
}

const meta = catalog.map((item) => metaBySlug.get(slugFor(item))).filter(Boolean);
writeFileSync(creditsPath, JSON.stringify(meta, null, 2), "utf8");
console.log(`\n[photos] OK — catalog=${catalog.length} written=${written} skipped=${skipped} credits=${meta.length}`);
