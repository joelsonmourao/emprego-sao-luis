import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_AUTH_COOKIE = "emprego-sao-luis-admin-session";
const ADMIN_AUTH_ISSUER = "emprego-sao-luis";
const ADMIN_AUTH_AUDIENCE = "admin";
const ADMIN_AUTH_TTL = 60 * 60 * 24 * 7;

const DEV_FALLBACK_AUTH_SECRET = "dev-only-change-this-secret-key";

function getEncodedAuthSecret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_AUTH_SECRET);
  if (!raw || raw.length < 16) {
    throw new Error("AUTH_SECRET precisa estar configurada (minimo 16 caracteres).");
  }
  return new TextEncoder().encode(raw);
}

let cachedEncodedSecret: Uint8Array | undefined;

function encodedSecret(): Uint8Array {
  cachedEncodedSecret ??= getEncodedAuthSecret();
  return cachedEncodedSecret;
}

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
    .sign(encodedSecret());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret(), {
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
