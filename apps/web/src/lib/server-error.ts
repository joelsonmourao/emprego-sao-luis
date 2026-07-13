const SECRET_ASSIGNMENT = /\b(password|passwd|secret|token|authorization|api[_-]?key)\b\s*[:=]\s*([^\s,;]+)/gi;
const DATABASE_URL = /\b(postgres(?:ql)?):\/\/[^\s]+/gi;

function sanitize(value: string): string {
  return value
    .replace(DATABASE_URL, "$1://[redacted]")
    .replace(SECRET_ASSIGNMENT, "$1=[redacted]")
    .slice(0, 8_000);
}

export function logServerError(context: string, error: unknown): void {
  const source = error instanceof Error ? error : new Error(String(error));
  const entry: Record<string, string> = {
    context,
    name: sanitize(source.name),
    message: sanitize(source.message)
  };

  if (process.env.NODE_ENV !== "production" && source.stack) {
    entry.stack = sanitize(source.stack);
  }

  console.error("[server-error]", entry);
}
