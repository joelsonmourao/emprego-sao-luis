import { JobUnavailableView } from "@/components/vagas/job-unavailable-view";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildSiteMetadata({
    title: "Vaga removida definitivamente",
    description: "A vaga solicitada foi removida definitivamente. Veja oportunidades atualizadas no portal.",
    pathname: `/vagas/indisponivel/${slug}`,
    noIndex: true
  });
}

export default async function RemovedJobPage() {
  return (
    <JobUnavailableView
      title="Vaga removida definitivamente"
      description="Esta vaga foi removida definitivamente e não será reativada. Use os atalhos para continuar sua busca por vagas ativas."
      relatedJobs={[]}
    />
  );
}
