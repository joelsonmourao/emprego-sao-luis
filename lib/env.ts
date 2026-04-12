import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16),
  ADMIN_EMAIL: z.string().email().default("admin@jovemaprendizvagas.local"),
  ADMIN_PASSWORD: z.string().min(8).default("Admin@123456")
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "dev-only-change-this-secret-key",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "admin@jovemaprendizvagas.local",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "Admin@123456"
});
