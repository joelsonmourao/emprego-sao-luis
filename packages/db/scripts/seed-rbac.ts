import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createDatabase, permissions, rolePermissions, roles, userRoles, users } from "../src/index.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
const roleKeys = ["SUPER_ADMIN", "ADMIN", "EDITOR", "OPERADOR", "ANALISTA", "SOMENTE_LEITURA", "REVIEWER", "SOCIAL_MEDIA", "COMMERCIAL", "SUPPORT", "COMPANY_USER"];
const permissionKeys = ["jobs.read", "jobs.create", "jobs.review", "jobs.publish", "imports.manage", "companies.manage", "content.manage", "media.manage", "social.manage", "audience.manage", "commercial.manage", "payments.manage", "payments.approve", "seo.manage", "users.manage", "settings.manage", "audit.read", "queues.manage", "ads.manage"];
const connection = createDatabase(databaseUrl);
try {
  for (const key of roleKeys) await connection.db.insert(roles).values({ key, name: key.replaceAll("_", " ") }).onConflictDoNothing();
  for (const key of permissionKeys) await connection.db.insert(permissions).values({ key, description: key }).onConflictDoNothing();
  const [superRole] = await connection.db.select().from(roles).where(eq(roles.key, "SUPER_ADMIN")).limit(1);
  const allPermissions = await connection.db.select().from(permissions);
  if (!superRole) throw new Error("Papel SUPER_ADMIN não criado.");
  for (const permission of allPermissions) await connection.db.insert(rolePermissions).values({ roleId: superRole.id, permissionId: permission.id }).onConflictDoNothing();
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase(); const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (email && password) {
    if (password.length < 14) throw new Error("ADMIN_INITIAL_PASSWORD deve ter ao menos 14 caracteres.");
    const passwordHash = await bcrypt.hash(password, 12);
    await connection.db.insert(users).values({ email, name: process.env.ADMIN_INITIAL_NAME ?? "Administrador", passwordHash, emailVerifiedAt: new Date() }).onConflictDoNothing();
    const [user] = await connection.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user) await connection.db.insert(userRoles).values({ userId: user.id, roleId: superRole.id }).onConflictDoNothing();
  }
  process.stdout.write("RBAC inicializado.\n");
} finally { await connection.close(); }
