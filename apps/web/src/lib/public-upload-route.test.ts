import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("rota pública de uploads", () => {
  it("expõe somente mídia e identidade visual", () => {
    const source = readFileSync(resolve("apps/web/src/pages/api/uploads/[...path].ts"), "utf8");
    expect(source).toContain('storageKey.startsWith("media/")');
    expect(source).toContain('storageKey.startsWith("brand/")');
    expect(source).not.toContain('storageKey.startsWith("imports/")');
    expect(source).not.toContain('storageKey.startsWith("receipts/")');
  });
});
