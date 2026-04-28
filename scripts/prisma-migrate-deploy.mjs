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

const maxAttempts = Number(process.env.PRISMA_MIGRATE_DEPLOY_RETRIES ?? "1") || 1;
const backoffMs = Number(process.env.PRISMA_MIGRATE_DEPLOY_BACKOFF_MS ?? "5000") || 5000;

/** `PRISMA_MIGRATE_DISABLE_LOCK_FALLBACK=1` (ou true/yes): sem bypass; só migrate com advisory lock normal. */
const lockBypassDisabled = ["1", "true", "yes"].includes(
  (process.env.PRISMA_MIGRATE_DISABLE_LOCK_FALLBACK ?? "").trim().toLowerCase()
);

/** Tenta lock normal antes do bypass (só se lockBypassDisabled for false). */
const strictAdvisoryFirst = ["1", "true", "yes"].includes(
  (process.env.PRISMA_MIGRATE_STRICT_ADVISORY_LOCK ?? "").trim().toLowerCase()
);

function runMigrate(extraEnv) {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL_DIRECT: direct, ...extraEnv },
    shell: process.platform === "win32"
  });
}

/** Padrao: um migrate com advisory lock desligado (evita espera P1002 no Neon). */
if (!lockBypassDisabled && !strictAdvisoryFirst) {
  console.warn(
    "prisma-migrate-deploy: executando migrate com PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1 (padrao). " +
      "Para tentar lock normal antes: PRISMA_MIGRATE_STRICT_ADVISORY_LOCK=1. " +
      "Para nunca usar bypass: PRISMA_MIGRATE_DISABLE_LOCK_FALLBACK=1."
  );
  const result = runMigrate({ PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1" });
  process.exit(result.status === null ? 1 : result.status);
}

let lastStatus = 1;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const result = runMigrate({});
  lastStatus = result.status === null ? 1 : result.status;
  if (lastStatus === 0) {
    process.exit(0);
  }

  if (attempt < maxAttempts) {
    console.warn(
      `prisma-migrate-deploy: tentativa ${attempt}/${maxAttempts} falhou (codigo ${lastStatus}). Nova tentativa em ${backoffMs}ms...`
    );
    await delay(backoffMs);
  }
}

if (!lockBypassDisabled && strictAdvisoryFirst && !process.env.PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK) {
  console.warn(
    "prisma-migrate-deploy: fallback com PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1 apos tentativas com lock normal."
  );
  const result = runMigrate({ PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1" });
  process.exit(result.status === null ? 1 : result.status);
}

process.exit(lastStatus);

