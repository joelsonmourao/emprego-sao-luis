import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { zEmail, zOptionalUrl, zUrl, zUuid } from "./zod-fields.js";

const walkTsFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walkTsFiles(full) : full.endsWith(".ts") ? [full] : [];
  });

describe("zod fields runtime", () => {
  it("valida e-mail com z.string().email()", () => {
    expect(zEmail().safeParse("admin@example.com").success).toBe(true);
    expect(zEmail().safeParse("invalid").success).toBe(false);
  });

  it("valida uuid com z.string().uuid()", () => {
    expect(zUuid().safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
    expect(zUuid().safeParse("not-uuid").success).toBe(false);
  });

  it("valida url com z.string().url()", () => {
    expect(zUrl().safeParse("https://empregossaoluis.com.br").success).toBe(true);
    expect(zUrl().safeParse("not-url").success).toBe(false);
    expect(zOptionalUrl().safeParse("").success).toBe(true);
    expect(zOptionalUrl().safeParse(undefined)).toEqual({ success: true, data: null });
    expect(zOptionalUrl().safeParse("not-url").success).toBe(false);
  });
});

describe("zod forbidden syntax scan", () => {
  it("não usa z.email/z.uuid/z.url nas APIs e schemas compartilhados", () => {
    const offenders: string[] = [];
    for (const root of ["apps/web/src/pages/api", "packages/shared/src"]) {
      for (const file of walkTsFiles(resolve(root))) {
        if (/z\.(email|uuid|url)\(/.test(readFileSync(file, "utf8"))) offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});
