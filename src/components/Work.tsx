"use client";

import Image from "next/image";
import { useRevealUp, useStaggerChildren } from "@/hooks/useScrollAnimation";

interface Project {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  description: string | null;
  liveUrl: string | null;
  coverImage?: string | null;
}

const FALLBACK: Project[] = [
  {
    id: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description: "Calm, conversion-led medical site with modular content and refined motion.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description: "Tactile storefront balancing product storytelling, speed, and editorial whitespace.",
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
    description: "Developer-focused dashboard built for speed, clarity, and team collaboration.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

function Card({ p, large = false }: { p: Project; large?: boolean }) {
  return (
    <a
      href={p.liveUrl ?? "#work"}
      target={p.liveUrl ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-[var(--radius)] bg-[var(--surface)]"
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
        {p.coverImage ? (
          <Image
            src={p.coverImage}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes={large ? "100vw" : "(max-width:768px) 100vw, 50vw"}
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface2)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 md:p-9">
          <div>
            <p className="font-mono text-[0.57rem] uppercase tracking-[0.32em] text-white/45 mb-2">
              {p.category} · {p.year}
            </p>
            <h3 className={`hed text-[var(--fg)] ${large ? "text-[clamp(2rem,4.5vw,4rem)]" : "text-[clamp(1.7rem,3vw,2.8rem)]"}`}>
              {p.title}
            </h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-sm text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]">
            ↗
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Work({ projects }: { projects?: Project[] }) {
  const headRef = useRevealUp();
  const featRef = useStaggerChildren(0.1, 0.08);
  const gridRef = useStaggerChildren(0.15, 0.08);
  const list = projects?.length ? projects : FALLBACK;
  const [featured, ...rest] = list;

  return (
    <section id="work" className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">
        <div ref={headRef} className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-7">Selected work</p>
            <h2 className="hed text-[clamp(2.8rem,6.5vw,7rem)]">
              Projects shaped<br />to be remembered.
            </h2>
          </div>
          <a href="#contact" className="btn btn-outline self-start md:self-auto md:mb-2">
            Start a project →
          </a>
        </div>

        {featured && (
          <div ref={featRef} className="mb-4">
            <Card p={featured} large />
          </div>
        )}

        {rest.length > 0 && (
          <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => <Card key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
