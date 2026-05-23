"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   CANVAS PARTICLES — flowing teal stream
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
    const particles: P[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: 0.22 + Math.random() * 0.42, vy: (Math.random() - 0.5) * 0.1,
      size: 0.7 + Math.random() * 1.3, alpha: 0.06 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));
    let t = 0, raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick); t += 0.006;
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        p.x += p.vx; p.y += Math.sin(t + p.phase) * 0.16 + p.vy;
        if (p.x > W() + 4) { p.x = -4; p.y = Math.random() * H(); }
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,191,138,${p.alpha})`; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 2, opacity: 0.7 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   IRIDESCENT BLOB — multi-layer colorful shape like the reference image
───────────────────────────────────────────────────────────────────────── */
function IridescentBlob() {
  const blobRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!blobRef.current) return;
    // Subtle organic morphing
    gsap.to(blobRef.current.querySelector(".blob-main"), {
      borderRadius: "42% 58% 52% 48% / 55% 42% 58% 45%",
      duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
    gsap.to(blobRef.current.querySelector(".blob-cool"), {
      borderRadius: "60% 40% 44% 56% / 40% 60% 40% 60%",
      duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5,
    });
  }, []);

  return (
    <div ref={blobRef} className="pointer-events-none absolute overflow-hidden" aria-hidden
      style={{ inset: 0, zIndex: 3 }}>

      {/* Warm core — orange/pink/magenta */}
      <div className="blob-main absolute" style={{
        top: "-5%", left: "22%", width: "62vw", height: "90vh",
        borderRadius: "55% 45% 60% 40% / 48% 55% 45% 52%",
        background: [
          "radial-gradient(circle at 38% 28%, rgba(255,110,40,0.85) 0%, transparent 42%)",
          "radial-gradient(circle at 62% 22%, rgba(230,50,130,0.70) 0%, transparent 38%)",
          "radial-gradient(circle at 28% 60%, rgba(180,50,230,0.55) 0%, transparent 38%)",
          "radial-gradient(circle at 68% 65%, rgba(58,191,138,0.60) 0%, transparent 40%)",
        ].join(","),
        filter: "blur(14px)",
        mixBlendMode: "screen",
        opacity: 0.90,
      }} />

      {/* Cool overlay — teal/cyan/purple */}
      <div className="blob-cool absolute" style={{
        top: "8%", left: "32%", width: "50vw", height: "72vh",
        borderRadius: "50% 50% 44% 56% / 44% 52% 48% 56%",
        background: [
          "radial-gradient(circle at 55% 35%, rgba(45,215,195,0.60) 0%, transparent 45%)",
          "radial-gradient(circle at 30% 45%, rgba(100,80,240,0.50) 0%, transparent 40%)",
          "radial-gradient(circle at 72% 58%, rgba(58,191,138,0.45) 0%, transparent 38%)",
        ].join(","),
        filter: "blur(18px)",
        mixBlendMode: "screen",
        opacity: 0.85,
      }} />

      {/* Specular shine — white gloss highlight */}
      <div className="absolute" style={{
        top: "4%", left: "38%", width: "30vw", height: "38vh",
        borderRadius: "48% 52% 55% 45% / 52% 46% 54% 48%",
        background: "radial-gradient(circle at 42% 22%, rgba(255,255,255,0.18) 0%, transparent 50%)",
        filter: "blur(8px)",
        mixBlendMode: "screen",
        opacity: 0.95,
      }} />

      {/* Edge softener — dark vignette so blob doesn't bleed to edges */}
      <div className="absolute inset-0" style={{
        background: [
          "radial-gradient(ellipse 85% 90% at 50% 50%, transparent 50%, rgba(9,9,9,0.55) 100%)",
          "linear-gradient(to right, rgba(9,9,9,0.90) 0%, transparent 18%, transparent 82%, rgba(9,9,9,0.90) 100%)",
          "linear-gradient(to bottom, rgba(9,9,9,0.60) 0%, transparent 20%, transparent 80%, rgba(9,9,9,0.85) 100%)",
        ].join(","),
      }} />
    </div>
  );
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

  /* Entrance animation — plays on mount (no scroll needed for hero) */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(line1Ref.current, { autoAlpha: 0, xPercent: -6 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, 0)
        .fromTo(line2Ref.current, { autoAlpha: 0, xPercent:  6 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, 0.08)
        .fromTo(line3Ref.current, { autoAlpha: 0, y: 40       }, { autoAlpha: 1, y: 0,         duration: 1.0 }, 0.2)
        .fromTo(subRef.current,   { autoAlpha: 0, y: 24       }, { autoAlpha: 1, y: 0,         duration: 0.8 }, 0.4)
        .fromTo(statsRef.current?.children ?? [],
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7 }, 0.55);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "transparent", minHeight: "100dvh" }}>
      <IridescentBlob />
      <ParticleStream />

      {/* Hard bottom fade — clean transition to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
        style={{ height: "22vh", background: "linear-gradient(to bottom, transparent, rgba(9,9,9,0.95))" }} />

      {/* ── Heading block — fills the viewport ── */}
      <div className="wrap relative" style={{ zIndex: 10, paddingTop: "clamp(7rem,14vh,11rem)" }}>

        {/* "WE BUILD" — line 1, left */}
        <div ref={line1Ref} style={{ lineHeight: 0.88, overflow: "hidden" }}>
          <h1 className="hed" style={{
            fontSize: "clamp(4rem, 20vw, 22rem)",
            letterSpacing: "-0.02em",
            color: "var(--fg)",
          }}>
            we build
          </h1>
        </div>

        {/* "THINGS" — line 2, right, sits in front of blob */}
        <div ref={line2Ref} style={{ lineHeight: 0.88, overflow: "hidden", textAlign: "right", marginTop: "-0.04em", position: "relative", zIndex: 12 }}>
          <h1 className="hed" style={{
            fontSize: "clamp(4rem, 20vw, 22rem)",
            letterSpacing: "-0.02em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(240,236,227,0.65)",
          }}>
            things
          </h1>
        </div>

        {/* "unforgettable." — line 3, italic teal */}
        <div ref={line3Ref} style={{ overflow: "hidden", marginTop: "-0.02em" }}>
          <h1 className="hed script" style={{
            fontSize: "clamp(2.8rem, 11.5vw, 13rem)",
            letterSpacing: "-0.01em",
            color: "var(--teal)",
            fontStyle: "italic",
          }}>
            unforgettable.
          </h1>
        </div>

        {/* ── Scattered stats ── */}
        <div ref={statsRef} className="relative mt-8 flex items-end justify-between">
          {[
            { value: "14+", label: "projects shipped" },
            { value: "6",   label: "countries served" },
            { value: "3yr", label: "building since '22" },
          ].map(s => (
            <div key={s.label}>
              <p className="hed" style={{ fontSize: "clamp(1.6rem,3vw,2.8rem)", lineHeight: 1, color: "var(--fg)" }}>{s.value}</p>
              <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--body)", marginTop: "0.3rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Sub copy + CTA ── */}
        <div ref={subRef} className="mt-10 flex flex-col items-center gap-7 pb-10 text-center">
          <p className="eyebrow" style={{ letterSpacing: "0.36em" }}>Est. 2022 — Digital Studio</p>

          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1.5 pl-6"
            style={{ background: "rgba(17,17,17,0.65)", backdropFilter: "blur(14px)" }}>
            <span className="text-sm" style={{ color: "var(--body)" }}>Got something worth remembering?</span>
            <a href="#contact" className="rounded-full px-6 py-3 text-sm font-medium transition-colors"
              style={{ background: "var(--teal)", color: "var(--bg)" }}>
              Let&apos;s talk
            </a>
          </div>

          <p className="max-w-md text-[0.9rem] leading-[1.9]" style={{ color: "var(--body)" }}>
            A small studio obsessed with craft, speed, and digital work that makes people stop scrolling.
            Not a factory. Not a freelancer. Something better than both.
          </p>
        </div>

      </div>
    </section>
  );
}
