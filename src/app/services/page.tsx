"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Loader           from "@/components/Loader";
import SmoothScroll     from "@/components/SmoothScroll";
import AltParticleLayer from "@/components/AltParticleLayer";
import Navbar           from "@/components/Navbar";
import AmbientGlow      from "@/components/AmbientGlow";
import Services         from "@/components/Services";

// ── CSS-only rotating lattice sphere ─────────────────────────────────
function LatticeSphere() {
  // More rings + tighter angles than the AboutHero gem → denser lattice look
  const rings = [
    { transform: "rotateX(0deg)",                  opacity: 0.60 },
    { transform: "rotateX(36deg)",                 opacity: 0.52 },
    { transform: "rotateX(72deg)",                 opacity: 0.46 },
    { transform: "rotateX(108deg)",                opacity: 0.40 },
    { transform: "rotateX(144deg)",                opacity: 0.36 },
    { transform: "rotateY(0deg)",                  opacity: 0.55 },
    { transform: "rotateY(60deg)",                 opacity: 0.44 },
    { transform: "rotateY(120deg)",                opacity: 0.36 },
    { transform: "rotateX(54deg)  rotateZ(45deg)", opacity: 0.30 },
    { transform: "rotateX(18deg)  rotateY(72deg)", opacity: 0.24 },
    { transform: "rotateX(90deg)  rotateZ(30deg)", opacity: 0.20 },
  ];

  return (
    <>
      <style>{`
        @keyframes lattice-spin {
          from { transform: rotateY(0deg)   rotateX(14deg) rotateZ(4deg); }
          to   { transform: rotateY(360deg) rotateX(14deg) rotateZ(4deg); }
        }
      `}</style>

      <div
        className="pointer-events-none select-none"
        style={{ width: 460, height: 460, perspective: "900px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d", animation: "lattice-spin 32s linear infinite" }}
        >
          {rings.map((r, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid rgba(58,191,138,${r.opacity})`,
                transform: r.transform,
                transformStyle: "preserve-3d",
              }}
            />
          ))}
          {/* Inner highlight */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "20%",
              background: "radial-gradient(circle at 42% 36%, rgba(58,191,138,0.15) 0%, transparent 65%)",
              transform: "translateZ(0)",
            }}
          />
          {/* Outer rim glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 70px rgba(58,191,138,0.12), inset 0 0 50px rgba(58,191,138,0.04)",
              border: "1px solid rgba(58,191,138,0.18)",
            }}
          />
        </div>
      </div>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function ServicesHero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const sphereRef  = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "expo.out" })
      .fromTo(
        [eyebrowRef.current, headRef.current, bodyRef.current, ctaRef.current],
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, stagger: 0.11, duration: 0.9, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        sphereRef.current,
        { autoAlpha: 0, scale: 0.72, rotateZ: -12 },
        { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.2, ease: "power3.out" },
        "<0.2"
      );
  }, []);

  return (
    <section
      className="relative flex min-h-[88vh] items-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 68% at 50% 50%, transparent 0%, rgba(9,9,9,0.32) 68%, rgba(9,9,9,0.65) 100%)",
        }}
      />

      {/* Horizontal rule */}
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px origin-left bg-gradient-to-r from-[var(--teal)] via-[rgba(58,191,138,0.35)] to-transparent"
        style={{ top: "22%", transform: "scaleX(0)", transformOrigin: "left" }}
      />

      <div className="relative z-10 wrap grid items-center gap-14 lg:grid-cols-2 pt-28 pb-20">
        {/* Left — text */}
        <div>
          <p ref={eyebrowRef} className="eyebrow mb-8" style={{ visibility: "hidden" }}>
            What we build
          </p>
          <h1
            ref={headRef}
            className="hed text-[4.8rem] leading-[0.94]"
            style={{ visibility: "hidden" }}
          >
            Full-stack<br />
            execution.<br />
            <span className="text-[var(--teal)]">Every layer.</span>
          </h1>
          <p
            ref={bodyRef}
            className="mt-9 max-w-[460px] text-[0.9375rem] leading-[1.9] text-[var(--body)]"
            style={{ visibility: "hidden" }}
          >
            Web, mobile, e-commerce, SEO, design, CRM — whatever your product needs, we
            build it with obsessive craft and zero hand-waving. Scroll to see every service.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <a href="/#contact" className="btn btn-primary btn-ripple">
              Start a project
            </a>
            <a href="/#work" className="btn btn-outline">
              See our work →
            </a>
          </div>
        </div>

        {/* Right — lattice sphere */}
        <div
          ref={sphereRef}
          className="flex items-center justify-center"
          style={{ visibility: "hidden" }}
        >
          <LatticeSphere />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}

// ── CTA section after services scroll ────────────────────────────────
function ServicesCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", toggleActions: "play none none none" },
      }
    );
  }, []);

  return (
    <section
      className="relative section-py border-t border-[var(--border)] text-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Faint glow behind */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(58,191,138,0.05) 0%, transparent 70%)" }}
      />

      <div ref={ref} className="relative z-10 wrap" style={{ visibility: "hidden" }}>
        <p className="eyebrow mb-6">Ready to build?</p>
        <h2 className="hed text-[4rem] mb-8">
          Let&apos;s make something<br />
          <span className="text-[var(--teal)]">people won&apos;t forget.</span>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-[0.9375rem] leading-[1.9] text-[var(--body)]">
          We take on a small number of projects at a time — that&apos;s how we keep the craft sharp.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/#contact" className="btn btn-primary btn-ripple">
            Start the conversation →
          </a>
          <a href="/work" className="btn btn-outline">
            See selected work
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <AltParticleLayer mode="helix" />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ServicesHero />
        <Services />
        <ServicesCTA />
      </main>
    </>
  );
}
