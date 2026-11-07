import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { auditLogs, companyAccounts, companySessions, createDatabase } from "@es/db";

export const COMPANY_COOKIE = "es_company_session";
const SESSION_SECONDS = 60 * 60 * 24 * 14;

export type CompanyRole = "OWNER" | "MANAGER" | "RECRUITER" | "BILLING" | "VIEWER";

export interface CompanyIdentity {
  id: string;
  email: string;
  name: string;
  role: CompanyRole;
  companyId: string | null;
}

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function authenticateCompany(email: string, password: string, ip: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const normalized = email.trim().toLowerCase();
  try {
    const [account] = await connection.db
      .select()
      .from(companyAccounts)
      .where(and(eq(companyAccounts.email, normalized), eq(companyAccounts.active, true)))
      .limit(1);
    const valid = Boolean(account?.passwordHash) && await bcrypt.compare(password, account?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid");
    if (!account || !valid) {
      await connection.db.insert(auditLogs).values({
        action: "COMPANY_LOGIN_FAILED",
        entityType: "COMPANY_AUTH",
        after: { emailHash: hash(normalized), ipHash: hash(ip) },
        origin: "COMPANY_LOGIN"
      });
      return { ok: false as const };
    }
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
    await connection.db.insert(companySessions).values({
      accountId: account.id,
      tokenHash: hash(token),
      ipHash: hash(ip),
      expiresAt
    });
    await connection.db.insert(auditLogs).values({
      action: "COMPANY_LOGIN_SUCCESS",
      entityType: "COMPANY_AUTH",
      entityId: account.id,
      origin: "COMPANY_LOGIN"
    });
    return { ok: true as const, token, expiresAt, account };
  } finally {
    await connection.close();
  }
}

export async function verifyCompanySession(token: string): Promise<CompanyIdentity | null> {
  if (!process.env.DATABASE_URL || !token) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [record] = await connection.db
      .select({
        id: companyAccounts.id,
        email: companyAccounts.email,
        name: companyAccounts.name,
        role: companyAccounts.role,
        companyId: companyAccounts.companyId
      })
      .from(companySessions)
      .innerJoin(companyAccounts, eq(companySessions.accountId, companyAccounts.id))
      .where(and(eq(companySessions.tokenHash, hash(token)), isNull(companySessions.revokedAt), gt(companySessions.expiresAt, new Date()), eq(companyAccounts.active, true)))
      .limit(1);
    return record ?? null;
  } finally {
    await connection.close();
  }
}

export async function revokeCompanySession(token: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.update(companySessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(companySessions.tokenHash, hash(token)));
  } finally {
    await connection.close();
  }
}

export async function createCompanyAccount(input: {
  email: string;
  name: string;
  password: string;
  companyId?: string | null;
  role?: CompanyRole;
}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const passwordHash = await bcrypt.hash(input.password, 12);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [account] = await connection.db.insert(companyAccounts).values({
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      passwordHash,
      companyId: input.companyId ?? null,
      role: input.role ?? "OWNER",
      emailVerifiedAt: new Date()
    }).returning();
    return account!;
  } finally {
    await connection.close();
  }
}

export async function ensureCompanyAccountForOrder(email: string, companyName: string, orderId: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  const normalized = email.trim().toLowerCase();
  try {
    const [existing] = await connection.db.select().from(companyAccounts).where(eq(companyAccounts.email, normalized)).limit(1);
    if (existing) return existing;
    const inviteToken = randomUUID();
    const [account] = await connection.db.insert(companyAccounts).values({
      email: normalized,
      name: companyName,
      role: "OWNER",
      inviteTokenHash: hash(inviteToken),
      inviteExpiresAt: new Date(Date.now() + 7 * 86400000)
    }).returning();
    await connection.db.insert(auditLogs).values({
      action: "COMPANY_ACCOUNT_INVITED",
      entityType: "COMPANY_ACCOUNT",
      entityId: account!.id,
      after: { orderId, email: normalized },
      origin: "COMMERCIAL"
    });
    return { account: account!, inviteToken };
  } finally {
    await connection.close();
  }
}

export function companyCanManageJobs(role: CompanyRole) {
  return role === "OWNER" || role === "MANAGER" || role === "RECRUITER";
}
