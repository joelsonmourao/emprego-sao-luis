import {
  auditLogs,
  commercialPlans,
  createDatabase
} from "@es/db";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { describePostgresError } from "../postgres-error.js";
import { logServerError } from "../server-error.js";
import { slugify } from "./constants";

export type PlanInput = {
  name: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  fullDescriptionHtml?: string;
  price: string;
  promoPrice?: string | null;
  currency?: string;
  jobCredits?: number;
  durationDays?: number;
  highlightDays?: number;
  publishStories?: boolean;
  publishFeed?: boolean;
  publishSite?: boolean;
  postsCount?: number;
  renewable?: boolean;
  billingType?: string;
  creditValidityDays?: number;
  promoStartsAt?: Date | null;
  promoEndsAt?: Date | null;
  priority?: number;
  active?: boolean;
  setupRequired?: boolean;
  archived?: boolean;
  recommended?: boolean;
  sortOrder?: number;
  benefits?: string[];
  limitations?: string[];
  rules?: string;
};

export async function listPlansAdmin(options: {
  q?: string;
  active?: boolean;
  archived?: boolean;
  page?: number;
  pageSize?: number;
} = {}) {
  if (!process.env.DATABASE_URL) return { items: [], total: 0 };
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, options.pageSize ?? 20));
  const offset = (page - 1) * pageSize;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const filters = [];
    if (options.q?.trim()) {
      const term = `%${options.q.trim()}%`;
      filters.push(or(ilike(commercialPlans.name, term), ilike(commercialPlans.slug, term)));
    }
    if (options.active !== undefined) filters.push(eq(commercialPlans.active, options.active));
    if (options.archived !== undefined) filters.push(eq(commercialPlans.archived, options.archived));
    const where = filters.length ? and(...filters) : undefined;
    const [totalRow] = await connection.db.select({ value: count() }).from(commercialPlans).where(where);
    const items = await connection.db
      .select()
      .from(commercialPlans)
      .where(where)
      .orderBy(asc(commercialPlans.sortOrder), asc(commercialPlans.name))
      .limit(pageSize)
      .offset(offset);
    return { items, total: totalRow?.value ?? 0, page, pageSize };
  } finally {
    await connection.close();
  }
}

export async function getPlanById(id: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, id)).limit(1);
    return plan ?? null;
  } finally {
    await connection.close();
  }
}

export async function createPlan(input: PlanInput, actorId?: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const slug = input.slug?.trim() || slugify(input.name);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [plan] = await connection.db
      .insert(commercialPlans)
      .values({
        name: input.name.trim(),
        slug,
        shortDescription: input.shortDescription ?? "",
        description: input.description.trim(),
        fullDescriptionHtml: input.fullDescriptionHtml ?? null,
        price: input.price,
        promoPrice: input.promoPrice ?? null,
        currency: input.currency ?? "BRL",
        jobCredits: input.jobCredits ?? 1,
        durationDays: input.durationDays ?? 30,
        highlightDays: input.highlightDays ?? 0,
        publishStories: input.publishStories ?? false,
        publishFeed: input.publishFeed ?? false,
        publishSite: input.publishSite ?? true,
        postsCount: input.postsCount ?? 0,
        renewable: input.renewable ?? true,
        billingType: input.billingType ?? "one_time",
        creditValidityDays: input.creditValidityDays ?? 365,
        promoStartsAt: input.promoStartsAt ?? null,
        promoEndsAt: input.promoEndsAt ?? null,
        priority: input.priority ?? 0,
        active: input.active ?? false,
        setupRequired: input.setupRequired ?? true,
        archived: false,
        recommended: input.recommended ?? false,
        sortOrder: input.sortOrder ?? 0,
        benefits: input.benefits ?? [],
        limitations: input.limitations ?? [],
        rules: input.rules ?? null
      })
      .returning();
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "COMMERCIAL_PLAN_CREATED",
      entityType: "COMMERCIAL_PLAN",
      entityId: plan!.id,
      after: { slug: plan!.slug, name: plan!.name },
      origin: "ADMIN"
    });
    return plan!;
  } finally {
    await connection.close();
  }
}

export async function updatePlan(id: string, input: Partial<PlanInput>, actorId?: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const before = await getPlanById(id);
    if (!before) throw new Error("Plano não encontrado.");
    const [plan] = await connection.db
      .update(commercialPlans)
      .set({
        ...(input.name ? { name: input.name.trim() } : {}),
        ...(input.slug ? { slug: input.slug.trim() } : {}),
        ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription } : {}),
        ...(input.description ? { description: input.description.trim() } : {}),
        ...(input.fullDescriptionHtml !== undefined ? { fullDescriptionHtml: input.fullDescriptionHtml } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.promoPrice !== undefined ? { promoPrice: input.promoPrice } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
        ...(input.jobCredits !== undefined ? { jobCredits: input.jobCredits } : {}),
        ...(input.durationDays !== undefined ? { durationDays: input.durationDays } : {}),
        ...(input.highlightDays !== undefined ? { highlightDays: input.highlightDays } : {}),
        ...(input.publishStories !== undefined ? { publishStories: input.publishStories } : {}),
        ...(input.publishFeed !== undefined ? { publishFeed: input.publishFeed } : {}),
        ...(input.publishSite !== undefined ? { publishSite: input.publishSite } : {}),
        ...(input.postsCount !== undefined ? { postsCount: input.postsCount } : {}),
        ...(input.renewable !== undefined ? { renewable: input.renewable } : {}),
        ...(input.billingType ? { billingType: input.billingType } : {}),
        ...(input.creditValidityDays !== undefined ? { creditValidityDays: input.creditValidityDays } : {}),
        ...(input.promoStartsAt !== undefined ? { promoStartsAt: input.promoStartsAt } : {}),
        ...(input.promoEndsAt !== undefined ? { promoEndsAt: input.promoEndsAt } : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.setupRequired !== undefined ? { setupRequired: input.setupRequired } : {}),
        ...(input.archived !== undefined ? { archived: input.archived } : {}),
        ...(input.recommended !== undefined ? { recommended: input.recommended } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
        ...(input.benefits ? { benefits: input.benefits } : {}),
        ...(input.limitations ? { limitations: input.limitations } : {}),
        ...(input.rules !== undefined ? { rules: input.rules } : {}),
        updatedAt: new Date()
      })
      .where(eq(commercialPlans.id, id))
      .returning();
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "COMMERCIAL_PLAN_UPDATED",
      entityType: "COMMERCIAL_PLAN",
      entityId: id,
      before,
      after: plan,
      origin: "ADMIN"
    });
    return plan!;
  } finally {
    await connection.close();
  }
}

export async function duplicatePlan(id: string, actorId?: string) {
  const source = await getPlanById(id);
  if (!source) throw new Error("Plano não encontrado.");
  return createPlan(
    {
      name: `${source.name} (cópia)`,
      slug: `${source.slug}-copia-${Date.now().toString(36)}`,
      shortDescription: source.shortDescription,
      description: source.description,
      ...(source.fullDescriptionHtml ? { fullDescriptionHtml: source.fullDescriptionHtml } : {}),
      price: source.price,
      promoPrice: source.promoPrice,
      currency: source.currency,
      jobCredits: source.jobCredits,
      durationDays: source.durationDays,
      highlightDays: source.highlightDays,
      publishStories: source.publishStories,
      publishFeed: source.publishFeed,
      publishSite: source.publishSite,
      postsCount: source.postsCount,
      renewable: source.renewable,
      billingType: source.billingType,
      creditValidityDays: source.creditValidityDays,
      priority: source.priority,
      active: false,
      setupRequired: true,
      recommended: false,
      sortOrder: source.sortOrder + 1,
      benefits: source.benefits as string[],
      limitations: source.limitations as string[],
      ...(source.rules ? { rules: source.rules } : {})
    },
    actorId
  );
}

export async function archivePlan(id: string, actorId?: string) {
  return updatePlan(id, { active: false, archived: true }, actorId);
}

export async function reorderPlans(ids: string[], actorId?: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx.update(commercialPlans).set({ sortOrder: i, updatedAt: new Date() }).where(eq(commercialPlans.id, ids[i]!));
      }
      await tx.insert(auditLogs).values({
        actorId,
        action: "COMMERCIAL_PLANS_REORDERED",
        entityType: "COMMERCIAL_PLAN",
        after: { order: ids },
        origin: "ADMIN"
      });
    });
  } finally {
    await connection.close();
  }
}

export async function listPublicPlans() {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return await connection.db
      .select()
      .from(commercialPlans)
      .where(and(eq(commercialPlans.active, true), eq(commercialPlans.archived, false), eq(commercialPlans.setupRequired, false)))
      .orderBy(asc(commercialPlans.sortOrder), asc(commercialPlans.name));
  } catch (error) {
    logServerError("commercial:listPublicPlans", {
      ...describePostgresError(error),
      table: "es_commercial_plans"
    });
    return [];
  } finally {
    await connection.close();
  }
}
