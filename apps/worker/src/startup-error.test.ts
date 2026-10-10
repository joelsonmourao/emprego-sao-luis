import pino from "pino";
import { describe, expect, it } from "vitest";
import { startupFailureFields, workerLoggerOptions } from "./startup-error.js";

describe("logging de falha na inicialização", () => {
  it("serializa Error em err e não produz objeto vazio", () => {
    const lines: string[] = [];
    const logger = pino(workerLoggerOptions, { write: (line: string) => lines.push(line) });
    const error = Object.assign(new Error("Redis recusou a conexão"), { code: "ECONNREFUSED" });
    logger.fatal(startupFailureFields(error, "redis_connection"), "Falha ao iniciar worker");
    const output = JSON.parse(lines[0]!) as { err: { message: string; stack: string }; errorCode: string; stage: string };
    expect(output.err).not.toEqual({});
    expect(output.err.message).toBe("Redis recusou a conexão");
    expect(output.err.stack).toContain("Redis recusou a conexão");
    expect(output.errorCode).toBe("ECONNREFUSED");
    expect(output.stage).toBe("redis_connection");
  });

  it("converte valores unknown e remove credenciais de URLs", () => {
    const fields = startupFailureFields("falha em redis://usuario:senha@redis:6379", "redis_url_validation");
    expect(fields.errorMessage).not.toContain("usuario");
    expect(fields.errorMessage).not.toContain("senha");
    expect(fields.errorMessage).toContain("[REDACTED]");
  });
});
