import type { APIRoute } from "astro";
import { createDatabase, roles, userRoles, users } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { isPortalUser } from "../../../../lib/users-admin";

const csv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export const GET: APIRoute = async ({ locals }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const allUsers = await connection.db.select({ id: users.id, email: users.email, name: users.name, active: users.active, createdAt: users.createdAt }).from(users).orderBy(users.createdAt).limit(5000);
    const roleRows = await connection.db.select({ userId: userRoles.userId, roleKey: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id));
    const rolesByUser = new Map<string, string[]>();
    for (const row of roleRows) {
      const list = rolesByUser.get(row.userId) ?? [];
      list.push(row.roleKey);
      rolesByUser.set(row.userId, list);
    }

    const portalUsers = allUsers.filter((user) => isPortalUser(rolesByUser.get(user.id) ?? []));
    const body = ["id,nome,email,status,desde", ...portalUsers.map((user) => [user.id, csv(user.name), csv(user.email), user.active ? "ativo" : "bloqueado", user.createdAt.toISOString()].join(","))].join("\r\n");
    return new Response(`\uFEFF${body}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="usuarios-portal.csv"' } });
  } finally {
    await connection.close();
  }
};
