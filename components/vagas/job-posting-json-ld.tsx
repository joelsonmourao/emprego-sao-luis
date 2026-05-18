import { buildJobPostingJsonLd, stringifyJobPostingJsonLd, type JobPostingJsonLdInput } from "@/lib/seo/json-ld";

/** Server Component: emite um único JobPosting JSON-LD no `<head>` da página individual da vaga. */
export function JobPostingJsonLd({ input }: { input: JobPostingJsonLdInput }) {
  const ld = buildJobPostingJsonLd(input);
  if (!ld) return null;

  return (
    <head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJobPostingJsonLd(ld) }} />
    </head>
  );
}
