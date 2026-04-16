import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { bulkDeleteCompanies } from "@/lib/admin/companies";
import { bulkDeleteJobs } from "@/lib/admin/jobs";
import { bulkDeleteTaxonomyEntries } from "@/lib/admin/taxonomies";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { bulkDeleteSchema } from "@/lib/schemas/taxonomy-admin";

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
      errors
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir os itens selecionados.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
