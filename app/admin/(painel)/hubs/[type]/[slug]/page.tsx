import { HubType } from "@prisma/client";
import { notFound } from "next/navigation";

import { AdminHubProfileForm } from "@/components/admin/admin-hub-profile-form";
import { prisma } from "@/lib/db";
import { getCompanyHubBySlug } from "@/lib/repositories/jobs";
import { getHubProfile } from "@/lib/repositories/hubs";

const typeMap = {
  state: "STATE",
  city: "CITY",
  company: "COMPANY"
} as const;

const typeLabels = {
  state: "estado",
  city: "cidade",
  company: "empresa"
} as const;

async function getHubLabel(type: keyof typeof typeMap, slug: string) {
  if (type === "state") {
    const state = await prisma.state.findUnique({ where: { slug } });
    return state ? state.name : null;
  }

  if (type === "city") {
    const [stateSlug, citySlug] = slug.split("__");
    const city = await prisma.city.findFirst({ where: { slug: citySlug, state: { slug: stateSlug } }, include: { state: true } });
    return city ? `${city.name}, ${city.state.code}` : null;
  }

  const company = await getCompanyHubBySlug(slug);
  return company ? company.name : null;
}

export default async function AdminHubEditPage({
  params
}: {
  params: Promise<{ type: keyof typeof typeMap; slug: string }>;
}) {
  const { type, slug } = await params;
  const hubType = typeMap[type];

  if (!hubType) {
    notFound();
  }

  const [label, profile] = await Promise.all([getHubLabel(type, slug), getHubProfile(hubType as HubType, slug)]);

  if (!label) {
    notFound();
  }

  return (
    <AdminHubProfileForm
      type={type}
      slug={slug}
      label={`Perfil SEO de ${typeLabels[type]}: ${label}`}
      initialValues={{
        title: profile?.title ?? "",
        intro: profile?.intro ?? "",
        contentHtml: profile?.contentHtml ?? "",
        seoTitle: profile?.seoTitle ?? "",
        seoDescription: profile?.seoDescription ?? "",
        canonicalUrl: profile?.canonicalUrl ?? "",
        socialImageUrl: profile?.socialImageUrl ?? "",
        noIndex: profile?.noIndex ?? false
      }}
    />
  );
}
