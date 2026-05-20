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
// Editorial layout — repeats every 7 cards
// Defined as full static strings so Tailwind/build scanners can detect them
// ─────────────────────────────────────────────────────────────────────
const CARD_LAYOUTS = [
  { colSpan: 7, aspect: "7 / 4",  label: "wide"     },
  { colSpan: 5, aspect: "4 / 5",  label: "portrait"  },
  { colSpan: 4, aspect: "4 / 3",  label: "landscape" },
  { colSpan: 4, aspect: "4 / 3",  label: "landscape" },
  { colSpan: 4, aspect: "4 / 3",  label: "landscape" },
  { colSpan: 5, aspect: "4 / 5",  label: "portrait"  },
  { colSpan: 7, aspect: "7 / 4",  label: "wide"      },
] as const;

function getLayout(filteredIndex: number) {
  return CARD_LAYOUTS[filteredIndex % 7];
}

// ─────────────────────────────────────────────────────────────────────
// Individual project card
// ─────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  filteredIndex,
  globalIndex,
}: {
  project: WorkProject;
  filteredIndex: number;
  globalIndex: number;
}) {
  const layout    = getLayout(filteredIndex);
  const innerRef  = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLDivElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);

  // 3-D tilt via event delegation on the card inner
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;

    gsap.to(innerRef.current, {
      rotationX: -y * 7,
      rotationY:  x * 9,
      transformPerspective: 900,
      ease: "power1.out",
      duration: 0.35,
      overwrite: true,
    });
    gsap.to(imgRef.current, {
      scale: 1.055,
      duration: 0.55,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(innerRef.current, {
      rotationX: 0, rotationY: 0,
      duration: 0.6, ease: "power3.out",
      overwrite: true,
    });
    gsap.to(imgRef.current, {
      scale: 1,
      duration: 0.55, ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const num = String(filteredIndex + 1).padStart(2, "0");

  return (
    <a
      href={`/work/${project.slug ?? project.id}`}
      data-card
      className="group relative block"
      style={{
        "--col-span": layout.colSpan,
        clipPath: "inset(0 0 100% 0)",
        willChange: "clip-path, transform",
      } as React.CSSProperties}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Inner — the element we apply 3-D tilt to */}
      <div
        ref={innerRef}
        className="relative overflow-hidden rounded-[var(--radius)] bg-[var(--surface)]"
        style={{
          transformStyle: "preserve-3d",
          aspectRatio: layout.aspect,
        }}
      >
        {/* Image */}
        <div
          ref={imgRef}
          className="absolute inset-0 will-change-transform"
        >
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 55vw"
            />
          ) : (
            <div className="h-full w-full bg-[var(--surface2)]" />
          )}
        </div>

        {/* Gradient overlay — always visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

        {/* Teal corner accent — appears on hover */}
        <div className="absolute inset-0 rounded-[var(--radius)] border border-transparent transition-colors duration-300 group-hover:border-[rgba(58,191,138,0.30)]" />

        {/* Scan line — CSS animation on hover */}
        <div className="work-card-scan absolute inset-0 pointer-events-none overflow-hidden rounded-[var(--radius)]">
          <div className="scan-runner absolute left-0 right-0 h-[1px]" />
        </div>

        {/* ── TOP meta ── */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
          {/* Number badge */}
          <span
            ref={numRef}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 font-mono text-[0.55rem] text-white/60 transition-all duration-300 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]"
          >
            {num}
          </span>

          {/* Category */}
          {project.category && (
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[0.52rem] uppercase tracking-[0.24em] text-white/50 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--teal-mid)] group-hover:text-[var(--teal)]">
              {project.category}
            </span>
          )}
        </div>

        {/* ── BOTTOM info ── */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-7">
          <div>
            <p className="mb-1.5 font-mono text-[0.5rem] uppercase tracking-[0.32em] text-white/40">
              {project.year}
            </p>
            <h3
              className="hed leading-[1.0]"
              style={{
                fontSize: layout.label === "landscape" ? "1.55rem" : layout.label === "portrait" ? "1.7rem" : "2rem",
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Arrow */}
          <div className="flex h-11 w-11 shrink-0 translate-x-2 translate-y-2 items-center justify-center rounded-full border border-white/10 text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-[var(--teal)] group-hover:text-[var(--teal)] group-hover:opacity-100">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13L13 3M13 3H6M13 3V10" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Filter pill
// ─────────────────────────────────────────────────────────────────────
function Pill({
  label,
  active,
  onClick,
  pillRef,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  pillRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={pillRef}
      onClick={onClick}
      className={`relative z-10 flex-shrink-0 rounded-full border px-4 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] transition-colors duration-200 ${
        active
          ? "border-[var(--teal)] bg-[var(--teal-faint)] text-[var(--teal)]"
          : "border-[var(--border)] text-[var(--body)] hover:border-[var(--teal-mid)] hover:text-[var(--fg)]"
      }`}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Hero — dramatic opening with outlined display text + counter
// ─────────────────────────────────────────────────────────────────────
function WorkHero({ totalCount }: { totalCount: number }) {
  const lineRef     = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const rulerRef    = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const countLblRef = useRef<HTMLParagraphElement>(null);
  const descRef     = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.45 });

    // 1. Horizontal rule draws from left
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out", transformOrigin: "left" });

    // 2. Eyebrow slides up
    tl.fromTo(eyebrowRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2");

    // 3. WORK outlined text wipes in from left (clip-path)
    tl.fromTo(
      titleRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "expo.out" },
      "-=0.15"
    );

    // 4. Teal rule extends
    tl.fromTo(rulerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.out", transformOrigin: "left" }, "-=0.4");

    // 5. Counter counts up
    const obj = { v: 0 };
    tl.to(obj, {
      v: totalCount,
      duration: 0.9,
      snap: { v: 1 },
      ease: "power2.inOut",
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(obj.v)).padStart(2, "0");
        }
      },
    }, "-=0.6");
    tl.fromTo(countLblRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "-=0.3");

    // 6. Right column and description
    tl.fromTo(
      [descRef.current, metaRef.current],
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" },
      "-=0.5"
    );
  }, [totalCount]);

  return (
    <section
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-28 pb-12"
      style={{ background: "transparent" }}
    >
      {/* Horizontal rule top accent */}
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px"
        style={{
          top: "26%",
          background: "linear-gradient(90deg, rgba(58,191,138,0.55) 0%, rgba(58,191,138,0.12) 60%, transparent 100%)",
          transform: "scaleX(0)",
          transformOrigin: "left",
        }}
      />

      <div className="relative z-10 wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">

          {/* ── Left: main title block ── */}
          <div>
            <p
              ref={eyebrowRef}
              className="eyebrow mb-6"
              style={{ visibility: "hidden" }}
            >
              Selected work
            </p>

            {/* Outlined ghost type */}
            <h1
              ref={titleRef}
              className="font-display uppercase leading-[0.88]"
              style={{
                fontSize: "clamp(5.5rem, 18vw, 18rem)",
                WebkitTextStroke: "1.5px rgba(58,191,138,0.75)",
                color: "transparent",
                letterSpacing: "0.02em",
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              WORK
            </h1>

            {/* Teal rule */}
            <div
              ref={rulerRef}
              className="mt-6 mb-7 h-px origin-left bg-gradient-to-r from-[var(--teal)] via-[var(--teal-mid)] to-transparent"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />

            {/* Counter */}
            <div className="flex items-baseline gap-3">
              <span
                ref={counterRef}
                className="font-mono tabular-nums text-[4.5rem] leading-none text-[var(--teal)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                00
              </span>
              <p
                ref={countLblRef}
                className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-[var(--body)]"
                style={{ visibility: "hidden" }}
              >
                Projects
              </p>
            </div>
          </div>

          {/* ── Right: description + meta ── */}
          <div className="pb-4">
            <p
              ref={descRef}
              className="text-[0.9375rem] leading-[1.9] text-[var(--body)] mb-8"
              style={{ visibility: "hidden" }}
            >
              Websites that stop the scroll. Apps people keep opening.
              Stores built to convert. Every project is a reason to{" "}
              <span className="text-[var(--fg)]">remember us.</span>
            </p>

            {/* Vertical category stack */}
            <div
              ref={metaRef}
              className="space-y-2"
              style={{ visibility: "hidden" }}
            >
              {["Web Dev", "UI / UX", "E-Commerce", "Mobile", "CRM", "Brand"].map((cat) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="h-px w-5 bg-[var(--teal)] opacity-40" />
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.3em] text-[var(--body)]">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main content component
// ─────────────────────────────────────────────────────────────────────
export default function WorkListContent({ projects }: { projects: WorkProject[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const gridRef       = useRef<HTMLDivElement>(null);
  const filterBarRef  = useRef<HTMLDivElement>(null);
  const indicatorRef  = useRef<HTMLDivElement>(null);
  const countRef      = useRef<HTMLSpanElement>(null);
  const pillRefs      = useRef<(HTMLButtonElement | null)[]>([]);
  const isAnimating   = useRef(false);
  const hasRevealedRef = useRef(false);

  // Derive unique categories (keep insertion order)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = ["All"];
    projects.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    });
    return list;
  }, [projects]);

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  );

  // ── Animate filter indicator ───────────────────────────────────────
  const moveIndicator = useCallback((index: number) => {
    const pill = pillRefs.current[index];
    const indicator = indicatorRef.current;
    if (!pill || !indicator) return;
    gsap.to(indicator, {
      x: pill.offsetLeft,
      width: pill.offsetWidth,
      duration: 0.42,
      ease: "power3.out",
    });
  }, []);

  // ── Initial grid reveal (clip-path wipe, triggered by scroll) ─────
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: grid,
        start: "top 88%",
        once: true,
        onEnter() {
          if (hasRevealedRef.current) return;
          hasRevealedRef.current = true;
          const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
          gsap.to(cards, {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.75,
            stagger: { amount: 0.55, from: "start" },
            ease: "expo.out",
          });
        },
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  // ── Move indicator to first pill on mount ─────────────────────────
  useEffect(() => {
    moveIndicator(0);
  }, [moveIndicator]);

  // ── Filter handler ────────────────────────────────────────────────
  const handleFilter = useCallback(
    async (cat: string, pillIndex: number) => {
      if (cat === activeFilter || isAnimating.current) return;
      isAnimating.current = true;

      moveIndicator(pillIndex);

      const grid = gridRef.current;
      const cards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);

      // Exit
      if (cards.length) {
        await gsap.to(cards, {
          autoAlpha: 0,
          y: -20,
          scale: 0.96,
          duration: 0.22,
          stagger: { amount: 0.1, from: "start" },
          ease: "power2.in",
        });
      }

      // Update state (re-render)
      setActiveFilter(cat);

      // Wait for React to commit new DOM
      await new Promise<void>((r) => requestAnimationFrame(() => { requestAnimationFrame(() => r()); }));

      // Animate counter
      const newCount = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
      if (countRef.current) {
        const obj = { v: cards.length };
        gsap.to(obj, {
          v: newCount,
          duration: 0.5,
          snap: { v: 1 },
          ease: "power2.inOut",
          onUpdate() {
            if (countRef.current) countRef.current.textContent = String(Math.round(obj.v));
          },
        });
      }

      // Enter new cards
      const newCards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
      if (newCards.length) {
        gsap.set(newCards, { autoAlpha: 0, y: 22, scale: 0.96, clipPath: "inset(0 0 0% 0)" });
        await gsap.to(newCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.38,
          stagger: { amount: 0.28, from: "start" },
          ease: "power3.out",
        });
      }

      isAnimating.current = false;
    },
    [activeFilter, moveIndicator, projects]
  );

  return (
    <>
      {/* Scan line + grid CSS-var styles */}
      <style>{`
        @keyframes work-scan {
          0%   { top: -2px;  opacity: 0.0; }
          5%   { opacity: 0.9; }
          95%  { opacity: 0.7; }
          100% { top: 100%;   opacity: 0.0; }
        }
        .group:hover .scan-runner {
          top: -2px;
          animation: work-scan 0.7s ease-out forwards;
        }
        .scan-runner {
          background: linear-gradient(90deg, transparent, rgba(58,191,138,0.75), transparent);
          pointer-events: none;
          top: -2px;
        }
      `}</style>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <WorkHero totalCount={projects.length} />

      {/* ── Sticky filter bar ──────────────────────────────────────── */}
      <div
        ref={filterBarRef}
        className="sticky z-50 border-t border-b border-[var(--border)] backdrop-blur-xl"
        style={{
          top: 86,
          background: "rgba(9,9,9,0.90)",
        }}
      >
        <div className="wrap flex items-center gap-6 py-4">
          {/* Pills + sliding indicator */}
          <div className="relative flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Indicator bar */}
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute bottom-0 h-px bg-[var(--teal)]"
              style={{ left: 0, width: 0 }}
            />

            {categories.map((cat, i) => (
              <Pill
                key={cat}
                label={cat}
                active={activeFilter === cat}
                onClick={() => handleFilter(cat, i)}
                pillRef={(el) => { pillRefs.current[i] = el; }}
              />
            ))}
          </div>

          {/* Count */}
          <div className="shrink-0 flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-[var(--body)]">
            <span ref={countRef}>{filteredProjects.length}</span>
            <span>projects</span>
          </div>
        </div>
      </div>

      {/* ── Editorial grid ─────────────────────────────────────────── */}
      <section
        className="section-py border-b border-[var(--border)]"
        style={{ background: "var(--bg)" }}
      >
        <div className="wrap">
          {filteredProjects.length === 0 ? (
            <div className="py-32 text-center">
              <p className="eyebrow mb-4">No results</p>
              <p className="text-[var(--body)] text-[0.9rem]">
                No projects in this category yet.
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
            >
              {filteredProjects.map((p, filteredIndex) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  filteredIndex={filteredIndex}
                  globalIndex={filteredIndex}
                />
              ))}

              {/* Mobile override — force 1-column on small screens via wrapper */}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
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
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none none" },
      }
    );
  }, []);

  return (
    <section
      className="relative section-py text-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(58,191,138,0.055) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="relative z-10 wrap" style={{ visibility: "hidden" }}>
        {/* Decorative top line */}
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
          <a href="/#contact" className="btn btn-primary btn-ripple">
            Start a project →
          </a>
          <a href="/services" className="btn btn-outline">
            Explore services
          </a>
        </div>
      </div>
    </section>
  );
}
