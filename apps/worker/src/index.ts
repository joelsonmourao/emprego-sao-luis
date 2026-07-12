import pino from "pino";
import { Worker, type ConnectionOptions } from "bullmq";
import { processImport } from "./import-processor.js";
import { processNotification } from "./notification-processor.js";

const logger = pino({ base: { service: "worker" } });
logger.info({ event: "worker.started" }, "Worker iniciado");
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error("REDIS_URL não configurada.");
const parsedRedis = new URL(redisUrl); const redisConnection: ConnectionOptions = { host: parsedRedis.hostname, port: Number(parsedRedis.port || 6379), ...(parsedRedis.username ? { username: decodeURIComponent(parsedRedis.username) } : {}), ...(parsedRedis.password ? { password: decodeURIComponent(parsedRedis.password) } : {}), ...(parsedRedis.protocol === "rediss:" ? { tls: {} } : {}) };
const worker = new Worker("job-imports", async (job) => { logger.info({ event: "import.started", jobId: job.id }, "Importação iniciada"); const result = await processImport(job.data); logger.info({ event: "import.completed", jobId: job.id, result }, "Importação concluída"); return result; }, { connection: redisConnection, concurrency: Number(process.env.WORKER_IMPORT_CONCURRENCY ?? 2) });
const notificationWorker = new Worker("notifications", async (job) => processNotification(job.data), { connection: redisConnection, concurrency: Number(process.env.WORKER_NOTIFICATION_CONCURRENCY ?? 5) });
worker.on("failed", (job, error) => logger.error({ event: "import.failed", jobId: job?.id, error: error.message }, "Importação falhou"));
notificationWorker.on("failed", (job, error) => logger.error({ event: "notification.failed", jobId: job?.id, error: error.message }, "Notificação falhou"));

const stop = async (signal: string) => {
  logger.info({ event: "worker.stopping", signal }, "Worker encerrando");
  await Promise.all([worker.close(), notificationWorker.close()]);
  process.exit(0);
};

process.on("SIGINT", () => { void stop("SIGINT"); });
process.on("SIGTERM", () => { void stop("SIGTERM"); });
