"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent as RMouseEvent } from "react";
import Link from "next/link";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativeFooter from "@/components/creative/CreativeFooter";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-projects";

/* Shape the page needs — PublicProject from the CMS satisfies it. */
export type WorkProject = {
  slug: string;
  title: string;
  category: string | null;
  year: string | null;
  tags: string[];
  liveUrl: string | null;
  coverImage: string | null;
  featured?: boolean;
  order?: number;
  projectType?: string | null;
};

type Filter = { key: string; label: string; match: (type: string) => boolean };

const FILTERS: Filter[] = [
  { key: "all", label: "All", match: () => true },
  { key: "website", label: "Websites", match: (t) => t === "website" },
  { key: "ecommerce", label: "E-commerce", match: (t) => t === "ecommerce" },
  { key: "web_app", label: "Platforms", match: (t) => t === "web_app" },
];

const TYPE_LABEL: Record<string, string> = {
  website: "Website",
  ecommerce: "E-commerce",
  web_app: "Platform",
};

/* The CMS category field is free text, so the type chips read from the
   curated list first and fall back to whatever the record carries. */
const CURATED_TYPES = new Map(PORTFOLIO_PROJECTS.map((p) => [p.slug, p.projectType]));

function typeOf(project: WorkProject) {
  return CURATED_TYPES.get(project.slug) ?? project.projectType ?? "website";
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function stackLabel(project: WorkProject) {
  if (project.tags.length) return project.tags.join(" · ");
  return TYPE_LABEL[typeOf(project)] ?? "Website";
}

/* Cover image from the dashboard wins; a file dropped at this path is the
   fallback, and a missing one degrades to the placeholder panel. */
function shotSrc(project: WorkProject) {
  return project.coverImage ?? `/creative/work/${project.slug}.jpg`;
}

const SHOT_W = 340; // keep in sync with .c-ledger__shot width
const SHOT_GAP = 28;

/* The headline spells its own count, so it stays true as work is added. */
const ONES = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function inWords(n: number) {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const unit = n % 10;
    return unit ? `${TENS[Math.floor(n / 10)]}-${ONES[unit].toLowerCase()}` : TENS[Math.floor(n / 10)];
  }
  return String(n);
}

export default function CreativeWorkPage({
  locale = "en",
  projects,
}: {
  locale?: string;
  projects: WorkProject[];
}) {
  const safeLocale = locale === "ar" ? "ar" : "en";
  const [active, setActive] = useState("all");

  /* ── hover shot: one panel that follows the cursor down the ledger ── */
  const shotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<WorkProject | null>(null);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  const moveShot = useCallback((event: RMouseEvent) => {
    const el = shotRef.current;
    if (!el) return;
    const height = el.offsetHeight || 220;
    const flip = event.clientX + SHOT_GAP + SHOT_W > window.innerWidth;
    const x = flip ? event.clientX - SHOT_W - SHOT_GAP : event.clientX + SHOT_GAP;
    const y = Math.min(
      Math.max(12, event.clientY - height / 2),
      window.innerHeight - height - 12,
    );
    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, []);

  const onRowEnter = useCallback((project: WorkProject, event: RMouseEvent) => {
    moveShot(event);
    setHovered(project);
  }, [moveShot]);

  const ordered = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects],
  );
  const liveCount = ordered.filter((p) => p.liveUrl).length;
  const featuredCount = ordered.filter((p) => p.featured).length;
  const filterCounts = useMemo(
    () => Object.fromEntries(
      FILTERS.map((f) => [f.key, ordered.filter((p) => f.match(typeOf(p))).length]),
    ) as Record<string, number>,
    [ordered],
  );

  const activeFilter = FILTERS.find((f) => f.key === active) ?? FILTERS[0];
  const rows = ordered.filter((p) => activeFilter.match(typeOf(p)));

  return (
    <>
      <CreativeNavbar active="work" />

      <section className="c-work-hero">
        <p className="c-work-hero__eyebrow">/ Portfolio — 2026</p>
        <div className="c-work-hero__head">
          <h1 className="c-work-hero__title">
            {inWords(ordered.length)}<br />shipped sites.
          </h1>
          <aside
            className="c-work-hero__panel"
            aria-label={`${liveCount} of ${ordered.length} projects are live right now`}
          >
            <span className="c-work-hero__panel-n">
              <span className="c-dot c-dot--lg" aria-hidden="true" />
              {liveCount}
            </span>
            <span className="c-work-hero__panel-l">live right now</span>
          </aside>
        </div>
        <p className="c-work-hero__sub">
          Everything below is a real website we designed, built, and shipped. Open a
          project for the case study, or follow the arrow straight to the live site.
        </p>
        <ul className="c-work-hero__tally">
          <li>{String(ordered.length).padStart(2, "0")}<span>projects</span></li>
          <li>{String(liveCount).padStart(2, "0")}<span>live</span></li>
          <li>{String(featuredCount).padStart(2, "0")}<span>featured</span></li>
        </ul>
      </section>

      <div className="c-work-filter">
        <div className="c-work-filter__group">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={active === f.key}
              className={`c-work-filter__btn${active === f.key ? " is-active" : ""}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
              <sup>{filterCounts[f.key]}</sup>
            </button>
          ))}
        </div>
        <span className="c-work-filter__count">
          showing {rows.length} / {ordered.length}
        </span>
      </div>

      <section className="c-ledger">
        {rows.length === 0 ? (
          <p className="c-ledger__empty">Nothing in this category yet.</p>
        ) : (
          <ul className="c-ledger__list" onMouseLeave={() => setHovered(null)}>
            {rows.map((project, index) => (
              <li
                key={project.slug}
                className={`c-ledger__row${project.featured ? " c-ledger__row--featured" : ""}`}
                onMouseEnter={(event) => onRowEnter(project, event)}
                onMouseMove={moveShot}
              >
                <Link
                  href={`/${safeLocale}/creative/work/${encodeURIComponent(project.slug)}`}
                  className="c-ledger__hit"
                  aria-label={`${project.title} — read the case study`}
                />
                <div className="c-ledger__main">
                  <span className="c-ledger__num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="c-ledger__name">{project.title}</span>
                  <span className="c-ledger__cat">{project.category}</span>
                </div>
                <div className="c-ledger__aside">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="c-ledger__live"
                    >
                      <span className="c-dot" aria-hidden="true" />
                      {stripProtocol(project.liveUrl)}
                      <span className="c-ledger__arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="c-ledger__live c-ledger__live--off">
                      <span className="c-dot c-dot--off" aria-hidden="true" />
                      case study only
                    </span>
                  )}
                  <span className="c-ledger__stack">{stackLabel(project)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Hidden on coarse pointers by CSS — nothing here can fire without hover. */}
        <div
          ref={shotRef}
          className={`c-ledger__shot${hovered ? " is-on" : ""}`}
          aria-hidden="true"
        >
          <div className="c-ledger__shot-inner">
            {hovered && !missing[hovered.slug] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={shotSrc(hovered)}
                alt=""
                className="c-ledger__shot-img"
                onError={() => setMissing((m) => ({ ...m, [hovered.slug]: true }))}
              />
            ) : (
              <div className="c-ledger__shot-blank c-checker">
                <span>{hovered?.liveUrl ? stripProtocol(hovered.liveUrl) : hovered?.title}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="c-work-cta">
        <span className="c-work-cta__star" aria-hidden="true" />
        <h2 className="c-work-cta__title">Your site belongs on this list.</h2>
        <div className="c-work-cta__aside">
          <Link href={`/${safeLocale}/creative/contact`} className="c-btn">
            Start a project →
          </Link>
          <span className="c-work-cta__status">
            <span className="c-dot" aria-hidden="true" />
            Booking builds for 2026
          </span>
        </div>
      </section>

      <CreativeFooter />
    </>
  );
}
