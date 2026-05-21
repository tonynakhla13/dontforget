"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
  { year: "2022", num: "01", title: "Founded",             body: "DON'T FORGET was born out of frustration. Too many agencies building forgettable work. We set out to change that — a small team with an unreasonably high bar." },
  { year: "2022", num: "02", title: "First client",        body: "A high-converting landing page for a fashion brand. Two weeks, start to finish. The client tripled their conversion rate in month one." },
  { year: "2023", num: "03", title: "Mobile practice",     body: "Expanded into iOS and Android. Our first app shipped to the App Store and got featured by Apple in its first week." },
  { year: "2023", num: "04", title: "10 projects",         body: "Ten live projects across three countries. Every one built from scratch, designed with intent, shipped on time. No templates. No shortcuts." },
  { year: "2024", num: "05", title: "E-commerce",          body: "Full e-commerce practice launched — Shopify, WooCommerce, and fully custom storefronts. The SEO-first approach started compounding fast." },
  { year: "2024", num: "06", title: "CRM & systems",       body: "First custom CRM built for a travel platform. Engineer-minded precision became our standard — and our edge over every other studio." },
  { year: "2025", num: "07", title: "SEO & AI search",     body: "Launched AI-powered search and marketing. Results most agencies call impossible. We just call it doing the work properly." },
  { year: "2025", num: "08", title: "6 countries",         body: "Projects live in 6 countries. 14+ clients. Zero boring websites. Staying small on purpose — every client gets the A-team." },
];

const N = EVENTS.length;

// Dot x-position as % of full viewport width (10% → 90%)
const dotX = (i: number) => 10 + (i / (N - 1)) * 80;

export default function OurStory() {
  const outerRef    = useRef<HTMLDivElement>(null);
  const introRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const dots  = dotsRef.current.filter((d): d is HTMLDivElement => d !== null);
    const cards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null);
    if (dots.length !== N || cards.length !== N) return;

    // Initial states
    gsap.set(cards, { autoAlpha: 0, y: -14 });
    gsap.set(dots,  { scale: 1 });
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

      // Fade intro header
      tl.to(introRef.current, { autoAlpha: 0, y: -24, duration: 0.06, ease: "none" });

      EVENTS.forEach((_, i) => {
        const dot    = dots[i];
        const card   = cards[i];
        const isLast = i === N - 1;
        const prog   = i / (N - 1);

        // Progress line catches up to this dot
        tl.to(progressRef.current, { scaleX: prog, duration: 0.05, ease: "none" });

        // Activate dot — ring pulse effect
        tl.to(dot, {
          scale: 2,
          boxShadow: "0 0 0 3px rgba(9,9,9,1), 0 0 0 5px rgba(58,191,138,0.9), 0 0 20px rgba(58,191,138,0.55)",
          duration: 0.05, ease: "none",
        }, "<");

        // Show card
        tl.to(card, { autoAlpha: 1, y: 0, duration: 0.06, ease: "none" }, "<0.01");

        // Hold
        tl.to({}, { duration: isLast ? 0.22 : 0.10 });

        // Exit (not last)
        if (!isLast) {
          tl.to(card, { autoAlpha: 0, y: -12, duration: 0.05, ease: "none" });
          tl.to(dot,  { scale: 1, boxShadow: "none", duration: 0.04, ease: "none" }, "<");
        }
      });

      // Fill line to end
      tl.to(progressRef.current, { scaleX: 1, duration: 0.03, ease: "none" });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative border-t border-[var(--border)]"
      style={{ minHeight: "480vh", background: "rgba(9,9,9,0.72)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "transparent" }}>

        {/* Readability gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(9,9,9,0.18) 0%, rgba(9,9,9,0.62) 100%)" }}
        />

        {/* ── Section header (fades out as timeline begins) ── */}
        <div ref={introRef} className="absolute top-0 left-0 right-0 wrap pt-28 z-10">
          <p className="eyebrow mb-4">Our Story</p>
          <h2 className="hed text-[clamp(2.8rem,5.5vw,4.5rem)]">
            How we got{" "}
            <span className="text-[var(--teal)]">here.</span>
          </h2>
        </div>

        {/* Cards — each floats above its dot */}
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            ref={el => { cardsRef.current[i] = el; }}
            className="absolute"
            style={{
              left: `${dotX(i)}%`,
              bottom: `calc(36% + 32px)`,
              transform: "translateX(-50%)",
              width: 218,
              visibility: "hidden",
            }}
          >
            {/* Card body */}
            <div
              className="relative rounded-[1rem] border border-[rgba(58,191,138,0.28)] p-5"
              style={{ background: "rgba(9,9,9,0.9)", backdropFilter: "blur(14px)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px rounded-t-[1rem] bg-gradient-to-r from-transparent via-[rgba(58,191,138,0.45)] to-transparent" />
              <span className="font-mono text-[0.44rem] uppercase tracking-[0.44em] text-[var(--teal)] block mb-2.5">
                {ev.num}
              </span>
              <h3 className="hed text-[0.95rem] leading-[1.1] text-[var(--fg)] mb-3">
                {ev.title}
              </h3>
              <p className="text-[0.75rem] leading-[1.78] text-[var(--body)]">
                {ev.body}
              </p>
            </div>

            {/* Connector: card bottom → dot */}
            <div
              className="absolute left-1/2"
              style={{
                bottom: -32,
                width: 1,
                height: 32,
                transform: "translateX(-50%)",
                background: "linear-gradient(to bottom, rgba(58,191,138,0.6), rgba(58,191,138,0.15))",
              }}
            />
          </div>
        ))}

        {/* ── Horizontal line at 64% from top ── */}
        <div
          className="absolute"
          style={{ left: 0, right: 0, bottom: "36%", height: 1 }}
        >
          {/* Gray base */}
          <div className="absolute inset-0" style={{ background: "rgba(58,191,138,0.16)" }} />
          {/* Teal progress */}
          <div
            ref={progressRef}
            className="absolute inset-0 origin-left"
            style={{ background: "var(--teal)", transform: "scaleX(0)" }}
          />
        </div>

        {/* ── Dots + Year labels ── */}
        {EVENTS.map((ev, i) => (
          <div key={i}>
            {/* Dot */}
            <div
              ref={el => { dotsRef.current[i] = el; }}
              className="absolute rounded-full"
              style={{
                left: `${dotX(i)}%`,
                bottom: "36%",
                transform: "translate(-50%, 50%)",
                width: 11, height: 11,
                background: "var(--teal)",
                transformOrigin: "center center",
                zIndex: 2,
              }}
            />

            {/* Year label */}
            <div
              className="absolute font-mono"
              style={{
                left: `${dotX(i)}%`,
                bottom: "calc(36% - 22px)",
                transform: "translateX(-50%)",
                fontSize: "0.46rem",
                letterSpacing: "0.32em",
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
          <span className="font-mono text-[0.44rem] uppercase tracking-[0.38em] text-[var(--body)]">
            Scroll to explore
          </span>
          <div className="h-5 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
        </div>

      </div>
    </div>
  );
}
