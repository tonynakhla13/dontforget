"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArmillaryShape } from "./shapes";

const STATS = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries" },
  { value: "24h", label: "Response" },
  { value: "0",   label: "Boring sites" },
];

const ANNOTATIONS = [
  { text: "+3 countries this year", left: "62%",  top: "14%" },
  { text: "14+ projects shipped",   left: "68%",  top: "64%" },
  { text: "Zero boring sites",      left: "52%",  top: "58%" },
  { text: "24 h avg. response",     left: "74%",  top: "36%" },
  { text: "Est. 2022",              left: "60%",  top: "80%" },
];

const SCANLINES = ["20%", "46%", "72%"] as const;

export default function AboutHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const hedLine1Ref = useRef<HTMLHeadingElement>(null);
  const hedLine2Ref = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const shapeRef    = useRef<HTMLDivElement>(null);
  const scanRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // 1. Scanline rules draw across
      tl.fromTo(
        scanRefs.current.filter(Boolean),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.12, ease: "expo.out", transformOrigin: "left" }
      );

      // 2. Eyebrow
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // 3. "DON'T" slides from left
      tl.fromTo(
        hedLine1Ref.current,
        { autoAlpha: 0, x: -70, skewX: -5 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "-=0.3"
      );

      // 4. "forget." slides from right
      tl.fromTo(
        hedLine2Ref.current,
        { autoAlpha: 0, x: 70, skewX: 5 },
        { autoAlpha: 1, x: 0, skewX: 0, duration: 1.1, ease: "expo.out" },
        "<0.08"
      );

      // 5. Body text
      tl.fromTo(
        subRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out" },
        "-=0.55"
      );

      // 6. Stats stagger
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll("[data-stat]");
        tl.fromTo(
          statItems,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.65, ease: "power3.out" },
          "-=0.4"
        );
      }

      // 7. CTAs
      tl.fromTo(
        ctaRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
        "-=0.35"
      );

      // 8. ArmillaryShape — scale+rotate in, overlapping the heading reveal
      tl.fromTo(
        shapeRef.current,
        { autoAlpha: 0, scale: 0.78, rotateZ: -8 },
        { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.5, ease: "power3.out" },
        "<-0.9"
      );

      // 9. Floating annotations spring in
      tl.fromTo(
        "[data-annotation]",
        { autoAlpha: 0, scale: 0.82 },
        { autoAlpha: 1, scale: 1, stagger: 0.10, duration: 0.55, ease: "back.out(1.7)" },
        "-=0.6"
      );

      // 10. After reveal, idle float on annotations
      tl.then(() => {
        gsap.to("[data-annotation]", {
          y: "random(-9, 9)",
          duration: "random(2.5, 4.2)",
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { amount: 1.6, from: "random" },
        });
      });
    }, sectionRef);

    // Mouse parallax on shape
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      gsap.to(shapeRef.current, {
        x: dx * 28,
        y: dy * 18,
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
      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 48%, transparent 0%, rgba(9,9,9,0.30) 55%, rgba(9,9,9,0.72) 100%)",
        }}
      />

      {/* Scanline rules */}
      {SCANLINES.map((top, i) => (
        <div
          key={i}
          ref={el => { scanRefs.current[i] = el; }}
          className="absolute left-0 right-0"
          style={{
            top,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent)",
            transform: "scaleX(0)",
            transformOrigin: "left",
          }}
        />
      ))}

      {/* ArmillaryShape — absolutely placed right, overflows edge */}
      <div
        ref={shapeRef}
        className="absolute"
        style={{
          right: "clamp(-180px, -8vw, -60px)",
          top: "50%",
          transform: "translateY(-52%)",
          visibility: "hidden",
          zIndex: 5,
        }}
      >
        <ArmillaryShape />
      </div>

      {/* Floating pill annotations */}
      {ANNOTATIONS.map((a, i) => (
        <div
          key={i}
          data-annotation
          className="absolute"
          style={{
            left: a.left,
            top: a.top,
            background: "rgba(9,9,9,0.80)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(58,191,138,0.30)",
            borderRadius: 999,
            padding: "0.48rem 1.15rem",
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.48rem",
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: "var(--teal)",
            whiteSpace: "nowrap",
            zIndex: 6,
            visibility: "hidden",
          }}
        >
          {a.text}
        </div>
      ))}

      {/* Main content column */}
      <div
        className="wrap relative z-10 flex flex-col justify-center"
        style={{ minHeight: "100dvh", paddingTop: "clamp(9rem,16vh,14rem)", paddingBottom: "6rem" }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ marginBottom: "2.5rem", visibility: "hidden" }}
        >
          Est. 2022 — Digital Studio
        </p>

        {/* Massive split heading */}
        <div>
          <h1
            ref={hedLine1Ref}
            className="hed"
            style={{
              fontSize: "clamp(5rem,10vw,11rem)",
              lineHeight: 0.90,
              letterSpacing: "0.01em",
              visibility: "hidden",
            }}
          >
            DON&apos;T
          </h1>
          <h1
            ref={hedLine2Ref}
            className="hed script"
            style={{
              fontSize: "clamp(5rem,10vw,11rem)",
              lineHeight: 0.90,
              letterSpacing: "0.01em",
              color: "var(--teal)",
              fontStyle: "italic",
              visibility: "hidden",
            }}
          >
            forget.
          </h1>
        </div>

        {/* Body text */}
        <p
          ref={subRef}
          style={{
            maxWidth: 420,
            marginTop: "3rem",
            fontSize: "0.9375rem",
            lineHeight: 1.9,
            color: "var(--body)",
            visibility: "hidden",
          }}
        >
          A small studio obsessed with craft, speed, and digital work that makes
          people stop scrolling. Not a factory, not a freelancer — something better
          than both.
        </p>

        {/* Inline stats */}
        <div
          ref={statsRef}
          style={{ marginTop: "3.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}
        >
          {STATS.map((s) => (
            <div
              key={s.value}
              data-stat
              style={{ visibility: "hidden" }}
            >
              <span
                className="hed"
                style={{ fontSize: "clamp(2rem,3.6vw,3.4rem)", lineHeight: 1, color: "var(--teal)" }}
              >
                {s.value}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "var(--body)",
                  marginTop: "0.55rem",
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
          style={{ marginTop: "3rem", visibility: "hidden" }}
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
            fontSize: "0.5rem",
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
