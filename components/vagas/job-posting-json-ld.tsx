import { buildJobPostingJsonLd, stringifyJobPostingJsonLd, type JobPostingJsonLdInput } from "@/lib/seo/json-ld";

/** Server Component: emite um único script `application/ld+json` de JobPosting no HTML inicial. */
export async function JobPostingJsonLd({ input }: { input: JobPostingJsonLdInput }) {
  const ld = await buildJobPostingJsonLd(input);
  if (!ld) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJobPostingJsonLd(ld) }} />;
}
