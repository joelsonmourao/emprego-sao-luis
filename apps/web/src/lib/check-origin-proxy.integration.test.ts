import { type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const DIST_ENTRY = resolve("apps/web/dist/server/entry.mjs");
const CANONICAL_HOST = "empregossaoluis.com.br";
const PORT = 14_321;

async function waitForHealth(port: number, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return;
    } catch {
      // Aguarda o servidor de produção subir.
    }
    await delay(250);
  }
  throw new Error("Servidor de produção não respondeu a tempo para o teste de checkOrigin.");
}

describe.skipIf(!existsSync(DIST_ENTRY))("checkOrigin em build de produção", () => {
  let server: ChildProcess | undefined;

  beforeAll(async () => {
    server = spawn(process.execPath, [DIST_ENTRY], {
      env: {
        ...process.env,
        HOST: "127.0.0.1",
        PORT: String(PORT),
        NODE_ENV: "production",
        SITE_URL: `https://${CANONICAL_HOST}`
      },
      stdio: "pipe"
    });
    await waitForHealth(PORT);
  }, 90_000);

  afterAll(async () => {
    if (!server?.pid) return;
    server.kill("SIGTERM");
    await delay(500);
  });

  const proxyHeaders = {
    Origin: `https://${CANONICAL_HOST}`,
    Host: CANONICAL_HOST,
    "X-Forwarded-Host": CANONICAL_HOST,
    "X-Forwarded-Proto": "https",
    "Content-Type": "application/json",
    Accept: "application/json"
  } as const;

  it("POST JSON same-origin com proxy Coolify não retorna 403", async () => {
    const response = await fetch(`http://127.0.0.1:${PORT}/api/admin/login`, {
      method: "POST",
      headers: proxyHeaders,
      body: JSON.stringify({
        email: "inexistente@example.com",
        password: "senha-invalida9",
        mfaCode: ""
      })
    });

    expect(response.status).not.toBe(403);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });

  it("POST com Origin malicioso continua bloqueado", async () => {
    const response = await fetch(`http://127.0.0.1:${PORT}/api/admin/login`, {
      method: "POST",
      headers: {
        ...proxyHeaders,
        Origin: "https://site-malicioso.example"
      },
      body: JSON.stringify({
        email: "inexistente@example.com",
        password: "senha-invalida9",
        mfaCode: ""
      })
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Origem da requisição não autorizada.",
      code: "ORIGIN_FORBIDDEN"
    });
  });

  it("POST sem JSON retorna 415 após passar pelo checkOrigin", async () => {
    const response = await fetch(`http://127.0.0.1:${PORT}/api/admin/login`, {
      method: "POST",
      headers: {
        ...proxyHeaders,
        "Content-Type": "text/plain"
      },
      body: "email=a@b.com&password=123456789"
    });

    expect(response.status).not.toBe(403);
    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: "Unsupported Media Type" });
  });
});
