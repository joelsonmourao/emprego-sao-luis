import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sitemap.xml", "/sitemaps/"],
      disallow: ["/admin", "/api/admin", "/api/internal"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
