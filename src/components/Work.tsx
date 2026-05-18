"use client";

import Image from "next/image";
import { useRevealUp, useStaggerChildren, useParallax } from "@/hooks/useScrollAnimation";

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  year: string | null;
  liveUrl: string | null;
  coverImage?: string | null;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description: "A calm, conversion-led medical site with modular content and refined motion.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description: "A tactile storefront balancing product storytelling, speed, and editorial whitespace.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "180-degrees",
    title: "180 Degrees",
    category: "Agency / Brand",
    year: "2026",
    description: "A flexible studio identity translated into web, motion, and campaign surfaces.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description: "A developer-focused dashboard built for speed, clarity, and team collaboration.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <a
      href={project.liveUrl ?? "#"}
      target={project.liveUrl ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-[var(--card-radius)] bg-[var(--surface)]"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${large ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes={large ? "100vw" : "(max-width:768px) 100vw, 50vw"}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--surface)] to-[rgba(58,191,138,0.06)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.55)] mb-2">
                {project.category}  ·  {project.year}
              </p>
              <h3 className={`display-text text-[var(--paper)] leading-none ${large ? "text-[clamp(2rem,5vw,4rem)]" : "text-[clamp(1.6rem,3.5vw,2.6rem)]"}`}>
                {project.title}
              </h3>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]">
              ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Work({ projects }: { projects?: Project[] }) {
  const headRef = useRevealUp();
  const featRef = useStaggerChildren(0.1, 0.1);
  const gridRef = useStaggerChildren(0.15, 0.09);
  const hexRef = useParallax(18, -18);

  const list = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const [featured, ...rest] = list;

  return (
    <section id="work" className="relative overflow-hidden section-py">
      {/* Hex */}
      <div ref={hexRef} aria-hidden="true" className="pointer-events-none absolute -right-10 top-[6%] opacity-[0.09]">
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none">
          <polygon points="50,3 91,26 91,74 50,97 9,74 9,26" stroke="#3abf8a" strokeWidth="0.75" fill="none" strokeDasharray="3 6" />
        </svg>
      </div>

      <div className="wrap">
        {/* Header */}
        <div ref={headRef} className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-7">Selected work</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              Projects shaped<br />to be remembered.
            </h2>
          </div>
          <a href="#contact" className="btn btn-ghost md:mb-2 self-start md:self-auto">
            Start a project →
          </a>
        </div>

        {/* Featured */}
        {featured && (
          <div ref={featRef} className="mb-6">
            <ProjectCard project={featured} large />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
