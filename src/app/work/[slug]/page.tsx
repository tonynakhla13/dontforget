import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma }          from "@/lib/prisma";
import Loader              from "@/components/Loader";
import SmoothScroll        from "@/components/SmoothScroll";
import AltParticleLayer    from "@/components/AltParticleLayer";
import Navbar              from "@/components/Navbar";
import AmbientGlow         from "@/components/AmbientGlow";
import ProjectContent      from "./ProjectContent";

// ── Fallback data for offline / demo use ─────────────────────────────
const FALLBACK_PROJECTS = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description:
      "Calm, conversion-led medical site with modular content and refined motion. Built for clarity and trust — everything a patient needs to feel confident before their first appointment.",
    client: "Elia Medical",
    tags: ["Next.js", "GSAP", "Prisma", "Motion Design"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
    images: [] as string[],
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description:
      "Tactile storefront balancing product storytelling, speed, and editorial whitespace. Shopify-powered with custom headless frontend — page scores in the 95+ range across all metrics.",
    client: "Montgab Studio",
    tags: ["Shopify", "Headless", "Tailwind", "Animation"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
    images: [] as string[],
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
    images: [] as string[],
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description:
      "Developer-focused dashboard built for speed, clarity, and team collaboration. Data-dense layouts that never feel cluttered — every state, empty or full, designed with the same care.",
    client: "Launchpad Inc.",
    tags: ["SaaS", "Dashboard", "React", "TypeScript"],
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
    images: [] as string[],
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
};

async function getProject(slug: string): Promise<ProjectData | null> {
  // Try DB first
  try {
    const p = await prisma.project.findUnique({ where: { slug } });
    if (p) return p as ProjectData;
  } catch {
    // DB unavailable — fall through to demo data
  }

  // Fall back to demo data
  return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project — DON'T FORGET" };
  return {
    title: `${p.title} — DON'T FORGET`,
    description: p.description ?? undefined,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project  = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Loader />
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
