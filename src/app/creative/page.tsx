import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CreativeHero from "@/components/creative/CreativeHero";
import CreativeAboutUs from "@/components/creative/CreativeAboutUs";
import CreativeServices, { type CreativeHomeService } from "@/components/creative/CreativeServices";
import CreativePortfolio, { type CreativeHomeProject } from "@/components/creative/CreativePortfolio";
import CreativeCTA1 from "@/components/creative/CreativeCTA1";
import CreativeTestimonials from "@/components/creative/CreativeTestimonials";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeCTA2 from "@/components/creative/CreativeCTA2";
import CreativeFooter from "@/components/creative/CreativeFooter";
import CreativeHomeMotion from "@/components/creative/CreativeHomeMotion";

export const metadata: Metadata = {
  title: "DON'T FORGET — Creative Agency",
  description: "Crafting unique and compelling creative solutions that captivate and inspire.",
};

export const dynamic = "force-dynamic";

async function getCreativeHomeData(): Promise<{
  services: CreativeHomeService[] | undefined;
  projects: CreativeHomeProject[] | undefined;
}> {
  try {
    const [services, projects] = await Promise.all([
      prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        take: 6,
        select: { title: true, description: true },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        take: 4,
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          year: true,
          coverImage: true,
          gifUrl: true,
        },
      }),
    ]);

    return {
      services: services.length >= 6
        ? services.map((service) => ({
            title: service.title,
            description: service.description ?? "Creative strategy, design, and production shaped around your goals.",
          }))
        : undefined,
      projects: projects.length ? projects : undefined,
    };
  } catch {
    return { services: undefined, projects: undefined };
  }
}

export default async function CreativePage() {
  const { services, projects } = await getCreativeHomeData();

  return (
    <>
      <CreativeHomeMotion />
      <CreativeHero />
      <CreativeAboutUs />
      <CreativeServices services={services} />
      <CreativePortfolio projects={projects} />
      <CreativeCTA1 />
      <CreativeTestimonials />
      <CreativeFAQ />
      <CreativeCTA2 />
      <CreativeFooter />
    </>
  );
}
