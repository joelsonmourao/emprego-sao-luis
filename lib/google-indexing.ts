import { readFile } from "node:fs/promises";

import { importPKCS8, SignJWT } from "jose";

import { env } from "@/lib/env";
import { getSiteUrl } from "@/lib/site-url";
import { normalizeOrigin } from "@/lib/site-url";
import { isJobPastPublicDeadline } from "@/lib/jobs/job-expiry";

const GOOGLE_INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const TOKEN_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const GOOGLE_INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";

type GoogleServiceAccount = {
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  token_uri?: string;
};

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

export type GoogleIndexingConnectionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

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
  if (env.GOOGLE_INDEXING_CLIENT_EMAIL?.trim() && env.GOOGLE_INDEXING_PRIVATE_KEY?.trim() && env.GOOGLE_INDEXING_PROJECT_ID?.trim()) {
    return {
      client_email: env.GOOGLE_INDEXING_CLIENT_EMAIL.trim(),
      private_key: env.GOOGLE_INDEXING_PRIVATE_KEY.replace(/\\n/g, "\n"),
      project_id: env.GOOGLE_INDEXING_PROJECT_ID.trim(),
      token_uri: "https://oauth2.googleapis.com/token"
    } satisfies GoogleServiceAccount;
  }

  if (env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON?.trim()) {
    return JSON.parse(env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON) as GoogleServiceAccount;
  }

  if (env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE?.trim()) {
    return loadServiceAccountFromFile(env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE);
  }

  return null;
}

export function hasGoogleIndexingCredentials() {
  return Boolean(
    (env.GOOGLE_INDEXING_CLIENT_EMAIL?.trim() &&
      env.GOOGLE_INDEXING_PRIVATE_KEY?.trim() &&
      env.GOOGLE_INDEXING_PROJECT_ID?.trim()) ||
      env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON?.trim() ||
      env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE?.trim()
  );
}

export function isGoogleIndexingEnabled() {
  return String(env.GOOGLE_INDEXING_ENABLED ?? "").toLowerCase() === "true";
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

export async function testGoogleIndexingConnection(): Promise<GoogleIndexingConnectionResult> {
  if (!isGoogleIndexingEnabled()) {
    return { ok: false, message: "Google Indexing API desativada em GOOGLE_INDEXING_ENABLED." };
  }

  const serviceAccount = await loadServiceAccount();
  if (!serviceAccount) {
    return { ok: false, message: "Credenciais ausentes. Configure as variaveis de ambiente da Google Indexing API." };
  }

  try {
    await getGoogleAccessToken(serviceAccount);
    return { ok: true, message: "Conexao validada com sucesso. Token OAuth gerado." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? `Falha ao validar conexao com Google Indexing API: ${error.message}`
          : "Falha ao validar conexao com Google Indexing API."
    };
  }
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

/** Usado apenas por fluxos agendados/publicacao em lote — nao chamar nas rotas de CRUD de vaga. */
export async function notifyGoogleIndexing(url: string): Promise<GoogleIndexingResult> {
  if (!isGoogleIndexingEnabled()) {
    return {
      ok: false,
      message: "Google Indexing API desativada em GOOGLE_INDEXING_ENABLED."
    };
  }

  try {
    const serviceAccount = await loadServiceAccount();

    if (!serviceAccount) {
      return {
        ok: false,
        message: "Credenciais da Google Indexing API nao configuradas. Defina GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON ou GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE."
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
        type: "URL_UPDATED"
      })
    });

    const responseText = await response.text();
    const parsedResponse = parseJsonSafely(responseText);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        response: parsedResponse,
        message: classifyGoogleIndexingFailure(response.status, parsedResponse)
      };
    }

    return {
      ok: true,
      message: "URL enviada com sucesso para a Google Indexing API.",
      response: parsedResponse
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Erro inesperado ao chamar a Google Indexing API."
    };
  }
}

type JobForIndexingValidation = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  publishedAt: Date | null;
  expiresAt: Date | null;
  validThrough: Date | null;
  city?: { name?: string | null } | null;
  state?: { code?: string | null } | null;
};

export function validateJobForGoogleIndexing(job: JobForIndexingValidation): { ok: true; url: string } | { ok: false; reason: string } {
  if (!isGoogleIndexingEnabled()) {
    return { ok: false, reason: "Google Indexing API desativada em GOOGLE_INDEXING_ENABLED." };
  }

  if (job.status !== "PUBLISHED") {
    return { ok: false, reason: "Apenas vagas publicadas podem ser enviadas para indexacao." };
  }

  if (!job.slug?.trim()) {
    return { ok: false, reason: "Slug da vaga ausente." };
  }

  const siteOrigin = normalizeOrigin(env.SITE_URL);
  if (!siteOrigin) {
    return { ok: false, reason: "SITE_URL precisa estar configurado para envio de indexacao." };
  }

  const publicUrl = getSiteUrl(`/vagas/${job.slug}`);
  if (!publicUrl.startsWith(siteOrigin)) {
    return { ok: false, reason: "URL publica da vaga nao pertence ao SITE_URL configurado." };
  }
  if (!publicUrl.includes("/vagas/")) {
    return { ok: false, reason: "Somente URLs de vagas podem ser enviadas para Google Indexing API." };
  }

  if (!job.title?.trim()) {
    return { ok: false, reason: "Titulo da vaga ausente." };
  }

  if (!job.summary?.trim()) {
    return { ok: false, reason: "Descricao/resumo da vaga ausente." };
  }

  if (!job.city?.name?.trim()) {
    return { ok: false, reason: "Cidade da vaga ausente." };
  }

  if (!job.state?.code?.trim()) {
    return { ok: false, reason: "UF da vaga ausente." };
  }

  if (!job.publishedAt) {
    return { ok: false, reason: "publishedAt ausente para vaga publicada." };
  }

  if (isJobPastPublicDeadline({
    publishedAt: job.publishedAt,
    expiresAt: job.expiresAt,
    validThrough: job.validThrough
  })) {
    return { ok: false, reason: "Vaga expirada; envio para indexacao ignorado." };
  }

  return { ok: true, url: publicUrl };
}
