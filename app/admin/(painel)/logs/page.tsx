import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/authz";
import { formatDate } from "@/lib/utils";

export default async function AdminLogsPage() {
  await requireRole("ADMIN");
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 80
  });

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Trilha de auditoria</CardTitle>
          <CardDescription>
            Veja quem criou, editou, excluiu, importou ou entrou no painel. Isso ajuda a manter o controle do que mudou no site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logs.length ? (
            <div className="grid gap-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {log.actorName ?? log.actorEmail ?? "Sistema"} - {log.action}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.entityType} {log.entityLabel ? `- ${log.entityLabel}` : ""} {log.actorRole ? `· ${log.actorRole}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  {log.summary ? <p className="mt-3 text-sm leading-6 text-slate-600">{log.summary}</p> : null}
                  {(log.before || log.after) ? (
                    <details className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                      <summary className="cursor-pointer font-semibold text-slate-700">Ver alteracoes</summary>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div>
                          <p className="font-semibold text-slate-700">Antes</p>
                          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3">{JSON.stringify(log.before, null, 2) || "-"}</pre>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Depois</p>
                          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3">{JSON.stringify(log.after, null, 2) || "-"}</pre>
                        </div>
                      </div>
                    </details>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
              Ainda nao existem logs gravados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
