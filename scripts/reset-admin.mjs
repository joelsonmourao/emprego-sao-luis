import { PrismaClient, AdminRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${name}`);
  }
  return value;
}

async function run() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const username = requireEnv("ADMIN_USERNAME");
  const password = requireEnv("ADMIN_PASSWORD");

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");
  }

  const passwordHash = await hash(password, 12);

  const existing = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true, email: true }
  });

  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: {
        name: username,
        passwordHash,
        role: AdminRole.ADMIN,
        isActive: true
      }
    });
    console.log(`[admin:reset] Admin atualizado: ${email}`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      email,
      name: username,
      passwordHash,
      role: AdminRole.ADMIN,
      isActive: true
    }
  });
  console.log(`[admin:reset] Admin criado: ${email}`);
}

run()
  .catch((error) => {
    console.error("[admin:reset] Falha:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
