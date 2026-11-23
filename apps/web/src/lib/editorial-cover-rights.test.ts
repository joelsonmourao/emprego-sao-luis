import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const slugs = [
  "pedir-feedback-entrevista-emprego",
  "plano-semanal-vagas-sao-luis",
  "produtividade-busca-emprego-sao-luis",
  "rejeicao-processo-seletivo-como-reagir",
  "retorno-mercado-trabalho-gap-curriculo",
  "transporte-entrevista-emprego-sao-luis"
];

type Credit = {
  slug: string;
  source?: string;
  credit?: string;
  licenseStatus?: string;
  licenseBasis?: string;
};

function readWebpSize(path: string) {
  const data = readFileSync(path);
  expect(data.subarray(0, 4).toString()).toBe("RIFF");
  expect(data.subarray(8, 12).toString()).toBe("WEBP");
  const chunk = data.subarray(12, 16).toString();
  if (chunk === "VP8X") {
    return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    return {
      width: 1 + data[21] + ((data[22] & 0x3f) << 8),
      height: 1 + ((data[22] >> 6) | (data[23] << 2) | ((data[24] & 0x0f) << 10))
    };
  }
  throw new Error(`Formato WebP não reconhecido: ${chunk}`);
}

describe("Direitos das capas do lote editorial final", () => {
  const credits = JSON.parse(readFileSync(resolve("apps/web/public/covers/sl-local/credits.json"), "utf8")) as Credit[];

  it("registra origem própria e base de direitos sem atribuição externa", () => {
    for (const slug of slugs) {
      const item = credits.find((credit) => credit.slug === slug);
      expect(item).toMatchObject({ source: "original", licenseStatus: "owned" });
      expect(item?.credit).toContain("Empregos São Luís");
      expect(item?.licenseBasis?.length).toBeGreaterThan(30);
      expect(item?.credit).not.toMatch(/Unsplash|Picsum/i);
    }
  });

  it("mantém seis arquivos WebP próprios em 1200 × 630", () => {
    for (const slug of slugs) {
      const path = resolve(`apps/web/public/covers/sl-local/${slug}.webp`);
      expect(existsSync(path)).toBe(true);
      expect(readWebpSize(path)).toEqual({ width: 1200, height: 630 });
    }
  });

  it("protege capas próprias contra sobrescrita pelo coletor de fotos", () => {
    const fetcher = readFileSync(resolve("scripts/fetch-sl-local-photo-covers.mjs"), "utf8");
    expect(fetcher).toContain('existingSource === "original"');
    expect(fetcher).toContain('process.argv.includes("--replace-original")');
  });
});
