"use client";

import Link from "next/link";
import type { CSSProperties, WheelEvent } from "react";
import { useRef, useState, useEffect, useCallback, type RefObject } from "react";
import { PORTFOLIO_FEATURED_PROJECTS } from "@/data/portfolio-projects";

export type CreativeHomeProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: string | null;
  coverImage: string | null;
  gifUrl?: string | null;
};

const ITEMS: CreativeHomeProject[] = PORTFOLIO_FEATURED_PROJECTS.map((project) => ({
  id: project.slug,
  slug: project.slug,
  title: project.title,
  category: project.category,
  year: project.year,
  coverImage: null,
  gifUrl: null,
}));

const RIBBON_WORDS = ["Creative", "Services", "Studio", "Design", "Strategy", "Websites", "Systems", "SEO", "Creative", "Services", "Studio", "Design", "Strategy", "Websites", "Systems", "SEO"];
const PROJECT_ROW_HEIGHT = 146;

function repeatProjects(projects: CreativeHomeProject[], minimumCount = 10) {
  if (!projects.length) return [];
  const repeats = Math.ceil(minimumCount / projects.length);
  return Array.from({ length: repeats }, () => projects).flat();
}

const FALLBACK_GIFS: Record<string, string> = {
  "elia-clinic": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnFjZDY1ZWN2OGNqM2c1MWgzY2tnNmtxNmJ4OW5yZnY2eXJraG9veiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPEqDGUULpEU0aQ/giphy.gif",
  montgab: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRzOG44OGt4OHNmOGw5MmxoaHZqYXR4Z3pvdjM3YmI1ajRzY3NpbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgzoKnwFNmISR8I/giphy.gif",
  "180-degrees": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWRiM2RreDNrYjM4dHR6eTNhaDRyeGYybnBmZjkwamJ5MmZvdnF6eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tn33aiTi1jkl6H6/giphy.gif",
  launchpad: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJ6emhhZTk4Z2NhZWNvcDBjZGNmcG80eGFlN21zZnY0aWUyem0xNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPwoeGErMmaI43S/giphy.gif",
};

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "elia-clinic": "A calm healthcare identity and booking experience built around trust, clarity, and fast patient decisions.",
  montgab: "A retail storefront direction with strong merchandising, sharp product discovery, and a premium shopping rhythm.",
  "180-degrees": "A brand system and digital presence shaped for a creative team that needs bold work to feel organized.",
  launchpad: "A SaaS dashboard concept focused on performance data, onboarding clarity, and high-signal product moments.",
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

function getProjectDescription(project: CreativeHomeProject) {
  return PROJECT_DESCRIPTIONS[project.slug] ?? "A selected project shaped around strategy, design craft, and a clear digital experience.";
}

function ThinkingBadge({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const badgeRef = useRef<HTMLDivElement>(null);

  // Mouse-track: badge tilts toward cursor within the section
  const onMouseMove = useCallback((e: MouseEvent) => {
    const badge = badgeRef.current;
    if (!badge) return;
    const rect = badge.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxTilt = 20;
    const factor = Math.min(1, 320 / (dist + 1));
    const rx = (-dy / (dist || 1)) * maxTilt * factor;
    const ry = (dx / (dist || 1)) * maxTilt * factor;
    const sc = dist < 140 ? 1.1 : 1;
    badge.style.transform = `perspective(500px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale(${sc})`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (badgeRef.current) badgeRef.current.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);
    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [sectionRef, onMouseMove, onMouseLeave]);

  return (
    <div
      ref={badgeRef}
      className="c-thinking-badge"
      aria-hidden="true"
      style={{ transition: "transform 0.18s cubic-bezier(.22,1,.36,1)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/creative/thinking.png" alt="" draggable={false} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default function CreativePortfolio({ projects = ITEMS }: { projects?: CreativeHomeProject[] }) {
  const sourceItems = projects.length ? projects : ITEMS;
  const items = repeatProjects(sourceItems);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelDeltaRef = useRef(0);
  const activeIndexRef = useRef(0);
  const maxIndexRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const visibleRows = 3;
  const maxIndex = Math.max(0, items.length - visibleRows);
  const goTo = useCallback((direction: number) => {
    setActiveIndex((current) => Math.min(maxIndex, Math.max(0, current + direction)));
  }, [maxIndex]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
    setSelectedIndex((current) => Math.min(current, items.length - 1));
  }, [maxIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    maxIndexRef.current = maxIndex;
  }, [activeIndex, maxIndex]);

  const isCarouselCentered = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return false;
    const carousel = section.querySelector(".c-portfolio-carousel");
    const rect = (carousel ?? section).getBoundingClientRect();
    const viewportMiddle = window.innerHeight / 2;
    const carouselMiddle = rect.top + rect.height / 2;
    return Math.abs(carouselMiddle - viewportMiddle) <= 90;
  }, []);

  const onPortfolioWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (!maxIndex) return;
    if (!isCarouselCentered()) return;
    event.preventDefault();
    wheelDeltaRef.current += event.deltaY;
    if (Math.abs(wheelDeltaRef.current) < 80) return;
    goTo(wheelDeltaRef.current > 0 ? 1 : -1);
    wheelDeltaRef.current = 0;
  }, [goTo, isCarouselCentered, maxIndex]);

  const trackStyle: CSSProperties = {
    transform: `translate3d(0, -${activeIndex * PROJECT_ROW_HEIGHT}px, 0)`,
  };
  const previewIndex = hovered ?? selectedIndex;
  const previewProject = items[previewIndex] ?? items[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWindowWheel = (event: globalThis.WheelEvent) => {
      if (event.defaultPrevented || !maxIndexRef.current) return;

      if (!isCarouselCentered()) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const current = activeIndexRef.current;
      const atStart = current === 0;
      const atEnd = current === maxIndexRef.current;
      const shouldRelease = (direction < 0 && atStart) || (direction > 0 && atEnd);
      if (shouldRelease) return;

      event.preventDefault();
      wheelDeltaRef.current += event.deltaY;
      if (Math.abs(wheelDeltaRef.current) < 80) return;
      goTo(direction);
      wheelDeltaRef.current = 0;
    };

    window.addEventListener("wheel", onWindowWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWindowWheel);
  }, [goTo, isCarouselCentered]);

  return (
    <section id="portfolio" className="c-portfolio" ref={sectionRef as RefObject<HTMLElement>}>
      <ThinkingBadge sectionRef={sectionRef} />
      <div className="c-portfolio__card">
        <div className="c-portfolio__shape" aria-hidden="true" />
        <div className="c-portfolio__earth" aria-hidden="true" />

        <div className="c-portfolio__inner">
          <div className="c-portfolio__head">
            <div className="c-portfolio__cta-wrap">
              <Link href="/creative/work" className="c-btn">
                View all work
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
              className="c-carousel__viewport"
              aria-label="Scrollable project list"
              onWheel={onPortfolioWheel}
            >
              <div className="c-portfolio__list c-carousel__track" style={trackStyle}>
                {items.map((project, index) => (
                  <Link
                    key={`${project.id}-${index}`}
                    href={`/work/${project.slug}`}
                    className="c-pf"
                    onMouseEnter={() => {
                      setHovered(index);
                      setSelectedIndex(index);
                    }}
                    onMouseMove={() => {
                      setHovered(index);
                      setSelectedIndex(index);
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onPointerEnter={() => {
                      setHovered(index);
                      setSelectedIndex(index);
                    }}
                    onPointerMove={() => {
                      setHovered(index);
                      setSelectedIndex(index);
                    }}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => {
                      setHovered(index);
                      setSelectedIndex(index);
                    }}
                    onBlur={() => setHovered(null)}
                  >
                    <div className="c-pf__date" style={{ whiteSpace: "pre-line" }}>{formatProjectDate(project)}</div>
                    <div>
                      <div className="c-pf__title" style={{ whiteSpace: "pre-line" }}>{formatProjectTitle(project.title)}</div>
                      {project.category && (
                        <div style={{
                          fontFamily: "var(--c-f-ui)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#3d6200",
                          marginTop: "5px",
                        }}>
                          {project.category}
                        </div>
                      )}
                    </div>
                    <div className="c-pf__img c-checker" style={projectCoverStyle(project)}>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {previewProject && (
              <aside className="c-pf-preview" aria-live="polite">
                <div className="c-pf-preview__media c-checker" style={projectPreviewStyle(previewProject)} />
                <div className="c-pf-preview__meta">
                  <div className="c-pf-preview__kicker">
                    {previewProject.category ?? "Selected work"}
                  </div>
                  <h3 className="c-pf-preview__title">{previewProject.title}</h3>
                  <p className="c-pf-preview__desc">{getProjectDescription(previewProject)}</p>
                  <div className="c-pf-preview__foot">
                    <span>{previewProject.year ?? "Project"}</span>
                    <span>{String(previewIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  </div>
                </div>
              </aside>
            )}
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
