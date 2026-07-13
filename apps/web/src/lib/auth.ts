import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { verify } from "otplib";
import { auditLogs, createDatabase, loginAttempts, permissions, rolePermissions, roles, sessions, userRoles, users } from "@es/db";

export const ADMIN_COOKIE = "es_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

export interface AdminIdentity { id: string; email: string; name: string; roles: string[]; permissions: string[] }

type PasswordUser = { passwordHash: string | null } | null | undefined;
const DUMMY_PASSWORD_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEe.6Q7pQwS7Qv7hG7gV8Qx5JxR6JmP6a3K";

export async function verifyAdminCredentials(user: PasswordUser, password: string): Promise<boolean> {
  const matches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  return Boolean(user?.passwordHash) && matches;
}

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET deve possuir ao menos 32 caracteres.");
  return new TextEncoder().encode(value);
};

export function encryptSecret(value: string) { const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", createHash("sha256").update(secret()).digest(), iv); const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`; }
export function decryptSecret(value: string) { const [ivValue, tagValue, dataValue] = value.split("."); if (!ivValue || !tagValue || !dataValue) throw new Error("Segredo MFA inválido."); const decipher = createDecipheriv("aes-256-gcm", createHash("sha256").update(secret()).digest(), Buffer.from(ivValue, "base64url")); decipher.setAuthTag(Buffer.from(tagValue, "base64url")); return Buffer.concat([decipher.update(Buffer.from(dataValue, "base64url")), decipher.final()]).toString("utf8"); }

export async function authenticate(email: string, password: string, ip: string, userAgent: string, otp?: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const emailNormalized = email.trim().toLowerCase();
  const emailHash = hash(emailNormalized); const ipHash = hash(ip || "unknown");
  try {
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const [rate] = await connection.db.select({ count: sql<number>`count(*)::int` }).from(loginAttempts).where(and(eq(loginAttempts.emailHash, emailHash), eq(loginAttempts.ipHash, ipHash), eq(loginAttempts.successful, false), gt(loginAttempts.createdAt, since)));
    if ((rate?.count ?? 0) >= 5) { await connection.db.insert(auditLogs).values({ action: "LOGIN_RATE_LIMITED", entityType: "AUTH", after: { emailHash, ipHash, userAgentHash: hash(userAgent || "unknown") }, origin: "ADMIN_LOGIN" }); return { ok: false as const, reason: "rate_limited" as const }; }
    const [user] = await connection.db.select().from(users).where(and(eq(users.email, emailNormalized), eq(users.active, true))).limit(1);
    const valid = await verifyAdminCredentials(user, password);
    if (!user || !valid) { await connection.db.insert(loginAttempts).values({ emailHash, ipHash, successful: false }); await connection.db.insert(auditLogs).values({ action: "LOGIN_FAILED", entityType: "AUTH", after: { emailHash, ipHash, userAgentHash: hash(userAgent || "unknown") }, origin: "ADMIN_LOGIN" }); return { ok: false as const, reason: "invalid" as const }; }
    if (user.mfaEnabled) { if (!user.mfaSecretEncrypted || !otp) return { ok: false as const, reason: "mfa_required" as const }; const result = await verify({ secret: decryptSecret(user.mfaSecretEncrypted), token: otp }); if (!result.valid) { await connection.db.insert(loginAttempts).values({ emailHash, ipHash, successful: false }); return { ok: false as const, reason: "invalid_otp" as const }; } }
    await connection.db.insert(loginAttempts).values({ emailHash, ipHash, successful: true });
    const jti = randomUUID(); const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
    const token = await new SignJWT({ email: user.email, name: user.name }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setJti(jti).setIssuedAt().setExpirationTime(Math.floor(expiresAt.getTime() / 1000)).sign(secret());
    await connection.db.transaction(async (tx) => { await tx.insert(sessions).values({ userId: user.id, tokenHash: hash(jti), ipHash, userAgentHash: hash(userAgent || "unknown"), expiresAt }); await tx.insert(auditLogs).values({ actorId: user.id, action: "LOGIN_SUCCESS", entityType: "AUTH", entityId: user.id, after: { ipHash, userAgentHash: hash(userAgent || "unknown") }, origin: "ADMIN_LOGIN" }); });
    return { ok: true as const, token, expiresAt };
  } finally { await connection.close(); }
}

export async function verifySession(token: string): Promise<AdminIdentity | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.jti) return null;
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      const [record] = await connection.db.select({ id: users.id, email: users.email, name: users.name }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(eq(sessions.tokenHash, hash(payload.jti)), eq(users.active, true), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date()))).limit(1);
      if (!record) return null;
      const roleRows = await connection.db.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(userRoles.userId, record.id));
      const permissionRows = await connection.db.selectDistinct({ key: permissions.key }).from(userRoles).innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId)).innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id)).where(eq(userRoles.userId, record.id));
      return { ...record, roles: roleRows.map((row) => row.key), permissions: permissionRows.map((row) => row.key) };
    } finally { await connection.close(); }
  } catch { return null; }
}

export async function revokeSession(token: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.jti) return;
    const connection = createDatabase(process.env.DATABASE_URL);
    try { await connection.db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.tokenHash, hash(payload.jti))); }
    finally { await connection.close(); }
  } catch { /* An invalid cookie is already effectively revoked. */ }
}

export const can = (identity: AdminIdentity, permission: string) => {
  if (identity.roles.includes("SUPER_ADMIN")) return true;
  if (identity.permissions.includes(permission)) return true;
  if (permission.startsWith("settings.brand.") && identity.permissions.includes("settings.manage")) return true;
  if (permission === "media.upload" && identity.permissions.includes("media.manage")) return true;
  if ((permission === "media.delete" || permission === "media.restore") && identity.permissions.includes("media.manage")) return true;
  return false;
};
