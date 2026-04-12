import Link from "next/link";

import { SiteIntegrationsForm } from "@/components/admin/site-integrations-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEditableSiteSettings } from "@/lib/admin/site";
import { requireRole } from "@/lib/authz";

export default async function AdminIntegrationsPage() {
  await requireRole("ADMIN");
  const settings = await getEditableSiteSettings();

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Integracoes de publicacao e mensuracao</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm text-slate-600">
          <p>Configure cookies, Google Analytics, Tag Manager, Search Console, AdSense e links para dashboards externos.</p>
          <Button asChild variant="outline">
            <Link href="/admin/analytics">Abrir painel de acompanhamento</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/publicacao">Checklist de publicacao</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/politica-de-cookies" target="_blank">
              Ver politica de cookies
            </Link>
          </Button>
        </CardContent>
      </Card>

      <SiteIntegrationsForm initialValues={settings} />
    </div>
  );
}
