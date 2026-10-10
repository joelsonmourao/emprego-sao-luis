import pino, { type LoggerOptions } from "pino";

const secretValues = () => [process.env.REDIS_URL, process.env.DATABASE_URL, process.env.S3_SECRET_ACCESS_KEY, process.env.RESEND_API_KEY, process.env.META_PAGE_ACCESS_TOKEN].filter((value): value is string => Boolean(value));

export function redactSecrets(value: string) {
  let safe = value.replace(/\b(rediss?|postgres(?:ql)?):\/\/([^\s/@:]+):([^\s/@]+)@/gi, "$1://[REDACTED]@[HOST]");
  for (const secret of secretValues()) safe = safe.replaceAll(secret, "[REDACTED]");
  return safe;
}

function messageFromUnknown(caught: unknown): string {
  if (typeof caught === "string") return caught;
  try { return JSON.stringify(caught); } catch { return String(caught); }
}

export function toSafeError(caught: unknown): Error & { code?: unknown } {
  const original = caught instanceof Error ? caught : new Error(messageFromUnknown(caught));
  const cause = original.cause instanceof Error ? redactSecrets(original.cause.message) : original.cause === undefined ? undefined : redactSecrets(messageFromUnknown(original.cause));
  const safe = new Error(redactSecrets(original.message), cause === undefined ? undefined : { cause }) as Error & { code?: unknown };
  safe.name = original.name || "Error";
  if (original.stack) safe.stack = redactSecrets(original.stack);
  const code = (original as Error & { code?: unknown }).code;
  if (code !== undefined) safe.code = typeof code === "string" ? redactSecrets(code) : code;
  return safe;
}

export const workerLoggerOptions: LoggerOptions = {
  base: { service: "worker" },
  serializers: { err: pino.stdSerializers.err }
};

export function startupFailureFields(caught: unknown, stage: string) {
  const err = toSafeError(caught);
  return { event: "worker.startup.failed", stage, err, errorName: err.name, errorMessage: err.message, errorStack: err.stack, errorCode: err.code, errorCause: err.cause };
}
