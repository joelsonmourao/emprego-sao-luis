import Link from "next/link";

import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEditableSiteContent, getEditableSiteSettings } from "@/lib/admin/site";
import { requireRole } from "@/lib/authz";

export default async function AdminSitePage() {
  await requireRole("ADMIN");
  const [settings, content] = await Promise.all([getEditableSiteSettings(), getEditableSiteContent()]);

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Controle do site</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm text-slate-600">
          <p>Edite marca, contatos, home, menu, FAQ e paginas institucionais sem depender de codigo.</p>
          <Button asChild variant="outline">
            <Link href="/admin/midia">Abrir biblioteca de midia</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/empresas">Gerenciar empresas</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/hubs">Editar hubs</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/estrutura">Abrir estados e cidades</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/logs">Ver logs</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/integracoes">Integracoes Google</Link>
          </Button>
        </CardContent>
      </Card>

      <SiteSettingsForm initialValues={settings} />
      <SiteContentForm initialValues={content} />
    </div>
  );
}
