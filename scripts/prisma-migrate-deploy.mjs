import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(relPath) {
  const filePath = path.join(root, relPath);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

/** Neon: host `*-pooler.*` → mesmo endpoint sem `-pooler` (conexão direta para advisory locks). */
function deriveDirectFromPooled(pooled) {
  if (!pooled || typeof pooled !== "string") return "";
  if (pooled.includes("-pooler.")) {
    return pooled.replaceAll("-pooler.", ".");
  }
  return pooled;
}

const poolUrl = process.env.DATABASE_URL ?? "";
const directExplicit = (process.env.DATABASE_URL_DIRECT ?? "").trim();
const direct = directExplicit.length > 0 ? directExplicit : deriveDirectFromPooled(poolUrl) || poolUrl;

if (!direct) {
  console.error("prisma-migrate-deploy: defina DATABASE_URL ou DATABASE_URL_DIRECT.");
  process.exit(1);
}

const maxAttempts = Number(process.env.PRISMA_MIGRATE_DEPLOY_RETRIES ?? "4") || 4;
const backoffMs = Number(process.env.PRISMA_MIGRATE_DEPLOY_BACKOFF_MS ?? "5000") || 5000;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const result = spawnSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL_DIRECT: direct },
    shell: process.platform === "win32"
  });

  const status = result.status === null ? 1 : result.status;
  if (status === 0) {
    process.exit(0);
  }

  if (attempt < maxAttempts) {
    console.warn(
      `prisma-migrate-deploy: tentativa ${attempt}/${maxAttempts} falhou (codigo ${status}). Nova tentativa em ${backoffMs}ms...`
    );
    await delay(backoffMs);
  } else {
    process.exit(status);
  }
}
