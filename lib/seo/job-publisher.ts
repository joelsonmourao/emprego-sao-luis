const BASE_JOB_PUBLISHER_NAME = "Jovem Aprendiz Vagas";

export function buildJobPublisherName(city?: string | null, uf?: string | null) {
  const cleanCity = city?.trim().replace(/\s+/g, " ");
  const cleanUf = uf?.trim().toUpperCase();

  if (!cleanCity || !cleanUf) {
    return BASE_JOB_PUBLISHER_NAME;
  }

  return `${BASE_JOB_PUBLISHER_NAME} ${cleanCity} ${cleanUf}`;
}

