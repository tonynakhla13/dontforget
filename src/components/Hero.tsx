"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 2.6 })
        .fromTo(headRef.current,
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "power4.out" }
        )
        .fromTo(subRef.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(ctaRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(metaRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-36 md:pb-28"
    >
      {/* Three.js */}
      <div className="absolute inset-0 -z-20">
        <HeroScene />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,rgba(58,191,138,0.14),transparent_50%),linear-gradient(170deg,rgba(8,8,8,0.2)_0%,rgba(8,8,8,0.7)_50%,rgba(8,8,8,0.98)_100%)]" />

      {/* Hex decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[-80px] top-[-60px] opacity-[0.13]">
        <svg width="560" height="560" viewBox="0 0 100 100" fill="none">
          <polygon points="50,3 91,26 91,74 50,97 9,74 9,26" stroke="#3abf8a" strokeWidth="0.55" fill="none" strokeDasharray="4 8" />
          <polygon points="50,16 81,33 81,67 50,84 19,67 19,33" stroke="#3abf8a" strokeWidth="0.25" fill="none" />
        </svg>
      </div>

      <div className="wrap">
        {/* Main headline */}
        <h1
          ref={headRef}
          className="display-text text-[clamp(3.5rem,9vw,9rem)] leading-[0.88] text-[var(--paper)]"
        >
          We build<br />
          <span className="text-[var(--teal)]">what stays</span><br />
          with people.
        </h1>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p ref={subRef} className="max-w-lg text-[1.05rem] leading-[1.8] text-[var(--paper)] opacity-70 md:text-[1.1rem]">
              Strategy, design, code, and motion for brands that refuse to blur into the background.
            </p>
            <div ref={ctaRef} className="mt-7 flex flex-wrap gap-4">
              <a href="#contact" className="btn btn-primary">Start a project</a>
              <a href="#work" className="btn btn-ghost">View work</a>
            </div>
          </div>

          {/* Meta */}
          <div ref={metaRef} className="flex flex-col gap-2 text-right">
            <span className="eyebrow text-[0.68rem]">Web Development Agency</span>
            <div className="flex gap-5 justify-end font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              <span>GSAP</span>
              <span>Three.js</span>
              <span>Next.js</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 hidden items-center gap-4 md:flex">
          <span className="h-px w-12 bg-[var(--teal)] opacity-50" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[var(--text-muted)]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
