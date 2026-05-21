"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArmillaryShape } from "./shapes";

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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M12 0L13.4 10.6L24 12L13.4 13.4L12 24L10.6 13.4L0 12L10.6 10.6Z"
        fill={`rgba(58,191,138,${opacity})`}
      />
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

/* ── Orbit + Shape composition (SVG rings — no rotating divs) ─────────── */

const OUTER_R  = 338;
const INNER_R  = 245;
const CX       = 360;
const CY       = 360;
const VIEWSIZE = 720;

const OUTER_DOTS = [28, 118, 210, 305];
const INNER_DOTS = [72, 188, 308];

function toXY(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function OrbitSVG() {
  return (
    <svg
      data-orbit-svg
      viewBox={`0 0 ${VIEWSIZE} ${VIEWSIZE}`}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      {/* Outer dashed ring */}
      <circle
        cx={CX} cy={CY} r={OUTER_R}
        stroke="rgba(58,191,138,0.18)" strokeWidth="1"
        strokeDasharray="9 7" fill="none"
      />
      {/* Inner dashed ring */}
      <circle
        cx={CX} cy={CY} r={INNER_R}
        stroke="rgba(58,191,138,0.11)" strokeWidth="1"
        strokeDasharray="5 11" fill="none"
      />

      {/* Outer dot markers */}
      {OUTER_DOTS.map((deg, i) => {
        const { x, y } = toXY(deg, OUTER_R);
        return (
          <g key={`od${i}`}>
            <circle cx={x} cy={y} r="11" stroke="rgba(58,191,138,0.22)" strokeWidth="1" fill="none" />
            <circle cx={x} cy={y} r="5"  fill="rgba(58,191,138,0.85)"
                    style={{ filter: "drop-shadow(0 0 5px rgba(58,191,138,0.70))" }} />
          </g>
        );
      })}

      {/* Inner dot markers */}
      {INNER_DOTS.map((deg, i) => {
        const { x, y } = toXY(deg, INNER_R);
        return <circle key={`id${i}`} cx={x} cy={y} r="3.5" fill="rgba(58,191,138,0.50)" />;
      })}

      {/* Faint axis lines */}
      <line x1="0" y1={CY} x2={VIEWSIZE} y2={CY} stroke="rgba(58,191,138,0.04)" strokeWidth="1" />
      <line x1={CX} y1="0" x2={CX} y2={VIEWSIZE} stroke="rgba(58,191,138,0.04)" strokeWidth="1" />
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
  const orbitWrap   = useRef<HTMLDivElement>(null);
  const decoRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      /* 1 — orbit rings + shape fade in together */
      tl.fromTo(
        orbitWrap.current,
        { autoAlpha: 0, scale: 0.90 },
        { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" }
      );
      tl.fromTo(
        shapeRef.current,
        { autoAlpha: 0, scale: 0.78, rotateZ: -10 },
        { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.8, ease: "power3.out" },
        "<"
      );

      /* 2 — eyebrow */
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.9"
      );

      /* 3 — "DON'T" */
      tl.fromTo(
        hedLine1Ref.current,
        { autoAlpha: 0, x: -80, skewX: -5 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "-=0.3"
      );

      /* 4 — "forget." */
      tl.fromTo(
        hedLine2Ref.current,
        { autoAlpha: 0, x: 80, skewX: 5 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "<0.08"
      );

      /* 5 — sub-headline + body */
      tl.fromTo(subRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.45");
      tl.fromTo(bodyRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.55");

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
      tl.fromTo(
        ctaRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.25"
      );

      /* 8 — decorative overlay (sparkles, corners, etc.) */
      tl.fromTo(
        decoRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.9, ease: "power2.out" },
        "-=0.6"
      );

      /* Sparkle breathing pulse */
      gsap.to("[data-sparkle]", {
        scale: 1.25,
        duration: "random(2.0, 3.8)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: { amount: 2.2, from: "random" },
      });

      /* Very slow orbit rotation (120 s — barely perceptible drift) */
      gsap.to("[data-orbit-svg]", {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: "none",
        transformOrigin: `${CX}px ${CY}px`,
      });
    }, sectionRef);

    /* Mouse parallax on shape */
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      gsap.to(shapeRef.current, {
        x: ((e.clientX - cx) / cx) * 26,
        y: ((e.clientY - cy) / cy) * 16,
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
      {/* Readability gradient — leaves right side transparent so shape pops */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 25% 50%, transparent 0%, rgba(9,9,9,0.28) 45%, rgba(9,9,9,0.72) 100%)",
        }}
      />

      {/* ── Orbit + ArmillaryShape — right side ─────────────────────── */}
      <div
        ref={orbitWrap}
        className="pointer-events-none absolute"
        style={{
          right: "clamp(-240px,-11vw,-30px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: VIEWSIZE,
          height: VIEWSIZE,
          visibility: "hidden",
          zIndex: 2,
        }}
      >
        {/* SVG orbit rings — properly centered on shape */}
        <OrbitSVG />

        {/* ArmillaryShape — centered in the orbit container */}
        <div
          ref={shapeRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            visibility: "hidden",
          }}
        >
          <ArmillaryShape />
        </div>
      </div>

      {/* ── Decorative overlay (sparkles, corners, reticle, scan line) ── */}
      <div
        ref={decoRef}
        className="pointer-events-none absolute inset-0"
        style={{ visibility: "hidden", zIndex: 3 }}
      >
        {/* Sparkles */}
        <div data-sparkle className="absolute" style={{ right: "35%", top: "13%" }}>
          <Sparkle size={30} opacity={0.90} />
        </div>
        <div data-sparkle className="absolute" style={{ right: "21%", top: "30%" }}>
          <Sparkle size={17} opacity={0.65} />
        </div>
        <div data-sparkle className="absolute" style={{ left: "47%", top: "70%" }}>
          <Sparkle size={21} opacity={0.55} />
        </div>
        <div data-sparkle className="absolute" style={{ right: "43%", top: "60%" }}>
          <Sparkle size={13} opacity={0.40} />
        </div>

        {/* Corner brackets */}
        <div className="absolute" style={{ top: "9%",  left:  "var(--gutter)" }}><Corner pos="tl" /></div>
        <div className="absolute" style={{ top: "9%",  right: "var(--gutter)" }}><Corner pos="tr" /></div>
        <div className="absolute" style={{ bottom: "13%", left:  "var(--gutter)" }}><Corner pos="bl" /></div>
        <div className="absolute" style={{ bottom: "13%", right: "var(--gutter)" }}><Corner pos="br" /></div>

        {/* Scattered crosshairs */}
        <div className="absolute" style={{ left: "43%", top: "17%" }}>
          <Crosshair size={14} opacity={0.35} />
        </div>
        <div className="absolute" style={{ left: "31%", top: "75%" }}>
          <Crosshair size={14} opacity={0.28} />
        </div>

        {/* Thin horizontal scan line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "39%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(58,191,138,0.07) 20%, rgba(58,191,138,0.07) 80%, transparent)",
          }}
        />

        {/* Bottom reticle strip */}
        <div
          className="absolute flex items-center gap-4"
          style={{ bottom: "8%", left: "var(--gutter)" }}
        >
          <Reticle size={28} />
          <span
            style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.46rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(58,191,138,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            — DON&apos;T FORGET STUDIO
          </span>
          <div
            style={{
              width: 160,
              height: 1,
              background: "linear-gradient(90deg, rgba(58,191,138,0.35), transparent)",
            }}
          />
          <Crosshair size={11} opacity={0.40} />
        </div>
      </div>

      {/* ── Main text content ────────────────────────────────────────── */}
      <div
        className="wrap relative flex flex-col justify-center"
        style={{
          minHeight: "100dvh",
          paddingTop: "clamp(9rem,16vh,13rem)",
          paddingBottom: "9rem",
          zIndex: 5,
        }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ marginBottom: "2.25rem", visibility: "hidden", letterSpacing: "0.36em" }}
        >
          Est. 2022 — Digital Studio
        </p>

        {/* Heading — two separate lines for split animation */}
        <div style={{ lineHeight: 1 }}>
          <h1
            ref={hedLine1Ref}
            className="hed"
            style={{
              fontSize: "clamp(5rem,10.5vw,11.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              display: "block",
              visibility: "hidden",
            }}
          >
            DON&apos;T
          </h1>
          <h1
            ref={hedLine2Ref}
            className="hed script"
            style={{
              fontSize: "clamp(5rem,10.5vw,11.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              color: "var(--teal)",
              fontStyle: "italic",
              display: "block",
              visibility: "hidden",
            }}
          >
            forget.
          </h1>
        </div>

        {/* Mono teal sub-headline */}
        <p
          ref={subRef}
          style={{
            marginTop: "2.25rem",
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.70rem",
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: "var(--teal)",
            visibility: "hidden",
          }}
        >
          For brands worth remembering
        </p>

        {/* Body */}
        <p
          ref={bodyRef}
          style={{
            maxWidth: 390,
            marginTop: "1.1rem",
            fontSize: "0.9rem",
            lineHeight: 1.9,
            color: "var(--body)",
            visibility: "hidden",
          }}
        >
          A small studio obsessed with craft, speed, and digital work that makes
          people stop scrolling. Not a factory, not a freelancer — something
          better than both.
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            marginTop: "3rem",
            display: "flex",
            gap: "3rem",
            flexWrap: "wrap",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            width: "fit-content",
          }}
        >
          {STATS.map((s) => (
            <div key={s.value} data-stat style={{ visibility: "hidden" }}>
              <span
                className="hed"
                style={{ fontSize: "clamp(1.75rem,2.8vw,2.8rem)", lineHeight: 1, color: "var(--teal)" }}
              >
                {s.value}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.47rem",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "var(--body)",
                  marginTop: "0.45rem",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-wrap gap-4"
          style={{ marginTop: "2.5rem", visibility: "hidden" }}
        >
          <a href="/work" className="btn btn-primary btn-ripple">See our work</a>
          <a href="#contact" className="btn btn-outline">Work with us →</a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 6 }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.47rem",
            letterSpacing: "0.40em",
            textTransform: "uppercase",
            color: "var(--body)",
            opacity: 0.6,
          }}
        >
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}
