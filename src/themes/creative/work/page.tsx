"use client";

import { useState } from "react";
import Link from "next/link";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFooter from "@/components/creative/CreativeFooter";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-projects";

const FILTERS = ["All work", ...new Set(PORTFOLIO_PROJECTS.map((project) => project.category))];

const PLACEHOLDER_BACKGROUNDS = [
  "linear-gradient(135deg, #46D12A 0%, #102808 100%)",
  "linear-gradient(135deg, #050604 0%, #1a1918 100%)",
  "linear-gradient(135deg, #f4cdab 0%, #6e4a2e 100%)",
  "linear-gradient(135deg, #dfead0 0%, #3d6200 100%)",
  "linear-gradient(135deg, #e9e9e9 0%, #7a7a7a 100%)",
];

const CASES = PORTFOLIO_PROJECTS.map((project, index) => ({
  cat: project.category,
  size: ["wide", "tall", "third", "third", "third", "half"][index % 6],
  bg: PLACEHOLDER_BACKGROUNDS[index % PLACEHOLDER_BACKGROUNDS.length],
  title: project.title,
  label: project.category,
  date: project.year,
  slug: project.slug,
}));

const MARQUEE_ITEMS = ["34 Projects", "05 Featured Works", "10+ Industries", "06+ Years Experience"];

export default function CreativeWorkPage({ locale = "en" }: { locale?: string }) {
  const [active, setActive] = useState("All work");
  const safeLocale = locale === "ar" ? "ar" : "en";

  const filtered = active === "All work"
    ? CASES
    : CASES.filter((c) => c.cat === active);

  return (
    <>
      <CreativeNavbar active="work" />

      <CreativePageHero
        crumb="Home / Work"
        title={<>Selected<br /><em>web works</em><br />2026.</>}
        sub="Thirty-four selected projects across websites, platforms, e-commerce, events, interiors, and digital experiences. Click any project to explore it."
      />

      {/* Marquee */}
      <div className="c-marquee" aria-hidden="true">
        <div className="c-marquee__track">
          {[0, 1].map((rep) => (
            <span key={rep}>
              {MARQUEE_ITEMS.map((w) => (
                <span key={w}>
                  {w}
                  <span className="c-marquee__aster" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Filter + Grid */}
      <section className="c-work-grid">
        <div className="c-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`c-filter${active === f ? " active" : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="c-cases">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/${safeLocale}/creative/work/${encodeURIComponent(c.slug)}`}
              className={`c-case c-case--${c.size}`}
              style={{ color: "inherit", textDecoration: "none" }}
              aria-label={`View ${c.title}`}
            >
              <div className="c-case__img" style={{ background: c.bg }} />
              <div className="c-case__meta">
                <div>
                  <div className="c-case__c">{c.label}</div>
                  <div className="c-case__t">{c.title}</div>
                </div>
                <span className="c-case__c">{c.date}</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
          <Link href={`/${safeLocale}/creative/contact`} className="c-btn c-btn--ink">
            Discuss your project →
          </Link>
        </div>
      </section>

      {/* CTA lime strip */}
      <section className="c-portfolio" style={{ padding: "80px 70px" }}>
        <div className="c-portfolio__card" style={{ height: "auto", padding: 60, display: "flex", gap: 50, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div className="c-portfolio__shape" aria-hidden="true" />
          <h2 style={{ fontFamily: "var(--c-f-display)", fontSize: "clamp(40px, 6vw, 96px)", letterSpacing: "-.02em", color: "var(--c-ink)", position: "relative", zIndex: 3 }}>
            Got a brief?<br />We&rsquo;d love to read it.
          </h2>
          <Link href={`/${safeLocale}/creative/contact`} className="c-btn" style={{ position: "relative", zIndex: 3 }}>
            Send it over <span className="c-blink" />
          </Link>
        </div>
      </section>

      <CreativeFooter />
    </>
  );
}
