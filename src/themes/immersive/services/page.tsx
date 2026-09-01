"use client";

import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ServicesOverview from "@/components/services/ServicesOverview";
import ServicesPipeHologram from "@/components/services/ServicesPipeHologram";
import ServicesDFParticles from "@/components/services/ServicesDFParticles";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import WorkHeroCards from "@/features/work/WorkHeroCards";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { gsap } from "@/lib/gsap";
import { pagePath, parseCanonicalPath } from "@/lib/site-routing";
import { PORTFOLIO_FEATURED_PROJECTS } from "@/data/portfolio-projects";

type WorkHeroProject = ComponentProps<typeof WorkHeroCards>["projects"][number];
type ProjectApiItem = WorkHeroProject & {
  attachments?:
    | Record<string, string[]>
    | Array<{
        role?: string | null;
        media?: { url?: string | null } | null;
      }>;
};

const DEMO_PROJECTS: WorkHeroProject[] = PORTFOLIO_FEATURED_PROJECTS.map((project) => ({
  id: project.slug,
  slug: project.slug,
  title: project.title,
  category: project.category,
  year: project.year,
  description: null,
  tags: [...project.tags],
  liveUrl: project.liveUrl,
  coverImage: null,
}));

function normalizeProject(project: ProjectApiItem): WorkHeroProject {
  const coverAttachment = Array.isArray(project.attachments)
    ? project.attachments.find((item) => item.role === "project_cover")?.media?.url
    : project.attachments?.project_cover?.[0];
  return {
    id: project.id,
    slug: project.slug ?? project.id,
    title: project.title,
    category: project.category ?? null,
    year: project.year ?? null,
    description: project.description ?? null,
    tags: Array.isArray(project.tags) ? project.tags : [],
    liveUrl: project.liveUrl ?? null,
    coverImage: coverAttachment ?? project.coverImage ?? null,
    gifUrl: project.gifUrl ?? null,
  };
}

function ServicesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 72% 54% at 70% 46%, rgba(var(--teal-rgb),0.07), transparent 58%), linear-gradient(180deg, rgba(var(--bg-rgb),0.96) 0%, rgba(var(--bg-rgb),1) 48%, rgba(var(--bg-rgb),0.96) 100%)",
      }} />
    </div>
  );
}

function ServicesHero() {
  const pathname = usePathname();
  const route = parseCanonicalPath(pathname);
  const contactHref = route ? pagePath(route.locale, route.theme, "contact") : "/en/immersive/contact";
  const workHref = route ? pagePath(route.locale, route.theme, "work") : "/en/immersive/work";
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 });
    tl.fromTo([headRef.current, bodyRef.current, ctaRef.current],
      { autoAlpha: 0, y: 34 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.95, ease: "power3.out" }
    ).fromTo(shapeRef.current,
      { autoAlpha: 0, scale: 1.08, x: 70 },
      { autoAlpha: 1, scale: 1, x: 0, duration: 1.35, ease: "power3.out" }, "<0.05"
    );
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden" style={{ background: "transparent" }}>
      <div ref={shapeRef} className="absolute inset-0 z-0" style={{ visibility: "hidden" }}>
        <ServicesPipeHologram />
      </div>
      <div className="relative z-10 wrap flex items-center pt-32 pb-20">
        <div className="max-w-[760px]">
          <h1 ref={headRef} className="hed text-[clamp(4.2rem,10vw,9.6rem)] leading-[0.84] text-[var(--fg)]" style={{ visibility: "hidden" }}>
            Our<br /><span className="text-[var(--teal)]">Services</span>
          </h1>
          <p ref={bodyRef} className="mt-8 max-w-[520px] text-[clamp(0.92rem,1.3vw,1.04rem)] leading-[1.9] text-[var(--body)]" style={{ visibility: "hidden" }}>
            Brand systems, digital products, immersive web, and motion identities — built to be impossible to forget.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <Link href={contactHref} className="btn-glass">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">Start a project</span>
            </Link>
            <Link href={workHref} className="btn-glass-ghost">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">View work →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectedWorkSection({ projects }: { projects: WorkHeroProject[] }) {
  const pathname = usePathname();
  const route = parseCanonicalPath(pathname);
  const workHref = route ? pagePath(route.locale, route.theme, "work") : "/en/immersive/work";

  return (
    <section
      id="selected-work"
      className="relative overflow-x-clip overflow-y-visible border-y border-[rgba(var(--teal-rgb),0.14)] py-20 md:py-24"
      style={{ background: "transparent" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_54%_at_50%_58%,rgba(var(--teal-rgb),0.055),transparent_72%)]" />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] shadow-[0_0_8px_rgba(var(--teal-rgb),0.8)]" />
          <span className="font-mono text-[0.46rem] uppercase tracking-[0.44em] text-[rgba(var(--teal-rgb),0.8)]">
            Selected work
          </span>
        </div>
        <h2 className="hed text-[clamp(2.7rem,6.4vw,5.6rem)] leading-[0.9] text-[#F8F5EE]">
          Selected <span className="text-[var(--teal)]">Works.</span>
        </h2>
        <p className="mt-4 max-w-[460px] text-[clamp(0.85rem,1.1vw,0.98rem)] leading-[1.7] text-[rgba(248,245,238,0.7)]">
          Public builds with the same sharpness we bring into every service.
        </p>
      </div>

      <div className="relative z-10 mt-4 w-full">
        <WorkHeroCards projects={projects} />
      </div>

      <div className="relative z-10 mt-6 flex justify-center">
        <Link
          href={workHref}
          className="font-mono text-[0.64rem] uppercase tracking-[0.34em] text-[var(--teal)] transition hover:tracking-[0.4em]"
        >
          View all projects -&gt;
        </Link>
      </div>
    </section>
  );
}

export default function ImmersiveServicesPage() {
  const [projects, setProjects] = useState<WorkHeroProject[]>(DEMO_PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?published=true");
        if (response.ok) {
          const data = await response.json() as ProjectApiItem[];
          setProjects(data.length ? data.map(normalizeProject) : DEMO_PROJECTS);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SmoothScroll />
      <main className="immersive-mode relative z-[1] overflow-x-clip">
        <ServicesBackground />
        <ServicesDFParticles />
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ServicesHero />
        <ServicesOverview />
        <SelectedWorkSection projects={projects} />
        <ImmersiveContact embedded />
      </main>
    </>
  );
}
