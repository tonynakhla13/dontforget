"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, TK, SANS, DISPLAY } from "./NoxShared";
import type { PublicService } from "@/lib/public-content";

gsap.registerPlugin(ScrollTrigger);

/* ── local color aliases (mapped to NOX tokens) ─────────────────────────── */
const C = {
  bg:          TK.ink,                        // #000000  ≈ brief #050706
  panel:       "#0a0e0c",                     // dark panel ≈ brief #0B0F0D
  panelSoft:   "#0e1410",                     // softer panel ≈ brief #101612
  border:      "rgba(255,255,255,0.09)",      // ≈ border-white/10
  borderStrong:"rgba(255,255,255,0.17)",      // ≈ border-white/18
  text:        TK.paper,                      // #ffffff
  muted:       "rgba(255,255,255,0.55)",      // text-white/55
  faint:       "rgba(255,255,255,0.35)",      // text-white/35
  accent:      TK.green,                      // nox green replaces #B7FF3C
  accentRgb:   "70,174,34",                   // for rgba(...)
  accentHot:   TK.greenHot,
} as const;

const P = "clamp(1.5rem,4vw,3.5rem)";        // horizontal padding
const MAX = "1400px";                         // max-width

/* ── types ──────────────────────────────────────────────────────────────── */
type Deliverable = { title: string; tagline: string; description: string; icon: string; image: string; highlight: boolean };
type ProcessItem = { title: string; description: string };
type FaqItem     = { question: string; answer: string };
type TechItem    = { id: string; name: string; icon: string | null; iconUrl: string | null };

/* ── coercions ──────────────────────────────────────────────────────────── */
function toDeliverables(val: unknown): Deliverable[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { title: String(o.title ?? ""), tagline: String(o.tagline ?? ""), description: String(o.description ?? ""), icon: String(o.icon ?? ""), image: String(o.image ?? ""), highlight: Boolean(o.highlight) };
    }
    if (typeof item === "string") return { title: item, tagline: "", description: "", icon: "", image: "", highlight: false };
    return null;
  }).filter((d): d is Deliverable => !!d && !!d.title);
}
function toProcess(val: unknown): ProcessItem[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { title: String(o.title ?? o.name ?? ""), description: String(o.description ?? o.body ?? "") };
    }
    if (typeof item === "string") return { title: item, description: "" };
    return null;
  }).filter((s): s is ProcessItem => !!s && !!s.title);
}
function toFaq(val: unknown): FaqItem[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { question: String(o.question ?? ""), answer: String(o.answer ?? "") };
    }
    return null;
  }).filter((f): f is FaqItem => !!f && !!f.question);
}
function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return String((item as Record<string, unknown>).title ?? (item as Record<string, unknown>).name ?? "");
    return "";
  }).filter(Boolean);
}

/* ── animated Nox O (eye with mouse-tracking pupil) ─────────────────────── */
function NoxO({ size = 260, bg = "#000000" }: { size?: number; bg?: string }) {
  const clipId   = useId();
  const svgRef   = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const scaleRef = useRef<SVGGElement>(null);
  const blinking = useRef(false);

  useEffect(() => {
    const OX = 610, OY = 181, MAX_R = 36;
    let rafId = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0, scaleY = 1;

    function onMouseMove(e: MouseEvent) {
      if (blinking.current) return;
      const svg = svgRef.current; if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = 330 / rect.width, sy = 362 / rect.height;
      const mx = (e.clientX - rect.left) * sx + 455;
      const my = (e.clientY - rect.top)  * sy;
      const dx = mx - OX, dy = my - OY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const r = Math.min(dist, MAX_R);
      targetX = (dx / dist) * r;
      targetY = (dy / dist) * r;
    }

    function doBlink() {
      if (blinking.current) return;
      blinking.current = true;
      let phaseT = 0, phase = 0;
      const seq = setInterval(() => {
        phaseT++;
        if (phase === 0) { scaleY = Math.max(0, 1 - phaseT / 8); if (scaleY <= 0) { phase = 1; phaseT = 0; } }
        else { scaleY = Math.min(1, phaseT / 8); if (scaleY >= 1) { clearInterval(seq); blinking.current = false; } }
      }, 16);
    }
    let blinkTimer: ReturnType<typeof setTimeout>;
    function scheduleBlink() { blinkTimer = setTimeout(() => { doBlink(); scheduleBlink(); }, 3000 + Math.random() * 1000); }
    scheduleBlink();

    function animate() {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      if (!blinking.current) scaleY += (1 - scaleY) * 0.18;
      pupilRef.current?.setAttribute("transform", `translate(${currentX.toFixed(2)} ${currentY.toFixed(2)})`);
      scaleRef.current?.setAttribute("transform", `translate(0 ${(OY * (1 - scaleY)).toFixed(2)}) scale(1 ${scaleY.toFixed(4)})`);
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMouseMove); cancelAnimationFrame(rafId); clearTimeout(blinkTimer); };
  }, []);

  return (
    <svg ref={svgRef} viewBox="360 -20 510 410" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: "auto", display: "block" }}>
      <defs>
        <clipPath id={clipId}>
          <path d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
        </clipPath>
      </defs>
      {/* outer ring — white fill with dark bg punched through by pupil */}
      <path fill="white" d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
      {/* pupil — uses current bg color so it reads as a hole */}
      <g ref={pupilRef} clipPath={`url(#${clipId})`}>
        <g ref={scaleRef}>
          <path fill={bg} d="M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z"/>
        </g>
      </g>
    </svg>
  );
}

/* ── pixel snake decorations (same as home) ─────────────────────────────── */
function PxTri({ style }: { style: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: 32, height: 48, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 0,  top: 0,  width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
      <span style={{ position: "absolute", left: 16, top: 32, width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
    </div>
  );
}
function PxTriR({ style }: { style: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: 32, height: 48, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 16, top: 0,  width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
      <span style={{ position: "absolute", left: 0,  top: 32, width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
    </div>
  );
}
function PxPair({ style }: { style: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: 24, height: 32, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 0,  top: 0,  width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green, opacity: 0.18 }} />
    </div>
  );
}

/* ── service icon ────────────────────────────────────────────────────────── */
function ServiceIcon({ title, size = 160 }: { title: string; size?: number }) {
  const t = title.toLowerCase();
  const stroke = TK.green;
  const sw = 1.4;
  const s = size;

  if (t.includes("web") && t.includes("dev")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="56" height="44" rx="3"/>
      <line x1="4" y1="20" x2="60" y2="20"/>
      <circle cx="12" cy="15" r="1.5" fill={stroke}/>
      <circle cx="19" cy="15" r="1.5" fill={stroke}/>
      <path d="M22 32l-6 4 6 4M42 32l6 4-6 4M30 28l4 16"/>
    </svg>
  );
  if (t.includes("ui") || t.includes("ux") || t.includes("design")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="32" height="44" rx="2"/>
      <rect x="44" y="6" width="14" height="20" rx="2"/>
      <rect x="44" y="32" width="14" height="18" rx="2"/>
      <line x1="12" y1="16" x2="32" y2="16"/>
      <line x1="12" y1="24" x2="32" y2="24"/>
      <line x1="12" y1="32" x2="24" y2="32"/>
    </svg>
  );
  if (t.includes("ecom") || t.includes("commerce") || t.includes("shop")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8h6l8 28h28l6-18H20"/>
      <circle cx="28" cy="52" r="3"/>
      <circle cx="44" cy="52" r="3"/>
      <line x1="32" y1="20" x2="32" y2="32"/>
      <line x1="26" y1="26" x2="38" y2="26"/>
    </svg>
  );
  if (t.includes("mobile") || t.includes("app")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="4" width="28" height="56" rx="4"/>
      <line x1="18" y1="12" x2="46" y2="12"/>
      <line x1="18" y1="52" x2="46" y2="52"/>
      <circle cx="32" cy="57" r="2"/>
      <rect x="24" y="20" width="16" height="10" rx="1"/>
      <line x1="24" y1="36" x2="40" y2="36"/>
      <line x1="24" y1="42" x2="34" y2="42"/>
    </svg>
  );
  if (t.includes("seo") || t.includes("search")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="26" cy="26" r="18"/>
      <line x1="39" y1="39" x2="58" y2="58"/>
      <line x1="16" y1="26" x2="36" y2="26"/>
      <path d="M22 20c2-4 8-4 10 0"/>
      <path d="M10 50h16M10 56h10"/>
    </svg>
  );
  if (t.includes("crm") || t.includes("booking") || t.includes("platform")) return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="8"/>
      <circle cx="44" cy="20" r="8"/>
      <path d="M4 54c0-9 7-15 16-15s16 6 16 15"/>
      <path d="M44 39c8 0 16 6 16 15"/>
      <line x1="36" y1="8" x2="44" y2="8"/>
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="52" height="52" rx="4"/>
      <path d="M20 32h24M32 20v24"/>
    </svg>
  );
}

/* ── label ───────────────────────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return (
    <span style={{
      fontFamily: SANS, fontSize: "0.68rem", letterSpacing: "0.28em",
      textTransform: "uppercase", color: C.accent, fontWeight: 600,
    }}>/ {text}</span>
  );
}

/* ── tech carousel ──────────────────────────────────────────────────────── */
function TechCarousel({ items }: { items: TechItem[] }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef(0);
  const pauseRef = useRef(false);
  const dragRef  = useRef({ active: false, startX: 0, startPos: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackEl = track;
    const half = track.scrollWidth / 2;
    function tick() {
      if (!pauseRef.current) {
        posRef.current += 0.45;
        if (posRef.current >= half) posRef.current -= half;
        if (posRef.current < 0) posRef.current += half;
        trackEl.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current };
    pauseRef.current = true;
    if (wrapRef.current) wrapRef.current.style.cursor = "grabbing";
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    let next = dragRef.current.startPos - (e.clientX - dragRef.current.startX);
    if (next < 0) next += half;
    if (next >= half) next -= half;
    posRef.current = next;
    track.style.transform = `translateX(-${next}px)`;
  }
  function onMouseUp() {
    dragRef.current.active = false;
    if (wrapRef.current) wrapRef.current.style.cursor = "grab";
    // keep paused while still hovering
  }
  function onMouseEnter() {
    pauseRef.current = true;
    if (wrapRef.current) wrapRef.current.style.cursor = "grab";
  }
  function onMouseLeave() {
    dragRef.current.active = false;
    pauseRef.current = false;
    if (wrapRef.current) wrapRef.current.style.cursor = "grab";
  }

  const doubled = [...items, ...items];
  return (
    <div
      ref={wrapRef}
      style={{ overflow: "hidden", padding: "clamp(2.2rem,3.5vw,3.5rem) 0", cursor: "grab", userSelect: "none" }}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div ref={trackRef} style={{ display: "flex", gap: "0.85rem", width: "max-content", paddingLeft: P }}>
        {doubled.map((item, i) => (
          <div key={i} className="sd-tech-pill" style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.75rem 1.4rem",
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            background: `rgba(${C.accentRgb},0.04)`,
            flexShrink: 0,
            transition: "border-color 220ms, background 220ms",
            pointerEvents: dragRef.current.active ? "none" : "auto",
          }}>
            {item.iconUrl ? (
              <img
                src={item.iconUrl}
                alt={item.name}
                className="sd-tech-icon"
                style={{ width: 26, height: 26, objectFit: "contain", transition: "filter 220ms",
                  filter: "brightness(0) invert(1) sepia(1) hue-rotate(80deg) saturate(1.8)" }}
                draggable={false}
              />
            ) : (
              <span className="sd-tech-abbr" style={{
                fontFamily: SANS, fontWeight: 700, fontSize: "0.72rem",
                color: C.accent, minWidth: 26, textAlign: "center", transition: "color 220ms",
              }}>{item.name.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="sd-tech-name" style={{
              fontFamily: SANS, fontSize: "0.9rem", fontWeight: 500,
              color: C.muted, whiteSpace: "nowrap", letterSpacing: "0.01em",
              transition: "color 220ms",
            }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── deliverable row ─────────────────────────────────────────────────────── */
function DeliverableRow({ d, index, total }: { d: Deliverable; index: number; total: number }) {
  const [hov, setHov] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  return (
    <div
      className="sd-del-row"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        borderBottom: index < total - 1 ? `1px solid ${C.border}` : "none",
        transition: "background 320ms ease",
        background: hov ? `rgba(${C.accentRgb},0.03)` : "transparent",
        cursor: "default",
      }}
    >
      {/* left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: C.accent,
        transform: hov ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "bottom",
        transition: "transform 380ms cubic-bezier(0.22,1,0.36,1)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "clamp(48px,6vw,80px) 1fr clamp(200px,28vw,400px)",
        alignItems: "start",
        gap: "clamp(1.2rem,2.5vw,2.5rem)",
        padding: `clamp(2.5rem,4vw,4.5rem) ${P} clamp(2.5rem,4vw,4.5rem) calc(${P} + 8px)`,
      }}>
        {/* number */}
        <div style={{ paddingTop: "0.55em" }}>
          <span style={{
            fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.24em",
            color: hov ? C.accentHot : C.accent,
            transition: "color 220ms",
          }}>{num}</span>
          {d.highlight && (
            <span style={{
              display: "block", marginTop: 8,
              fontFamily: SANS, fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: C.accent, border: `1px solid rgba(${C.accentRgb},0.35)`,
              padding: "0.12rem 0.4rem", width: "fit-content",
            }}>feat.</span>
          )}
        </div>

        {/* title + tagline */}
        <div>
          <h3 style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(2.2rem,5vw,7rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
            color: hov ? C.text : "transparent",
            WebkitTextStroke: hov ? "0px transparent" : `1.5px ${C.borderStrong}`,
            transition: "color 300ms ease, -webkit-text-stroke-color 300ms ease",
            margin: 0,
          }}>{d.title}</h3>
          {d.tagline && (
            <p style={{
              fontFamily: SANS, fontStyle: "italic",
              fontSize: "clamp(0.9rem,1.1vw,1.15rem)", lineHeight: 1.5,
              color: hov ? C.accent : C.faint,
              transition: "color 260ms",
              marginTop: "clamp(0.5rem,0.8vw,0.9rem)", marginBottom: 0,
            }}>{d.tagline}</p>
          )}
        </div>

        {/* description */}
        <div style={{ paddingTop: "0.4em" }}>
          {d.description && (
            <div
              className="sd-del-desc"
              dangerouslySetInnerHTML={{ __html: d.description }}
              style={{
                fontFamily: SANS, fontSize: "clamp(0.82rem,0.96vw,0.96rem)", lineHeight: 1.72,
                color: hov ? C.muted : `rgba(255,255,255,0.3)`,
                transition: "color 280ms",
                maxWidth: "52ch",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── faq row ─────────────────────────────────────────────────────────────── */
function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="sd-faq-item"
      style={{
        border: `1px solid ${open ? `rgba(${C.accentRgb},0.4)` : C.border}`,
        background: C.panel,
        transition: "border-color 220ms ease",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          width: "100%", padding: "clamp(1.4rem,2vw,2rem) clamp(1.4rem,2.2vw,2.2rem)",
          background: open ? `rgba(${C.accentRgb},0.05)` : "transparent",
          border: "none", cursor: "pointer", textAlign: "left", gap: "1.5rem",
          transition: "background 220ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(0.8rem,1.2vw,1.4rem)", flex: 1 }}>
          <span style={{
            fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.22em",
            color: C.accent, opacity: open ? 0.9 : 0.4,
            flexShrink: 0, paddingTop: "0.38em", transition: "opacity 220ms",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{
            fontFamily: SANS, fontWeight: 500, fontSize: "clamp(0.95rem,1.15vw,1.2rem)",
            color: C.text, opacity: open ? 1 : 0.7,
            lineHeight: 1.42, transition: "opacity 180ms", letterSpacing: "-0.01em",
          }}>
            {item.question}
          </span>
        </div>
        <div style={{
          width: 26, height: 26, flexShrink: 0,
          background: open ? C.accent : "transparent",
          border: `1px solid ${open ? C.accent : C.border}`,
          borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: open ? "#000" : C.accent,
          transition: "background 220ms, border-color 220ms, color 220ms",
          marginTop: "0.05em",
        }}>
          <svg width={9} height={9} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            {open ? <path d="M2 5h6"/> : <path d="M5 2v6M2 5h6"/>}
          </svg>
        </div>
      </button>

      {open && (
        <div
          className="sd-faq-answer"
          style={{
            borderTop: `1px solid ${C.border}`,
            borderLeft: `2px solid ${C.accent}`,
            background: `rgba(${C.accentRgb},0.03)`,
            padding: `clamp(1.2rem,1.8vw,1.8rem) clamp(1.4rem,2.2vw,2.2rem)`,
            paddingLeft: `calc(clamp(1.4rem,2.2vw,2.2rem) + clamp(0.8rem,1.2vw,1.4rem) + 1.4rem)`,
          }}
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      )}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function ServiceDetailFocused({ service, locale }: { service: PublicService; locale: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const deliverables = toDeliverables(service.deliverables);
  const processSteps = toProcess(service.process);
  const benefits     = toStringArray(service.benefits);
  const faqItems     = toFaq(service.faq);
  const icon         = service.icon ?? "";

  const ctaHeadline = service.ctaHeadline ?? "Let's build something impossible to ignore.";
  const ctaSubtext  = service.ctaSubtext ?? "";
  const ctaLabel    = service.ctaButtonLabel ?? "Start a project";
  const ctaLink     = service.ctaButtonLink ?? `/${locale}/focused/contact`;

  const stats = [
    deliverables.length > 0 && { n: deliverables.length, label: "Deliverables" },
    processSteps.length > 0 && { n: processSteps.length, label: "Process Steps" },
    benefits.length > 0     && { n: benefits.length,     label: "Benefits" },
  ].filter((s): s is { n: number; label: string } => !!s);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── hero entrance — staggered sequence ── */
      gsap.from(".sd-hero-back",    { x: -20, opacity: 0, duration: 0.55, ease: "power2.out", delay: 0.05 });
      gsap.from(".sd-hero-eyebrow", { y: 12,  opacity: 0, duration: 0.5,  ease: "power2.out", delay: 0.12 });
      gsap.from(".sd-hero-title",   { y: 60,  opacity: 0, duration: 1.1,  ease: "power4.out", delay: 0.2  });
      gsap.from(".sd-hero-tag",     { y: 22,  opacity: 0, duration: 0.75, ease: "power2.out", delay: 0.48 });

      /* ── stats bar slides up from below ── */
      gsap.from(".sd-stats", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.62 });
      gsap.utils.toArray<HTMLElement>(".sd-stat-num").forEach((el, i) => {
        gsap.from(el, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.7 + i * 0.09 });
      });

      /* ── overview: label clips left, text reveals up ── */
      gsap.utils.toArray<HTMLElement>(".sd-section-label").forEach((el) => {
        gsap.from(el, { x: -14, opacity: 0, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-overview-text").forEach((el) => {
        gsap.from(el, { y: 32, opacity: 0, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });

      /* ── description prose fades in ── */
      gsap.utils.toArray<HTMLElement>(".sd-prose").forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });

      /* ── benefit cards stagger up ── */
      gsap.utils.toArray<HTMLElement>(".sd-benefit").forEach((el, i) => {
        gsap.from(el, { y: 28, opacity: 0, scale: 0.97, duration: 0.55, ease: "power2.out", delay: i * 0.055, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });

      /* ── tech section label + carousel ── */
      gsap.utils.toArray<HTMLElement>(".sd-tech-label").forEach((el) => {
        gsap.from(el, { y: 12, opacity: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-tech-track").forEach((el) => {
        gsap.from(el, { opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });

      /* ── deliverables header splits in ── */
      gsap.utils.toArray<HTMLElement>(".sd-del-header-title").forEach((el) => {
        gsap.from(el, { x: -40, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-del-header-sub").forEach((el) => {
        gsap.from(el, { x: 20, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      /* rows slide in from left with stagger */
      gsap.utils.toArray<HTMLElement>(".sd-del-row").forEach((el, i) => {
        gsap.from(el, { x: -32, opacity: 0, duration: 0.65, ease: "power3.out", delay: i * 0.04, scrollTrigger: { trigger: el, start: "top 91%", once: true } });
      });

      /* ── process: header, then each step staggered ── */
      gsap.utils.toArray<HTMLElement>(".sd-process-title").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-process-sub").forEach((el) => {
        gsap.from(el, { y: 20, opacity: 0, duration: 0.7, ease: "power2.out", delay: 0.12, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-step").forEach((el, i) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.6, ease: "power2.out", delay: i * 0.06, scrollTrigger: { trigger: el, start: "top 91%", once: true } });
      });
      /* step numbers count up feel — scale from small */
      gsap.utils.toArray<HTMLElement>(".sd-step-num").forEach((el, i) => {
        gsap.from(el, { scale: 0.55, opacity: 0, duration: 0.7, ease: "back.out(1.4)", delay: i * 0.06 + 0.08, scrollTrigger: { trigger: el, start: "top 91%", once: true } });
      });

      /* ── faq header + items ── */
      gsap.utils.toArray<HTMLElement>(".sd-faq-title").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-faq-sub").forEach((el) => {
        gsap.from(el, { y: 18, opacity: 0, duration: 0.65, ease: "power2.out", delay: 0.1, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-faq-item").forEach((el, i) => {
        gsap.from(el, { y: 16, opacity: 0, duration: 0.5, ease: "power2.out", delay: i * 0.045, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      /* ── cta: label, headline, button ── */
      gsap.utils.toArray<HTMLElement>(".sd-cta-label").forEach((el) => {
        gsap.from(el, { y: 14, opacity: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-cta-title").forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.1, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-cta-sub").forEach((el) => {
        gsap.from(el, { y: 18, opacity: 0, duration: 0.65, ease: "power2.out", delay: 0.22, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".sd-cta-btn").forEach((el) => {
        gsap.from(el, { y: 18, opacity: 0, scale: 0.94, duration: 0.6, ease: "back.out(1.6)", delay: 0.32, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: C.bg, color: C.text, fontFamily: SANS }}>

      {/* ── sticky navbar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <NoxNavbar active="services" />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        {/* grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.038) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        {/* green radial glow top-center */}
        <div aria-hidden style={{
          position: "absolute", top: "-6rem", left: "50%", transform: "translateX(-50%)",
          width: "clamp(400px,60vw,800px)", height: "clamp(300px,40vw,600px)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(${C.accentRgb},0.14) 0%, transparent 68%)`,
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        {/* bottom fade */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
          background: `linear-gradient(to bottom, transparent, ${C.bg})`,
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: MAX, margin: "0 auto",
          padding: `clamp(2.5rem,4vw,4rem) ${P} clamp(4rem,7vw,7rem)`,
        }}>
          {/* icon — top right */}
          <div aria-hidden style={{
            position: "absolute",
            top: "clamp(1.5rem,3vw,3rem)",
            right: P,
            opacity: 0.22,
            pointerEvents: "none",
          }}>
            <ServiceIcon title={service.title} size={160} />
          </div>

          <Link
            href={`/${locale}/focused/services`}
            className="sd-hero-back"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: "clamp(1.5rem,2.5vw,2.5rem)",
              fontFamily: SANS, fontSize: "0.56rem", letterSpacing: "0.24em", textTransform: "uppercase",
              color: C.muted, textDecoration: "none",
              transition: "color 180ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >
            <svg width={7} height={7} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 5H2M5 8l-3-3 3-3"/></svg>
            Back to services
          </Link>

          <div className="sd-hero-eyebrow" style={{ marginBottom: "clamp(1rem,1.6vw,1.6rem)" }}>
            <Label text={icon ? `Service ${icon}` : "Service"} />
          </div>

          <h1 className="sd-hero-title" style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(4rem,11vw,13rem)", lineHeight: 0.87,
            color: C.text, letterSpacing: "-0.03em",
            margin: "0 0 clamp(1.8rem,3vw,3rem)", maxWidth: "14ch",
          }}>{service.title}</h1>

          {service.tagline && (
            <p className="sd-hero-tag" style={{
              fontFamily: SANS, fontSize: "clamp(1.05rem,1.5vw,1.5rem)",
              lineHeight: 1.5, color: C.muted, margin: 0, maxWidth: "52ch",
            }}>{service.tagline}</p>
          )}
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════════════ */}
      {stats.length > 0 && (
        <div className="sd-stats" style={{ borderBottom: `1px solid ${C.border}`, background: C.panel }}>
          <div style={{
            maxWidth: MAX, margin: "0 auto",
            display: "grid",
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            borderLeft: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: "clamp(1.6rem,2.6vw,2.6rem) clamp(1.5rem,3.5vw,3.5rem)",
                borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div className="sd-stat-num" style={{
                  fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                  fontSize: "clamp(2.8rem,5.5vw,6.5rem)", lineHeight: 1,
                  color: C.text, letterSpacing: "-0.03em",
                }}>{stat.n}</div>
                <div style={{
                  marginTop: "0.5rem",
                  fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.28em",
                  textTransform: "uppercase", color: C.faint,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ABOUT + DESCRIPTION ═══════════════════════════════════════════ */}
      {(service.shortDescription || service.description) && (
        <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: `clamp(2.5rem,4vw,5rem) ${P}` }}>
          <div style={{ maxWidth: MAX, margin: "0 auto" }}>
            {/* two-column: O left, text right */}
            <div style={{ display: "grid", gridTemplateColumns: "clamp(160px,16vw,220px) 1fr", gap: "clamp(2rem,4vw,5rem)", alignItems: "center" }}>
              {/* left: animated brand O */}
              <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <NoxO size={200} bg={C.bg} />
              </div>
              {/* right: label + short desc + prose */}
              <div>
                <div className="sd-section-label" style={{ marginBottom: "clamp(1rem,1.8vw,1.8rem)" }}>
                  <Label text="About this service" />
                </div>
                {service.shortDescription && (
                  <p className="sd-overview-text" style={{
                    fontFamily: SANS, fontSize: "clamp(1.2rem,1.8vw,2rem)",
                    lineHeight: 1.48, color: C.text,
                    letterSpacing: "-0.02em", maxWidth: "60ch", margin: 0,
                  }}>{service.shortDescription}</p>
                )}
                {service.description && (
                  <div
                    className="sd-prose"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                    style={{
                      fontFamily: SANS, fontSize: "clamp(0.88rem,1vw,1rem)",
                      lineHeight: 1.85, color: C.muted,
                      marginTop: service.shortDescription ? "clamp(1.5rem,2.5vw,2.5rem)" : 0,
                      paddingTop: service.shortDescription ? "clamp(1.5rem,2.5vw,2.5rem)" : 0,
                      borderTop: service.shortDescription ? `1px solid ${C.border}` : "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ TECH CAROUSEL ═════════════════════════════════════════════════ */}
      {service.techStackItems && service.techStackItems.length > 0 && (
        <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {/* editorial split header — matches other sections */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            padding: `clamp(2rem,3.5vw,4rem) ${P}`,
            gap: "2rem",
          }}>
            <h2 className="sd-tech-label" style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(3rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: C.text, margin: 0,
            }}>Tools & Tech.</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: "0.4em", flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              <span style={{
                fontFamily: SANS, fontSize: "0.62rem", letterSpacing: "0.22em",
                textTransform: "uppercase", color: C.faint,
              }}>{service.techStackItems.length} tools in stack</span>
            </div>
          </div>
          {/* carousel — full width, no inner wrapper */}
          <TechCarousel items={service.techStackItems} />
        </section>
      )}

      {/* ══ DELIVERABLES ══════════════════════════════════════════════════ */}
      {deliverables.length > 0 && (
        <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {/* header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto",
            alignItems: "flex-end", gap: "2rem",
            borderBottom: `1px solid ${C.border}`,
            padding: `clamp(2.5rem,4vw,4.5rem) ${P}`,
          }}>
            <div>
              <div className="sd-del-header-title" style={{ marginBottom: "clamp(0.6rem,1vw,1rem)" }}>
                <Label text="Deliverables" />
              </div>
              <h2 style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(3.5rem,8vw,10rem)", lineHeight: 0.88, letterSpacing: "-0.035em",
                color: C.text, margin: 0,
              }}>What you <em style={{ color: C.accent }}>get.</em></h2>
            </div>
            <span className="sd-del-header-sub" style={{
              fontFamily: SANS, fontSize: "0.52rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: C.faint, paddingBottom: "0.6em",
            }}>{deliverables.length} items</span>
          </div>

          {/* rows — edge to edge, max-width container */}
          <div style={{ maxWidth: MAX, margin: "0 auto" }}>
            {deliverables.map((d, i) => (
              <DeliverableRow key={i} d={d} index={i} total={deliverables.length} />
            ))}
          </div>

          {/* "Is that what you need?" CTA */}
          <div style={{
            borderTop: `1px solid ${C.border}`,
            padding: `clamp(2rem,3.5vw,3.5rem) ${P}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "2rem", flexWrap: "wrap",
          }}>
            <p style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(1.4rem,2.5vw,2.8rem)", lineHeight: 1, letterSpacing: "-0.025em",
              color: C.muted, margin: 0,
            }}>
              Is that what you need?
            </p>
            <Link
              href={`/${locale}/focused/contact`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: C.accent, color: "#000",
                fontFamily: SANS, fontWeight: 700, fontSize: "0.72rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none",
                padding: "clamp(0.85rem,1.2vw,1.1rem) clamp(1.6rem,2.5vw,2.4rem)",
                transition: "background 200ms",
                flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = TK.greenHot)}
              onMouseLeave={e => (e.currentTarget.style.background = TK.green)}
            >
              Let&apos;s talk →
            </Link>
          </div>
        </section>
      )}

      {/* ══ PROCESS — one viewport ════════════════════════════════════════ */}
      {processSteps.length > 0 && (
        <section style={{
          position: "relative", overflow: "hidden",
          background: C.panelSoft, borderBottom: `1px solid ${C.border}`,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
        }}>
          {/* snakes */}
          <PxTri  style={{ left: "6%",  top: "18%",  opacity: 1 }} />
          <PxTriR style={{ right: "8%", top: "12%",  opacity: 1 }} />
          <PxPair style={{ left: "42%", bottom: "14%", opacity: 1 }} />
          <PxTriR style={{ left: "22%", bottom: "20%", opacity: 1 }} />
          <PxTri  style={{ right: "18%", bottom: "22%", opacity: 1 }} />
          <PxPair style={{ right: "35%", top: "28%",   opacity: 1 }} />

          {/* grid bg */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)`,
            backgroundSize: "48px 48px",
          }} />

          <div style={{ maxWidth: MAX, margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", padding: `clamp(3rem,5vw,5rem) ${P}`, position: "relative", zIndex: 1 }}>
            {/* header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem,3vw,4rem)",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "clamp(1.5rem,2.5vw,2.5rem)",
              marginBottom: "clamp(1.5rem,2.5vw,2.5rem)",
            }}>
              <h2 className="sd-process-title" style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(2.8rem,5.5vw,7rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
                color: C.text, margin: 0,
              }}>The Process.</h2>
              <p className="sd-process-sub" style={{
                fontFamily: SANS, fontSize: "clamp(0.9rem,1.1vw,1.1rem)",
                lineHeight: 1.65, color: C.muted, margin: 0,
                alignSelf: "flex-end", maxWidth: "44ch",
              }}>
                A focused workflow designed to move from insight to execution without unnecessary complexity.
              </p>
            </div>

            {/* steps — horizontal grid filling remaining height */}
            <div style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(processSteps.length, 5)}, 1fr)`,
              gap: 0,
            }}>
              {processSteps.slice(0, 5).map((step, i) => (
                <div key={i} className="sd-step" style={{
                  borderRight: i < Math.min(processSteps.length, 5) - 1 ? `1px solid ${C.border}` : "none",
                  padding: "clamp(1.8rem,2.8vw,3rem) clamp(1.5rem,2.2vw,2.2rem)",
                  display: "flex", flexDirection: "column", gap: "clamp(1rem,1.5vw,1.5rem)",
                  position: "relative",
                }}>
                  <span className="sd-step-num" style={{
                    fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                    fontSize: "clamp(4rem,8vw,10rem)", lineHeight: 1, letterSpacing: "-0.04em",
                    color: C.accent,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  {i < Math.min(processSteps.length, 5) - 1 && (
                    <span aria-hidden style={{
                      position: "absolute", right: -4, top: "clamp(2.8rem,5vw,6rem)",
                      width: 7, height: 7, borderRadius: "50%",
                      background: C.accent, transform: "translateY(-50%)",
                    }} />
                  )}
                  <h3 style={{
                    fontFamily: SANS, fontWeight: 700,
                    fontSize: "clamp(1rem,1.4vw,1.4rem)",
                    color: C.text, margin: 0,
                    letterSpacing: "-0.015em", lineHeight: 1.25,
                  }}>{step.title}</h3>
                  {step.description && (
                    <p style={{
                      fontFamily: SANS, fontSize: "clamp(0.8rem,0.95vw,0.95rem)",
                      lineHeight: 1.75, color: C.muted, margin: 0,
                    }}>{step.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ KEY BENEFITS ══════════════════════════════════════════════════ */}
      {benefits.length > 0 && (
        <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: MAX, margin: "0 auto", padding: `clamp(4rem,7vw,8rem) ${P}` }}>
            <div style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "clamp(1.8rem,3vw,3rem)",
              marginBottom: "clamp(2.5rem,4vw,4rem)",
              gap: "2rem",
            }}>
              <div>
                <div style={{ marginBottom: "clamp(0.6rem,1vw,1rem)" }}>
                  <Label text="Key Benefits" />
                </div>
                <h2 style={{
                  fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                  fontSize: "clamp(3rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
                  color: C.text, margin: 0,
                }}>Why it <em style={{ color: C.accent }}>works.</em></h2>
              </div>
              <span style={{
                fontFamily: SANS, fontSize: "0.52rem", letterSpacing: "0.25em",
                textTransform: "uppercase", color: C.faint, paddingBottom: "0.6em",
                flexShrink: 0,
              }}>{benefits.length} benefits</span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,28vw,360px), 1fr))",
              gap: "clamp(0.8rem,1.5vw,1.5rem)",
            }}>
              {benefits.map((b, i) => (
                <div key={i} className="sd-benefit" style={{
                  position: "relative",
                  padding: "clamp(1.6rem,2.5vw,2.5rem)",
                  border: `1px solid ${C.border}`,
                  background: C.panel,
                  overflow: "hidden",
                  transition: "border-color 220ms, background 220ms",
                }}>
                  <span style={{
                    display: "block", marginBottom: "clamp(1rem,1.5vw,1.5rem)",
                    fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.24em",
                    color: C.accent,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="sd-benefit-text" style={{
                    fontFamily: SANS, fontSize: "clamp(0.9rem,1.05vw,1.05rem)",
                    lineHeight: 1.65, color: C.muted, margin: 0,
                    transition: "opacity 220ms",
                  }}>{b}</p>
                  <div aria-hidden style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 28, height: 28,
                    background: `rgba(${C.accentRgb},0.12)`,
                    borderTop: `1px solid rgba(${C.accentRgb},0.25)`,
                    borderLeft: `1px solid rgba(${C.accentRgb},0.25)`,
                  }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
      {faqItems.length > 0 && (
        <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: MAX, margin: "0 auto", padding: `clamp(4rem,7vw,8rem) ${P}` }}>
            {/* split header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem,3vw,4rem)",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "clamp(2rem,3.5vw,4rem)",
              marginBottom: "clamp(2rem,3.5vw,4rem)",
            }}>
              <h2 className="sd-faq-title" style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(3rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
                color: C.text, margin: 0,
              }}>Questions.</h2>
              <p className="sd-faq-sub" style={{
                fontFamily: SANS, fontSize: "clamp(0.95rem,1.2vw,1.2rem)",
                lineHeight: 1.65, color: C.muted, margin: 0,
                alignSelf: "flex-end", maxWidth: "44ch",
              }}>
                Everything clients usually ask before starting this service.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {faqItems.map((item, i) => <FaqRow key={i} item={item} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        {/* grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.038) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        {/* green radial glow bottom-right */}
        <div aria-hidden style={{
          position: "absolute", bottom: "-5rem", right: "-5rem",
          width: "clamp(350px,45vw,600px)", height: "clamp(350px,45vw,600px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${C.accentRgb},0.14) 0%, transparent 65%)`,
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1, maxWidth: MAX, margin: "0 auto",
          padding: `clamp(5.5rem,11vw,13rem) ${P}`,
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          <span className="sd-cta-label"><Label text="Ready to start?" /></span>
          <h2 className="sd-cta-title" style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(3rem,8.5vw,11rem)", lineHeight: 0.87,
            color: C.text, letterSpacing: "-0.03em",
            margin: "clamp(1.5rem,2.5vw,2.5rem) 0 clamp(1.2rem,2vw,2rem)",
            maxWidth: "18ch",
          }}>{ctaHeadline}</h2>
          {ctaSubtext && (
            <p className="sd-cta-sub" style={{
              fontFamily: SANS, fontSize: "clamp(0.95rem,1.2vw,1.2rem)",
              lineHeight: 1.65, color: C.muted,
              margin: "0 0 clamp(2.5rem,4vw,4.5rem)", maxWidth: "52ch",
            }}>{ctaSubtext}</p>
          )}
          <Link
            href={ctaLink}
            className="sd-cta-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "clamp(1rem,1.4vw,1.4rem) clamp(2.4rem,3.5vw,3.5rem)",
              background: C.accent, color: "#000",
              fontFamily: SANS, fontWeight: 700,
              fontSize: "clamp(0.76rem,0.9vw,0.9rem)", letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none", borderRadius: 999,
              transition: "background 180ms, transform 200ms",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = C.accentHot; el.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = C.accent; el.style.transform = "none"; }}
          >
            {ctaLabel}
            <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h8M6 2l4 4-4 4"/>
            </svg>
          </Link>
        </div>
      </section>

      <NoxFooter />

      <style>{`
        .sd-prose p { margin: 0 0 1em; }
        .sd-prose p:last-child { margin-bottom: 0; }
        .sd-prose strong { color: ${C.text}; font-weight: 700; }
        .sd-prose ul { margin: 0 0 1em 1.2em; padding: 0; }
        .sd-prose li { margin-bottom: 0.35em; }
        .sd-del-desc p { margin: 0 0 0.6em; }
        .sd-del-desc p:last-child { margin-bottom: 0; }
        .sd-faq-answer p { margin: 0 0 0.7em; font-family: ${SANS}; font-size: clamp(0.82rem,0.96vw,0.96rem); line-height: 1.72; color: ${C.muted}; }
        .sd-faq-answer p:last-child { margin-bottom: 0; }
        .sd-benefit:hover { border-color: rgba(${C.accentRgb},0.4) !important; background: rgba(${C.accentRgb},0.04) !important; }
        .sd-benefit:hover .sd-benefit-text { opacity: 1 !important; }
        .sd-faq-item:hover { border-color: rgba(${C.accentRgb},0.4) !important; }
        .sd-tech-pill:hover { border-color: ${C.accent} !important; background: ${C.accent} !important; }
        .sd-tech-pill:hover .sd-tech-name { color: #000 !important; }
        .sd-tech-pill:hover .sd-tech-abbr { color: #000 !important; }
        .sd-tech-pill:hover .sd-tech-icon { filter: brightness(0) !important; }
      `}</style>
    </div>
  );
}
