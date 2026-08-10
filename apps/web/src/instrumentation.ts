import * as Sentry from "@sentry/astro";
import { initializeStorage } from "@es/storage";

if (process.env.SENTRY_DSN) Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.APP_ENV ?? "development", tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1), sendDefaultPii: false });

export const storageStartup = initializeStorage();
