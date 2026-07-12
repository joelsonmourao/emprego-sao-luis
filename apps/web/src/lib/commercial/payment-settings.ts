import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const paymentSettingsSchema = z.object({
  manualPixEnabled: z.boolean().default(false),
  manualPixKey: z.string().default(""),
  manualPixHolder: z.string().default(""),
  manualPixQrUrl: z.string().optional(),
  manualPixInstructions: z.string().default("Envie o comprovante após a transferência. A liberação ocorre após revisão manual."),
  mercadoPagoEnabled: z.boolean().default(false)
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
