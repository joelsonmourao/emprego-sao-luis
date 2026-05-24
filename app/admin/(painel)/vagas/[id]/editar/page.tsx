import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { JobAdminForm } from "@/components/admin/job-admin-form";
import { getCompanyAdminOptions } from "@/lib/repositories/jobs";
import { formatBrazilDateTime } from "@/lib/date-utils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAdminJobPage({ params }: Props) {
  const { id } = await params;

  const [job, states, cities, companies] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: { state: true, city: true, company: true }
    }),
    prisma.state.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.city.findMany({ include: { state: true }, orderBy: [{ name: "asc" }] }),
    getCompanyAdminOptions()
  ]);

  if (!job) {
    notFound();
  }

  return (
    <JobAdminForm
      mode="edit"
      jobId={job.id}
      initialValues={{
        title: job.title,
        slug: job.slug,
        companyId: job.companyId ?? "",
        heroImageUrl: job.heroImageUrl ?? "",
        stateSlug: job.state.slug,
        citySlug: job.city.slug,
        locationType: job.locationType,
        employmentType: job.employmentType,
        summary: job.summary,
        descriptionHtml: job.descriptionHtml,
        requirementsText: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
        benefitsText: Array.isArray(job.benefits) ? job.benefits.join("\n") : "",
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        workHours: job.workHours ?? "",
        applyUrl: job.applyUrl,
        expiresAt: job.expiresAt ? job.expiresAt.toISOString().slice(0, 10) : "",
        seoTitle: job.seoTitle ?? "",
        seoDescription: job.seoDescription ?? "",
        featured: job.featured,
        isActive: job.isActive,
        status: job.status,
        scheduledAt: job.scheduledAt ? formatBrazilDateTime(job.scheduledAt) : "",
        autoSubmitToIndexing: job.autoSubmitToIndexing
      }}
      states={states.map((state) => ({ value: state.slug, label: `${state.name} (${state.code})` }))}
      cities={cities.map((city) => ({ value: city.slug, label: city.name, stateSlug: city.state.slug }))}
      companies={companies.map((company) => ({ value: company.id, label: company.label, stateSlug: company.stateSlug, citySlug: company.citySlug }))}
    />
  );
}
