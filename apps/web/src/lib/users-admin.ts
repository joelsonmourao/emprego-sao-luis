export const ADMIN_PANEL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "OPERADOR",
  "ANALISTA",
  "SOMENTE_LEITURA",
  "REVIEWER",
  "SOCIAL_MEDIA",
  "COMMERCIAL",
  "SUPPORT"
] as const;

export const MANAGEABLE_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "OPERADOR",
  "ANALISTA",
  "SOMENTE_LEITURA"
] as const;

export const ROLE_RANK: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  EDITOR: 70,
  OPERADOR: 60,
  ANALISTA: 50,
  REVIEWER: 45,
  SOCIAL_MEDIA: 40,
  COMMERCIAL: 40,
  SUPPORT: 35,
  SOMENTE_LEITURA: 10,
  COMPANY_USER: 5
};

const SENSITIVE_KEYS = /password|token|secret|private|credential|authorization|apikey|api_key|hash|mfa/i;

export function maxRoleRank(roles: string[]): number {
  return roles.reduce((max, role) => Math.max(max, ROLE_RANK[role] ?? 0), 0);
}

export function canAssignRole(actorRoles: string[], targetRole: string): boolean {
  if (actorRoles.includes("SUPER_ADMIN")) return true;
  if (targetRole === "SUPER_ADMIN") return false;
  return maxRoleRank(actorRoles) > (ROLE_RANK[targetRole] ?? 0);
}

export function canManageAdmin(actorRoles: string[], targetRoles: string[]): boolean {
  if (actorRoles.includes("SUPER_ADMIN")) return true;
  return maxRoleRank(actorRoles) > maxRoleRank(targetRoles);
}

export function canRemoveSuperAdmin(actorRoles: string[], superAdminCount: number): boolean {
  if (!actorRoles.includes("SUPER_ADMIN")) return false;
  return superAdminCount > 1;
}

export function isPortalUser(roleKeys: string[]): boolean {
  return !roleKeys.some((role) => (ADMIN_PANEL_ROLES as readonly string[]).includes(role));
}

export function sanitizeAuditPayload(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[truncado]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.length > 200 ? `${value.slice(0, 200)}…` : value;
  if (Array.isArray(value)) return value.slice(0, 30).map((item) => sanitizeAuditPayload(item, depth + 1));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      output[key] = SENSITIVE_KEYS.test(key) ? "[oculto]" : sanitizeAuditPayload(entry, depth + 1);
    }
    return output;
  }
  return value;
}
