import { permanentRedirect } from "next/navigation";

import { getCityJobsPath } from "@/lib/seo/jobs-pages";

export default async function LegacyCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  permanentRedirect(getCityJobsPath(city));
}
