export function adminMethodNotAllowed(allow: string | string[]) {
  const methods = Array.isArray(allow) ? allow.join(", ") : allow;
  return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: methods, "Content-Type": "application/json" }
  });
}

export function adminJsonRedirect(redirect: string, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: true, redirect, ...extra });
}

export function adminJsonError(
  error: string,
  status = 400,
  extra: Record<string, unknown> = {}
) {
  return Response.json({ ok: false, error, ...extra }, { status });
}

export function adminJsonOk<T extends Record<string, unknown>>(payload: T) {
  return Response.json({ ok: true, ...payload });
}
