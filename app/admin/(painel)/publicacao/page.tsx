import Link from "next/link";

import { requireRole } from "@/lib/authz";
import { getProductionReadiness } from "@/lib/admin/production";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function StatusRow({
  label,
  ok,
  hint
}: {
  label: string;
  ok: boolean;
  hint: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{hint}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {ok ? "Pronto" : "Pendente"}
      </span>
    </div>
  );
}

export default async function AdminPublicationPage() {
  await requireRole("ADMIN");
  const readiness = await getProductionReadiness();

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Central de publicacao</CardTitle>
          <CardDescription>
            Aqui fica o resumo do que falta para colocar o portal no ar com HTTPS, mensuracao, consentimento, Search Console e AdSense.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm text-slate-600">
          <Button asChild>
            <Link href="/admin/integracoes">Abrir integracoes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/analytics">Abrir analytics</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="/sitemap.xml" target="_blank" rel="noreferrer">
              Ver sitemap
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/ads.txt" target="_blank" rel="noreferrer">
              Ver ads.txt
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Status de producao</CardTitle>
            <CardDescription>Checklist tecnico para staging e dominio final.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusRow label="URL publica configurada" ok={!readiness.isLocal} hint={`URL atual: ${readiness.siteUrl}`} />
            <StatusRow label="HTTPS pronto" ok={readiness.isHttps} hint="Login, cookies seguros e integracoes Google ficam corretos em dominio com HTTPS." />
            <StatusRow label="AUTH_SECRET forte" ok={readiness.hasStrongAuthSecret} hint="Troque o segredo padrao por uma chave longa e unica antes de publicar." />
            <StatusRow label="Banner de cookies ativo" ok={readiness.consentEnabled} hint="O consentimento aparece antes de liberar Analytics e publicidade." />
            <StatusRow label="Consent Mode ativo" ok={readiness.googleConsentMode} hint="Mantem GA e anuncios bloqueados ate o consentimento do visitante." />
            <StatusRow label="GA4 configurado" ok={readiness.gaConfigured} hint="Measurement ID preenchido para Analytics 4." />
            <StatusRow label="Search Console configurado" ok={readiness.searchConsoleConfigured} hint="Token de verificacao salvo para monitorar indexacao e desempenho organico." />
            <StatusRow label="AdSense pronto" ok={readiness.adsenseConfigured && readiness.adsTxtConfigured} hint="Publisher ID e ads.txt prontos para aprovacao e anuncios." />
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Checklist de ir ao ar</CardTitle>
            <CardDescription>Passos praticos para staging, producao e monitoramento inicial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <ol className="space-y-3 list-decimal pl-5">
              <li>Defina o dominio final com HTTPS e atualize <code>NEXT_PUBLIC_SITE_URL</code>.</li>
              <li>Revise integracoes em <Link href="/admin/integracoes" className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">/admin/integracoes</Link>.</li>
              <li>Valide <a href="/robots.txt" target="_blank" rel="noreferrer" className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">robots.txt</a>, <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">sitemap.xml</a> e <a href="/ads.txt" target="_blank" rel="noreferrer" className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">ads.txt</a>.</li>
              <li>Confirme o banner de cookies e o aceite em desktop e celular.</li>
              <li>Cadastre a propriedade no Search Console e envie o sitemap.</li>
              <li>Abra o painel de analytics para conferir se page views, buscas e cliques estao sendo coletados.</li>
              <li>Monitore logs do admin, Search Console e GA4 nos primeiros dias.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
