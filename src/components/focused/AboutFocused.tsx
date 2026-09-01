"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxCTABar, ClientCarousel, TK, SANS, DISPLAY } from "./NoxShared";
import type { PublicClient } from "@/lib/public-content";
import { TEAM_CARDS, type TeamCardData } from "@/components/about/teamCards";

gsap.registerPlugin(ScrollTrigger);

/* ── tokens ──────────────────────────────────────────────────────────────── */
const C = {
  bg:          TK.ink,
  panel:       TK.panel,
  panelSoft:   TK.panel,
  border:      TK.border,
  text:        TK.paper,
  muted:       TK.textMuted,
  faint:       TK.textFaint,
  accent:      TK.green,
  accentRgb:   "70,174,34",
  accentHot:   TK.greenHot,
} as const;

const P   = "clamp(1.5rem,4vw,3.5rem)";
const MAX = "1400px";

/* ── types ──────────────────────────────────────────────────────────────── */
export type FocusedTeamMember = {
  name: string; role: string;
  photo?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
};

/* ── content ─────────────────────────────────────────────────────────────── */
const STATS = [
  { n: "14+", label: "projects shipped" },
  { n: "6",   label: "countries served" },
  { n: "3yr", label: "since '22" },
  { n: "100%", label: "on-time delivery" },
];

const STORY = [
  "2022 / Founded - Born out of frustration with forgettable work. We set out to build a studio with an unreasonably high bar - and actually keep it.",
  "2023 / First wins - First client tripled their conversion rate in month one. First mobile app featured by Apple week one. The bar was set early.",
  "2024 / 10 projects live - Ten live projects across three countries. E-commerce, custom CRMs, full-stack platforms. No templates. No shortcuts. Ever.",
  "2025 / 6 countries - Shipping across six countries, 14+ clients, AI-powered search. Still small on purpose - every project gets the A-team.",
];

const PROCESS = [
  { n: "01", title: "Intake",     body: "We understand your goals, audience, timeline, and what success needs to look like." },
  { n: "02", title: "Discovery",  body: "We audit your market, competitors, current brand, and digital experience." },
  { n: "03", title: "Strategy",   body: "We define the direction, messaging, structure, and creative approach." },
  { n: "04", title: "Build",      body: "We design and develop the system with precision, speed, and polish." },
  { n: "05", title: "Launch",     body: "We refine, test, ship, and make sure everything is ready to perform." },
];

/* ── small label ─────────────────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return (
    <span style={{ fontFamily: SANS, fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>
      {text}
    </span>
  );
}

/* ── process card ────────────────────────────────────────────────────────── */
function ProcessCard({ step, C }: { step: (typeof PROCESS)[0]; index: number; C: { panel: string; panelSoft: string; border: string; text: string; muted: string; accent: string } }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="ab-process-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: "clamp(1.8rem,3vw,3rem) clamp(1.2rem,1.8vw,2rem)",
        display: "flex", flexDirection: "column",
        gap: "clamp(1rem,1.8vw,1.8rem)",
        background: hov ? C.panelSoft : C.panel,
        transition: "background 220ms ease",
        minHeight: "clamp(240px,28vw,320px)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* green top border that grows in on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: C.accent,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
      }} />
      <span style={{
        fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.24em",
        color: hov ? C.accent : C.accent,
        opacity: hov ? 1 : 0.6,
        transition: "opacity 220ms",
      }}>{step.n}</span>
      <h3 style={{
        fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
        fontSize: "clamp(1.6rem,3vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.02em",
        color: hov ? C.accent : C.text,
        margin: 0, flex: 1,
        transition: "color 250ms ease",
      }}>{step.title}</h3>
      <p style={{ fontFamily: SANS, fontSize: "clamp(0.78rem,0.9vw,0.9rem)", lineHeight: 1.65, color: C.muted, margin: 0 }}>{step.body}</p>
    </div>
  );
}

/* ── team carousel ───────────────────────────────────────────────────────── */
function logicalIndex(position: number, count: number) {
  return ((position % count) + count) % count;
}

function TeamCard({ card, active }: { card: TeamCardData; active: boolean }) {
  const isFounder = card.type === "founder";
  const title = isFounder ? card.name : card.role;
  const role = isFounder ? card.role : "Open position";
  const body = isFounder ? card.bio : card.note;

  return (
    <article
      className="ab-team-card"
      data-active={active}
      style={{
        margin: 0,
        position: "relative",
        width: "clamp(270px,32vw,430px)",
        height: "clamp(520px,58vw,640px)",
        overflow: "hidden",
        border: `1px solid ${active ? `rgba(${C.accentRgb},0.8)` : C.border}`,
        background: C.panel,
        boxShadow: active
          ? `0 0 0 1px rgba(${C.accentRgb},0.28), 0 34px 90px rgba(0,0,0,0.55), 0 0 70px rgba(${C.accentRgb},0.16)`
          : "none",
        transition: "border-color 520ms ease, box-shadow 520ms ease",
      }}
    >
      {/* media fills the card */}
      <div style={{ position: "absolute", inset: 0, background: "#070707" }}>
        {isFounder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt={`${card.name} - ${card.role}`} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", filter: active ? "grayscale(0.06) brightness(0.92) contrast(1.04)" : "grayscale(1) brightness(0.5)", transform: active ? "scale(1.06)" : "scale(1.02)", transition: "filter 520ms ease, transform 520ms ease" }} />
        ) : (
          <div style={{ height: "100%", display: "grid", placeItems: "center", background: `radial-gradient(ellipse 70% 55% at 50% 36%, rgba(${C.accentRgb},0.12), transparent 64%), #060807` }}>
            <span style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(6rem,11vw,10rem)", color: active ? `rgba(${C.accentRgb},0.55)` : `rgba(${C.accentRgb},0.18)`, transition: "color 520ms ease" }}>?</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(7,7,7,0.12) 0%, rgba(7,7,7,0) 28%, rgba(7,7,7,0.72) 60%, rgba(7,7,7,0.97) 100%)" }} />
      </div>

      {/* HUD top row */}
      <span style={{ position: "absolute", top: 18, left: 18, zIndex: 2, fontFamily: SANS, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: active ? C.accent : C.faint, transition: "color 520ms ease" }}>{card.num} / {String(TEAM_CARDS.length).padStart(2, "0")}</span>
      <span style={{ position: "absolute", top: 18, right: 18, zIndex: 2, fontFamily: SANS, fontSize: "0.46rem", letterSpacing: "0.22em", textTransform: "uppercase", color: active ? C.accent : C.faint, padding: "0.26rem 0.6rem", border: `1px solid ${active ? `rgba(${C.accentRgb},0.6)` : C.border}`, borderRadius: 999, background: active ? `rgba(${C.accentRgb},0.12)` : "transparent", transition: "color 520ms ease, border-color 520ms ease, background 520ms ease" }}>{isFounder ? "Founder" : "We're hiring"}</span>

      {/* info overlaid at the bottom */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2, padding: "clamp(1.2rem,2vw,1.8rem)", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.56rem", letterSpacing: "0.24em", textTransform: "uppercase", color: active ? C.accent : `rgba(${C.accentRgb},0.5)`, transition: "color 520ms ease" }}>{role}</p>
        <h3 style={{ margin: 0, fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.9rem,3.2vw,3rem)", lineHeight: 0.98, color: active ? C.text : "rgba(240,236,227,0.6)", transition: "color 520ms ease" }}>{title}</h3>

        <div className="ab-team-detail">
          <div>
            <p style={{ margin: "0.8rem 0 0", color: C.muted, fontFamily: SANS, fontSize: "0.9rem", lineHeight: 1.65 }}>{body}</p>
            {isFounder && (
              <div style={{ display: "flex", gap: "1.4rem", marginTop: "1.1rem" }}>
                {card.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong style={{ display: "block", fontFamily: DISPLAY, fontStyle: "italic", fontSize: "1.8rem", color: C.text, lineHeight: 1 }}>{stat.value}</strong>
                    <span style={{ fontFamily: SANS, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.faint }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1.1rem" }}>
              {card.tags.map((tag) => (
                <span key={tag} style={{ border: `1px solid rgba(${C.accentRgb},0.35)`, color: C.accent, fontFamily: SANS, fontSize: "0.48rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.32rem 0.55rem" }}>{tag}</span>
              ))}
            </div>
            {isFounder ? (
              <p style={{ margin: "1.1rem 0 0", fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.24em", textTransform: "uppercase", color: C.faint }}>{card.location}</p>
            ) : (
              <a href="mailto:hello@dontforget.studio" onClick={(e) => e.stopPropagation()} style={{ display: "inline-block", marginTop: "1.1rem", color: C.accent, fontFamily: SANS, fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none" }}>Apply for this seat →</a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function TeamCarousel() {
  const count = TEAM_CARDS.length;
  const [position, setPosition] = useState(count);
  const [transitioning, setTransitioning] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(360);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(count);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragRef = useRef<{ active: boolean; startX: number; moved: boolean }>({ active: false, startX: 0, moved: false });
  const active = logicalIndex(position, count);

  const goToPosition = useCallback((next: number) => {
    setTransitioning(true);
    positionRef.current = next;
    setPosition(next);
    if (next < count || next >= count * 2) {
      window.setTimeout(() => {
        const normalized = count + logicalIndex(next, count);
        setTransitioning(false);
        positionRef.current = normalized;
        setPosition(normalized);
        window.requestAnimationFrame(() => setTransitioning(true));
      }, 560);
    }
  }, [count]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current && !dragRef.current.active) goToPosition(positionRef.current + 1);
    }, 3200);
    return () => window.clearInterval(id);
  }, [goToPosition]);

  useEffect(() => {
    const measure = () => {
      setCardWidth(cardRef.current?.offsetWidth ?? 360);
      setViewportWidth(viewportRef.current?.offsetWidth ?? 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function goToCard(nextActive: number) {
    let delta = nextActive - logicalIndex(positionRef.current, count);
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    goToPosition(positionRef.current + delta);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pausedRef.current = true;
    setDragging(true);
    dragRef.current = { active: true, startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) dragRef.current.moved = true;
    if (trackRef.current) trackRef.current.style.setProperty("--drag-x", `${dx}px`);
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setDragging(false);
    if (trackRef.current) trackRef.current.style.setProperty("--drag-x", "0px");
    if (Math.abs(dx) > 55) goToPosition(positionRef.current + (dx < 0 ? 1 : -1));
    pausedRef.current = hoveredRef.current;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grab";
  }

  const loopedCards = [0, 1, 2].flatMap((rep) => TEAM_CARDS.map((card, index) => ({ card, rep, index })));
  const gap = 28;
  const offset = position * (cardWidth + gap) - (viewportWidth - cardWidth) / 2;

  return (
    <div
      onMouseEnter={() => { hoveredRef.current = true; pausedRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; pausedRef.current = false; }}
    >
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        style={{ overflow: "hidden", cursor: "grab", touchAction: "pan-y", userSelect: "none" }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap,
            padding: `0 0 clamp(1rem,2vw,2rem)`,
            transform: `translate3d(calc(${-offset}px + var(--drag-x, 0px)),0,0)`,
            transition: transitioning && !dragging ? "transform 560ms cubic-bezier(0.22,1,0.36,1)" : "none",
            willChange: "transform",
          }}
        >
          {loopedCards.map(({ card, rep, index }) => {
            const cardPosition = rep * count + index;
            const d = cardPosition - position;
            const ad = Math.abs(d);
            const dir = Math.sign(d);
            const rotateY = dir * Math.min(ad, 2) * 16;
            const z = -Math.min(ad, 3) * 88;
            const scale = ad === 0 ? 1 : Math.max(0.82, 1 - ad * 0.11);
            const opacity = ad === 0 ? 1 : Math.max(0.3, 1 - ad * 0.4);
            return (
              <div
                key={`${rep}-${card.num}`}
                ref={cardPosition === 0 ? cardRef : undefined}
                style={{
                  flexShrink: 0,
                  cursor: "pointer",
                  willChange: "transform, opacity",
                  transform: `perspective(1400px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  transition: transitioning && !dragging
                    ? "transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 600ms ease"
                    : "none",
                }}
                onClick={() => { if (!dragRef.current.moved) goToPosition(cardPosition); }}
              >
                <TeamCard card={card} active={cardPosition === position} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", maxWidth: MAX, margin: "0 auto", padding: `1.6rem ${P} 0` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {TEAM_CARDS.map((card, index) => (
            <button
              key={card.num}
              type="button"
              aria-label={`Go to team card ${index + 1}`}
              onClick={() => goToCard(index)}
              style={{
                width: index === active ? 34 : 8,
                height: 8,
                border: 0,
                borderRadius: 999,
                background: index === active ? C.accent : C.border,
                transition: "width 260ms ease, background 260ms ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" aria-label="Previous" onClick={() => goToPosition(positionRef.current - 1)} style={arrowStyle(C, false)}>←</button>
          <button type="button" aria-label="Next" onClick={() => goToPosition(positionRef.current + 1)} style={arrowStyle(C, true)}>→</button>
        </div>
      </div>
      <style>{`
        .ab-team-detail { display: grid; grid-template-rows: 0fr; opacity: 0;
          transition: grid-template-rows .55s cubic-bezier(.22,1,.36,1), opacity .45s ease; }
        .ab-team-detail > div { overflow: hidden; min-height: 0; }
        .ab-team-card[data-active="true"] .ab-team-detail { grid-template-rows: 1fr; opacity: 1; }
      `}</style>
    </div>
  );
}

function arrowStyle(C: { accent: string; accentRgb: string; text: string; border: string }, primary: boolean): React.CSSProperties {
  return {
    width: 48, height: 48, borderRadius: "50%",
    display: "grid", placeItems: "center", fontSize: "1rem", cursor: "pointer",
    color: primary ? C.accent : C.text,
    border: `1px solid ${primary ? `rgba(${C.accentRgb},0.5)` : "rgba(255,255,255,0.15)"}`,
    background: primary ? `rgba(${C.accentRgb},0.12)` : "rgba(255,255,255,0.04)",
    transition: "transform .3s ease, border-color .3s ease, background .3s ease",
  };
}

export default function AboutFocused({ clients = [] }: { team?: FocusedTeamMember[]; clients?: PublicClient[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* hero entrance */
      gsap.from(".ab-hero-eye",   { x: -18, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.05 });
      gsap.from(".ab-hero-title", { y: 55,  opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.15 });
      gsap.from(".ab-hero-lede",  { y: 22,  opacity: 0, duration: 0.75, ease: "power2.out", delay: 0.45 });

      /* hero title parallax — drifts upward as you scroll out */
      gsap.to(".ab-hero-title", {
        y: -80, ease: "none",
        scrollTrigger: { trigger: ".ab-hero-section", start: "top top", end: "bottom top", scrub: 1.2 },
      });
      gsap.timeline({
        scrollTrigger: {
          trigger: ".ab-hero-section",
          start: "top top",
          end: "70% top",
          scrub: 1.8,
        },
      })
        .to(".ab-hero-that", { color: C.text, duration: 0.7, ease: "power1.inOut" }, 0)
        .to(".ab-hero-remembered", { color: C.accent, duration: 0.9, ease: "power1.inOut" }, 0.08);
      gsap.set([".ab-hero-that", ".ab-hero-remembered"], {
        willChange: "color",
      });
      gsap.to(".ab-hero-lede", {
        y: -40, opacity: 0.3, ease: "none",
        scrollTrigger: { trigger: ".ab-hero-section", start: "20% top", end: "bottom top", scrub: 1.5 },
      });

      /* stats — counter-scale pop */
      gsap.utils.toArray<HTMLElement>(".ab-stat").forEach((el, i) => {
        gsap.from(el, { y: 32, opacity: 0, duration: 0.65, ease: "power3.out", delay: i * 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-stat-n").forEach((el) => {
        gsap.from(el, { scale: 0.72, opacity: 0, duration: 0.75, ease: "back.out(1.4)", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      /* section labels */
      gsap.utils.toArray<HTMLElement>(".ab-label").forEach((el) => {
        gsap.from(el, { x: -14, opacity: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      /* story — clip-path line reveal */
      gsap.utils.toArray<HTMLElement>(".ab-story-head").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-story-col").forEach((el, i) => {
        gsap.fromTo(el,
          { clipPath: "inset(0 0 100% 0)", y: 16 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.9, ease: "power3.out", delay: i * 0.14, scrollTrigger: { trigger: el, start: "top 86%", once: true } }
        );
      });
      /* green accent line that grows in */
      gsap.from(".ab-story-line", {
        scaleX: 0, transformOrigin: "left center",
        duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".ab-story-line", start: "top 88%", once: true },
      });

      /* mission / vision */
      gsap.utils.toArray<HTMLElement>(".ab-mv-col").forEach((el, i) => {
        gsap.from(el, { y: 30, opacity: 0, duration: 0.85, ease: "power3.out", delay: i * 0.12, scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });
      gsap.from(".ab-mission-bar", {
        scaleY: 0, transformOrigin: "top center",
        duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".ab-mission-bar", start: "top 85%", once: true },
      });

      /* process header + cards — slide in from alternating sides */
      gsap.utils.toArray<HTMLElement>(".ab-process-head").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-process-card").forEach((el, i) => {
        gsap.from(el, { x: i % 2 === 0 ? -24 : 24, opacity: 0, duration: 0.65, ease: "power2.out", delay: i * 0.07, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      /* team */
      gsap.utils.toArray<HTMLElement>(".ab-team-head").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-team-card").forEach((el, i) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.75, ease: "power3.out", delay: i * 0.1, scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: C.bg, color: C.text, fontFamily: SANS }}>

      {/* ── sticky navbar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.border}`, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <NoxNavbar active="about" />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="ab-hero-section" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        {/* grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(var(--nox-border-faint,rgba(255,255,255,0.034)) 1px,transparent 1px),linear-gradient(90deg,var(--nox-border-faint,rgba(255,255,255,0.034)) 1px,transparent 1px)`,
          backgroundSize: "56px 56px",
        }} />
        {/* glow top-right */}
        <div aria-hidden style={{
          position: "absolute", top: "-4rem", right: "-4rem",
          width: "clamp(300px,45vw,560px)", height: "clamp(300px,45vw,560px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${C.accentRgb},0.13) 0%, transparent 65%)`,
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        {/* bottom fade */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
          background: `linear-gradient(to bottom, transparent, ${C.bg})`, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: MAX, margin: "0 auto", padding: `clamp(5.5rem,10vw,11rem) ${P} clamp(5rem,9vw,10rem)` }}>
          <div className="ab-hero-eye" style={{ marginBottom: "clamp(2rem,3.5vw,3.5rem)" }}>
            <Label text="/ about us" />
          </div>

          <h1 className="ab-hero-title" style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(3.5rem,8vw,10rem)", lineHeight: 0.9,
            color: C.text, letterSpacing: "-0.03em",
            margin: "0 0 clamp(1.8rem,3vw,3rem)", maxWidth: "18ch",
          }}>
            we build{" "}
            <span className="ab-hero-that" style={{ color: C.muted, display: "inline-block" }}>things</span>{" "}
            <span className="ab-hero-remembered" style={{ color: C.muted, display: "inline-block" }}>unforgettable.</span>
          </h1>

          <p className="ab-hero-lede" style={{
            fontFamily: SANS, fontSize: "clamp(1.05rem,1.45vw,1.45rem)",
            lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: "52ch",
          }}>
            Got something worth remembering?
          </p>
        </div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.panel, position: "relative", overflow: "hidden" }}>
        {/* green glow */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "60%", height: "200%",
          background: `radial-gradient(ellipse, rgba(${C.accentRgb},0.06) 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          maxWidth: MAX, margin: "0 auto", position: "relative", zIndex: 1,
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="ab-stat" style={{
              padding: "clamp(1.8rem,3vw,3.5rem) clamp(1.5rem,3vw,3rem)",
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10,
            }}>
              <span className="ab-stat-n" style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(3rem,6.5vw,7.5rem)", lineHeight: 1, letterSpacing: "-0.03em",
                color: C.accent,
                display: "block",
              }}>{s.n}</span>
              <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.26em", textTransform: "uppercase", color: C.faint }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CLIENTS ════════════════════════════════════════════════════════ */}
      {/* ══ STORY ══════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: `clamp(4.5rem,8vw,9rem) ${P}` }}>
        <div style={{ maxWidth: MAX, margin: "0 auto" }}>
          {/* header */}
          <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "clamp(2rem,3.5vw,4rem)", marginBottom: "clamp(2.5rem,4vw,4.5rem)" }}>
            <div className="ab-label" style={{ marginBottom: "clamp(1.2rem,2vw,2rem)" }}>
              <Label text="/ our story" />
            </div>
            {/* green accent line */}
            <div className="ab-story-line" style={{
              height: 3, width: "clamp(60px,8vw,120px)",
              background: C.accent,
              marginBottom: "clamp(1.4rem,2.2vw,2.2rem)",
            }} />
            <h2 className="ab-story-head" style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.8rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: C.text, margin: 0, maxWidth: "20ch",
            }}>
              <span style={{ color: C.accent }}>built</span> for brands that refuse to blend in.
            </h2>
          </div>
          {/* 2-col paragraphs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,5rem)" }}>
            {STORY.map((p, i) => (
              <p key={i} className="ab-story-col" style={{
                fontFamily: SANS, fontSize: "clamp(1rem,1.35vw,1.35rem)",
                lineHeight: 1.72, color: C.muted, margin: 0,
              }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS ════════════════════════════════════════════════════════ */}
      {clients.length > 0 && (
        <section style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "1.2rem",
            padding: `clamp(1.4rem,2.2vw,2.2rem) ${P}`,
            borderBottom: `1px solid ${TK.borderFaint}`,
          }}>
            <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.faint, flexShrink: 0 }}>
              Trusted by founders &amp; growing teams
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <ClientCarousel clients={clients} />
        </section>
      )}

      {/* ══ TEAM ════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {/* header */}
        <div className="ab-team-head" style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
          borderBottom: `1px solid ${C.border}`,
          padding: `clamp(3rem,5.5vw,6rem) ${P}`,
        }}>
          <div>
            <div className="ab-label" style={{ marginBottom: "clamp(1.2rem,2vw,2rem)" }}>
              <Label text="/ team" />
            </div>
            <h2 style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.8rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: C.text, margin: 0,
            }}>small team,{" "}serious taste.</h2>
          </div>
          <p style={{
            fontFamily: SANS, fontSize: "clamp(0.92rem,1.1vw,1.12rem)",
            lineHeight: 1.68, color: C.muted, maxWidth: "38ch", margin: 0,
          }}>
            A focused studio model built around senior thinking, lean execution, and carefully chosen collaborators.
          </p>
        </div>

        {/* carousel */}
        <div style={{ padding: `clamp(2.5rem,4vw,5rem) 0` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${P}`, marginBottom: "clamp(1.5rem,2.5vw,2.5rem)" }}>
            <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.faint }}>
              ← drag to browse →
            </span>
          </div>
          <TeamCarousel />
        </div>
      </section>

      {/* ══ MISSION & VISION ═══════════════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.panelSoft }}>
        <div style={{
          maxWidth: MAX,
          display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,0.85fr)",
          border: `1px solid ${C.border}`, borderTop: "none", borderBottom: "none",
          margin: `0 auto`,
        }}>
          {/* mission */}
          <div className="ab-mv-col" style={{
            padding: `clamp(4rem,7vw,8rem) ${P}`,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: "clamp(1.8rem,2.8vw,2.8rem)",
            position: "relative",
          }}>
            {/* green left bar */}
            <div className="ab-mission-bar" style={{
              position: "absolute", left: 0, top: "clamp(3rem,5vw,5rem)", bottom: "clamp(3rem,5vw,5rem)",
              width: 3, background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
            }} />
            <div className="ab-label"><Label text="/ mission" /></div>
            <h2 style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.2rem,5vw,6rem)", lineHeight: 0.92, letterSpacing: "-0.03em",
              color: C.text, margin: 0, flex: 1,
            }}>
              build things people remember.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.92rem,1.1vw,1.12rem)", lineHeight: 1.72, color: C.muted, margin: 0 }}>
              We exist to create digital experiences that leave a mark - websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.
            </p>
          </div>

          {/* vision */}
          <div className="ab-mv-col" style={{
            padding: `clamp(4rem,7vw,8rem) ${P}`,
            display: "flex", flexDirection: "column", gap: "clamp(1.8rem,2.8vw,2.8rem)",
          }}>
            <div className="ab-label"><Label text="/ vision" /></div>
            <h3 style={{
              fontFamily: SANS, fontWeight: 700,
              fontSize: "clamp(1.5rem,3vw,3.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em",
              textTransform: "uppercase", color: C.text, margin: 0, flex: 1,
            }}>
              world-class craft for every brand.
            </h3>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.92rem,1.1vw,1.12rem)", lineHeight: 1.72, color: C.muted, margin: 0 }}>
              A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.
            </p>
          </div>
        </div>
      </section>

      {/* ══ HOW WE WORK ════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: `clamp(4.5rem,8vw,9rem) ${P}` }}>
        <div style={{ maxWidth: MAX, margin: "0 auto" }}>
          {/* split header */}
          <div className="ab-process-head" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem,3vw,4rem)",
            borderBottom: `1px solid ${C.border}`, paddingBottom: "clamp(2rem,3.5vw,4rem)", marginBottom: 0,
          }}>
            <div>
              <div className="ab-label" style={{ marginBottom: "clamp(1.2rem,2vw,2rem)" }}>
                <Label text="/ how we work" />
              </div>
              <h2 style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(2.8rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
                color: C.text, margin: 0,
              }}>simple process,{" "}sharp output.</h2>
            </div>
            <p style={{
              fontFamily: SANS, fontSize: "clamp(0.95rem,1.2vw,1.2rem)",
              lineHeight: 1.68, color: C.muted, margin: 0, alignSelf: "flex-end", maxWidth: "42ch",
            }}>
              No bloated workshops. No endless revision loops. Just a clear path from idea to launch.
            </p>
          </div>

          {/* 5-col process grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderLeft: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
            {PROCESS.map((step, i) => (
              <ProcessCard key={step.n} step={step} index={i} C={C} />
            ))}
          </div>
        </div>
      </section>

      <NoxCTABar label="let's create something people remember →" />

      <NoxFooter />

    </div>
  );
}
