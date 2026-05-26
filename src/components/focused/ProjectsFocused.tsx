"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { NoxNavbar, NoxFooter, NoxPageIntro, NoxCTABar, TK, SANS } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type FocusedProject = {
  id:          string;
  slug:        string;
  title:       string;
  category:    string | null;
  description: string | null;
  coverImage:  string | null;
};

const FALLBACK: FocusedProject[] = [
  { id: "1", slug: "elia-clinic",  title: "Elia Clinic",  category: "Healthcare",    description: "Brand identity and digital experience for a modern healthcare clinic.", coverImage: null },
  { id: "2", slug: "montgab",      title: "Montgab",      category: "E-Commerce",    description: "Full e-commerce build - product, UX, and conversion strategy.", coverImage: null },
  { id: "3", slug: "180-degrees",  title: "180 Degrees",  category: "Agency / Brand", description: "Campaign concept and creative direction for a bold agency rebrand.", coverImage: null },
  { id: "4", slug: "launchpad",    title: "Launchpad",    category: "SaaS Platform", description: "Product launch and digital experience for a B2B SaaS tool.", coverImage: null },
];

const FILTERS = ["all", "identity", "website", "campaign", "e-commerce", "saas"];

export default function ProjectsFocused({ projects }: { projects?: FocusedProject[] }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const list     = projects?.length ? projects : FALLBACK;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tk-work-card", {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-work-grid", start: "top 78%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="our work" />

      <NoxPageIntro
        eyebrow="/ our work"
        title="things we"
        italic="made."
        lede="A sampler - for the full case studies, get in touch. Some of our favourite stuff is still under NDA."
      />

      {/* ── Filters ── */}
      <nav style={{
        display:        "flex",
        gap:            "clamp(0.5rem, 1vw, 0.75rem)",
        justifyContent: "center",
        flexWrap:       "wrap",
        padding:        "clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderTop:      `1px solid ${TK.line}`,
        borderBottom:   `1px solid ${TK.line}`,
      }}>
        {FILTERS.map((f, i) => (
          <button key={f} style={{
            background:  i === 0 ? TK.green : "transparent",
            border:      `1px solid ${i === 0 ? TK.green : "rgba(70,174,34,0.4)"}`,
            color:       i === 0 ? TK.paper : TK.green,
            padding:     "clamp(6px, 1vw, 10px) clamp(12px, 2vw, 22px)",
            fontFamily:  SANS,
            fontSize:    "clamp(0.72rem, 0.9vw, 0.9rem)",
            cursor:      "pointer",
            transition:  "background 150ms ease, color 150ms ease",
          }}
          onMouseEnter={e => {
            if (i !== 0) {
              e.currentTarget.style.background = "rgba(70,174,34,0.1)";
            }
          }}
          onMouseLeave={e => {
            if (i !== 0) {
              e.currentTarget.style.background = "transparent";
            }
          }}
          >{f}</button>
        ))}
      </nav>

      {/* ── Work grid ── */}
      <section className="tk-work-grid" style={{
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(5rem, 9vw, 10rem)",
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap:     "clamp(1.5rem, 3vw, 2.5rem)",
      }}>
        {list.map((p, i) => {
          const isLarge = i === 0 || i === list.length - 1;
          return (
            <Link key={p.id}
              href={`/en/focused/work/${p.slug}`}
              className="tk-work-card"
              style={{
                gridColumn:    isLarge ? "span 6" : "span 3",
                textDecoration:"none",
                display:       "block",
              }}
            >
              {/* Photo placeholder */}
              <div style={{
                background:  TK.green,
                aspectRatio: isLarge ? "16 / 10" : "4 / 3",
                marginBottom: 16,
                transition:  "filter 200ms ease",
                overflow:    "hidden",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.1)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1)")}
              >
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>

              {/* Meta row */}
              <div style={{
                display:             "grid",
                gridTemplateColumns: "clamp(36px, 4vw, 52px) 1fr auto",
                alignItems:          "baseline",
                gap:                 "clamp(0.8rem, 1.5vw, 1.5rem)",
                padding:             "clamp(0.5rem, 1vw, 1rem) 0 clamp(1rem, 2vw, 2rem)",
                borderTop:           `1px solid rgba(70,174,34,0.2)`,
              }}>
                <span style={{ fontFamily: SANS, fontSize: "clamp(0.65rem, 0.82vw, 0.82rem)", letterSpacing: "0.18em", color: TK.green, opacity: 0.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong style={{ fontFamily: SANS, fontWeight: 600, fontSize: "clamp(1.1rem, 2.2vw, 2rem)", color: TK.paper, textTransform: "lowercase" }}>
                  {p.title}
                </strong>
                <span style={{ fontFamily: SANS, fontSize: "clamp(0.72rem, 0.9vw, 0.9rem)", color: TK.green }}>
                  {p.category}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <NoxCTABar label="Got a project? →" />
      <NoxFooter />
    </div>
  );
}
