import { readFile } from "node:fs/promises";

import { importPKCS8, SignJWT } from "jose";

import { env } from "@/lib/env";

const GOOGLE_INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const TOKEN_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const GOOGLE_INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";

type GoogleServiceAccount = {
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  token_uri?: string;
};

type GoogleIndexingNotificationType = "URL_UPDATED" | "URL_DELETED";

type GoogleIndexingSuccess = {
  ok: true;
  message: string;
  response: unknown;
};

type GoogleIndexingFailure = {
  ok: false;
  message: string;
  status?: number;
  response?: unknown;
};

export type GoogleIndexingResult = GoogleIndexingSuccess | GoogleIndexingFailure;

function parseJsonSafely(value: string) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

async function loadServiceAccountFromFile(filePath: string) {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as GoogleServiceAccount;
}

async function loadServiceAccount() {
  if (process.env.GOOGLE_INDEXING_SA_JSON?.trim()) {
    return JSON.parse(process.env.GOOGLE_INDEXING_SA_JSON) as GoogleServiceAccount;
  }

  if (env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON?.trim()) {
    return JSON.parse(env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON) as GoogleServiceAccount;
  }

  if (env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE?.trim()) {
    return loadServiceAccountFromFile(env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE);
  }

  return null;
}

async function getGoogleAccessToken(serviceAccount: GoogleServiceAccount) {
  const tokenUri = serviceAccount.token_uri || "https://oauth2.googleapis.com/token";
  const privateKey = await importPKCS8(serviceAccount.private_key, "RS256");
  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({ scope: GOOGLE_INDEXING_SCOPE })
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT",
      kid: serviceAccount.private_key_id
    })
    .setIssuedAt(now)
    .setIssuer(serviceAccount.client_email)
    .setSubject(serviceAccount.client_email)
    .setAudience(tokenUri)
    .setExpirationTime(now + 60 * 60)
    .sign(privateKey);

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: TOKEN_GRANT_TYPE,
      assertion
    }).toString()
  });

  const payloadText = await response.text();
  const payload = parseJsonSafely(payloadText) as { access_token?: string; error_description?: string; error?: string } | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(
      payload?.error_description ||
        payload?.error ||
        `Nao foi possivel obter token OAuth para a Google Indexing API (status ${response.status}).`
    );
  }

  return payload.access_token as string;
}

function classifyGoogleIndexingFailure(status: number, response: unknown) {
  const serialized = typeof response === "string" ? response : JSON.stringify(response);

  if (status === 403) {
    return "A conta de servico nao tem permissao para indexar este dominio. Verifique se o dominio foi validado no Search Console e se a conta de servico foi adicionada como proprietaria.";
  }

  if (status === 404) {
    return "A Google Indexing API nao encontrou a URL ou a propriedade. Confira se a URL final publicada pertence ao dominio validado.";
  }

  if (status === 429) {
    return "A Google Indexing API recusou a requisicao por limite de uso. Tente novamente mais tarde.";
  }

  return serialized || `Falha ao enviar URL para a Google Indexing API (status ${status}).`;
}

const GOOGLE_INDEXING_DAILY_LIMIT = 2000;
const GOOGLE_INDEXING_RATE_LIMIT_PER_SECOND = 5;
let dailyWindowKey = "";
let dailyRequestCount = 0;
const requestTimestampsMs: number[] = [];

function currentUtcDayKey() {
  return new Date().toISOString().slice(0, 10);
}

function enforceDailyLimit() {
  const key = currentUtcDayKey();
  if (dailyWindowKey !== key) {
    dailyWindowKey = key;
    dailyRequestCount = 0;
  }

  if (dailyRequestCount >= GOOGLE_INDEXING_DAILY_LIMIT) {
    return {
      ok: false as const,
      message: `Limite diario da Google Indexing API atingido (${GOOGLE_INDEXING_DAILY_LIMIT}/dia).`
    };
  }

  dailyRequestCount += 1;
  return null;
}

function enforceInternalRateLimit() {
  const now = Date.now();
  while (requestTimestampsMs.length && now - requestTimestampsMs[0] >= 1000) {
    requestTimestampsMs.shift();
  }

  if (requestTimestampsMs.length >= GOOGLE_INDEXING_RATE_LIMIT_PER_SECOND) {
    return {
      ok: false as const,
      message: `Rate limit interno atingido (${GOOGLE_INDEXING_RATE_LIMIT_PER_SECOND}/segundo).`
    };
  }

  requestTimestampsMs.push(now);
  return null;
}

export async function notifyGoogleIndexing(url: string, type: GoogleIndexingNotificationType = "URL_UPDATED"): Promise<GoogleIndexingResult> {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
      body: JSON.stringify({
        sessionId: "eb6787",
        runId: "pre-verify",
        hypothesisId: "H1",
        location: "lib/google-indexing.ts:notifyGoogleIndexing",
        message: "notify start",
        data: { type, hasCredentials: Boolean(process.env.GOOGLE_INDEXING_SA_JSON || env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON || env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE) },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const dailyLimitFailure = enforceDailyLimit();
    if (dailyLimitFailure) {
      return dailyLimitFailure;
    }

    const rateLimitFailure = enforceInternalRateLimit();
    if (rateLimitFailure) {
      return rateLimitFailure;
    }

    const serviceAccount = await loadServiceAccount();

    if (!serviceAccount) {
      return {
        ok: false,
        message:
          "Credenciais da Google Indexing API nao configuradas. Defina GOOGLE_INDEXING_SA_JSON (ou GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON / GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE)."
      };
    }

    const accessToken = await getGoogleAccessToken(serviceAccount);
    const response = await fetch(GOOGLE_INDEXING_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        type
      })
    });

    const responseText = await response.text();
    const parsedResponse = parseJsonSafely(responseText);

    if (!response.ok) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
        body: JSON.stringify({
          sessionId: "eb6787",
          runId: "pre-verify",
          hypothesisId: "H2",
          location: "lib/google-indexing.ts:notifyGoogleIndexing",
          message: "notify failed",
          data: { type, status: response.status },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      return {
        ok: false,
        status: response.status,
        response: parsedResponse,
        message: classifyGoogleIndexingFailure(response.status, parsedResponse)
      };
    }

    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
      body: JSON.stringify({
        sessionId: "eb6787",
        runId: "pre-verify",
        hypothesisId: "H3",
        location: "lib/google-indexing.ts:notifyGoogleIndexing",
        message: "notify success",
        data: { type, status: response.status },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    return {
      ok: true,
      message: `Notificacao ${type} enviada com sucesso para a Google Indexing API.`,
      response: parsedResponse
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Erro inesperado ao chamar a Google Indexing API."
    };
  }
}
