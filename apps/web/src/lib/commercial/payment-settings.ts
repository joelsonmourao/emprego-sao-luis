import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logServerError } from "../server-error";

export const paymentSettingsSchema = z.object({
  manualPixEnabled: z.boolean().default(false),
  manualPixKey: z.string().default(""),
  manualPixHolder: z.string().default(""),
  manualPixQrUrl: z.string().optional(),
  manualPixInstructions: z.string().default("Envie o comprovante após a transferência. A liberação ocorre após revisão manual."),
  mercadoPagoEnabled: z.boolean().default(false),
  commercialContactUrl: z.string().default("")
});

export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;

const defaults = paymentSettingsSchema.parse({});

export async function getPaymentSettings(): Promise<PaymentSettings> {
  if (!process.env.DATABASE_URL) return defaults;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, "payment_settings")).limit(1);
    if (!row?.value) return defaults;
    const parsed = paymentSettingsSchema.safeParse(row.value);
    return parsed.success ? parsed.data : defaults;
  } catch (error) {
    logServerError("payment-settings:load", error);
    return defaults;
  } finally {
    await connection.close();
  }
}

export async function savePaymentSettings(input: Partial<PaymentSettings>) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const current = await getPaymentSettings();
  const next = paymentSettingsSchema.parse({ ...current, ...input });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(settings).values({ key: "payment_settings", value: next, public: false }).onConflictDoUpdate({
      target: settings.key,
      set: { value: next, public: false, updatedAt: new Date() }
    });
    return next;
  } finally {
    await connection.close();
  }
}

export async function isManualPixEnabled() {
  const s = await getPaymentSettings();
  return s.manualPixEnabled && Boolean(s.manualPixKey.trim());
}

function safeContactUrl(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function getCommercialContactUrl(): Promise<string | null> {
  const fromEnvironment = safeContactUrl(process.env.COMMERCIAL_CONTACT_URL);
  if (fromEnvironment) return fromEnvironment;
  const current = await getPaymentSettings();
  return safeContactUrl(current.commercialContactUrl);
}
