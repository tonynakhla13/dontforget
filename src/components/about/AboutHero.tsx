"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ── Data ─────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries" },
  { value: "24h", label: "Avg. response" },
  { value: "3",   label: "Years" },
];

/* ── SVG Atoms ────────────────────────────────────────────────────────── */

function Sparkle({ size = 22, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" style={{ display: "block" }}>
      <path d="M12 0L13.4 10.6L24 12L13.4 13.4L12 24L10.6 13.4L0 12L10.6 10.6Z" fill={`rgba(58,191,138,${opacity})`} />
    </svg>
  );
}

function Reticle({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden fill="none">
      <circle cx="15" cy="15" r="11" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <circle cx="15" cy="15" r="3"  fill="rgba(58,191,138,0.65)" />
      <line x1="15" y1="0"  x2="15" y2="7"  stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="15" y1="23" x2="15" y2="30" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="0"  y1="15" x2="7"  y2="15" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="23" y1="15" x2="30" y2="15" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
    </svg>
  );
}

function Crosshair({ size = 14, opacity = 0.4 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden fill="none">
      <line x1="7" y1="0"  x2="7"  y2="14" stroke={`rgba(58,191,138,${opacity})`} strokeWidth="1" />
      <line x1="0" y1="7"  x2="14" y2="7"  stroke={`rgba(58,191,138,${opacity})`} strokeWidth="1" />
    </svg>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const sz = 22;
  const paths: Record<string, string> = {
    tl: `M${sz} 0 L0 0 L0 ${sz}`,
    tr: `M0 0 L${sz} 0 L${sz} ${sz}`,
    bl: `M${sz} ${sz} L0 ${sz} L0 0`,
    br: `M0 ${sz} L${sz} ${sz} L${sz} 0`,
  };
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} aria-hidden fill="none">
      <path d={paths[pos]} stroke="rgba(58,191,138,0.50)" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Robotic Hand (local coords — fingers point toward +x) ───────────── */
/*
  Local space: palm centred at origin, fingers extend right (+x)
  Thumb extends upward (-y) from the palm top-right corner
  Flip=true mirrors on Y axis so hand 2 is a reflection of hand 1
*/
function RoboHand({ flip = false }: { flip?: boolean }) {
  const sk = "rgba(58,191,138,0.62)";   // stroke
  const fk = "rgba(58,191,138,0.04)";   // fill
  const w  = "1.5";                      // strokeWidth
  const jw = "0.8";                      // joint line width

  return (
    <g transform={flip ? "scale(1,-1)" : undefined}>

      {/* ── Palm ── */}
      <rect x={-50} y={-58} width={100} height={116} rx={10}
            stroke={sk} fill={fk} strokeWidth={w} />
      {/* Knuckle groove lines */}
      <line x1={-50} y1={-16} x2={50} y2={-16} stroke={sk} strokeWidth="0.6" opacity="0.40" />
      <line x1={-50} y1={20}  x2={50} y2={20}  stroke={sk} strokeWidth="0.6" opacity="0.40" />
      {/* Palm surface detail: small rivet dots */}
      {[-34, -8, 18].map((y, i) => (
        <circle key={i} cx={-22} cy={y} r="2.5" stroke={sk} strokeWidth="0.8" fill="none" opacity="0.45" />
      ))}

      {/* ── Thumb (upper-right of palm, diagonal) ── */}
      <rect x={-105} y={-24} width={60} height={36} rx={7}
            stroke={sk} fill={fk} strokeWidth={w}
            transform="rotate(-18, -75, -6)" />
      {/* Thumb joint */}
      <line x1={-75} y1={-20} x2={-75} y2={14}
            stroke={sk} strokeWidth={jw} opacity="0.50"
            transform="rotate(-18, -75, -6)" />

      {/* ── Index finger ── */}
      <rect x={50} y={-55} width={152} height={26} rx={7}
            stroke={sk} fill={fk} strokeWidth={w} />
      <line x1={101} y1={-55} x2={101} y2={-29} stroke={sk} strokeWidth={jw} opacity="0.50" />
      <line x1={152} y1={-55} x2={152} y2={-29} stroke={sk} strokeWidth={jw} opacity="0.50" />
      {/* Tip glow */}
      <circle cx={202} cy={-42} r="5" fill="rgba(58,191,138,0.40)"
              style={{ filter: "drop-shadow(0 0 6px rgba(58,191,138,0.75))" }} />

      {/* ── Middle finger (longest) ── */}
      <rect x={50} y={-24} width={165} height={26} rx={7}
            stroke={sk} fill={fk} strokeWidth={w} />
      <line x1={105} y1={-24} x2={105} y2={2}  stroke={sk} strokeWidth={jw} opacity="0.50" />
      <line x1={160} y1={-24} x2={160} y2={2}  stroke={sk} strokeWidth={jw} opacity="0.50" />
      {/* Tip glow */}
      <circle cx={215} cy={-11} r="5" fill="rgba(58,191,138,0.45)"
              style={{ filter: "drop-shadow(0 0 8px rgba(58,191,138,0.80))" }} />

      {/* ── Ring finger ── */}
      <rect x={50} y={7} width={148} height={24} rx={7}
            stroke={sk} fill={fk} strokeWidth={w} />
      <line x1={99}  y1={7} x2={99}  y2={31} stroke={sk} strokeWidth={jw} opacity="0.50" />
      <line x1={148} y1={7} x2={148} y2={31} stroke={sk} strokeWidth={jw} opacity="0.50" />

      {/* ── Pinky ── */}
      <rect x={50} y={35} width={120} height={20} rx={6}
            stroke={sk} fill={fk} strokeWidth={w} />
      <line x1={90}  y1={35} x2={90}  y2={55} stroke={sk} strokeWidth={jw} opacity="0.50" />
      <line x1={128} y1={35} x2={128} y2={55} stroke={sk} strokeWidth={jw} opacity="0.50" />

    </g>
  );
}

/* ── Orbit constants ──────────────────────────────────────────────────── */

const VS       = 700;   // viewBox size
const CX       = 350;
const CY       = 350;
const OUTER_R  = 322;
const INNER_R  = 232;
// Spark point (where fingertips nearly meet)
const LX       = 338;
const LY       = 350;

const OUTER_DOTS = [22, 112, 202, 298];
const INNER_DOTS = [68, 185, 312];

function toXY(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

/* ── Full composition SVG ─────────────────────────────────────────────── */
function HandsComposition() {
  return (
    <svg
      viewBox={`0 0 ${VS} ${VS}`}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>

        {/* Spark glow gradient */}
        <radialGradient id="sparkGrad" cx={LX} cy={LY} r="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="rgba(58,191,138,1.00)" />
          <stop offset="22%"  stopColor="rgba(58,191,138,0.65)" />
          <stop offset="65%"  stopColor="rgba(58,191,138,0.18)" />
          <stop offset="100%" stopColor="rgba(58,191,138,0)"    />
        </radialGradient>

        {/* Outer bloom gradient */}
        <radialGradient id="bloomGrad" cx={LX} cy={LY} r="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="rgba(58,191,138,0.22)" />
          <stop offset="100%" stopColor="rgba(58,191,138,0)"    />
        </radialGradient>

        {/* Hand glow / soft edge */}
        <filter id="handGlow" x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Spark bloom filter */}
        <filter id="bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>

        {/* Sharp spark filter */}
        <filter id="sparkSharp" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

      </defs>

      {/* ── Dashed orbital rings ── */}
      <circle cx={CX} cy={CY} r={OUTER_R}
              stroke="rgba(58,191,138,0.16)" strokeWidth="1"
              strokeDasharray="9 7" fill="none" />
      <circle cx={CX} cy={CY} r={INNER_R}
              stroke="rgba(58,191,138,0.10)" strokeWidth="1"
              strokeDasharray="5 11" fill="none" />

      {/* Outer dot markers */}
      {OUTER_DOTS.map((deg, i) => {
        const { x, y } = toXY(deg, OUTER_R);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="10" stroke="rgba(58,191,138,0.22)" strokeWidth="1" fill="none" />
            <circle cx={x} cy={y} r="4.5" fill="rgba(58,191,138,0.82)"
                    style={{ filter: "drop-shadow(0 0 5px rgba(58,191,138,0.65))" }} />
          </g>
        );
      })}

      {/* Inner dot markers */}
      {INNER_DOTS.map((deg, i) => {
        const { x, y } = toXY(deg, INNER_R);
        return <circle key={i} cx={x} cy={y} r="3" fill="rgba(58,191,138,0.46)" />;
      })}

      {/* Faint axis cross */}
      <line x1="0" y1={CY} x2={VS} y2={CY} stroke="rgba(58,191,138,0.04)" strokeWidth="1" />
      <line x1={CX} y1="0" x2={CX} y2={VS} stroke="rgba(58,191,138,0.04)" strokeWidth="1" />

      {/* ── Outer bloom light at spark centre ── */}
      <circle cx={LX} cy={LY} r="180" fill="url(#bloomGrad)" filter="url(#bloom)" opacity="0.85" />

      {/* ── Hand 1 — upper, pointing left toward spark ── */}
      {/*   Palm at (546,276). Rotate(175°) makes fingers point ≈ (338,308) */}
      <g transform={`translate(546,276) rotate(175)`} filter="url(#handGlow)">
        <RoboHand flip={false} />
      </g>

      {/* ── Hand 2 — lower, mirrored, pointing left toward spark ── */}
      {/*   Palm at (546,424). Rotate(185°)+flip makes fingers point ≈ (338,392) */}
      <g transform={`translate(546,424) rotate(185)`} filter="url(#handGlow)">
        <RoboHand flip={true} />
      </g>

      {/* ── Spark light between the fingertips ── */}
      {/* Blurred bloom layer */}
      <circle cx={LX} cy={LY} r="68" fill="url(#sparkGrad)" filter="url(#bloom)" opacity="0.9" />
      {/* Crisp inner glow */}
      <circle cx={LX} cy={LY} r="40" fill="url(#sparkGrad)" opacity="0.85" />

      {/* 8 spark rays — alternating long/short */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const isMain = i % 2 === 0;
        const r1 = isMain ? 22 : 14;
        const r2 = isMain ? 72 : 46;
        return (
          <line
            key={deg}
            x1={LX + r1 * Math.cos(rad)} y1={LY + r1 * Math.sin(rad)}
            x2={LX + r2 * Math.cos(rad)} y2={LY + r2 * Math.sin(rad)}
            stroke={isMain ? "rgba(58,191,138,0.75)" : "rgba(58,191,138,0.50)"}
            strokeWidth={isMain ? "1.8" : "0.9"}
            style={{ filter: "drop-shadow(0 0 3px rgba(58,191,138,0.65))" }}
          />
        );
      })}

      {/* Core bright dot */}
      <circle cx={LX} cy={LY} r="7.5" fill="rgba(180,255,220,0.95)" filter="url(#sparkSharp)" />
      <circle cx={LX} cy={LY} r="3.5" fill="white" />

      {/* Connecting filament — thin glowing line between the two fingertips */}
      <line x1={LX} y1={310} x2={LX} y2={390}
            stroke="rgba(58,191,138,0.35)" strokeWidth="1"
            strokeDasharray="3 5"
            style={{ filter: "drop-shadow(0 0 4px rgba(58,191,138,0.50))" }} />

    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function AboutHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const hedLine1Ref = useRef<HTMLHeadingElement>(null);
  const hedLine2Ref = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const shapeRef    = useRef<HTMLDivElement>(null);
  const decoRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      /* 1 — hands + orbits fade in */
      tl.fromTo(
        shapeRef.current,
        { autoAlpha: 0, scale: 0.88 },
        { autoAlpha: 1, scale: 1, duration: 1.7, ease: "power2.out" }
      );

      /* 2 — eyebrow */
      tl.fromTo(eyebrowRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=1.0");

      /* 3 — "DON'T" */
      tl.fromTo(hedLine1Ref.current, { autoAlpha: 0, x: -80, skewX: -5 }, { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" }, "-=0.3");

      /* 4 — "forget." */
      tl.fromTo(hedLine2Ref.current, { autoAlpha: 0, x: 80, skewX: 5 }, { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" }, "<0.08");

      /* 5 — sub + body */
      tl.fromTo(subRef.current,  { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.45");
      tl.fromTo(bodyRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.70, ease: "power3.out" }, "-=0.55");

      /* 6 — stats */
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.querySelectorAll("[data-stat]"),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power3.out" },
          "-=0.35"
        );
      }

      /* 7 — CTAs */
      tl.fromTo(ctaRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.25");

      /* 8 — decorative overlay */
      tl.fromTo(decoRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "power2.out" }, "-=0.6");

      /* Spark pulse — breathes in and out */
      gsap.to("[data-spark-pulse]", {
        scale: 1.40,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        transformOrigin: `${LX}px ${LY}px`,
      });

      /* Sparkle stars */
      gsap.to("[data-sparkle]", {
        scale: 1.25,
        duration: "random(2.0, 3.8)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: { amount: 2.2, from: "random" },
      });
    }, sectionRef);

    /* Mouse parallax on composition */
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      gsap.to(shapeRef.current, {
        x: ((e.clientX - cx) / cx) * 22,
        y: ((e.clientY - cy) / cy) * 14,
        duration: 0.9,
        ease: "power2.out",
        overwrite: true,
      });
    };
    const onLeave = () =>
      gsap.to(shapeRef.current, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "100dvh", background: "transparent" }}
    >
      {/* Readability gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 90% at 24% 50%, transparent 0%, rgba(9,9,9,0.26) 44%, rgba(9,9,9,0.74) 100%)",
        }}
      />

      {/* ── Hands + orbit composition — right side ───────────────────── */}
      <div
        ref={shapeRef}
        className="pointer-events-none absolute"
        style={{
          right: "clamp(-160px,-7vw,0px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: VS,
          height: VS,
          visibility: "hidden",
          zIndex: 2,
        }}
      >
        <HandsComposition />
        {/* GSAP spark pulse target */}
        <div data-spark-pulse style={{ position: "absolute", inset: 0 }} />
      </div>

      {/* ── Decorative overlay — sparkles, corners, reticle ──────────── */}
      <div
        ref={decoRef}
        className="pointer-events-none absolute inset-0"
        style={{ visibility: "hidden", zIndex: 3 }}
      >
        <div data-sparkle className="absolute" style={{ right: "34%", top: "12%" }}><Sparkle size={30} opacity={0.90} /></div>
        <div data-sparkle className="absolute" style={{ right: "20%", top: "28%" }}><Sparkle size={17} opacity={0.65} /></div>
        <div data-sparkle className="absolute" style={{ left: "47%", top: "70%" }}><Sparkle size={21} opacity={0.55} /></div>
        <div data-sparkle className="absolute" style={{ right: "44%", top: "60%" }}><Sparkle size={13} opacity={0.40} /></div>

        <div className="absolute" style={{ top: "9%",    left:  "var(--gutter)" }}><Corner pos="tl" /></div>
        <div className="absolute" style={{ top: "9%",    right: "var(--gutter)" }}><Corner pos="tr" /></div>
        <div className="absolute" style={{ bottom: "13%", left:  "var(--gutter)" }}><Corner pos="bl" /></div>
        <div className="absolute" style={{ bottom: "13%", right: "var(--gutter)" }}><Corner pos="br" /></div>

        <div className="absolute" style={{ left: "43%", top: "17%" }}><Crosshair size={14} opacity={0.35} /></div>
        <div className="absolute" style={{ left: "31%", top: "75%" }}><Crosshair size={14} opacity={0.28} /></div>

        <div
          className="absolute left-0 right-0"
          style={{ top: "39%", height: 1, background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.06) 20%, rgba(58,191,138,0.06) 80%, transparent)" }}
        />

        <div className="absolute flex items-center gap-4" style={{ bottom: "8%", left: "var(--gutter)" }}>
          <Reticle size={28} />
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(58,191,138,0.55)", whiteSpace: "nowrap" }}>
            — DON&apos;T FORGET STUDIO
          </span>
          <div style={{ width: 160, height: 1, background: "linear-gradient(90deg, rgba(58,191,138,0.35), transparent)" }} />
          <Crosshair size={11} opacity={0.40} />
        </div>
      </div>

      {/* ── Main text content ────────────────────────────────────────── */}
      <div
        className="wrap relative flex flex-col justify-center"
        style={{ minHeight: "100dvh", paddingTop: "clamp(9rem,16vh,13rem)", paddingBottom: "9rem", zIndex: 5 }}
      >
        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ marginBottom: "2.25rem", visibility: "hidden", letterSpacing: "0.36em" }}
        >
          Est. 2022 — Digital Studio
        </p>

        <div style={{ lineHeight: 1 }}>
          <h1
            ref={hedLine1Ref}
            className="hed"
            style={{ fontSize: "clamp(5rem,10.5vw,11.5rem)", lineHeight: 0.88, letterSpacing: "-0.01em", display: "block", visibility: "hidden" }}
          >
            DON&apos;T
          </h1>
          <h1
            ref={hedLine2Ref}
            className="hed script"
            style={{ fontSize: "clamp(5rem,10.5vw,11.5rem)", lineHeight: 0.92, letterSpacing: "-0.01em", color: "var(--teal)", fontStyle: "italic", display: "block", visibility: "hidden" }}
          >
            forget.
          </h1>
        </div>

        <p
          ref={subRef}
          style={{ marginTop: "2.25rem", fontFamily: "var(--font-mono-next)", fontSize: "0.70rem", letterSpacing: "0.30em", textTransform: "uppercase", color: "var(--teal)", visibility: "hidden" }}
        >
          For brands worth remembering
        </p>

        <p
          ref={bodyRef}
          style={{ maxWidth: 390, marginTop: "1.1rem", fontSize: "0.9rem", lineHeight: 1.9, color: "var(--body)", visibility: "hidden" }}
        >
          A small studio obsessed with craft, speed, and digital work that makes
          people stop scrolling. Not a factory, not a freelancer — something
          better than both.
        </p>

        <div
          ref={statsRef}
          style={{ marginTop: "3rem", display: "flex", gap: "3rem", flexWrap: "wrap", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)", width: "fit-content" }}
        >
          {STATS.map((s) => (
            <div key={s.value} data-stat style={{ visibility: "hidden" }}>
              <span className="hed" style={{ fontSize: "clamp(1.75rem,2.8vw,2.8rem)", lineHeight: 1, color: "var(--teal)" }}>{s.value}</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.47rem", letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--body)", marginTop: "0.45rem" }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ marginTop: "2.5rem", visibility: "hidden" }}>
          <a href="/work" className="btn btn-primary btn-ripple">See our work</a>
          <a href="#contact" className="btn btn-outline">Work with us →</a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 6 }}>
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.47rem", letterSpacing: "0.40em", textTransform: "uppercase", color: "var(--body)", opacity: 0.6 }}>Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}
