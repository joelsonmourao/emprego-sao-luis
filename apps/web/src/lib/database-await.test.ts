import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    return statSync(fullPath).isDirectory()
      ? collectTypeScriptFiles(fullPath)
      : fullPath.endsWith(".ts") && !fullPath.endsWith(".test.ts")
        ? [fullPath]
        : [];
  });
}

describe("database connection lifetime", () => {
  it("awaits lazy Drizzle queries before closing local connections", () => {
    const offenders = collectTypeScriptFiles(resolve("apps/web/src/lib")).filter((file) =>
      /return\s+connection\.db/.test(readFileSync(file, "utf8"))
    );
    expect(offenders).toEqual([]);
  });
});

