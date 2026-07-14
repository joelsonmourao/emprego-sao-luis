import { buildStoragePublicUrl, getStorageObject, putStorageObject } from "@es/storage";

export async function getPrivateObject(key: string) {
  return getStorageObject(key);
}

export async function putObject(key: string, body: Uint8Array, contentType: string) {
  await putStorageObject(key, body, contentType);
  return buildStoragePublicUrl(key);
}
