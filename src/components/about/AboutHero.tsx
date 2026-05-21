"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArmillaryShape } from "./shapes";

const STATS = [
  { value: "14+", label: "Projects" },
  { value: "6",   label: "Countries" },
  { value: "24h", label: "Response" },
  { value: "0",   label: "Boring sites" },
];

/* ── Decorative SVGs ─────────────────────────────────────────────────── */

function Sparkle({ size = 24, opacity = 0.85 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <path
        d="M12 0 L13.2 10.8 L24 12 L13.2 13.2 L12 24 L10.8 13.2 L0 12 L10.8 10.8 Z"
        fill={`rgba(58,191,138,${opacity})`}
      />
    </svg>
  );
}

function Crosshair({ size = 14, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <line x1="7" y1="0" x2="7" y2="14" stroke={`rgba(58,191,138,${opacity})`} strokeWidth="1" />
      <line x1="0" y1="7" x2="14" y2="7" stroke={`rgba(58,191,138,${opacity})`} strokeWidth="1" />
    </svg>
  );
}

/* Reticle — target ring + crosshair tick marks */
function Reticle({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle cx="14" cy="14" r="11" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <circle cx="14" cy="14" r="2.5" fill="rgba(58,191,138,0.65)" />
      <line x1="14" y1="0"  x2="14" y2="6"  stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="14" y1="22" x2="14" y2="28" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="0"  y1="14" x2="6"  y2="14" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
      <line x1="22" y1="14" x2="28" y2="14" stroke="rgba(58,191,138,0.65)" strokeWidth="1" />
    </svg>
  );
}

/* ── Corner L-bracket ─────────────────────────────────────────────────── */
function CornerBracket({
  corner,
}: {
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const s = 18;
  const t = 1;
  const c = "rgba(58,191,138,0.45)";
  // lines based on corner
  const paths: Record<string, string> = {
    tl: `M${s} 0 L0 0 L0 ${s}`,
    tr: `M0 0 L${s} 0 L${s} ${s}`,
    bl: `M${s} ${s} L0 ${s} L0 0`,
    br: `M0 ${s} L${s} ${s} L${s} 0`,
  };
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" aria-hidden>
      <path d={paths[corner]} stroke={c} strokeWidth={t} />
    </svg>
  );
}

export default function AboutHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const hedLine1Ref = useRef<HTMLHeadingElement>(null);
  const hedLine2Ref = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const shapeRef    = useRef<HTMLDivElement>(null);
  const decoRef     = useRef<HTMLDivElement>(null);   // sparkles + rings layer

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // 1. Decorative layer fades in first (orbital rings, sparkles, crosshairs)
      tl.fromTo(decoRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "power2.out" });

      // 2. Eyebrow
      tl.fromTo(eyebrowRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6");

      // 3. "DON'T" slides from left
      tl.fromTo(
        hedLine1Ref.current,
        { autoAlpha: 0, x: -80, skewX: -6 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "-=0.3"
      );

      // 4. "forget." from right
      tl.fromTo(
        hedLine2Ref.current,
        { autoAlpha: 0, x: 80, skewX: 6 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "<0.08"
      );

      // 5. Subline
      tl.fromTo(subRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");

      // 6. Stats
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.querySelectorAll("[data-stat]"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power3.out" },
          "-=0.35"
        );
      }

      // 7. CTAs
      tl.fromTo(ctaRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

      // 8. ArmillaryShape
      tl.fromTo(
        shapeRef.current,
        { autoAlpha: 0, scale: 0.75, rotateZ: -10 },
        { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.6, ease: "power3.out" },
        "<-1.0"
      );

      // Slow idle rotation on orbital rings
      gsap.to("[data-orbital]", {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
      gsap.to("[data-orbital-2]", {
        rotation: -360,
        duration: 55,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Sparkles gentle scale pulse
      gsap.to("[data-sparkle]", {
        scale: 1.18,
        duration: "random(1.8, 3.2)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: { amount: 1.5, from: "random" },
      });
    }, sectionRef);

    // Mouse parallax on shape
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      gsap.to(shapeRef.current, {
        x: ((e.clientX - cx) / cx) * 28,
        y: ((e.clientY - cy) / cy) * 18,
        duration: 0.9,
        ease: "power2.out",
        overwrite: true,
      });
    };
    const onLeave = () => gsap.to(shapeRef.current, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
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
      {/* Dark overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 75% at 62% 50%, transparent 0%, rgba(9,9,9,0.40) 55%, rgba(9,9,9,0.78) 100%)",
        }}
      />

      {/* ── Decorative layer ─────────────────────────────────────────── */}
      <div ref={decoRef} className="pointer-events-none absolute inset-0" style={{ visibility: "hidden" }}>

        {/* Orbital ring 1 — large, right-center */}
        <div
          data-orbital
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            right: "-12%",
            top: "50%",
            transform: "translateY(-50%)",
            border: "1px dashed rgba(58,191,138,0.22)",
          }}
        />

        {/* Orbital ring 2 — smaller, overlapping */}
        <div
          data-orbital-2
          className="absolute rounded-full"
          style={{
            width: 480,
            height: 480,
            right: "2%",
            top: "50%",
            transform: "translateY(-50%)",
            border: "1px dashed rgba(58,191,138,0.14)",
          }}
        />

        {/* Orbital dots — positioned on ring 1 path */}
        {[
          { right: "7%",  top: "20%" },
          { right: "38%", top: "8%"  },
          { right: "48%", top: "82%" },
          { right: "4%",  top: "68%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              ...pos,
              width: 6,
              height: 6,
              background: "rgba(58,191,138,0.75)",
              boxShadow: "0 0 8px rgba(58,191,138,0.55)",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}

        {/* Sparkle stars */}
        <div data-sparkle className="absolute" style={{ right: "36%", top: "12%" }}>
          <Sparkle size={28} opacity={0.90} />
        </div>
        <div data-sparkle className="absolute" style={{ right: "22%", top: "28%" }}>
          <Sparkle size={16} opacity={0.65} />
        </div>
        <div data-sparkle className="absolute" style={{ left: "46%", top: "72%" }}>
          <Sparkle size={20} opacity={0.55} />
        </div>
        <div data-sparkle className="absolute" style={{ right: "44%", top: "62%" }}>
          <Sparkle size={12} opacity={0.45} />
        </div>

        {/* Corner bracket marks */}
        <div className="absolute" style={{ top: "10%", left: "var(--gutter)" }}>
          <CornerBracket corner="tl" />
        </div>
        <div className="absolute" style={{ top: "10%", right: "var(--gutter)" }}>
          <CornerBracket corner="tr" />
        </div>
        <div className="absolute" style={{ bottom: "14%", left: "var(--gutter)" }}>
          <CornerBracket corner="bl" />
        </div>
        <div className="absolute" style={{ bottom: "14%", right: "var(--gutter)" }}>
          <CornerBracket corner="br" />
        </div>

        {/* Crosshair marks — scattered */}
        <div className="absolute" style={{ left: "44%", top: "18%" }}>
          <Crosshair size={14} opacity={0.38} />
        </div>
        <div className="absolute" style={{ left: "30%", top: "76%" }}>
          <Crosshair size={14} opacity={0.28} />
        </div>

        {/* Thin horizontal scan line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "38%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.07) 25%, rgba(58,191,138,0.07) 75%, transparent)",
          }}
        />

        {/* Bottom reticle strip */}
        <div
          className="absolute"
          style={{
            bottom: "8%",
            left: "var(--gutter)",
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
          }}
        >
          <Reticle size={26} />
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
              flex: 1,
              maxWidth: 180,
              height: 1,
              background: "linear-gradient(90deg, rgba(58,191,138,0.35), transparent)",
            }}
          />
          <Crosshair size={12} opacity={0.45} />
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────────── */}

      {/* ArmillaryShape — right side */}
      <div
        ref={shapeRef}
        className="absolute"
        style={{
          right: "clamp(-180px,-8vw,-40px)",
          top: "50%",
          transform: "translateY(-50%)",
          visibility: "hidden",
          zIndex: 4,
        }}
      >
        <ArmillaryShape />
      </div>

      {/* Main content */}
      <div
        className="wrap relative z-10 flex flex-col justify-center"
        style={{ minHeight: "100dvh", paddingTop: "clamp(9rem,16vh,13rem)", paddingBottom: "8rem" }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ marginBottom: "2.5rem", visibility: "hidden", letterSpacing: "0.36em" }}
        >
          Est. 2022 — Digital Studio
        </p>

        {/* Massive heading */}
        <div style={{ overflow: "hidden" }}>
          <h1
            ref={hedLine1Ref}
            className="hed"
            style={{
              fontSize: "clamp(5.5rem,11vw,12rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              display: "block",
              visibility: "hidden",
            }}
          >
            DON&apos;T
          </h1>
        </div>
        <div style={{ overflow: "hidden" }}>
          <h1
            ref={hedLine2Ref}
            className="hed script"
            style={{
              fontSize: "clamp(5.5rem,11vw,12rem)",
              lineHeight: 0.88,
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

        {/* Sub-headline — mono teal accent (like "FOR AGENCIES" in video) */}
        <p
          ref={subRef}
          style={{
            marginTop: "2rem",
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.72rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--teal)",
            visibility: "hidden",
          }}
        >
          For brands worth remembering
        </p>

        {/* Body text */}
        <p
          style={{
            maxWidth: 400,
            marginTop: "1.25rem",
            fontSize: "0.9rem",
            lineHeight: 1.9,
            color: "var(--body)",
          }}
        >
          A small studio obsessed with craft, speed, and digital work that makes
          people stop scrolling. Not a factory, not a freelancer — something better
          than both.
        </p>

        {/* Stats row */}
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
                style={{ fontSize: "clamp(1.8rem,3vw,3rem)", lineHeight: 1, color: "var(--teal)" }}
              >
                {s.value}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.48rem",
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "var(--body)",
                  marginTop: "0.5rem",
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span
          style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.48rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--body)",
          }}
        >
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}
