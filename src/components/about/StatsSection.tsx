"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────── */
export type StatItem = {
  value: number; suffix: string; label: string; desc: string;
};

const DEFAULT_STATS: StatItem[] = [
  { value: 14, suffix: "+", label: "Projects shipped", desc: "From zero to live — design, build, and hand-off." },
  { value: 6,  suffix: "",  label: "Countries served", desc: "Clients across 6 countries, same standard everywhere." },
  { value: 3,  suffix: "yr",label: "Since '22",        desc: "Three years of shipping things worth remembering." },
  { value: 100,suffix: "%", label: "On-time delivery",  desc: "Deadlines aren't guidelines. We've never missed one." },
];

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function StatsSection({ stats: statsProp }: { stats?: StatItem[] }) {
  const STATS = (statsProp && statsProp.length > 0 ? statsProp : DEFAULT_STATS).map((s, i) => ({
    ...s,
    index: String(i + 1).padStart(2, "0"),
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const scanRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Scan-line sweeps in */
      gsap.fromTo(scanRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%", end: "top 30%", scrub: 0.8,
          },
        }
      );

      /* Header fades up */
      gsap.fromTo(headerRef.current,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1, y: 0, duration: 0.85, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );

      /* Cards stagger up */
      const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
      if (cards.length) {
        gsap.fromTo(cards,
          { autoAlpha: 0, y: 64 },
          {
            autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.05, ease: "expo.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
          }
        );
      }

      /* Per-stat: bar draw + count-up */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      STATS.forEach((stat, i) => {
        gsap.fromTo(barRefs.current[i],
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1.35, ease: "expo.out", delay: i * 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
          }
        );

        const el = numRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.9,
          ease: "expo.out",
          delay: i * 0.11,
          onUpdate: () => { el.textContent = Math.round(obj.val) + stat.suffix; },
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        /* Solid dark surface with subtle green tint */
        background: [
          "linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.97) 5%, rgba(9,9,9,0.97) 95%, rgba(9,9,9,0) 100%)",
        ].join(","),
        padding: "clamp(4.5rem,9vh,8rem) 0 clamp(5rem,10vh,9rem)",
      }}
    >
      {/* Top border glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(58,191,138,0.35) 30%, rgba(58,191,138,0.55) 60%, transparent 100%)",
      }} />

      {/* Bottom border glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(58,191,138,0.2) 40%, rgba(58,191,138,0.35) 70%, transparent 100%)",
      }} />

      {/* Dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        backgroundImage: "radial-gradient(rgba(58,191,138,0.065) 1px, transparent 1px)",
        backgroundSize: "38px 38px",
        maskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* Centre ambient glow */}
      <div aria-hidden className="pointer-events-none absolute" style={{
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "70vw", height: "50vw",
        background: "radial-gradient(ellipse at 50% 50%, rgba(58,191,138,0.09) 0%, transparent 60%)",
        filter: "blur(56px)",
      }} />

      <div className="wrap relative z-10">

        {/* Scan line */}
        <div ref={scanRef} style={{
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(58,191,138,0.5) 15%, rgba(58,191,138,1) 55%, rgba(58,191,138,0.25) 100%)",
          marginBottom: "clamp(2rem,3.5vh,3.5rem)",
        }} />

        {/* Section label row */}
        <div ref={headerRef} className="mb-10 flex items-center gap-4">
          <span style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.42rem", letterSpacing: "0.5em",
            textTransform: "uppercase", color: "rgba(58,191,138,0.65)",
          }}>
            Studio metrics
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.38rem", letterSpacing: "0.38em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.18)",
          }}>
            Est. 2022
          </span>
        </div>

        {/* 4-column stats grid */}
        <div ref={gridRef} style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "clamp(1rem,2vw,2.5rem)",
        }}>
          {STATS.map((stat, i) => (
            <div key={stat.index} style={{ position: "relative" }}>

              {/* Ghost index watermark */}
              <span aria-hidden className="hed" style={{
                position: "absolute", top: "-0.5em", right: 0,
                fontSize: "clamp(4rem,10vw,11rem)", lineHeight: 1,
                color: "rgba(58,191,138,0.05)",
                userSelect: "none", pointerEvents: "none",
                letterSpacing: "-0.04em",
              }}>
                {stat.index}
              </span>

              {/* Index tag */}
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.38rem", letterSpacing: "0.46em",
                textTransform: "uppercase", color: "rgba(58,191,138,0.42)",
                marginBottom: "clamp(0.6rem,1vh,1rem)",
              }}>
                {stat.index} / 04
              </p>

              {/* Big number */}
              <div style={{ overflow: "hidden", marginBottom: "0.4rem" }}>
                <p className="hed" style={{
                  fontSize: "clamp(3.6rem,7.5vw,9rem)",
                  lineHeight: 0.88, letterSpacing: "-0.03em",
                  color: "var(--fg)",
                }}>
                  <span ref={(el) => { numRefs.current[i] = el; }}>
                    {"0" + stat.suffix}
                  </span>
                </p>
              </div>

              {/* Teal bar */}
              <div ref={(el) => { barRefs.current[i] = el; }} style={{
                height: 2,
                background: "linear-gradient(90deg, rgba(58,191,138,0.9) 0%, rgba(58,191,138,0.15) 100%)",
                borderRadius: 2,
                marginBottom: "clamp(0.7rem,1.2vh,1.2rem)",
              }} />

              {/* Label */}
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.43rem", letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(240,236,227,0.72)",
                marginBottom: "0.5rem",
              }}>
                {stat.label}
              </p>

              {/* Desc */}
              <p style={{
                fontSize: "0.8rem", lineHeight: 1.75,
                color: "var(--body)", maxWidth: "22ch",
              }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div style={{
          marginTop: "clamp(3rem,5vh,5rem)", height: 1,
          background: "linear-gradient(90deg, rgba(58,191,138,0.25) 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
        }} />

      </div>
    </section>
  );
}
