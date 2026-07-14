import {
  buildStoragePublicUrl,
  deleteStorageObject,
  getStorageObject,
  isS3Configured,
  putStorageObject
} from "@es/storage";

export const isStorageConfigured = isS3Configured;

export async function putPrivateObject(key: string, body: Uint8Array, contentType: string) {
  return putStorageObject(key, body, contentType);
}

export async function getPrivateObject(key: string) {
  return getStorageObject(key);
}

export async function deletePrivateObject(key: string) {
  return deleteStorageObject(key);
}

export function publicStorageUrl(key: string) {
  return buildStoragePublicUrl(key);
}
