import pino from "pino";
import * as Sentry from "@sentry/node";
import { Queue, Worker, type ConnectionOptions } from "bullmq";
import { processImport } from "./import-processor.js";
import { processNotification } from "./notification-processor.js";
import { expireJobs, processIndexingEvents } from "./maintenance.js";
import { processSocialPost } from "./social-processor.js";

const logger = pino({ base: { service: "worker" } });

async function main() {
  if (process.env.SENTRY_DSN) Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.APP_ENV ?? "development", tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1), sendDefaultPii: false });
  if (process.env.WORKER_SMOKE_TEST === "true") {
    logger.info({ event: "worker.smoke_test" }, "Artefato ESM do worker carregado");
    return;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error("REDIS_URL não configurada.");
  const parsedRedis = new URL(redisUrl);
  const redisConnection: ConnectionOptions = {
    host: parsedRedis.hostname,
    port: Number(parsedRedis.port || 6379),
    ...(parsedRedis.username ? { username: decodeURIComponent(parsedRedis.username) } : {}),
    ...(parsedRedis.password ? { password: decodeURIComponent(parsedRedis.password) } : {}),
    ...(parsedRedis.protocol === "rediss:" ? { tls: {} } : {})
  };

  const worker = new Worker("job-imports", async (job) => {
    logger.info({ event: "import.started", jobId: job.id }, "Importação iniciada");
    const result = await processImport(job.data);
    logger.info({ event: "import.completed", jobId: job.id, result }, "Importação concluída");
    return result;
  }, { connection: redisConnection, concurrency: Number(process.env.WORKER_IMPORT_CONCURRENCY ?? 2) });
  const notificationWorker = new Worker("notifications", async (job) => processNotification(job.data), { connection: redisConnection, concurrency: Number(process.env.WORKER_NOTIFICATION_CONCURRENCY ?? 5) });
  const maintenanceQueue = new Queue("maintenance", { connection: redisConnection });
  await maintenanceQueue.upsertJobScheduler("expire-jobs", { every: 15 * 60 * 1000 }, { name: "expire-jobs", data: {} });
  await maintenanceQueue.upsertJobScheduler("process-indexing", { every: 60 * 1000 }, { name: "process-indexing", data: {} });
  const maintenanceWorker = new Worker("maintenance", async (job) => job.name === "expire-jobs" ? expireJobs() : processIndexingEvents(), { connection: redisConnection, concurrency: 1 });
  const socialWorker = new Worker("social", async (job) => processSocialPost(job.data), { connection: redisConnection, concurrency: Number(process.env.WORKER_SOCIAL_CONCURRENCY ?? 2) });

  worker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "job-imports" }, extra: { jobId: job?.id } }); logger.error({ event: "import.failed", jobId: job?.id, error: error.message }, "Importação falhou"); });
  notificationWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "notifications" }, extra: { jobId: job?.id } }); logger.error({ event: "notification.failed", jobId: job?.id, error: error.message }, "Notificação falhou"); });
  maintenanceWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "maintenance" }, extra: { jobId: job?.id } }); logger.error({ event: "maintenance.failed", jobId: job?.id, error: error.message }, "Manutenção falhou"); });
  socialWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "social" }, extra: { jobId: job?.id } }); logger.error({ event: "social.failed", jobId: job?.id, error: error.message }, "Social falhou"); });
  logger.info({ event: "worker.started" }, "Worker iniciado");

  let stopping = false;
  const stop = async (signal: string) => {
    if (stopping) return;
    stopping = true;
    logger.info({ event: "worker.stopping", signal }, "Worker encerrando");
    await Promise.all([worker.close(), notificationWorker.close(), maintenanceWorker.close(), socialWorker.close(), maintenanceQueue.close()]);
  };
  process.once("SIGINT", () => { void stop("SIGINT").catch((error) => { logger.error(error); process.exitCode = 1; }); });
  process.once("SIGTERM", () => { void stop("SIGTERM").catch((error) => { logger.error(error); process.exitCode = 1; }); });
}

void main().catch((error) => {
  logger.fatal({ error }, "Falha ao iniciar worker");
  process.exitCode = 1;
});
