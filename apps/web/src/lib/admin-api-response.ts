import { randomUUID } from "node:crypto";

type JsonObject = Record<string, unknown>;

const STATUS_CODES: Record<number, string> = {
  400: "INVALID_REQUEST",
  401: "UNAUTHENTICATED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_ALLOWED",
  409: "CONFLICT",
  413: "PAYLOAD_TOO_LARGE",
  415: "UNSUPPORTED_MEDIA_TYPE",
  422: "VALIDATION_ERROR",
  429: "RATE_LIMITED",
  500: "INTERNAL_ERROR",
  503: "SERVICE_UNAVAILABLE"
};

export function createRequestId(request?: Request): string {
  const received = request?.headers.get("x-request-id")?.trim();
  return received && /^[a-zA-Z0-9._-]{8,128}$/.test(received) ? received : randomUUID();
}

export function adminMethodNotAllowed(allow: string | string[]) {
  const methods = Array.isArray(allow) ? allow.join(", ") : allow;
  return Response.json(
    { ok: false, error: "Método não permitido.", code: "METHOD_NOT_ALLOWED" },
    { status: 405, headers: { Allow: methods } }
  );
}

export function adminJsonRedirect(redirect: string, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: true, data: extra, redirect });
}

export function adminJsonError(
  error: string,
  status = 400,
  extra: Record<string, unknown> = {}
) {
  return Response.json(
    { ok: false, error, code: STATUS_CODES[status] ?? "REQUEST_FAILED", ...extra },
    { status }
  );
}

export function adminJsonOk<T extends Record<string, unknown>>(payload: T) {
  return Response.json({ ok: true, data: payload });
}

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function responseHeaders(response: Response, requestId: string): Headers {
  const headers = new Headers();
  const allow = response.headers.get("allow");
  const cacheControl = response.headers.get("cache-control");
  if (allow) headers.set("allow", allow);
  if (cacheControl) headers.set("cache-control", cacheControl);
  headers.set("x-request-id", requestId);
  return headers;
}

export async function normalizeAdminApiResponse(response: Response, requestId: string): Promise<Response> {
  const disposition = response.headers.get("content-disposition") ?? "";
  const contentType = response.headers.get("content-type") ?? "";
  if (disposition.toLowerCase().includes("attachment") || contentType.includes("text/csv")) {
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const location = response.headers.get("location");
  if (location && response.status >= 300 && response.status < 400) {
    return Response.json(
      { ok: true, data: {}, redirect: location, requestId },
      { status: 200, headers: responseHeaders(response, requestId) }
    );
  }

  let payload: unknown = null;
  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      payload = await response.clone().json().catch(() => null);
    } else {
      payload = (await response.clone().text().catch(() => "")).trim();
    }
  }

  if (isObject(payload) && typeof payload.ok === "boolean") {
    const normalized: JsonObject = { ...payload, requestId };
    if (payload.ok === true && !("data" in payload)) normalized.data = {};
    if (payload.ok === false && !("code" in payload)) normalized.code = STATUS_CODES[response.status] ?? "REQUEST_FAILED";
    return Response.json(normalized, {
      status: response.status === 204 ? 200 : response.status,
      headers: responseHeaders(response, requestId)
    });
  }

  if (response.ok) {
    // Preserve legacy top-level fields while every caller migrates to `data`.
    // The canonical envelope is always present, so new clients have one shape
    // without breaking existing interactive screens during the transition.
    const legacyFields = isObject(payload) ? payload : {};
    return Response.json(
      { ok: true, data: payload ?? {}, ...legacyFields, requestId },
      { status: response.status === 204 ? 200 : response.status, headers: responseHeaders(response, requestId) }
    );
  }

  const objectError = isObject(payload) && typeof payload.error === "string" ? payload.error : null;
  const textError = typeof payload === "string" && payload ? payload : null;
  return Response.json(
    {
      ok: false,
      error: objectError ?? textError ?? "Não foi possível concluir a operação.",
      code: isObject(payload) && typeof payload.code === "string"
        ? payload.code
        : STATUS_CODES[response.status] ?? "REQUEST_FAILED",
      requestId,
      ...(isObject(payload) && "details" in payload ? { details: payload.details } : {})
    },
    { status: response.status, headers: responseHeaders(response, requestId) }
  );
}
