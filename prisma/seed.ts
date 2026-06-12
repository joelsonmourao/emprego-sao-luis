import { PrismaClient } from "@prisma/client";

import { ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD } from "@/lib/admin-bootstrap-credentials";
import { empregoSaoLuisSiteContent } from "@/lib/emprego-sao-luis-site-content";
import { hashPassword } from "@/lib/password-hash";
import { env } from "@/lib/env";
import { defaultSiteSettings } from "@/lib/site-settings";
import { seedEmpregoSaoLuis } from "./seed-emprego-sao-luis";

const prisma = new PrismaClient();

async function main() {
  const resetSiteContent = process.env.RESET_SITE_CONTENT === "1" || process.env.SEED_FRESH === "1";

  await seedEmpregoSaoLuis({ purgeLegacy: resetSiteContent });

  const adminEmail = (env.ADMIN_LOGIN_USER?.trim() || ADMIN_BOOTSTRAP_EMAIL).toLowerCase();
  const adminSecret = env.ADMIN_SECRET_KEY?.trim() || ADMIN_BOOTSTRAP_PASSWORD;

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrador",
      passwordHash: await hashPassword(adminSecret),
      isActive: true
    },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash: await hashPassword(adminSecret),
      isActive: true
    }
  });

  const siteContentSetting = await prisma.siteSetting.findUnique({ where: { key: "site_content" } });
  if (!siteContentSetting || resetSiteContent) {
    await prisma.siteSetting.upsert({
      where: { key: "site_content" },
      update: { value: empregoSaoLuisSiteContent },
      create: { key: "site_content", value: empregoSaoLuisSiteContent }
    });
  }

  const siteSettingsSetting = await prisma.siteSetting.findUnique({ where: { key: "site_settings" } });
  if (!siteSettingsSetting || resetSiteContent) {
    await prisma.siteSetting.upsert({
      where: { key: "site_settings" },
      update: { value: defaultSiteSettings },
      create: { key: "site_settings", value: defaultSiteSettings }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
