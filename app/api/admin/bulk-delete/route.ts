import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { bulkDeleteCompanies } from "@/lib/admin/companies";
import { bulkDeleteJobs } from "@/lib/admin/jobs";
import { bulkDeleteTaxonomyEntries } from "@/lib/admin/taxonomies";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { revalidatePublicSurfacesAfterBulkJobChange } from "@/lib/public-revalidate";
import { bulkDeleteSchema } from "@/lib/schemas/taxonomy-admin";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  try {
    const session = await requireApiRole("ADMIN");
    const payload = bulkDeleteSchema.parse(await request.json());

    const results =
      payload.resource === "jobs"
        ? await bulkDeleteJobs(payload.ids)
        : payload.resource === "companies"
          ? await bulkDeleteCompanies(payload.ids)
          : await bulkDeleteTaxonomyEntries(payload.resource, payload.ids);

    const deletedItems = results.filter((item) => item.deleted);
    const errors = results.filter((item) => !item.deleted).map((item) => ({
      id: item.id,
      error: item.error ?? "Nao foi possivel excluir."
    }));
    const totals = deletedItems.reduce(
      (accumulator, item) => {
        accumulator.jobsDeleted += item.summary?.jobsDeleted ?? 0;
        accumulator.companiesDeleted += item.summary?.companiesDeleted ?? 0;
        accumulator.citiesDeleted += item.summary?.citiesDeleted ?? 0;
        accumulator.statesDeleted += item.summary?.statesDeleted ?? 0;
        accumulator.hubProfilesDeleted += item.summary?.hubProfilesDeleted ?? 0;
        return accumulator;
      },
      {
        jobsDeleted: 0,
        companiesDeleted: 0,
        citiesDeleted: 0,
        statesDeleted: 0,
        hubProfilesDeleted: 0
      }
    );

    if (payload.resource === "jobs" && deletedItems.length) {
      revalidatePublicSurfacesAfterBulkJobChange();
    }

    for (const item of deletedItems) {
      const label = "title" in item ? item.title : "name" in item ? item.name : null;
      await writeAuditLog({
        actorId: session.sub,
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: AuditAction.DELETE,
        entityType: payload.resource,
        entityId: item.id,
        entityLabel: label ?? null,
        summary: `${payload.resource} excluido em massa`
      });
    }

    return NextResponse.json({
      ok: true,
      deletedCount: deletedItems.length,
      deletedIds: deletedItems.map((item) => item.id),
      errors,
      totals
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir os itens selecionados.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
