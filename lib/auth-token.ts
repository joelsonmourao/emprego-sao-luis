import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

import { env } from "@/lib/env";

export const ADMIN_AUTH_COOKIE = "jovem-aprendiz-admin-session";
const ADMIN_AUTH_ISSUER = "jovem-aprendiz-vagas";
const ADMIN_AUTH_AUDIENCE = "admin";
const ADMIN_AUTH_TTL = 60 * 60 * 24 * 7;

const authSecret = new TextEncoder().encode(env.AUTH_SECRET);

export type AdminSessionTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number;
  iat?: number;
};

export async function createAdminSessionToken(payload: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.id)
    .setIssuer(ADMIN_AUTH_ISSUER)
    .setAudience(ADMIN_AUTH_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_AUTH_TTL}s`)
    .sign(authSecret);
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, authSecret, {
      issuer: ADMIN_AUTH_ISSUER,
      audience: ADMIN_AUTH_AUDIENCE
    });

    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string" || typeof payload.role !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      exp: payload.exp ?? 0,
      iat: payload.iat
    } satisfies AdminSessionTokenPayload;
  } catch {
    return null;
  }
}
