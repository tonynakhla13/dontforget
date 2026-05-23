"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   CANVAS PARTICLES — soft teal dust
───────────────────────────────────────────────────────────────────────── */
function ParticleStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d")!;
    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number };
    const W = () => canvas.width, H = () => canvas.height;
    const particles: P[] = Array.from({ length: 110 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: 0.16 + Math.random() * 0.30, vy: (Math.random() - 0.5) * 0.07,
      size: 0.55 + Math.random() * 1.0, alpha: 0.04 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }));
    let t = 0, raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick); t += 0.005;
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        p.x += p.vx; p.y += Math.sin(t + p.phase) * 0.13 + p.vy;
        if (p.x > W() + 4) { p.x = -4; p.y = Math.random() * H(); }
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,191,138,${p.alpha})`; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 2, opacity: 0.60 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────── */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  /* Entrance animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(line1Ref.current, { autoAlpha: 0, xPercent: -5 }, { autoAlpha: 1, xPercent: 0, duration: 1.0 }, 0)
        .fromTo(line2Ref.current, { autoAlpha: 0, xPercent:  5 }, { autoAlpha: 1, xPercent: 0, duration: 1.0 }, 0.08)
        .fromTo(line3Ref.current, { autoAlpha: 0, y: 30       }, { autoAlpha: 1, y: 0,         duration: 0.9 }, 0.18)
        .fromTo(subRef.current,   { autoAlpha: 0, y: 20       }, { autoAlpha: 1, y: 0,         duration: 0.75}, 0.35)
        .fromTo(statsRef.current?.children ?? [],
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.10, duration: 0.6 }, 0.50);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "transparent", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <ParticleStream />

      {/* Vignette — keeps edges readable */}
      <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden style={{
        background: [
          "radial-gradient(ellipse 75% 80% at 50% 50%, transparent 38%, rgba(9,9,9,0.60) 100%)",
          "linear-gradient(to right,  rgba(9,9,9,0.75) 0%, transparent 15%, transparent 85%, rgba(9,9,9,0.75) 100%)",
          "linear-gradient(to bottom, rgba(9,9,9,0.50) 0%, transparent 15%)",
        ].join(","),
      }} />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
        style={{ height: "22vh", background: "linear-gradient(to bottom, transparent, rgba(9,9,9,0.97))" }} />

      {/* ── Content — vertically centred ── */}
      <div className="wrap relative z-10" style={{ paddingTop: "clamp(5rem,10vh,8rem)", paddingBottom: "clamp(3rem,6vh,5rem)" }}>

        {/* Line 1 — "we build" */}
        <div ref={line1Ref} style={{ lineHeight: 0.88, overflow: "hidden" }}>
          <h1 className="hed" style={{
            fontSize:      "clamp(3.2rem, 12.5vw, 14.5rem)",
            letterSpacing: "-0.02em",
            color:         "var(--fg)",
          }}>
            we build
          </h1>
        </div>

        {/* Line 2 — "things" outline, right-aligned */}
        <div ref={line2Ref} style={{
          lineHeight: 0.88, overflow: "hidden",
          textAlign: "right", marginTop: "-0.04em",
          position: "relative", zIndex: 12,
        }}>
          <h1 className="hed" style={{
            fontSize:      "clamp(3.2rem, 12.5vw, 14.5rem)",
            letterSpacing: "-0.02em",
            color:         "transparent",
            WebkitTextStroke: "1.5px rgba(240,236,227,0.60)",
          }}>
            things
          </h1>
        </div>

        {/* Line 3 — "unforgettable." italic teal */}
        <div ref={line3Ref} style={{ overflow: "hidden", marginTop: "-0.02em" }}>
          <h1 className="hed script" style={{
            fontSize:      "clamp(2rem, 7.5vw, 8.5rem)",
            letterSpacing: "-0.01em",
            color:         "var(--teal)",
            fontStyle:     "italic",
          }}>
            unforgettable.
          </h1>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="relative mt-6 flex items-end justify-between">
          {[
            { value: "14+", label: "projects shipped" },
            { value: "6",   label: "countries served" },
            { value: "3yr", label: "building since '22" },
          ].map(s => (
            <div key={s.label}>
              <p className="hed" style={{ fontSize: "clamp(1.4rem,2.5vw,2.4rem)", lineHeight: 1, color: "var(--fg)" }}>{s.value}</p>
              <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.50rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--body)", marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sub copy + CTA */}
        <div ref={subRef} className="mt-8 flex flex-col items-center gap-5 pb-2 text-center">
          <p className="eyebrow" style={{ letterSpacing: "0.34em" }}>Est. 2022 — Digital Studio</p>

          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1.5 pl-5"
            style={{ background: "rgba(17,17,17,0.65)", backdropFilter: "blur(14px)" }}>
            <span className="text-sm" style={{ color: "var(--body)" }}>Got something worth remembering?</span>
            <a href="#contact" className="rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ background: "var(--teal)", color: "var(--bg)" }}>
              Let&apos;s talk
            </a>
          </div>

          <p className="max-w-md text-[0.875rem] leading-[1.9]" style={{ color: "var(--body)" }}>
            A small studio obsessed with craft, speed, and digital work that makes people stop scrolling.
            Not a factory. Not a freelancer. Something better than both.
          </p>
        </div>

      </div>
    </section>
  );
}
