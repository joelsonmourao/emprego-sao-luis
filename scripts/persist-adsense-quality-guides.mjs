#!/usr/bin/env node
/**
 * Persiste o pacote adsense-quality-guides no CMS (es_articles).
 *
 * Dry-run:
 *   node scripts/persist-adsense-quality-guides.mjs
 *   npm run persist:adsense-quality-guides
 *
 * Escrita (não sobrescreve slug existente, salvo --force):
 *   npm run persist:adsense-quality-guides -- --write
 *   npm run persist:adsense-quality-guides -- --write --force
 *
 * Produção (fail-closed) — no Terminal Coolify do serviço web (/app):
 *   ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 npm run persist:adsense-quality-guides -- --write --i-understand-production
 *
 * A imagem Dockerfile.web inclui package.json + este script + data + capas WebP
 * (sem copiar o monorepo inteiro).
 * Regras:
 * - FACT_REVIEW / HOLD_REVIEW → DRAFT (nunca PUBLISHED/SCHEDULED automático)
 * - Agenda recalculada em America/Sao_Paulo a partir de "agora" (sem scheduledAt no passado)
 * - Capa obrigatória em apps/web/public/covers/adsense-quality/{slug}.webp
 * - Idempotente: slug existente → skipped (ou updated com --force)
 * - Transação única; falha → rollback
 */
import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import {
  PACKAGE_ID,
  PACKAGE_TZ,
  coverPathFor,
  isHoldReview,
  qualityGuides
} from "./data/adsense-quality-guides.mjs";

const write = process.argv.includes("--write");
const force = process.argv.includes("--force");
const understandProduction = process.argv.includes("--i-understand-production");
const allowRemote = process.env.ADSENSE_EDITORIAL_ALLOW_REMOTE === "1";
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;
const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function todayYmdSaoPaulo(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PACKAGE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

export function addCalendarDaysYmd(ymd, offset) {
  const [y, m, d] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + offset);
  return utc.toISOString().slice(0, 10);
}

/** Interpreta YMD+HH:mm como horário de Brasília (sem DST desde 2019). */
export function saoPauloLocalToDate(ymd, hm) {
  return new Date(`${ymd}T${hm}:00-03:00`);
}

export function resolveGuidePublication(guide, { now = new Date() } = {}) {
  const today = todayYmdSaoPaulo(now);
  const coverRel = coverPathFor(guide.slug);
  const coverAbs = resolve(root, "apps/web/public", coverRel.replace(/^\//, ""));
  const coverOk = existsSync(coverAbs) && statSync(coverAbs).size > 1000;

  if (isHoldReview(guide) || guide.publishPlan === "HOLD_REVIEW") {
    return {
      slug: guide.slug,
      title: guide.title,
      status: "DRAFT",
      editorialStage: "FACT_REVIEW",
      publishedAt: null,
      scheduledAt: null,
      ymd: null,
      time: null,
      coverRel,
      coverAbs,
      coverOk,
      reason: "FACT_REVIEW_HOLD"
    };
  }

  if (guide.publishPlan === "PUBLISH_NOW") {
    return {
      slug: guide.slug,
      title: guide.title,
      status: "PUBLISHED",
      editorialStage: guide.editorialStage || "EDITORIAL_REVIEW",
      publishedAt: now,
      scheduledAt: null,
      ymd: today,
      time: "now",
      coverRel,
      coverAbs,
      coverOk,
      reason: "PUBLISH_NOW"
    };
  }

  const offset = Math.max(1, Number(guide.scheduleDayOffset) || 1);
  const time = guide.scheduleTimeLocal || "09:00";
  let ymd = addCalendarDaysYmd(today, offset);
  let when = saoPauloLocalToDate(ymd, time);
  // Nunca agendar no passado
  if (when.getTime() <= now.getTime()) {
    ymd = addCalendarDaysYmd(today, offset + 1);
    when = saoPauloLocalToDate(ymd, time);
  }
  if (when.getTime() <= now.getTime()) {
    ymd = addCalendarDaysYmd(todayYmdSaoPaulo(new Date(now.getTime() + 86400000)), 1);
    when = saoPauloLocalToDate(ymd, time);
  }

  return {
    slug: guide.slug,
    title: guide.title,
    status: "SCHEDULED",
    editorialStage: guide.editorialStage || "EDITORIAL_REVIEW",
    publishedAt: null,
    scheduledAt: when,
    ymd,
    time,
    coverRel,
    coverAbs,
    coverOk,
    reason: "SCHEDULE_DAY"
  };
}

export function buildPublicationPlan(guides = qualityGuides, opts = {}) {
  const publishNow = guides.filter((g) => g.publishPlan === "PUBLISH_NOW" && !isHoldReview(g));
  if (publishNow.length > 2) {
    throw new Error(`No máximo 2 PUBLISH_NOW; encontrados ${publishNow.length}.`);
  }
  return guides.map((guide) => resolveGuidePublication(guide, opts));
}

function describeDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || "(default)",
      database: parsed.pathname.replace(/^\//, ""),
      user: parsed.username || "(none)"
    };
  } catch {
    return { error: "URL inválida" };
  }
}

function assertSafety(target) {
  const hostIsLocal = target.host === "127.0.0.1" || target.host === "localhost";
  const hostLooksDockerInternal =
    !hostIsLocal && !String(target.host).includes(".") && /^[a-z0-9]{8,}$/i.test(String(target.host));
  const looksProduction =
    /empregossaoluis\.com\.br|production/i.test(databaseUrl) ||
    /prod/i.test(String(target.database)) ||
    process.env.APP_ENV === "production" ||
    hostLooksDockerInternal;
  const localOk = hostIsLocal && String(target.port) === "55432" && /staging|e2e/i.test(String(target.database));
  const productionWriteOk = allowProduction && understandProduction;
  if (looksProduction && !productionWriteOk) {
    throw new Error(
      "Recusa fail-closed: alvo parece produção. Defina ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production."
    );
  }
  if (!localOk && !allowRemote && !productionWriteOk) {
    throw new Error("Recusa fail-closed: use staging local, ADSENSE_EDITORIAL_ALLOW_REMOTE=1 ou flags de produção.");
  }
  return { looksProduction, localOk };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  if (!databaseUrl) {
    console.error("DATABASE_URL é obrigatória. Pacote permanece PENDENTE DE PERSISTÊNCIA NO BANCO.");
    const plan = buildPublicationPlan();
    console.error(
      JSON.stringify(
        {
          packageId: PACKAGE_ID,
          guides: qualityGuides.length,
          write: false,
          agenda: plan.map((p) => ({
            slug: p.slug,
            status: p.status,
            ymd: p.ymd,
            time: p.time,
            coverOk: p.coverOk,
            reason: p.reason
          }))
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  const target = describeDbUrl(databaseUrl);
  if (target.error) {
    console.error("Recusa: DATABASE_URL inválida.");
    process.exit(1);
  }

  let safety;
  try {
    safety = assertSafety(target);
  } catch (error) {
    console.error(String(error.message || error));
    process.exit(1);
  }

  const plan = buildPublicationPlan();
  const coverFailures = plan.filter((p) => !p.coverOk);
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: !write,
        force,
        packageId: PACKAGE_ID,
        timezone: PACKAGE_TZ,
        target: { host: target.host, port: target.port, database: target.database },
        safety,
        count: plan.length,
        agenda: plan.map((p) => ({
          slug: p.slug,
          status: p.status,
          stage: p.editorialStage,
          ymd: p.ymd,
          time: p.time,
          scheduledAt: p.scheduledAt?.toISOString() ?? null,
          cover: p.coverRel,
          coverOk: p.coverOk,
          reason: p.reason
        })),
        coverFailures: coverFailures.map((p) => p.slug)
      },
      null,
      2
    )
  );

  if (coverFailures.length) {
    console.error("Capas ausentes ou inválidas:", coverFailures.map((p) => p.slug).join(", "));
    process.exit(1);
  }

  if (!write) {
    console.log("Dry-run apenas. Passe --write para persistir.");
    process.exit(0);
  }

  const sql = postgres(databaseUrl, { max: 1 });
  const summary = { inserted: [], updated: [], skipped: [], held: [], published: [], scheduled: [], drafts: [] };

  try {
    await sql.begin(async (tx) => {
      const [author] = await tx`
        select id, name from es_authors
        order by
          case when lower(name) like '%reda%' then 0 else 1 end,
          created_at asc
        limit 1
      `;
      if (!author) throw new Error("Nenhum autor encontrado. Crie 'Redação Empregos São Luís' no admin.");

      let [pillar] = await tx`
        select id, name from es_content_pillars
        where lower(name) like '%carreira%' or lower(name) like '%emprego%'
        order by created_at asc
        limit 1
      `;
      if (!pillar) {
        [pillar] = await tx`
          insert into es_content_pillars (name, slug, description)
          values ('Carreira', 'carreira', 'Conteúdos de carreira e empregabilidade')
          on conflict (slug) do update set name = excluded.name
          returning id, name
        `;
      }

      const clusterCache = new Map();
      async function clusterIdFor(hint) {
        const key = String(hint || "Carreira");
        if (clusterCache.has(key)) return clusterCache.get(key);
        const slug = key
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        let [row] = await tx`
          select id, name from es_content_clusters
          where pillar_id = ${pillar.id} and slug = ${slug}
          limit 1
        `;
        if (!row) {
          [row] = await tx`
            insert into es_content_clusters (pillar_id, name, slug, description)
            values (${pillar.id}, ${key}, ${slug}, ${`Cluster ${key}`})
            returning id, name
          `;
        }
        clusterCache.set(key, row.id);
        return row.id;
      }

      for (const guide of qualityGuides) {
        const item = plan.find((p) => p.slug === guide.slug);
        if (!item?.coverOk) throw new Error(`Capa inválida: ${guide.slug}`);

        const [existing] = await tx`select id, status, editorial_stage from es_articles where slug = ${guide.slug} limit 1`;
        if (existing && !force) {
          summary.skipped.push({ slug: guide.slug, id: existing.id, status: existing.status, reason: "slug_exists" });
          continue;
        }

        const clusterId = await clusterIdFor(guide.clusterHint);
        const canonical = `${siteUrl}/blog/${guide.slug}`;
        const notes = `${guide.internalNotes || ""} | package=${PACKAGE_ID} | persist=${new Date().toISOString()} | reason=${item.reason}`;

        const row = {
          type: guide.type,
          author_id: author.id,
          pillar_id: pillar.id,
          cluster_id: clusterId,
          title: guide.title,
          subtitle: guide.subtitle,
          slug: guide.slug,
          excerpt: guide.excerpt,
          content_html: guide.contentHtml,
          cover_image_url: item.coverRel,
          cover_image_alt: guide.coverImageAlt,
          cover_image_caption: guide.coverImageCaption,
          cover_image_credit: guide.coverImageCredit,
          cover_image_width: guide.coverImageWidth,
          cover_image_height: guide.coverImageHeight,
          og_image_url: item.coverRel,
          section: guide.section,
          tags: JSON.stringify(guide.tags ?? []),
          source_name: guide.sourceName,
          source_url: guide.sourceUrl,
          sources: JSON.stringify(guide.sources ?? []),
          seo_title: guide.seoTitle,
          meta_description: guide.metaDescription,
          canonical_url: canonical,
          primary_keyword: guide.primaryKeyword,
          search_intent: guide.searchIntent,
          ai_assisted: Boolean(guide.aiAssisted),
          editorial_stage: item.editorialStage,
          direct_answer: guide.directAnswer,
          local_hook: guide.localHook,
          audience: guide.audience,
          candidate_cta: guide.candidateCta,
          internal_notes: notes,
          status: item.status,
          published_at: item.publishedAt,
          scheduled_at: item.scheduledAt,
          // Nunca inventar revisor/reviewedAt
          reviewer_id: null,
          reviewed_at: null,
          internal_link_suggestions: JSON.stringify(guide.relatedSlugs ?? [])
        };

        if (item.status === "SCHEDULED" && (!item.scheduledAt || item.scheduledAt.getTime() <= Date.now())) {
          throw new Error(`scheduledAt inválido/passado para ${guide.slug}`);
        }
        if (item.status === "PUBLISHED" && item.editorialStage === "FACT_REVIEW") {
          throw new Error(`Bloqueio: não publicar FACT_REVIEW (${guide.slug})`);
        }

        if (existing && force) {
          await tx`
            update es_articles set
              type = ${row.type},
              author_id = ${row.author_id},
              pillar_id = ${row.pillar_id},
              cluster_id = ${row.cluster_id},
              title = ${row.title},
              subtitle = ${row.subtitle},
              excerpt = ${row.excerpt},
              content_html = ${row.content_html},
              cover_image_url = ${row.cover_image_url},
              cover_image_alt = ${row.cover_image_alt},
              cover_image_caption = ${row.cover_image_caption},
              cover_image_credit = ${row.cover_image_credit},
              cover_image_width = ${row.cover_image_width},
              cover_image_height = ${row.cover_image_height},
              og_image_url = ${row.og_image_url},
              section = ${row.section},
              tags = ${row.tags}::jsonb,
              source_name = ${row.source_name},
              source_url = ${row.source_url},
              sources = ${row.sources}::jsonb,
              seo_title = ${row.seo_title},
              meta_description = ${row.meta_description},
              canonical_url = ${row.canonical_url},
              primary_keyword = ${row.primary_keyword},
              search_intent = ${row.search_intent},
              ai_assisted = ${row.ai_assisted},
              editorial_stage = ${row.editorial_stage},
              direct_answer = ${row.direct_answer},
              local_hook = ${row.local_hook},
              audience = ${row.audience},
              candidate_cta = ${row.candidate_cta},
              internal_notes = ${row.internal_notes},
              status = ${row.status},
              published_at = ${row.published_at},
              scheduled_at = ${row.scheduled_at},
              reviewer_id = ${row.reviewer_id},
              reviewed_at = ${row.reviewed_at},
              internal_link_suggestions = ${row.internal_link_suggestions}::jsonb,
              updated_at = now()
            where id = ${existing.id}
          `;
          summary.updated.push({ slug: guide.slug, status: row.status });
        } else {
          await tx`
            insert into es_articles (
              type, author_id, pillar_id, cluster_id, title, subtitle, slug, excerpt, content_html,
              cover_image_url, cover_image_alt, cover_image_caption, cover_image_credit,
              cover_image_width, cover_image_height, og_image_url, section, tags,
              source_name, source_url, sources, seo_title, meta_description, canonical_url,
              primary_keyword, search_intent, ai_assisted, editorial_stage, editorial_template,
              direct_answer, local_hook, audience, candidate_cta, internal_notes,
              status, published_at, scheduled_at, reviewer_id, reviewed_at, internal_link_suggestions
            ) values (
              ${row.type}, ${row.author_id}, ${row.pillar_id}, ${row.cluster_id},
              ${row.title}, ${row.subtitle}, ${row.slug}, ${row.excerpt}, ${row.content_html},
              ${row.cover_image_url}, ${row.cover_image_alt}, ${row.cover_image_caption}, ${row.cover_image_credit},
              ${row.cover_image_width}, ${row.cover_image_height}, ${row.og_image_url}, ${row.section}, ${row.tags}::jsonb,
              ${row.source_name}, ${row.source_url}, ${row.sources}::jsonb, ${row.seo_title}, ${row.meta_description}, ${row.canonical_url},
              ${row.primary_keyword}, ${row.search_intent}, ${row.ai_assisted}, ${row.editorial_stage}, 'STANDARD',
              ${row.direct_answer}, ${row.local_hook}, ${row.audience}, ${row.candidate_cta}, ${row.internal_notes},
              ${row.status}, ${row.published_at}, ${row.scheduled_at}, ${row.reviewer_id}, ${row.reviewed_at}, ${row.internal_link_suggestions}::jsonb
            )
          `;
          summary.inserted.push({ slug: guide.slug, status: row.status });
        }

        if (row.status === "PUBLISHED") summary.published.push(guide.slug);
        else if (row.status === "SCHEDULED") summary.scheduled.push(guide.slug);
        else summary.drafts.push(guide.slug);
        if (item.reason === "FACT_REVIEW_HOLD") summary.held.push(guide.slug);
      }

      summary.author = author.name;
      summary.pillar = pillar.name;
    });

    console.log(JSON.stringify({ ok: true, written: true, force, packageId: PACKAGE_ID, summary }, null, 2));
  } catch (error) {
    console.error("Falha na persistência (rollback):", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}
