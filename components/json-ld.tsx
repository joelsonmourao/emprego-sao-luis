type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Evita `</script>` em conteúdo embutido (recomendação Next.js para JSON-LD). */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
