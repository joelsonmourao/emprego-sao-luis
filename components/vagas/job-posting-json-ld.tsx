import { buildJobPostingJsonLd, stringifyJobPostingJsonLd, type JobPostingJsonLdInput } from "@/lib/seo/json-ld";

/** Server Component: emite um único script `application/ld+json` de JobPosting na página individual da vaga. */
export function JobPostingJsonLd({ input }: { input: JobPostingJsonLdInput }) {
  const ld = buildJobPostingJsonLd(input);
  if (!ld) return null;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJobPostingJsonLd(ld) }} />;
}
