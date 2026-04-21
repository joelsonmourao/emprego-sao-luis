import { permanentRedirect } from "next/navigation";

import { getCompanyJobsPath } from "@/lib/seo/jobs-pages";

export default async function LegacyCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getCompanyJobsPath(slug));
}
