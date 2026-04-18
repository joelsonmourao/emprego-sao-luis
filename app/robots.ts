import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sitemaps/*.xml"],
      disallow: ["/admin", "/api/admin", "/api/internal"]
    },
    sitemap: `${baseUrl}/sitemaps/index.xml`
  };
}
