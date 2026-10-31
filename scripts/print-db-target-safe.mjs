#!/usr/bin/env node
/** Imprime apenas host/porta/banco/usuário de DATABASE_URL — nunca a senha. */
import { readFileSync, existsSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.staging"),
  ...process.env
};

const url = env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL ausente");
  process.exit(1);
}

const u = new URL(url);
const meta = {
  host: u.hostname,
  port: u.port || "(default)",
  database: u.pathname.replace(/^\//, ""),
  user: u.username || "(none)"
};
const hostOk = meta.host === "127.0.0.1" || meta.host === "localhost";
const portOk = String(meta.port) === "55432";
const dbOk = /staging|e2e/i.test(meta.database);
const looksProd = /coolify|empregossaoluis\.com\.br|production/i.test(url);

console.log(JSON.stringify({ target: meta, checks: { hostOk, portOk, dbOk, looksProd }, passwordPrinted: false }, null, 2));
if (!hostOk || !portOk || !dbOk || looksProd) process.exit(2);
