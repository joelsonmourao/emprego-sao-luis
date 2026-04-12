import { prisma } from "@/lib/db";
import { CompanyAdminForm } from "@/components/admin/company-admin-form";

export default async function NewAdminCompanyPage() {
  const [states, cities] = await Promise.all([
    prisma.state.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.city.findMany({ include: { state: true }, orderBy: [{ name: "asc" }] })
  ]);

  return (
    <CompanyAdminForm
      mode="create"
      states={states.map((state) => ({ value: state.slug, label: `${state.name} (${state.code})` }))}
      cities={cities.map((city) => ({ value: city.slug, label: city.name, stateSlug: city.state.slug }))}
    />
  );
}
