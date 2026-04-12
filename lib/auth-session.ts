import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, type AdminSessionTokenPayload, verifyAdminSessionToken } from "@/lib/auth-token";

export type AdminSession = AdminSessionTokenPayload;

const getVerifiedAdminSession = cache(async (token: string) => {
  const session = await verifyAdminSessionToken(token);
  if (!session) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true
    }
  });

  if (!user || !user.isActive || user.email.toLowerCase() !== session.email.toLowerCase()) {
    return null;
  }

  return {
    ...session,
    email: user.email,
    name: user.name,
    role: user.role
  } satisfies AdminSession;
});

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  if (!token) return null;

  return getVerifiedAdminSession(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdminApiSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Nao autenticado.");
  }

  return session;
}
