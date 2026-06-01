"use client";

/**
 * WorkHeroCards
 * Up to 4 project cards fanned like credit cards (à la the reference image).
 * Wrapped in a HUD-style holographic frame.
 * Hover: card fans out to face viewer, reveals title + category + why-best.
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WorkProject } from "./page";

/* ── per-card "why it's the best" copy ── */
const WHY: string[] = [
  "Clients sent us screenshots of competitors copying it. Twice.",
  "Converted so hard the client thought our analytics were broken.",
  "Shipped in 3 weeks. Looks like it took 3 years. Classic us.",
  "So fast, Google Search Console started crying tears of joy.",
];

const G = "70,174,34";

function getSlug(p: WorkProject) { return p.slug ?? p.id; }

/* ── fan layout per card index (0 = front) ── */
function fanBase(i: number, total: number) {
  // rotate from slight CCW to CW as i increases
  const rotate = -8 + i * (16 / Math.max(total - 1, 1));
  const tx     = i * 52;
  const ty     = i * -8;
  const tz     = -i * 28;
  const scale  = 1 - i * 0.04;
  return `perspective(1100px) rotateZ(${rotate}deg) translate3d(${tx}px,${ty}px,${tz}px) scale(${scale})`;
}

/* ── HUD corner bracket ── */
function Bracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const s = 14;
  const t = pos.startsWith("t") ? 0 : "auto";
  const b = pos.startsWith("b") ? 0 : "auto";
  const l = pos.endsWith("l")  ? 0 : "auto";
  const r = pos.endsWith("r")  ? 0 : "auto";
  const bw: React.CSSProperties = {
    borderTopWidth:    pos.startsWith("t") ? 1.5 : 0,
    borderBottomWidth: pos.startsWith("b") ? 1.5 : 0,
    borderLeftWidth:   pos.endsWith("l")   ? 1.5 : 0,
    borderRightWidth:  pos.endsWith("r")   ? 1.5 : 0,
  };
  return (
    <div style={{
      position: "absolute", top: t, bottom: b, left: l, right: r,
      width: s, height: s,
      borderStyle: "solid", borderColor: `rgba(${G},0.85)`,
      ...bw,
    }} />
  );
}

/* ── single card ── */
function FanCard({
  project, idx, total,
  isHovered, anyHovered,
  onEnter, onLeave,
}: {
  project: WorkProject; idx: number; total: number;
  isHovered: boolean; anyHovered: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImg = Boolean(project.coverImage && !imgFailed);

  const base  = fanBase(idx, total);
  const front = `perspective(1100px) rotateZ(0deg) translate3d(${idx * 8}px,-${idx * 4}px,40px) scale(1.04)`;
  const sink  = fanBase(idx, total) + ` scale(${0.92 - idx * 0.02})`;

  const transform = isHovered ? front : (anyHovered ? sink : base);
  const zIndex    = isHovered ? 20 : (total - idx);
  const opacity   = anyHovered && !isHovered ? 0.48 : 1;

  return (
    <Link
      href={`/work/${getSlug(project)}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        left: 0, top: 0,
        width: "100%", height: "100%",
        borderRadius: 18,
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
        transform,
        opacity,
        zIndex,
        willChange: "transform, opacity",
        transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, box-shadow 0.35s ease",
        boxShadow: isHovered
          ? `0 48px 120px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(${G},0.7), 0 0 80px rgba(${G},0.2)`
          : `0 ${16 + idx * 4}px ${48 + idx * 8}px rgba(0,0,0,${0.55 + idx * 0.08}), 0 0 0 1px rgba(${G},${0.22 - idx * 0.03})`,
        cursor: "pointer",
      }}
    >
      {/* bg image / fallback */}
      <div style={{ position: "absolute", inset: 0, background: "#040a07" }}>
        {hasImg ? (
          <Image
            src={project.coverImage!}
            alt={project.title}
            fill
            style={{
              objectFit: "cover",
              opacity: isHovered ? 0.82 : 0.65 - idx * 0.06,
              filter: `saturate(${isHovered ? 1 : 0.75}) contrast(1.12)`,
              transition: "opacity 0.45s, filter 0.45s",
            }}
            sizes="400px"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              linear-gradient(rgba(${G},0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(${G},0.06) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
          }} />
        )}
      </div>

      {/* vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, rgba(4,10,7,0.18) 0%, rgba(4,10,7,0.88) 100%)`,
      }} />

      {/* scan line */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, rgba(${G},0.65), transparent)`,
          animation: `whc-scan-${idx} ${3.0 + idx * 0.7}s linear infinite`,
        }} />
      </div>

      {/* ── top row: rank badge + category ── */}
      <div style={{
        position: "absolute", top: 14, left: 14, right: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8,
      }}>
        {/* rank */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(4,10,7,0.72)", backdropFilter: "blur(10px)",
          border: `1px solid rgba(${G},${0.45 - idx * 0.06})`,
          borderRadius: 999, padding: "4px 10px",
        }}>
          <span style={{ color: `rgba(${G},1)`, fontSize: "0.65rem", lineHeight: 1 }}>
            {idx === 0 ? "★" : idx === 1 ? "↑" : "◈"}
          </span>
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.38rem",
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: `rgba(${G},${0.9 - idx * 0.12})`,
          }}>
            {idx === 0 ? "Top this week" : idx === 1 ? "Rising" : `#${idx + 1}`}
          </span>
        </div>

        {/* category */}
        {project.category && (
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.36rem",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            background: "rgba(4,10,7,0.55)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 999, padding: "4px 10px",
          }}>
            {project.category}
          </span>
        )}
      </div>

      {/* ── bottom info ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "1rem 1.1rem 1.1rem",
        transform: isHovered ? "translateY(0)" : "translateY(6px)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* year + divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.45rem" }}>
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.38rem",
            letterSpacing: "0.38em", textTransform: "uppercase",
            color: `rgba(${G},0.6)`,
          }}>
            {project.year ?? "2025"}
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(${G},0.35), transparent)` }} />
        </div>

        {/* title */}
        <h3 style={{
          fontFamily: "var(--font-display-next)",
          fontSize: "clamp(1.4rem,2.2vw,2rem)",
          lineHeight: 0.94, letterSpacing: "-0.02em",
          color: "#F8F5EE", marginBottom: "0.55rem",
        }}>
          {project.title}
        </h3>

        {/* why best — expands on hover */}
        <div style={{
          maxHeight: isHovered ? 100 : 0,
          overflow: "hidden",
          transition: "max-height 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.58rem", lineHeight: 1.65,
            color: "rgba(255,255,255,0.58)",
            marginBottom: "0.75rem",
            paddingTop: "0.2rem",
          }}>
            {WHY[idx] ?? WHY[0]}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.40rem", letterSpacing: "0.38em",
            textTransform: "uppercase", color: `rgba(${G},0.9)`,
          }}>
            View project →
          </span>
        </div>
      </div>

      {/* card border */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
        border: `1px solid rgba(${G},${isHovered ? 0.65 : 0.18 - idx * 0.03})`,
        transition: "border-color 0.4s",
      }} />
    </Link>
  );
}

/* ── root export ── */
export default function WorkHeroCards({ projects }: { projects: WorkProject[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cards = projects.slice(0, 4);
  if (cards.length === 0) return null;

  const CARD_W = 360;
  const CARD_H = 240;
  // container is wider than a single card to accommodate the fan spread
  const EXTRA_X = (cards.length - 1) * 52;

  return (
    <>
      <style>{`
        @keyframes whc-scan-0 { 0%{top:-2px;opacity:0} 5%{opacity:.75} 95%{opacity:.55} 100%{top:100%;opacity:0} }
        @keyframes whc-scan-1 { 0%{top:-2px;opacity:0} 5%{opacity:.65} 95%{opacity:.45} 100%{top:100%;opacity:0} }
        @keyframes whc-scan-2 { 0%{top:-2px;opacity:0} 5%{opacity:.55} 95%{opacity:.35} 100%{top:100%;opacity:0} }
        @keyframes whc-scan-3 { 0%{top:-2px;opacity:0} 5%{opacity:.45} 95%{opacity:.28} 100%{top:100%;opacity:0} }
        @keyframes whc-frame-pulse {
          0%,100% { opacity:.55; } 50% { opacity:.9; }
        }
        @keyframes whc-scan-h {
          0%   { left:-10%; opacity:0; }
          8%   { opacity:.7; }
          92%  { opacity:.5; }
          100% { left:110%; opacity:0; }
        }
      `}</style>

      {/* ── outer HUD frame ── */}
      <div style={{
        position: "relative",
        flexShrink: 0,
        alignSelf: "center",
      }}>
        {/* ambient glow */}
        <div aria-hidden style={{
          position: "absolute", inset: "-30%",
          background: `radial-gradient(ellipse at 50% 50%, rgba(${G},0.13) 0%, transparent 65%)`,
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* HUD panel frame */}
        <div style={{
          position: "relative",
          padding: "14px 18px 18px",
          border: `1px solid rgba(${G},0.28)`,
          borderRadius: 16,
          background: "rgba(4,10,7,0.42)",
          backdropFilter: "blur(12px)",
          boxShadow: `0 0 0 1px rgba(${G},0.08), inset 0 0 40px rgba(${G},0.04)`,
        }}>
          {/* corner brackets */}
          <Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" />

          {/* horizontal scan on the frame border */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, overflow: "hidden",
            borderRadius: 16, pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute", top: 0, width: "30%", height: 1,
              background: `linear-gradient(90deg, transparent, rgba(${G},0.8), transparent)`,
              animation: "whc-scan-h 4.5s ease-in-out infinite",
            }} />
          </div>

          {/* ── top label bar ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12, gap: 12,
          }}>
            {/* title */}
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: `rgba(${G},1)`,
                boxShadow: `0 0 8px rgba(${G},0.9)`,
                animation: "whc-frame-pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.40rem", letterSpacing: "0.44em",
                textTransform: "uppercase", color: `rgba(${G},0.82)`,
              }}>
                Top projects — this week
              </span>
            </div>

            {/* count badge */}
            <span style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.36rem", letterSpacing: "0.30em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999, padding: "3px 8px",
            }}>
              {cards.length}/{projects.length} shown
            </span>
          </div>

          {/* ── fan card area ── */}
          <div style={{
            position: "relative",
            width: CARD_W + EXTRA_X,
            height: CARD_H,
          }}>
            {/* render back-to-front */}
            {[...cards].reverse().map((project, ri) => {
              const idx = cards.length - 1 - ri;
              return (
                <FanCard
                  key={project.id}
                  project={project}
                  idx={idx}
                  total={cards.length}
                  isHovered={hovered === idx}
                  anyHovered={hovered !== null}
                  onEnter={() => setHovered(idx)}
                  onLeave={() => setHovered(null)}
                />
              );
            })}
          </div>

          {/* ── bottom info bar ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 12, gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* category pills */}
              {cards.slice(0, 3).filter(p => p.category).map((p, i) => (
                <span key={i} style={{
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.35rem", letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: `rgba(${G},${0.75 - i * 0.15})`,
                  border: `1px solid rgba(${G},${0.22 - i * 0.04})`,
                  borderRadius: 999, padding: "3px 9px",
                  background: `rgba(${G},0.04)`,
                }}>
                  {p.category}
                </span>
              ))}
            </div>

            <span style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.36rem", letterSpacing: "0.32em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
            }}>
              Hover to inspect ↑
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
