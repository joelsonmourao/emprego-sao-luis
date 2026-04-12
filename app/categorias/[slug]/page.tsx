import { permanentRedirect } from "next/navigation";

export default async function LegacyCategoryPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  if (typeof raw.q === "string") params.set("q", raw.q);
  const query = params.toString();
  permanentRedirect(query ? `/vagas?${query}` : "/vagas");
}
