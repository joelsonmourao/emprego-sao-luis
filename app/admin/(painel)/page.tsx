import Link from "next/link";
import { BriefcaseBusiness, Newspaper, FileSpreadsheet, ArrowRight, Network, Building2, LineChart, ChartNoAxesCombined } from "lucide-react";

import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [jobsCount, activeJobsCount, postsCount, publishedPostsCount, companiesCount] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.company.count()
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Vagas totais", value: jobsCount, hint: `${activeJobsCount} ativa(s)`, icon: BriefcaseBusiness },
          { label: "Posts totais", value: postsCount, hint: `${publishedPostsCount} publicado(s)`, icon: Newspaper },
          { label: "Empresas", value: companiesCount, hint: "Base relacional das vagas", icon: Building2 },
          { label: "Importacoes", value: "Excel", hint: "Fluxo com preview", icon: FileSpreadsheet },
          { label: "Integracoes", value: "Google", hint: "Analytics, Search Console e AdSense", icon: LineChart },
          { label: "Banco", value: "Prisma", hint: "PostgreSQL conectado", icon: ArrowRight }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="rounded-[2rem] border-slate-200 bg-white/95">
              <CardContent className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.hint}</p>
                </div>
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Gerenciar vagas</CardTitle>
            <CardDescription>Cadastre, edite, ative ou desative vagas manualmente.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Fluxo preparado para SEO, filtros e Google Jobs nas paginas publicas.</p>
            <Button asChild>
              <Link href="/admin/vagas">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Gerenciar empresas</CardTitle>
            <CardDescription>Cadastre perfis reais de empresas e use essa base nas vagas.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Logo, site, cidade principal e pagina publica da empresa.</p>
            <Button asChild>
              <Link href="/admin/empresas">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Gerenciar blog</CardTitle>
            <CardDescription>Crie conteudo editorial para fortalecer clusters organicos.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Posts com SEO proprio, categorias e publicacao/rascunho.</p>
            <Button asChild>
              <Link href="/admin/blog">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Importar Excel</CardTitle>
            <CardDescription>Leia planilhas, valide colunas e salve apenas linhas validas.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Atualizacao por slug ou identificador externo quando houver.</p>
            <Button asChild>
              <Link href="/admin/importacao">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Estrutura do portal</CardTitle>
            <CardDescription>Gerencie estados e cidades para manter a base organizada.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Ajuste slugs, textos curtos e hubs principais sem sair do painel.</p>
            <Button asChild>
              <Link href="/admin/estrutura">
                <Network className="mr-2 h-4 w-4" />
                Abrir
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Integracoes Google</CardTitle>
            <CardDescription>Cookies, consentimento, GA4, GTM, Search Console e AdSense.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Deixe o portal pronto para publicar e medir resultados reais.</p>
            <Button asChild>
              <Link href="/admin/integracoes">
                <LineChart className="mr-2 h-4 w-4" />
                Abrir
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Painel de acompanhamento</CardTitle>
            <CardDescription>Resumo nativo de page views, buscas e cliques principais.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Use junto com Looker Studio e Search Console para evoluir SEO e performance.</p>
            <Button asChild>
              <Link href="/admin/analytics">
                <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                Abrir
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
