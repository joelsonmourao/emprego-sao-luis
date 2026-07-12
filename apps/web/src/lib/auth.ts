import { createHash, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { createDatabase, loginAttempts, permissions, rolePermissions, roles, sessions, userRoles, users } from "@es/db";

export const ADMIN_COOKIE = "es_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

export interface AdminIdentity { id: string; email: string; name: string; roles: string[]; permissions: string[] }

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET deve possuir ao menos 32 caracteres.");
  return new TextEncoder().encode(value);
};

export async function authenticate(email: string, password: string, ip: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const emailNormalized = email.trim().toLowerCase();
  const emailHash = hash(emailNormalized); const ipHash = hash(ip || "unknown");
  try {
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const [rate] = await connection.db.select({ count: sql<number>`count(*)::int` }).from(loginAttempts).where(and(eq(loginAttempts.emailHash, emailHash), eq(loginAttempts.ipHash, ipHash), eq(loginAttempts.successful, false), gt(loginAttempts.createdAt, since)));
    if ((rate?.count ?? 0) >= 5) return { ok: false as const, reason: "rate_limited" as const };
    const [user] = await connection.db.select().from(users).where(and(eq(users.email, emailNormalized), eq(users.active, true))).limit(1);
    const valid = Boolean(user?.passwordHash) && await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid");
    await connection.db.insert(loginAttempts).values({ emailHash, ipHash, successful: valid });
    if (!user || !valid) return { ok: false as const, reason: "invalid" as const };
    const jti = randomUUID(); const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
    const token = await new SignJWT({ email: user.email, name: user.name }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setJti(jti).setIssuedAt().setExpirationTime(Math.floor(expiresAt.getTime() / 1000)).sign(secret());
    await connection.db.insert(sessions).values({ userId: user.id, tokenHash: hash(jti), expiresAt });
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

export const can = (identity: AdminIdentity, permission: string) => identity.roles.includes("SUPER_ADMIN") || identity.permissions.includes(permission);
