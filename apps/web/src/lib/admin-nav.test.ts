import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_NAV_GROUPS } from "./admin-nav";

describe("admin navigation", () => {
  it("organiza menu em módulos, não lista única", () => {
    expect(ADMIN_NAV_GROUPS.length).toBeGreaterThanOrEqual(10);
    const allItems = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
    expect(allItems.length).toBeGreaterThan(15);
    expect(new Set(allItems.map((i) => i.href)).size).toBe(allItems.length);
  });

  it("inclui módulos comercial e instagram", () => {
    const labels = ADMIN_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    expect(labels).toContain("/admin/comercial/planos");
    expect(labels).toContain("/admin/contatos");
    expect(labels).toContain("/admin/instagram");
  });

  it("AdminLayout usa grupos de menu", () => {
    const layout = readFileSync(resolve("apps/web/src/layouts/AdminLayout.astro"), "utf8");
    expect(layout).toContain("filterAdminNav");
    expect(layout).toContain("navGroups.map");
    expect(layout).toContain("logoHorizontalWebp");
  });
});
