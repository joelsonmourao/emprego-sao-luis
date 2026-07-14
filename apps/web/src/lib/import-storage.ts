import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { putPrivateObject, getPrivateObject, isStorageConfigured } from "./storage";

export type ImportStorageMode = "s3" | "volume" | "temp";

function volumeRoot() {
  return (
    process.env.IMPORT_UPLOADS_PATH?.trim() ||
    process.env.UPLOADS_VOLUME_PATH?.trim() ||
    join(process.cwd(), "data", "imports")
  );
}

export function getImportStorageInfo(): { mode: ImportStorageMode; ready: boolean; path?: string } {
  if (isStorageConfigured()) return { mode: "s3", ready: true };
  const path = volumeRoot();
  return { mode: "volume", ready: true, path };
}

export async function putImportFile(storageKey: string, body: Uint8Array, contentType: string) {
  if (isStorageConfigured()) {
    await putPrivateObject(storageKey, body, contentType);
    return { mode: "s3" as const };
  }
  const filePath = join(volumeRoot(), storageKey);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
  return { mode: "volume" as const, path: filePath };
}

export async function getImportFile(storageKey: string): Promise<Uint8Array> {
  if (isStorageConfigured()) return getPrivateObject(storageKey);
  const filePath = join(volumeRoot(), storageKey);
  const body = await readFile(filePath);
  return new Uint8Array(body);
}

export async function deleteImportFile(storageKey: string) {
  if (isStorageConfigured()) return;
  try {
    await rm(join(volumeRoot(), storageKey), { force: true });
  } catch {
    // Arquivo temporário já removido ou inexistente.
  }
}
