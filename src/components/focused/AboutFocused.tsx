"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxCTABar, NoxMusts, ClientCarousel, TK, SANS, DISPLAY } from "./NoxShared";
import type { PublicClient } from "@/lib/public-content";

gsap.registerPlugin(ScrollTrigger);

/* ── tokens ──────────────────────────────────────────────────────────────── */
const C = {
  bg:          TK.ink,
  panel:       "#0a0e0c",
  panelSoft:   "#0e1410",
  border:      "rgba(255,255,255,0.09)",
  text:        TK.paper,
  muted:       "rgba(255,255,255,0.55)",
  faint:       "rgba(255,255,255,0.32)",
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

/* ── team carousel ───────────────────────────────────────────────────────── */
function TeamCarousel({ members }: { members: FocusedTeamMember[] }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const targetPct  = useRef(0);
  const currentPct = useRef(0);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      targetPct.current = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    };
    const onLeave = () => { targetPct.current = 0; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    const tick = () => {
      currentPct.current += (targetPct.current - currentPct.current) * 0.07;
      const track = trackRef.current, container = wrapRef.current;
      if (track && container) {
        const max = track.scrollWidth - container.clientWidth;
        if (max > 0) track.style.transform = `translateX(${-currentPct.current * max}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ overflow: "hidden", cursor: "ew-resize" }}>
      <div ref={trackRef} style={{ display: "flex", gap: "clamp(1rem,2vw,2rem)", padding: `0 ${P} clamp(1rem,2vw,2rem)`, willChange: "transform" }}>
        {members.map((m, i) => (
          <figure key={i} className="ab-team-card" style={{ margin: 0, flexShrink: 0, width: "clamp(240px,34vw,420px)" }}>
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
      /* hero */
      gsap.from(".ab-hero-eye",   { x: -18, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.05 });
      gsap.from(".ab-hero-title", { y: 55,  opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.15 });
      gsap.from(".ab-hero-lede",  { y: 22,  opacity: 0, duration: 0.75, ease: "power2.out", delay: 0.45 });

      /* stats */
      gsap.utils.toArray<HTMLElement>(".ab-stat").forEach((el, i) => {
        gsap.from(el, { y: 32, opacity: 0, duration: 0.65, ease: "power3.out", delay: i * 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });

      /* section labels */
      gsap.utils.toArray<HTMLElement>(".ab-label").forEach((el) => {
        gsap.from(el, { x: -14, opacity: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      /* story */
      gsap.utils.toArray<HTMLElement>(".ab-story-head").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-story-col").forEach((el, i) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.75, ease: "power2.out", delay: i * 0.1, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });

      /* mission / vision */
      gsap.utils.toArray<HTMLElement>(".ab-mv-col").forEach((el, i) => {
        gsap.from(el, { y: 30, opacity: 0, duration: 0.85, ease: "power3.out", delay: i * 0.12, scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });

      /* process header + cards */
      gsap.utils.toArray<HTMLElement>(".ab-process-head").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-process-card").forEach((el, i) => {
        gsap.from(el, { y: 28, opacity: 0, duration: 0.6, ease: "power2.out", delay: i * 0.06, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
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
      <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        {/* grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.034) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.034) 1px,transparent 1px)`,
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
            <span style={{ color: C.muted }}>that get remembered.</span>
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
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <div style={{
          maxWidth: MAX, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="ab-stat" style={{
              padding: "clamp(1.8rem,3vw,3.5rem) clamp(1.5rem,3vw,3rem)",
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10,
            }}>
              <span style={{
                fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(3rem,6.5vw,7.5rem)", lineHeight: 1, letterSpacing: "-0.03em", color: C.text,
              }}>{s.n}</span>
              <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.26em", textTransform: "uppercase", color: C.faint }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CLIENTS ════════════════════════════════════════════════════════ */}
      {clients.length > 0 && (
        <section style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "1.2rem",
            padding: `clamp(1.4rem,2.2vw,2.2rem) ${P}`,
            borderBottom: `1px solid rgba(255,255,255,0.05)`,
          }}>
            <span style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.faint, flexShrink: 0 }}>
              Trusted by founders &amp; growing teams
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <ClientCarousel clients={clients} />
        </section>
      )}

      {/* ══ STORY ══════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: `clamp(4.5rem,8vw,9rem) ${P}` }}>
        <div style={{ maxWidth: MAX, margin: "0 auto" }}>
          {/* header */}
          <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "clamp(2rem,3.5vw,4rem)", marginBottom: "clamp(2.5rem,4vw,4.5rem)" }}>
            <div className="ab-label" style={{ marginBottom: "clamp(1.2rem,2vw,2rem)" }}>
              <Label text="/ our story" />
            </div>
            <h2 className="ab-story-head" style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.8rem,6.5vw,8rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: C.text, margin: 0, maxWidth: "20ch",
            }}>
              built for brands that refuse to blend in.
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

      {/* ══ MISSION & VISION ═══════════════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.panelSoft }}>
        <div style={{
          maxWidth: MAX, margin: "0 auto",
          display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,0.85fr)",
          border: `1px solid ${C.border}`, borderTop: "none", borderBottom: "none",
          margin: `0 auto`,
        }}>
          {/* mission */}
          <div className="ab-mv-col" style={{
            padding: `clamp(4rem,7vw,8rem) ${P}`,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: "clamp(1.8rem,2.8vw,2.8rem)",
          }}>
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
              <div
                key={step.n}
                className="ab-process-card"
                style={{
                  borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
                  padding: "clamp(1.8rem,3vw,3rem) clamp(1.2rem,1.8vw,2rem)",
                  display: "flex", flexDirection: "column",
                  gap: "clamp(1rem,1.8vw,1.8rem)",
                  background: C.panel,
                  transition: "background 220ms ease",
                  minHeight: "clamp(240px,28vw,320px)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.panelSoft)}
                onMouseLeave={e => (e.currentTarget.style.background = C.panel)}
              >
                <span style={{ fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.24em", color: C.accent }}>{step.n}</span>
                <h3 style={{
                  fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
                  fontSize: "clamp(1.6rem,3vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.02em",
                  color: C.text, margin: 0, flex: 1,
                }}>{step.title}</h3>
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.78rem,0.9vw,0.9rem)", lineHeight: 1.65, color: C.muted, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOXMUSTS ═══════════════════════════════════════════════════════ */}
      <div style={{ position: "relative", height: "calc(100vh + 1600px)" }}>
        <NoxMusts />
      </div>

      {/* ══ TEAM ═══════════════════════════════════════════════════════════ */}
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
              ← move mouse to browse →
            </span>
          </div>
          <TeamCarousel members={members} />
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════ */}
      <NoxCTABar label="let's create something people remember →" />

      <NoxFooter />

    </div>
  );
}
