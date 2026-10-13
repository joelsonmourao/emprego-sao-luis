import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const slugs = [
  "curriculo-ats-palavras-chave-sao-luis",
  "soft-skills-hard-skills-curriculo",
  "primeiro-emprego-sao-luis-checklist",
  "cursos-no-curriculo-sem-enchimento",
  "marca-pessoal-candidatura-sao-luis",
  "vagas-afirmativas-como-candidatar",
  "imposto-de-renda-2026-trabalhador-clt",
  "decimo-terceiro-salario-pagamento-clt",
  "ferias-clt-periodo-aquisitivo",
  "abono-pecuniario-ferias-holerite",
  "ponto-eletronico-atraso-trabalho",
  "feriado-ponto-facultativo-sao-luis"
];

type Credit = { slug: string; source?: string; credit?: string; licenseStatus?: string; licenseBasis?: string };

function readWebpSize(path: string) {
  const data = readFileSync(path);
  expect(data.subarray(0, 4).toString()).toBe("RIFF");
  expect(data.subarray(8, 12).toString()).toBe("WEBP");
  const chunk = data.subarray(12, 16).toString();
  if (chunk === "VP8X") return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") return { width: 1 + data[21] + ((data[22] & 0x3f) << 8), height: 1 + ((data[22] >> 6) | (data[23] << 2) | ((data[24] & 0x0f) << 10)) };
  throw new Error(`Formato WebP não reconhecido: ${chunk}`);
}

describe("Primeiro lote de substituição das capas Unsplash", () => {
  const credits = JSON.parse(readFileSync(resolve("apps/web/public/covers/sl-local/credits.json"), "utf8")) as Credit[];

  it("registra autoria e base de direitos próprios nas 12 capas", () => {
    for (const slug of slugs) {
      const item = credits.find((credit) => credit.slug === slug);
      expect(item).toMatchObject({ source: "original", licenseStatus: "owned" });
      expect(item?.credit).toContain("Empregos São Luís");
      expect(item?.licenseBasis).toContain("sem fotografia");
    }
  });

  it("reduz o acervo Unsplash para 75 itens", () => {
    expect(credits.filter((item) => item.source === "unsplash")).toHaveLength(75);
  });

  it("mantém 12 WebP próprios, distintos e em 1200 × 630", () => {
    const hashes = new Set<string>();
    for (const slug of slugs) {
      const path = resolve(`apps/web/public/covers/sl-local/${slug}.webp`);
      expect(existsSync(path)).toBe(true);
      expect(readWebpSize(path)).toEqual({ width: 1200, height: 630 });
      hashes.add(createHash("sha256").update(readFileSync(path)).digest("hex"));
    }
    expect(hashes).toHaveLength(12);
  });
});
