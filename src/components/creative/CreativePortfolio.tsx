"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";

export type CreativeHomeProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: string | null;
  coverImage: string | null;
  gifUrl?: string | null;
};

const ITEMS: CreativeHomeProject[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
    gifUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
    gifUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "180-degrees",
    slug: "180-degrees",
    title: "180 Degrees",
    category: "Agency / Brand",
    year: "2026",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
    gifUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    gifUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
  },
];

const RIBBON_WORDS = ["Creative", "Services", "Agency", "Studio", "Design", "Creative", "Services", "Agency"];
const PROJECT_ROW_HEIGHT = 146;

const FALLBACK_GIFS: Record<string, string> = {
  "elia-clinic": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnFjZDY1ZWN2OGNqM2c1MWgzY2tnNmtxNmJ4OW5yZnY2eXJraG9veiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPEqDGUULpEU0aQ/giphy.gif",
  montgab: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRzOG44OGt4OHNmOGw5MmxoaHZqYXR4Z3pvdjM3YmI1ajRzY3NpbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgzoKnwFNmISR8I/giphy.gif",
  "180-degrees": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWRiM2RreDNrYjM4dHR6eTNhaDRyeGYybnBmZjkwamJ5MmZvdnF6eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tn33aiTi1jkl6H6/giphy.gif",
  launchpad: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJ6emhhZTk4Z2NhZWNvcDBjZGNmcG80eGFlN21zZnY0aWUyem0xNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPwoeGErMmaI43S/giphy.gif",
};

function formatProjectDate(project: CreativeHomeProject) {
  if (project.year) return project.year.replace(/\s+/, "\n");
  if (project.category?.includes("\n")) return project.category;
  return project.category ?? "Project";
}

function formatProjectTitle(title: string) {
  if (title.length < 26 || title.includes("\n")) return title;
  const parts = title.split(" ");
  const midpoint = Math.ceil(parts.length / 2);
  return `${parts.slice(0, midpoint).join(" ")}\n${parts.slice(midpoint).join(" ")}`;
}

function projectPreviewStyle(project: CreativeHomeProject): CSSProperties | undefined {
  const preview = project.gifUrl && project.gifUrl !== project.coverImage
    ? project.gifUrl
    : FALLBACK_GIFS[project.slug] ?? project.coverImage;
  if (!preview) return undefined;
  return { backgroundImage: `url("${preview}")`, backgroundSize: "cover", backgroundPosition: "center" };
}

function projectCoverStyle(project: CreativeHomeProject): CSSProperties | undefined {
  if (!project.coverImage) return undefined;
  return { backgroundImage: `url("${project.coverImage}")`, backgroundSize: "cover", backgroundPosition: "center" };
}

export default function CreativePortfolio({ projects = ITEMS }: { projects?: CreativeHomeProject[] }) {
  const items = projects.length ? projects.slice(0, 4) : ITEMS;
  const [hovered, setHovered] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const goTo = (nextIndex: number) => {
    viewportRef.current?.scrollBy({
      top: nextIndex * PROJECT_ROW_HEIGHT,
      behavior: "smooth",
    });
  };

  return (
    <section id="portfolio" className="c-portfolio">
      <div className="c-portfolio__card">
        <div className="c-portfolio__shape" aria-hidden="true" />
        <div className="c-portfolio__earth" aria-hidden="true" />

        <div className="c-portfolio__inner">
          <div className="c-portfolio__head">
            <div className="c-portfolio__cta-wrap">
              <Link href="/creative/work" className="c-btn">
                Explore Our Work
                <span className="c-blink" aria-hidden="true" />
              </Link>
            </div>
            <h2 className="c-portfolio__title">
              <span style={{ textAlign: "right" }}>port-</span>
              <span className="c-portfolio__row2">
                <span className="c-portfolio__star" aria-hidden="true" />
                <span>folio</span>
              </span>
            </h2>
          </div>

          <div className="c-carousel c-portfolio-carousel">
            <div
              ref={viewportRef}
              className="c-carousel__viewport"
              aria-label="Scrollable project list"
              onWheel={(event) => {
                if (!viewportRef.current) return;
                event.preventDefault();
                viewportRef.current.scrollBy({ top: event.deltaY, behavior: "auto" });
              }}
            >
              <div className="c-portfolio__list c-carousel__track">
                {items.map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/work/${project.slug}`}
                    className="c-pf"
                    onMouseEnter={() => setHovered(index)}
                    onMouseMove={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onPointerEnter={() => setHovered(index)}
                    onPointerMove={() => setHovered(index)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                  >
                    <div className="c-pf__date" style={{ whiteSpace: "pre-line" }}>{formatProjectDate(project)}</div>
                    <div className="c-pf__title" style={{ whiteSpace: "pre-line" }}>{formatProjectTitle(project.title)}</div>
                    <div className="c-pf__img c-checker" style={projectCoverStyle(project)}>
                      <span className={`c-pf__gif${hovered === index ? " active" : ""}`} style={projectPreviewStyle(project)} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="c-carousel__controls c-carousel__controls--portfolio">
              <button className="c-iconbtn" type="button" onClick={() => goTo(-1)} aria-label="Previous project">
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15 L12 8 L19 15" />
                </svg>
              </button>
              <div className="c-carousel__count">
                {String(items.length).padStart(2, "0")}
              </div>
              <button className="c-iconbtn" type="button" onClick={() => goTo(1)} aria-label="Next project">
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 9 L12 16 L19 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal ribbons */}
      <div className="c-ribbon-back" aria-hidden="true">
        <div className="c-ribbon__inner">
          {RIBBON_WORDS.map((w, i) => (
            <span key={i}>
              <span>{w}</span>
              <span className="c-rb-star" />
            </span>
          ))}
        </div>
      </div>
      <div className="c-ribbon-front" aria-hidden="true">
        <div className="c-ribbon__inner">
          {RIBBON_WORDS.map((w, i) => (
            <span key={i}>
              <span>{w}</span>
              <span className="c-rb-star c-rb-star--dark" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
