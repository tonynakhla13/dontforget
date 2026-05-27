"use client";

import Link from "next/link";
import { useId, useState, useEffect, useRef } from "react";

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

/* ── NOX animated logo — mouse-tracking eye ─────────────────────────── */
export function NoxLogo({ height = 36 }: { height?: number }) {
  const clipId   = useId();
  const svgRef   = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const scaleRef = useRef<SVGGElement>(null);
  const blinking = useRef(false);

  useEffect(() => {
    const OX = 610, OY = 181, MAX_R = 36;

    let rafId    = 0;
    let targetX  = 0, targetY  = 0;
    let currentX = 0, currentY = 0;
    let scaleY   = 1;

    // ── mouse tracking ───────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      if (blinking.current) return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = 1224.36 / rect.width;
      const sy = 362 / rect.height;
      const mx = (e.clientX - rect.left) * sx;
      const my = (e.clientY - rect.top)  * sy;
      const dx = mx - OX, dy = my - OY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const r = Math.min(dist, MAX_R);
      targetX = (dx / dist) * r;
      targetY = (dy / dist) * r;
    }

    // ── auto blink every 3–4 s ──────────────────────────────────────
    function doBlink() {
      if (blinking.current) return;
      blinking.current = true;
      let phaseT = 0;
      let phase  = 0; // 0 = closing, 1 = opening

      const seq = setInterval(() => {
        phaseT++;
        if (phase === 0) {
          scaleY = Math.max(0, 1 - phaseT / 8);
          if (scaleY <= 0) { phase = 1; phaseT = 0; }
        } else {
          scaleY = Math.min(1, phaseT / 8);
          if (scaleY >= 1) {
            clearInterval(seq);
            blinking.current = false;
          }
        }
      }, 16);
    }

    // Random interval between 3000–4000 ms
    let blinkTimer: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      const delay = 3000 + Math.random() * 1000;
      blinkTimer = setTimeout(() => { doBlink(); scheduleBlink(); }, delay);
    }
    scheduleBlink();

    // ── RAF loop ────────────────────────────────────────────────────
    function animate() {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      if (!blinking.current) scaleY += (1 - scaleY) * 0.18;

      pupilRef.current?.setAttribute(
        "transform",
        `translate(${currentX.toFixed(2)} ${currentY.toFixed(2)})`
      );
      scaleRef.current?.setAttribute(
        "transform",
        `translate(0 ${(OY * (1 - scaleY)).toFixed(2)}) scale(1 ${scaleY.toFixed(4)})`
      );
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      clearTimeout(blinkTimer);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1224.36 362"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: "auto", display: "block" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
        </clipPath>
      </defs>

      {/* N */}
      <path fill="var(--nox-paper,#fff)" d="M326.83,361.07v-174.4C311.9,10.26,63.25,14.4,51.98,189.67v171.4H0v-182.39C12.84,12.64,218.29-64.44,331.34,65.21c59.25,67.94,46.42,147.87,45.41,231.35-.25,20.82.7,41.69.64,62.47,0,1.17-.07,1.29-1.09,2.04h-49.47Z"/>

      {/* O — white ring */}
      <path fill="var(--nox-paper,#fff)" d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>

      {/* O — pupil: outer group translates with mouse, inner group handles blink scaleY */}
      <g ref={pupilRef} clipPath={`url(#${clipId})`}>
        <g ref={scaleRef}>
          <path fill="var(--nox-ink,#000)" d="M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z"/>
        </g>
      </g>

      {/* K */}
      <path fill="var(--nox-paper,#fff)" d="M912.02,1.25c55.05,59.15,109.74,118.76,163.28,179.22-18.41,23.68-40.14,44.54-60.35,66.64-34.38,37.59-68.37,75.54-102.88,113.01-.85.85-1.9.85-3,1-16.05,2.14-38.93-.72-56.06-.09-1.38.05-8.67,2.44-7.45-.44l162.74-179.91L845.56,1.25h66.47Z"/>

      {/* X — green triangle */}
      <polygon fill="#46D12A" points="1224.36 1.25 1100.96 136.19 1067.9 101.22 1067.56 98.88 1156.9 1.25 1224.36 1.25"/>

      {/* X — white bottom */}
      <path fill="var(--nox-paper,#fff)" d="M1157.9,361.07l-90.38-96.59,32.43-38.36c1.62,0,2.93,1.9,4,3,17.15,17.75,33.13,36.91,49.95,55,21.93,23.6,47.34,47.61,67.45,72.47.66.82,5.13,6.31,1.67,5.34-.53-.15-.88-.87-1.15-.87h-63.97Z"/>
    </svg>
  );
}

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
      {/* Logo */}
      <Link href="/en/focused" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <NoxLogo height={32} />
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
export function NoxCTABar({ label = "Start a project", href = "/en/focused/contact" }: { label?: string; href?: string }) {
  return (
    <section style={{
      background:      TK.ink,
      backgroundImage: `linear-gradient(rgba(70,209,42,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(70,209,42,0.055) 1px, transparent 1px)`,
      backgroundSize:  "22px 22px",
      borderTop:       `1px solid ${TK.line}`,
      borderBottom:    `1px solid ${TK.line}`,
      padding:         `clamp(1.6rem, 3vw, 2.8rem) clamp(1.5rem, 4vw, 3.5rem)`,
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "space-between",
      gap:             "clamp(1.5rem, 4vw, 4rem)",
    }}>
      {/* Left: eyebrow + headline on one line */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2.5vw, 2.5rem)", flexShrink: 1, minWidth: 0 }}>
        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.6rem, 0.75vw, 0.75rem)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         TK.green,
          opacity:       0.45,
          whiteSpace:    "nowrap",
          flexShrink:    0,
        }}>/ next step</span>
        <span style={{ width: 1, height: "1.6em", background: TK.line, flexShrink: 0 }} />
        <p style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(1rem, 2vw, 2rem)",
          color:         TK.paper,
          margin:        0,
          lineHeight:    1.1,
          letterSpacing: "-0.01em",
          whiteSpace:    "nowrap",
        }}>Got an idea? Let&apos;s build it.</p>
      </div>

      {/* Right: CTA button */}
      <Link href={href} style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            8,
        padding:        "0.6rem 1.4rem",
        background:     TK.green,
        color:          "#000",
        fontFamily:     SANS,
        fontWeight:     700,
        fontSize:       "clamp(0.65rem, 0.8vw, 0.8rem)",
        letterSpacing:  "0.12em",
        textTransform:  "uppercase",
        textDecoration: "none",
        whiteSpace:     "nowrap",
        flexShrink:     0,
        transition:     "background 200ms ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = TK.greenHot)}
      onMouseLeave={e => (e.currentTarget.style.background = TK.green)}
      >
        {label}
        <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8L8 2M8 2H4M8 2v4"/>
        </svg>
      </Link>
    </section>
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
      background:    TK.ink,
      borderTop:     `1px solid ${TK.line}`,
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
  const [email, setEmail] = useState("");
  const FG  = "#0b2007";                   // dark green text on green bg
  const FGA = "rgba(11,32,7,0.65)";        // dimmed variant
  const PAD = "clamp(1.5rem, 4vw, 3.5rem)";

  return (
    <footer style={{ background: "var(--nox-green,#46ae22)", overflow: "hidden", color: FG }}>

      {/* ── Top row: headline · nav · social ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems:          "flex-start",
        gap:                 "clamp(2rem, 5vw, 6rem)",
        padding:             `clamp(1rem,1.8vw,1.8rem) ${PAD} clamp(0.35rem,0.5vw,0.5rem)`,
      }}>
        {/* Headline */}
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(1.8rem, 4vw, 4.6rem)",
          lineHeight:    1.05,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          color:         FG,
          margin:        0,
        }}>
          Got an idea? We&apos;d love<br />to bring it to life
        </h2>

        {/* Page nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "clamp(0.35rem,0.6vw,0.7rem)", paddingTop: "0.25rem" }}>
          {[["about us", "about"], ["services", "services"], ["cases", "work"]].map(([label, slug]) => (
            <a key={label} href={`/en/focused/${slug}`} style={{
              fontFamily:     SANS,
              fontSize:       "clamp(0.78rem,0.9vw,0.92rem)",
              color:          FGA,
              textDecoration: "none",
              transition:     "color 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = FG)}
            onMouseLeave={e => (e.currentTarget.style.color = FGA)}
            >{label}</a>
          ))}
        </nav>

        {/* Social */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "clamp(0.35rem,0.6vw,0.7rem)", paddingTop: "0.25rem" }}>
          {[["Instagram", "#"], ["Twitter", "#"]].map(([label, href]) => (
            <a key={label} href={href} style={{
              fontFamily:     SANS,
              fontSize:       "clamp(0.78rem,0.9vw,0.92rem)",
              color:          FGA,
              textDecoration: "none",
              transition:     "color 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = FG)}
            onMouseLeave={e => (e.currentTarget.style.color = FGA)}
            >{label} →</a>
          ))}
        </nav>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(11,32,7,0.28)", margin: `0 ${PAD}` }} />

      {/* ── Bottom info row: newsletter · crosshair · location · email ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr auto 1fr auto",
        alignItems:          "center",
        gap:                 "clamp(1rem,2.5vw,3rem)",
        padding:             `clamp(0.35rem,0.5vw,0.5rem) ${PAD}`,
      }}>

        {/* Newsletter signup */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: "clamp(0.68rem,0.82vw,0.82rem)", color: FGA, margin: "0 0 0.5rem" }}>
            Sign up for our newsletter
          </p>
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            borderBottom:  "2px solid #d63800",
            paddingBottom: 5,
          }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                background: "transparent",
                border:     "none",
                outline:    "none",
                fontFamily: SANS,
                fontSize:   "clamp(0.78rem,0.9vw,0.9rem)",
                color:      FG,
                flexGrow:   1,
                minWidth:   0,
              }}
            />
            <span style={{ flexShrink: 0, cursor: "pointer" }}>
              <Arrow color={FG} size={11} />
            </span>
          </div>
        </div>

        {/* Crosshair icon */}
        <svg width={42} height={42} viewBox="0 0 42 42" fill="none" stroke={FG} strokeWidth={1.1} aria-hidden="true">
          <circle cx={21} cy={21} r={11}/>
          <line x1={21} y1={0}  x2={21} y2={9}/>
          <line x1={21} y1={33} x2={21} y2={42}/>
          <line x1={0}  y1={21} x2={9}  y2={21}/>
          <line x1={33} y1={21} x2={42} y2={21}/>
          <circle cx={21} cy={21} r={2.2} fill={FG} stroke="none"/>
        </svg>

        {/* Location */}
        <p style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.72rem,0.86vw,0.88rem)",
          lineHeight: 1.55,
          color:      FGA,
          margin:     0,
        }}>
          We&apos;re based in Bali, working<br />with clients worldwide
        </p>

        {/* Contact email */}
        <a href="mailto:hello@noxstudio.dev" style={{
          fontFamily:     SANS,
          fontSize:       "clamp(0.76rem,0.9vw,0.9rem)",
          color:          FGA,
          textDecoration: "none",
          whiteSpace:     "nowrap",
          transition:     "color 150ms",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = FG)}
        onMouseLeave={e => (e.currentTarget.style.color = FGA)}
        >hello@noxstudio.dev</a>
      </div>

      {/* ── Giant NOX wordmark watermark (public asset) ──
           SVG viewBox is 1198×582. Large letters start at y≈280.
           Clip to the bottom 302px (282/582 ≈ 48.5% of SVG height).
           Container height = 100vw × (302/1198) ≈ 25.2vw           ── */}
      <div style={{
        position: "relative",
        height:   "calc(100vw * 302 / 1198)",
        overflow: "hidden",
        lineHeight: 0,
        marginTop: "0.2rem",
      }}>
        <img
          src="/foucsed/footernox.svg"
          alt=""
          aria-hidden="true"
          style={{
            position:      "absolute",
            bottom:        0,
            left:          0,
            width:         "100%",
            height:        "auto",
            display:       "block",
            userSelect:    "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </footer>
  );
}
