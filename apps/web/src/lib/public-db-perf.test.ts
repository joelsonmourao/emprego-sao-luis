import { describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { createDatabase, createPublicDatabase } from "@es/db";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("SSR público: conexões Postgres", () => {
  it("não transforma conexão exclusiva de escrita em pool público", () => {
    const db = readFileSync(resolve("packages/db/src/index.ts"), "utf8");
    expect(db).toContain("export function createDatabase(url: string)");
    expect(db).toContain("export function createPublicDatabase(url: string)");
    expect(db).toContain("max: 8");
    const mode = readFileSync(resolve("apps/web/src/lib/portal-modes.ts"), "utf8");
    expect(mode).toContain("const connection = createPublicDatabase(process.env.DATABASE_URL)");
    expect(mode).toContain("const connection = createDatabase(process.env.DATABASE_URL)");
  });

  it.skipIf(!process.env.DATABASE_URL)(
    "pool read-only continua utilizável depois de close e escrita mantém conexão exclusiva",
    async () => {
      const url = process.env.DATABASE_URL!;
      const first = createPublicDatabase(url);
      const second = createPublicDatabase(url);
      const one = await first.db.execute(sql`select 1 as ok`);
      expect(one.length).toBe(1);
      await first.close();
      const two = await second.db.execute(sql`select 1 as ok`);
      expect(two.length).toBe(1);
      const dedicated = createDatabase(url);
      try {
        const three = await dedicated.db.execute(sql`select 1 as ok`);
        expect(three.length).toBe(1);
      } finally {
        await dedicated.close();
      }
    }
  );
});
