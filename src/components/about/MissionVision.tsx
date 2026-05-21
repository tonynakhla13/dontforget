"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DodecaShape } from "./shapes";

/* ── SVG Sketch Annotations ───────────────────────────────────────────── */

function SquigglyUnderline({ delay = 0, trigger }: { delay?: number; trigger: React.RefObject<HTMLElement | null> }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay,
      scrollTrigger: {
        trigger: trigger.current,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  }, [delay, trigger]);

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        bottom: -8,
        width: "100%",
        height: 14,
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M0 6 Q25 1 50 6 Q75 11 100 6 Q125 1 150 6 Q175 11 200 6"
        stroke="rgba(58,191,138,0.55)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OvalCircle({ delay = 0, trigger }: { delay?: number; trigger: React.RefObject<HTMLElement | null> }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "power2.inOut",
      delay,
      scrollTrigger: {
        trigger: trigger.current,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  }, [delay, trigger]);

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: "-8%",
        top: "-22%",
        width: "116%",
        height: "145%",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
      viewBox="0 0 240 60"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M120 4 C180 2, 238 16, 236 30 C234 44, 178 57, 120 56 C62 58, 5 44, 4 30 C3 16, 60 6, 120 4 Z"
        stroke="rgba(58,191,138,0.40)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SketchArrow({ delay = 0, trigger }: { delay?: number; trigger: React.RefObject<HTMLElement | null> }) {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const p1 = path1Ref.current;
    const p2 = path2Ref.current;
    if (!p1 || !p2) return;
    const l1 = p1.getTotalLength();
    const l2 = p2.getTotalLength();
    gsap.set(p1, { strokeDasharray: l1, strokeDashoffset: l1 });
    gsap.set(p2, { strokeDasharray: l2, strokeDashoffset: l2 });
    const st = { trigger: trigger.current, start: "top 82%", toggleActions: "play none none none" };
    gsap.to(p1, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", delay, scrollTrigger: st });
    gsap.to(p2, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out", delay: delay + 0.7, scrollTrigger: st });
  }, [delay, trigger]);

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        right: "-3rem",
        top: "0.5rem",
        width: 56,
        height: 36,
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox="0 0 56 36"
    >
      <path
        ref={path1Ref}
        d="M0 0 L36 0 L36 26"
        stroke="rgba(240,236,227,0.22)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        ref={path2Ref}
        d="M27 18 L36 26 L45 18"
        stroke="rgba(240,236,227,0.22)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "01",
    label: "Mission",
    heading: "Build things people remember.",
    accentWord: "remember",
    annotation: "underline" as const,
    body: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    num: "02",
    label: "Vision",
    heading: "World-class craft for every brand.",
    accentWord: "every brand",
    annotation: "circle" as const,
    body: "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
  {
    num: "03",
    label: "Why",
    heading: "Because forgettable is a waste.",
    accentWord: "a waste",
    annotation: "arrow" as const,
    body: "Most digital work gets scrolled past in under a second. We started DON'T FORGET because we believe that's a failure — of execution, of intent, and of respect for the audience.",
  },
];

const VALUES = [
  { title: "Clarity over clutter",  body: "If it doesn't sharpen the message, it doesn't ship." },
  { title: "Motion with intent",    body: "Every animation earns its place or it doesn't exist." },
  { title: "Systems, not one-offs", body: "We build logic as strong as the visuals." },
  { title: "Honesty, always",       body: "We'll tell you when your brief needs work. You'll thank us." },
  { title: "Speed is a feature",    body: "Slow websites lose business. We build fast by default." },
  { title: "Ownership mindset",     body: "We treat your project like it's ours. Because it is." },
];

/* ── Component ────────────────────────────────────────────────────────── */

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const hedRefs    = useRef<(HTMLHeadingElement | null)[]>([]);
  // each pillar row gets a ref for scroll trigger
  const pillarRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ] as const;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pillar row fade-ins
      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 84%", toggleActions: "play none none none" },
          }
        );
      });

      // Values bento stagger
      const vals = sectionRef.current?.querySelectorAll("[data-val]") ?? [];
      gsap.fromTo(
        vals,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: "[data-values-bento]", start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function onHedEnter(e: React.MouseEvent<HTMLHeadingElement>) {
    gsap.to(e.currentTarget, { scale: 1.04, x: 6, duration: 0.35, ease: "power2.out" });
  }
  function onHedLeave(e: React.MouseEvent<HTMLHeadingElement>) {
    gsap.to(e.currentTarget, { scale: 1, x: 0, duration: 0.45, ease: "power3.out" });
  }

  function onValEnter(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    gsap.to(el, { y: -5, duration: 0.3, ease: "power2.out" });
    el.style.borderColor = "rgba(58,191,138,0.38)";
    el.style.background =
      "radial-gradient(ellipse 80% 80% at 30% 30%, rgba(58,191,138,0.07) 0%, var(--surface) 70%)";
  }
  function onValLeave(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    gsap.to(el, { y: 0, duration: 0.4, ease: "power3.out" });
    el.style.borderColor = "var(--border)";
    el.style.background = "var(--surface)";
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.88)", backdropFilter: "blur(6px)" }}
    >
      {/* Top glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.28), transparent)" }}
      />

      {/* DodecaShape corner */}
      <div
        className="pointer-events-none absolute"
        style={{ right: -40, top: "8%", opacity: 0.18, zIndex: 0 }}
      >
        <DodecaShape />
      </div>

      <div className="wrap relative z-10">
        <p className="eyebrow" style={{ marginBottom: "4rem" }}>What drives us</p>

        {/* ── Pillars ── */}
        <div className="divide-y divide-[var(--border)]">
          {PILLARS.map((p, i) => {
            const isEven = i % 2 === 1; // Vision gets flipped
            const labelCol = (
              <div className="flex flex-col gap-1 pt-1">
                <span className="eyebrow">{p.label}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono-next)",
                    fontSize: "0.46rem",
                    letterSpacing: "0.44em",
                    textTransform: "uppercase",
                    color: "var(--body)",
                    opacity: 0.45,
                    marginTop: 4,
                  }}
                >
                  {p.num}
                </span>
              </div>
            );
            const contentCol = (
              <div style={{ position: "relative" }}>
                <h3
                  ref={el => { hedRefs.current[i] = el; }}
                  className="hed"
                  style={{
                    fontSize: "clamp(1.9rem,3.2vw,3rem)",
                    lineHeight: 1.06,
                    color: "var(--fg)",
                    display: "inline-block",
                    transformOrigin: "left center",
                    cursor: "default",
                  }}
                  onMouseEnter={onHedEnter}
                  onMouseLeave={onHedLeave}
                >
                  {/* Split heading around accent word */}
                  {p.heading.split(p.accentWord).map((part, pi, arr) => (
                    <span key={pi}>
                      {part}
                      {pi < arr.length - 1 && (
                        <span style={{ position: "relative", display: "inline-block" }}>
                          {p.accentWord}
                          {p.annotation === "underline" && (
                            <SquigglyUnderline trigger={pillarRefs[i]} delay={0.4} />
                          )}
                          {p.annotation === "circle" && (
                            <OvalCircle trigger={pillarRefs[i]} delay={0.3} />
                          )}
                          {p.annotation === "arrow" && (
                            <SketchArrow trigger={pillarRefs[i]} delay={0.35} />
                          )}
                        </span>
                      )}
                    </span>
                  ))}
                </h3>
                <p
                  style={{
                    marginTop: "1.75rem",
                    maxWidth: "56ch",
                    fontSize: "0.9375rem",
                    lineHeight: 1.9,
                    color: "var(--body)",
                  }}
                >
                  {p.body}
                </p>
              </div>
            );

            return (
              <div
                key={p.num}
                ref={el => {
                  rowRefs.current[i] = el;
                  // Also update the pillarRefs (used by SketchAnnotation triggers)
                  // Cast is needed since pillarRefs are readonly tuple refs
                  (pillarRefs[i] as React.MutableRefObject<HTMLDivElement | null>).current = el;
                }}
                className="grid gap-8 py-14"
                style={{
                  gridTemplateColumns: isEven ? "1fr 180px" : "180px 1fr",
                  visibility: "hidden",
                }}
              >
                {isEven ? [contentCol, labelCol] : [labelCol, contentCol]}
              </div>
            );
          })}
        </div>

        {/* ── Values bento grid ── */}
        <div className="mt-20 pt-14 border-t border-[var(--border)]">
          <p className="eyebrow" style={{ marginBottom: "3rem" }}>How we work</p>

          <div
            data-values-bento
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {VALUES.map((v, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <div
                  key={i}
                  data-val
                  style={{
                    visibility: "hidden",
                    gridColumn: isLarge ? "span 2" : "span 1",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: isLarge ? "2.25rem 2.5rem" : "1.75rem 2rem",
                    background: "var(--surface)",
                    cursor: "default",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  onMouseEnter={onValEnter}
                  onMouseLeave={onValLeave}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono-next)",
                      fontSize: "0.46rem",
                      letterSpacing: "0.48em",
                      textTransform: "uppercase",
                      color: "var(--teal)",
                      marginBottom: "1rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="hed"
                    style={{ fontSize: isLarge ? "1.2rem" : "1.05rem", color: "var(--fg)", marginBottom: "0.75rem" }}
                  >
                    {v.title}
                  </h4>
                  <p style={{ fontSize: "0.84rem", lineHeight: 1.8, color: "var(--body)" }}>
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
