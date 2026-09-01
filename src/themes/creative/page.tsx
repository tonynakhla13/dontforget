import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import { getProjects as getPublicProjects } from "@/lib/public-content";
import CreativeHero from "@/components/creative/CreativeHero";
import CreativeAboutUs from "@/components/creative/CreativeAboutUs";
import CreativeServices, { type CreativeHomeService } from "@/components/creative/CreativeServices";
import CreativePortfolio, { type CreativeHomeProject } from "@/components/creative/CreativePortfolio";
import CreativeProcess from "@/components/creative/CreativeProcess";
import CreativeMusts from "@/components/creative/CreativeMusts";
import CreativeCTA1 from "@/components/creative/CreativeCTA1";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeHomeBlog, { type HomeBlogPost } from "@/components/creative/CreativeHomeBlog";
import CreativeContactHome from "@/components/creative/CreativeContactHome";
import CreativeFooter from "@/components/creative/CreativeFooter";
import CreativeHomeMotion from "@/components/creative/CreativeHomeMotion";

export const metadata: Metadata = {
  title: "DON'T FORGET — Creative Agency",
  description: "Crafting unique and compelling creative solutions that captivate and inspire.",
};

export const dynamic = "force-dynamic";

async function getCreativeHomeData(locale: Locale): Promise<{
  services: CreativeHomeService[] | undefined;
  projects: CreativeHomeProject[] | undefined;
  posts: HomeBlogPost[] | undefined;
}> {
  try {
    const [services, projects, posts] = await Promise.all([
      prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        take: 6,
        select: { title: true, description: true },
      }),
      getPublicProjects(locale),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
        take: 3,
        select: { id: true, slug: true, title: true, tags: true, coverImage: true, excerpt: true, publishedAt: true },
      }),
    ]);

    return {
      services: services.length >= 6
        ? services.map((service) => ({
            title: service.title,
            description: service.description ?? "Creative strategy, design, and production shaped around your goals.",
          }))
        : undefined,
      projects: projects
        .filter((project) => project.featured)
        .slice(0, 5)
        .map((project) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          category: project.category,
          year: project.year,
          coverImage: project.coverImage,
          gifUrl: project.gifUrl ?? null,
        })),
      posts: posts.length ? posts : undefined,
    };
  } catch {
    return { services: undefined, projects: undefined, posts: undefined };
  }
}

export default async function CreativePage({ locale = "en" }: { locale?: string }) {
  const safeLocale: Locale = locale === "ar" ? "ar" : "en";
  const { services, projects, posts } = await getCreativeHomeData(safeLocale);

  return (
    <>
      <CreativeHomeMotion />
      <CreativeHero />
      <CreativeAboutUs />
      <CreativeServices services={services} />
      <CreativePortfolio projects={projects} />
      <CreativeProcess />
      <CreativeMusts />
      <CreativeCTA1 />
      <CreativeFAQ />
      <CreativeHomeBlog posts={posts} locale={locale} />
      <CreativeContactHome />
      <CreativeFooter />
    </>
  );
}
