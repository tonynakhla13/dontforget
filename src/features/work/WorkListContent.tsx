"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { WorkProject } from "./page";
import WorkHeroCards from "./WorkHeroCards";

const WORK_TYPE_ORDER = ["website", "ecommerce", "web_app"] as const;
const WORK_TYPE_LABELS: Record<string, string> = {
  website: "Websites",
  ecommerce: "E-commerce",
  web_app: "Platforms",
};

function projectTypeOf(project: WorkProject) {
  const explicitType = project.projectType?.trim().toLowerCase();
  if (explicitType) return explicitType;

  const category = project.category?.toLowerCase() ?? "";
  if (category.includes("e-commerce") || category.includes("ecommerce")) return "ecommerce";
  if (category.includes("platform") || category.includes("app")) return "web_app";
  return "website";
}

function projectTypeLabel(type: string) {
  return WORK_TYPE_LABELS[type] ?? type.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Short form for the archive tile, where the label sits beside the year on one
// mono line and the plural reads wrong.
const WORK_TYPE_SHORT: Record<string, string> = {
  website: "Site",
  ecommerce: "Shop",
  web_app: "Platform",
};

function hostOf(url: string | null | undefined) {
  if (!url) return null;
  const bare = url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
  return bare || null;
}

type WorkTypeOption = { key: string; label: string; count: number };

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

function ImmersiveWorkHero({
  projects,
  typeOptions,
}: {
  projects: WorkProject[];
  typeOptions: WorkTypeOption[];
}) {
  const projectCount = projects.length;
  const liveCount = projects.filter((project) => Boolean(project.liveUrl)).length;
  const formatOptions = typeOptions.filter((option) => option.key !== "All");

  return (
    <section
      id="work-intro"
      aria-labelledby="immersive-work-hero-title"
      className="relative isolate overflow-hidden border-b border-[var(--border)]"
    >
      <div className="pointer-events-none absolute -right-[18%] top-[4%] h-[min(78vw,58rem)] w-[min(78vw,58rem)] rounded-full bg-[radial-gradient(circle,rgba(var(--teal-rgb),0.18),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[-12%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(245,184,94,0.08),transparent_64%)] blur-3xl" />

      <div className="wrap relative grid min-h-[min(680px,calc(100svh-8rem))] items-center gap-14 py-[clamp(6rem,10vw,8.5rem)] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] lg:gap-14">
        <div className="relative z-10 max-w-2xl">
          <p data-work-hero-enter className="eyebrow mb-6 opacity-0 [animation:work-signal-enter_0.85s_0.05s_cubic-bezier(.16,1,.3,1)_forwards]">
            NOX / Work / Signal room
          </p>
          {/* Sized against the column it sits in (~0.5 of the wrap), not the
              viewport — a vw-based scale here forced "has a pulse." onto its
              own two lines and pushed the hero past 1200px tall. */}
          <h1
            id="immersive-work-hero-title"
            data-work-hero-enter
            className="hed text-[clamp(3.4rem,6.2vw,6.6rem)] leading-[0.82] tracking-[-0.05em] text-[var(--fg)] opacity-0 [animation:work-signal-enter_1s_0.12s_cubic-bezier(.16,1,.3,1)_forwards]"
          >
            The work
            <br />
            <span className="text-[var(--teal)]">has a pulse.</span>
          </h1>
          <p
            data-work-hero-enter
            className="mt-8 max-w-md text-[0.95rem] leading-[1.8] text-[var(--body)] opacity-0 [animation:work-signal-enter_0.85s_0.24s_cubic-bezier(.16,1,.3,1)_forwards]"
          >
            A living index of digital experiences built for the moment they launch — and the feeling that stays after.
          </p>
          <a
            data-work-hero-enter
            href="#work"
            className="group mt-9 inline-flex items-center gap-3 border border-[rgba(var(--teal-rgb),0.42)] bg-[rgba(var(--teal-rgb),0.06)] px-4 py-3 font-mono text-[0.52rem] uppercase tracking-[0.26em] text-[var(--teal)] opacity-0 transition-[background,border-color,color,transform] duration-300 [animation:work-signal-enter_0.85s_0.34s_cubic-bezier(.16,1,.3,1)_forwards] hover:-translate-y-0.5 hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.13)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
          >
            Enter the archive
            <span className="text-base leading-none transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </a>

          <div
            data-work-hero-enter
            className="mt-14 grid max-w-md grid-cols-3 border-y border-[rgba(var(--teal-rgb),0.2)] opacity-0 [animation:work-signal-enter_0.85s_0.44s_cubic-bezier(.16,1,.3,1)_forwards]"
          >
            <div className="border-r border-[rgba(var(--teal-rgb),0.2)] py-4 pr-4">
              <strong className="hed block text-[clamp(2rem,4vw,3.3rem)] leading-none text-[var(--fg)]">{String(projectCount).padStart(2, "0")}</strong>
              <span className="mt-2 block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[var(--body)]">projects</span>
            </div>
            <div className="border-r border-[rgba(var(--teal-rgb),0.2)] px-4 py-4">
              <strong className="hed block text-[clamp(2rem,4vw,3.3rem)] leading-none text-[var(--fg)]">{String(liveCount).padStart(2, "0")}</strong>
              <span className="mt-2 block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[var(--body)]">live links</span>
            </div>
            <div className="py-4 pl-4">
              <strong className="hed block text-[clamp(2rem,4vw,3.3rem)] leading-none text-[var(--fg)]">{String(formatOptions.length).padStart(2, "0")}</strong>
              <span className="mt-2 block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[var(--body)]">formats</span>
            </div>
          </div>
        </div>

        {/* The board replaces the earlier radar stage. The radar's rings,
            sweep and "01 / WEB" nodes were invented data, and its centre
            repeated the project count already sitting in the tally to the
            left. This shows the real thing instead: every domain in the
            index, scrolling, with its actual live state. Duplicated once so
            the -50% translate loops seamlessly.

            aria-hidden because the archive below carries the same 36 entries
            as real, reachable links — announcing them twice helps nobody. */}
        <div
          data-work-hero-enter
          className="work-board relative w-full opacity-0 [animation:work-signal-enter_1.1s_0.28s_cubic-bezier(.16,1,.3,1)_forwards]"
          aria-hidden="true"
        >
          <div className="work-board__bar">
            <span>NOX / Live index</span>
            <span className="work-board__count">
              <i />
              {String(liveCount).padStart(2, "0")} of {String(projectCount).padStart(2, "0")} live
            </span>
          </div>

          <div className="work-board__viewport">
            <div className="work-board__track">
              {[...projects, ...projects].map((project, index) => {
                const host = hostOf(project.liveUrl);
                return (
                  <div className="work-board__row" key={`${project.id}-${index}`}>
                    <i className={`work-board__pip${host ? "" : " work-board__pip--off"}`} />
                    <span className="work-board__host">{host ?? project.title}</span>
                    <span className="work-board__type">
                      {WORK_TYPE_SHORT[projectTypeOf(project)] ?? projectTypeLabel(projectTypeOf(project))}
                    </span>
                    <span className="work-board__year">{project.year ?? "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="work-board__foot">
            {formatOptions.map((option) => (
              <span key={option.key} className="work-board__format">
                {option.label} <b>{String(option.count).padStart(2, "0")}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// The hero already made the statement; this is the instrument label for the
// index below it, not a second headline.
function ImmersiveArchiveLabel({
  projectCount,
  liveCount,
}: {
  projectCount: number;
  liveCount: number;
}) {
  return (
    <div
      data-work-entrance
      className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[rgba(var(--teal-rgb),0.22)] pb-4"
    >
      <h2 className="eyebrow !mb-0">NOX / Work archive</h2>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[var(--body)]">
        <span className="text-[var(--fg)]">{String(projectCount).padStart(2, "0")}</span> indexed
        <span className="mx-2.5 opacity-40" aria-hidden="true">/</span>
        <span className="text-[var(--teal)]">{String(liveCount).padStart(2, "0")}</span> live right now
      </p>
    </div>
  );
}

// Rendered as a direct child of `.wrap`, alongside the grid, on purpose: a
// sticky element can only travel inside its own containing block, so while
// this lived in the header wrapper it unstuck after ~170px and spent the whole
// archive scrolled off. Pinned at 66px — the compact navbar's height — so it
// parks flush under the nav instead of sliding beneath it.
function ImmersiveArchiveBar({
  filteredCount,
  searchQuery,
  onSearchChange,
  typeOptions,
  activeType,
  onTypeChange,
  statusOptions,
  activeStatus,
  onStatusChange,
  hasFilters,
  onClear,
}: {
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeOptions: WorkTypeOption[];
  activeType: string;
  onTypeChange: (value: string) => void;
  statusOptions: WorkTypeOption[];
  activeStatus: string;
  onStatusChange: (value: string) => void;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <>
      {/* No top margin on the sticky box: it is pinned by its margin box, so
          an `mt-*` here would park the bar that many px below the nav and let
          content scroll through the gap. Spacing lives on the label row. */}
      <div
        data-work-entrance
        className="mb-9 border-b border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(var(--bg-rgb),0.92)] py-3.5 backdrop-blur-xl md:sticky md:top-[66px] md:z-30"
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative flex min-h-[3.25rem] flex-1 items-center border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(var(--bg-rgb),0.54)] transition-colors focus-within:border-[var(--teal)]">
            <span className="sr-only">Search projects</span>
            <svg className="ml-4 shrink-0 text-[var(--teal)]" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3.2 3.2" />
            </svg>
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search projects, sectors, or domains"
              className="min-w-0 flex-1 bg-transparent px-3.5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg)] outline-none placeholder:text-[var(--body)] placeholder:opacity-70"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--body)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
                aria-label="Clear search"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" />
                </svg>
              </button>
            ) : null}
          </label>

          {/* Status, where the sector dropdown used to be. Sector had 27
              distinct values across 36 projects — 24 of them matching exactly
              one — so it listed near-unique strings rather than grouping
              anything, and search covers those far better. Live / in build is
              the split that actually has two sides, and it is the page's
              whole claim. */}
          <div
            className="flex shrink-0 gap-2 overflow-x-auto pb-0.5"
            role="group"
            aria-label="Filter by status"
          >
            {statusOptions.map((option) => (
              <FilterChip
                key={option.key}
                option={option}
                isActive={activeStatus === option.key}
                onSelect={onStatusChange}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* The chips name themselves and carry their own counts, so the
              "Filter by format" caption above them was doing no work. */}
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by format">
            {typeOptions.map((option) => (
              <FilterChip
                key={option.key}
                option={option}
                isActive={activeType === option.key}
                onSelect={onTypeChange}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-5 font-mono text-[0.64rem] uppercase tracking-[0.16em]">
            <span className="text-[var(--body)]">
              <span className="text-[var(--fg)]">{String(filteredCount).padStart(2, "0")}</span> shown
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-2 text-[var(--teal)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
              >
                Clear filters
                <span aria-hidden="true">↗</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {filteredCount} project{filteredCount === 1 ? "" : "s"}.
      </p>
    </>
  );
}

function FilterChip({
  option,
  isActive,
  onSelect,
}: {
  option: WorkTypeOption;
  isActive: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(option.key)}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] ${
        isActive
          ? "border-[var(--teal)] bg-[rgba(var(--teal-rgb),0.14)] text-[var(--teal)] shadow-[0_0_18px_rgba(var(--teal-rgb),0.12)]"
          : "border-[var(--border)] text-[var(--body)] hover:border-[rgba(var(--teal-rgb),0.45)] hover:text-[var(--fg)]"
      }`}
    >
      {option.label}
      <span className={isActive ? "text-[var(--fg)]" : "opacity-55"}>{String(option.count).padStart(2, "0")}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Archive tile — the immersive index unit.
//
// Only 2 of the 36 portfolio entries carry a cover image, so the framed
// 16:9 card used elsewhere rendered 34 identical placeholder panels and
// pushed the archive past 10,000px of scroll. The tile drops the image
// well and leads with what every entry actually has: a name, a sector,
// and — for 33 of them — a live domain. Where a cover image does exist it
// becomes a faint wash behind the text, so the grid stays on one rhythm.
// ─────────────────────────────────────────────────────────────────────
function ArchiveTile({
  project,
  projectBasePath,
}: {
  project: WorkProject;
  projectBasePath?: string;
}) {
  const host = hostOf(project.liveUrl);
  const type = projectTypeOf(project);
  const href = projectBasePath
    ? `${projectBasePath}/${encodeURIComponent(project.slug ?? project.id)}`
    : `/work/${project.slug ?? project.id}`;

  return (
    <article data-card className="atile group" style={{ "--col-span": 1 } as CSSProperties}>
      {project.coverImage ? (
        <span
          className="atile__wash"
          style={{ backgroundImage: `url("${project.coverImage}")` }}
          aria-hidden="true"
        />
      ) : null}

      <span className="atile__tag">
        {WORK_TYPE_SHORT[type] ?? projectTypeLabel(type)}
        <b aria-hidden="true">·</b>
        {project.year ? `’${project.year.slice(-2)}` : "—"}
      </span>

      <h3 className="atile__name hed">
        <Link href={href} className="atile__link">
          {project.title}
        </Link>
      </h3>

      <p className="atile__sector">{project.category ?? "Digital experience"}</p>

      {/* The address strip. A studio's deliverable is a running domain, so the
          tile ends in the thing it shipped, recessed like a real address
          field. For the three not yet public the field is simply empty. */}
      {host ? (
        <a
          href={project.liveUrl!}
          target="_blank"
          rel="noreferrer noopener"
          className="atile__addr"
        >
          <i className="atile__pip" aria-hidden="true" />
          <span className="atile__host">{host}</span>
          <span className="atile__ext" aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span className="atile__addr atile__addr--off">
          <i className="atile__pip atile__pip--off" aria-hidden="true" />
          <span className="atile__host">Not live yet</span>
        </span>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Project card — framed, matches the home immersive work-carousel cards
// ─────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  filteredIndex,
  revealOnScroll = true,
  projectBasePath,
}: {
  project: WorkProject;
  filteredIndex: number;
  revealOnScroll?: boolean;
  projectBasePath?: string;
}) {
  const num = String(filteredIndex + 1).padStart(2, "0");
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(project.coverImage && !imageFailed);

  // NOTE: the global `[data-card]` rule sets `grid-column: span var(--col-span, 12)`.
  // We set --col-span: 6 so each card spans half of the 12-col grid (2-up on desktop;
  // the same rule falls back to a full-width row below 768px).
  return (
    <Link
      href={projectBasePath ? `${projectBasePath}/${encodeURIComponent(project.slug ?? project.id)}` : `/work/${project.slug ?? project.id}`}
      data-card
      className="group relative block focus-visible:outline-none"
      style={{ clipPath: revealOnScroll ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)", willChange: "clip-path, transform", "--col-span": 6 } as CSSProperties}
      aria-label={`View ${project.title}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-[rgba(var(--teal-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--surface-rgb),0.92),rgba(var(--bg-rgb),0.96))] transition-[border-color,transform,box-shadow] duration-500 group-hover:-translate-y-1 group-hover:border-[rgba(var(--teal-rgb),0.5)] group-hover:shadow-[inset_0_0_0_1px_rgba(var(--teal-rgb),0.22)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--teal)]">

        {/* header — index + year */}
        <div className="flex items-center justify-between px-4 pb-3 pt-4 font-mono text-[0.55rem] uppercase tracking-[0.32em] text-[var(--teal)] md:px-5">
          <span>{num}</span>
          <span className="flex items-center gap-2 text-[0.5rem] text-[var(--body)]">
            {project.year ?? "—"}
            <i className="block h-1.5 w-1.5 bg-[var(--teal)] shadow-[0_0_10px_var(--teal)]" />
          </span>
        </div>

        {/* media */}
        <div className="relative mx-4 aspect-[1.78] overflow-hidden rounded-[0.75rem] border border-[rgba(var(--teal-rgb),0.2)]">
          {hasImage ? (
            <Image
              src={project.coverImage!}
              alt={`${project.title} project preview`}
              fill
              sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw"
              className="object-cover saturate-[0.82] transition duration-700 group-hover:scale-[1.06] group-hover:saturate-100"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ProjectArtworkFallback project={project} num={num} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--bg-rgb),0.04),rgba(var(--bg-rgb),0.5))]" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_45%_40%,rgba(var(--teal-rgb),0.17),transparent_56%)]" />
          <span className="pointer-events-none absolute left-0 top-0 h-px w-full -translate-x-full bg-[linear-gradient(90deg,transparent,var(--teal),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
          {project.category ? (
            <span className="absolute left-3 top-3 rounded-full border border-[rgba(var(--teal-rgb),0.34)] bg-black/45 px-2.5 py-1 font-mono text-[0.46rem] uppercase tracking-[0.26em] text-[var(--teal)] backdrop-blur-md">
              {project.category}
            </span>
          ) : null}
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <h3 className="hed text-[clamp(1.4rem,2vw,2rem)] uppercase leading-none text-[var(--fg)]">{project.title}</h3>
          <p className="mt-1.5 text-[0.8rem] text-[var(--teal)]">{project.category ?? "Digital Experience"}</p>
          {project.description ? (
            <p className="mt-3 line-clamp-2 text-[0.8rem] leading-[1.55] text-[var(--body)]">{project.description}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 font-mono text-[0.54rem] uppercase tracking-[0.2em]">
            <span className="border border-[rgba(var(--teal-rgb),0.22)] px-2.5 py-1.5 text-[var(--body)]">{project.year ?? "Current"}</span>
            <span className="btn-glass-ghost">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face !px-3 !py-2 !text-[0.62rem]">
                View more <span className="btn-glass-arrow">→</span>
              </span>
            </span>
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
function WorkHero({ projects }: { projects: WorkProject[] }) {
  const headRef    = useRef<HTMLHeadingElement>(null);
  const tagRef     = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cueRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFirstLoad = !sessionStorage.getItem("df_loader_shown");
    const delay = isFirstLoad ? 0.4 : 0;
    const tl = gsap.timeline({ delay });
    tl.fromTo(
        [tagRef.current, headRef.current, subRef.current],
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }
      )
      .fromTo(galleryRef.current, { autoAlpha: 0, scale: 0.94, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" }, "-=0.4")
      .fromTo(
        cueRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-start overflow-x-clip overflow-y-visible"
      style={{ background: "transparent", paddingTop: "clamp(5rem,9vh,7rem)", paddingBottom: "clamp(2.5rem,5vh,4rem)" }}
    >
      {/* ── heading (top) ── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div ref={tagRef} style={{
          visibility: "hidden",
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "1.1rem",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(70,174,34,1)", boxShadow: "0 0 8px rgba(70,174,34,0.8)", flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
            letterSpacing: "0.44em", textTransform: "uppercase", color: "rgba(70,174,34,0.8)",
          }}>
            Warning: may cause competitor envy
          </span>
        </div>

        <h1
          ref={headRef}
          className="hed"
          style={{
            visibility: "hidden",
            fontSize: "clamp(2.7rem,6.4vw,5.6rem)",
            lineHeight: 0.9, letterSpacing: "-0.03em", color: "#F8F5EE",
          }}
        >
          Selected <span style={{ color: "rgba(70,174,34,1)" }}>Works.</span>
        </h1>

        <p
          ref={subRef}
          style={{
            visibility: "hidden",
            marginTop: "1rem", maxWidth: 460,
            fontSize: "clamp(0.85rem,1.1vw,0.98rem)", lineHeight: 1.7,
            color: "rgba(248,245,238,0.7)",
          }}
        >
          We build things that make your competitors{" "}
          <span style={{ color: "#F8F5EE" }}>uncomfortable.</span>
        </p>
      </div>

      {/* ── 3D carousel — drag / swipe to spin · hover a card to explore ── */}
      <div ref={galleryRef} className="relative w-full" style={{ visibility: "hidden", marginTop: "clamp(0.4rem,1.4vw,1rem)" }}>
        <WorkHeroCards projects={projects} />
      </div>

      {/* scroll cue */}
      <div ref={cueRef} className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ visibility: "hidden" }}>
        <span className="font-mono text-[0.85rem] sm:text-[1.1rem] uppercase tracking-[0.3em] text-[var(--body)]">Scroll to explore</span>
        <div className="h-10 w-px" style={{ background: "linear-gradient(to bottom, rgba(70,174,34,1), transparent)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────
export default function WorkListContent({
  projects,
  variant = "default",
  projectBasePath,
}: {
  projects: WorkProject[];
  variant?: "default" | "immersive";
  projectBasePath?: string;
}) {
  const isImmersiveArchive = variant === "immersive";
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const gridRef        = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLDivElement>(null);
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

  const liveProjectCount = useMemo(
    () => projects.filter((project) => Boolean(project.liveUrl)).length,
    [projects]
  );

  // Live / in build — the one split in this data with two real sides. Sector
  // was 27 distinct values across 36 projects (24 of them matching exactly
  // one), so it grouped nothing; search covers those far better.
  const statusOptions = useMemo<WorkTypeOption[]>(() => {
    const live = projects.filter((project) => Boolean(project.liveUrl)).length;
    return [
      { key: "All", label: "Any status", count: projects.length },
      { key: "live", label: "Live", count: live },
      { key: "building", label: "In build", count: projects.length - live },
    ].filter((option) => option.count > 0);
  }, [projects]);

  const typeOptions = useMemo(() => {
    const counts = projects.reduce<Record<string, number>>((result, project) => {
      const type = projectTypeOf(project);
      result[type] = (result[type] ?? 0) + 1;
      return result;
    }, {});
    const remainingTypes = Object.keys(counts).filter((type) => !WORK_TYPE_ORDER.includes(type as (typeof WORK_TYPE_ORDER)[number]));
    const orderedTypes = [...WORK_TYPE_ORDER, ...remainingTypes];

    return [
      { key: "All", label: "All work", count: projects.length },
      ...orderedTypes
        .filter((type) => counts[type])
        .map((type) => ({ key: type, label: projectTypeLabel(type), count: counts[type] })),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!isImmersiveArchive) {
      return activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      if (activeType !== "All" && projectTypeOf(project) !== activeType) return false;
      if (activeStatus !== "All" && (activeStatus === "live") !== Boolean(project.liveUrl)) return false;
      if (!query) return true;

      return [
        project.title,
        project.category,
        project.description,
        project.year,
        // The domain is the archive's primary identifier, so it has to be
        // searchable — the placeholder promises it.
        hostOf(project.liveUrl),
        ...project.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeStatus, activeFilter, activeType, isImmersiveArchive, projects, searchQuery]);

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

  // Header entrance: the immersive archive opens immediately; the legacy view
  // keeps its scroll-triggered reveal below the full-height carousel.
  useEffect(() => {
    const head = headerRef.current;
    if (!head) return;
    // The immersive filter bar is a sibling of the header (it needs `.wrap` as
    // its sticky containing block), so scope the query to the section.
    const scope = isImmersiveArchive ? head.closest("section") ?? head : head;
    const entranceTargets = Array.from(scope.querySelectorAll<HTMLElement>("[data-work-entrance]"));
    const eyebrow = head.querySelector<HTMLElement>(".eyebrow");
    const title = head.querySelector<HTMLElement>("h2");
    const filter = head.querySelector<HTMLElement>("button");
    const targets = entranceTargets.length
      ? entranceTargets
      : [eyebrow, title, filter].filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.set(head, { autoAlpha: 1 });

      if (isImmersiveArchive) {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power3.out" }
        );
        return;
      }

      gsap.set(targets, { autoAlpha: 0, y: 44 });
      if (title) gsap.set(title, { y: 66 });            // heading travels a touch further
      ScrollTrigger.create({
        trigger: head, start: "top 85%", once: true,
        onEnter() {
          gsap.to(targets, {
            autoAlpha: 1, y: 0,
            duration: 0.95, stagger: 0.12, ease: "expo.out",
          });
        },
      });
    }, head);
    return () => ctx.revert();
  }, [isImmersiveArchive]);

  const transitionResults = useCallback(async (change: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const grid = gridRef.current;
    const cards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    try {
      if (cards.length) {
        await gsap.to(cards, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.20, stagger: { amount: 0.1, from: "start" }, ease: "power2.in" });
      }
      change();
      await new Promise<void>((resolve) => requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      }));

      const newCards = Array.from(grid?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
      if (newCards.length) {
        gsap.set(newCards, { autoAlpha: 0, y: 20, scale: 0.96, clipPath: "inset(0 0 0% 0)" });
        await gsap.to(newCards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: { amount: 0.28, from: "start" }, ease: "power3.out" });
      }
    } finally {
      isAnimating.current = false;
    }
  }, []);

  const handleFilter = useCallback((cat: string) => {
    if (cat === activeFilter) return;
    void transitionResults(() => setActiveFilter(cat));
  }, [activeFilter, transitionResults]);

  const handleTypeChange = useCallback((type: string) => {
    if (type === activeType) return;
    void transitionResults(() => setActiveType(type));
  }, [activeType, transitionResults]);

  const handleStatusChange = useCallback((status: string) => {
    if (status === activeStatus) return;
    void transitionResults(() => setActiveStatus(status));
  }, [activeStatus, transitionResults]);

  const clearImmersiveFilters = useCallback(() => {
    if (activeType === "All" && activeStatus === "All" && !searchQuery) return;
    void transitionResults(() => {
      setActiveType("All");
      setActiveStatus("All");
      setSearchQuery("");
    });
  }, [activeStatus, activeType, searchQuery, transitionResults]);

  const hasImmersiveFilters = activeType !== "All" || activeStatus !== "All" || Boolean(searchQuery.trim());

  return (
    <>
      {/* ── CSS ── */}
      <style>{`
        @keyframes work-signal-enter {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        /* ── Archive grid — 3 across on desktop ────────────────────────
           Fixed column counts rather than auto-fill: the tile is the unit
           the layout is tuned around, and auto-fill kept pushing it to 5
           narrow columns on a wide display. */
        .archive-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1rem;
        }
        /* 768px, not 640: below it the global [data-card] rule forces
           grid-column 1 / -1, so a 2-col template there would just leave
           every tile spanning both tracks. */
        @media (min-width: 768px) {
          .archive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .archive-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* ── Archive tile ──────────────────────────────────────────────
           A plate, not a bordered box: soft surface gradient plus a 1px
           highlight along the top edge so it reads as an object catching
           light. Hierarchy runs name → address → sector → tag, instead of
           the four equal-weight bands the earlier version stacked up. */
        .atile {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.55rem;
          overflow: hidden;
          padding: 1.5rem 1.45rem 1.35rem;
          border-radius: 14px;
          border: 1px solid rgba(var(--teal-rgb), 0.13);
          background:
            linear-gradient(168deg, rgba(var(--surface-rgb), 0.9) 0%, rgba(var(--bg-rgb), 0.97) 62%);
          box-shadow:
            inset 0 1px 0 rgba(184, 255, 224, 0.09),
            0 1px 2px rgba(0, 0, 0, 0.5);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(.16,1,.3,1);
        }
        .atile:hover {
          transform: translateY(-3px);
          border-color: rgba(var(--teal-rgb), 0.4);
          box-shadow:
            inset 0 1px 0 rgba(184, 255, 224, 0.16),
            0 16px 40px rgba(0, 0, 0, 0.55),
            0 0 34px rgba(var(--teal-rgb), 0.09);
        }
        .atile:focus-within {
          border-color: var(--teal);
          outline: 2px solid var(--teal);
          outline-offset: 3px;
        }
        /* Cover art, where it exists, sits behind the text rather than
           setting the tile's height — the grid keeps one rhythm. */
        .atile__wash {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-size: cover;
          background-position: center;
          opacity: 0.1;
          filter: grayscale(1) contrast(1.15);
          transition: opacity 0.5s ease, filter 0.5s ease;
        }
        .atile:hover .atile__wash {
          opacity: 0.22;
          filter: grayscale(0.4);
        }

        /* Format + year, deliberately the quietest thing on the tile. */
        .atile__tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(var(--teal-rgb), 0.18);
          border-radius: 999px;
          font-family: var(--font-mono-next), monospace;
          font-size: 0.52rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--body);
        }
        .atile__tag b {
          font-weight: 400;
          opacity: 0.4;
        }

        /* The focal point: bone, display face, allowed to be big. */
        .atile__name {
          margin-top: 0.55rem;
          font-size: clamp(1.35rem, 1.9vw, 1.72rem);
          line-height: 1.04;
          letter-spacing: -0.012em;
          text-transform: uppercase;
          color: var(--fg);
          text-wrap: balance;
        }
        .atile__link {
          color: inherit;
          outline: none;
        }
        /* Stretched hit area — the whole tile opens the case page, while the
           address strip below stays independently clickable. */
        .atile__link::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .atile__sector {
          font-size: 0.84rem;
          line-height: 1.5;
          color: var(--body);
        }

        /* Signature: the recessed address field. */
        .atile__addr {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          width: 100%;
          margin-top: auto;
          padding: 0.62rem 0.75rem;
          border: 1px solid rgba(var(--teal-rgb), 0.2);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.42);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
          font-family: var(--font-mono-next), monospace;
          font-size: 0.76rem;
          letter-spacing: 0.01em;
          color: var(--teal);
          transition: border-color 0.3s ease, background 0.3s ease, color 0.3s ease;
        }
        .atile__addr:not(.atile__addr--off):hover {
          border-color: var(--teal);
          background: rgba(var(--teal-rgb), 0.09);
          color: var(--fg);
        }
        .atile__addr:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }
        .atile__addr--off {
          border-style: dashed;
          border-color: rgba(245, 184, 94, 0.32);
          color: rgba(245, 184, 94, 0.72);
        }
        .atile__pip {
          flex-shrink: 0;
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 9px rgba(var(--teal-rgb), 0.9);
        }
        .atile__pip--off {
          background: transparent;
          border: 1px solid rgba(245, 184, 94, 0.75);
          box-shadow: none;
        }
        .atile__host {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .atile__ext {
          flex-shrink: 0;
          opacity: 0.5;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(.16,1,.3,1);
        }
        .atile__addr:hover .atile__ext {
          opacity: 1;
          transform: translate(2px, -2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .atile,
          .atile__wash,
          .atile__ext,
          .atile__addr {
            transition: none;
          }
          .atile:hover {
            transform: none;
          }
        }

        /* ── Live index board ──────────────────────────────────────────
           An opaque instrument panel, so the ambient blob field reads
           behind it rather than through it. */
        .work-board {
          overflow: hidden;
          isolation: isolate;
          border: 1px solid rgba(var(--teal-rgb), 0.26);
          background:
            linear-gradient(165deg, rgba(var(--surface-rgb), 0.96), rgba(3, 8, 6, 0.99));
          box-shadow:
            inset 0 0 0 1px rgba(184, 255, 224, 0.05),
            0 26px 90px rgba(0, 0, 0, 0.55),
            0 0 70px rgba(var(--teal-rgb), 0.07);
        }
        .work-board::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.022) 0 1px, transparent 1px 7px);
          mix-blend-mode: screen;
          opacity: 0.4;
        }
        .work-board__bar,
        .work-board__foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem clamp(1rem, 2.2vw, 1.5rem);
          font-family: var(--font-mono-next), monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(248, 245, 238, 0.6);
        }
        .work-board__bar {
          border-bottom: 1px solid rgba(var(--teal-rgb), 0.18);
        }
        .work-board__count {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--teal);
        }
        .work-board__count i {
          width: 0.36rem;
          height: 0.36rem;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal);
        }
        .work-board__viewport {
          position: relative;
          height: clamp(17rem, 38vh, 25rem);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(180deg, transparent, #000 13%, #000 87%, transparent);
          mask-image: linear-gradient(180deg, transparent, #000 13%, #000 87%, transparent);
        }
        .work-board__track {
          display: flex;
          flex-direction: column;
          animation: work-board-scroll 78s linear infinite;
        }
        .work-board:hover .work-board__track {
          animation-play-state: paused;
        }
        @keyframes work-board-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .work-board__row {
          display: grid;
          grid-template-columns: 0.45rem minmax(0, 1fr) auto 3rem;
          align-items: center;
          gap: 0.85rem;
          padding: 0.72rem clamp(1rem, 2.2vw, 1.5rem);
          border-bottom: 1px solid rgba(var(--teal-rgb), 0.08);
          font-family: var(--font-mono-next), monospace;
          font-size: 0.8rem;
          line-height: 1.2;
        }
        .work-board__pip {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 9px rgba(var(--teal-rgb), 0.85);
        }
        .work-board__pip--off {
          background: transparent;
          border: 1px solid rgba(245, 184, 94, 0.7);
          box-shadow: none;
        }
        .work-board__host {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(248, 245, 238, 0.9);
        }
        .work-board__type,
        .work-board__year {
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--body);
          white-space: nowrap;
        }
        .work-board__year {
          text-align: right;
          color: rgba(184, 255, 224, 0.55);
        }
        .work-board__foot {
          border-top: 1px solid rgba(var(--teal-rgb), 0.18);
        }
        .work-board__format {
          color: rgba(184, 255, 224, 0.66);
          white-space: nowrap;
        }
        .work-board__format b {
          font-weight: 400;
          color: var(--fg);
        }
        @media (max-width: 767px) {
          .work-board__viewport {
            height: 15rem;
          }
          .work-board__foot {
            gap: 0.6rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-work-hero-enter] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .work-board__track {
            animation: none !important;
          }
        }

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
        .work-device-ambient {
          background:
            radial-gradient(ellipse at 74% 42%, rgba(70,209,42,0.18), transparent 42%),
            radial-gradient(ellipse at 88% 64%, rgba(184,255,224,0.08), transparent 28%),
            radial-gradient(ellipse at 52% 56%, rgba(70,174,34,0.08), transparent 40%);
          filter: blur(1px);
          mask-image: radial-gradient(ellipse at 72% 48%, black 0%, transparent 72%);
        }
        .work-device-laptop {
          transform-origin: 45% 52%;
          animation: work-device-drift 8s ease-in-out infinite alternate;
        }
        .work-device-mobile {
          transform-origin: 82% 48%;
          animation: work-device-drift-mobile 7s ease-in-out infinite alternate;
        }
        @keyframes work-device-drift {
          from { transform: translate3d(-4px, 6px, 0) rotate(-0.35deg); opacity: 0.86; }
          to { transform: translate3d(8px, -4px, 0) rotate(0.55deg); opacity: 1; }
        }
        @keyframes work-device-drift-mobile {
          from { transform: translate3d(5px, -8px, 0) rotate(0.7deg); opacity: 0.78; }
          to { transform: translate3d(-7px, 5px, 0) rotate(-0.5deg); opacity: 0.96; }
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
      {isImmersiveArchive ? (
        <ImmersiveWorkHero projects={projects} typeOptions={typeOptions} />
      ) : (
        <WorkHero projects={projects} />
      )}

      {/* ── Grid section ── */}
      <section
        id="work"
        className={isImmersiveArchive
          ? "border-b border-[var(--border)] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(5rem,8vw,7rem)]"
          : "section-py border-b border-[var(--border)]"}
        style={{ background: "transparent" }}
      >
        <div className="wrap">

          {/* Archive header + filter. Immersive opens here; the legacy view keeps its centered header. */}
          <div
            ref={headerRef}
            className={isImmersiveArchive ? "mb-5" : "mb-10 flex flex-col items-center gap-5 text-center"}
            style={{ visibility: isImmersiveArchive ? "visible" : "hidden" }}
          >
            {isImmersiveArchive ? (
              <ImmersiveArchiveLabel
                projectCount={projects.length}
                liveCount={liveProjectCount}
              />
            ) : (
              <>
                <div>
                  <p data-work-entrance className="eyebrow mb-3">All projects</p>
                  <h2 data-work-entrance className="hed text-[clamp(2.7rem,5.4vw,6rem)] leading-[0.88] text-[#F8F5EE]">
                    Proof in<br />
                    <span className="text-[var(--teal)]">motion.</span>
                  </h2>
                </div>
                <button
                  data-work-entrance
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
              </>
            )}
          </div>

          {isImmersiveArchive ? (
            <ImmersiveArchiveBar
              filteredCount={filteredProjects.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeOptions={typeOptions}
              activeType={activeType}
              onTypeChange={handleTypeChange}
              statusOptions={statusOptions}
              activeStatus={activeStatus}
              onStatusChange={handleStatusChange}
              hasFilters={hasImmersiveFilters}
              onClear={clearImmersiveFilters}
            />
          ) : null}

          {!isImmersiveArchive ? (
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
          ) : null}

          {/* Cards — the legacy view keeps the 12-column grid, where each
              [data-card] sets --col-span:6 for a 2-up row. The immersive
              archive is 36 entries deep, so it packs instead: auto-fill at a
              17.5rem floor gives 2-up on tablet, 3-up around 1100px and 4–5
              across a wide desktop, and each tile sets --col-span:1 so the
              global [data-card] span rule still resolves. */}
          <div
            ref={gridRef}
            className={isImmersiveArchive ? "archive-grid" : "grid gap-4 sm:gap-6 lg:gap-7"}
            style={
              isImmersiveArchive
                ? undefined
                : { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }
            }
          >
            {filteredProjects.length === 0 ? (
              <div className="py-28 text-center" style={{ gridColumn: "1 / -1" }}>
                <p className="eyebrow mb-4">No matches</p>
                <p className="text-[0.9rem] text-[var(--body)]">
                  {isImmersiveArchive
                    ? "Try a different term, or clear the filters to see all "
                      + projects.length + " projects."
                    : "No projects in this category yet."}
                </p>
                {isImmersiveArchive && hasImmersiveFilters ? (
                  <button
                    type="button"
                    onClick={clearImmersiveFilters}
                    className="mt-6 inline-flex items-center gap-2 border border-[rgba(var(--teal-rgb),0.42)] px-5 py-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--teal)] transition-colors hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.1)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
                  >
                    Clear filters
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
              </div>
            ) : isImmersiveArchive ? (
              filteredProjects.map((project) => (
                <ArchiveTile
                  key={project.id}
                  project={project}
                  projectBasePath={projectBasePath}
                />
              ))
            ) : (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  filteredIndex={index}
                  revealOnScroll
                />
              ))
            )}
          </div>

        </div>
      </section>

      {/* ── Filter drawer ── */}
      {!isImmersiveArchive ? (
        <FilterPanel
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          categories={categories}
          activeFilter={activeFilter}
          onFilter={handleFilter}
          projectCount={filteredProjects.length}
        />
      ) : null}

      {/* ── CTA ── */}
      {/* The immersive archive closes with the voice-note contact section the
          immersive home page uses; the route renders it, the way the home page
          composes it. */}
      {!isImmersiveArchive ? <BottomCTA /> : null}
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
