import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import AltParticleLayer from "@/components/AltParticleLayer";
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
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
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
  tags: string[];
  liveUrl: string | null;
  coverImage: string | null;
  images: string[];
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  location?: string | null;
  challengePoints?: unknown;
  challengeResponses?: unknown;
  resultSlides?: unknown;
  gallery?: unknown;
  extraMile?: string | null;
};

async function getProject(slug: string): Promise<ProjectData | null> {
  const fallback = FALLBACK_PROJECTS.find((project) => project.slug === slug) ?? null;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (project) {
      const record = project as ProjectData;
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
            gallery: record.gallery ?? fallback.gallery,
            extraMile: record.extraMile ?? fallback.extraMile,
            images: record.images?.length ? record.images : fallback.images,
            coverImage: record.coverImage ?? fallback.coverImage,
          }
        : record;
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
      <AltParticleLayer mode="galaxy" />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ProjectContent project={project} />
      </main>
    </>
  );
}
