"use client";

import { useState } from "react";
import Link from "next/link";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativeFooter from "@/components/creative/CreativeFooter";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/data/portfolio-projects";

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

const PROJECTS = [...PORTFOLIO_PROJECTS].sort((a, b) => a.order - b.order);
const LIVE_COUNT = PROJECTS.filter((p) => p.liveUrl).length;
const FEATURED_COUNT = PROJECTS.filter((p) => p.featured).length;
const FILTER_COUNTS: Record<string, number> = Object.fromEntries(
  FILTERS.map((f) => [f.key, PROJECTS.filter((p) => f.match(p.projectType)).length]),
);

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function stackLabel(project: PortfolioProject) {
  if (project.tags.length) return project.tags.join(" · ");
  return TYPE_LABEL[project.projectType] ?? "Website";
}

export default function CreativeWorkPage({ locale = "en" }: { locale?: string }) {
  const safeLocale = locale === "ar" ? "ar" : "en";
  const [active, setActive] = useState("all");

  const activeFilter = FILTERS.find((f) => f.key === active) ?? FILTERS[0];
  const rows = PROJECTS.filter((p) => activeFilter.match(p.projectType));

  return (
    <>
      <CreativeNavbar active="work" />

      <section className="c-work-hero">
        <p className="c-work-hero__eyebrow">/ Portfolio — 2026</p>
        <div className="c-work-hero__head">
          <h1 className="c-work-hero__title">
            Thirty-four<br />shipped sites.
          </h1>
          <aside
            className="c-work-hero__panel"
            aria-label={`${LIVE_COUNT} of ${PROJECTS.length} projects are live right now`}
          >
            <span className="c-work-hero__panel-n">
              <span className="c-dot c-dot--lg" aria-hidden="true" />
              {LIVE_COUNT}
            </span>
            <span className="c-work-hero__panel-l">live right now</span>
          </aside>
        </div>
        <p className="c-work-hero__sub">
          Everything below is a real website we designed, built, and shipped. Open a
          project for the case study, or follow the arrow straight to the live site.
        </p>
        <ul className="c-work-hero__tally">
          <li>{String(PROJECTS.length).padStart(2, "0")}<span>projects</span></li>
          <li>{String(LIVE_COUNT).padStart(2, "0")}<span>live</span></li>
          <li>{String(FEATURED_COUNT).padStart(2, "0")}<span>featured</span></li>
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
              <sup>{FILTER_COUNTS[f.key]}</sup>
            </button>
          ))}
        </div>
        <span className="c-work-filter__count">
          showing {rows.length} / {PROJECTS.length}
        </span>
      </div>

      <section className="c-ledger">
        {rows.length === 0 ? (
          <p className="c-ledger__empty">Nothing in this category yet.</p>
        ) : (
          <ul className="c-ledger__list">
            {rows.map((project) => (
              <li
                key={project.slug}
                className={`c-ledger__row${project.featured ? " c-ledger__row--featured" : ""}`}
              >
                <Link
                  href={`/${safeLocale}/creative/work/${encodeURIComponent(project.slug)}`}
                  className="c-ledger__hit"
                  aria-label={`${project.title} — read the case study`}
                />
                <div className="c-ledger__main">
                  <span className="c-ledger__num">{String(project.order).padStart(2, "0")}</span>
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
