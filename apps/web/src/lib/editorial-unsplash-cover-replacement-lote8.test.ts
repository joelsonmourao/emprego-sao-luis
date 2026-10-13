import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Credit = {
  slug: string;
  source?: string;
  credit?: string;
  licenseStatus?: string;
  licenseBasis?: string;
};

type AuditFinding = { slug: string; images: string[] };

const appRoot = resolve(process.cwd());
const coversRoot = resolve(appRoot, "apps/web/public/covers");
const localRoot = resolve(coversRoot, "sl-local");
const localCredits = JSON.parse(readFileSync(resolve(localRoot, "credits.json"), "utf8")) as Credit[];
const qualityCredits = JSON.parse(
  readFileSync(resolve(coversRoot, "adsense-quality/credits.json"), "utf8"),
) as { covers: Credit[] };

const slugs = [
  "esgotamento-busca-emprego-sinais",
  "mensagem-fria-recrutador-linkedin",
  "busca-emprego-sao-luis-2026",
];

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

describe("lote final de capas editoriais próprias", () => {
  it("registra autoria e direitos próprios nas três capas", () => {
    for (const slug of slugs) {
      const item = localCredits.find((credit) => credit.slug === slug);
      expect(item).toMatchObject({ source: "original", licenseStatus: "owned" });
      expect(item?.credit).toContain("Empregos São Luís");
      expect(item?.licenseBasis).toContain("sem fotografia");
    }
  });

  it("mantém três WebP próprios, distintos e em 1200 × 630", () => {
    const hashes = new Set<string>();
    for (const slug of slugs) {
      const path = resolve(localRoot, `${slug}.webp`);
      expect(existsSync(path)).toBe(true);
      expect(readWebpSize(path)).toEqual({ width: 1200, height: 630 });
      hashes.add(createHash("sha256").update(readFileSync(path)).digest("hex"));
    }
    expect(hashes).toHaveLength(3);
  });

  it("elimina dependências de Unsplash e Picsum no pacote sl-local", () => {
    expect(localCredits).toHaveLength(105);
    expect(localCredits.filter((item) => item.source === "original")).toHaveLength(105);
    expect(localCredits.filter((item) => item.source === "unsplash" || item.source === "picsum")).toHaveLength(0);
  });

  it("reconcilia as 106 URLs auditadas com os dois pacotes de capas", () => {
    const reportsRoot = resolve(appRoot, "reports");
    const findings = [
      ...(JSON.parse(readFileSync(resolve(reportsRoot, "adsense-revisao-integral-parte-1.json"), "utf8")).findings as AuditFinding[]),
      ...(JSON.parse(readFileSync(resolve(reportsRoot, "adsense-revisao-integral-parte-2.json"), "utf8")).findings as AuditFinding[]),
    ];
    const coveredSlugs = new Set([
      ...localCredits.map((item) => item.slug),
      ...qualityCredits.covers.map((item) => item.slug),
    ]);

    expect(findings).toHaveLength(106);
    expect(new Set(findings.map((item) => item.slug))).toHaveLength(106);
    expect(findings.filter((item) => !coveredSlugs.has(item.slug))).toEqual([]);
    expect(
      findings.flatMap((item) => item.images).filter((url) => {
        const relativePath = new URL(url).pathname.replace(/^\//, "");
        return !existsSync(resolve(appRoot, "apps/web/public", relativePath));
      }),
    ).toEqual([]);
  });
});
