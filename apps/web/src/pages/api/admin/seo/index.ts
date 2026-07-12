import type { APIRoute } from "astro";
import { auditLogs, createDatabase } from "@es/db";
import { mergeSeoSettings, seoSettingsSchema } from "@es/seo";
import { can } from "../../../../lib/auth";
import { getSeoSettings, saveSeoSettings } from "../../../../lib/seo-settings";

export const GET: APIRoute = async ({ locals }) => {
  if (!can(locals.auth!, "seo.manage")) return new Response("Proibido", { status: 403 });
  return Response.json(await getSeoSettings());
};

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "seo.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });
  const form = await request.formData();
  const before = await getSeoSettings();
  const parsed = seoSettingsSchema.safeParse({
    ...before,
    defaultTitle: String(form.get("defaultTitle") ?? before.defaultTitle).trim(),
    defaultDescription: String(form.get("defaultDescription") ?? before.defaultDescription).trim(),
    robotsDefault: String(form.get("robotsDefault") ?? before.robotsDefault).trim(),
    og: { ...before.og, siteName: String(form.get("ogSiteName") ?? before.og.siteName).trim(), type: String(form.get("ogType") ?? before.og.type).trim(), image: String(form.get("ogImage") ?? before.og.image).trim(), locale: String(form.get("ogLocale") ?? before.og.locale).trim() },
    twitter: { ...before.twitter, card: String(form.get("twitterCard") ?? before.twitter.card).trim(), site: String(form.get("twitterSite") ?? before.twitter.site).trim(), creator: String(form.get("twitterCreator") ?? before.twitter.creator).trim() },
    organization: { ...before.organization, name: String(form.get("organizationName") ?? before.organization.name).trim(), url: String(form.get("organizationUrl") ?? before.organization.url).trim(), logo: String(form.get("organizationLogo") ?? before.organization.logo).trim(), sameAs: String(form.get("organizationSameAs") ?? before.organization.sameAs.join("\n")).split("\n").map((line) => line.trim()).filter(Boolean) },
    contentTypes: {
      ...before.contentTypes,
      jobs: { ...before.contentTypes.jobs, titleSuffix: String(form.get("jobsTitleSuffix") ?? before.contentTypes.jobs.titleSuffix).trim(), descriptionTemplate: String(form.get("jobsDescriptionTemplate") ?? before.contentTypes.jobs.descriptionTemplate).trim(), robots: String(form.get("jobsRobots") ?? before.contentTypes.jobs.robots).trim() }
    },
    instagram: { profileUrl: String(form.get("instagramProfileUrl") ?? before.instagram.profileUrl).trim(), bioLinks: String(form.get("instagramBioLinks") ?? before.instagram.bioLinks.map((link: { label: string; href: string }) => `${link.label}|${link.href}`).join("\n")).split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [label, href] = line.split("|").map((part) => part.trim()); return label && href ? { label, href } : null; }).filter((item): item is { label: string; href: string } => Boolean(item)) }
  });
  if (!parsed.success) return new Response("Configuração SEO inválida", { status: 400 });
  const value = mergeSeoSettings(parsed.data);
  await saveSeoSettings(value);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "SEO_SETTINGS_UPDATE", entityType: "SETTINGS", entityId: "seo_settings", before, after: { record: value, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
  } finally {
    await connection.close();
  }
  return redirect("/admin/seo?saved=1", 303);
};
