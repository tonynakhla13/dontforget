"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type MouseEvent as RMouseEvent,
  type PointerEvent as RPointerEvent,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/components/Work";

/* ── shared helpers ─────────────────────────── */

const PROJECT_META: Record<string, { kind: string; business: string }> = {
  "elia-clinic": { kind: "Website", business: "Healthcare" },
  montgab: { kind: "E-Commerce", business: "Retail" },
  "180-degrees": { kind: "UI/UX", business: "Agency / Brand" },
  launchpad: { kind: "App", business: "SaaS Platform" },
};

const FALLBACK: Project[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description:
      "Calm, conversion-led medical site with modular content and refined motion.",
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description:
      "Tactile storefront balancing product storytelling, speed, and editorial whitespace.",
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "180-degrees",
    slug: "180-degrees",
    title: "180 Degrees",
    category: "Agency / Brand",
    year: "2026",
    description:
      "A flexible studio identity translated into web, motion, and campaign surfaces.",
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description:
      "Developer-focused dashboard built for speed, clarity, and team collaboration.",
    liveUrl: null,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

function slugFor(p: Project) {
  return p.slug ?? p.id;
}

function coverFor(p: Project) {
  if (p.coverImage) return p.coverImage;
  const slug = slugFor(p);
  const known = FALLBACK.find(
    (f) => f.id === slug || f.slug === slug || f.title === p.title
  )?.coverImage;
  if (known) return known;
  const idx =
    [...slug].reduce((s, c) => s + c.charCodeAt(0), 0) % FALLBACK.length;
  return FALLBACK[idx]?.coverImage ?? null;
}

function metaFor(p: Project) {
  return (
    PROJECT_META[slugFor(p)] ?? {
      kind: p.category?.includes("App")
        ? "App"
        : p.category?.includes("Commerce")
          ? "E-Commerce"
          : "Website",
      business: p.category ?? "Business",
    }
  );
}

function projectHref(p: Project) {
  return `/work/${encodeURIComponent(slugFor(p))}`;
}

/* ═══════════════════════════════════════════════
   1.  FUTURISTIC GRID
   ═══════════════════════════════════════════════ */

function GridCard({
  project,
  index,
  span,
}: {
  project: Project;
  index: number;
  span: "hero" | "tall" | "wide" | "square";
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const meta = metaFor(project);
  const cover = coverFor(project);

  /* ── scroll-triggered entrance ── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 40%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        el,
        {
          opacity: 0,
          y: 90,
          rotateX: 8,
          scale: 0.92,
          filter: "blur(10px) brightness(0.3)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 1,
          delay: index * 0.12,
          ease: "expo.out",
        }
      );

      // scan-line sweep on enter
      if (scanRef.current) {
        tl.fromTo(
          scanRef.current,
          { y: "-100%" },
          { y: "200%", duration: 0.8, ease: "power2.inOut" },
          "-=0.5"
        );
      }
    });

    return () => ctx.revert();
  }, [index]);

  /* ── parallax tilt + glow follow on mouse move ── */
  const onMouseMove = useCallback(
    (e: RMouseEvent<HTMLAnchorElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * 14;
      const rotX = (0.5 - y) * 10;

      gsap.to(el, {
        rotateY: rotY,
        rotateX: rotX,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          x: (x - 0.5) * -20,
          y: (y - 0.5) * -20,
          scale: 1.08,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 1,
          background: `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(var(--teal-rgb), 0.15), transparent 50%)`,
          duration: 0.3,
          overwrite: "auto",
        });
      }
    },
    []
  );

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4, overwrite: "auto" });
    }
  }, []);

  const aspectMap = {
    hero: "row-span-2 col-span-2 aspect-[4/3]",
    tall: "row-span-2 aspect-[3/5]",
    wide: "col-span-2 aspect-[2/1]",
    square: "aspect-square",
  };

  return (
    <Link
      ref={cardRef}
      href={projectHref(project)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`wk-grid-card group relative block overflow-hidden rounded-xl border border-white/[0.06] bg-[var(--surface)] ${aspectMap[span]} will-change-transform`}
      style={{ perspective: "900px", transformStyle: "preserve-3d" }}
    >
      {/* cover image with parallax */}
      <div ref={imgRef} className="absolute -inset-4 will-change-transform">
        {cover && (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-cover transition-[filter] duration-700 group-hover:brightness-[0.55]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {/* cursor-follow glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0"
      />

      {/* scan-line */}
      <div
        ref={scanRef}
        className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-70"
      />

      {/* overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-transparent to-[rgba(var(--teal-rgb),0.06)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* corner brackets that animate in on hover */}
      <div className="pointer-events-none absolute inset-3 z-20">
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[var(--teal)] opacity-0 transition-all duration-500 -translate-x-2 -translate-y-2 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[var(--teal)] opacity-0 transition-all duration-500 translate-x-2 -translate-y-2 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[var(--teal)] opacity-0 transition-all duration-500 -translate-x-2 translate-y-2 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[var(--teal)] opacity-0 transition-all duration-500 translate-x-2 translate-y-2 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
      </div>

      {/* HUD index */}
      <div className="absolute left-5 top-5 z-20 font-mono text-[0.55rem] tracking-[0.3em] text-[var(--teal)] opacity-0 transition-all duration-400 -translate-y-2 group-hover:opacity-70 group-hover:translate-y-0">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* year badge */}
      {project.year && (
        <div className="absolute right-5 top-5 z-20 overflow-hidden rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 font-mono text-[0.5rem] tracking-[0.2em] text-white/30 backdrop-blur-sm transition-all duration-500 group-hover:border-[rgba(var(--teal-rgb),0.3)] group-hover:text-[var(--teal)]">
          {project.year}
        </div>
      )}

      {/* content */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7"
      >
        <div className="mb-2 flex items-center gap-2 opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="relative overflow-hidden rounded-sm bg-[rgba(var(--teal-rgb),0.12)] px-2.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[var(--teal)]">
            {meta.kind}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(var(--teal-rgb),0.2)] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="rounded-sm border border-white/[0.08] px-2.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-white/40">
            {meta.business}
          </span>
        </div>

        <h3
          className={`hed uppercase leading-[0.82] text-white ${
            span === "hero"
              ? "text-[clamp(2.2rem,5vw,4rem)]"
              : span === "wide"
                ? "text-[clamp(1.8rem,3.2vw,3rem)]"
                : "text-[clamp(1.4rem,2.6vw,2.2rem)]"
          }`}
        >
          {project.title}
        </h3>

        {(span === "hero" || span === "wide" || span === "tall") && (
          <p className="mt-2.5 max-w-[420px] font-mono text-[0.62rem] leading-[1.6] text-white/40 opacity-0 transition-all duration-500 delay-75 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
            {project.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 opacity-0 transition-all duration-500 delay-100 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[rgba(var(--teal-rgb),0.3)] bg-[rgba(var(--teal-rgb),0.06)] px-4 py-2 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[var(--teal)] backdrop-blur-sm transition-all duration-300 group-hover:bg-[rgba(var(--teal-rgb),0.12)] group-hover:shadow-[0_0_30px_rgba(var(--teal-rgb),0.12)]">
            Explore
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[1px] bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
    </Link>
  );
}

export function WorkGrid({ projects }: { projects?: Project[] }) {
  const pathname = usePathname();
  const list = projects?.length ? projects : FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const spanPattern: Array<"hero" | "tall" | "wide" | "square"> = [
    "hero",
    "tall",
    "wide",
    "square",
    "square",
    "tall",
    "hero",
    "square",
  ];

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const chars = headingRef.current!.querySelectorAll(".wk-char");
      gsap.fromTo(
        chars,
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--border)] bg-transparent px-[var(--gutter)] pb-28 pt-24 text-white"
      style={{ perspective: "1200px" }}
    >
      {/* ambient bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(var(--teal-rgb),0.04),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_80%_80%,rgba(var(--teal-rgb),0.025),transparent_50%)]" />

      {/* heading */}
      <div ref={headingRef} className="relative z-10 mb-16 max-w-5xl">
        <p className="eyebrow mb-5">Portfolio — Grid</p>
        <h2
          className="hed text-[clamp(2.4rem,5vw,5rem)] leading-[0.84]"
          style={{ perspective: "600px" }}
        >
          {"Work that ".split("").map((ch, i) => (
            <span key={i} className="wk-char inline-block" style={{ transformOrigin: "bottom" }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
          {"speaks.".split("").map((ch, i) => (
            <span
              key={`t${i}`}
              className="wk-char inline-block text-[var(--teal)]"
              style={{ transformOrigin: "bottom" }}
            >
              {ch}
            </span>
          ))}
        </h2>
        <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[var(--teal)] to-transparent opacity-50" />
      </div>

      {/* grid */}
      <div className="relative z-10 grid auto-rows-[minmax(220px,1fr)] gap-3 md:grid-cols-3 lg:grid-cols-4">
        {list.map((project, i) => (
          <GridCard
            key={project.id}
            project={project}
            index={i}
            span={spanPattern[i % spanPattern.length]}
          />
        ))}
      </div>

      <style>{`
        .wk-grid-card {
          transition: border-color 0.5s, box-shadow 0.5s;
        }
        .wk-grid-card:hover {
          border-color: rgba(var(--teal-rgb), 0.18);
          box-shadow:
            0 0 60px rgba(var(--teal-rgb), 0.06),
            0 30px 80px rgba(0,0,0,0.4),
            inset 0 0 80px rgba(var(--teal-rgb), 0.02);
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   2.  FUTURISTIC CAROUSEL
   ═══════════════════════════════════════════════ */

export function WorkCarouselV2({ projects }: { projects?: Project[] }) {
  const list = projects?.length ? projects : FALLBACK;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const tweenRef = useRef({ x: 0 });
  const dragRef = useRef({
    down: false,
    startX: 0,
    originX: 0,
    moved: false,
  });

  const cardW = useRef(0);

  const measure = useCallback(() => {
    if (!trackRef.current) return 0;
    const first = trackRef.current.children[0] as HTMLElement | undefined;
    if (!first) return 0;
    cardW.current = first.offsetWidth + 20; // gap
    return cardW.current;
  }, []);

  const goTo = useCallback(
    (idx: number, skipAnim = false) => {
      const clamped = Math.max(0, Math.min(list.length - 1, idx));
      setActive(clamped);
      const w = measure();
      if (!w) return;
      const target = -clamped * w;
      if (skipAnim) {
        tweenRef.current.x = target;
        gsap.set(trackRef.current, { x: target });
      } else {
        gsap.to(tweenRef.current, {
          x: target,
          duration: 0.9,
          ease: "expo.out",
          overwrite: true,
          onUpdate: () => {
            gsap.set(trackRef.current, { x: tweenRef.current.x });
          },
        });
      }
    },
    [list.length, measure]
  );

  /* entrance animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.fromTo(
          headRef.current,
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          }
        );
      }

      if (trackRef.current) {
        const cards = trackRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, x: 120, rotateY: -25, scale: 0.85 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  /* drag */
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    measure();
    dragRef.current = {
      down: true,
      startX: e.clientX,
      originX: tweenRef.current.x,
      moved: false,
    };
    gsap.killTweensOf(tweenRef.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) d.moved = true;
    const nextX = d.originX + dx;
    tweenRef.current.x = nextX;
    gsap.set(trackRef.current, { x: nextX });
  };

  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.down) return;
    d.down = false;
    if (!d.moved) return;
    const dx = e.clientX - d.startX;
    const w = cardW.current || measure();
    const threshold = w * 0.2;
    let nextIdx = active;
    if (dx < -threshold) nextIdx = active + 1;
    else if (dx > threshold) nextIdx = active - 1;
    goTo(nextIdx);
  };

  const onCardClick = (e: RMouseEvent<HTMLAnchorElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => (dragRef.current.moved = false), 0);
    }
  };

  /* progress bar */
  useEffect(() => {
    if (!progressRef.current) return;
    const pct = list.length <= 1 ? 100 : (active / (list.length - 1)) * 100;
    gsap.to(progressRef.current, {
      width: `${pct}%`,
      duration: 0.7,
      ease: "power3.out",
    });
  }, [active, list.length]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--border)] bg-transparent pb-28 pt-24 text-white"
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_30%_50%,rgba(var(--teal-rgb),0.035),transparent_60%)]" />

      {/* heading + nav */}
      <div
        ref={headRef}
        className="relative z-10 mb-12 flex items-end justify-between px-[var(--gutter)]"
      >
        <div>
          <p className="eyebrow mb-5">Portfolio — Carousel</p>
          <h2 className="hed text-[clamp(2.4rem,5vw,5rem)] leading-[0.84]">
            Case{" "}
            <span className="text-[var(--teal)]">studies.</span>
          </h2>
          <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[var(--teal)] to-transparent opacity-50" />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* counter */}
          <span className="mr-4 font-mono text-[0.7rem] tracking-[0.2em] text-white/40">
            <span className="text-[var(--teal)]">
              {String(active + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(list.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="wk-nav-btn flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-[var(--surface)] text-white/50 transition-all duration-400 hover:border-[rgba(var(--teal-rgb),0.4)] hover:text-[var(--teal)] hover:shadow-[0_0_25px_rgba(var(--teal-rgb),0.1)] disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => goTo(active + 1)}
            disabled={active === list.length - 1}
            className="wk-nav-btn flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-[var(--surface)] text-white/50 transition-all duration-400 hover:border-[rgba(var(--teal-rgb),0.4)] hover:text-[var(--teal)] hover:shadow-[0_0_25px_rgba(var(--teal-rgb),0.1)] disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* track */}
      <div
        className="relative z-10 touch-pan-y select-none overflow-visible px-[var(--gutter)]"
        style={{ cursor: dragRef.current.down ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {list.map((project, i) => {
            const meta = metaFor(project);
            const cover = coverFor(project);
            const isActive = i === active;
            const offset = i - active;

            return (
              <Link
                key={project.id}
                href={projectHref(project)}
                onClick={onCardClick}
                className="wk-carousel-card group relative flex-none overflow-hidden rounded-2xl border bg-[var(--surface)] will-change-transform"
                style={{
                  width: "min(560px, 80vw)",
                  borderColor: isActive
                    ? "rgba(var(--teal-rgb), 0.2)"
                    : "rgba(255,255,255,0.04)",
                  transform: `perspective(1000px) rotateY(${offset * -3}deg) scale(${isActive ? 1 : 0.94})`,
                  opacity: Math.abs(offset) > 3 ? 0.3 : isActive ? 1 : 0.6,
                  transition:
                    "border-color 0.5s, transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s, box-shadow 0.5s",
                  boxShadow: isActive
                    ? "0 0 60px rgba(var(--teal-rgb), 0.07), 0 40px 100px rgba(0,0,0,0.5)"
                    : "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                {/* image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {cover && (
                    <Image
                      src={cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.65]"
                      sizes="(max-width: 768px) 80vw, 560px"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

                  {/* hover scan line */}
                  <div className="absolute inset-x-0 top-0 z-10 h-[1px] bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-0 transition-all duration-700 group-hover:opacity-50 group-hover:top-full" />

                  {/* corner brackets */}
                  <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[var(--teal)] opacity-0 transition-all duration-400 -translate-x-1 -translate-y-1 group-hover:opacity-50 group-hover:translate-x-0 group-hover:translate-y-0" />
                  <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[var(--teal)] opacity-0 transition-all duration-400 translate-x-1 -translate-y-1 group-hover:opacity-50 group-hover:translate-x-0 group-hover:translate-y-0" />

                  {/* HUD index */}
                  <div className="absolute left-4 top-4 z-10 font-mono text-[0.5rem] tracking-[0.35em] text-[var(--teal)] opacity-0 transition-all duration-400 group-hover:opacity-70">
                    {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                  </div>
                </div>

                {/* content */}
                <div className="relative px-6 pb-7 pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="relative overflow-hidden rounded-sm bg-[rgba(var(--teal-rgb),0.1)] px-2.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[var(--teal)]">
                      {meta.kind}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(var(--teal-rgb),0.25)] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </span>
                    <span className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-white/25">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="hed text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-[0.85] text-white transition-transform duration-500 group-hover:-translate-y-0.5">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 font-mono text-[0.62rem] leading-relaxed text-white/35 transition-colors duration-300 group-hover:text-white/50">
                    {project.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/20">
                      {meta.business}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition-all duration-400 group-hover:border-[rgba(var(--teal-rgb),0.35)] group-hover:text-[var(--teal)] group-hover:shadow-[0_0_20px_rgba(var(--teal-rgb),0.12)]">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        <path
                          d="M2 10L10 2M10 2H4M10 2v6"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* bottom glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-35" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* progress bar */}
      <div className="relative z-10 mx-auto mt-10 h-[1px] max-w-md bg-white/[0.06] px-[var(--gutter)]">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full rounded-full bg-[var(--teal)] shadow-[0_0_12px_rgba(var(--teal-rgb),0.5)]"
          style={{ width: "0%" }}
        />
      </div>

      {/* mobile dots */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-2 px-[var(--gutter)] md:hidden">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i === active
                ? "w-7 bg-[var(--teal)] shadow-[0_0_10px_rgba(var(--teal-rgb),0.4)]"
                : "w-1.5 bg-white/15"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
