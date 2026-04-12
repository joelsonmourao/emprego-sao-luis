import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { CompanyAdminForm } from "@/components/admin/company-admin-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAdminCompanyPage({ params }: Props) {
  const { id } = await params;

  const [company, states, cities] = await Promise.all([
    prisma.company.findUnique({
      where: { id },
      include: { state: true, city: true }
    }),
    prisma.state.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.city.findMany({ include: { state: true }, orderBy: [{ name: "asc" }] })
  ]);

  if (!company) notFound();

  return (
    <CompanyAdminForm
      mode="edit"
      companyId={company.id}
      initialValues={{
        name: company.name,
        slug: company.slug,
        logoUrl: company.logoUrl ?? "",
        websiteUrl: company.websiteUrl ?? "",
        socialImageUrl: company.socialImageUrl ?? "",
        stateSlug: company.state.slug,
        citySlug: company.city.slug,
        summary: company.summary ?? "",
        descriptionHtml: company.descriptionHtml ?? "",
        seoTitle: company.seoTitle ?? "",
        seoDescription: company.seoDescription ?? "",
        featured: company.featured,
        isActive: company.isActive
      }}
      states={states.map((state) => ({ value: state.slug, label: `${state.name} (${state.code})` }))}
      cities={cities.map((city) => ({ value: city.slug, label: city.name, stateSlug: city.state.slug }))}
    />
  );
}
