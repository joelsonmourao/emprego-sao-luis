import { getStorageObject, putStorageObject } from "@es/storage";

export async function getImportFile(storageKey: string): Promise<Uint8Array> {
  return getStorageObject(storageKey);
}

export async function putImportFile(storageKey: string, body: Uint8Array) {
  return putStorageObject(storageKey, body, "application/octet-stream");
}
