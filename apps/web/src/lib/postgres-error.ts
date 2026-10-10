type PostgresErrorLike = {
  message?: string;
  code?: string;
  detail?: string;
  hint?: string;
  column?: string;
  table?: string;
  cause?: unknown;
};

export function maskDatabaseUrl(value: string | undefined): Record<string, string> | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const user = decodeURIComponent(url.username || "");
    const maskedUser = user ? `${user.slice(0, 2)}***` : "";
    return {
      host: url.hostname,
      port: url.port || "5432",
      database: url.pathname.replace(/^\//, ""),
      user: maskedUser
    };
  } catch {
    return { host: "[invalid-url]", port: "", database: "", user: "" };
  }
}

export function describePostgresError(error: unknown): Record<string, string> {
  const source = (error && typeof error === "object" ? error : {}) as PostgresErrorLike;
  const cause = source.cause && typeof source.cause === "object" ? (source.cause as PostgresErrorLike) : undefined;
  return {
    message: source.message ?? String(error),
    code: source.code ?? cause?.code ?? "",
    detail: source.detail ?? cause?.detail ?? "",
    hint: source.hint ?? cause?.hint ?? "",
    column: source.column ?? cause?.column ?? "",
    table: source.table ?? cause?.table ?? ""
  };
}
