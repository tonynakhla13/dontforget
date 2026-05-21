"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TorusShape } from "./shapes";

const EVENTS = [
  { year: "2022", num: "01", title: "Founded",         body: "DON'T FORGET was born out of frustration. Too many agencies building forgettable work. We set out to change that — a small team with an unreasonably high bar." },
  { year: "2022", num: "02", title: "First client",    body: "A high-converting landing page for a fashion brand. Two weeks, start to finish. The client tripled their conversion rate in month one." },
  { year: "2023", num: "03", title: "Mobile practice", body: "Expanded into iOS and Android. Our first app shipped to the App Store and got featured by Apple in its first week." },
  { year: "2023", num: "04", title: "10 projects",     body: "Ten live projects across three countries. Every one built from scratch, designed with intent, shipped on time. No templates. No shortcuts." },
  { year: "2024", num: "05", title: "E-commerce",      body: "Full e-commerce practice launched — Shopify, WooCommerce, and fully custom storefronts. The SEO-first approach started compounding fast." },
  { year: "2024", num: "06", title: "CRM & systems",   body: "First custom CRM built for a travel platform. Engineer-minded precision became our standard — and our edge over every other studio." },
  { year: "2025", num: "07", title: "SEO & AI search", body: "Launched AI-powered search and marketing. Results most agencies call impossible. We just call it doing the work properly." },
  { year: "2025", num: "08", title: "6 countries",     body: "Projects live in 6 countries. 14+ clients. Zero boring websites. Staying small on purpose — every client gets the A-team." },
];

const N = EVENTS.length;
const dotX = (i: number) => 10 + (i / (N - 1)) * 80;

export default function OurStory() {
  const outerRef       = useRef<HTMLDivElement>(null);
  const introRef       = useRef<HTMLDivElement>(null);
  const progressRef    = useRef<HTMLDivElement>(null);
  // Per-event refs
  const dotsRef        = useRef<(HTMLDivElement | null)[]>([]);
  const ringsRef       = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const centerCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ghostYearsRef  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const dots        = dotsRef.current.filter((d): d is HTMLDivElement => d !== null);
    const rings       = ringsRef.current.filter((r): r is HTMLDivElement => r !== null);
    const years       = yearRefs.current.filter((y): y is HTMLDivElement => y !== null);
    const cards       = centerCardsRef.current.filter((c): c is HTMLDivElement => c !== null);
    const ghostYears  = ghostYearsRef.current.filter((g): g is HTMLDivElement => g !== null);

    if (dots.length !== N || cards.length !== N) return;

    // Initial states
    gsap.set(cards,      { autoAlpha: 0, y: 0 });
    gsap.set(ghostYears, { autoAlpha: 0 });
    gsap.set(dots,       { scale: 1, background: "rgba(58,191,138,0.28)" });
    gsap.set(rings,      { scale: 0.4, borderColor: "rgba(58,191,138,0)", autoAlpha: 0 });
    gsap.set(progressRef.current, { scaleX: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
        },
      });

      // Fade intro header out
      tl.to(introRef.current, { autoAlpha: 0, y: -28, duration: 0.07, ease: "none" });

      // Reveal first card
      tl.to(cards[0],      { autoAlpha: 1, y: 0, duration: 0.05 });
      tl.to(ghostYears[0], { autoAlpha: 1, duration: 0.05 }, "<");

      EVENTS.forEach((_, i) => {
        const isLast = i === N - 1;
        const prog   = i / (N - 1);

        // Progress bar
        tl.to(progressRef.current, { scaleX: prog, duration: 0.05, ease: "none" });

        // Deactivate previous dot
        if (i > 0) {
          tl.to(dots[i - 1],  { scale: 1, background: "rgba(58,191,138,0.28)", boxShadow: "none", duration: 0.04 }, "<");
          tl.to(rings[i - 1], { scale: 0.4, borderColor: "rgba(58,191,138,0)", autoAlpha: 0, duration: 0.04 }, "<");
          tl.to(years[i - 1], { color: "var(--body)", duration: 0.04 }, "<");
        }

        // Activate current dot + ring
        tl.to(dots[i], {
          scale: 1.7,
          background: "var(--teal)",
          boxShadow: "0 0 0 4px rgba(9,9,9,1), 0 0 0 7px rgba(58,191,138,0.92), 0 0 30px rgba(58,191,138,0.68)",
          duration: 0.05,
          ease: "none",
        }, "<");
        tl.to(rings[i], {
          scale: 1,
          borderColor: "rgba(58,191,138,0.72)",
          autoAlpha: 1,
          duration: 0.05,
        }, "<");
        tl.to(years[i], { color: "var(--teal)", duration: 0.05 }, "<");

        // Hold
        tl.to({}, { duration: isLast ? 0.28 : 0.16 });

        // Cross-fade to next card (not for last)
        if (!isLast) {
          tl.to(cards[i],      { autoAlpha: 0, y: -12, duration: 0.05 });
          tl.to(ghostYears[i], { autoAlpha: 0, duration: 0.04 }, "<");
          tl.to(cards[i + 1],      { autoAlpha: 1, y: 0, duration: 0.05 });
          tl.to(ghostYears[i + 1], { autoAlpha: 1, duration: 0.05 }, "<");
        }
      });

      // Fill progress to 100%
      tl.to(progressRef.current, { scaleX: 1, duration: 0.03 });
    }, outer);

    return () => ctx.revert();
  }, []);

  // Shared card position style
  const cardPos: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -54%)",
    width: 420,
    zIndex: 10,
    visibility: "hidden",
    pointerEvents: "none",
  };

  const ghostPos: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "var(--font-display-next)",
    fontSize: "18vw",
    fontWeight: 400,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    color: "var(--fg)",
    opacity: 0.06,
    lineHeight: 1,
    whiteSpace: "nowrap",
    zIndex: 0,
    userSelect: "none",
    pointerEvents: "none",
    visibility: "hidden",
  };

  return (
    <div
      ref={outerRef}
      className="relative border-t border-[var(--border)]"
      style={{ minHeight: "600vh", background: "rgba(9,9,9,0.72)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "transparent" }}>

        {/* Readability gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(9,9,9,0.10) 0%, rgba(9,9,9,0.58) 100%)" }}
        />

        {/* TorusShape — background decoration */}
        <div
          className="absolute pointer-events-none"
          style={{ right: "6%", top: "50%", transform: "translateY(-50%)", opacity: 0.15, zIndex: 0 }}
        >
          <TorusShape />
        </div>

        {/* Section intro header */}
        <div ref={introRef} className="absolute top-0 left-0 right-0 wrap z-10" style={{ paddingTop: "clamp(7rem,12vh,10rem)" }}>
          <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>Our Story</p>
          <h2 className="hed" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
            How we got{" "}
            <span className="script" style={{ color: "var(--teal)" }}>here.</span>
          </h2>
        </div>

        {/* Ghost year watermarks — stacked at center */}
        {EVENTS.map((ev, i) => (
          <div
            key={`gy-${i}`}
            ref={el => { ghostYearsRef.current[i] = el; }}
            style={ghostPos}
          >
            {ev.year}
          </div>
        ))}

        {/* Center-stage cards — stacked at center, revealed one at a time */}
        {EVENTS.map((ev, i) => (
          <div
            key={`card-${i}`}
            ref={el => { centerCardsRef.current[i] = el; }}
            style={cardPos}
          >
            <div
              className="relative rounded-[1.25rem]"
              style={{
                border: "1px solid rgba(58,191,138,0.30)",
                padding: "2.5rem 2.75rem",
                background: "rgba(9,9,9,0.92)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Top highlight line */}
              <div
                className="absolute inset-x-0 top-0 rounded-t-[1.25rem]"
                style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.60) 50%, transparent)" }}
              />
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.46rem",
                  letterSpacing: "0.44em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  marginBottom: "1rem",
                }}
              >
                {ev.num}
              </span>
              <h3
                className="hed"
                style={{ fontSize: "clamp(1.6rem,2.4vw,2.2rem)", lineHeight: 1.08, color: "var(--fg)", marginBottom: "1.25rem" }}
              >
                {ev.title}
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.85, color: "var(--body)" }}>
                {ev.body}
              </p>
            </div>
          </div>
        ))}

        {/* Horizontal progress line */}
        <div
          className="absolute"
          style={{ left: 0, right: 0, bottom: "14%", height: 1 }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(58,191,138,0.14)" }} />
          <div
            ref={progressRef}
            className="absolute inset-0 origin-left"
            style={{ background: "var(--teal)", transform: "scaleX(0)" }}
          />
        </div>

        {/* Dots + rings + year labels */}
        {EVENTS.map((ev, i) => (
          <div key={i}>
            {/* Outer ring (pulse element) */}
            <div
              ref={el => { ringsRef.current[i] = el; }}
              className="absolute rounded-full"
              style={{
                left: `${dotX(i)}%`,
                bottom: "14%",
                width: 30,
                height: 30,
                transform: "translate(-50%, 50%)",
                transformOrigin: "center center",
                border: "1.5px solid rgba(58,191,138,0)",
                zIndex: 1,
              }}
            />

            {/* Dot */}
            <div
              ref={el => { dotsRef.current[i] = el; }}
              className="absolute rounded-full"
              style={{
                left: `${dotX(i)}%`,
                bottom: "14%",
                transform: "translate(-50%, 50%)",
                width: 14,
                height: 14,
                background: "rgba(58,191,138,0.28)",
                border: "1.5px solid rgba(58,191,138,0.55)",
                transformOrigin: "center center",
                zIndex: 2,
              }}
            />

            {/* Year label */}
            <div
              ref={el => { yearRefs.current[i] = el; }}
              className="absolute font-mono"
              style={{
                left: `${dotX(i)}%`,
                bottom: "calc(14% - 24px)",
                transform: "translateX(-50%)",
                fontSize: "0.52rem",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--body)",
                whiteSpace: "nowrap",
              }}
            >
              {ev.year}
            </div>
          </div>
        ))}

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span
            style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.44rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "var(--body)",
            }}
          >
            Scroll to explore
          </span>
          <div className="h-5 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
        </div>

      </div>
    </div>
  );
}
