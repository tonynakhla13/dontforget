"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STATS = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries reached" },
  { value: "24h", label: "Avg. response" },
  { value: "0",   label: "Boring sites made" },
];

function GemShape() {
  const rings = [
    { transform: "rotateX(72deg) rotateZ(0deg)",   opacity: 0.55 },
    { transform: "rotateX(72deg) rotateZ(60deg)",  opacity: 0.45 },
    { transform: "rotateX(72deg) rotateZ(120deg)", opacity: 0.38 },
    { transform: "rotateX(0deg)  rotateZ(0deg)",   opacity: 0.60 },
    { transform: "rotateX(0deg)  rotateZ(45deg)",  opacity: 0.40 },
    { transform: "rotateX(0deg)  rotateZ(90deg)",  opacity: 0.40 },
    { transform: "rotateX(36deg) rotateZ(30deg)",  opacity: 0.30 },
    { transform: "rotateX(36deg) rotateZ(90deg)",  opacity: 0.28 },
  ];

  return (
    <>
      <style>{`
        @keyframes gem-spin {
          from { transform: rotateY(0deg) rotateX(8deg); }
          to   { transform: rotateY(360deg) rotateX(8deg); }
        }
      `}</style>
      <div className="pointer-events-none select-none" style={{ width: 460, height: 460, perspective: "900px" }}>
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", animation: "gem-spin 28s linear infinite" }}>
          {rings.map((r, i) => (
            <div key={i} className="absolute inset-0 rounded-full" style={{ border: `1px solid rgba(58,191,138,${r.opacity})`, transform: r.transform, transformStyle: "preserve-3d" }} />
          ))}
          <div className="absolute rounded-full" style={{ inset: "22%", background: "radial-gradient(circle at 40% 38%, rgba(58,191,138,0.18) 0%, transparent 68%)" }} />
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 80px rgba(58,191,138,0.16), inset 0 0 50px rgba(58,191,138,0.05)", border: "1px solid rgba(58,191,138,0.22)" }} />
        </div>
      </div>
    </>
  );
}

export default function AboutHero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const gemRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" })
      .fromTo(
        [eyebrowRef.current, headRef.current, bodyRef.current, ctaRef.current],
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(gemRef.current,
        { autoAlpha: 0, scale: 0.72, rotateZ: -10 },
        { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.3, ease: "power3.out" },
        "<0.2"
      );

    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll("[data-stat]");
      tl.fromTo(items, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.65, ease: "power3.out" }, "-=0.6");
    }
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden" style={{ background: "transparent" }}>
      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 0%, rgba(9,9,9,0.28) 65%, rgba(9,9,9,0.62) 100%)" }} />

      {/* Horizontal rule */}
      <div ref={lineRef} className="absolute left-0 right-0 h-px origin-left" style={{ top: "20%", background: "linear-gradient(90deg, var(--teal) 0%, rgba(58,191,138,0.3) 55%, transparent 100%)", transform: "scaleX(0)", transformOrigin: "left" }} />

      {/* Main grid */}
      <div className="relative z-10 wrap grid flex-1 items-center gap-16 lg:grid-cols-2 pt-32 pb-10">
        <div>
          <p ref={eyebrowRef} className="eyebrow mb-8" style={{ visibility: "hidden" }}>About us</p>
          <h1 ref={headRef} className="hed text-[clamp(3.4rem,6vw,5.8rem)] leading-[0.94]" style={{ visibility: "hidden" }}>
            We don&apos;t just<br />
            build. We make<br />
            things people{" "}
            <span className="script text-[1.04em]">remember.</span>
          </h1>
          <p ref={bodyRef} className="mt-9 max-w-[460px] text-[0.9375rem] leading-[1.9] text-[var(--body)]" style={{ visibility: "hidden" }}>
            DON&apos;T FORGET is a small studio obsessed with craft, speed, and digital
            work that makes people stop scrolling. Not a factory, not a freelancer —
            something better than both.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <a href="/work" className="btn btn-primary btn-ripple">See our work</a>
            <a href="#contact" className="btn btn-outline">Work with us →</a>
          </div>
        </div>

        <div ref={gemRef} className="flex items-center justify-center" style={{ visibility: "hidden" }}>
          <GemShape />
        </div>
      </div>

      {/* Stat strip */}
      <div ref={statsRef} className="relative z-10 wrap grid grid-cols-2 md:grid-cols-4 mb-10" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {STATS.map((s, i) => (
          <div key={s.value} data-stat className="flex flex-col items-center gap-2 py-8 px-4" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", visibility: "hidden" }}>
            <span className="hed text-[clamp(2.4rem,4vw,3.8rem)] leading-none text-[var(--teal)]">{s.value}</span>
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.36em] text-[var(--body)] text-center">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}
