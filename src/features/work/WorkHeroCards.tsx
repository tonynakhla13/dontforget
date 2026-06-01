"use client";

/**
 * WorkHeroCards
 * Two project cards stacked in 3-D perspective.
 * On hover: card rises, rotates to face viewer, reveals name + "why best".
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WorkProject } from "./page";

const WHY_BEST: Record<number, string> = {
  0: "Clients keep sending us screenshots of competitors who copied it.",
  1: "It converted so well, we had to double-check the analytics weren't broken.",
};

const WHY_FALLBACK = "Shipped on time. Looks illegal. Client wept (happy tears).";

function getSlug(p: WorkProject) {
  return p.slug ?? p.id;
}

/* ── Single stacked card ── */
function HeroCard({
  project,
  idx,
  isHovered,
  otherHovered,
  onEnter,
  onLeave,
}: {
  project: WorkProject;
  idx: number;
  isHovered: boolean;
  otherHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImg = Boolean(project.coverImage && !imgFailed);

  /* stacking transforms — card 0 is front-left, card 1 is back-right */
  const baseTransform = idx === 0
    ? "perspective(900px) rotateY(-14deg) rotateX(6deg) translateZ(0px)"
    : "perspective(900px) rotateY(-8deg)  rotateX(3deg) translateZ(-38px) translateX(48px) translateY(18px)";

  const hoverTransform  = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(24px)";
  const sinkTransform   = idx === 0
    ? "perspective(900px) rotateY(-18deg) rotateX(8deg)  translateZ(-20px) translateX(-10px)"
    : "perspective(900px) rotateY(-10deg) rotateX(5deg)  translateZ(-60px)  translateX(56px) translateY(22px)";

  const transform = isHovered ? hoverTransform : otherHovered ? sinkTransform : baseTransform;
  const zIndex    = isHovered ? 10 : idx === 0 ? 2 : 1;
  const opacity   = otherHovered ? 0.55 : 1;

  return (
    <Link
      href={`/work/${getSlug(project)}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 20,
        overflow: "hidden",
        transform,
        opacity,
        zIndex,
        transition: "transform 0.52s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, box-shadow 0.4s ease",
        boxShadow: isHovered
          ? "0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(70,174,34,0.55), 0 0 60px rgba(70,174,34,0.18)"
          : "0 24px 72px rgba(0,0,0,0.6), 0 0 0 1px rgba(70,174,34,0.2)",
        cursor: "pointer",
        textDecoration: "none",
        display: "block",
        willChange: "transform",
      }}
    >
      {/* image or fallback */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,10,7,0.95)" }}>
        {hasImg ? (
          <Image
            src={project.coverImage!}
            alt={project.title}
            fill
            style={{ objectFit: "cover", opacity: 0.75, filter: "saturate(0.85) contrast(1.1)" }}
            sizes="360px"
            onError={() => setImgFailed(true)}
          />
        ) : (
          /* fallback — grid pattern */
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              linear-gradient(rgba(70,174,34,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(70,174,34,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }} />
        )}
      </div>

      {/* dark vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(4,10,7,0.25) 0%, rgba(4,10,7,0.85) 100%)",
      }} />

      {/* scan line sweep (green bar) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(70,174,34,0.7), transparent)",
          animation: `hc-scan-${idx} ${3.2 + idx * 0.8}s linear infinite`,
        }} />
      </div>

      {/* top badge */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
          letterSpacing: "0.44em", textTransform: "uppercase",
          color: "rgba(70,174,34,0.85)",
          background: "rgba(4,10,7,0.65)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 999,
          border: "1px solid rgba(70,174,34,0.28)",
        }}>
          {idx === 0 ? "★ Top this month" : "↑ Rising"}
        </span>
        {project.category && (
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
            letterSpacing: "0.30em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            background: "rgba(4,10,7,0.55)", backdropFilter: "blur(8px)",
            padding: "4px 10px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.10)",
          }}>
            {project.category}
          </span>
        )}
      </div>

      {/* bottom info — always visible */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "clamp(1rem,2vw,1.5rem)",
        transform: isHovered ? "translateY(0)" : "translateY(8px)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* title */}
        <h3 style={{
          fontFamily: "var(--font-display-next)",
          fontSize: "clamp(1.6rem,2.5vw,2.2rem)",
          lineHeight: 0.95, letterSpacing: "-0.02em",
          color: "#F8F5EE",
          marginBottom: "0.6rem",
        }}>
          {project.title}
        </h3>

        {/* "why it's the best" — slides up on hover */}
        <div style={{
          maxHeight: isHovered ? 120 : 0,
          overflow: "hidden",
          transition: "max-height 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.62rem", lineHeight: 1.7,
            color: "rgba(255,255,255,0.62)",
            marginBottom: "0.9rem",
            paddingTop: "0.3rem",
          }}>
            {WHY_BEST[idx] ?? WHY_FALLBACK}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.44rem", letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "rgba(70,174,34,0.9)",
          }}>
            View project <span style={{ fontSize: "0.9em" }}>→</span>
          </span>
        </div>
      </div>

      {/* green top-edge glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        borderRadius: 20,
        border: "1px solid rgba(70,174,34,0.22)",
        transition: "border-color 0.4s ease",
        ...(isHovered && { borderColor: "rgba(70,174,34,0.6)" }),
      }} />
    </Link>
  );
}

/* ── Root export ── */
export default function WorkHeroCards({ projects }: { projects: WorkProject[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const top2 = projects.slice(0, 2);

  if (top2.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes hc-scan-0 {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes hc-scan-1 {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 0.7; }
          95%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <div style={{
        position: "relative",
        width: "min(420px, 44vw)",
        aspectRatio: "4 / 3",
        flexShrink: 0,
        /* push up to align with heading */
        alignSelf: "center",
      }}>
        {/* ambient glow behind cards */}
        <div aria-hidden style={{
          position: "absolute", inset: "-20%",
          background: "radial-gradient(ellipse at 55% 50%, rgba(70,174,34,0.14) 0%, transparent 68%)",
          filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
        }} />

        {top2.map((project, idx) => (
          <HeroCard
            key={project.id}
            project={project}
            idx={idx}
            isHovered={hovered === idx}
            otherHovered={hovered !== null && hovered !== idx}
            onEnter={() => setHovered(idx)}
            onLeave={() => setHovered(null)}
          />
        ))}

        {/* label below */}
        <div style={{
          position: "absolute", bottom: -36, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.40rem", letterSpacing: "0.42em",
            textTransform: "uppercase", color: "rgba(70,174,34,0.45)",
          }}>
            Hover to inspect
          </span>
        </div>
      </div>
    </>
  );
}
