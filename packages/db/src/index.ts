import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDatabase(url: string) {
  const client = postgres(url, { prepare: false });
  return { db: drizzle(client), close: () => client.end() };
}
