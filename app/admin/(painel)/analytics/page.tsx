import Link from "next/link";

import { requireRole } from "@/lib/authz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAnalyticsOverview } from "@/lib/admin/analytics";
import { getEditableSiteSettings } from "@/lib/admin/site";

function StatList({
  title,
  description,
  items,
  emptyLabel
}: {
  title: string;
  description: string;
  items: Array<{ label: string; value: number | string }>;
  emptyLabel: string;
}) {
  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
              <span className="truncate text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">{emptyLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminAnalyticsPage() {
  await requireRole("EDITOR");
  const [overview, settings] = await Promise.all([getAnalyticsOverview(), getEditableSiteSettings()]);

  const recentSearches = overview.topSearches.slice(0, 8).map((entry) => ({
    label: entry.query,
    value: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(entry.createdAt)
  }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Eventos nos ultimos 30 dias", value: overview.totals, hint: "Base nativa do portal" },
          { label: "Page views", value: overview.pageViews, hint: "Depois do consentimento" },
          { label: "Buscas internas", value: overview.searches, hint: "Usuarios que usaram a busca" },
          { label: "Cliques em vaga", value: overview.jobClicks, hint: "Interesse nas listagens" },
          { label: "Taxa de candidatura", value: `${overview.applyRate}%`, hint: "Apply clicks / job clicks" }
        ].map((item) => (
          <Card key={item.label} className="rounded-[2rem] border-slate-200 bg-white/95">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Nativo no admin x dados do Google</CardTitle>
          <CardDescription>
            Este painel resume dados coletados pelo proprio portal depois do consentimento. Impressoes, cliques organicos, CTR, posicao media e consultas do Google continuam melhores no Search Console e no Looker Studio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/integracoes">Configurar integracoes</Link>
          </Button>
          {settings.google.ga4ReportsUrl ? (
            <Button asChild variant="outline">
              <a href={settings.google.ga4ReportsUrl} target="_blank" rel="noreferrer">
                Abrir relatorios do GA4
              </a>
            </Button>
          ) : null}
          {settings.google.searchConsoleReportsUrl ? (
            <Button asChild variant="outline">
              <a href={settings.google.searchConsoleReportsUrl} target="_blank" rel="noreferrer">
                Abrir Search Console
              </a>
            </Button>
          ) : null}
          {settings.google.lookerStudioUrl ? (
            <Button asChild variant="outline">
              <a href={settings.google.lookerStudioUrl} target="_blank" rel="noreferrer">
                Abrir Looker Studio
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <StatList
          title="Paginas mais acessadas"
          description="Page views rastreados localmente."
          items={overview.topPages.map((item) => ({ label: item.path, value: item._count._all }))}
          emptyLabel="Ainda nao ha page views suficientes para mostrar aqui."
        />
        <StatList
          title="Top vagas"
          description="Paginas de vaga com mais visitas."
          items={overview.topJobs.map((item) => ({ label: item.entitySlug ?? "-", value: item._count._all }))}
          emptyLabel="As vagas mais acessadas aparecem aqui conforme o trafego cresce."
        />
        <StatList
          title="Top posts"
          description="Posts do blog com mais visitas."
          items={overview.topPosts.map((item) => ({ label: item.entitySlug ?? "-", value: item._count._all }))}
          emptyLabel="Os posts mais acessados aparecem aqui conforme o blog ganha trafego."
        />
        <StatList
          title="Origens de trafego"
          description="Origem aproximada por UTM ou referrer."
          items={overview.topSources.map((item) => ({ label: item.source ?? "Direto", value: item._count._all }))}
          emptyLabel="As origens vao aparecer quando o portal receber trafego."
        />
        <StatList
          title="Dominios de referencia"
          description="Sites que mais enviam visitas para o portal."
          items={overview.topReferrers.map((item) => ({ label: item.referrerHost ?? "-", value: item._count._all }))}
          emptyLabel="Os dominios de referencia aparecem quando houver trafego de fora."
        />
        <StatList
          title="Mediums"
          description="Classificacao aproximada do trafego."
          items={overview.topMediums.map((item) => ({ label: item.medium ?? "-", value: item._count._all }))}
          emptyLabel="Os mediums aparecem quando houver UTM ou referrals suficientes."
        />
        <StatList
          title="Dispositivos"
          description="Celular, desktop e tablet."
          items={overview.topDevices.map((item) => ({ label: item.deviceType ?? "Outro", value: item._count._all }))}
          emptyLabel="Os dispositivos serao preenchidos com mais navegacao."
        />
        <StatList
          title="Navegadores"
          description="Visao resumida dos navegadores mais usados."
          items={overview.topBrowsers.map((item) => ({ label: item.browser ?? "Outro", value: item._count._all }))}
          emptyLabel="Os navegadores serao preenchidos conforme chegarem novos acessos."
        />
        <StatList
          title="Sistemas operacionais"
          description="Windows, Android, iOS e outros."
          items={overview.topSystems.map((item) => ({ label: item.os ?? "Outro", value: item._count._all }))}
          emptyLabel="Os sistemas operacionais serao preenchidos conforme o portal recebe acessos."
        />
        <StatList
          title="Buscas internas recentes"
          description="Ultimas consultas feitas na busca do portal."
          items={recentSearches}
          emptyLabel="As buscas feitas no portal vao aparecer aqui."
        />
        <StatList
          title="Eventos principais"
          description="Resumo de page views, busca, vaga, blog e candidatura."
          items={overview.eventCounts.map((item) => ({ label: item.eventName, value: item._count._all }))}
          emptyLabel="Os eventos vao aparecer aqui depois das primeiras visitas."
        />
        <StatList
          title="Atencao operacional"
          description="Indicadores para acompanhar nas primeiras semanas."
          items={[
            { label: "Page views", value: overview.pageViews },
            { label: "Buscas", value: overview.searches },
            { label: "Cliques em vaga", value: overview.jobClicks },
            { label: "Cliques em candidatura", value: overview.applyClicks },
            { label: "Cliques em blog", value: overview.blogClicks }
          ]}
          emptyLabel="Os indicadores principais vao aparecer conforme o portal receber trafego real."
        />
      </div>
    </div>
  );
}

