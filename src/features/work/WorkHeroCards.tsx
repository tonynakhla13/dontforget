"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { WorkProject } from "./page";

const G = "70,174,34";

function getSlug(p: WorkProject) { return p.slug ?? p.id; }

export default function WorkHeroCards({ projects }: { projects: WorkProject[] }) {
  const cards   = projects.slice(0, 4);
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const [imgErr, setImgErr]   = useState<Record<number, boolean>>({});

  /* ── auto-play ── */
  useEffect(() => {
    if (paused || cards.length < 2) return;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % cards.length);
    }, 3200);
    return () => clearInterval(id);
  }, [paused, cards.length]);

  if (!cards.length) return null;

  const CARD_W = 460;
  const CARD_H = 300;

  return (
    <>
      <style>{`
        @keyframes whc-scan {
          0%   { top: -2px; opacity: 0; }
          6%   { opacity: .7; }
          94%  { opacity: .5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes whc-dot {
          0%,100% { opacity:1; } 50% { opacity:.25; }
        }
      `}</style>

      <div
        style={{ position: "relative", flexShrink: 0, alignSelf: "center" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* glow */}
        <div aria-hidden style={{
          position: "absolute", inset: "-25%",
          background: `radial-gradient(ellipse at 50% 50%, rgba(${G},0.12) 0%, transparent 65%)`,
          filter: "blur(55px)", pointerEvents: "none",
        }} />

        {/* card stack */}
        <div style={{ position: "relative", width: CARD_W, height: CARD_H }}>
          {[...cards].reverse().map((project, ri) => {
            const idx  = cards.length - 1 - ri;
            const dist = (idx - active + cards.length) % cards.length; // 0=active, 1=next…
            const isActive = dist === 0;

            /* positional offsets based on distance from active */
            const tx    = dist === 0 ? 0 : dist * 14;
            const ty    = dist === 0 ? 0 : dist * -10;
            const rz    = dist === 0 ? 0 : dist * 3.5;
            const scale = dist === 0 ? 1 : 1 - dist * 0.055;
            const tz    = dist === 0 ? 0 : -dist * 30;

            return (
              <Link
                key={project.id}
                href={`/work/${getSlug(project)}`}
                onClick={e => {
                  if (!isActive) { e.preventDefault(); setActive(idx); }
                }}
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: 20, overflow: "hidden",
                  display: "block", textDecoration: "none",
                  transform: `perspective(1000px) translate3d(${tx}px,${ty}px,${tz}px) rotateZ(${rz}deg) scale(${scale})`,
                  zIndex: cards.length - dist,
                  opacity: dist === 0 ? 1 : Math.max(0.35, 1 - dist * 0.22),
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, box-shadow 0.5s ease",
                  boxShadow: isActive
                    ? `0 40px 100px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(${G},0.5), 0 0 60px rgba(${G},0.15)`
                    : `0 ${16 + dist * 6}px ${50 + dist * 12}px rgba(0,0,0,${0.5 + dist * 0.1})`,
                  cursor: isActive ? "pointer" : "pointer",
                  willChange: "transform",
                }}
              >
                {/* image */}
                <div style={{ position: "absolute", inset: 0, background: "#040a07" }}>
                  {project.coverImage && !imgErr[idx] ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      style={{
                        objectFit: "cover",
                        opacity: isActive ? 0.88 : 0.55,
                        filter: `saturate(${isActive ? 1 : 0.7}) contrast(1.1)`,
                        transition: "opacity 0.5s, filter 0.5s",
                      }}
                      sizes="460px"
                      onError={() => setImgErr(p => ({ ...p, [idx]: true }))}
                    />
                  ) : (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `
                        linear-gradient(rgba(${G},0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(${G},0.06) 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px",
                    }} />
                  )}
                </div>

                {/* vignette */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(170deg, rgba(4,10,7,0.1) 0%, rgba(4,10,7,0.82) 100%)",
                }} />

                {/* scan line — only on active */}
                {isActive && (
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, transparent, rgba(${G},0.65), transparent)`,
                      animation: "whc-scan 3.2s linear infinite",
                    }} />
                  </div>
                )}

                {/* top: category + year */}
                <div style={{
                  position: "absolute", top: 16, left: 16, right: 16,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.4s",
                }}>
                  {project.category && (
                    <span style={{
                      fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
                      letterSpacing: "0.38em", textTransform: "uppercase",
                      color: `rgba(${G},0.9)`,
                      background: "rgba(4,10,7,0.65)", backdropFilter: "blur(8px)",
                      border: `1px solid rgba(${G},0.35)`,
                      borderRadius: 999, padding: "4px 10px",
                    }}>
                      {project.category}
                    </span>
                  )}
                  <span style={{
                    fontFamily: "var(--font-mono-next)", fontSize: "0.38rem",
                    letterSpacing: "0.32em", color: "rgba(255,255,255,0.42)",
                    background: "rgba(4,10,7,0.5)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 999, padding: "4px 10px",
                  }}>
                    {project.year ?? "2025"}
                  </span>
                </div>

                {/* bottom: title */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "1.1rem 1.25rem",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.4s, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <div style={{ height: 1, background: `linear-gradient(90deg, rgba(${G},0.4), transparent)`, marginBottom: "0.55rem" }} />
                  <h3 style={{
                    fontFamily: "var(--font-display-next)",
                    fontSize: "clamp(1.7rem,3vw,2.4rem)",
                    lineHeight: 0.92, letterSpacing: "-0.02em",
                    color: "#F8F5EE",
                  }}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <p style={{
                      marginTop: "0.45rem",
                      fontFamily: "var(--font-mono-next)",
                      fontSize: "0.56rem", lineHeight: 1.6,
                      color: "rgba(255,255,255,0.52)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {project.description}
                    </p>
                  )}
                </div>

                {/* card border */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
                  border: `1px solid rgba(${G},${isActive ? 0.5 : 0.12})`,
                  transition: "border-color 0.5s",
                }} />
              </Link>
            );
          })}
        </div>

        {/* ── dot indicators ── */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 8, marginTop: 18,
        }}>
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
              style={{
                width: i === active ? 22 : 7,
                height: 7,
                borderRadius: 99,
                background: i === active ? `rgba(${G},1)` : `rgba(${G},0.25)`,
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s",
                boxShadow: i === active ? `0 0 10px rgba(${G},0.6)` : "none",
              }}
            />
          ))}
          {/* auto-play status dot */}
          <span style={{
            width: 5, height: 5, borderRadius: "50%", marginLeft: 4,
            background: paused ? "rgba(255,255,255,0.2)" : `rgba(${G},0.8)`,
            animation: paused ? "none" : "whc-dot 1.6s ease-in-out infinite",
            transition: "background 0.3s",
          }} />
        </div>
      </div>
    </>
  );
}
