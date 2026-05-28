"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxPageIntro, NoxCTABar, NoxClients, NoxMusts, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type FocusedTeamMember = {
  name: string;
  role: string;
  photo?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
};

const STATS = [
  { n: "14+", label: "projects shipped" },
  { n: "6",   label: "countries reached" },
  { n: "24h", label: "avg response time" },
  { n: "0",   label: "boring websites made" },
];

const DEFAULT_TEAM: FocusedTeamMember[] = [
  { name: "Tony Nakhla",  role: "Founder & Creative Director" },
  { name: "Rami Erbash",  role: "Design Lead" },
  { name: "Alex Khoury",  role: "Development Lead" },
];

const PROCESS = [
  { n: "01", title: "Intake",     body: "We ask the right questions and shape the brief before work starts." },
  { n: "02", title: "Discovery",  body: "We define the real job, audience, constraints, and strongest route." },
  { n: "03", title: "Strategy",   body: "We map the UX, structure, references, scope, trade-offs, and timing." },
  { n: "04", title: "Build",      body: "We make the system work, then refine it until it feels unforgettable." },
  { n: "05", title: "Launch",     body: "We test, ship, support, and keep the next improvements visible." },
];

// ── Mouse-driven team carousel ─────────────────────────────────────────────
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
      const track     = trackRef.current;
      const container = wrapRef.current;
      if (track && container) {
        const maxScroll = track.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          track.style.transform = `translateX(${-currentPct.current * maxScroll}px)`;
        }
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
    <section className="tk-team" style={{
      padding:      "clamp(4rem, 8vw, 9rem) 0",
      borderBottom: `1px solid ${TK.line}`,
    }}>
      {/* header row */}
      <div style={{
        display:        "flex",
        alignItems:     "baseline",
        justifyContent: "space-between",
        marginBottom:   "clamp(2.5rem, 4vw, 4rem)",
        padding:        "0 clamp(1.5rem, 4vw, 3.5rem)",
      }}>
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          margin:        0,
        }}>the team</h2>

        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.68rem, 0.88vw, 0.88rem)",
          letterSpacing: "0.1em",
          color:         TK.green,
          opacity:       0.45,
        }}>← move mouse to browse →</span>
      </div>

      {/* scrollable track */}
      <div ref={wrapRef} style={{ overflow: "hidden", cursor: "ew-resize" }}>
        <div
          ref={trackRef}
          style={{
            display:    "flex",
            gap:        "clamp(1rem, 2vw, 2rem)",
            padding:    "0 clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 2vw, 2rem)",
            willChange: "transform",
          }}
        >
          {members.map((m, i) => (
            <figure key={i} className="tk-team-card" style={{
              margin:     0,
              flexShrink: 0,
              width:      "clamp(220px, 36vw, 440px)",
            }}>
              {/* photo / placeholder */}
              <div style={{
                aspectRatio:    "3 / 4",
                background:     m.photo ? "transparent" : "rgba(70,174,34,0.06)",
                border:         `1px solid ${TK.line}`,
                marginBottom:   "clamp(0.9rem, 1.5vw, 1.4rem)",
                overflow:       "hidden",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                transition:     "border-color 280ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = TK.green)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = TK.line)}
              >
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={TK.line} strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                )}
              </div>

              <figcaption style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 2 }}>
                <strong style={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize:   "clamp(1rem, 1.4vw, 1.25rem)",
                  color:      TK.paper,
                }}>{m.name}</strong>
                <span style={{
                  fontFamily: SANS,
                  fontSize:   "clamp(0.78rem, 0.95vw, 0.95rem)",
                  color:      TK.green,
                  opacity:    0.6,
                }}>{m.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AboutFocused({ team }: { team?: FocusedTeamMember[] }) {
  const members = team && team.length > 0 ? team : DEFAULT_TEAM;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tk-stat", {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-stats", start: "top 80%" },
      });
      gsap.from(".tk-story-col", {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-story", start: "top 80%" },
      });
      gsap.from(".tk-mv-col", {
        y: 30, opacity: 0, stagger: 0.14, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-mission-vision", start: "top 80%" },
      });
      gsap.from(".tk-value-item", {
        x: -28, opacity: 0, stagger: 0.09, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".tk-values", start: "top 80%" },
      });
      gsap.from(".tk-team-card", {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-team", start: "top 78%" },
      });

      // Musts — sequential row reveal
      const mustRows = gsap.utils.toArray<HTMLElement>(".tk-must-row");
      gsap.set(mustRows, { opacity: 0, y: 36 });
      mustRows.forEach((row, i) => {
        gsap.to(row, {
          opacity: 1, y: 0,
          duration: 0.72, ease: "power3.out",
          scrollTrigger: {
            trigger: ".tk-musts",
            start:   `top+=${i * 380} top`,
            once:    true,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="about" />

      <NoxPageIntro
        eyebrow="/ about us"
        title="we make things"
        italic="get noticed."
        lede="NOX Studio is a small, mighty creative agency. We work with founders, marketers, and brand teams who want their next launch to actually land — visually, strategically, and culturally."
      />

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="tk-stats" style={{
        display:             "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop:           `1px solid ${TK.line}`,
        borderBottom:        `1px solid ${TK.line}`,
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="tk-stat" style={{
            padding:       "clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3vw, 3rem)",
            borderRight:   i < 3 ? `1px solid ${TK.line}` : "none",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            textAlign:     "center",
            gap:           8,
          }}>
            <span style={{
              fontFamily: DISPLAY,
              fontStyle:  "italic",
              fontWeight: 600,
              fontSize:   "clamp(3rem, 7vw, 7rem)",
              lineHeight: 1,
              color:      TK.paper,
            }}>{s.n}</span>
            <span style={{
              fontFamily: SANS,
              fontSize:   "clamp(0.8rem, 1vw, 1rem)",
              lineHeight: 1.4,
              color:      TK.green,
              opacity:    0.75,
            }}>{s.label}</span>
          </div>
        ))}
      </section>

      <NoxClients />

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className="tk-story" style={{
        padding:      "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderBottom: `1px solid ${TK.line}`,
      }}>
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(3rem, 5vw, 5rem)",
        }}>our story</h2>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "clamp(2rem, 5vw, 5rem)",
          maxWidth:            1000,
          margin:              "0 auto",
        }}>
          <p className="tk-story-col" style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.95rem, 1.4vw, 1.4rem)",
            lineHeight: 1.6,
            color:      TK.green,
            margin:     0,
          }}>
            NOX started as a conviction: great digital work shouldn&apos;t be reserved for massive budgets. We wanted to make things that{" "}
            <em style={{ fontFamily: DISPLAY, fontStyle: "italic", color: TK.paper }}>looked like they meant it</em>.
          </p>
          <p className="tk-story-col" style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.95rem, 1.4vw, 1.4rem)",
            lineHeight: 1.6,
            color:      TK.green,
            margin:     0,
          }}>
            We&apos;re a small studio run by makers — no account directors, no PowerPoint towers, no meetings that should&apos;ve been an email. Just designers, developers, and strategists talking directly to the people we work for.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision — unified split ──────────────────────────── */}
      <section className="tk-mission-vision" style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1px 1fr",
        borderBottom:        `1px solid ${TK.line}`,
      }}>
        {/* Mission */}
        <div className="tk-mv-col" style={{
          padding:       "clamp(3.5rem, 7vw, 8rem) clamp(1.5rem, 4vw, 3.5rem)",
          display:       "flex",
          flexDirection: "column",
          gap:           "clamp(1.5rem, 2.5vw, 2.5rem)",
        }}>
          <span style={{
            fontFamily:    SANS,
            fontSize:      "clamp(0.62rem, 0.82vw, 0.82rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         TK.green,
            opacity:       0.5,
          }}>/ mission</span>

          <h2 style={{
            fontFamily:    DISPLAY,
            fontStyle:     "italic",
            fontWeight:    700,
            fontSize:      "clamp(2rem, 4.5vw, 5.5rem)",
            lineHeight:    1.0,
            color:         TK.paper,
            letterSpacing: "-0.03em",
            margin:        0,
            flex:          1,
          }}>
            To make brands impossible to forget.
          </h2>

          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.9rem, 1.1vw, 1.15rem)",
            lineHeight: 1.65,
            color:      TK.green,
            margin:     0,
            opacity:    0.82,
          }}>
            Great creative work shouldn&apos;t require a massive budget. We give founders and brand teams the same caliber of work that used to cost ten times more — because for the people behind it, it always is a flagship.
          </p>
        </div>

        {/* Divider */}
        <div style={{ background: TK.line }} />

        {/* Vision */}
        <div className="tk-mv-col" style={{
          padding:       "clamp(3.5rem, 7vw, 8rem) clamp(1.5rem, 4vw, 3.5rem)",
          display:       "flex",
          flexDirection: "column",
          gap:           "clamp(1.5rem, 2.5vw, 2.5rem)",
        }}>
          <span style={{
            fontFamily:    SANS,
            fontSize:      "clamp(0.62rem, 0.82vw, 0.82rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         TK.green,
            opacity:       0.5,
          }}>/ vision</span>

          <h2 style={{
            fontFamily:    SANS,
            fontWeight:    700,
            fontSize:      "clamp(2rem, 4.5vw, 5.5rem)",
            lineHeight:    1,
            color:         TK.paper,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin:        0,
            flex:          1,
          }}>
            Small teams with conviction outshine anyone.
          </h2>

          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.9rem, 1.1vw, 1.15rem)",
            lineHeight: 1.65,
            color:      TK.green,
            margin:     0,
            opacity:    0.82,
          }}>
            We&apos;re building the studio we always wanted to hire — direct, opinionated, and fast. A place where the work speaks louder than the pitch deck, every single time.
          </p>
        </div>
      </section>

      {/* ── How we work (process) ─────────────────────────────────────── */}
      <section className="tk-values" style={{
        padding:      "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderBottom: `1px solid ${TK.line}`,
      }}>
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(3rem, 5vw, 5rem)",
        }}>how we work</h2>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          borderTop:           `1px solid ${TK.line}`,
          borderLeft:          `1px solid ${TK.line}`,
          maxWidth:            1200,
          margin:              "0 auto",
        }}>
          {PROCESS.map((p) => (
            <div key={p.n} className="tk-value-item" style={{
              borderRight:   `1px solid ${TK.line}`,
              borderBottom:  `1px solid ${TK.line}`,
              padding:       "clamp(1.8rem, 3vw, 3rem) clamp(1.2rem, 2vw, 2rem)",
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              textAlign:     "center",
              gap:           "clamp(1rem, 1.8vw, 1.8rem)",
            }}>
              <span style={{
                fontFamily:    SANS,
                fontSize:      "clamp(0.58rem, 0.72vw, 0.72rem)",
                letterSpacing: "0.22em",
                color:         TK.green,
                opacity:       0.5,
              }}>{p.n}</span>
              <h3 style={{
                fontFamily:  DISPLAY,
                fontStyle:   "italic",
                fontWeight:  700,
                fontSize:    "clamp(1.6rem, 3vw, 3.2rem)",
                lineHeight:  1,
                color:       TK.paper,
                margin:      0,
                flex:        1,
              }}>{p.title}</h3>
              <p style={{
                fontFamily: SANS,
                fontSize:   "clamp(0.78rem, 0.95vw, 0.95rem)",
                lineHeight: 1.6,
                color:      TK.green,
                margin:     0,
              }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tall wrapper gives the sticky NoxMusts section scroll depth */}
      <div style={{ position: "relative", height: "calc(100vh + 1600px)" }}>
        <NoxMusts />
      </div>

      {/* ── Team carousel ─────────────────────────────────────────────── */}
      <TeamCarousel members={members} />

      <NoxCTABar label="Let's create together →" />
      <NoxFooter />
    </div>
  );
}
