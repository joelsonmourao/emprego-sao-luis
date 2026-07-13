import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { assertAdminPasswordLength } from "@es/shared";
import { createDatabase, permissions, rolePermissions, roles, userRoles, users } from "../src/index.js";
import { validateAdminBootstrapEnv } from "./migrate-flags.js";

const roleKeys = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "OPERADOR",
  "ANALISTA",
  "SOMENTE_LEITURA",
  "REVIEWER",
  "SOCIAL_MEDIA",
  "COMMERCIAL",
  "SUPPORT",
  "COMPANY_USER"
];
const permissionKeys = [
  "jobs.read",
  "jobs.create",
  "jobs.review",
  "jobs.publish",
  "imports.manage",
  "companies.manage",
  "content.manage",
  "media.manage",
  "media.upload",
  "media.delete",
  "media.restore",
  "social.manage",
  "audience.manage",
  "commercial.manage",
  "payments.manage",
  "payments.approve",
  "seo.manage",
  "users.manage",
  "settings.manage",
  "settings.brand.view",
  "settings.brand.manage",
  "audit.read",
  "queues.manage",
  "ads.manage"
];

export type SeedRbacResult = {
  rolesEnsured: number;
  permissionsEnsured: number;
  adminAction: "created" | "exists" | "skipped";
  adminEmail?: string;
};

export async function seedRbac(): Promise<SeedRbacResult> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

  const requireAdmin = process.env.SEED_RBAC_REQUIRE_ADMIN === "true";
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_INITIAL_NAME?.trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (requireAdmin) {
    const validationError = validateAdminBootstrapEnv({
      ADMIN_INITIAL_EMAIL: email,
      ADMIN_INITIAL_NAME: name,
      ADMIN_INITIAL_PASSWORD: password
    });
    if (validationError) throw new Error(validationError);
  }

  const connection = createDatabase(databaseUrl);
  try {
    for (const key of roleKeys) {
      await connection.db.insert(roles).values({ key, name: key.replaceAll("_", " ") }).onConflictDoNothing();
    }
    for (const key of permissionKeys) {
      await connection.db.insert(permissions).values({ key, description: key }).onConflictDoNothing();
    }

    const [superRole] = await connection.db.select().from(roles).where(eq(roles.key, "SUPER_ADMIN")).limit(1);
    const allPermissions = await connection.db.select().from(permissions);
    if (!superRole) throw new Error("Papel SUPER_ADMIN não criado.");

    for (const permission of allPermissions) {
      await connection.db
        .insert(rolePermissions)
        .values({ roleId: superRole.id, permissionId: permission.id })
        .onConflictDoNothing();
    }

    let adminAction: SeedRbacResult["adminAction"] = "skipped";
    let adminEmail: string | undefined;

    if (email && password) {
      assertAdminPasswordLength(password);

      const [existingUser] = await connection.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser) {
        adminAction = "exists";
        adminEmail = email;
        process.stdout.write(`Administrador já existente: ${email}\n`);
      } else {
        const passwordHash = await bcrypt.hash(password, 12);
        await connection.db.insert(users).values({
          email,
          name: name ?? "Administrador",
          passwordHash,
          emailVerifiedAt: new Date()
        });
        adminAction = "created";
        adminEmail = email;
        process.stdout.write(`Administrador criado: ${email}\n`);
      }

      const [user] = await connection.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (user) {
        await connection.db
          .insert(userRoles)
          .values({ userId: user.id, roleId: superRole.id })
          .onConflictDoNothing();
      }
    }

    process.stdout.write(
      `RBAC concluído: ${roleKeys.length} papéis, ${permissionKeys.length} permissões, administrador ${adminAction}.\n`
    );

    return {
      rolesEnsured: roleKeys.length,
      permissionsEnsured: permissionKeys.length,
      adminAction,
      adminEmail
    };
  } finally {
    await connection.close();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-rbac")) {
  seedRbac().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
