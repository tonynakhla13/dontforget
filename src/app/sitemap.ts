import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { canonicalPath, CORE_PAGES, SITE_URL } from "@/lib/site-routing";
import { getPosts, getProjects, getServices } from "@/lib/public-content";

/**
 * Only the "focused" theme is emitted here — it is the canonical version of every
 * page (see generateMetadata in [[...tail]]/page.tsx). creative/immersive stay
 * crawlable but are never listed, so ranking signals consolidate on one URL per page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({ url: `${SITE_URL}${canonicalPath(locale, [])}` });
    for (const page of CORE_PAGES) {
      if (page === "request") continue; // duplicates the contact page
      entries.push({ url: `${SITE_URL}${canonicalPath(locale, [page])}` });
    }

    const [projects, services, posts] = await Promise.all([
      getProjects(locale),
      getServices(locale),
      getPosts(locale),
    ]);

    for (const project of projects) {
      entries.push({ url: `${SITE_URL}${canonicalPath(locale, ["work", project.slug])}` });
    }
    for (const service of services) {
      entries.push({ url: `${SITE_URL}${canonicalPath(locale, ["services", service.id])}` });
    }
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${canonicalPath(locale, ["blog", post.slug])}`,
        ...(post.publishedAt && { lastModified: post.publishedAt }),
      });
    }
  }

  return entries;
}
