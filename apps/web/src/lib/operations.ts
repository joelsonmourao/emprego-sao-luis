import { Queue, type ConnectionOptions } from "bullmq";

export function redisOptions(value: string): ConnectionOptions {
  const url = new URL(value);
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    ...(url.username ? { username: decodeURIComponent(url.username) } : {}),
    ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
    ...(url.protocol === "rediss:" ? { tls: {} } : {})
  };
}

export const QUEUE_NAMES = ["job-imports", "notifications", "maintenance", "social"] as const;

export type QueueName = (typeof QUEUE_NAMES)[number];

const SENSITIVE_KEYS = /password|token|secret|private|credential|authorization|apikey|api_key|email/i;

export function sanitizePayload(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[truncado]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.length > 240 ? `${value.slice(0, 240)}…` : value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitizePayload(item, depth + 1));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      output[key] = SENSITIVE_KEYS.test(key) ? "[oculto]" : sanitizePayload(entry, depth + 1);
    }
    return output;
  }
  return value;
}

export async function getQueueSummaries() {
  if (!process.env.REDIS_URL) return [];
  const connection = redisOptions(process.env.REDIS_URL);
  const summaries = [];
  for (const name of QUEUE_NAMES) {
    const queue = new Queue(name, { connection });
    try {
      const counts = await queue.getJobCounts("waiting", "active", "completed", "failed", "delayed", "paused");
      const failed = await queue.getJobs(["failed"], 0, 9, true);
      summaries.push({
        name,
        counts,
        recentFailed: failed.map((job) => ({
          id: job.id,
          name: job.name,
          attemptsMade: job.attemptsMade,
          failedReason: job.failedReason ? job.failedReason.slice(0, 240) : null,
          finishedOn: job.finishedOn,
          processedOn: job.processedOn,
          data: sanitizePayload(job.data)
        }))
      });
    } finally {
      await queue.close();
    }
  }
  return summaries;
}

export async function retryQueueJob(queueName: QueueName, jobId: string) {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL não configurada.");
  const queue = new Queue(queueName, { connection: redisOptions(process.env.REDIS_URL) });
  try {
    const job = await queue.getJob(jobId);
    if (!job) throw new Error("Job não encontrado.");
    await job.retry();
    return { ok: true };
  } finally {
    await queue.close();
  }
}

export async function removeQueueJob(queueName: QueueName, jobId: string) {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL não configurada.");
  const queue = new Queue(queueName, { connection: redisOptions(process.env.REDIS_URL) });
  try {
    const job = await queue.getJob(jobId);
    if (!job) throw new Error("Job não encontrado.");
    if (await job.isActive()) throw new Error("Não é seguro remover job ativo.");
    await job.remove();
    return { ok: true };
  } finally {
    await queue.close();
  }
}
