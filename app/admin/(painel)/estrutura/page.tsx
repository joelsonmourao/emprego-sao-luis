import { prisma } from "@/lib/db";
import { AdminStructureManager } from "@/components/admin/admin-structure-manager";

export default async function AdminStructurePage() {
  const [states, cities] = await Promise.all([
    prisma.state.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        _count: {
          select: { cities: true, jobs: true }
        }
      }
    }),
    prisma.city.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        state: true,
        _count: {
          select: { jobs: true }
        }
      }
    })
  ]);

  return (
    <AdminStructureManager
      initialStates={states.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        slug: item.slug,
        seoTitle: item.seoTitle ?? "",
        seoIntro: item.seoIntro ?? "",
        jobCount: item._count.jobs,
        cityCount: item._count.cities
      }))}
      initialCities={cities.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        stateId: item.stateId,
        stateName: item.state.name,
        stateCode: item.state.code,
        stateSlug: item.state.slug,
        seoTitle: item.seoTitle ?? "",
        seoIntro: item.seoIntro ?? "",
        jobCount: item._count.jobs
      }))}
    />
  );
}
