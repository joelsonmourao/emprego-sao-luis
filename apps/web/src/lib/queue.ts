import { Queue, type ConnectionOptions } from "bullmq";
export const IMPORT_QUEUE = "job-imports";
function redisOptions(value: string): ConnectionOptions { const url = new URL(value); return { host: url.hostname, port: Number(url.port || 6379), ...(url.username ? { username: decodeURIComponent(url.username) } : {}), ...(url.password ? { password: decodeURIComponent(url.password) } : {}), ...(url.protocol === "rediss:" ? { tls: {} } : {}) }; }
export function createImportQueue() { const url = process.env.REDIS_URL; if (!url) throw new Error("REDIS_URL não configurada."); return new Queue(IMPORT_QUEUE, { connection: redisOptions(url) }); }
