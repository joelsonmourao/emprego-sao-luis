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

export type OwnedEditorialCoverImageObject = {
  "@type": "ImageObject";
  contentUrl: string;
  url: string;
  width: number;
  height: number;
  caption: string;
  creditText: string;
  creator: { "@type": "Organization"; name: string; url: string };
  copyrightHolder: { "@type": "Organization"; name: string; url: string };
  copyrightNotice: string;
};

const PORTAL_ORGANIZATION = {
  "@type": "Organization" as const,
  name: "Empregos São Luís",
  url: "https://empregossaoluis.com.br/"
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


/**
 * Publica autoria no JSON-LD somente após o arquivo passar pela validação
 * de slug, caminho e titularidade de getEditorialCoverMetadata.
 */
export function buildOwnedEditorialCoverImageObject(
  metadata: EditorialCoverMetadata | null,
  contentUrl?: string | null
): OwnedEditorialCoverImageObject | null {
  if (!metadata || !contentUrl) return null;
  try {
    const parsed = new URL(contentUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    "@type": "ImageObject",
    contentUrl,
    url: contentUrl,
    width: metadata.width,
    height: metadata.height,
    caption: metadata.caption,
    creditText: metadata.credit,
    creator: PORTAL_ORGANIZATION,
    copyrightHolder: PORTAL_ORGANIZATION,
    copyrightNotice: "© Empregos São Luís"
  };
}
