import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const STORAGE_AREAS = ["imports", "media", "brand", "reports", "temp", "receipts"] as const;
export type StorageArea = (typeof STORAGE_AREAS)[number];
export type StorageProvider = "s3" | "volume";

export type StorageDiagnostic = {
  provider: StorageProvider;
  path: string;
  exists: boolean;
  read: boolean;
  write: boolean;
  delete: boolean;
  checkedAt: string;
  error: string | null;
};

export class StorageError extends Error {
  readonly code: "STORAGE_NOT_WRITABLE" | "STORAGE_NOT_FOUND" | "STORAGE_INVALID_KEY";

  constructor(code: StorageError["code"], message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "StorageError";
    this.code = code;
  }
}

let cachedDiagnostic: StorageDiagnostic | null = null;
let diagnosticPromise: Promise<StorageDiagnostic> | null = null;
const DIAGNOSTIC_TTL_MS = 60_000;

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
    process.env.S3_ENDPOINT?.trim() &&
    process.env.S3_ACCESS_KEY_ID?.trim() &&
    process.env.S3_SECRET_ACCESS_KEY?.trim()
  );
}

export function getUploadsDir(): string {
  return resolve(
    process.env.UPLOADS_DIR?.trim() || process.env.UPLOADS_VOLUME_PATH?.trim() || join(process.cwd(), "data")
  );
}

export function getStorageInfo(): { provider: StorageProvider; ready: boolean; path: string } {
  if (isS3Configured()) {
    const bucket = process.env.S3_BUCKET!.trim();
    return { provider: "s3", ready: true, path: `s3://${bucket}` };
  }
  return { provider: "volume", ready: true, path: getUploadsDir() };
}

export function normalizeStorageKey(input: string): string {
  const key = input.replaceAll("\\", "/").replace(/^\/+/, "");
  const parts = key.split("/");
  if (!key || isAbsolute(input) || parts.some((part) => !part || part === "." || part === "..")) {
    throw new StorageError("STORAGE_INVALID_KEY", "Caminho de armazenamento inválido.");
  }
  return parts.join("/");
}

export function resolveVolumePath(storageKey: string): string {
  const key = normalizeStorageKey(storageKey);
  const root = getUploadsDir();
  const target = resolve(root, ...key.split("/"));
  const relativePath = relative(root, target);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new StorageError("STORAGE_INVALID_KEY", "Caminho de armazenamento inválido.");
  }
  return target;
}

function s3() {
  if (!isS3Configured()) {
    throw new StorageError("STORAGE_NOT_WRITABLE", "O armazenamento S3/R2 não está configurado.");
  }
  const bucket = process.env.S3_BUCKET!.trim();
  const client = new S3Client({
    region: process.env.S3_REGION?.trim() || "auto",
    endpoint: process.env.S3_ENDPOINT!.trim(),
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!.trim()
    }
  });
  return { bucket, client };
}

function s3Encryption(): { ServerSideEncryption: "AES256" | "aws:kms" } | Record<string, never> {
  const configured = process.env.S3_SERVER_SIDE_ENCRYPTION?.trim().toLowerCase();
  if (configured === "none") return {};
  return { ServerSideEncryption: configured === "aws:kms" ? "aws:kms" : "AES256" };
}

function storageFailure(error: unknown, message: string): StorageError {
  if (error instanceof StorageError) return error;
  const source = error as { code?: string } | null;
  if (source?.code === "ENOENT") {
    return new StorageError("STORAGE_NOT_FOUND", "Arquivo não encontrado.", { cause: error });
  }
  return new StorageError("STORAGE_NOT_WRITABLE", message, { cause: error });
}

export async function putStorageObject(
  storageKey: string,
  body: Uint8Array,
  contentType: string
): Promise<{ provider: StorageProvider; key: string; path?: string }> {
  const key = normalizeStorageKey(storageKey);
  try {
    if (isS3Configured()) {
      const { bucket, client } = s3();
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          ...s3Encryption()
        })
      );
      return { provider: "s3", key };
    }

    const path = resolveVolumePath(key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body);
    return { provider: "volume", key, path };
  } catch (error) {
    throw storageFailure(error, "O armazenamento local não está disponível.");
  }
}

export async function getStorageObject(storageKey: string): Promise<Uint8Array> {
  const key = normalizeStorageKey(storageKey);
  try {
    if (isS3Configured()) {
      const { bucket, client } = s3();
      const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      if (!result.Body) throw new StorageError("STORAGE_NOT_FOUND", "Arquivo não encontrado.");
      return result.Body.transformToByteArray();
    }
    return new Uint8Array(await readFile(resolveVolumePath(key)));
  } catch (error) {
    throw storageFailure(error, "Não foi possível ler o arquivo armazenado.");
  }
}

export async function deleteStorageObject(storageKey: string): Promise<void> {
  const key = normalizeStorageKey(storageKey);
  try {
    if (isS3Configured()) {
      const { bucket, client } = s3();
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      return;
    }
    await rm(resolveVolumePath(key), { force: true });
  } catch (error) {
    throw storageFailure(error, "Não foi possível excluir o arquivo armazenado.");
  }
}

export function buildStoragePublicUrl(storageKey: string, siteUrl?: string): string {
  const key = normalizeStorageKey(storageKey);
  const publicBase = isS3Configured() ? process.env.S3_PUBLIC_URL?.trim().replace(/\/$/, "") : "";
  if (publicBase) return `${publicBase}/${key}`;
  const base = (siteUrl || process.env.SITE_URL || "https://empregossaoluis.com.br")
    .replace(/\/$/, "")
    .replace("://www.", "://");
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  return `${base}/api/uploads/${encoded}`;
}

export function guessStorageContentType(storageKey: string): string {
  const key = storageKey.toLowerCase();
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".gif")) return "image/gif";
  if (key.endsWith(".svg")) return "image/svg+xml";
  if (key.endsWith(".ico")) return "image/x-icon";
  if (key.endsWith(".csv")) return "text/csv; charset=utf-8";
  if (key.endsWith(".json")) return "application/json; charset=utf-8";
  if (key.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (key.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

function sanitizedError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "postgresql://[redacted]")
    .replace(/(secret|password|token|access[_-]?key)\s*[:=]\s*[^\s,;]+/gi, "$1=[redacted]")
    .slice(0, 500);
}

async function runDiagnostic(): Promise<StorageDiagnostic> {
  const checkedAt = new Date().toISOString();
  const info = getStorageInfo();
  const result: StorageDiagnostic = {
    provider: info.provider,
    path: info.path,
    exists: false,
    read: false,
    write: false,
    delete: false,
    checkedAt,
    error: null
  };
  const key = `temp/.storage-health-${randomUUID()}.tmp`;
  const bytes = new TextEncoder().encode(`storage-health:${checkedAt}`);

  try {
    if (info.provider === "volume") {
      for (const area of STORAGE_AREAS) await mkdir(join(getUploadsDir(), area), { recursive: true });
      result.exists = (await stat(getUploadsDir())).isDirectory();
    } else {
      result.exists = true;
    }
    await putStorageObject(key, bytes, "application/octet-stream");
    result.write = true;
    const stored = await getStorageObject(key);
    result.read = new TextDecoder().decode(stored) === new TextDecoder().decode(bytes);
    await deleteStorageObject(key);
    result.delete = true;
  } catch (error) {
    result.error = sanitizedError(error);
    try {
      await deleteStorageObject(key);
    } catch {
      // A falha original é a informação relevante do diagnóstico.
    }
  }
  return result;
}

export async function diagnoseStorage(force = false): Promise<StorageDiagnostic> {
  const fresh = cachedDiagnostic && Date.now() - Date.parse(cachedDiagnostic.checkedAt) < DIAGNOSTIC_TTL_MS;
  if (!force && fresh) return cachedDiagnostic!;
  if (!force && diagnosticPromise) return diagnosticPromise;
  diagnosticPromise = runDiagnostic().then((result) => {
    cachedDiagnostic = result;
    diagnosticPromise = null;
    return result;
  });
  return diagnosticPromise;
}

export async function initializeStorage(): Promise<StorageDiagnostic> {
  const result = await diagnoseStorage(true);
  const event = {
    event: "storage.startup_check",
    provider: result.provider,
    path: result.path,
    exists: result.exists,
    read: result.read,
    write: result.write,
    delete: result.delete,
    checkedAt: result.checkedAt,
    error: result.error
  };
  if (result.exists && result.read && result.write && result.delete) console.info("[storage]", event);
  else console.error("[storage]", event);
  return result;
}
