import type { Metadata } from "next";

import { getProjects as getPublicProjects } from "@/lib/public-content";
import { PORTFOLIO_PROJECTS, toPortfolioProject } from "@/data/portfolio-projects";
import Loader              from "@/components/Loader";
import SmoothScroll        from "@/components/SmoothScroll";
import KnotOnly            from "@/components/KnotOnly";
import MeshGrid            from "@/components/MeshGrid";
import Navbar              from "@/components/Navbar";
import AmbientGlow         from "@/components/AmbientGlow";
import WorkListContent     from "./WorkListContent";

export const metadata: Metadata = {
  title: "Work — NOX Studio",
  description:
    "Selected projects from NOX Studio — websites, apps, e-commerce, and digital experiences built to be remembered.",
};

// ── Fallback demo data ────────────────────────────────────────────────
const DEMO_PROJECTS = PORTFOLIO_PROJECTS.map(toPortfolioProject);

async function getProjects() {
  try {
    return await getPublicProjects("en");
  } catch {
    return DEMO_PROJECTS;
  }
}

export type WorkProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: string | null;
  description: string | null;
  tags: string[];
  liveUrl: string | null;
  coverImage: string | null;
  gifUrl?: string | null;
  images?: string[] | null;
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <Loader />
      <SmoothScroll />
      <KnotOnly />
      <MeshGrid />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <WorkListContent projects={projects as WorkProject[]} />
      </main>
    </>
  );
}
