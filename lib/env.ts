import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16),
  ADMIN_LOGIN_USER: z.string().email().optional(),
  ADMIN_SECRET_KEY: z.string().min(8).optional()
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "dev-only-change-this-secret-key",
  ADMIN_LOGIN_USER: process.env.ADMIN_LOGIN_USER,
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY
});
