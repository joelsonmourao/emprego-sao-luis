import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildStoragePublicUrl,
  deleteStorageObject,
  diagnoseStorage,
  getStorageObject,
  normalizeStorageKey,
  putStorageObject
} from "./index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(roots.splice(0).map((root) => rm(root, { force: true, recursive: true })));
});

async function localRoot() {
  const root = await mkdtemp(join(tmpdir(), "es-storage-"));
  roots.push(root);
  vi.stubEnv("UPLOADS_DIR", root);
  vi.stubEnv("S3_BUCKET", "");
  return root;
}

describe("storage service", () => {
  it("grava, lê e exclui no volume local", async () => {
    await localRoot();
    const bytes = new TextEncoder().encode("arquivo");
    const stored = await putStorageObject("reports/teste.txt", bytes, "text/plain");
    expect(stored.provider).toBe("volume");
    expect(new TextDecoder().decode(await getStorageObject("reports/teste.txt"))).toBe("arquivo");
    await deleteStorageObject("reports/teste.txt");
    await expect(getStorageObject("reports/teste.txt")).rejects.toMatchObject({ code: "STORAGE_NOT_FOUND" });
  });

  it("cria e testa todos os diretórios", async () => {
    await localRoot();
    const diagnostic = await diagnoseStorage(true);
    expect(diagnostic).toMatchObject({ provider: "volume", exists: true, read: true, write: true, delete: true, error: null });
  });

  it("bloqueia path traversal", () => {
    expect(() => normalizeStorageKey("../segredo.txt")).toThrow("inválido");
    expect(() => normalizeStorageKey("media/../../segredo.txt")).toThrow("inválido");
  });

  it("gera URL local servida pelo Astro", async () => {
    await localRoot();
    expect(buildStoragePublicUrl("media/2026/imagem.png", "https://www.empregossaoluis.com.br"))
      .toBe("https://empregossaoluis.com.br/api/uploads/media/2026/imagem.png");
  });

  it("não considera configuração S3 parcial", async () => {
    await localRoot();
    vi.stubEnv("S3_ENDPOINT", "https://storage.invalid");
    vi.stubEnv("S3_BUCKET", "bucket");
    vi.stubEnv("S3_ACCESS_KEY_ID", "");
    vi.stubEnv("S3_SECRET_ACCESS_KEY", "");
    const stored = await putStorageObject("media/local.txt", new TextEncoder().encode("ok"), "text/plain");
    expect(stored.provider).toBe("volume");
  });
});
