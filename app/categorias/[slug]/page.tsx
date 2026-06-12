import { permanentRedirect } from "next/navigation";

export default async function LegacyCategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/vagas/categoria/${slug}`);
}
