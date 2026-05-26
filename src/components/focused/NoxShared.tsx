"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ── design tokens ──────────────────────────────────────────────────── */
export const TK = {
  ink:       "var(--nox-ink, #000000)",
  green:     "var(--nox-green, #46ae22)",
  greenHot:  "#46d12a",
  paper:     "var(--nox-paper, #ffffff)",
  chrome:    "var(--nox-chrome, rgb(38,37,37))",
  line:      "rgba(70,174,34,0.35)",
  lineFaint: "rgba(70,174,34,0.18)",
  muted:     "rgba(70,174,34,0.6)",
} as const;

export const SANS    = "'Syne', 'Inter', sans-serif";
export const DISPLAY = "'Syne', 'Inter', sans-serif";

/* ── arrow svg ─────────────────────────────────────────────────────── */
export function Arrow({ color = "#000", size = 11 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.727} viewBox="0 0 10.882 7.920" fill={color}>
      <path d="M10.407 3.96C10.407 4.215 10.2 4.422 9.946 4.422H.475C.221 4.422.013 4.215.013 3.96S.221 3.499.475 3.499H9.946c.254 0 .461.207.461.461ZM10.407 3.96c-.175.18-3.11 3.155-3.296 3.342-.139.14-.165.356-.033.502.166.183.44.186.609.007L10.703 4.79C11.06 4.43 11.06 3.49 10.703 3.13L7.687.11C7.518-.07 7.244-.067 7.078.116 6.946.262 6.972.477 7.111.618 7.297.805 10.232 3.779 10.407 3.96Z" />
    </svg>
  );
}

/* ── nav links ──────────────────────────────────────────────────────── */
const NAV = [
  { label: "home",     href: "/en/focused" },
  { label: "about",    href: "/en/focused/about" },
  { label: "services", href: "/en/focused/services" },
  { label: "our work", href: "/en/focused/work" },
  { label: "contact",  href: "/en/focused/contact" },
];

/* ── Theme toggle ────────────────────────────────────────────────────── */
function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const isLight = document.documentElement.dataset.noxTheme === "light";
    setLight(isLight);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.setAttribute("data-nox-theme", "light");
    else document.documentElement.removeAttribute("data-nox-theme");
    try { localStorage.setItem("nox-theme", next ? "light" : "dark"); } catch {}
  }

  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme"
      style={{
        width:      36, height: 36,
        background: "transparent",
        border:     `1px solid ${TK.line}`,
        color:      TK.green,
        cursor:     "pointer",
        display:    "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "border-color 180ms ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = TK.green)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = TK.line)}
    >
      {light ? (
        /* Moon */
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        /* Sun */
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )}
    </button>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────────── */
export function NoxNavbar({ active }: { active?: string }) {
  return (
    <header style={{
      position:       "relative",
      height:         "clamp(72px, 7vw, 96px)",
      background:     TK.ink,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      padding:        "0 clamp(1.5rem, 4vw, 3.5rem)",
      borderBottom:   `1px solid ${TK.lineFaint}`,
    }}>
      {/* Logo text */}
      <Link href="/en/focused" style={{
        display:    "flex",
        alignItems: "center",
        gap:        12,
        textDecoration: "none",
      }}>
        <span style={{
          fontFamily:    SANS,
          fontWeight:    800,
          fontSize:      "clamp(1rem, 1.4vw, 1.25rem)",
          letterSpacing: "-0.02em",
          color:         TK.paper,
        }}>NOX</span>
        <span style={{
          fontFamily:    SANS,
          fontWeight:    400,
          fontSize:      "clamp(0.55rem, 0.75vw, 0.7rem)",
          letterSpacing: "0.32em",
          color:         TK.green,
        }}>S T U D I O</span>
      </Link>

      {/* Center nav */}
      <nav style={{
        display:   "flex",
        gap:       "clamp(1.5rem, 3vw, 3rem)",
        position:  "absolute",
        left:      "50%",
        transform: "translateX(-50%)",
      }}>
        {NAV.map(({ label, href }) => {
          const isActive = active === label;
          return (
            <Link key={label} href={href} style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.78rem, 0.95vw, 0.95rem)",
              color:         isActive ? TK.greenHot : TK.green,
              textDecoration: "none",
              borderBottom:  isActive ? `1px solid ${TK.greenHot}` : "1px solid transparent",
              paddingBottom:  isActive ? 4 : 0,
              transition:    "color 180ms ease, border-color 180ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = TK.greenHot; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = TK.green; }}
            >{label}</Link>
          );
        })}
      </nav>

      {/* Right side: theme toggle + CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <ThemeToggle />
      {/* CTA */}
      <Link href="/en/focused/contact" style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "0 clamp(1rem, 1.5vw, 1.5rem)",
        height:         36,
        background:     TK.chrome,
        color:          TK.paper,
        fontSize:       "clamp(0.72rem, 0.88vw, 0.9rem)",
        fontFamily:     SANS,
        textDecoration: "none",
        transition:     "background 180ms ease",
        whiteSpace:     "nowrap",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#2f2f2f")}
      onMouseLeave={e => (e.currentTarget.style.background = TK.chrome)}
      >Contact us</Link>
      </div>
    </header>
  );
}

/* ── Page intro (inner pages) ────────────────────────────────────────── */
export function NoxPageIntro({
  eyebrow,
  title,
  italic,
  lede,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  lede?: string;
}) {
  return (
    <section style={{
      padding:    "clamp(5rem, 9vw, 10rem) clamp(1.5rem, 4vw, 3.5rem) clamp(3rem, 5vw, 5rem)",
      textAlign:  "center",
      background: TK.ink,
    }}>
      <p style={{
        fontFamily:    SANS,
        fontSize:      "clamp(0.7rem, 0.9vw, 0.9rem)",
        letterSpacing: "0.22em",
        color:         TK.green,
        textTransform: "uppercase",
        marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
      }}>{eyebrow}</p>
      <h1 style={{
        fontFamily:    SANS,
        fontWeight:    700,
        fontSize:      "clamp(3.5rem, 9vw, 9rem)",
        lineHeight:    0.95,
        color:         TK.paper,
        textTransform: "uppercase",
        letterSpacing: "-0.02em",
        margin:        0,
        marginBottom:  lede ? "clamp(1.5rem, 3vw, 2.5rem)" : 0,
      }}>
        {title}{italic && (
          <><br /><em style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 600, color: TK.green }}>{italic}</em></>
        )}
      </h1>
      {lede && (
        <p style={{
          fontFamily:  SANS,
          fontSize:    "clamp(0.9rem, 1.3vw, 1.3rem)",
          lineHeight:  1.5,
          color:       TK.green,
          maxWidth:    640,
          margin:      "0 auto",
        }}>{lede}</p>
      )}
    </section>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */
export function NoxSectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily:    SANS,
      fontWeight:    700,
      fontSize:      "clamp(2rem, 5vw, 5rem)",
      lineHeight:    1,
      color:         TK.paper,
      textTransform: "uppercase",
      textAlign:     "center",
      margin:        "0 0 clamp(2.5rem, 5vw, 5rem)",
      letterSpacing: "-0.01em",
    }}>{children}</h2>
  );
}

/* ── CTA bar ─────────────────────────────────────────────────────────── */
export function NoxCTABar({ label = "Let's Create", href = "/en/focused/contact" }: { label?: string; href?: string }) {
  return (
    <Link href={href} style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      height:         "clamp(52px, 5.5vw, 67px)",
      background:     TK.green,
      color:          TK.paper,
      fontFamily:     SANS,
      fontSize:       "clamp(0.9rem, 1.2vw, 1.2rem)",
      textDecoration: "none",
      transition:     "background 200ms ease",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = TK.greenHot)}
    onMouseLeave={e => (e.currentTarget.style.background = TK.green)}
    >{label}</Link>
  );
}

/* ── Clients marquee ────────────────────────────────────────────────── */
const CLIENT_NAMES = [
  "Atelier Noir", "Meridian", "Solaris Labs", "Parcel", "Drift & Co.",
  "Orbit Travel", "Nexus", "Forma Studio", "Arca", "Tessera",
  "Lumen Digital", "Haven", "Strata", "Cove",
];

export function NoxClients() {
  const items = [...CLIENT_NAMES, ...CLIENT_NAMES];
  return (
    <section style={{ borderTop: `1px solid ${TK.line}`, borderBottom: `1px solid ${TK.line}`, overflow: "hidden", padding: "clamp(1.8rem, 3.5vw, 3.5rem) 0" }}>
      <style>{`@keyframes nox-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}.nox-ticker{display:flex;width:max-content;animation:nox-ticker 36s linear infinite;will-change:transform}.nox-ticker:hover{animation-play-state:paused}`}</style>
      <div className="nox-ticker">
        {items.map((c, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(1rem, 2.2vw, 2.2rem)", color: TK.green, padding: "0 clamp(1.5rem, 3vw, 3.5rem)", letterSpacing: "-0.01em", textTransform: "uppercase" }}>{c}</span>
            <span style={{ width: 8, height: 8, background: TK.green, display: "inline-block", flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── MUSTs manifesto ────────────────────────────────────────────────── */
const MUSTS = [
  { n: "01", text: "Clarity.",  sub: "If it doesn't sharpen the message, it doesn't make the cut." },
  { n: "02", text: "Motion.",   sub: "Every movement has to explain, reveal, or guide — nothing decorative." },
  { n: "03", text: "Systems.",  sub: "The launch is not the finish line. It is the first stress test." },
  { n: "04", text: "Honesty.",  sub: "The strongest result starts with saying the useful thing early." },
];

function MustRow({ m, i }: { m: typeof MUSTS[0]; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="tk-must-row"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:   "relative",
        overflow:   "hidden",
        flex:       1,
        display:    "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderBottom: i < MUSTS.length - 1 ? `1px solid ${TK.line}` : "none",
        background: hov ? TK.green : "transparent",
        transition: "background 420ms cubic-bezier(0.22,1,0.36,1)",
        cursor:     "default",
      }}
    >
      {/* watermark number */}
      <span aria-hidden="true" style={{
        position:      "absolute",
        right:         "clamp(1rem, 3vw, 3rem)",
        top:           "50%",
        transform:     "translateY(-50%)",
        fontFamily:    DISPLAY,
        fontStyle:     "italic",
        fontWeight:    700,
        fontSize:      "clamp(9rem, 24vw, 28rem)",
        lineHeight:    1,
        letterSpacing: "-0.04em",
        color:         hov ? "rgba(0,0,0,0.07)" : "rgba(70,174,34,0.055)",
        userSelect:    "none",
        pointerEvents: "none",
        transition:    "color 420ms ease",
      }}>{m.n}</span>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "clamp(32px, 3.5vw, 52px) 1fr clamp(140px, 25vw, 380px)",
        alignItems:          "center",
        gap:                 "clamp(0.75rem, 2vw, 2.5rem)",
        padding:             "clamp(2rem, 5vw, 5.5rem) clamp(1.5rem, 4vw, 3.5rem)",
        position:            "relative",
        zIndex:              1,
      }}>

        {/* index */}
        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.58rem, 0.75vw, 0.75rem)",
          letterSpacing: "0.22em",
          color:         hov ? "rgba(0,0,0,0.45)" : TK.green,
          transition:    "color 300ms ease",
          alignSelf:     "flex-start",
          paddingTop:    "0.5em",
        }}>{m.n}</span>

        {/* big italic word — outline ghost → solid on hover */}
        <em style={{
          fontFamily:       DISPLAY,
          fontStyle:        "italic",
          fontWeight:       700,
          fontSize:         "clamp(4rem, 11vw, 13rem)",
          lineHeight:       0.88,
          letterSpacing:    "-0.03em",
          display:          "block",
          color:            hov ? TK.ink : "transparent",
          WebkitTextStroke: hov ? "1px transparent" : "1.5px rgba(255,255,255,0.65)",
          transition:       "color 360ms cubic-bezier(0.22,1,0.36,1), -webkit-text-stroke-color 360ms ease",
        }}>{m.text}</em>

        {/* body copy */}
        <div>
          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.82rem, 1.05vw, 1.1rem)",
            lineHeight: 1.65,
            color:      hov ? TK.ink : TK.green,
            margin:     0,
            transition: "color 300ms ease",
          }}>{m.sub}</p>
          {/* read-more pill — only visible on hover */}
          <span style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           6,
            marginTop:     12,
            fontFamily:    SANS,
            fontWeight:    600,
            fontSize:      "clamp(0.65rem, 0.78vw, 0.78rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         TK.ink,
            opacity:       hov ? 1 : 0,
            transform:     hov ? "translateY(0)" : "translateY(6px)",
            transition:    "opacity 280ms ease 60ms, transform 320ms cubic-bezier(0.22,1,0.36,1) 60ms",
          }}>
            <span style={{
              display:      "inline-block",
              width:        16,
              height:       1,
              background:   TK.ink,
              verticalAlign:"middle",
            }}/>
            principle {m.n}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NoxMusts() {
  return (
    <section className="tk-musts" style={{
      position:      "sticky",
      top:           0,
      zIndex:        2,
      background:    TK.ink,
      borderTop:     `1px solid ${TK.line}`,
      minHeight:     "100dvh",
      display:       "flex",
      flexDirection: "column",
    }}>

      {/* header row */}
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "baseline",
        padding:        "clamp(1.5rem, 2.5vw, 2.5rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderBottom:   `1px solid ${TK.line}`,
        flexShrink:     0,
      }}>
        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.62rem, 0.82vw, 0.82rem)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         TK.green,
        }}>/ our musts</span>

        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          margin:        0,
          textAlign:     "center",
          flex:          1,
        }}>what we never compromise</h2>

        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.62rem, 0.82vw, 0.82rem)",
          letterSpacing: "0.18em",
          color:         TK.green,
          opacity:       0.5,
        }}>04 principles</span>
      </div>

      {/* principle rows — fill remaining viewport height equally */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {MUSTS.map((m, i) => <MustRow key={i} m={m} i={i} />)}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */
export function NoxFooter() {
  const [val, setVal] = useState("");

  return (
    <footer style={{ background: TK.ink }}>
      {/* Green slab */}
      <div style={{
        background: TK.green,
        position:   "relative",
        overflow:   "hidden",
        padding:    "clamp(3.5rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(2.5rem, 4vw, 4rem)",
      }}>
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1.1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(2rem, 4vw, 4rem)",
          letterSpacing: "-0.005em",
          position:      "relative",
          zIndex:        2,
        }}>
          Got an idea?{" "}
          <em style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 600 }}>We&apos;d love</em>
          <br />to bring it to life
        </h2>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap:                 "clamp(1.5rem, 3vw, 3rem)",
          borderTop:           "1px solid rgba(0,0,0,0.2)",
          paddingTop:          "clamp(1.5rem, 3vw, 2.5rem)",
          position:            "relative",
          zIndex:              2,
        }}>
          {/* Email subscribe */}
          <div style={{
            borderBottom: "1px solid rgba(0,0,0,0.45)",
            paddingBottom: 8,
            display:      "flex",
            alignItems:   "center",
            gap:          8,
          }}>
            <input
              type="email"
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="Email"
              style={{
                background: "transparent",
                border:     "none",
                outline:    "none",
                fontFamily: SANS,
                fontSize:   "clamp(0.78rem, 0.95vw, 0.95rem)",
                color:      TK.ink,
                flexGrow:   1,
              }}
            />
            <span style={{ flexShrink: 0 }}><Arrow color={TK.ink} size={11} /></span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["about us", "services", "our work"].map(p => (
              <a key={p} href={`/en/focused/${p === "about us" ? "about" : p === "our work" ? "work" : p}`}
                style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.ink, textDecoration: "none" }}
              >{p}</a>
            ))}
          </div>

          {/* Social */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="#" style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.ink, textDecoration: "none" }}>Instagram</a>
            <a href="#" style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.ink, textDecoration: "none" }}>Twitter</a>
            <a href="#" style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.ink, textDecoration: "none" }}>LinkedIn</a>
          </div>

          {/* Location */}
          <p style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", lineHeight: 1.6, color: TK.ink, margin: 0 }}>
            Working with clients worldwide
          </p>

          {/* Contact */}
          <a href="mailto:hello@nox.studio"
            style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.ink, textDecoration: "none" }}
          >hello@nox.studio</a>
        </div>
      </div>

      {/* Base bar with ghost wordmark */}
      <div style={{
        padding:        "clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 4vw, 3.5rem)",
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "flex-end",
      }}>
        {/* Big faded NOX wordmark */}
        <img
          src="/nox-mesh-logo.svg"
          alt=""
          aria-hidden="true"
          style={{
            height:       "clamp(2.5rem, 7vw, 6rem)",
            width:        "auto",
            opacity:      0.12,
            userSelect:   "none",
            pointerEvents:"none",
            filter:       "brightness(10)",
          }}
        />
        <p style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.6rem, 0.8vw, 0.8rem)",
          color:      TK.muted,
          textAlign:  "right",
          lineHeight: 1.5,
          margin:     0,
        }}>
          © 2026 NOX Studio.<br />All rights reserved.
        </p>
      </div>
    </footer>
  );
}
