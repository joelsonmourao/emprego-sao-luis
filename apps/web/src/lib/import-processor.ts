import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import {
  categories,
  cities,
  classificationRules,
  companies,
  createDatabase,
  importBatches,
  importRows,
  jobs,
  neighborhoods,
  states
} from "@es/db";
import {
  buildContentDuplicateHash,
  consolidateJobContent,
  createImportExternalId,
  evaluateJobPublication,
  extractNeighborhood,
  formatImportRowErrors,
  importJobRowSchema,
  importModeSchema,
  isConfidentialCompanyName,
  normalizeEntityKey,
  normalizeImportRow,
  parseBrazilianLocation,
  resolveImportPublication,
  shouldSkipImportRow,
  suggestCategory,
  UNIDENTIFIED_COMPANY_ID,
  validateApplicationChannels
} from "@es/shared";
import * as XLSX from "xlsx";
import { getImportFile } from "./import-storage";

export interface ImportPayload {
  batchId: string;
  storageKey: string;
  mode: string;
  /** Modo pretendido na validação (DRY_RUN), ex.: PUBLISH_BY_DATE — usado só para avisos/preview. */
  targetMode?: string;
  sheetName?: string;
  mapping?: Record<string, string>;
  duplicateStrategy?: "IGNORE" | "UPDATE" | "CREATE_NEW";
  requestId?: string;
}

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150);

function salaryRange(value: string | undefined, explicitMin?: number, explicitMax?: number) {
  if (explicitMin !== undefined || explicitMax !== undefined) return { min: explicitMin, max: explicitMax };
  const numbers = (value ?? "").match(/[\d.]+(?:,\d{1,2})?/g)?.map((item) => Number(item.replace(/\./g, "").replace(",", "."))).filter(Number.isFinite) ?? [];
  return { min: numbers[0], max: numbers[1] };
}

export async function processImport(payload: ImportPayload) {
  const mode = importModeSchema.parse(payload.mode);
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

  const connection = createDatabase(databaseUrl);
  const [currentBatch] = await connection.db
    .select()
    .from(importBatches)
    .where(eq(importBatches.id, payload.batchId))
    .limit(1);
  if (!currentBatch) {
    await connection.close();
    throw new Error("Lote de importação não encontrado.");
  }
  await connection.db
    .update(importBatches)
    .set({ status: "PROCESSING", updatedAt: new Date() })
    .where(eq(importBatches.id, payload.batchId));

  try {
    const bytes = await getImportFile(payload.storageKey);
    const workbook = XLSX.read(bytes, { type: "array", cellDates: true });
    const selectedSheets = payload.sheetName
      ? workbook.SheetNames.filter((name) => name === payload.sheetName)
      : workbook.SheetNames;
    if (!selectedSheets.length) throw new Error(`Aba não encontrada: ${payload.sheetName}`);

    const rawRows: Array<Record<string, unknown>> = selectedSheets.flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      return sheet
        ? XLSX.utils
            .sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })
            .map((row) => ({ ...row, __sheet: sheetName }) as Record<string, unknown>)
            .filter((row) => !shouldSkipImportRow(row))
        : [];
    });
    if (rawRows.length === 0) throw new Error("A planilha não contém linhas de dados.");

    await connection.db.delete(importRows).where(eq(importRows.batchId, payload.batchId));
    let validRows = 0;
    let rejectedRows = 0;
    const consolidatedSections = new Set<string>();
    let duplicateContentItemsRemoved = 0;
    const availableCategories = await connection.db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories);
    const adminRules = await connection.db.select().from(classificationRules);

    for (const [position, raw] of rawRows.entries()) {
      const normalized = payload.mapping
        ? Object.fromEntries(Object.entries(payload.mapping).map(([field, header]) => [field, raw[header]]))
        : normalizeImportRow(raw);
      const parsed = importJobRowSchema.safeParse(normalized);
      if (!parsed.success) {
        rejectedRows++;
        await connection.db.insert(importRows).values({
          batchId: payload.batchId,
          rowNumber: position + 2,
          raw,
          normalized,
          errors: formatImportRowErrors(parsed.error.issues),
          action: "REJECTED"
        });
        continue;
      }

      const parsedValue = parsed.data;
      const location = parseBrazilianLocation({ locality: parsedValue.locality, city: parsedValue.city, state: parsedValue.state });
      if (location.status !== "EXACT" || !location.city || !location.state) {
        rejectedRows++;
        await connection.db.insert(importRows).values({
          batchId: payload.batchId,
          rowNumber: position + 2,
          raw,
          normalized: parsedValue,
          errors: [location.reason],
          warnings: [],
          suggestions: { location },
          reviewStatus: "REJECTED",
          action: "REJECTED"
        });
        continue;
      }
      const value = {
        ...parsedValue,
        city: location.city,
        state: location.state,
        externalId: createImportExternalId({
          externalId: parsedValue.externalId,
          title: parsedValue.title,
          company: parsedValue.company,
          city: location.city,
          state: location.state,
          applicationUrl: parsedValue.applicationUrl
        })
      };
      const content = consolidateJobContent({
        description: value.description,
        summary: value.summary,
        activities: value.activities,
        requirements: value.requirements,
        benefits: value.benefits
      });
      content.report.sectionsMerged.forEach((section) => consolidatedSections.add(section));
      duplicateContentItemsRemoved += content.report.duplicateItemsRemoved;
      const [state] = await connection.db.select().from(states).where(eq(states.code, value.state)).limit(1);
      let [city] = state
        ? await connection.db
            .select()
            .from(cities)
            .where(and(eq(cities.stateId, state.id), sql`lower(${cities.name}) = lower(${value.city})`))
            .limit(1)
        : [];
      const confidentialCompany = isConfidentialCompanyName(value.company);
      let [company] = confidentialCompany
        ? await connection.db.select().from(companies).where(eq(companies.id, UNIDENTIFIED_COMPANY_ID)).limit(1)
        : await connection.db
            .select()
            .from(companies)
            .where(
              sql`lower(${companies.name}) = lower(${value.company}) or lower(coalesce(${companies.publicName}, '')) = lower(${value.company}) or ${companies.normalizedName} = ${normalizeEntityKey(value.company)}`
            )
            .limit(1);

      const autoCreateNotes: string[] = [];
      if (mode !== "DRY_RUN" && state && !city) {
        const baseSlug = slugify(value.city);
        let slug = baseSlug || "cidade";
        let suffix = 2;
        while (true) {
          const [slugHit] = await connection.db
            .select({ id: cities.id })
            .from(cities)
            .where(and(eq(cities.stateId, state.id), eq(cities.slug, slug)))
            .limit(1);
          if (!slugHit) break;
          slug = `${baseSlug}-${suffix}`;
          suffix += 1;
        }
        const [createdCity] = await connection.db
          .insert(cities)
          .values({
            name: value.city,
            normalizedName: normalizeEntityKey(value.city),
            slug,
            stateId: state.id,
            active: true
          })
          .returning();
        city = createdCity;
        autoCreateNotes.push(`Cidade cadastrada automaticamente: ${value.city}/${value.state}.`);
      }

      if (mode !== "DRY_RUN" && !company && !confidentialCompany) {
        const baseSlug = slugify(value.company);
        let slug = baseSlug || "empresa";
        let suffix = 2;
        while (true) {
          const [slugHit] = await connection.db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug)).limit(1);
          if (!slugHit) break;
          slug = `${baseSlug}-${suffix}`;
          suffix += 1;
        }
        const [createdCompany] = await connection.db
          .insert(companies)
          .values({
            name: value.company,
            publicName: value.company,
            normalizedName: normalizeEntityKey(value.company),
            slug,
            cityId: city?.id ?? null,
            active: true
          })
          .returning();
        company = createdCompany;
        autoCreateNotes.push(`Empresa cadastrada automaticamente: ${value.company}.`);
      }

      const category = value.category
        ? availableCategories.find((item) => item.name.localeCompare(value.category!, "pt-BR", { sensitivity: "base" }) === 0)
        : undefined;
      const categorySuggestion = suggestCategory(
        {
          title: value.title,
          description: content.plainText,
          requirements: Array.isArray(value.requirements) ? value.requirements.join(" ") : String(value.requirements ?? ""),
          companyName: value.company
        },
        availableCategories,
        adminRules.map((rule) => ({
          categorySlug: rule.categorySlug,
          categoryName: rule.categoryName,
          keywords: Array.isArray(rule.keywords) ? (rule.keywords as string[]) : [],
          synonyms: Array.isArray(rule.synonyms) ? (rule.synonyms as string[]) : [],
          priority: rule.priority,
          active: rule.active
        }))
      );
      let selectedCategory =
        category ??
        ((categorySuggestion.level === "HIGH" || categorySuggestion.level === "MEDIUM") &&
        categorySuggestion.categoryId
          ? availableCategories.find((item) => item.id === categorySuggestion.categoryId)
          : undefined);
      const categoryMismatch =
        Boolean(value.category && category && categorySuggestion.level === "HIGH" && categorySuggestion.categoryName && categorySuggestion.categoryName !== category.name);
      if (categoryMismatch && categorySuggestion.categoryId) {
        selectedCategory = availableCategories.find((item) => item.id === categorySuggestion.categoryId) ?? selectedCategory;
      }
      const channels = validateApplicationChannels(value);
      const publicationMode =
        mode === "DRY_RUN"
          ? (payload.targetMode && payload.targetMode !== "DRY_RUN" ? payload.targetMode : "PUBLISH_BY_DATE")
          : mode;
      const publication = resolveImportPublication({
        mode: publicationMode as "DRAFT" | "PENDING_REVIEW" | "PUBLISH_BY_DATE",
        publishedAt: value.publishedAt ?? null,
        expiresAt: value.expiresAt ?? null
      });
      const quality = evaluateJobPublication({
        title: value.title,
        companyName: value.company,
        description: content.descriptionHtml,
        cityName: value.city,
        stateCode: value.state,
        categoryName: selectedCategory?.name ?? null,
        sourceName: value.sourceName,
        sourceUrl: value.sourceUrl ?? null,
        applicationUrl: channels.url.normalized,
        applicationEmail: channels.email.normalized,
        applicationWhatsapp: channels.whatsapp.normalized,
        publicationStatus: publication.publicationStatus,
        verificationStatus: publication.verificationStatus,
        expiresAt: value.expiresAt ?? null
      });
      const qualityWarnings = [
        ...quality.warnings,
        ...(publication.warning ? [publication.warning] : []),
        ...autoCreateNotes,
        ...(mode === "DRY_RUN" && !company && !confidentialCompany
          ? [`Empresa será cadastrada automaticamente: ${value.company}.`]
          : []),
        ...(mode === "DRY_RUN" && confidentialCompany ? ["Empresa confidencial → contratante não identificada."] : []),
        ...(mode === "DRY_RUN" && state && !city ? [`Cidade será cadastrada automaticamente: ${value.city}/${value.state}.`] : []),
        ...(value.category && !category ? ["Categoria informada não existe; usando sugestão automática quando houver."] : []),
        ...(categoryMismatch && categorySuggestion.categoryName
          ? [`Categoria "${value.category}" incompatível; usando sugestão: ${categorySuggestion.categoryName}.`]
          : []),
        ...(!value.expiresAt
          ? ["dataEncerramento vazia: obrigatória antes da publicação pública (validThrough no JobPosting)."]
          : []),
        ...(publicationMode === "PUBLISH_BY_DATE" && publication.publicationStatus === "PUBLISHED"
          ? ["Será publicada imediatamente (dataPublicacao ≤ agora)."]
          : []),
        ...(publicationMode === "PUBLISH_BY_DATE" && publication.publicationStatus === "SCHEDULED"
          ? [`Será agendada para ${publication.scheduledAt?.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) ?? "dataPublicacao"}.`]
          : [])
      ];

      const relationErrors = [
        mode !== "DRY_RUN" && !company ? "Empresa não cadastrada." : null,
        !state ? "UF não cadastrada." : null,
        mode !== "DRY_RUN" && !city ? "Cidade não cadastrada." : null,
        ...quality.errors
      ].filter((item): item is string => item !== null);

      if (relationErrors.length) {
        rejectedRows++;
        await connection.db.insert(importRows).values({
          batchId: payload.batchId,
          rowNumber: position + 2,
          raw,
          normalized: { ...value, _consolidation: content.report },
          errors: relationErrors,
          warnings: qualityWarnings,
          suggestions: { category: categorySuggestion, location },
          confidence: String(Math.max(0, Math.min(1, (categorySuggestion.confidence + 2) / 3))),
          reviewStatus: "REJECTED",
          applicationChannels: channels.validTypes,
          action: "REJECTED"
        });
        continue;
      }

      const contentDuplicateHash = buildContentDuplicateHash({
        title: value.title,
        company: value.company,
        city: value.city,
        state: value.state
      });
      const companyKey = company?.id ?? `name:${normalizeEntityKey(value.company)}`;
      const cityKey = city?.id ?? `name:${normalizeEntityKey(value.city)}|${value.state}`;
      // Fingerprint titulo+empresa+cidade+uf; inclui companyId/cityId quando já existem.
      const duplicateHash = createHash("sha256")
        .update(`${contentDuplicateHash}|${companyKey}|${cityKey}`)
        .digest("hex");

      const [externalExisting] = await connection.db
        .select()
        .from(jobs)
        .where(and(eq(jobs.externalId, value.externalId!), eq(jobs.sourceName, value.sourceName)))
        .limit(1);

      const applicationUrl = channels.url.normalized;
      const [urlExisting] =
        !externalExisting && applicationUrl
          ? await connection.db.select().from(jobs).where(eq(jobs.applicationUrl, applicationUrl)).limit(1)
          : [];

      const legacyHash = createHash("sha256")
        .update(`${value.title}|${companyKey}|${cityKey}`)
        .digest("hex");
      const [hashExisting] =
        !externalExisting && !urlExisting
          ? await connection.db
              .select()
              .from(jobs)
              .where(sql`(${jobs.duplicateHash} = ${duplicateHash} or ${jobs.duplicateHash} = ${legacyHash})`)
              .limit(1)
          : [];

      const duplicate = urlExisting ?? hashExisting;
      const [duplicateExisting] =
        !externalExisting && duplicate && payload.duplicateStrategy === "UPDATE"
          ? await connection.db.select().from(jobs).where(eq(jobs.id, duplicate.id)).limit(1)
          : [];
      const existing =
        externalExisting ??
        duplicateExisting ??
        (payload.duplicateStrategy === "UPDATE" ? duplicate : undefined);

      if (
        (externalExisting || duplicate) &&
        payload.duplicateStrategy !== "CREATE_NEW" &&
        payload.duplicateStrategy !== "UPDATE"
      ) {
        rejectedRows++;
        await connection.db.insert(importRows).values({
          batchId: payload.batchId,
          rowNumber: position + 2,
          raw,
          normalized: value,
          errors: [
            externalExisting
              ? `Duplicada pelo id (${value.externalId}).`
              : urlExisting
                ? "Duplicada pela candidaturaUrl."
                : "Duplicada por titulo+empresa+cidade+uf."
          ],
          warnings: qualityWarnings,
          suggestions: { category: categorySuggestion, location },
          confidence: "0",
          reviewStatus: "REJECTED",
          applicationChannels: channels.validTypes,
          action: "DUPLICATE",
          jobId: (externalExisting ?? duplicate)?.id
        });
        continue;
      }

      if (mode === "DRY_RUN") {
        validRows++;
        await connection.db.insert(importRows).values({
          batchId: payload.batchId,
          rowNumber: position + 2,
          raw,
          normalized: {
            ...value,
            _publication: {
              status: publication.publicationStatus,
              publishedAt: publication.publishedAt?.toISOString() ?? null,
              scheduledAt: publication.scheduledAt?.toISOString() ?? null
            }
          },
          errors: [],
          warnings: qualityWarnings,
          suggestions: {
            category: categorySuggestion,
            location,
            neighborhood: extractNeighborhood({
              title: value.title,
              description: content.plainText,
              address: value.locality,
              instructions: value.applicationInstructions,
              neighborhood: value.neighborhood
            })
          },
          confidence: String(Math.max(0, Math.min(1, (categorySuggestion.confidence + 2) / 3))),
          reviewStatus:
            categorySuggestion.level === "LOW" || categorySuggestion.level === "MEDIUM"
              ? "NEEDS_REVIEW"
              : quality.status,
          applicationChannels: channels.validTypes,
          action: existing ? "WOULD_UPDATE" : "WOULD_CREATE",
          jobId: existing?.id
        });
        continue;
      }

      const beforeSnapshot = existing
        ? {
            originalTitle: existing.originalTitle,
            normalizedTitle: existing.normalizedTitle,
            summary: existing.summary,
            description: existing.description,
            descriptionHtml: existing.descriptionHtml,
            employmentType: existing.employmentType,
            workplaceType: existing.workplaceType,
            applicationUrl: existing.applicationUrl,
            applicationEmail: existing.applicationEmail,
            applicationWhatsapp: existing.applicationWhatsapp,
            sourceUrl: existing.sourceUrl,
            expiresAt: existing.expiresAt?.toISOString() ?? null,
            salaryMin: existing.salaryMin,
            salaryMax: existing.salaryMax,
            salaryVisible: existing.salaryVisible,
            publicationStatus: existing.publicationStatus,
            publishedAt: existing.publishedAt?.toISOString() ?? null,
            scheduledAt: existing.scheduledAt?.toISOString() ?? null,
            categoryId: existing.categoryId
          }
        : null;

      const knownNeighborhoods = city
        ? await connection.db
            .select({ name: neighborhoods.name })
            .from(neighborhoods)
            .where(eq(neighborhoods.cityId, city.id))
        : [];
      const neighborhoodExtraction = extractNeighborhood({
        title: value.title,
        description: content.plainText,
        address: value.locality,
        instructions: value.applicationInstructions,
        neighborhood: value.neighborhood,
        knownNeighborhoods: knownNeighborhoods.map((item) => item.name)
      });

      const job = await connection.db.transaction(async (tx) => {
        const [sequence] = await tx.execute(
          sql<{ value: string }>`select nextval('es_job_public_code_seq')::text as value`
        );
        const publicCode = `ES-${String(sequence?.value ?? "0").padStart(6, "0")}`;
        const slug = `${slugify(`${value.title}-${value.company}-${value.city}`)}-${duplicateHash.slice(0, 8)}`;
        const salary = salaryRange(value.salary, value.salaryMin, value.salaryMax);
        const row = {
          publicCode,
          externalId: value.externalId ?? null,
          slug,
          originalTitle: value.originalTitle ?? value.title,
          normalizedTitle: value.title,
          companyId: company!.id,
          cityId: city!.id,
          stateId: state!.id,
          categoryId: selectedCategory?.id ?? null,
          neighborhood: neighborhoodExtraction.neighborhood,
          employmentType: value.employmentType,
          workplaceType: value.workplaceType,
          numberOfOpenings: value.numberOfOpenings,
          summary: content.summary,
          description: content.plainText,
          descriptionHtml: content.descriptionHtml,
          activities: [],
          requirements: [],
          benefits: [],
          applicationUrl: channels.url.normalized,
          applicationEmail: channels.email.normalized,
          applicationWhatsapp: channels.whatsapp.normalized,
          applicationWhatsappOriginal: channels.whatsapp.original,
          applicationWhatsappMessage: value.whatsappMessage ?? null,
          applicationWhatsappValid: channels.whatsapp.valid,
          applicationWhatsappValidatedAt: channels.whatsapp.original ? new Date() : null,
          applicationWhatsappSource: channels.whatsapp.original ? "SPREADSHEET" : null,
          applicationEmailSubject: value.emailSubject ?? null,
          applicationEmailInstructions: value.applicationInstructions ?? null,
          applicationEmailValid: channels.email.valid,
          applicationEmailValidatedAt: channels.email.original ? new Date() : null,
          applicationEmailSource: channels.email.original ? "SPREADSHEET" : null,
          applicationInstructions: value.applicationInstructions ?? null,
          applicationType: channels.validTypes.length > 1 ? "MULTIPLE" : channels.validTypes[0] ?? "NONE",
          applicationUrlStatus: channels.url.valid ? "UNCHECKED" : "NOT_APPLICABLE",
          sourceName: value.sourceName,
          sourceUrl: value.sourceUrl ?? null,
          originType: "SPREADSHEET" as const,
          duplicateHash,
          verificationStatus: publication.verificationStatus,
          publicationStatus: publication.publicationStatus,
          publishedAt: publication.publishedAt,
          scheduledAt: publication.scheduledAt,
          expiresAt: value.expiresAt,
          salaryMin: salary.min?.toString() ?? null,
          salaryMax: salary.max?.toString() ?? null,
          salaryVisible: salary.min !== undefined || salary.max !== undefined,
          categorySuggestion: categorySuggestion.categoryName,
          categorySuggestionConfidence: String(categorySuggestion.confidence),
          categorySuggestionReason: categorySuggestion.reason,
          categorySuggestionSource: categorySuggestion.source,
          categorySuggestedAt: new Date(),
          featured: value.featured ?? false
        };

        if (existing) {
          const [saved] = await tx
            .update(jobs)
            .set({
              ...row,
              publicCode: existing.publicCode,
              slug: existing.slug,
              externalId: existing.externalId ?? row.externalId,
              version: existing.version + 1,
              updatedAt: new Date()
            })
            .where(eq(jobs.id, existing.id))
            .returning();
          return saved;
        }

        const [saved] = await tx
          .insert(jobs)
          .values(row)
          .onConflictDoUpdate({
            target: [jobs.externalId, jobs.sourceName],
            set: {
              ...row,
              publicCode: sql`${jobs.publicCode}`,
              slug: sql`${jobs.slug}`,
              updatedAt: new Date()
            }
          })
          .returning();
        return saved;
      });

      validRows++;
      await connection.db.insert(importRows).values({
        batchId: payload.batchId,
        rowNumber: position + 2,
        raw,
        normalized: { ...value, _consolidation: content.report },
        errors: [],
        warnings: qualityWarnings,
        suggestions: { category: categorySuggestion, location },
        confidence: String(Math.max(0, Math.min(1, (categorySuggestion.confidence + 2) / 3))),
        reviewStatus: quality.status,
        applicationChannels: channels.validTypes,
        action: existing ? "UPDATED" : "CREATED",
        beforeSnapshot,
        jobId: job?.id
      });

    }

    await connection.db
      .update(importBatches)
      .set({
        status: "COMPLETED",
        totalRows: rawRows.length,
        validRows,
        rejectedRows,
        settings: {
          ...(typeof currentBatch.settings === "object" && currentBatch.settings
            ? currentBatch.settings
            : {}),
          stage: mode === "DRY_RUN" ? "VALIDATED" : "IMPORTED",
          mode,
          analysisValid: mode === "DRY_RUN" ? validRows > 0 : true,
          analysis: {
            totalRows: rawRows.length,
            validRows,
            rejectedRows,
            consolidation: {
              sectionsMerged: [...consolidatedSections],
              duplicateItemsRemoved: duplicateContentItemsRemoved
            }
          }
        },
        updatedAt: new Date()
      })
      .where(eq(importBatches.id, payload.batchId));

    return { totalRows: rawRows.length, validRows, rejectedRows };
  } catch (error) {
    await connection.db
      .update(importBatches)
      .set({
        status: "FAILED",
        settings: {
          ...(typeof currentBatch.settings === "object" && currentBatch.settings
            ? currentBatch.settings
            : {}),
          stage: "FAILED",
          storageKey: payload.storageKey,
          mode,
          sheetName: payload.sheetName,
          mapping: payload.mapping,
          duplicateStrategy: payload.duplicateStrategy,
          error: error instanceof Error ? error.message : "Erro desconhecido",
          failureRequestId: payload.requestId ?? null,
          failedAt: new Date().toISOString()
        },
        updatedAt: new Date()
      })
      .where(eq(importBatches.id, payload.batchId));
    throw error;
  } finally {
    await connection.close();
  }
}
