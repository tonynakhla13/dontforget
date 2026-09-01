import type { Metadata } from "next";
import { getProjects as getPublicProjects } from "@/lib/public-content";
import SmoothScroll from "@/components/SmoothScroll";
import BouncyBall from "@/components/immersive/BouncyBall";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import WorkListContent from "@/features/work/WorkListContent";
import type { WorkProject } from "@/features/work/page";

export const metadata: Metadata = {
  title: "Work — DON'T FORGET",
  description: "Selected projects — websites, apps, e-commerce, and digital experiences built to be remembered.",
};

export const dynamic = "force-dynamic";

async function getProjects(locale: string): Promise<WorkProject[]> {
  const projects = await getPublicProjects(locale === "ar" ? "ar" : "en");
  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    description: project.description,
    tags: project.tags,
    liveUrl: project.liveUrl,
    coverImage: project.coverImage,
  }));
}

export default async function ImmersiveWorkPage({ locale = "en" }: { locale?: string }) {
  const projects = await getProjects(locale);
  return (
    <>
      <SmoothScroll />
      <BouncyBall />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <WorkListContent projects={projects} />
      </main>
    </>
  );
}
