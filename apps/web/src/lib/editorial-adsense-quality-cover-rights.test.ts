import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Credit = {
  slug: string;
  file: string;
  width: number;
  height: number;
  source?: string;
  credit?: string;
  licenseStatus?: string;
  licenseBasis?: string;
};
type ManifestItem = { file: string; width: number; height: number; bytes: number };

const root = resolve(process.cwd(), "apps/web/public/covers/adsense-quality");
const credits = JSON.parse(readFileSync(resolve(root, "credits.json"), "utf8")) as { covers: Credit[] };
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8")) as ManifestItem[];

function readWebpSize(path: string) {
  const data = readFileSync(path);
  expect(data.subarray(0, 4).toString()).toBe("RIFF");
  expect(data.subarray(8, 12).toString()).toBe("WEBP");
  const chunk = data.subarray(12, 16).toString();
  if (chunk === "VP8X") return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
  if (chunk === "VP8 ")
    return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L")
    return {
      width: 1 + data[21] + ((data[22] & 0x3f) << 8),
      height: 1 + ((data[22] >> 6) | (data[23] << 2) | ((data[24] & 0x0f) << 10))
    };
  throw new Error(`Formato WebP não reconhecido: ${chunk}`);
}

describe("direitos das capas adsense-quality", () => {
  it("documenta autoria própria e base de direitos nas oito capas", () => {
    expect(credits.covers).toHaveLength(8);
    for (const item of credits.covers) {
      expect(item).toMatchObject({ source: "original", licenseStatus: "owned", width: 1280, height: 720 });
      expect(item.credit).toContain("Empregos São Luís");
      expect(item.licenseBasis).toContain("sem fotografia");
      expect(item.licenseBasis).toContain("banco de imagens externo");
    }
  });

  it("mantém oito WebP próprios, distintos e em 1280 × 720", () => {
    const hashes = new Set<string>();
    for (const item of credits.covers) {
      const path = resolve(root, item.file);
      expect(existsSync(path)).toBe(true);
      expect(readWebpSize(path)).toEqual({ width: 1280, height: 720 });
      hashes.add(createHash("sha256").update(readFileSync(path)).digest("hex"));
    }
    expect(hashes).toHaveLength(8);
  });

  it("mantém manifesto idêntico aos arquivos publicados no pacote", () => {
    const expected = credits.covers
      .map((item) => ({
        file: item.file,
        width: 1280,
        height: 720,
        bytes: statSync(resolve(root, item.file)).size
      }))
      .sort((a, b) => a.file.localeCompare(b.file));
    expect(manifest).toEqual(expected);
  });

  it("não conserva referência a banco externo nos metadados do pacote", () => {
    expect(JSON.stringify(credits)).not.toMatch(/Unsplash|Picsum|Pexels/i);
  });
});
