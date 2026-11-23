import type { APIRoute } from "astro";
import { getBrandIdentity } from "../../lib/brand/identity-service";
import { BRAND_ASSET_KEYS } from "../../lib/brand/constants";
import { siteBaseUrl } from "../../lib/brand/storage";

export const GET: APIRoute = async () => {
  const identity = await getBrandIdentity();
  const icon192 = identity.assets[BRAND_ASSET_KEYS.PWA_192]?.url ?? `${siteBaseUrl()}/icon-192.png`;
  const icon512 = identity.assets[BRAND_ASSET_KEYS.PWA_512]?.url ?? `${siteBaseUrl()}/icon-512.png`;
  const manifest = {
    name: identity.siteName,
    short_name: identity.siteName,
    icons: [
      { src: icon192, sizes: "192x192", type: "image/png" },
      { src: icon512, sizes: "512x512", type: "image/png" }
    ],
    theme_color: identity.palette.themeColor,
    background_color: identity.palette.brandSurface,
    display: "standalone"
  };
  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=300"
    }
  });
};
