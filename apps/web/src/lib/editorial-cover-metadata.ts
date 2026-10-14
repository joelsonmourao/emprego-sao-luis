import slLocalCredits from "../../public/covers/sl-local/credits.json";
import adsenseQualityCredits from "../../public/covers/adsense-quality/credits.json";

type RawCoverCredit = {
  slug: string;
  file?: string;
  source?: string;
  credit?: string;
  caption?: string;
  alt?: string;
  licenseStatus?: string;
  licenseBasis?: string;
  width?: number;
  height?: number;
};

export type EditorialCoverMetadata = {
  slug: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
  licenseStatus: "owned";
  licenseBasis: string;
};

const packages = [
  {
    prefix: "/covers/sl-local/",
    width: 1200,
    height: 630,
    credits: slLocalCredits as RawCoverCredit[]
  },
  {
    prefix: "/covers/adsense-quality/",
    width: 1280,
    height: 720,
    credits: adsenseQualityCredits.covers as RawCoverCredit[]
  }
].map((item) => ({
  ...item,
  creditsBySlug: new Map(item.credits.map((credit) => [credit.slug, credit]))
}));

function coverPath(url: string) {
  try {
    return new URL(url, "https://empregossaoluis.com.br").pathname;
  } catch {
    return null;
  }
}

/**
 * Usa metadados de direitos somente quando o arquivo exibido corresponde
 * exatamente ao slug auditado. Em qualquer divergência, preserva o fallback
 * do banco em vez de atribuir autoria/licença a um binário não comprovado.
 */
export function getEditorialCoverMetadata(
  slug: string,
  coverImageUrl?: string | null
): EditorialCoverMetadata | null {
  if (!slug || !coverImageUrl) return null;
  const pathname = coverPath(coverImageUrl);
  if (!pathname) return null;

  for (const item of packages) {
    const expectedPath = `${item.prefix}${slug}.webp`;
    if (pathname !== expectedPath) continue;
    const credit = item.creditsBySlug.get(slug);
    if (
      !credit ||
      credit.source !== "original" ||
      credit.licenseStatus !== "owned" ||
      !credit.alt?.trim() ||
      !credit.caption?.trim() ||
      !credit.credit?.trim() ||
      !credit.licenseBasis?.trim()
    ) {
      return null;
    }

    return {
      slug,
      alt: credit.alt.trim(),
      caption: credit.caption.trim(),
      credit: credit.credit.trim(),
      width: credit.width ?? item.width,
      height: credit.height ?? item.height,
      licenseStatus: "owned",
      licenseBasis: credit.licenseBasis.trim()
    };
  }

  return null;
}
