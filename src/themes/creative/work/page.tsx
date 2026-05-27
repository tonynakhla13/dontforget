"use client";

import { useState } from "react";
import Link from "next/link";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFooter from "@/components/creative/CreativeFooter";

const FILTERS = ["All work", "Brand", "Web", "Motion", "Packaging", "Campaign"];

const CASES = [
  { cat: "brand",     size: "wide",  bg: "#dfead0",                                                title: "Urban Threads — A loud little clothing label",    label: "Brand Identity",  date: "FEB 2024" },
  { cat: "packaging", size: "tall",  bg: "linear-gradient(135deg, #b8b8b8, #6e6e6e)",               title: "Lume Skincare",                                   label: "Packaging",       date: "AUG 2024" },
  { cat: "campaign",  size: "third", bg: "linear-gradient(135deg, #46D12A, #d2ff8b)",                title: "TechCon 2024",                                    label: "Campaign",        date: "APR 2024" },
  { cat: "web",       size: "third", bg: "linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), rgb(233,233,233)", title: "Northwind Co.", label: "Website", date: "JUN 2024" },
  { cat: "motion",    size: "third", bg: "linear-gradient(135deg, #2a2a2a, #5a5a5a)",               title: "Field Notes Title Sequence",                      label: "Motion",          date: "SEP 2024" },
  { cat: "brand",     size: "half",  bg: "linear-gradient(135deg, #f4cdab, #efb487)",               title: "Tessa Coffee — A new third wave",                 label: "Brand Identity",  date: "NOV 2024" },
  { cat: "web",       size: "half",  bg: "linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), rgb(233,233,233)", title: "Otherspace — A travel publication", label: "Web", date: "JAN 2025" },
  { cat: "packaging", size: "third", bg: "linear-gradient(135deg, #e7d6ff, #b1a0e0)",               title: "Mara Botanicals",                                 label: "Packaging",       date: "MAR 2025" },
  { cat: "brand",     size: "third", bg: "linear-gradient(135deg, #ffd2d2, #ff9b9b)",               title: "Heat Studio Gym",                                 label: "Identity",        date: "APR 2025" },
  { cat: "motion",    size: "third", bg: "linear-gradient(135deg, #c3e0ff, #6da8e8)",               title: "Helio Energy — Launch film",                      label: "Motion",          date: "APR 2025" },
  { cat: "campaign",  size: "wide",  bg: "linear-gradient(135deg, rgb(35,31,32), #4a4a4a)",         title: "Don't Sleep — A spring-summer drop for Atelier 22", label: "Campaign",     date: "MAY 2025" },
  { cat: "web",       size: "tall",  bg: "linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), linear-gradient(45deg, rgba(35,31,32,.10) 25%, transparent 25%, transparent 75%, rgba(35,31,32,.10) 75%), rgb(233,233,233)", title: "Hum — A meditation product", label: "Web App", date: "JUN 2025" },
  { cat: "packaging", size: "half",  bg: "linear-gradient(135deg, #f7e3a0, #e6c358)",               title: "Honeyfield Reserve",                              label: "Packaging",       date: "JUL 2025" },
  { cat: "brand",     size: "half",  bg: "linear-gradient(135deg, #2a2a2a, #5a5a5a)",               title: "Constant Capital — A challenger bank",            label: "Identity + Web",  date: "AUG 2025" },
];

const MARQUEE_ITEMS = ["42 Awards", "14 Cannes Pencils", "3 D&AD Yellow", "1 Wallpaper* feature"];

export default function CreativeWorkPage() {
  const [active, setActive] = useState("All work");

  const filtered = active === "All work"
    ? CASES
    : CASES.filter((c) => c.cat === active.toLowerCase());

  return (
    <>
      <CreativeNavbar active="work" />

      <CreativePageHero
        crumb="Home / Work"
        title={<>Selected<br /><em>work</em><br />2018&nbsp;—&nbsp;2025.</>}
        sub="Fourteen of three-hundred-and-counting. A mix of identity systems, marketing sites, packaging and the occasional film. Click anything to dig in."
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
          {filtered.map((c, i) => (
            <article key={i} className={`c-case c-case--${c.size}`}>
              <div className="c-case__img" style={{ background: c.bg }} />
              <div className="c-case__meta">
                <div>
                  <div className="c-case__c">{c.label}</div>
                  <div className="c-case__t">{c.title}</div>
                </div>
                <span className="c-case__c">{c.date}</span>
              </div>
            </article>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
          <Link href="/creative/contact" className="c-btn c-btn--ink">
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
          <Link href="/creative/contact" className="c-btn" style={{ position: "relative", zIndex: 3 }}>
            Send it over <span className="c-blink" />
          </Link>
        </div>
      </section>

      <CreativeFooter />
    </>
  );
}
