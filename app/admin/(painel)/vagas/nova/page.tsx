import { prisma } from "@/lib/db";
import { JobAdminForm } from "@/components/admin/job-admin-form";
import { getCompanyAdminOptions } from "@/lib/repositories/jobs";

export default async function NewAdminJobPage() {
  const [states, cities, companies] = await Promise.all([
    prisma.state.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.city.findMany({ include: { state: true }, orderBy: [{ name: "asc" }] }),
    getCompanyAdminOptions()
  ]);

  return (
    <JobAdminForm
      mode="create"
      states={states.map((state) => ({ value: state.slug, label: `${state.name} (${state.code})` }))}
      cities={cities.map((city) => ({ value: city.slug, label: city.name, stateSlug: city.state.slug }))}
      companies={companies.map((company) => ({ value: company.id, label: company.label, stateSlug: company.stateSlug, citySlug: company.citySlug }))}
    />
  );
}
