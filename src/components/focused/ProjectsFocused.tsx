"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { NoxNavbar, NoxFooter, NoxCTABar, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type FocusedProject = {
  id:          string;
  slug:        string;
  title:       string;
  category:    string | null;
  description: string | null;
  coverImage:  string | null;
};

const ACCENT     = "#46ae22";
const ACCENT_HOT = "#46d12a";
const ACCENT_RGB = "70,174,34";
const P          = "clamp(1.5rem,4vw,3.5rem)";
const MAX        = "1400px";

const FALLBACK: FocusedProject[] = [
  {
    id: "1", slug: "elia-clinic", title: "Elia Clinic", category: "Healthcare",
    description: "Brand identity and digital experience built around trust, clarity, and fast patient decisions.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90&auto=format&fit=crop",
  },
  {
    id: "2", slug: "montgab", title: "Montgab", category: "E-Commerce",
    description: "A retail storefront with strong merchandising, sharp product discovery, and a premium shopping rhythm.",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=90&auto=format&fit=crop",
  },
  {
    id: "3", slug: "180-degrees", title: "180 Degrees", category: "Agency / Brand",
    description: "Brand system and digital presence shaped for a creative team that needed bold work to feel organized.",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=90&auto=format&fit=crop",
  },
  {
    id: "4", slug: "launchpad", title: "Launchpad", category: "SaaS Platform",
    description: "Product launch experience focused on performance data, onboarding clarity, and high-signal moments.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=90&auto=format&fit=crop",
  },
];

/* ── alternating grid column helper ─────────────────────────────────── */
function colSpan(i: number, total: number): number {
  if (total === 1) return 3;
  if (total === 2) return i === 0 ? 2 : 1;
  const pairIdx  = Math.floor(i / 2);
  const isEvenPair  = pairIdx % 2 === 0;
  const isFirstOfPair = i % 2 === 0;
  // even pairs:  wide(2) | narrow(1)
  // odd pairs:   narrow(1) | wide(2)
  if (isEvenPair)  return isFirstOfPair ? 2 : 1;
  return isFirstOfPair ? 1 : 2;
}

/* ── card placeholder ────────────────────────────────────────────────── */
function CardPlaceholder({ num }: { num: string }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(135deg, #050907 0%, #0a1208 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* grid lines */}
      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={`${(i + 1) * 8.33}%`} y1="0" x2={`${(i + 1) * 8.33}%`} y2="100%"
            stroke={`rgba(${ACCENT_RGB},0.05)`} strokeWidth="1" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`}
            stroke={`rgba(${ACCENT_RGB},0.05)`} strokeWidth="1" />
        ))}
      </svg>
      <span style={{
        fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
        fontSize: "clamp(8rem,22vw,28rem)", lineHeight: 1,
        color: `rgba(${ACCENT_RGB},0.045)`, letterSpacing: "-0.05em",
        userSelect: "none", pointerEvents: "none",
      }}>
        {num}
      </span>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
        opacity: 0.3,
      }} />
    </div>
  );
}

/* ── single project card ─────────────────────────────────────────────── */
function ProjectCard({
  project, index, locale, span,
}: {
  project: FocusedProject;
  index:   number;
  locale?: string;
  span:    number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const barRef  = useRef<HTMLDivElement>(null);
  const btnRef  = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const num    = String(index + 1).padStart(2, "0");
  const href   = `/${locale ?? "en"}/focused/work/${project.slug}`;
  const isWide = span === 2;
  // narrow cards are portrait-taller, wide cards are landscape
  const cardH  = isWide
    ? "clamp(360px,42vw,540px)"
    : "clamp(480px,58vw,700px)";

  function enter() {
    if (cardRef.current)   { cardRef.current.style.transform = isWide ? "scale(1.03)" : "scale(1.04)"; cardRef.current.style.zIndex = "10"; }
    if (imgRef.current)    imgRef.current.style.transform    = "scale(1.07)";
    if (barRef.current)    barRef.current.style.transform    = "scaleY(1)";
    if (overlayRef.current) overlayRef.current.style.opacity = "1";
    if (btnRef.current)    {
      btnRef.current.style.background   = ACCENT;
      btnRef.current.style.color        = "#000";
      btnRef.current.style.borderColor  = ACCENT;
    }
  }
  function leave() {
    if (cardRef.current)   { cardRef.current.style.transform = "scale(1)"; cardRef.current.style.zIndex = "1"; }
    if (imgRef.current)    imgRef.current.style.transform    = "scale(1)";
    if (barRef.current)    barRef.current.style.transform    = "scaleY(0)";
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
    if (btnRef.current)    {
      btnRef.current.style.background  = "transparent";
      btnRef.current.style.color       = TK.paper;
      btnRef.current.style.borderColor = "rgba(255,255,255,0.3)";
    }
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      className="pwf-card"
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        display:        "block",
        gridColumn:     `span ${span}`,
        position:       "relative",
        height:         cardH,
        overflow:       "hidden",
        textDecoration: "none",
        color:          TK.paper,
        zIndex:         1,
        transition:     "transform 420ms cubic-bezier(0.22,1,0.36,1), z-index 0ms",
        willChange:     "transform",
      }}
    >
      {/* ── background image ── */}
      <div
        ref={imgRef}
        style={{
          position: "absolute", inset: 0,
          transition: "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform",
        }}
      >
        {project.coverImage
          ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )
          : <CardPlaceholder num={num} />
        }
      </div>

      {/* ── base gradient overlay ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 100%)",
        zIndex: 1,
      }} />

      {/* ── hover overlay (brightens slightly) ── */}
      <div ref={overlayRef} aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: `rgba(${ACCENT_RGB},0.04)`,
        opacity: 0,
        transition: "opacity 300ms ease",
      }} />

      {/* ── left green accent bar on hover ── */}
      <div ref={barRef} aria-hidden style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3, zIndex: 5,
        background: `linear-gradient(to bottom, ${ACCENT_HOT}, ${ACCENT})`,
        transform: "scaleY(0)", transformOrigin: "top center",
        transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
      }} />

      {/* ── top-left: category tag ── */}
      {project.category && (
        <span style={{
          position: "absolute", top: "clamp(1rem,1.8vw,1.8rem)", left: "clamp(1rem,1.8vw,1.8rem)",
          padding: "4px 12px",
          border: `1px solid rgba(${ACCENT_RGB},0.5)`,
          background: `rgba(${ACCENT_RGB},0.12)`,
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          fontFamily: SANS, fontSize: "0.55rem",
          letterSpacing: "0.26em", textTransform: "uppercase",
          color: ACCENT, zIndex: 3, whiteSpace: "nowrap",
        }}>
          {project.category}
        </span>
      )}

      {/* ── top-right: faint number ── */}
      <span aria-hidden style={{
        position: "absolute", top: "clamp(0.8rem,1.5vw,1.5rem)", right: "clamp(1rem,1.8vw,1.8rem)",
        fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
        fontSize: isWide ? "clamp(4rem,9vw,11rem)" : "clamp(3rem,6vw,7rem)",
        color: "rgba(255,255,255,0.04)", lineHeight: 1,
        letterSpacing: "-0.05em", userSelect: "none", zIndex: 3,
      }}>
        {num}
      </span>

      {/* ── bottom content ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4,
        padding: `clamp(1.8rem,3vw,3rem) clamp(1.5rem,2.5vw,2.5rem)`,
        display: "flex", flexDirection: "column", gap: "clamp(0.8rem,1.3vw,1.3rem)",
      }}>
        {/* title */}
        <h2 style={{
          fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
          fontSize: isWide
            ? "clamp(2.2rem,4.5vw,6rem)"
            : "clamp(1.8rem,3.2vw,4rem)",
          lineHeight: 0.92, letterSpacing: "-0.035em",
          color: TK.paper, margin: 0,
        }}>
          {project.title}
        </h2>

        {/* description */}
        {project.description && (
          <p style={{
            fontFamily: SANS,
            fontSize: "clamp(0.78rem,0.95vw,0.95rem)",
            lineHeight: 1.6, color: "rgba(255,255,255,0.6)",
            margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            maxWidth: isWide ? "55ch" : "38ch",
          }}>
            {project.description}
          </p>
        )}

        {/* footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <span ref={btnRef} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0.55rem 1.3rem",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent",
            color: TK.paper,
            fontFamily: SANS, fontWeight: 700,
            fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase",
            pointerEvents: "none",
            transition: "background 240ms ease, color 240ms ease, border-color 240ms ease",
          }}>
            View project
            <svg width={10} height={10} viewBox="0 0 10 10" fill="none"
              stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8L8 2M8 2H4M8 2v4" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── filter button ──────────────────────────────────────────────────── */
function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button ref={ref} onClick={onClick}
      onMouseEnter={() => { if (ref.current && !active) ref.current.style.background = `rgba(${ACCENT_RGB},0.1)`; }}
      onMouseLeave={() => { if (ref.current && !active) ref.current.style.background = "transparent"; }}
      style={{
        background: active ? ACCENT : "transparent",
        border: `1px solid ${active ? ACCENT : `rgba(${ACCENT_RGB},0.28)`}`,
        color: active ? "#000" : ACCENT,
        padding: "5px 16px",
        fontFamily: SANS, fontWeight: active ? 700 : 400,
        fontSize: "0.6rem", letterSpacing: "0.14em",
        textTransform: "uppercase", cursor: "pointer",
        transition: "background 160ms, border-color 160ms, color 160ms",
      }}
    >
      {label}
    </button>
  );
}

/* ── main ───────────────────────────────────────────────────────────── */
export default function ProjectsFocused({
  projects,
  locale,
}: {
  projects?: FocusedProject[];
  locale?:   string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const list    = projects?.length ? projects : FALLBACK;
  const filters = ["all", ...[...new Set(list.map((p) => p.category).filter(Boolean) as string[])]];
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? list
    : list.filter((p) => p.category?.toLowerCase() === active.toLowerCase());

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pwf-eyebrow",  { x: -20, opacity: 0, duration: 0.5,  ease: "power2.out", delay: 0.06 });
      gsap.from(".pwf-title",    { y: 72,  opacity: 0, duration: 1.15, ease: "power4.out", delay: 0.14 });
      gsap.from(".pwf-subtitle", { y: 24,  opacity: 0, duration: 0.8,  ease: "power2.out", delay: 0.42 });

      gsap.utils.toArray<HTMLElement>(".pwf-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60, opacity: 0, scale: 0.97,
          duration: 0.9, ease: "power3.out",
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .pwf-grid { grid-template-columns: 1fr !important; }
          .pwf-card { grid-column: span 1 !important; height: clamp(300px,70vw,460px) !important; }
        }
      `}</style>

      <div ref={rootRef} style={{ background: TK.ink, color: TK.paper, fontFamily: SANS }}>
        <NoxNavbar active="our work" />

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(${ACCENT_RGB},0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(${ACCENT_RGB},0.032) 1px,transparent 1px)`,
            backgroundSize: "56px 56px",
          }} />
          <div aria-hidden style={{
            position: "absolute", top: "-4rem", right: "-3rem",
            width: "clamp(280px,40vw,520px)", height: "clamp(280px,40vw,520px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${ACCENT_RGB},0.11) 0%, transparent 65%)`,
            filter: "blur(85px)", pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
            background: `linear-gradient(to bottom, transparent, ${TK.ink})`,
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: MAX, margin: "0 auto", padding: `clamp(5rem,9vw,10rem) ${P} clamp(3rem,5vw,5rem)` }}>
            <div className="pwf-eyebrow" style={{ marginBottom: "clamp(1.6rem,2.8vw,2.8rem)" }}>
              <span style={{ fontFamily: SANS, fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: ACCENT, fontWeight: 600 }}>
                / our work
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <h1 className="pwf-title" style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(4rem,9.5vw,12rem)", lineHeight: 0.88, letterSpacing: "-0.04em",
                color: TK.paper, margin: 0,
              }}>
                things we{" "}<span style={{ color: ACCENT }}>made.</span>
              </h1>
              <p className="pwf-subtitle" style={{
                fontFamily: SANS, fontSize: "clamp(0.85rem,1.05vw,1.05rem)",
                lineHeight: 1.68, color: TK.textMuted, margin: 0,
                maxWidth: "40ch", textAlign: "right",
              }}>
                A sampler of selected work. For full case studies, reach out — some of our best is still under NDA.
              </p>
            </div>
          </div>
        </section>

        {/* ══ FILTER BAR ════════════════════════════════════════════════ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1rem", flexWrap: "wrap",
          padding: `clamp(0.9rem,1.3vw,1.3rem) ${P}`,
          borderTop: `1px solid rgba(255,255,255,0.055)`,
          borderBottom: `1px solid rgba(255,255,255,0.055)`,
          maxWidth: MAX, margin: "0 auto",
        }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {filters.map((f) => (
              <FilterBtn key={f} label={f} active={f === active} onClick={() => setActive(f)} />
            ))}
          </div>
          <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT, opacity: 0.35 }}>
            {filtered.length}&nbsp;{filtered.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {/* ══ CARDS GRID ════════════════════════════════════════════════ */}
        <div style={{ maxWidth: MAX, margin: "0 auto", padding: `clamp(2rem,3.5vw,3.5rem) ${P} clamp(4rem,8vw,8rem)` }}>
          {filtered.length > 0 ? (
            <div
              className="pwf-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(0.6rem,1vw,1rem)",
              }}
            >
              {filtered.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  locale={locale}
                  span={colSpan(i, filtered.length)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "clamp(5rem,12vw,12rem) 0",
              color: TK.textFaint, fontFamily: SANS,
              fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase",
            }}>
              No projects in this category yet.
            </div>
          )}
        </div>

        {/* ══ BOTTOM STATEMENT ══════════════════════════════════════════ */}
        <div style={{
          maxWidth: MAX, margin: "0 auto",
          padding: `clamp(3.5rem,6vw,7rem) ${P}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
          borderTop: `1px solid rgba(255,255,255,0.055)`,
        }}>
          <p style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(1.6rem,3vw,4rem)", lineHeight: 1.05, letterSpacing: "-0.025em",
            color: TK.paper, margin: 0, maxWidth: "28ch",
          }}>
            Some of our best work{" "}
            <span style={{ color: "rgba(255,255,255,0.25)" }}>is still under NDA. Ask us anyway.</span>
          </p>
          <Link href={`/${locale ?? "en"}/focused/contact`}
            onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOT)}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "0.9rem 2.2rem",
              background: ACCENT, color: "#000",
              fontFamily: SANS, fontWeight: 700,
              fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase",
              textDecoration: "none", flexShrink: 0,
              transition: "background 200ms ease",
            }}
          >
            Start a project
            <svg width={12} height={12} viewBox="0 0 10 10" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8L8 2M8 2H4M8 2v4" />
            </svg>
          </Link>
        </div>

        <NoxFooter />
      </div>
    </>
  );
}
