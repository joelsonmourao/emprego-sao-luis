import { compare, hash } from "bcryptjs";

export { getAdminSession, requireAdminApiSession, requireAdminSession } from "@/lib/auth-session";
export { ADMIN_AUTH_COOKIE, createAdminSessionToken, verifyAdminSessionToken } from "@/lib/auth-token";

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}
