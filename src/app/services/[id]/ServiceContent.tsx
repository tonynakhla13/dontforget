"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import type { ServiceData } from "./page";

const ServiceScene = dynamic(
  () => import("@/components/three/ServiceScene"),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────────────
// Feature card
// ─────────────────────────────────────────────────────────────────────
function FeatureCard({ label, index }: { label: string; index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.2rem] border border-[var(--border)] p-6"
      style={{
        background:
          "linear-gradient(145deg, rgba(10,26,19,0.9) 0%, rgba(13,34,23,0.85) 55%, rgba(7,14,10,0.9) 100%)",
      }}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-30" />

      <span className="block font-mono text-[0.46rem] uppercase tracking-[0.46em] text-[var(--teal)] opacity-55 mb-2">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg)] leading-snug">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tech pill
// ─────────────────────────────────────────────────────────────────────
function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--teal-mid)] bg-[var(--teal-faint)] px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--teal)]">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main content
// ─────────────────────────────────────────────────────────────────────
export default function ServiceContent({ svc }: { svc: ServiceData }) {
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const numRef      = useRef<HTMLSpanElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const featRef     = useRef<HTMLDivElement>(null);
  const techRef     = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance — staggered after loader (2.4 s)
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo(
      [eyebrowRef.current, numRef.current, headRef.current, taglineRef.current, bodyRef.current, ctaRef.current],
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, stagger: 0.10, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(
      canvasRef.current,
      { autoAlpha: 0, scale: 0.88 },
      { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power3.out" },
      "<0.2"
    );

    // Features stagger on scroll
    const featureCards = featRef.current?.querySelectorAll("[data-feat]");
    if (featureCards?.length) {
      gsap.fromTo(
        featureCards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1, y: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: featRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }

    // Tech + CTA fade
    gsap.fromTo(
      [techRef.current, ctaSectionRef.current],
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1, y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: techRef.current, start: "top 80%", toggleActions: "play none none none" },
      }
    );
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 0%, rgba(9,9,9,0.28) 68%, rgba(9,9,9,0.60) 100%)",
          }}
        />

        <div className="relative z-10 wrap grid items-center gap-12 lg:grid-cols-2 pt-28 pb-20">
          {/* Left — text */}
          <div>
            <p ref={eyebrowRef} className="eyebrow mb-3" style={{ visibility: "hidden" }}>
              Services
            </p>
            <span
              ref={numRef}
              className="block font-mono text-[0.55rem] uppercase tracking-[0.46em] text-[var(--body)] mb-6"
              style={{ visibility: "hidden" }}
            >
              {svc.num} / 06
            </span>

            <h1
              ref={headRef}
              className="hed text-[5.5rem] leading-[0.95]"
              style={{ visibility: "hidden" }}
            >
              {svc.title}
            </h1>

            <p
              ref={taglineRef}
              className="script mt-5 text-[1.4rem]"
              style={{ visibility: "hidden" }}
            >
              {svc.tagline}
            </p>

            <p
              ref={bodyRef}
              className="mt-7 max-w-[480px] text-[0.9375rem] leading-[1.9] text-[var(--body)]"
              style={{ visibility: "hidden" }}
            >
              {svc.body}
            </p>

            <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
              <a href="/#contact" className="btn btn-primary btn-ripple">
                Start this project
              </a>
              <a href="/#services" className="btn btn-outline">
                All services →
              </a>
            </div>
          </div>

          {/* Right — 3D canvas */}
          <div
            ref={canvasRef}
            className="relative h-[420px] lg:h-[520px]"
            style={{ visibility: "hidden" }}
          >
            <ServiceScene />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="section-py border-t border-[var(--border)]" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <p className="eyebrow mb-6">What's included</p>
          <h2 className="hed text-[3rem] mb-14">
            Everything<br />
            <span className="text-[var(--teal)]">you need.</span>
          </h2>

          <div ref={featRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {svc.features.map((feat, i) => (
              <div key={feat} data-feat>
                <FeatureCard label={feat} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech + CTA ───────────────────────────────────────────── */}
      <section className="section-py border-t border-[var(--border)]" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">

            {/* Tech stack */}
            <div ref={techRef}>
              <p className="eyebrow mb-6">Built with</p>
              <div className="flex flex-wrap gap-3">
                {svc.tech.map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </div>

            {/* CTA block */}
            <div
              ref={ctaSectionRef}
              className="max-w-md rounded-[1.4rem] border border-[var(--teal-mid)] p-10"
              style={{
                background:
                  "linear-gradient(145deg, rgba(10,26,19,0.95) 0%, rgba(7,14,10,0.98) 100%)",
              }}
            >
              {/* Top glow */}
              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-40" />
              <p className="eyebrow mb-4">Ready to build?</p>
              <h3 className="hed text-[2.2rem] mb-5">
                Let&apos;s talk<br />
                <span className="text-[var(--teal)]">about your project.</span>
              </h3>
              <p className="text-[0.875rem] leading-[1.85] text-[var(--body)] mb-8">
                We take on a small number of projects at a time — that&apos;s how we deliver the craft you see in our work.
              </p>
              <a href="/#contact" className="btn btn-primary btn-ripple w-full justify-center">
                Start the conversation →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back breadcrumb ──────────────────────────────────────── */}
      <section className="py-12 border-t border-[var(--border)]" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <a
            href="/#services"
            className="inline-flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--body)] transition-colors hover:text-[var(--teal)]"
          >
            <span className="h-px w-8 bg-current" />
            Back to services
          </a>
        </div>
      </section>
    </>
  );
}
