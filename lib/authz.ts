import type { AdminRole } from "@prisma/client";

import { requireAdminApiSession, requireAdminSession } from "@/lib/auth";

const roleOrder: Record<AdminRole, number> = {
  EDITOR: 1,
  ADMIN: 2
};

export function hasRole(current: AdminRole, required: AdminRole) {
  return roleOrder[current] >= roleOrder[required];
}

export async function requireRole(required: AdminRole) {
  const session = await requireAdminSession();
  if (!hasRole(session.role, required)) {
    throw new Error("Voce nao tem permissao para acessar esta area.");
  }
  return session;
}

export async function requireApiRole(required: AdminRole) {
  const session = await requireAdminApiSession();
  if (!hasRole(session.role, required)) {
    throw new Error("Voce nao tem permissao para executar esta acao.");
  }
  return session;
}
