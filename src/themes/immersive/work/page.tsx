import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import KnotOnly from "@/components/KnotOnly";
import MeshGrid from "@/components/MeshGrid";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import WorkListContent from "@/features/work/WorkListContent";
import type { WorkProject } from "@/features/work/page";

export const metadata: Metadata = {
  title: "Work — DON'T FORGET",
  description: "Selected projects — websites, apps, e-commerce, and digital experiences built to be remembered.",
};

const DEMO_PROJECTS: WorkProject[] = [
  { id: "elia-clinic",  slug: "elia-clinic",  title: "Elia Clinic",  category: "Healthcare",    year: "2025", description: "Calm, conversion-led medical site with modular content and refined motion.", tags: ["Next.js","GSAP","Prisma"],    liveUrl: null, coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop" },
  { id: "montgab",      slug: "montgab",      title: "Montgab",      category: "E-Commerce",    year: "2025", description: "Tactile storefront balancing product storytelling, speed, and editorial whitespace.", tags: ["Shopify","Headless","Tailwind"], liveUrl: null, coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop" },
  { id: "180-degrees",  slug: "180-degrees",  title: "180 Degrees",  category: "Agency / Brand", year: "2026", description: "A flexible studio identity translated into web, motion, and campaign surfaces.", tags: ["Brand","Motion","Next.js"],    liveUrl: null, coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop" },
  { id: "launchpad",    slug: "launchpad",    title: "Launchpad",    category: "SaaS Platform", year: "2026", description: "Developer-focused dashboard built for speed, clarity, and team collaboration.", tags: ["SaaS","React","TypeScript"],   liveUrl: null, coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop" },
];

async function getProjects(): Promise<WorkProject[]> {
  try {
    const p = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, slug: true, title: true, category: true, year: true, description: true, tags: true, liveUrl: true, coverImage: true },
    });
    return p.length ? p : DEMO_PROJECTS;
  } catch { return DEMO_PROJECTS; }
}

export default async function ImmersiveWorkPage() {
  const projects = await getProjects();
  return (
    <>
      <SmoothScroll />
      <KnotOnly />
      <MeshGrid />
      <main className="immersive-mode relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <WorkListContent projects={projects} />
      </main>
    </>
  );
}
