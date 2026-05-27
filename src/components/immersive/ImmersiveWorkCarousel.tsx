"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { useRef, useState } from "react";
import type { Project } from "@/components/Work";
import { pagePath, parseCanonicalPath, projectPath } from "@/lib/site-routing";

const FALLBACK: Project[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare Dashboard",
    year: "2025",
    description: "A precise care platform that makes patient operations calm and legible.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "Commerce Platform",
    year: "2025",
    description: "Editorial shopping built around product detail, speed, and confident conversion.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "180-degrees",
    slug: "180-degrees",
    title: "180 Degrees",
    category: "Brand System",
    year: "2026",
    description: "A digital identity translated into sharp campaign surfaces and motion.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Interface",
    year: "2026",
    description: "A focused workspace for teams shipping complex products together.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

const WINDOWS = [-2, -1, 0, 1, 2];
const slideTransition = { type: "tween" as const, duration: 0.82, ease: [0.16, 1, 0.3, 1] as const };
const FALLBACK_GIFS: Record<string, string> = {
  "elia-clinic": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnFjZDY1ZWN2OGNqM2c1MWgzY2tnNmtxNmJ4OW5yZnY2eXJraG9veiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPEqDGUULpEU0aQ/giphy.gif",
  montgab: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRzOG44OGt4OHNmOGw5MmxoaHZqYXR4Z3pvdjM3YmI1ajRzY3NpbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgzoKnwFNmISR8I/giphy.gif",
  "180-degrees": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWRiM2RreDNrYjM4dHR6eTNhaDRyeGYybnBmZjkwamJ5MmZvdnF6eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tn33aiTi1jkl6H6/giphy.gif",
  launchpad: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJ6emhhZTk4Z2NhZWNvcDBjZGNmcG80eGFlN21zZnY0aWUyem0xNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPwoeGErMmaI43S/giphy.gif",
};

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

function slugFor(project: Project) {
  return project.slug ?? project.id;
}

function linkFor(project: Project, pathname: string) {
  const parsed = parseCanonicalPath(pathname);
  const slug = slugFor(project);
  return parsed ? projectPath(parsed.locale, parsed.theme, slug) : `/work/${encodeURIComponent(slug)}`;
}

function allWorkHref(pathname: string) {
  const parsed = parseCanonicalPath(pathname);
  return parsed ? pagePath(parsed.locale, parsed.theme, "work") : "/work";
}

function coverFor(project: Project) {
  if (project.coverImage) return project.coverImage;
  return FALLBACK[mod([...slugFor(project)].reduce((total, character) => total + character.charCodeAt(0), 0), FALLBACK.length)]
    ?.coverImage;
}

function gifFor(project: Project) {
  if (project.gifUrl && project.gifUrl !== project.coverImage) return project.gifUrl;
  return FALLBACK_GIFS[slugFor(project)];
}

export default function ImmersiveWorkCarousel({ projects }: { projects?: Project[] }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const list = projects?.length ? projects : FALLBACK;
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragged = useRef(false);

  const shift = (direction: number) => setActive((current) => current + direction);

  const onDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragOffset(info.offset.x * 0.72);
    dragged.current = Math.abs(info.offset.x) > 3;
  };

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const movement = info.offset.x + info.velocity.x * 0.18;
    dragged.current = Math.abs(info.offset.x) > 3;
    setDragOffset(0);
    if (movement < -38) shift(1);
    if (movement > 38) shift(-1);
    window.setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  return (
    <motion.section
      id="work"
      aria-label="Selected work"
      className="relative overflow-hidden border-t border-[rgba(var(--teal-rgb),0.12)] px-[var(--gutter)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(3.5rem,6vw,5rem)]"
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55 }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") shift(1);
        if (event.key === "ArrowLeft") shift(-1);
      }}
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_48%_at_50%_57%,rgba(var(--teal-rgb),0.13),transparent_72%),radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(var(--teal-rgb),0.035),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(var(--teal-rgb),0.42)_1px,transparent_1px)] [background-size:94px_94px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]" />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        <motion.div
          className="mb-[clamp(1.7rem,3vw,2.5rem)] flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
          initial={reduceMotion ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 className="hed text-[clamp(2.55rem,5vw,5rem)] uppercase leading-[0.84] tracking-[-0.035em] text-[var(--fg)]">
              See the work
              <br />
              <span className="text-[var(--teal)]">in motion.</span>
            </h2>
          </div>
          <p className="max-w-[18rem] text-[0.9rem] leading-[1.7] text-[var(--body)] lg:mb-2 lg:text-right">
            Real products. Real impact. A look at what we build for forward-thinking teams.
          </p>
        </motion.div>

        <motion.div
          className="relative h-[clamp(23rem,34vw,28rem)] cursor-grab select-none touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          aria-roledescription="carousel"
        >
          {WINDOWS.map((offset) => {
            const virtualIndex = active + offset;
            const index = mod(virtualIndex, list.length);
            const project = list[index];
            const featured = offset === 0;
            const distant = Math.abs(offset) >= 2;
            const image = coverFor(project);
            const gif = gifFor(project);
            const media = (
              <>
                {image ? (
                  <Image
                    src={image}
                    alt={`${project.title} project preview`}
                    fill
                    draggable={false}
                    preload={featured}
                    sizes="(max-width: 767px) 70vw, (max-width: 1280px) 36vw, 464px"
                    className="object-cover saturate-[0.8] transition duration-700 group-hover:scale-[1.055] group-hover:saturate-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--surface2)]" />
                )}
                {featured && gif ? (
                  // Animated previews are supplied by the project CMS and may use non-optimized GIF hosts.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gif}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--bg-rgb),0.04),rgba(var(--bg-rgb),0.56))]" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_45%_40%,rgba(var(--teal-rgb),0.17),transparent_56%)]" />
                <span className="pointer-events-none absolute left-0 top-0 h-px w-full -translate-x-full bg-[linear-gradient(90deg,transparent,var(--teal),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
              </>
            );
            return (
              <motion.article
                key={virtualIndex}
                className="absolute left-1/2 top-0 h-full w-[clamp(16rem,36vw,29rem)]"
                initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
                animate={{
                  x: `calc(${offset * 104 - 50}% + ${dragOffset}px)`,
                  y: distant ? 14 : featured ? 0 : 8,
                  scale: featured ? 1.04 : distant ? 0.87 : 0.92,
                  opacity: distant ? 0.44 : featured ? 1 : 0.74,
                }}
                transition={reduceMotion ? { duration: 0 } : slideTransition}
                style={{ zIndex: featured ? 4 : distant ? 1 : 2 }}
              >
                <div
                  className={`group flex h-full flex-col overflow-hidden rounded-[1.2rem] border bg-[linear-gradient(145deg,rgba(var(--surface-rgb),0.92),rgba(var(--bg-rgb),0.96))] transition-[border-color,box-shadow,transform] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] ${
                    featured
                      ? "border-[rgba(var(--teal-rgb),0.72)] shadow-[0_0_0_1px_rgba(var(--teal-rgb),0.13),0_0_55px_rgba(var(--teal-rgb),0.16),0_30px_80px_rgba(0,0,0,0.45)]"
                      : "border-[rgba(var(--teal-rgb),0.18)] hover:border-[rgba(var(--teal-rgb),0.46)]"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 pb-3 pt-4 font-mono text-[0.55rem] uppercase tracking-[0.32em] text-[var(--teal)] md:px-5">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {featured ? <span className="flex items-center gap-2 text-[0.5rem] text-[var(--body)]">Featured <i className="block h-2 w-2 bg-[var(--teal)] shadow-[0_0_12px_var(--teal)]" /></span> : null}
                  </div>
                  {featured ? (
                    <Link
                      href={linkFor(project, pathname)}
                      onClick={(event) => {
                        if (dragged.current) event.preventDefault();
                      }}
                      className="relative mx-4 block aspect-[1.78] overflow-hidden rounded-[0.75rem] border border-[rgba(var(--teal-rgb),0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
                      aria-label={`View ${project.title} project`}
                    >
                      {media}
                    </Link>
                  ) : (
                    <div className="relative mx-4 aspect-[1.78] overflow-hidden rounded-[0.75rem] border border-[rgba(var(--teal-rgb),0.2)]">
                      {media}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <h3 className="hed text-[clamp(1.3rem,2.2vw,1.9rem)] uppercase leading-none text-[var(--fg)]">{project.title}</h3>
                    <p className="mt-1.5 text-[0.8rem] text-[var(--teal)]">{project.category ?? "Digital Experience"}</p>
                    {featured ? <p className="mt-3 line-clamp-2 max-w-[27rem] text-[0.8rem] leading-[1.55] text-[var(--body)]">{project.description}</p> : null}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 font-mono text-[0.54rem] uppercase tracking-[0.2em]">
                      <span className="border border-[rgba(var(--teal-rgb),0.22)] px-2.5 py-1.5 text-[var(--body)]">{project.year ?? "Current"}</span>
                      {featured ? (
                        <Link
                          href={linkFor(project, pathname)}
                          onPointerDown={(event) => event.stopPropagation()}
                          className="btn-glass-ghost"
                        >
                          <span className="btn-glass-blob" aria-hidden="true" />
                          <span className="btn-glass-face !px-3 !py-2 !text-[0.62rem]">
                            View more <span className="btn-glass-arrow">-&gt;</span>
                          </span>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-5 md:gap-9">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous project" className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(var(--teal-rgb),0.55)] text-xl text-[var(--fg)] transition hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.1)] hover:text-[var(--teal)] hover:shadow-[0_0_26px_rgba(var(--teal-rgb),0.2)] active:scale-95">
            &larr;
          </button>
          <p className="min-w-[5.5rem] font-mono text-xs tracking-[0.35em] text-[var(--body)]">
            <span className="text-[var(--teal)]">{String(mod(active, list.length) + 1).padStart(2, "0")}</span> / {String(list.length).padStart(2, "0")}
          </p>
          <div className="hidden h-px w-[min(34vw,27rem)] gap-2 bg-[rgba(var(--teal-rgb),0.16)] md:flex">
            {list.map((project, index) => (
              <button key={project.id} type="button" aria-label={`Show ${project.title}`} onClick={() => setActive(active + index - mod(active, list.length))} className={`h-px flex-1 transition-all duration-500 ${index === mod(active, list.length) ? "bg-[var(--teal)] shadow-[0_0_10px_var(--teal)]" : "bg-[rgba(var(--teal-rgb),0.22)] hover:bg-[rgba(var(--teal-rgb),0.55)]"}`} />
            ))}
          </div>
          <button type="button" onClick={() => shift(1)} aria-label="Next project" className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(var(--teal-rgb),0.55)] text-xl text-[var(--fg)] transition hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.1)] hover:text-[var(--teal)] hover:shadow-[0_0_26px_rgba(var(--teal-rgb),0.2)] active:scale-95">
            &rarr;
          </button>
          <Link href={allWorkHref(pathname)} className="ml-auto hidden font-mono text-[0.64rem] uppercase tracking-[0.34em] text-[var(--teal)] transition hover:tracking-[0.4em] lg:block">
            View all projects -&gt;
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
