import { PrismaClient } from "@prisma/client";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${name}`);
  }
  return value;
}

function createClients() {
  const oldDatabaseUrl = requireEnv("OLD_DATABASE_URL");
  const databaseUrl = requireEnv("DATABASE_URL");

  return {
    source: new PrismaClient({ datasourceUrl: oldDatabaseUrl }),
    target: new PrismaClient({ datasourceUrl: databaseUrl })
  };
}

function createStats() {
  return { total: 0, createdOrUpdated: 0, skipped: 0 };
}

function printStats(table, stats) {
  console.log(
    `[db:migrate:neon] ${table}: origem=${stats.total} migrados=${stats.createdOrUpdated} pulados=${stats.skipped}`
  );
}

async function migrateStates(source, target, stateIdMap) {
  const stats = createStats();
  const rows = await source.state.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const saved = await target.state.upsert({
      where: { code: row.code },
      update: {
        name: row.name,
        slug: row.slug,
        seoTitle: row.seoTitle,
        seoIntro: row.seoIntro
      },
      create: {
        code: row.code,
        name: row.name,
        slug: row.slug,
        seoTitle: row.seoTitle,
        seoIntro: row.seoIntro
      }
    });
    stateIdMap.set(row.id, saved.id);
    stats.createdOrUpdated += 1;
  }

  printStats("State", stats);
}

async function migrateCities(source, target, stateIdMap, cityIdMap) {
  const stats = createStats();
  const rows = await source.city.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const mappedStateId = stateIdMap.get(row.stateId);
    if (!mappedStateId) {
      stats.skipped += 1;
      continue;
    }

    let saved;
    try {
      saved = await target.city.upsert({
        where: { stateId_slug: { stateId: mappedStateId, slug: row.slug } },
        update: {
          name: row.name,
          seoTitle: row.seoTitle,
          seoIntro: row.seoIntro
        },
        create: {
          stateId: mappedStateId,
          name: row.name,
          slug: row.slug,
          seoTitle: row.seoTitle,
          seoIntro: row.seoIntro
        }
      });
    } catch {
      saved = await target.city.findFirst({
        where: { stateId: mappedStateId, name: row.name }
      });
      if (!saved) {
        stats.skipped += 1;
        continue;
      }
    }

    cityIdMap.set(row.id, saved.id);
    stats.createdOrUpdated += 1;
  }

  printStats("City", stats);
}

async function migrateCompanies(source, target, stateIdMap, cityIdMap, companyIdMap) {
  const stats = createStats();
  const rows = await source.company.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const mappedStateId = stateIdMap.get(row.stateId);
    const mappedCityId = cityIdMap.get(row.cityId);
    if (!mappedStateId || !mappedCityId) {
      stats.skipped += 1;
      continue;
    }

    const saved = await target.company.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        logoUrl: row.logoUrl,
        websiteUrl: row.websiteUrl,
        summary: row.summary,
        descriptionHtml: row.descriptionHtml,
        socialImageUrl: row.socialImageUrl,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        isActive: row.isActive,
        featured: row.featured,
        stateId: mappedStateId,
        cityId: mappedCityId
      },
      create: {
        name: row.name,
        slug: row.slug,
        logoUrl: row.logoUrl,
        websiteUrl: row.websiteUrl,
        summary: row.summary,
        descriptionHtml: row.descriptionHtml,
        socialImageUrl: row.socialImageUrl,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        isActive: row.isActive,
        featured: row.featured,
        stateId: mappedStateId,
        cityId: mappedCityId
      }
    });

    companyIdMap.set(row.id, saved.id);
    stats.createdOrUpdated += 1;
  }

  printStats("Company", stats);
}

async function migrateBlogCategories(source, target, categoryIdMap) {
  const stats = createStats();
  const rows = await source.blogCategory.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const saved = await target.blogCategory.upsert({
      where: { slug: row.slug },
      update: { name: row.name },
      create: { name: row.name, slug: row.slug }
    });
    categoryIdMap.set(row.id, saved.id);
    stats.createdOrUpdated += 1;
  }

  printStats("BlogCategory", stats);
}

async function migrateSiteSettings(source, target) {
  const stats = createStats();
  const rows = await source.siteSetting.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    await target.siteSetting.upsert({
      where: { key: row.key },
      update: { value: row.value },
      create: { key: row.key, value: row.value }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("SiteSetting", stats);
}

async function migrateHubProfiles(source, target) {
  const stats = createStats();
  const rows = await source.hubProfile.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    await target.hubProfile.upsert({
      where: { type_slug: { type: row.type, slug: row.slug } },
      update: {
        title: row.title,
        intro: row.intro,
        contentHtml: row.contentHtml,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        canonicalUrl: row.canonicalUrl,
        socialImageUrl: row.socialImageUrl,
        noIndex: row.noIndex
      },
      create: {
        type: row.type,
        slug: row.slug,
        title: row.title,
        intro: row.intro,
        contentHtml: row.contentHtml,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        canonicalUrl: row.canonicalUrl,
        socialImageUrl: row.socialImageUrl,
        noIndex: row.noIndex
      }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("HubProfile", stats);
}

async function migrateMediaAssets(source, target) {
  const stats = createStats();
  const rows = await source.mediaAsset.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    await target.mediaAsset.upsert({
      where: { url: row.url },
      update: {
        originalName: row.originalName,
        fileName: row.fileName,
        mimeType: row.mimeType,
        size: row.size,
        altText: row.altText
      },
      create: {
        originalName: row.originalName,
        fileName: row.fileName,
        mimeType: row.mimeType,
        size: row.size,
        url: row.url,
        altText: row.altText
      }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("MediaAsset", stats);
}

async function migrateAdSettings(source, target) {
  const stats = createStats();
  const row = await source.adSettings.findUnique({ where: { id: "singleton" } });
  stats.total = row ? 1 : 0;
  if (!row) {
    printStats("AdSettings", stats);
    return;
  }

  await target.adSettings.upsert({
    where: { id: "singleton" },
    update: { globalEnabled: row.globalEnabled },
    create: { id: "singleton", globalEnabled: row.globalEnabled }
  });
  stats.createdOrUpdated = 1;
  printStats("AdSettings", stats);
}

async function migrateAdSlots(source, target) {
  const stats = createStats();
  const rows = await source.adSlot.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    await target.adSlot.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        position: row.position,
        pageKey: row.pageKey,
        previewPath: row.previewPath,
        code: row.code,
        adsenseSlotId: row.adsenseSlotId,
        isActive: row.isActive,
        maxPerPage: row.maxPerPage,
        notes: row.notes,
        sortOrder: row.sortOrder
      },
      create: {
        slug: row.slug,
        name: row.name,
        position: row.position,
        pageKey: row.pageKey,
        previewPath: row.previewPath,
        code: row.code,
        adsenseSlotId: row.adsenseSlotId,
        isActive: row.isActive,
        maxPerPage: row.maxPerPage,
        notes: row.notes,
        sortOrder: row.sortOrder
      }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("AdSlot", stats);
}

async function migrateJobs(source, target, stateIdMap, cityIdMap, companyIdMap) {
  const stats = createStats();
  const rows = await source.job.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const mappedStateId = stateIdMap.get(row.stateId);
    const mappedCityId = cityIdMap.get(row.cityId);
    const mappedCompanyId = row.companyId ? companyIdMap.get(row.companyId) ?? null : null;
    if (!mappedStateId || !mappedCityId) {
      stats.skipped += 1;
      continue;
    }

    const data = {
      title: row.title,
      slug: row.slug,
      companyId: mappedCompanyId,
      companyName: row.companyName,
      companyLogoUrl: row.companyLogoUrl,
      companyWebsiteUrl: row.companyWebsiteUrl,
      heroImageUrl: row.heroImageUrl,
      summary: row.summary,
      descriptionHtml: row.descriptionHtml,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      benefits: row.benefits,
      salaryMin: row.salaryMin,
      salaryMax: row.salaryMax,
      salaryCurrency: row.salaryCurrency,
      employmentType: row.employmentType,
      workHours: row.workHours,
      publishedAt: row.publishedAt,
      expiresAt: row.expiresAt,
      validThrough: row.validThrough,
      applyUrl: row.applyUrl,
      isActive: row.isActive,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      locationType: row.locationType,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      featured: row.featured,
      externalId: row.externalId,
      stateId: mappedStateId,
      cityId: mappedCityId,
      scheduledPublishAt: row.scheduledPublishAt,
      publicationStatus: row.publicationStatus,
      googleIndexingStatus: row.googleIndexingStatus,
      googleIndexingMessage: row.googleIndexingMessage,
      googleIndexedAt: row.googleIndexedAt,
      publishedPublicUrl: row.publishedPublicUrl
    };

    if (row.externalId) {
      await target.job.upsert({
        where: { externalId: row.externalId },
        update: data,
        create: data
      });
    } else {
      await target.job.upsert({
        where: { slug: row.slug },
        update: data,
        create: data
      });
    }

    stats.createdOrUpdated += 1;
  }

  printStats("Job", stats);
}

async function migrateBlogPosts(source, target, categoryIdMap) {
  const stats = createStats();
  const rows = await source.blogPost.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    const mappedCategoryId = categoryIdMap.get(row.categoryId);
    if (!mappedCategoryId) {
      stats.skipped += 1;
      continue;
    }

    await target.blogPost.upsert({
      where: { slug: row.slug },
      update: {
        title: row.title,
        excerpt: row.excerpt,
        contentHtml: row.contentHtml,
        coverImageUrl: row.coverImageUrl,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        isPublished: row.isPublished,
        publishedAt: row.publishedAt,
        categoryId: mappedCategoryId
      },
      create: {
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        contentHtml: row.contentHtml,
        coverImageUrl: row.coverImageUrl,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        isPublished: row.isPublished,
        publishedAt: row.publishedAt,
        categoryId: mappedCategoryId
      }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("BlogPost", stats);
}

async function migrateImportQueues(source, target) {
  const stats = createStats();
  const rows = await source.importQueue.findMany();
  stats.total = rows.length;

  for (const row of rows) {
    await target.importQueue.upsert({
      where: { id: row.id },
      update: {
        status: row.status,
        payload: row.payload,
        totalRows: row.totalRows,
        processedRows: row.processedRows,
        importedCount: row.importedCount,
        updatedCount: row.updatedCount,
        errorCount: row.errorCount,
        result: row.result,
        errorMessage: row.errorMessage,
        createdById: row.createdById,
        createdByName: row.createdByName,
        createdByEmail: row.createdByEmail,
        startedAt: row.startedAt,
        finishedAt: row.finishedAt
      },
      create: {
        id: row.id,
        status: row.status,
        payload: row.payload,
        totalRows: row.totalRows,
        processedRows: row.processedRows,
        importedCount: row.importedCount,
        updatedCount: row.updatedCount,
        errorCount: row.errorCount,
        result: row.result,
        errorMessage: row.errorMessage,
        createdById: row.createdById,
        createdByName: row.createdByName,
        createdByEmail: row.createdByEmail,
        startedAt: row.startedAt,
        finishedAt: row.finishedAt
      }
    });
    stats.createdOrUpdated += 1;
  }

  printStats("ImportQueue", stats);
}

async function migrateAnalyticsEvents(source, target) {
  const stats = createStats();
  const rows = await source.analyticsEvent.findMany();
  stats.total = rows.length;

  if (!rows.length) {
    printStats("AnalyticsEvent", stats);
    return;
  }

  const result = await target.analyticsEvent.createMany({
    data: rows.map((row) => ({
      id: row.id,
      eventName: row.eventName,
      path: row.path,
      title: row.title,
      referrer: row.referrer,
      referrerHost: row.referrerHost,
      source: row.source,
      medium: row.medium,
      campaign: row.campaign,
      deviceType: row.deviceType,
      browser: row.browser,
      os: row.os,
      entityType: row.entityType,
      entityId: row.entityId,
      entitySlug: row.entitySlug,
      metadata: row.metadata,
      createdAt: row.createdAt
    })),
    skipDuplicates: true
  });

  stats.createdOrUpdated = result.count;
  stats.skipped = Math.max(0, rows.length - result.count);
  printStats("AnalyticsEvent", stats);
}

async function migrateAuditLogs(source, target) {
  const stats = createStats();
  const rows = await source.auditLog.findMany();
  stats.total = rows.length;

  if (!rows.length) {
    printStats("AuditLog", stats);
    return;
  }

  const result = await target.auditLog.createMany({
    data: rows.map((row) => ({
      id: row.id,
      actorId: null,
      actorName: row.actorName,
      actorEmail: row.actorEmail,
      actorRole: row.actorRole,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      entityLabel: row.entityLabel,
      summary: row.summary,
      before: row.before,
      after: row.after,
      createdAt: row.createdAt
    })),
    skipDuplicates: true
  });

  stats.createdOrUpdated = result.count;
  stats.skipped = Math.max(0, rows.length - result.count);
  printStats("AuditLog", stats);
}

async function run() {
  const { source, target } = createClients();
  const stateIdMap = new Map();
  const cityIdMap = new Map();
  const companyIdMap = new Map();
  const categoryIdMap = new Map();

  console.log("[db:migrate:neon] Iniciando migracao OLD_DATABASE_URL -> DATABASE_URL");
  console.log("[db:migrate:neon] AdminUser NAO sera migrado.");

  try {
    await migrateStates(source, target, stateIdMap);
    await migrateCities(source, target, stateIdMap, cityIdMap);
    await migrateCompanies(source, target, stateIdMap, cityIdMap, companyIdMap);
    await migrateBlogCategories(source, target, categoryIdMap);
    await migrateSiteSettings(source, target);
    await migrateHubProfiles(source, target);
    await migrateMediaAssets(source, target);
    await migrateAdSettings(source, target);
    await migrateAdSlots(source, target);
    await migrateJobs(source, target, stateIdMap, cityIdMap, companyIdMap);
    await migrateBlogPosts(source, target, categoryIdMap);
    await migrateImportQueues(source, target);
    await migrateAnalyticsEvents(source, target);
    await migrateAuditLogs(source, target);

    console.log("[db:migrate:neon] Migracao concluida com sucesso.");
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

run().catch((error) => {
  console.error("[db:migrate:neon] Falha na migracao:", error instanceof Error ? error.message : error);
  process.exit(1);
});
