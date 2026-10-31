import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("página de vaga sem anúncio bloqueado", () => {
  it("não usa slots bloqueados perto da candidatura", () => {
    const source = readFileSync(resolve("apps/web/src/pages/vagas/[slug].astro"), "utf8");
    for (const blocked of ["job-after-application", "job-before-application", "job-apply-area", "job-between-title-and-apply"]) {
      expect(source.includes(`slot="${blocked}"`)).toBe(false);
    }
    expect(source.includes('id="candidatura"')).toBe(true);
    expect(source.includes('slot="job-sidebar"')).toBe(true);
  });
});
