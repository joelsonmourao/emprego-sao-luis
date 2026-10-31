import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../../..");
const dockerfile = readFileSync(resolve(root, "Dockerfile.web"), "utf8");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
  scripts?: Record<string, string>;
};

describe("Dockerfile.web AdSense quality persist surface", () => {
  it("keeps a minimal production runtime and does not copy the full source tree", () => {
    expect(dockerfile).toContain("COPY --from=build /app/apps/web/dist ./dist");
    expect(dockerfile).toContain("COPY --from=deps /app/node_modules ./node_modules");
    expect(dockerfile).not.toMatch(/^RUN npm prune/m);
    expect(dockerfile).not.toContain("AS prod-deps");
    expect(dockerfile).not.toMatch(/COPY --from=deps --chown=app:app \/app\/node_modules/);
    expect(dockerfile).not.toMatch(/COPY --chown=app:app apps\/web apps\/web\s*$/m);
    expect(dockerfile).not.toContain("COPY . .");
  });

  it("ships Coolify editorial scripts including rewrite + persist + covers", () => {
    expect(packageJson.scripts?.["persist:adsense-quality-guides"]).toBe(
      "node scripts/persist-adsense-quality-guides.mjs"
    );
    expect(packageJson.scripts?.["rewrite:sl-local-bodies"]).toBe(
      "node scripts/rewrite-sl-local-editorial-bodies.mjs"
    );
    expect(packageJson.scripts?.["rewrite:job-board-links"]).toBe(
      "node scripts/rewrite-job-board-links-in-articles.mjs"
    );
    expect(dockerfile).toContain("COPY package.json package.json");
    expect(dockerfile).toContain("persist-adsense-quality-guides.mjs");
    expect(dockerfile).toContain("rewrite-sl-local-editorial-bodies.mjs");
    expect(dockerfile).toContain("rewrite-job-board-links-in-articles.mjs");
    expect(dockerfile).toContain("adsense-quality-guides.mjs");
    expect(dockerfile).toContain("adsense-quality-bodies.mjs");
    expect(dockerfile).toContain("apps/web/public/covers/adsense-quality");
  });
});
