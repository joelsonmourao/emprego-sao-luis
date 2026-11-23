import type { ZodType } from "zod";

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export function requiresJsonContentType(request: Request): boolean {
  return (request.headers.get("content-type") ?? "").includes("application/json");
}

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<ParseResult<T>> {
  if (!requiresJsonContentType(request)) {
    return { ok: false, status: 415, error: "Unsupported Media Type" };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, status: 400, error: "JSON inválido." };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "Dados inválidos." };
  }

  return { ok: true, data: parsed.data };
}
