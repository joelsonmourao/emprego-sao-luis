import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { BRAND_ASSETS } from "./brand-assets";

export const instagramCtaSchema = z.object({
  title: z.string().min(2).default("Acompanhe as vagas também no Instagram"),
  description: z.string().min(10).default("No @empregosaoluis divulgamos oportunidades em stories e no feed, sempre com link para o portal."),
  profileUrl: z.string().url().default(BRAND_ASSETS.instagramUrl),
  storiesNote: z.string().default("Muitas vagas aparecem primeiro nos stories — o portal complementa com busca, filtros e alertas."),
  showQrCode: z.boolean().default(false),
  qrCodeUrl: z.string().optional(),
  followerCount: z.string().optional(),
  followerCountUpdatedAt: z.string().optional(),
  enabled: z.boolean().default(true)
});

export type InstagramCtaSettings = z.infer<typeof instagramCtaSchema>;

const defaults = instagramCtaSchema.parse({});

export async function getInstagramCtaSettings(): Promise<InstagramCtaSettings> {
  if (!process.env.DATABASE_URL) return defaults;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, "instagram_cta")).limit(1);
    if (!row?.value) return defaults;
    const parsed = instagramCtaSchema.safeParse(row.value);
    return parsed.success ? parsed.data : defaults;
  } catch {
    return defaults;
  } finally {
    await connection.close();
  }
}

export async function saveInstagramCtaSettings(input: Partial<InstagramCtaSettings>) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const current = await getInstagramCtaSettings();
  const next = instagramCtaSchema.parse({ ...current, ...input });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(settings).values({ key: "instagram_cta", value: next, public: true }).onConflictDoUpdate({
      target: settings.key,
      set: { value: next, public: true, updatedAt: new Date() }
    });
    return next;
  } finally {
    await connection.close();
  }
}

export const INSTAGRAM_TRACK_EVENTS = [
  "instagram_follow_click",
  "instagram_header_click",
  "instagram_footer_click",
  "instagram_alert_success_click",
  "instagram_empty_state_click"
] as const;

export type InstagramTrackEvent = (typeof INSTAGRAM_TRACK_EVENTS)[number];
