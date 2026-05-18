"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ── CSS-only 3-D rotating gem wireframe ─────────────────────── */
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
    <div
      className="pointer-events-none select-none"
      style={{
        width: 420, height: 420,
        perspective: "900px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          animation: "gem-spin 28s linear infinite",
        }}
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
        {/* Inner glow sphere */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "22%",
            background: "radial-gradient(circle at 40% 38%, rgba(58,191,138,0.18) 0%, transparent 68%)",
            transform: "translateZ(0px)",
          }}
        />
        {/* Outer rim glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 60px rgba(58,191,138,0.14), inset 0 0 40px rgba(58,191,138,0.04)",
            border: "1px solid rgba(58,191,138,0.22)",
          }}
        />
      </div>
    </div>
  );
}

export default function AboutHero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const gemRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo([eyebrowRef.current, headRef.current, bodyRef.current],
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(gemRef.current,
      { autoAlpha: 0, scale: 0.7 },
      { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power3.out" },
      "<0.3"
    );
  }, []);

  return (
    <>
      {/* CSS keyframe for gem rotation */}
      <style>{`
        @keyframes gem-spin {
          from { transform: rotateY(0deg) rotateX(8deg); }
          to   { transform: rotateY(360deg) rotateX(8deg); }
        }
      `}</style>

      <section
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* Radial fade mask */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 0%, rgba(9,9,9,0.35) 70%, rgba(9,9,9,0.65) 100%)",
          }}
        />

        <div className="relative z-10 wrap grid items-center gap-16 lg:grid-cols-2">
          {/* Left — text */}
          <div>
            <p ref={eyebrowRef} className="eyebrow mb-8" style={{ visibility: "hidden" }}>
              About us
            </p>
            <h1
              ref={headRef}
              className="hed text-[5rem] leading-[0.95]"
              style={{ visibility: "hidden" }}
            >
              We don&apos;t just<br />
              build. We make<br />
              things people{" "}
              <span className="script text-[1.04em]">remember.</span>
            </h1>
            <p
              ref={bodyRef}
              className="mt-9 max-w-md text-[0.9375rem] leading-[1.9] text-[var(--body)]"
              style={{ visibility: "hidden" }}
            >
              DON&apos;T FORGET is a small studio obsessed with craft, speed, and the
              kind of digital work that makes people stop scrolling. Not a
              factory, not a freelancer — something better than both.
            </p>
          </div>

          {/* Right — 3D gem */}
          <div
            ref={gemRef}
            className="flex items-center justify-center"
            style={{ visibility: "hidden" }}
          >
            <GemShape />
          </div>
        </div>

        {/* Bottom scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
        </div>
      </section>
    </>
  );
}
