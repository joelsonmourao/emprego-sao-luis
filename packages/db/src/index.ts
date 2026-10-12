import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
export * from "./schema.js";

export function createDatabase(url: string) {
  const client = postgres(url, { prepare: false });
  return { db: drizzle(client), close: () => client.end() };
}


/**
 * Pool limitado para consultas públicas frequentes do SSR.
 *
 * Um pool por processo evita reabrir conexões TCP/Postgres a cada renderização.
 * Não substitui createDatabase para migrations, scripts e escrita administrativa.
 * O close() é deliberadamente inerte: o pool persiste até encerrar o processo.
 */
const publicClients = new Map<string, ReturnType<typeof postgres>>();

export function createPublicDatabase(url: string) {
  let client = publicClients.get(url);
  if (!client) {
    client = postgres(url, {
      prepare: false,
      max: 8,
      idle_timeout: 30,
      connect_timeout: 5
    });
    publicClients.set(url, client);
  }
  return { db: drizzle(client), close: async () => {} };
}
