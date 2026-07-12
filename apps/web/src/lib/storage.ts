import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function config() {
  const bucket = process.env.S3_BUCKET; const endpoint = process.env.S3_ENDPOINT; const accessKeyId = process.env.S3_ACCESS_KEY_ID; const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) throw new Error("Armazenamento S3/R2 não configurado.");
  return { bucket, client: new S3Client({ region: process.env.S3_REGION ?? "auto", endpoint, forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true", credentials: { accessKeyId, secretAccessKey } }) };
}
export async function putPrivateObject(key: string, body: Uint8Array, contentType: string) { const { bucket, client } = config(); await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType, ServerSideEncryption: "AES256" })); }
export async function getPrivateObject(key: string) { const { bucket, client } = config(); const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key })); if (!result.Body) throw new Error("Objeto sem conteúdo."); return result.Body.transformToByteArray(); }
