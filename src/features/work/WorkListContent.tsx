"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { WorkProject } from "./page";
import WorkHeroFrames from "./WorkHeroFrames";

// ─────────────────────────────────────────────────────────────────────
// Filter drawer — slides in from the right
// ─────────────────────────────────────────────────────────────────────
function FilterPanel({
  isOpen,
  onClose,
  categories,
  activeFilter,
  onFilter,
  projectCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeFilter: string;
  onFilter: (cat: string) => void;
  projectCount: number;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.32s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "260px",
          background: "rgba(3,8,6,0.97)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-mono text-[0.46rem] uppercase tracking-[0.38em] text-[var(--body)]">
            Filter Projects
          </span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--body)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
            aria-label="Close filter"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 px-4 py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { onFilter(cat); onClose(); }}
              className={`text-left rounded-md px-4 py-2.5 font-mono text-[0.54rem] uppercase tracking-[0.20em] border transition-all duration-200 ${
                activeFilter === cat
                  ? "border-[var(--teal)] bg-[var(--teal-faint)] text-[var(--teal)]"
                  : "border-transparent text-[var(--body)] hover:border-[var(--border)] hover:text-[var(--fg)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="font-mono text-[0.44rem] uppercase tracking-[0.28em] text-[var(--body)] opacity-50">
            {projectCount} project{projectCount !== 1 ? "s" : ""}
            {activeFilter !== "All" && ` — ${activeFilter}`}
          </span>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Project card — 4/3 aspect, two-column
// ─────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  filteredIndex,
}: {
  project: WorkProject;
  filteredIndex: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const num      = String(filteredIndex + 1).padStart(2, "0");
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(project.coverImage && !imageFailed);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(innerRef.current, {
      rotationX: -y * 4, rotationY: x * 6,
      transformPerspective: 1100, ease: "power2.out", duration: 0.65, overwrite: true,
    });
    gsap.to(imgRef.current, { scale: 1.045, duration: 0.75, ease: "power2.out", overwrite: true });
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(innerRef.current, {
      rotationX: 0, rotationY: 0,
      duration: 1.0, ease: "power3.out", overwrite: true,
    });
    gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
  }, []);

  return (
    <Link
      href={`/work/${project.slug ?? project.id}`}
      data-card
      className="group work-project-card relative block"
      style={{ clipPath: "inset(0 0 100% 0)", willChange: "clip-path, transform" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={innerRef}
        className="relative overflow-hidden rounded-[18px] bg-[var(--surface)]"
        style={{ transformStyle: "preserve-3d", aspectRatio: "4 / 3" }}
      >
        <div className="work-card-depth absolute inset-0" />

        {/* Image */}
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          {hasImage ? (
            <Image
              src={project.coverImage!}
              alt={project.title}
              fill
              className="object-cover work-card-image"
              sizes="(max-width:768px) 100vw, 42vw"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ProjectArtworkFallback project={project} num={num} />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,6,0.06)_0%,rgba(3,8,6,0.28)_38%,rgba(3,8,6,0.94)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(58,191,138,0.20),transparent_36%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Teal border */}
        <div className="absolute inset-0 rounded-[18px] border border-[rgba(184,255,224,0.10)] transition-colors duration-300 group-hover:border-[rgba(184,255,224,0.42)]" />

        {/* Scan line */}
        <div className="work-card-scan absolute inset-0 pointer-events-none overflow-hidden rounded-[var(--radius)]">
          <div className="scan-runner absolute left-0 right-0 h-[1px]" />
        </div>

        {/* Top meta */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/28 font-mono text-[0.52rem] text-white/62 backdrop-blur-md transition-all duration-300 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]">
            {num}
          </span>
          {project.category && (
            <span className="rounded-full border border-white/10 bg-black/42 px-3 py-1.5 font-mono text-[0.5rem] uppercase tracking-[0.24em] text-white/58 backdrop-blur-md transition-colors duration-300 group-hover:border-[var(--teal-mid)] group-hover:text-[var(--teal)]">
              {project.category}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="work-card-copy">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.32em] text-white/46">{project.year}</p>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(58,191,138,0.45),transparent)]" />
            </div>
            <h3 className="hed text-[clamp(1.9rem,3vw,3.35rem)] leading-[0.9] text-[#F8F5EE]">{project.title}</h3>
            {project.description ? (
              <p className="mt-4 max-w-[34rem] text-[0.83rem] leading-[1.75] text-white/68">
                {project.description}
              </p>
            ) : null}
            {project.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="work-card-tag">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="absolute bottom-5 right-5 flex h-11 w-11 shrink-0 translate-x-2 translate-y-2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/48 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)] group-hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13L13 3M13 3H6M13 3V10" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProjectArtworkFallback({ project, num }: { project: WorkProject; num: string }) {
  return (
    <div className="work-card-fallback absolute inset-0">
      <div className="work-card-fallback-grid" />
      <div className="absolute left-7 top-7 font-mono text-[0.54rem] uppercase tracking-[0.34em] text-[var(--teal)]">
        {num} / {project.category ?? "Project"}
      </div>
      <div className="absolute inset-x-7 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(184,255,224,0.58),transparent)]" />
      <div className="absolute right-7 top-7 h-12 w-12 rounded-full border border-[rgba(184,255,224,0.18)] shadow-[0_0_40px_rgba(58,191,138,0.18)]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────
function WorkHero({ totalCount }: { totalCount: number }) {
  const headRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isFirstLoad = !sessionStorage.getItem("df_loader_shown");
    const delay = isFirstLoad ? 2.2 : 0;
    const tl = gsap.timeline({ delay });
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" })
      .fromTo(
        [headRef.current, bodyRef.current, ctaRef.current, statsRef.current],
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.95, ease: "power3.out" },
        "-=0.2"
      );
    const obj = { v: 0 };
    tl.to(obj, {
      v: totalCount, duration: 0.9, snap: { v: 1 }, ease: "power2.inOut",
      onUpdate() {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(obj.v)).padStart(2, "0");
      },
    }, "-=0.7");
    return () => { tl.kill(); };
  }, [totalCount]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px origin-left bg-gradient-to-r from-[var(--teal)] via-[rgba(58,191,138,0.35)] to-transparent"
        style={{ top: "22%", transform: "scaleX(0)" }}
      />

      {/* Floating editorial frames — the visual "game" of this hero */}
      <WorkHeroFrames />

      <div className="relative z-10 wrap flex items-center pt-32 pb-20">
        <div className="max-w-[520px]">
          <h1
            ref={headRef}
            className="hed text-[clamp(4.2rem,10vw,9.6rem)] leading-[0.84] text-[#F8F5EE]"
            style={{ visibility: "hidden" }}
          >
            Selected<br />
            <span className="text-[var(--teal)]">Work</span>
          </h1>
          <p
            ref={bodyRef}
            className="mt-8 max-w-[520px] text-[clamp(0.92rem,1.3vw,1.04rem)] leading-[1.9] text-[var(--body)]"
            style={{ visibility: "hidden" }}
          >
            Websites that stop the scroll. Apps people keep opening. Stores built
            to convert. Every project shipped is a reason to{" "}
            <span className="text-[var(--fg)]">remember us.</span>
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <Link href="/immersive/contact" className="btn-glass">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">Start a project</span>
            </Link>
            <Link href="/services" className="btn-glass-ghost">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">Our services →</span>
            </Link>
          </div>
          <div
            ref={statsRef}
            className="mt-14 grid max-w-[520px] grid-cols-3 border-y border-[var(--border)]"
            style={{ visibility: "hidden" }}
          >
            {[
              { value: <span ref={counterRef}>00</span>, label: "Projects" },
              { value: "3+", label: "Years" },
              { value: "6",  label: "Industries" },
            ].map(({ value, label }) => (
              <div key={label} className="border-r border-[var(--border)] py-4 last:border-r-0">
                <span className="block font-mono text-[0.52rem] uppercase tracking-[0.26em] text-[var(--teal)]">
                  {value} {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────
export default function WorkListContent({ projects }: { projects: WorkProject[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterOpen, setFilterOpen]     = useState(false);

  const gridRef        = useRef<HTMLDivElement>(null);
  const hasRevealedRef = useRef(false);
  const isAnimating    = useRef(false);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = ["All"];
    projects.forEach((p) => {
      if (p.category && !seen.has(p.category)) { seen.add(p.category); list.push(p.category); }
    });
    return list;
  }, [projects]);

  const filteredProjects = useMemo(
    () => activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  );

  // Scroll reveal
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: grid, start: "top 88%", once: true,
        onEnter() {
          if (hasRevealedRef.current) return;
          hasRevealedRef.current = true;
          const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
          gsap.to(cards, { clipPath: "inset(0 0 0% 0)", duration: 0.75, stagger: { amount: 0.55, from: "start" }, ease: "expo.out" });
        },
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  // Filter
  const handleFilter = useCallback(async (cat: string) => {
    if (cat === activeFilter || isAnimating.current) return;
    isAnimating.current = true;

    const grid  = gridRef.current;
    const cards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    if (cards.length) {
      await gsap.to(cards, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.20, stagger: { amount: 0.1, from: "start" }, ease: "power2.in" });
    }
    setActiveFilter(cat);
    await new Promise<void>((r) => requestAnimationFrame(() => { requestAnimationFrame(() => r()); }));

    const newCards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    if (newCards.length) {
      gsap.set(newCards, { autoAlpha: 0, y: 20, scale: 0.96, clipPath: "inset(0 0 0% 0)" });
      await gsap.to(newCards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: { amount: 0.28, from: "start" }, ease: "power3.out" });
    }
    isAnimating.current = false;
  }, [activeFilter]);

  return (
    <>
      {/* ── CSS ── */}
      <style>{`
        @keyframes work-scan {
          0%   { top:-2px;  opacity:0.0; }
          5%   { opacity:0.9; }
          95%  { opacity:0.7; }
          100% { top:100%; opacity:0.0; }
        }
        .work-hero-void {
          background:
            radial-gradient(circle at 76% 42%, rgba(58,191,138,0.22), transparent 26%),
            radial-gradient(circle at 62% 22%, rgba(184,255,224,0.12), transparent 18%),
            radial-gradient(circle at 88% 74%, rgba(245,184,94,0.10), transparent 20%);
          filter: blur(2px);
          opacity: 0.9;
        }
        .work-hero-particles {
          opacity: 0.8;
          background-image:
            radial-gradient(circle, rgba(184,255,224,0.72) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(58,191,138,0.38) 0 1px, transparent 1.5px);
          background-size: 84px 84px, 132px 132px;
          background-position: 0 0, 32px 54px;
          mask-image: radial-gradient(ellipse at 72% 48%, black 0%, transparent 68%);
          animation: work-particle-drift 18s linear infinite;
        }
        @keyframes work-particle-drift {
          from { background-position: 0 0, 32px 54px; }
          to { background-position: 84px 168px, -100px 186px; }
        }
        .work-hero-orbit {
          position: absolute;
          right: 8vw;
          top: 50%;
          width: min(46vw, 620px);
          aspect-ratio: 1;
          border: 1px solid rgba(58,191,138,0.14);
          border-radius: 50%;
          transform: translateY(-50%) rotateX(68deg) rotateZ(-12deg);
          box-shadow: 0 0 80px rgba(58,191,138,0.08);
        }
        .work-hero-orbit-b {
          width: min(34vw, 450px);
          right: 12vw;
          opacity: 0.72;
          transform: translateY(-50%) rotateX(62deg) rotateZ(18deg);
        }
        .work-puzzle-shell {
          overflow: hidden;
          border: 1px solid rgba(58,191,138,0.36);
          border-radius: 18px;
          background:
            linear-gradient(135deg, rgba(184,255,224,0.12), transparent 26%),
            radial-gradient(circle at 78% 0%, rgba(58,191,138,0.24), transparent 32%),
            rgba(3,8,6,0.78);
          box-shadow:
            0 0 0 1px rgba(184,255,224,0.08),
            0 24px 100px rgba(0,0,0,0.62),
            0 0 90px rgba(58,191,138,0.18);
          backdrop-filter: blur(18px);
        }
        .work-puzzle-shell::before {
          content: "";
          position: absolute;
          inset: -1px;
          pointer-events: none;
          border-radius: inherit;
          background:
            linear-gradient(90deg, transparent, rgba(184,255,224,0.18), transparent),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 8px);
          opacity: 0.38;
          mix-blend-mode: screen;
        }
        .work-puzzle-topline,
        .work-puzzle-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.95rem 1rem;
          font-family: var(--font-mono-next), monospace;
          font-size: 0.52rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(248,245,238,0.58);
        }
        .work-puzzle-topline {
          border-bottom: 1px solid rgba(58,191,138,0.16);
        }
        .work-puzzle-footer {
          border-top: 1px solid rgba(58,191,138,0.16);
          color: rgba(58,191,138,0.86);
        }
        .work-puzzle-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.7rem;
          padding: 1rem;
        }
        .work-puzzle-tile {
          position: relative;
          min-height: clamp(4.4rem, 7vw, 6.7rem);
          overflow: hidden;
          border: 1px solid rgba(58,191,138,0.28);
          border-radius: 10px;
          background:
            radial-gradient(circle at 50% -20%, rgba(184,255,224,0.14), transparent 54%),
            rgba(7,14,11,0.9);
          color: rgba(248,245,238,0.86);
          font-family: var(--font-display-next), system-ui, sans-serif;
          font-size: clamp(2.2rem, 4.8vw, 4.2rem);
          line-height: 1;
          transition: transform 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }
        .work-puzzle-tile::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 38%, rgba(58,191,138,0.08));
          opacity: 0.78;
        }
        .work-puzzle-tile span {
          position: relative;
          z-index: 2;
          text-shadow: 0 0 22px rgba(58,191,138,0.32);
        }
        .work-puzzle-tile:hover,
        .work-puzzle-tile[data-selected="true"] {
          transform: translateY(-3px) scale(1.015);
          border-color: rgba(184,255,224,0.72);
          color: #b8ffe0;
          box-shadow: 0 0 28px rgba(58,191,138,0.22);
        }
        .work-puzzle-tile[data-solved="true"] {
          border-color: rgba(184,255,224,0.66);
          color: #b8ffe0;
          background:
            radial-gradient(circle at 50% -20%, rgba(184,255,224,0.24), transparent 58%),
            rgba(8,26,18,0.92);
        }
        .work-puzzle-action {
          border: 1px solid rgba(58,191,138,0.26);
          border-radius: 999px;
          padding: 0.48rem 0.7rem;
          color: rgba(248,245,238,0.72);
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .work-puzzle-action:hover {
          border-color: rgba(184,255,224,0.58);
          color: #b8ffe0;
          background: rgba(58,191,138,0.08);
        }
        .work-puzzle-scan {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, rgba(184,255,224,0.14) 48%, transparent 52%);
          opacity: 0.7;
          transform: translateY(-100%);
          animation: work-puzzle-scan 4.4s linear infinite;
        }
        @keyframes work-puzzle-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          12% { opacity: 0.62; }
          52% { opacity: 0.52; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .work-puzzle-solved {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(6,18,12,0.76), rgba(3,8,6,0.88));
          color: #f8f5ee;
          font-family: var(--font-display-next), system-ui, sans-serif;
          font-size: clamp(3.2rem, 7.4vw, 6.7rem);
          line-height: 0.9;
          text-align: center;
          text-shadow: 0 0 36px rgba(58,191,138,0.55);
          animation: work-solved-pop 0.58s cubic-bezier(.16,1,.3,1);
        }
        @keyframes work-solved-pop {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .group:hover .scan-runner { top:-2px; animation:work-scan 0.7s ease-out forwards; }
        .scan-runner { background:linear-gradient(90deg,transparent,rgba(58,191,138,0.75),transparent); pointer-events:none; top:-2px; }

        .work-project-card {
          grid-column: auto !important;
          filter: drop-shadow(0 18px 54px rgba(0,0,0,0.36));
        }
        .work-project-card > div {
          box-shadow:
            inset 0 0 0 1px rgba(184,255,224,0.06),
            0 0 0 1px rgba(58,191,138,0.08);
        }
        .work-card-depth {
          background:
            radial-gradient(circle at 50% -10%, rgba(184,255,224,0.18), transparent 42%),
            linear-gradient(135deg, rgba(58,191,138,0.10), rgba(0,0,0,0.18));
        }
        .work-card-image {
          filter: saturate(0.9) contrast(1.08) brightness(0.82);
          transition: filter 0.55s ease;
        }
        .group:hover .work-card-image {
          filter: saturate(1.05) contrast(1.12) brightness(0.92);
        }
        .work-card-copy {
          max-width: calc(100% - 3.6rem);
          transform: translateY(10px);
          transition: transform 0.36s cubic-bezier(.16,1,.3,1);
        }
        .group:hover .work-card-copy {
          transform: translateY(0);
        }
        .work-card-tag {
          border: 1px solid rgba(184,255,224,0.22);
          border-radius: 999px;
          background: rgba(3,8,6,0.42);
          padding: 0.32rem 0.58rem;
          color: rgba(184,255,224,0.82);
          font-family: var(--font-mono-next), monospace;
          font-size: 0.48rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }
        .work-card-fallback {
          background:
            radial-gradient(circle at 72% 28%, rgba(58,191,138,0.22), transparent 28%),
            radial-gradient(circle at 22% 78%, rgba(245,184,94,0.10), transparent 24%),
            rgba(4,10,7,0.96);
        }
        .work-card-fallback-grid {
          position: absolute;
          inset: 0;
          opacity: 0.42;
          background-image:
            linear-gradient(rgba(184,255,224,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,255,224,0.08) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 72%);
        }

        @media (max-width: 767px) {
          .work-card-copy {
            max-width: 100%;
            transform: none;
          }
          .work-project-card > div {
            aspect-ratio: 3 / 4 !important;
          }
          .work-card-tag {
            font-size: 0.43rem;
            letter-spacing: 0.16em;
          }
          .gif-preview {
            display: none;
          }
        }

        .gif-preview-square {
          transform:scale(0.90);
          transition:transform 0.55s cubic-bezier(0.22,1,0.36,1);
          border:1px solid rgba(58,191,138,0.38);
          border-radius:4px;
          box-shadow:0 0 44px rgba(58,191,138,0.14),0 10px 44px rgba(0,0,0,0.65);
        }
        .group:hover .gif-preview-square { transform:scale(1); }
        .gif-preview { opacity:0; transition:opacity 0.38s ease; }
        .group:hover .gif-preview { opacity:1; transition:opacity 0.30s ease; }
        .gif-corner { position:absolute; width:10px; height:10px; border-color:rgba(58,191,138,0.80); border-style:solid; }
        .gif-corner-tl { top:6px;    left:6px;  border-width:1px 0 0 1px; }
        .gif-corner-tr { top:6px;    right:6px; border-width:1px 1px 0 0; }
        .gif-corner-bl { bottom:6px; left:6px;  border-width:0 0 1px 1px; }
        .gif-corner-br { bottom:6px; right:6px; border-width:0 1px 1px 0; }
        @keyframes gif-scanline {
          0%   { top:-2px; opacity:0; }
          4%   { opacity:0.6; }
          96%  { opacity:0.4; }
          100% { top:100%; opacity:0; }
        }
        .group:hover .gif-scan-runner { animation:gif-scanline 1.8s linear infinite; }
        .gif-scan-runner { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(58,191,138,0.6),transparent); pointer-events:none; top:-2px; }
      `}</style>

      {/* ── Hero ── */}
      <WorkHero totalCount={projects.length} />

      {/* ── Grid section ── */}
      <section id="work" className="section-py border-b border-[var(--border)]" style={{ background: "transparent" }}>
        <div className="wrap">

          {/* Section header + filter */}
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">Selected projects</p>
              <h2 className="hed text-[clamp(2.7rem,5.4vw,6rem)] leading-[0.88] text-[#F8F5EE]">
                Proof in<br />
                <span className="text-[var(--teal)]">motion.</span>
              </h2>
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-black/24 px-4 py-2 font-mono text-[0.50rem] uppercase tracking-[0.22em] text-[var(--body)] backdrop-blur-md transition-all duration-200 hover:border-[var(--teal)] hover:text-[var(--teal)]"
            >
              {/* Filter icon */}
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M0.5 1h10M2.5 4.5h6M4.5 8h2" />
              </svg>
              Filter
              {activeFilter !== "All" && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
              )}
            </button>
          </div>

          <div className="mb-8 flex items-center justify-between border-y border-[var(--border)] py-4">
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.38em] text-[var(--body)] opacity-65">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              {activeFilter !== "All" && (
                <span className="ml-2 text-[var(--teal)]">— {activeFilter}</span>
              )}
            </span>
            <span className="hidden font-mono text-[0.46rem] uppercase tracking-[0.32em] text-[var(--body)] opacity-45 md:inline">
              Hover to inspect
            </span>
          </div>

          {/* Cards */}
          <div ref={gridRef} className="grid gap-5 md:grid-cols-2">
            {filteredProjects.length === 0 ? (
              <div className="py-32 text-center md:col-span-2">
                <p className="eyebrow mb-4">No results</p>
                <p className="text-[var(--body)] text-[0.9rem]">No projects in this category yet.</p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  filteredIndex={index}
                />
              ))
            )}
          </div>

        </div>
      </section>

      {/* ── Filter drawer ── */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        activeFilter={activeFilter}
        onFilter={handleFilter}
        projectCount={filteredProjects.length}
      />

      {/* ── CTA ── */}
      <BottomCTA />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Bottom CTA
// ─────────────────────────────────────────────────────────────────────
function BottomCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none none" } }
    );
  }, []);

  return (
    <section className="relative section-py text-center overflow-hidden" style={{ background: "transparent" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(58,191,138,0.055) 0%, transparent 70%)" }}
      />
      <div ref={ref} className="relative z-10 wrap" style={{ visibility: "hidden" }}>
        <div className="mx-auto mb-12 flex items-center gap-4 max-w-xs">
          <div className="h-px flex-1 bg-[var(--teal)] opacity-25" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[var(--teal)] opacity-50" />
          <div className="h-px flex-1 bg-[var(--teal)] opacity-25" />
        </div>
        <p className="eyebrow mb-6">Have a project in mind?</p>
        <h2 className="hed text-[3.8rem] mb-8">
          Let&apos;s build<br />
          <span className="text-[var(--teal)]">something unforgettable.</span>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-[0.9375rem] leading-[1.9] text-[var(--body)]">
          We&apos;re selective about what we take on. That&apos;s why our work looks like our work.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/#contact" className="btn-glass">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Start a project →</span>
          </Link>
          <Link href="/services" className="btn-glass-ghost">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Explore services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
