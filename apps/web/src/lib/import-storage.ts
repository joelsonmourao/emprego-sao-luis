import {
  deleteStorageObject,
  getStorageInfo,
  getStorageObject,
  putStorageObject
} from "@es/storage";

export type ImportStorageMode = "s3" | "volume";

export function getImportStorageInfo(): { mode: ImportStorageMode; ready: boolean; path?: string } {
  const info = getStorageInfo();
  return { mode: info.provider, ready: info.ready, path: info.path };
}

export async function putImportFile(storageKey: string, body: Uint8Array, contentType: string) {
  return putStorageObject(storageKey, body, contentType);
}

export async function getImportFile(storageKey: string): Promise<Uint8Array> {
  return getStorageObject(storageKey);
}

export async function deleteImportFile(storageKey: string) {
  try {
    await deleteStorageObject(storageKey);
  } catch {
    // O lote pode referenciar um arquivo já removido durante uma compensação anterior.
  }
}
