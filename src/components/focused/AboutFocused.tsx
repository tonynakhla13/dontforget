"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxCTABar, ClientCarousel, TK, SANS, DISPLAY } from "./NoxShared";
import type { PublicClient } from "@/lib/public-content";

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
  { n: "6",   label: "countries reached" },
  { n: "24h", label: "avg response time" },
  { n: "0",   label: "boring websites made" },
];

const STORY = [
  "We started Nox with a simple belief: good design should not disappear into the background. It should clarify, sharpen, and move people to act.",
  "Our work sits between strategy and execution. We help brands find their voice, shape their digital presence, and launch websites that feel as considered as the businesses behind them.",
];

const PROCESS = [
  { n: "01", title: "Intake",     body: "We understand your goals, audience, timeline, and what success needs to look like." },
  { n: "02", title: "Discovery",  body: "We audit your market, competitors, current brand, and digital experience." },
  { n: "03", title: "Strategy",   body: "We define the direction, messaging, structure, and creative approach." },
  { n: "04", title: "Build",      body: "We design and develop the system with precision, speed, and polish." },
  { n: "05", title: "Launch",     body: "We refine, test, ship, and make sure everything is ready to perform." },
];

const DEFAULT_TEAM: FocusedTeamMember[] = [
  { name: "Tony Nakhla",            role: "Founder / Creative Developer" },
  { name: "Nox Studio",             role: "Strategy, Design & Development" },
  { name: "Selected Collaborators", role: "Brand, Motion & Content" },
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
function TeamCarousel({ members }: { members: FocusedTeamMember[] }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const posRef     = useRef(0);
  const pausedRef  = useRef(false);
  const dragRef    = useRef({ active: false, startX: 0, startPos: 0, pointerId: -1 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const getCycle = () => {
      const paddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      return (track.scrollWidth - paddingLeft) / 3;
    };

    const normalize = (value: number) => {
      const cycle = getCycle();
      if (!cycle) return 0;
      return ((value % cycle) + cycle) % cycle;
    };

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current = normalize(posRef.current + 0.55);
        track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function moveTo(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const paddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
    const cycle = (track.scrollWidth - paddingLeft) / 3;
    if (!cycle) return;
    const next = dragRef.current.startPos - (clientX - dragRef.current.startX);
    posRef.current = ((next % cycle) + cycle) % cycle;
    track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current, pointerId: e.pointerId };
    pausedRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;
    moveTo(e.clientX);
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId === e.pointerId) {
      dragRef.current.active = false;
      dragRef.current.pointerId = -1;
    }
    pausedRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grab";
  }

  const loopedMembers = [0, 1, 2].flatMap((rep) => members.map((member) => ({ ...member, rep })));

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      style={{ overflow: "hidden", cursor: "grab", touchAction: "pan-y", userSelect: "none" }}
    >
      <div ref={trackRef} style={{ display: "flex", gap: "clamp(1rem,2vw,2rem)", padding: `0 ${P} clamp(1rem,2vw,2rem)`, willChange: "transform" }}>
        {loopedMembers.map((m, i) => (
          <figure key={`${m.rep}-${m.name}-${i}`} className="ab-team-card" style={{ margin: 0, flexShrink: 0, width: "clamp(240px,34vw,420px)" }}>
            {/* photo / placeholder */}
            <div
              className="ab-team-photo"
              style={{
                aspectRatio: "3/4",
                background: m.photo ? "transparent" : C.panel,
                border: `1px solid ${C.border}`,
                marginBottom: "clamp(1rem,1.6vw,1.6rem)",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 280ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `rgba(${C.accentRgb},0.5)`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <figcaption style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 2 }}>
              <strong style={{ fontFamily: SANS, fontWeight: 600, fontSize: "clamp(1.05rem,1.4vw,1.3rem)", color: C.text }}>{m.name}</strong>
              <span style={{ fontFamily: SANS, fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.faint }}>{m.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function AboutFocused({ team, clients = [] }: { team?: FocusedTeamMember[]; clients?: PublicClient[] }) {
  const members = team && team.length > 0 ? team : DEFAULT_TEAM;
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
            we build brands{" "}
            <span className="ab-hero-that" style={{ color: C.muted, display: "inline-block" }}>that get</span>{" "}
            <span className="ab-hero-remembered" style={{ color: C.muted, display: "inline-block" }}>remembered.</span>
          </h1>

          <p className="ab-hero-lede" style={{
            fontFamily: SANS, fontSize: "clamp(1.05rem,1.45vw,1.45rem)",
            lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: "52ch",
          }}>
            Nox is a digital studio crafting bold websites, sharp identities, and conversion-focused experiences for brands that want to move differently.
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
          <TeamCarousel members={members} />
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
              make every digital touchpoint feel intentional.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.92rem,1.1vw,1.12rem)", lineHeight: 1.72, color: C.muted, margin: 0 }}>
              We help ambitious brands turn ideas into clear identities, sharp websites, and memorable experiences that people understand instantly.
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
              digital work should feel less disposable.
            </h3>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.92rem,1.1vw,1.12rem)", lineHeight: 1.72, color: C.muted, margin: 0 }}>
              We want to build a studio known for work that lasts — visually, strategically, and commercially.
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
