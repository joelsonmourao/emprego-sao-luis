import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16),
  ADMIN_LOGIN_USER: z.string().email().optional(),
  ADMIN_SECRET_KEY: z.string().min(8).optional(),
  SCHEDULED_JOBS_SPREADSHEET_PATH: z.string().optional(),
  SCHEDULED_JOBS_SHEET_NAME: z.string().optional(),
  SCHEDULED_JOBS_LOG_DIR: z.string().optional(),
  GOOGLE_INDEXING_SA_JSON: z.string().optional(),
  GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON: z.string().optional(),
  GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE: z.string().optional(),
  CRON_SECRET: z.string().optional()
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SITE_URL: process.env.SITE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "dev-only-change-this-secret-key",
  ADMIN_LOGIN_USER: process.env.ADMIN_LOGIN_USER,
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
  SCHEDULED_JOBS_SPREADSHEET_PATH: process.env.SCHEDULED_JOBS_SPREADSHEET_PATH,
  SCHEDULED_JOBS_SHEET_NAME: process.env.SCHEDULED_JOBS_SHEET_NAME,
  SCHEDULED_JOBS_LOG_DIR: process.env.SCHEDULED_JOBS_LOG_DIR,
  GOOGLE_INDEXING_SA_JSON: process.env.GOOGLE_INDEXING_SA_JSON,
  GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON,
  GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE: process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE,
  CRON_SECRET: process.env.CRON_SECRET
});
