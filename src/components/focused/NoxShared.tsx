"use client";

import Link from "next/link";
import { useId, useState, useEffect, useRef } from "react";
import { HeaderLocaleControl } from "@/components/site/SiteControls";
import ContactFormPopup, { openContactFormPopup } from "@/components/site/ContactFormPopup";

/* ── design tokens ──────────────────────────────────────────────────── */
export const TK = {
  ink:        "var(--nox-ink, #000000)",
  green:      "var(--nox-green, #46ae22)",
  greenHot:   "#46d12a",
  paper:      "var(--nox-paper, #ffffff)",
  chrome:     "var(--nox-chrome, rgb(38,37,37))",
  line:       "rgba(70,174,34,0.35)",
  lineFaint:  "rgba(70,174,34,0.18)",
  muted:      "rgba(70,174,34,0.6)",
  /* surface tokens — light/dark adaptive */
  panel:      "var(--nox-panel, #0a0e0c)",
  card:       "var(--nox-card, #070b09)",
  border:     "var(--nox-border, rgba(255,255,255,0.09))",
  borderFaint:"var(--nox-border-faint, rgba(255,255,255,0.06))",
  textMuted:  "var(--nox-text-muted, rgba(255,255,255,0.52))",
  textFaint:  "var(--nox-text-faint, rgba(255,255,255,0.28))",
  iconFaint:  "var(--nox-icon-faint, rgba(255,255,255,0.13))",
} as const;

export const SANS    = "'Syne', 'Inter', sans-serif";
export const DISPLAY = "'Syne', 'Inter', sans-serif";
let _noxLogoCount = 0;

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

/* ── NoxLogoLoader — eye orbits + blinks autonomously ──────────────── */
export function NoxLogoLoader({ height = 160 }: { height?: number }) {
  const clipId   = useRef(`nox-clip-loader-${++_noxLogoCount}`).current;
  const svgRef   = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const scaleRef = useRef<SVGGElement>(null);
  const blinking = useRef(false);

  useEffect(() => {
    const OX = 610, OY = 181, ORBIT_R = 28;
    let rafId  = 0;
    let angle  = 0;
    let currentX = 0, currentY = 0;
    let scaleY = 1;

    function doBlink() {
      if (blinking.current) return;
      blinking.current = true;
      let phaseT = 0, phase = 0;
      const seq = setInterval(() => {
        phaseT++;
        if (phase === 0) {
          scaleY = Math.max(0, 1 - phaseT / 6);
          if (scaleY <= 0) { phase = 1; phaseT = 0; }
        } else {
          scaleY = Math.min(1, phaseT / 6);
          if (scaleY >= 1) { clearInterval(seq); blinking.current = false; }
        }
      }, 16);
    }

    let blinkTimer: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      blinkTimer = setTimeout(() => { doBlink(); scheduleBlink(); }, 1800 + Math.random() * 800);
    }
    scheduleBlink();

    function animate() {
      // Orbit: smooth circular motion
      angle += 0.022;
      const targetX = Math.cos(angle) * ORBIT_R;
      const targetY = Math.sin(angle) * ORBIT_R;
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      if (!blinking.current) scaleY += (1 - scaleY) * 0.18;

      pupilRef.current?.setAttribute("transform", `translate(${currentX.toFixed(2)} ${currentY.toFixed(2)})`);
      scaleRef.current?.setAttribute("transform", `translate(0 ${(OY * (1 - scaleY)).toFixed(2)}) scale(1 ${scaleY.toFixed(4)})`);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafId); clearTimeout(blinkTimer); };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 1224.36 362" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: "auto", display: "block" }}>
      <defs>
        <clipPath id={clipId}>
          <path d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
        </clipPath>
      </defs>
      <path fill="#fff" d="M326.83,361.07v-174.4C311.9,10.26,63.25,14.4,51.98,189.67v171.4H0v-182.39C12.84,12.64,218.29-64.44,331.34,65.21c59.25,67.94,46.42,147.87,45.41,231.35-.25,20.82.7,41.69.64,62.47,0,1.17-.07,1.29-1.09,2.04h-49.47Z"/>
      <path fill="#fff" d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
      <g ref={pupilRef} clipPath={`url(#${clipId})`}>
        <g ref={scaleRef}>
          <path fill="#000" d="M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z"/>
        </g>
      </g>
      <path fill="#fff" d="M912.02,1.25c55.05,59.15,109.74,118.76,163.28,179.22-18.41,23.68-40.14,44.54-60.35,66.64-34.38,37.59-68.37,75.54-102.88,113.01-.85.85-1.9.85-3,1-16.05,2.14-38.93-.72-56.06-.09-1.38.05-8.67,2.44-7.45-.44l162.74-179.91L845.56,1.25h66.47Z"/>
      <polygon fill="#46D12A" points="1224.36 1.25 1100.96 136.19 1067.9 101.22 1067.56 98.88 1156.9 1.25 1224.36 1.25"/>
      <path fill="#fff" d="M1157.9,361.07l-90.38-96.59,32.43-38.36c1.62,0,2.93,1.9,4,3,17.15,17.75,33.13,36.91,49.95,55,21.93,23.6,47.34,47.61,67.45,72.47.66.82,5.13,6.31,1.67,5.34-.53-.15-.88-.87-1.15-.87h-63.97Z"/>
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
  { label: "blog",     href: "/en/focused/blog" },
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
  const headerRef = useRef<HTMLElement>(null);

  /* Direct DOM mutation — zero React re-renders, silky CSS transition */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      if (window.scrollY > 40) {
        el.style.height = "56px";
      } else {
        el.style.height = "";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nox-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          height: clamp(72px, 7vw, 88px);
          background: ${TK.ink};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1.5rem, 4vw, 3.5rem);
          border-bottom: 1px solid ${TK.lineFaint};
          transition: height 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: height;
        }
        .nox-nav-link {
          font-family: ${SANS};
          font-size: clamp(0.76rem, 0.92vw, 0.92rem);
          color: ${TK.green};
          text-decoration: none;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-bottom: 1px solid transparent;
          padding-bottom: 3px;
          transition: color 160ms ease, border-color 160ms ease;
        }
        .nox-nav-link:hover { color: ${TK.greenHot}; }
        .nox-nav-link.active { color: ${TK.greenHot}; border-bottom-color: ${TK.greenHot}; }
        .nox-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0 clamp(1rem, 1.4vw, 1.4rem);
          height: 34px;
          background: transparent;
          color: ${TK.green};
          border: 1px solid ${TK.line};
          font-size: clamp(0.7rem, 0.82vw, 0.82rem);
          font-family: ${SANS};
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }
        .nox-cta:hover {
          background: ${TK.green};
          border-color: ${TK.green};
          color: ${TK.ink};
        }
        .nox-locale .locale-control {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          direction: ltr;
        }
        .nox-locale .locale-control button {
          font-family: ${SANS};
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${TK.textFaint};
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 160ms ease;
        }
        .nox-locale .locale-control span {
          color: ${TK.textFaint};
          font-size: 0.6rem;
        }
        .nox-locale .locale-control button:hover { color: ${TK.green}; }
        .nox-locale .locale-control button[aria-current="true"] { color: ${TK.green}; font-weight: 700; }
      `}</style>

      <header ref={headerRef} className="nox-navbar">
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
          {NAV.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`nox-nav-link${active === label ? " active" : ""}`}
            >{label}</Link>
          ))}
        </nav>

        {/* Right: lang + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <HeaderLocaleControl theme="focused" className="nox-locale" />

          <button type="button" onClick={() => openContactFormPopup()} className="nox-cta">
            Let&apos;s talk
          </button>
        </div>
      </header>
      <ContactFormPopup theme="focused" />
    </>
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
const CLIENT_NAMES_FALLBACK = [
  "Guarantee", "Elia Clinic", "AKG Creative House", "Vera Reformer & Pilates",
  "Thrt Home Services", "DARQ Architects", "Sky Group", "MARSHES",
  "11vent Production", "Ida Bakery & Bistro", "Leaders Makers", "180 Degrees",
];

type ClientItem = { name: string; company: string | null; logo?: string | null };

function LogoSlot({ client }: { client: ClientItem }) {
  const [hov, setHov] = useState(false);
  const label = client.company || client.name;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "clamp(110px,13vw,180px)",
        height: "clamp(52px,6vw,80px)",
        flexShrink: 0,
        borderRight: `1px solid ${TK.borderFaint}`,
        padding: "0 clamp(1rem,2vw,2rem)",
        position: "relative",
        cursor: "default",
      }}
    >
      {client.logo ? (
        <>
          <img
            src={client.logo}
            alt={label}
            className="nox-client-logo"
            style={{
              height: "clamp(18px,2.2vw,32px)",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              filter: hov
                ? "brightness(0) saturate(100%) invert(55%) sepia(80%) saturate(400%) hue-rotate(65deg) brightness(0.9)"
                : "var(--nox-logo-filter, brightness(0) invert(1))",
              opacity: hov ? 1 : 0.38,
              transition: "opacity 220ms ease, filter 280ms ease",
              userSelect: "none",
            }}
          />
          {/* tooltip */}
          <span style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: `translateX(-50%) translateY(${hov ? 0 : 4}px)`,
            background: TK.green,
            color: "#000",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            padding: "0.25rem 0.6rem",
            whiteSpace: "nowrap",
            opacity: hov ? 1 : 0,
            pointerEvents: "none",
            transition: "opacity 180ms ease, transform 180ms ease",
            zIndex: 10,
          }}>{label}</span>
        </>
      ) : (
        <span style={{
          fontFamily: SANS, fontWeight: 700,
          fontSize: "clamp(0.65rem,0.85vw,0.85rem)",
          letterSpacing: "0.05em",
          color: TK.green,
          opacity: hov ? 0.9 : 0.35,
          whiteSpace: "nowrap",
          transition: "opacity 220ms",
          textAlign: "center",
          lineHeight: 1.2,
        }}>{label}</span>
      )}
    </div>
  );
}

export function NoxClients({ clients }: { clients?: ClientItem[] }) {
  const withLogos = clients?.filter(c => c.logo) ?? [];
  const all: ClientItem[] = withLogos.length > 0
    ? withLogos
    : CLIENT_NAMES_FALLBACK.map(n => ({ name: n, company: n }));

  const mid = Math.ceil(all.length / 2);
  const row1 = all.slice(0, mid);
  const row2 = all.slice(mid);

  const r1 = [...row1, ...row1, ...row1];
  const r2 = [...row2, ...row2, ...row2];

  return (
    <section style={{ borderTop: `1px solid ${TK.line}`, borderBottom: `1px solid ${TK.line}`, background: TK.ink, overflow: "hidden" }}>
      <style>{`
        @keyframes nc-fwd { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes nc-rev { from { transform: translateX(-33.333%) } to { transform: translateX(0) } }
        .nc-row-fwd { display:flex; width:max-content; animation: nc-fwd 40s linear infinite; will-change:transform; }
        .nc-row-rev { display:flex; width:max-content; animation: nc-rev 48s linear infinite; will-change:transform; }
        .nc-row-fwd:hover, .nc-row-rev:hover { animation-play-state: paused; }
      `}</style>

      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1rem,1.6vw,1.4rem) clamp(1.5rem,4vw,3.5rem)",
        borderBottom: `1px solid ${TK.borderFaint}`,
      }}>
        <span style={{ fontFamily: SANS, fontSize: "clamp(0.58rem,0.7vw,0.72rem)", letterSpacing: "0.26em", textTransform: "uppercase", color: TK.green, opacity: 0.38 }}>
          / Clients we have worked with
        </span>
        <span style={{ fontFamily: SANS, fontSize: "clamp(0.56rem,0.66vw,0.66rem)", letterSpacing: "0.14em", color: TK.green, opacity: 0.2 }}>
          {all.length} clients
        </span>
      </div>

      {/* rows container with edge fades */}
      <div style={{ position: "relative" }}>
        {/* left fade */}
        <div aria-hidden style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(60px,8vw,120px)",
          background: `linear-gradient(to right, ${TK.ink}, transparent)`,
          zIndex: 2, pointerEvents: "none",
        }} />
        {/* right fade */}
        <div aria-hidden style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(60px,8vw,120px)",
          background: `linear-gradient(to left, ${TK.ink}, transparent)`,
          zIndex: 2, pointerEvents: "none",
        }} />

        {/* row 1 — forward */}
        <div style={{ overflow: "hidden", borderBottom: `1px solid ${TK.borderFaint}` }}>
          <div className="nc-row-fwd">
            {r1.map((c, i) => <LogoSlot key={i} client={c} />)}
          </div>
        </div>

        {/* row 2 — reverse */}
        <div style={{ overflow: "hidden" }}>
          <div className="nc-row-rev">
            {r2.map((c, i) => <LogoSlot key={i} client={c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Scrolling client logo strip (RAF-based) ────────────────────────── */
export function ClientCarousel({ clients }: { clients: ClientItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef(0);
  const pauseRef = useRef(false);
  const dragRef  = useRef({ startX: 0, startPos: 0, active: false, pointerId: -1 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackEl = track;
    const half = track.scrollWidth / 2;
    function tick() {
      if (!pauseRef.current) {
        posRef.current += 0.5;
        if (posRef.current >= half) posRef.current -= half;
        if (posRef.current < 0) posRef.current += half;
        trackEl.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function moveTo(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    let next = dragRef.current.startPos - (clientX - dragRef.current.startX);
    if (next < 0) next += half;
    if (next >= half) next -= half;
    posRef.current = next;
    track.style.transform = `translateX(-${next}px)`;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startPos: posRef.current, active: true, pointerId: e.pointerId };
    pauseRef.current = true;
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
    pauseRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grab";
  }

  const doubled = [...clients, ...clients];
  return (
    <div
      style={{ overflow: "hidden", padding: "clamp(2.5rem,4vw,4.5rem) 0", touchAction: "pan-y", cursor: "grab", userSelect: "none" }}
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { if (!dragRef.current.active) pauseRef.current = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div ref={trackRef} style={{ display: "flex", alignItems: "center", gap: "clamp(3rem,6vw,7rem)", width: "max-content", paddingLeft: "clamp(1.5rem,4vw,3.5rem)" }}>
        {doubled.map((cl, i) => {
          const label = cl.company ?? cl.name;
          return (
            <div key={i} className="cc-item" style={{
              flexShrink: 0, position: "relative",
              width: "clamp(100px,12vw,160px)", height: "clamp(40px,5vw,64px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {cl.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cl.logo}
                  alt={label}
                  draggable={false}
                  style={{
                    maxWidth: "100%", maxHeight: "100%",
                    width: "auto", height: "auto",
                    objectFit: "contain",
                    filter: "brightness(0) saturate(100%) invert(55%) sepia(80%) saturate(400%) hue-rotate(65deg) brightness(0.85)",
                    opacity: 0.65,
                    transition: "opacity 220ms",
                    display: "block",
                  }}
                />
              ) : (
                <span style={{
                  fontFamily: SANS, fontWeight: 700, fontSize: "clamp(0.72rem,0.9vw,0.9rem)",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: TK.green, opacity: 0.55, whiteSpace: "nowrap",
                }}>{label}</span>
              )}
              <span className="cc-tip" style={{
                position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
                transform: "translateX(-50%) translateY(4px)",
                fontFamily: SANS, fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#000", background: TK.green,
                padding: "0.28rem 0.65rem", whiteSpace: "nowrap",
                pointerEvents: "none", opacity: 0,
                transition: "opacity 180ms ease, transform 180ms ease",
              }}>{label}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        .cc-item:hover img { opacity: 1 !important; }
        .cc-item:hover .cc-tip { opacity: 1 !important; transform: translateX(-50%) translateY(0) !important; }
      `}</style>
    </div>
  );
}

/* ── MUSTs manifesto ────────────────────────────────────────────────── */
const MUSTS = [
  { n: "01", text: "Clarity.",  sub: "If people cannot understand it, it is not ready yet." },
  { n: "02", text: "Care.",     sub: "Small team means real attention — to the client, the users, and the little details that usually cause big headaches." },
  { n: "03", text: "Systems.",  sub: "A launch is not just a finish line. It is the moment your digital thing has to behave in public." },
  { n: "04", text: "Honesty.",  sub: "We suggest what makes sense, not what makes the invoice bigger." },
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
          WebkitTextStroke: hov ? "1px transparent" : `1.5px ${TK.textMuted}`,
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

/* ── Footer social icons ───────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69V11.1h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.32 0 2.46.1 2.8.14v3.24h-1.92c-1.5 0-1.8.72-1.8 1.76v2.31h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0Z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.26.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.22-.41C8.42 2.21 8.8 2.2 12 2.2Zm0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.66.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.66 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.36.81 1.1.81 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.83.58C20.56 22.09 24 17.6 24 12.3 24 5.67 18.63.3 12 .3Z"/>
    </svg>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */
const FOOTER_PAGES: [string, string][] = [
  ["home",     ""],
  ["about us", "about"],
  ["services", "services"],
  ["our work", "work"],
  ["blog",     "blog"],
  ["contact",  "contact"],
];

const FOOTER_NATIONS = [
  { name: "Saudi Arabia",         code: "sa" },
  { name: "United Arab Emirates", code: "ae" },
  { name: "Egypt",                code: "eg" },
  { name: "Turkey",               code: "tr" },
  { name: "Syria",                code: "sy" },
  { name: "Lebanon",              code: "lb" },
  { name: "Austria",              code: "at" },
  { name: "Germany",              code: "de" },
];

const FOOTER_EMAILS = [
  "tony@noxstudio.dev",
  "almotassem@noxstudio.dev",
  "rami@noxstudio.dev",
  "jossef@noxstudio.dev",
];

const FOOTER_SOCIALS: [string, string, React.ReactNode][] = [
  ["LinkedIn",  "#", <LinkedInIcon key="li" />],
  ["Facebook",  "#", <FacebookIcon key="fb" />],
  ["Instagram", "#", <InstagramIcon key="ig" />],
  ["GitHub",    "#", <GitHubIcon key="gh" />],
];

export function NoxFooter() {
  const [email, setEmail] = useState("");
  const FG  = "#0b2007";                   // dark green text on green bg
  const FGA = "rgba(11,32,7,0.65)";        // dimmed variant
  const PAD = "clamp(1.5rem, 4vw, 3.5rem)";
  const COL_BORDER = "1px solid rgba(11,32,7,0.22)";

  const eyebrow: React.CSSProperties = {
    fontFamily:    SANS,
    fontSize:      "clamp(0.6rem,0.72vw,0.72rem)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color:         FG,
    opacity:       0.55,
    margin:        "0 0 clamp(0.8rem,1.4vw,1.2rem)",
  };
  const linkStyle: React.CSSProperties = {
    fontFamily:     SANS,
    fontSize:       "clamp(0.78rem,0.9vw,0.92rem)",
    color:          FGA,
    textDecoration: "none",
    transition:     "color 150ms",
  };
  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = FG);
  const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = FGA);

  return (
    <footer style={{ background: "var(--nox-green,#46ae22)", overflow: "hidden", color: FG }}>

      {/* ── Top row: headline + newsletter ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems:          "center",
        gap:                 "clamp(2rem, 5vw, 6rem)",
        padding:             `clamp(1.5rem,2.5vw,2.5rem) ${PAD} clamp(1.2rem,2vw,1.8rem)`,
      }}>
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
          Got an idea? Let&apos;s make it easier.
        </h2>

        <div>
          <p style={{ fontFamily: SANS, fontSize: "clamp(0.68rem,0.82vw,0.82rem)", color: FGA, margin: "0 0 0.5rem" }}>
            Simple notes on websites, systems, UX, SEO, and the small digital mistakes everyone keeps pretending are normal.
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
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(11,32,7,0.28)", margin: `0 ${PAD}` }} />

      {/* ── 3-column footer table: about+social · pages · reach us ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems:          "flex-start",
        padding:             `clamp(1.8rem,3vw,3rem) ${PAD}`,
        gap:                 "clamp(1.5rem, 4vw, 3rem)",
      }}>

        {/* Column 1: about the studio + social icons */}
        <div style={{ borderRight: COL_BORDER, paddingRight: "clamp(1rem,2vw,2rem)" }}>
          <p style={eyebrow}>/ about</p>
          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.78rem,0.92vw,0.94rem)",
            lineHeight: 1.6,
            color:      FGA,
            margin:     "0 0 clamp(1.2rem,2vw,1.6rem)",
            maxWidth:   "34ch",
          }}>
            NOX Studio designs and builds websites, brand systems, and digital products for founders and growing teams. We fix what&apos;s slow, unclear, or invisible to search — and ship work that actually performs.
          </p>
          <div style={{ display: "flex", gap: "clamp(0.7rem,1.2vw,1rem)" }}>
            {FOOTER_SOCIALS.map(([label, href, icon]) => (
              <a key={label} href={href} aria-label={label} style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          34,
                height:         34,
                border:         `1px solid rgba(11,32,7,0.32)`,
                color:          FG,
                transition:     "background 150ms, color 150ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = FG; e.currentTarget.style.color = "var(--nox-green,#46ae22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = FG; }}
              >{icon}</a>
            ))}
          </div>
        </div>

        {/* Column 2: page links */}
        <div style={{ borderRight: COL_BORDER, paddingRight: "clamp(1rem,2vw,2rem)" }}>
          <p style={eyebrow}>/ pages</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem,0.9vw,0.85rem)" }}>
            {FOOTER_PAGES.map(([label, slug]) => (
              <a key={label} href={`/en/focused/${slug}`} style={linkStyle}
                onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}
              >{label}</a>
            ))}
          </nav>
        </div>

        {/* Column 3: crosshair · location · nationalities · direct emails */}
        <div>
          <p style={eyebrow}>/ reach us</p>

          <svg width={36} height={36} viewBox="0 0 42 42" fill="none" stroke={FG} strokeWidth={1.1} aria-hidden="true" style={{ marginBottom: "clamp(0.8rem,1.4vw,1.2rem)" }}>
            <circle cx={21} cy={21} r={11}/>
            <line x1={21} y1={0}  x2={21} y2={9}/>
            <line x1={21} y1={33} x2={21} y2={42}/>
            <line x1={0}  y1={21} x2={9}  y2={21}/>
            <line x1={33} y1={21} x2={42} y2={21}/>
            <circle cx={21} cy={21} r={2.2} fill={FG} stroke="none"/>
          </svg>

          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.78rem,0.9vw,0.92rem)",
            fontWeight: 700,
            lineHeight: 1.5,
            color:      FG,
            margin:     "0 0 0.15rem",
          }}>
            Based In Damascus-Syria.
          </p>
          <p style={{
            fontFamily: SANS,
            fontSize:   "clamp(0.72rem,0.86vw,0.88rem)",
            lineHeight: 1.55,
            color:      FGA,
            margin:     "0 0 clamp(0.9rem,1.6vw,1.3rem)",
          }}>
            Working worldwide.
          </p>

          <p style={{ ...eyebrow, fontSize: "clamp(0.58rem,0.68vw,0.68rem)", margin: "0 0 0.6rem" }}>
            Nationality of the projects we worked on
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem 0.55rem", marginBottom: "clamp(1.2rem,2vw,1.6rem)" }}>
            {FOOTER_NATIONS.map(n => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={n.code}
                src={`https://flagcdn.com/${n.code}.svg`}
                alt={n.name}
                title={n.name}
                width={24}
                height={17}
                style={{
                  width:        24,
                  height:       17,
                  objectFit:    "cover",
                  border:       "1px solid rgba(11,32,7,0.3)",
                  display:      "block",
                  flexShrink:   0,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {FOOTER_EMAILS.map(addr => (
              <a key={addr} href={`mailto:${addr}`} style={{ ...linkStyle, whiteSpace: "nowrap" }}
                onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}
              >{addr}</a>
            ))}
          </div>
        </div>
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
