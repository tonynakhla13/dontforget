"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   DATA — condensed to 4 milestones
───────────────────────────────────────────────────────────────────────── */
const EVENTS = [
  {
    year: "2022", num: "01", title: "Founded",
    body: "Born out of frustration with forgettable work. We set out to build a studio with an unreasonably high bar — and actually keep it.",
  },
  {
    year: "2023", num: "02", title: "First wins",
    body: "First client tripled their conversion rate in month one. First mobile app featured by Apple week one. The bar was set early.",
  },
  {
    year: "2024", num: "03", title: "10 projects live",
    body: "Ten live projects across three countries. E-commerce, custom CRMs, full-stack platforms. No templates. No shortcuts. Ever.",
  },
  {
    year: "2025", num: "04", title: "6 countries",
    body: "Shipping across six countries, 14+ clients, AI-powered search. Still small on purpose — every project gets the A-team.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   TIMELINE DOT — entrance scrub + infinite pulse (pure GSAP)
───────────────────────────────────────────────────────────────────────── */
function Dot({ index }: { index: number }) {
  const dotRef   = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance
    gsap.fromTo(dotRef.current,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ease: "back.out(2)",
        scrollTrigger: { trigger: dotRef.current, start: "top 92%", end: "top 55%", scrub: 0.8 } }
    );
    // Pulse ring — repeats forever
    gsap.fromTo(pulseRef.current,
      { scale: 1, opacity: 0.55 },
      { scale: 2.2, opacity: 0, ease: "power2.out", repeat: -1, duration: 2.4, delay: index * 0.35 }
    );
  }, { dependencies: [] });

  return (
    <div ref={dotRef} className="relative z-10 flex items-center justify-center"
      style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--teal)",
        border: "2px solid rgba(9,9,9,1)",
        boxShadow: "0 0 0 4px rgba(9,9,9,1), 0 0 0 7px rgba(58,191,138,0.85), 0 0 24px rgba(58,191,138,0.55)",
        flexShrink: 0 }}>
      <div ref={pulseRef} style={{ position: "absolute", inset: -9, borderRadius: "50%",
        border: "1px solid rgba(58,191,138,0.50)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD — GSAP scrub slide-in
───────────────────────────────────────────────────────────────────────── */
function Card({ event, isLeft }: { event: typeof EVENTS[0]; isLeft: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { autoAlpha: 0, x: isLeft ? -55 : 55 },
      { autoAlpha: 1, x: 0, ease: "none",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", end: "top 40%", scrub: 1.0 } }
    );
  }, { dependencies: [] });

  return (
    <div ref={cardRef} className="relative rounded-[1.25rem] overflow-hidden"
      style={{ border: "1px solid rgba(58,191,138,0.22)", padding: "1.75rem 2rem",
        background: "rgba(9,9,9,0.88)", backdropFilter: "blur(18px)" }}>
      {/* Top line */}
      <div className="absolute inset-x-0 top-0 h-px" style={{
        background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.50) 50%,transparent)" }} />

      <div className="flex items-center justify-between mb-3">
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.50rem",
          letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--teal)" }}>
          {event.year}
        </span>
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
          letterSpacing: "0.44em", textTransform: "uppercase", color: "var(--body)", opacity: 0.45 }}>
          {event.num}
        </span>
      </div>

      <h3 className="hed" style={{ fontSize: "clamp(1.3rem,2vw,1.75rem)", lineHeight: 1.1,
        color: "var(--fg)", marginBottom: "0.75rem" }}>
        {event.title}
      </h3>
      <p style={{ fontSize: "0.84rem", lineHeight: 1.88, color: "var(--body)" }}>
        {event.body}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────── */
function Header() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 44%", scrub: 1 } }
    );
  }, { dependencies: [] });
  return (
    <div ref={ref} className="mb-16">
      <p className="eyebrow mb-4">Our Story</p>
      <h2 className="hed" style={{ fontSize: "clamp(2.6rem,5.5vw,5rem)" }}>
        How we got{" "}
        <span className="script" style={{ color: "var(--teal)", fontStyle: "italic" }}>here.</span>
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function OurStory() {
  return (
    <section id="our-story" className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.72)" }}>
      <div className="wrap relative z-10">
        <Header />

        <div className="relative">
          {/* Continuous vertical line */}
          <div className="absolute pointer-events-none"
            style={{ top: 0, bottom: 0, left: "50%", width: 1,
              transform: "translateX(-50%)", zIndex: 0,
              background: "linear-gradient(to bottom,rgba(58,191,138,0.50) 0%,rgba(58,191,138,0.06) 100%)" }} />

          {EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 64px 1fr",
                  paddingTop: "2.25rem", paddingBottom: "2.25rem",
                  gap: "clamp(0.75rem,2.5vw,2rem)" }}>
                {isLeft ? <Card event={event} isLeft /> : <div />}
                <div className="flex items-center justify-center" style={{ zIndex: 2 }}>
                  <Dot index={i} />
                </div>
                {!isLeft ? <Card event={event} isLeft={false} /> : <div />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
