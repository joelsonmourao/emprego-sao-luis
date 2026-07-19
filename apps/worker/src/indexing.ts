import { GoogleAuth } from "google-auth-library";
import { isStagingLikeEnvironment } from "@es/shared";

export async function submitGoogleIndexing(url: string, type: "URL_UPDATED" | "URL_DELETED") {
  if (isStagingLikeEnvironment()) return { status: 204, data: { skipped: true, reason: "staging_noindex" } };
  if (process.env.GOOGLE_INDEXING_ENABLED === "false")
    return { status: 204, data: { skipped: true, reason: "GOOGLE_INDEXING_ENABLED=false" } };
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replaceAll("\\n", "\n");
  if (!clientEmail || !privateKey) throw new Error("Credenciais Google Indexing não configuradas.");
  const auth = new GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/indexing"]
  });
  const client = await auth.getClient();
  const response = await client.request({
    url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
    method: "POST",
    data: { url, type }
  });
  return { status: response.status, data: response.data };
}

export function buildIndexNowUrl(url: string, key: string, siteUrl: string) {
  const endpoint = new URL("https://api.indexnow.org/indexnow");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("key", key);
  endpoint.searchParams.set("keyLocation", new URL(`/${key}.txt`, siteUrl).toString());
  return endpoint;
}

export async function submitIndexNow(url: string) {
  if (isStagingLikeEnvironment()) return { status: 204, skipped: true, reason: "staging_noindex" };
  const key = process.env.INDEXNOW_KEY;
  const siteUrl = process.env.SITE_URL;
  if (!key || !siteUrl) throw new Error("INDEXNOW_KEY e SITE_URL não configurados.");
  const response = await fetch(buildIndexNowUrl(url, key, siteUrl));
  if (!response.ok && response.status !== 202) throw new Error(`IndexNow respondeu ${response.status}.`);
  return { status: response.status };
}
