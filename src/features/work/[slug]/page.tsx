import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleLayer from "@/components/ParticleLayer";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ProjectContent from "./ProjectContent";

const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description:
      "Calm, conversion-led medical site with modular content and refined motion. Built for clarity and trust - everything a patient needs to feel confident before their first appointment.",
    client: "Elia Medical",
    tags: ["Next.js", "GSAP", "CMS", "Motion Design"],
    liveUrl: null,
    coverImage:
      "/uploads/projects/1779936842782-d284d4d0-9e01-41cc-9dbc-3a58d355afbe.png",
    images: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1400&q=85&auto=format&fit=crop",
    ],
    tagline: "A calmer front door for modern clinical care.",
    shortDescription:
      "Elia Clinic needed a site that could reduce appointment friction, explain specialist services clearly, and make the brand feel precise without becoming cold.",
    fullDescription:
      "We rebuilt the clinic experience around patient confidence: fast service discovery, plain-language treatment pages, visible trust signals, and a booking path that stays close on every major page. The visual system uses soft clinical photography, restrained motion, and modular content blocks so the team can keep the site current without breaking the design.",
    location: "Dubai, UAE",
    challengePoints: [
      "Patients were arriving from ads, referrals, and search with very different levels of medical context.",
      "The old service pages buried booking actions beneath long copy and generic clinic imagery.",
      "The internal team needed reusable sections for doctors, treatments, insurance notes, and follow-up care.",
    ],
    challengeResponses: [
      "Reframed the IA around patient intent instead of department structure.",
      "Built service templates with outcome-led intros, FAQs, doctor links, and persistent booking moments.",
      "Added motion only where it supports orientation: page transitions, image reveals, and form-state feedback.",
    ],
    resultSlides: [
      { label: "Booking flow", value: "3 steps", note: "Reduced from a scattered multi-page path." },
      { label: "Service pages", value: "18", note: "Reusable treatment templates ready for CMS publishing." },
      { label: "Launch stack", value: "Next.js", note: "Fast frontend with editable project content." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1400&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=85&auto=format&fit=crop",
    ],
    extraMile:
      "We also gave the clinic team a launch-ready content checklist for each specialty page so future pages keep the same standard.",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description:
      "Tactile storefront balancing product storytelling, speed, and editorial whitespace. Shopify-powered with custom headless frontend - page scores in the 95+ range across all metrics.",
    client: "Montgab Studio",
    tags: ["Shopify", "Headless", "Tailwind", "Animation"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
    images: [],
  },
  {
    id: "180-degrees",
    slug: "180-degrees",
    title: "180 Degrees",
    category: "Agency / Brand",
    year: "2026",
    description:
      "A flexible studio identity translated into web, motion, and campaign surfaces. Built to stretch: every component adapts to dark, light, and branded colour modes without losing coherence.",
    client: "180 Degrees Agency",
    tags: ["Brand System", "Motion", "Next.js", "Three.js"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop",
    images: [],
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description:
      "Developer-focused dashboard built for speed, clarity, and team collaboration. Data-dense layouts that never feel cluttered - every state, empty or full, designed with the same care.",
    client: "Launchpad Inc.",
    tags: ["SaaS", "Dashboard", "React", "TypeScript"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
    images: [],
  },
];

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
  videoUrl?: string | null;
  heroMediaType?: string | null;
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
