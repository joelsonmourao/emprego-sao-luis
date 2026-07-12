import { readFile, writeFile } from "node:fs/promises";
import { URL } from "node:url";

for (const packageName of ["db", "shared", "social"]) {
  const path = new URL(`../../../packages/${packageName}/package.json`, import.meta.url);
  const manifest = JSON.parse(await readFile(path, "utf8"));
  manifest.exports = { ".": "./dist/index.js" };
  await writeFile(path, `${JSON.stringify(manifest)}\n`);
}
