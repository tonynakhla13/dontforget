"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { WorkProject } from "./page";

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
// Project info side card — appears on hover
// ─────────────────────────────────────────────────────────────────────
function ProjectInfoPanel({ project }: { project: WorkProject }) {
  const galleryImages: { src: string; pos: string }[] = project.images?.length
    ? project.images.slice(0, 3).map((src) => ({ src, pos: "center center" }))
    : project.coverImage
    ? [
        { src: project.coverImage, pos: "18% center" },
        { src: project.coverImage, pos: "50% center" },
        { src: project.coverImage, pos: "82% center" },
      ]
    : [];

  return (
    <div
      className="flex h-full flex-col rounded-[var(--radius)]"
      style={{
        border: "1px solid rgba(58,191,138,0.22)",
        background: "rgba(4,9,7,0.93)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      {/* ── Cover-flow gallery — padded from top & sides, center card elevated ── */}
      {galleryImages.length > 0 && (
        <div
          className="flex-shrink-0 flex items-end gap-2"
          style={{ padding: "14px 14px 0", height: "116px" }}
        >
          {galleryImages.map(({ src, pos }, i) => {
            const isCenter = i === 1;
            return (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  flex: isCenter ? "1.25 1 0" : "1 1 0",
                  height: isCenter ? "100%" : "82%",
                  borderRadius: "6px",
                  boxShadow: isCenter
                    ? "0 6px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(58,191,138,0.18)"
                    : "0 2px 8px rgba(0,0,0,0.45)",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: pos }}
                  sizes="110px"
                />
                {isCenter && (
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 55%, rgba(4,9,7,0.35) 100%)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Text + CTAs ── */}
      <div className="flex flex-1 flex-col justify-between p-5 min-h-0">
        <div className="flex flex-col gap-3">

          {/* Category + year */}
          <div className="flex items-center justify-between">
            {project.category && (
              <span className="font-mono text-[0.44rem] uppercase tracking-[0.34em] text-[var(--teal)]">
                {project.category}
              </span>
            )}
            <span className="font-mono text-[0.42rem] uppercase tracking-[0.26em] text-[var(--body)] opacity-60">
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="hed text-[1.8rem] leading-[1.0] text-[var(--fg)]">
            {project.title}
          </h3>

          <div className="h-px w-8 bg-[var(--teal)] opacity-40" />

          {/* Description — brighter, slightly larger */}
          {project.description && (
            <p className="text-[0.80rem] leading-[1.82]" style={{ color: "rgba(220,230,225,0.78)" }}>
              {project.description}
            </p>
          )}

          {/* Tags — teal, bigger */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full font-mono uppercase"
                  style={{
                    border: "1px solid rgba(58,191,138,0.45)",
                    background: "rgba(58,191,138,0.09)",
                    color: "var(--teal)",
                    fontSize: "0.50rem",
                    letterSpacing: "0.20em",
                    padding: "4px 10px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Buttons — equal size ── */}
        <div
          className="mt-4 pt-4 flex flex-col gap-2.5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* View project — outline */}
          <a
            href={`/work/${project.slug ?? project.id}`}
            className="flex items-center justify-center gap-2 rounded-full font-mono uppercase transition-all duration-200"
            style={{
              border: "1px solid rgba(58,191,138,0.50)",
              color: "var(--teal)",
              fontSize: "0.48rem",
              letterSpacing: "0.22em",
              padding: "10px 16px",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(58,191,138,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            View project
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 13L13 3M13 3H6M13 3V10" />
            </svg>
          </a>

          {/* Start a project — filled */}
          <a
            href="/immersive/contact"
            className="flex items-center justify-center rounded-full font-mono uppercase transition-opacity duration-200 hover:opacity-85"
            style={{
              background: "var(--teal)",
              color: "rgba(3,8,6,1)",
              fontSize: "0.48rem",
              letterSpacing: "0.22em",
              padding: "10px 16px",
              fontWeight: 600,
            }}
          >
            Start a project →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Project card — 4/3 aspect, two-column
// ─────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  filteredIndex,
  onEnter,
}: {
  project: WorkProject;
  filteredIndex: number;
  onEnter: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const num      = String(filteredIndex + 1).padStart(2, "0");

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
    <a
      href={`/work/${project.slug ?? project.id}`}
      data-card
      className="group relative block"
      style={{ clipPath: "inset(0 0 100% 0)", willChange: "clip-path, transform" }}
      onMouseMove={onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={innerRef}
        className="relative overflow-hidden rounded-[var(--radius)] bg-[var(--surface)]"
        style={{ transformStyle: "preserve-3d", aspectRatio: "4 / 3" }}
      >
        {/* Image */}
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 42vw"
            />
          ) : (
            <div className="h-full w-full bg-[var(--surface2)]" />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

        {/* Teal border */}
        <div className="absolute inset-0 rounded-[var(--radius)] border border-transparent transition-colors duration-300 group-hover:border-[rgba(58,191,138,0.30)]" />

        {/* Scan line */}
        <div className="work-card-scan absolute inset-0 pointer-events-none overflow-hidden rounded-[var(--radius)]">
          <div className="scan-runner absolute left-0 right-0 h-[1px]" />
        </div>

        {/* GIF preview square — fits inside card with padding, centred */}
        <div className="gif-preview absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="gif-preview-square relative overflow-hidden" style={{ height: "calc(100% - 52px)", maxWidth: "calc(100% - 52px)", aspectRatio: "1 / 1" }}>
            {project.gifUrl ? (
              <img src={project.gifUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <>
                <div className="w-full h-full" style={{ background: "rgba(6,12,10,0.78)", backdropFilter: "blur(12px)" }} />
                <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(58,191,138,0.035) 3px,rgba(58,191,138,0.035) 4px)" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="font-mono text-[0.44rem] uppercase tracking-[0.38em] text-[var(--teal)] opacity-55">Preview</span>
                  <div className="h-px w-8 bg-[var(--teal)] opacity-25" />
                  <span className="font-mono text-[0.38rem] uppercase tracking-[0.22em] text-[var(--body)] opacity-40">{project.liveUrl ?? project.slug}</span>
                </div>
              </>
            )}
            <div className="gif-corner gif-corner-tl" />
            <div className="gif-corner gif-corner-tr" />
            <div className="gif-corner gif-corner-bl" />
            <div className="gif-corner gif-corner-br" />
            <div className="gif-scan-runner" />
          </div>
        </div>

        {/* Top meta */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 font-mono text-[0.52rem] text-white/60 transition-all duration-300 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]">
            {num}
          </span>
          {project.category && (
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[0.52rem] uppercase tracking-[0.24em] text-white/50 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--teal-mid)] group-hover:text-[var(--teal)]">
              {project.category}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
          <div>
            <p className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.32em] text-white/40">{project.year}</p>
            <h3 className="hed text-[1.55rem] leading-[1.0]">{project.title}</h3>
          </div>
          <div className="flex h-10 w-10 shrink-0 translate-x-2 translate-y-2 items-center justify-center rounded-full border border-white/10 text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)] group-hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13L13 3M13 3H6M13 3V10" />
            </svg>
          </div>
        </div>
      </div>
    </a>
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
      <div className="relative z-10 wrap flex items-center pt-32 pb-20">
        <div className="max-w-[760px]">
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
            <a href="/immersive/contact" className="btn btn-primary btn-ripple">Start a project</a>
            <a href="/services" className="btn btn-outline">Our services →</a>
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
  const [hoveredCard, setHoveredCard]   = useState<number | null>(null);

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

  // rows of 2
  const rows = useMemo(() => {
    const r: [WorkProject, WorkProject | undefined][] = [];
    for (let i = 0; i < filteredProjects.length; i += 2) r.push([filteredProjects[i], filteredProjects[i + 1]]);
    return r;
  }, [filteredProjects]);

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
    setHoveredCard(null);

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
        .group:hover .scan-runner { top:-2px; animation:work-scan 0.7s ease-out forwards; }
        .scan-runner { background:linear-gradient(90deg,transparent,rgba(58,191,138,0.75),transparent); pointer-events:none; top:-2px; }

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
      <section className="section-py border-b border-[var(--border)]" style={{ background: "transparent" }}>
        <div className="wrap">

          {/* Top bar: count + filter button */}
          <div className="mb-8 flex items-center justify-between">
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.38em] text-[var(--body)] opacity-55">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              {activeFilter !== "All" && (
                <span className="ml-2 text-[var(--teal)]">— {activeFilter}</span>
              )}
            </span>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 font-mono text-[0.50rem] uppercase tracking-[0.22em] text-[var(--body)] transition-all duration-200 hover:border-[var(--teal)] hover:text-[var(--teal)]"
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

          {/* Rows */}
          <div ref={gridRef} className="flex flex-col gap-5">
            {filteredProjects.length === 0 ? (
              <div className="py-32 text-center">
                <p className="eyebrow mb-4">No results</p>
                <p className="text-[var(--body)] text-[0.9rem]">No projects in this category yet.</p>
              </div>
            ) : (
              rows.map(([leftProj, rightProj], rowIdx) => {
                const leftIdx     = rowIdx * 2;
                const rightIdx    = rowIdx * 2 + 1;
                const leftHovered  = hoveredCard === leftIdx;
                const rightHovered = hoveredCard === rightIdx;
                const infoTx = "cubic-bezier(0.34,1.2,0.64,1)";

                return (
                  <div
                    key={`${leftProj.id}-${rightProj?.id ?? "empty"}`}
                    className="relative"
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* 2-column card grid */}
                    <div className="grid grid-cols-2 gap-5">

                      {/* Left card wrapper — squeezes when right is hovered */}
                      <div
                        style={{
                          transform: rightHovered ? "scale(0.91)" : "scale(1)",
                          transformOrigin: "right center",
                          transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
                          position: "relative",
                          zIndex: leftHovered ? 2 : 1,
                        }}
                      >
                        <ProjectCard
                          project={leftProj}
                          filteredIndex={leftIdx}
                          onEnter={() => setHoveredCard(leftIdx)}
                        />
                      </div>

                      {/* Right card wrapper — squeezes when left is hovered */}
                      {rightProj ? (
                        <div
                          style={{
                            transform: leftHovered ? "scale(0.91)" : "scale(1)",
                            transformOrigin: "left center",
                            transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
                            position: "relative",
                            zIndex: rightHovered ? 2 : 1,
                          }}
                        >
                          <ProjectCard
                            project={rightProj}
                            filteredIndex={rightIdx}
                            onEnter={() => setHoveredCard(rightIdx)}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>

                    {/* ── Info card for LEFT card — floats over right half ── */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0, bottom: 0,
                        left: "calc(50% + 10px)",
                        right: 0,
                        zIndex: 20,
                        pointerEvents: leftHovered ? "auto" : "none",
                        opacity: leftHovered ? 1 : 0,
                        transform: leftHovered
                          ? "translateX(0) scale(1)"
                          : "translateX(12px) scale(0.97)",
                        transition: `opacity 0.24s ease ${leftHovered ? "0.08s" : "0s"}, transform 0.38s ${infoTx} ${leftHovered ? "0.04s" : "0s"}`,
                      }}
                    >
                      <ProjectInfoPanel project={leftProj} />
                    </div>

                    {/* ── Info card for RIGHT card — floats over left half ── */}
                    {rightProj && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0, bottom: 0,
                          right: "calc(50% + 10px)",
                          left: 0,
                          zIndex: 20,
                          pointerEvents: rightHovered ? "auto" : "none",
                          opacity: rightHovered ? 1 : 0,
                          transform: rightHovered
                            ? "translateX(0) scale(1)"
                            : "translateX(-12px) scale(0.97)",
                          transition: `opacity 0.24s ease ${rightHovered ? "0.08s" : "0s"}, transform 0.38s ${infoTx} ${rightHovered ? "0.04s" : "0s"}`,
                        }}
                      >
                        <ProjectInfoPanel project={rightProj} />
                      </div>
                    )}
                  </div>
                );
              })
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
          <a href="/#contact" className="btn btn-primary btn-ripple">Start a project →</a>
          <a href="/services" className="btn btn-outline">Explore services</a>
        </div>
      </div>
    </section>
  );
}
