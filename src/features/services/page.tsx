"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Loader           from "@/components/Loader";
import SmoothScroll     from "@/components/SmoothScroll";
import Navbar           from "@/components/Navbar";
import AmbientGlow      from "@/components/AmbientGlow";
import ServicesOverview from "@/components/services/ServicesOverview";
import ServicesPipeHologram from "@/components/services/ServicesPipeHologram";

function ServicesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 54% at 70% 46%, rgba(58,191,138,0.07), transparent 58%), linear-gradient(180deg, rgba(9,9,9,0.96) 0%, rgba(9,9,9,1) 48%, rgba(9,9,9,0.96) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0 96%, rgba(58,191,138,0.14) 96% 96.2%, transparent 96.2%), linear-gradient(180deg, transparent 0 96%, rgba(58,191,138,0.1) 96% 96.2%, transparent 96.2%)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 58% at 68% 45%, black, transparent 72%)",
        }}
      />
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function ServicesHero() {
  const headRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const shapeRef   = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" })
      .fromTo(
        [headRef.current, bodyRef.current, ctaRef.current, statsRef.current],
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.95, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        shapeRef.current,
        { autoAlpha: 0, scale: 1.08, x: 70 },
        { autoAlpha: 1, scale: 1, x: 0, duration: 1.35, ease: "power3.out" },
        "<0.05"
      );
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div ref={shapeRef} className="absolute inset-0 z-0" style={{ visibility: "hidden" }}>
        <ServicesPipeHologram />
      </div>

      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px origin-left bg-gradient-to-r from-[var(--teal)] via-[rgba(58,191,138,0.35)] to-transparent"
        style={{ top: "22%", transform: "scaleX(0)" }}
      />

      <div className="relative z-10 wrap flex items-center pt-32 pb-20">
        <div className="max-w-[760px]">
          <h1
            ref={headRef}
            className="hed text-[clamp(4.2rem,10vw,9.6rem)] leading-[0.84] text-[#F8F5EE]"
            style={{ visibility: "hidden" }}
          >
            Our<br />
            <span className="text-[var(--teal)]">Services</span>
          </h1>
          <p
            ref={bodyRef}
            className="mt-8 max-w-[520px] text-[clamp(0.92rem,1.3vw,1.04rem)] leading-[1.9] text-[var(--body)]"
            style={{ visibility: "hidden" }}
          >
            Strategy, design, code, launch, and growth systems for brands that need more
            than a nice-looking page. We build the web stack, product flows, and operations
            behind work people remember.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <Link href="/#contact" className="btn-glass">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">Start a project</span>
            </Link>
            <Link href="/#work" className="btn-glass-ghost">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">View work →</span>
            </Link>
          </div>

          <div
            ref={statsRef}
            className="mt-14 grid max-w-[520px] grid-cols-3 border-y border-[var(--border)]"
            style={{ visibility: "hidden" }}
          >
            {["Web apps", "Systems", "Growth"].map(label => (
              <div key={label} className="border-r border-[var(--border)] py-4 last:border-r-0">
                <span className="block font-mono text-[0.52rem] uppercase tracking-[0.26em] text-[var(--teal)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

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
      className="relative section-py text-center"
      style={{ background: "transparent" }}
    >
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
          <Link href="/#contact" className="btn-glass">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Start the conversation →</span>
          </Link>
          <Link href="/work" className="btn-glass-ghost">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">See selected work</span>
          </Link>
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
      <main className="relative z-[1] overflow-x-clip">
        <ServicesBackground />
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ServicesHero />
        <ServicesOverview />
        <ServicesCTA />
      </main>
    </>
  );
}
