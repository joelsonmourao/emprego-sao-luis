import pino from "pino";
import * as Sentry from "@sentry/node";
import { Queue, Worker, type ConnectionOptions } from "bullmq";
import { processImport } from "./import-processor.js";
import { processNotification } from "./notification-processor.js";
import { expireJobs, processIndexingEvents } from "./maintenance.js";
import { processSocialPost } from "./social-processor.js";
import { startupFailureFields, workerLoggerOptions } from "./startup-error.js";

const logger = pino(workerLoggerOptions);
let startupStage = "initial_validation";

async function main() {
  if (process.env.SENTRY_DSN) Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.APP_ENV ?? "development", tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1), sendDefaultPii: false });
  if (process.env.WORKER_SMOKE_TEST === "true") {
    logger.info({ event: "worker.smoke_test" }, "Artefato ESM do worker carregado");
    return;
  }

  startupStage = "redis_url_validation";
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error("REDIS_URL não configurada.");
  const parsedRedis = new URL(redisUrl);
  if (parsedRedis.protocol !== "redis:" && parsedRedis.protocol !== "rediss:") throw new Error(`Protocolo Redis inválido: ${parsedRedis.protocol}`);
  const redisPort = Number(parsedRedis.port || 6379);
  if (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535) throw new Error("Porta Redis inválida.");
  logger.info({ event: "worker.redis.parsed", protocol: parsedRedis.protocol, hostname: parsedRedis.hostname, port: redisPort, hasUsername: Boolean(parsedRedis.username), hasPassword: Boolean(parsedRedis.password) }, "REDIS_URL validada sem expor credenciais");
  const redisConnection: ConnectionOptions = {
    host: parsedRedis.hostname,
    port: redisPort,
    ...(parsedRedis.username ? { username: decodeURIComponent(parsedRedis.username) } : {}),
    ...(parsedRedis.password ? { password: decodeURIComponent(parsedRedis.password) } : {}),
    ...(parsedRedis.protocol === "rediss:" ? { tls: {} } : {})
  };

  startupStage = "worker_creation";
  logger.info({ event: "worker.queues.initializing" }, "Inicializando workers BullMQ");
  const maintenanceQueue = new Queue("maintenance", { connection: redisConnection });
  startupStage = "redis_connection";
  logger.info({ event: "worker.redis.connecting", hostname: parsedRedis.hostname, port: redisPort, protocol: parsedRedis.protocol }, "Conectando ao Redis");
  await maintenanceQueue.waitUntilReady();
  logger.info({ event: "worker.redis.connected", hostname: parsedRedis.hostname, port: redisPort }, "Redis conectado");
  startupStage = "worker_creation";
  const worker = new Worker("job-imports", async (job) => {
    logger.info({ event: "import.started", jobId: job.id }, "Importação iniciada");
    const result = await processImport(job.data);
    logger.info({ event: "import.completed", jobId: job.id, result }, "Importação concluída");
    return result;
  }, { connection: redisConnection, concurrency: Number(process.env.WORKER_IMPORT_CONCURRENCY ?? 2) });
  const notificationWorker = new Worker("notifications", async (job) => processNotification(job.data), { connection: redisConnection, concurrency: Number(process.env.WORKER_NOTIFICATION_CONCURRENCY ?? 5) });
  startupStage = "scheduler_creation";
  logger.info({ event: "worker.scheduler.initializing" }, "Inicializando schedulers de manutenção");
  await maintenanceQueue.upsertJobScheduler("expire-jobs", { every: 15 * 60 * 1000 }, { name: "expire-jobs", data: {} });
  await maintenanceQueue.upsertJobScheduler("process-indexing", { every: 60 * 1000 }, { name: "process-indexing", data: {} });
  const maintenanceWorker = new Worker("maintenance", async (job) => job.name === "expire-jobs" ? expireJobs() : processIndexingEvents(), { connection: redisConnection, concurrency: 1 });
  const socialWorker = new Worker("social", async (job) => processSocialPost(job.data), { connection: redisConnection, concurrency: Number(process.env.WORKER_SOCIAL_CONCURRENCY ?? 2) });

  worker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "job-imports" }, extra: { jobId: job?.id } }); logger.error({ event: "import.failed", jobId: job?.id, error: error.message }, "Importação falhou"); });
  notificationWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "notifications" }, extra: { jobId: job?.id } }); logger.error({ event: "notification.failed", jobId: job?.id, error: error.message }, "Notificação falhou"); });
  maintenanceWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "maintenance" }, extra: { jobId: job?.id } }); logger.error({ event: "maintenance.failed", jobId: job?.id, error: error.message }, "Manutenção falhou"); });
  socialWorker.on("failed", (job, error) => { Sentry.captureException(error, { tags: { queue: "social" }, extra: { jobId: job?.id } }); logger.error({ event: "social.failed", jobId: job?.id, error: error.message }, "Social falhou"); });
  startupStage = "final_initialization";
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

void main().catch((caught: unknown) => {
  logger.fatal(startupFailureFields(caught, startupStage), "Falha ao iniciar worker");
  process.exitCode = 1;
});
