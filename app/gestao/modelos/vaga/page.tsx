import { EditorShell } from "@/components/editor-shell";
import { JobEditorFields } from "@/components/forms/job-editor-fields";
import { JobCard } from "@/components/job-card";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCities, getStates } from "@/lib/repositories/geo";
import { getCompanyAdminOptions, getRecentJobs } from "@/lib/repositories/jobs";

export const metadata = buildMetadata({
  title: "Modelo de cadastro de vaga",
    description: "Página de preparação para o futuro painel admin de vagas.",
  pathname: "/gestao/modelos/vaga",
  noIndex: true
});

export default async function JobModelPage() {
  const [states, cities, companies, recentJobs] = await Promise.all([getStates(), getCities(), getCompanyAdminOptions(), getRecentJobs()]);

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <EditorShell
        eyebrow="Estrutura futura"
        title="Modelo de cadastro manual de vaga"
        description="Os campos ja estao organizados para integrar com admin, server actions, validacao Zod e persistencia em Prisma sem redesenhar o fluxo depois."
      >
        <JobEditorFields
          states={states.map((state) => ({ label: state.name, value: state.slug }))}
          cities={cities.map((city) => ({ label: `${city.name}, ${city.state.code}`, value: city.slug }))}
          companies={companies.map((company) => ({ label: company.name, value: company.id }))}
        />
      </EditorShell>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-chip rounded-[2rem] p-6">
          <h2 className="text-2xl font-black text-slate-950">Como este modelo evolui para CRUD real</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <li>• Campos alinhados com Prisma, Zod e metadata SEO.</li>
            <li>• Estrutura pronta para server actions ou painel autenticado.</li>
            <li>• Base para preview, autosave, editor rico e publicacao.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-950">Preview basico de card de vaga</h2>
          {recentJobs.slice(0, 1).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
