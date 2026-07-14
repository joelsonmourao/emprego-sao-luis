import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

function s3Configured() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

function volumeRoot() {
  return (
    process.env.IMPORT_UPLOADS_PATH?.trim() ||
    process.env.UPLOADS_VOLUME_PATH?.trim() ||
    join(process.cwd(), "data", "imports")
  );
}

async function getS3Object(key: string) {
  const bucket = process.env.S3_BUCKET!;
  const client = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT!,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
    }
  });
  const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!result.Body) throw new Error("Arquivo não encontrado.");
  return result.Body.transformToByteArray();
}

export async function getImportFile(storageKey: string): Promise<Uint8Array> {
  if (s3Configured()) return getS3Object(storageKey);
  const body = await readFile(join(volumeRoot(), storageKey));
  return new Uint8Array(body);
}

export async function putImportFile(storageKey: string, body: Uint8Array) {
  if (s3Configured()) return;
  const filePath = join(volumeRoot(), storageKey);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
}
