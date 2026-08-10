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
    expect(dockerfile).toContain("COPY --from=build --chown=app:app /app/apps/web/dist ./dist");
    expect(dockerfile).not.toMatch(/COPY --chown=app:app apps\/web apps\/web\s*$/m);
    expect(dockerfile).not.toContain("COPY . .");
  });

  it("ships package.json so npm run persist:adsense-quality-guides works in Coolify", () => {
    expect(packageJson.scripts?.["persist:adsense-quality-guides"]).toBe(
      "node scripts/persist-adsense-quality-guides.mjs"
    );
    expect(dockerfile).toContain("COPY --chown=app:app package.json package.json");
    expect(dockerfile).toContain(
      "COPY --chown=app:app scripts/persist-adsense-quality-guides.mjs scripts/persist-adsense-quality-guides.mjs"
    );
    expect(dockerfile).toContain(
      "COPY --chown=app:app scripts/data/adsense-quality-guides.mjs scripts/data/adsense-quality-guides.mjs"
    );
    expect(dockerfile).toContain(
      "COPY --chown=app:app apps/web/public/covers/adsense-quality apps/web/public/covers/adsense-quality"
    );
  });
});
