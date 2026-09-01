import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleLayer from "@/components/ParticleLayer";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ProjectContent from "./ProjectContent";
import { PORTFOLIO_PROJECTS, toPortfolioProject } from "@/data/portfolio-projects";

const FALLBACK_PROJECTS: ProjectData[] = PORTFOLIO_PROJECTS.map((project) => ({
  ...toPortfolioProject(project),
  images: [],
}));

export type ProjectData = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: string | null;
  description: string | null;
  client: string | null;
  clientId?: string | null;
  clientLogo?: string | null;
  tags: string[];
  liveUrl: string | null;
  githubUrl?: string | null;
  caseStudyUrl?: string | null;
  coverImage: string | null;
  heroImage?: string | null;
  tallImage?: string | null;
  useTallImage?: boolean | null;
  images: string[];
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  location?: string | null;
  techStack?: unknown;
  techStackItems?: { id: string; name: string; icon: string | null; iconUrl: string | null }[];
  challengePoints?: unknown;
  challengeResponses?: unknown;
  resultSlides?: unknown;
  clientGoals?: unknown;
  challenges?: unknown;
  results?: unknown;
  gallery?: unknown;
  extraMile?: string | null;
  services?: { id: string; title: string; slug: string; icon: string | null; shortDescription: string | null }[];
};

export async function getProject(slug: string): Promise<ProjectData | null> {
  const fallback = FALLBACK_PROJECTS.find((project) => project.slug === slug) ?? null;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        attachments: { include: { media: true }, orderBy: { order: "asc" } },
        services: { include: { service: true }, orderBy: { order: "asc" } },
      },
    });
    if (project) {
      const record = project as unknown as ProjectData;
      const coverAttachment = project.attachments.find((item) => item.role === "project_cover")?.media.url;
      const heroAttachment = project.attachments.find((item) => item.role === "project_hero")?.media.url;
      const tallAttachment = project.attachments.find((item) => item.role === "project_tall_screenshot")?.media.url;
      const galleryAttachments = project.attachments.filter((item) => item.role === "project_gallery").map((item) => item.media.url);
      const resultAttachments = project.attachments.filter((item) => item.role === "project_result");
      const projectServices = project.services.map((item) => ({
        id: item.service.id,
        title: item.service.title,
        slug: item.service.slug,
        icon: item.service.icon,
        shortDescription: item.service.shortDescription,
      }));
      const normalizedResults = Array.isArray(record.results)
        ? record.results.map((item, index) => {
            if (!item || typeof item !== "object") return item;
            const mediaUrl = resultAttachments.find((attachment) => attachment.order === index)?.media.url;
            return mediaUrl ? { ...(item as Record<string, unknown>), mediaUrl } : item;
          })
        : record.results;
      const techIds = Array.isArray(record.techStack)
        ? record.techStack.filter((item): item is string => typeof item === "string")
        : [];
      const techItems = techIds.length
        ? await prisma.techItem.findMany({ where: { id: { in: techIds } }, select: { id: true, name: true, icon: true, iconUrl: true } })
        : [];
      const techStack = techItems.length
        ? techItems.sort((a, b) => techIds.indexOf(a.id) - techIds.indexOf(b.id)).map((item) => item.name)
        : record.techStack;
      const clientItem = record.clientId
        ? await prisma.clientItem.findUnique({
            where: { id: record.clientId },
            select: { company: true, logo: true, website: true },
          })
        : null;

      return fallback
        ? {
            ...fallback,
            ...record,
            tagline: record.tagline ?? fallback.tagline,
            shortDescription: record.shortDescription ?? fallback.shortDescription,
            fullDescription: record.fullDescription ?? fallback.fullDescription,
            location: record.location ?? fallback.location,
            challengePoints: record.challengePoints ?? fallback.challengePoints,
            challengeResponses: record.challengeResponses ?? fallback.challengeResponses,
            resultSlides: record.resultSlides ?? fallback.resultSlides,
            clientGoals: record.clientGoals ?? fallback.clientGoals,
            challenges: record.challenges ?? fallback.challenges,
            results: normalizedResults ?? fallback.results,
            gallery: record.gallery ?? fallback.gallery,
            extraMile: record.extraMile ?? fallback.extraMile,
            services: projectServices.length ? projectServices : fallback.services,
            techStack,
            techStackItems: techItems.length ? techItems : undefined,
            client: clientItem?.company ?? record.client ?? fallback.client,
            clientLogo: clientItem?.logo ?? record.clientLogo ?? fallback.clientLogo,
            liveUrl: record.liveUrl ?? clientItem?.website ?? fallback.liveUrl,
            images: galleryAttachments.length ? galleryAttachments : record.images?.length ? record.images : fallback.images,
            coverImage: coverAttachment ?? record.coverImage ?? fallback.coverImage,
            heroImage: heroAttachment ?? record.heroImage ?? fallback.heroImage,
            tallImage: tallAttachment ?? record.tallImage ?? fallback.tallImage,
            useTallImage: record.useTallImage ?? fallback.useTallImage,
          }
        : {
            ...record,
            results: normalizedResults,
            services: projectServices,
            techStack,
            techStackItems: techItems.length ? techItems : undefined,
            client: clientItem?.company ?? record.client,
            clientLogo: clientItem?.logo ?? record.clientLogo,
            liveUrl: record.liveUrl ?? clientItem?.website ?? null,
            images: galleryAttachments.length ? galleryAttachments : record.images,
            coverImage: coverAttachment ?? record.coverImage,
            heroImage: heroAttachment ?? record.heroImage,
            tallImage: tallAttachment ?? record.tallImage,
          };
    }
  } catch {}

  return fallback;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project - DON'T FORGET" };
  return {
    title: `${project.title} - DON'T FORGET`,
    description: project.shortDescription ?? project.description ?? undefined,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <SmoothScroll />
      <ParticleLayer />
      <main className="immersive-mode relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ProjectContent project={project} />
      </main>
    </>
  );
}
