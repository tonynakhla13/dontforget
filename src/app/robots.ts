import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-routing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/*", "/login", "/setup"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
