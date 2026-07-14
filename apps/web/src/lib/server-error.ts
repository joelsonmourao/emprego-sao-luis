const SECRET_ASSIGNMENT = /\b(password|passwd|secret|token|authorization|api[_-]?key)\b\s*[:=]\s*([^\s,;]+)/gi;
const DATABASE_URL = /\b(postgres(?:ql)?):\/\/[^\s]+/gi;

function sanitize(value: string): string {
  return value
    .replace(DATABASE_URL, "$1://[redacted]")
    .replace(SECRET_ASSIGNMENT, "$1=[redacted]")
    .slice(0, 8_000);
}

export type ServerErrorContext = {
  requestId?: string;
  route?: string;
  operation?: string;
  userId?: string;
  entity?: string;
  code?: string;
  cause?: string;
  integration?: string;
};

export function logServerError(context: string, error: unknown, metadata: ServerErrorContext = {}): void {
  const source = error instanceof Error ? error : new Error(String(error));
  const entry: Record<string, string> = {
    context,
    name: sanitize(source.name),
    message: sanitize(source.message)
  };

  if (process.env.NODE_ENV !== "production" && source.stack) {
    entry.stack = sanitize(source.stack);
  }

  for (const [key, value] of Object.entries(metadata)) {
    if (value) entry[key] = sanitize(value);
  }

  const sourceWithCode = source as Error & { code?: string; cause?: unknown };
  if (sourceWithCode.code && !entry.code) entry.code = sanitize(sourceWithCode.code);
  if (sourceWithCode.cause && !entry.cause) {
    entry.cause = sanitize(sourceWithCode.cause instanceof Error ? sourceWithCode.cause.message : String(sourceWithCode.cause));
  }

  console.error("[server-error]", entry);
}
