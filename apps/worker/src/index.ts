import pino from "pino";

const logger = pino({ base: { service: "worker" } });
logger.info({ event: "worker.started" }, "Worker iniciado");

const stop = (signal: string) => {
  logger.info({ event: "worker.stopping", signal }, "Worker encerrando");
  process.exit(0);
};

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
