import type { Metadata } from "next";
import { getProjects as getPublicProjects } from "@/lib/public-content";
import SmoothScroll from "@/components/SmoothScroll";
import BouncyBall from "@/components/immersive/BouncyBall";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import WorkListContent from "@/features/work/WorkListContent";
import type { WorkProject } from "@/features/work/page";

export const metadata: Metadata = {
  title: "Work — NOX Studio",
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
    projectType: project.projectType,
    year: project.year,
    description: project.description,
    tags: project.tags,
    liveUrl: project.liveUrl,
    coverImage: project.coverImage,
  }));
}

export default async function ImmersiveWorkPage({ locale = "en" }: { locale?: string }) {
  const projects = await getProjects(locale);
  const safeLocale = locale === "ar" ? "ar" : "en";
  return (
    <>
      <SmoothScroll />
      <BouncyBall />
      <main className="relative z-[1] overflow-x-clip">
        {/* Readability scrim. The global blob field is fixed at z-0, and this
            page is dense with small mono type, so the wireframe spheres were
            crossing straight through the hero copy and the tally. `main` is
            z-[1] and creates its own stacking context, so this veil sits above
            the blobs and below everything else in `main` — the ambience stays,
            the collisions stop. Weighted to the left, where the copy lives. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(100deg,rgba(var(--bg-rgb),0.95)_0%,rgba(var(--bg-rgb),0.9)_34%,rgba(var(--bg-rgb),0.82)_62%,rgba(var(--bg-rgb),0.9)_100%)]"
        />
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <WorkListContent
          projects={projects}
          variant="immersive"
          projectBasePath={`/${safeLocale}/immersive/work`}
        />
        <ImmersiveContact embedded />
      </main>
    </>
  );
}
