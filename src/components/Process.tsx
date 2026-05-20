"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const steps = [
  { n: "01", title: "Intake", body: "We ask the right questions before the brief exists." },
  { n: "02", title: "Discovery", body: "We define the real job, audience, and constraints." },
  { n: "03", title: "Research", body: "We study the market and choose the strongest route." },
  { n: "04", title: "Proposal", body: "You get clear options, scope, trade-offs, and timing." },
  { n: "05", title: "Strategy", body: "We shape the UX, structure, references, and plan." },
  { n: "06", title: "Build", body: "We make the system work, then make it unforgettable." },
  { n: "07", title: "Launch", body: "We test, refine, ship, and support what comes next." },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardsWrap = cardsRef.current;
    if (!section || !cardsWrap) return;

    const cards = [...cardsWrap.querySelectorAll<HTMLElement>("[data-step]")];
    const line = cardsWrap.querySelector<HTMLElement>("[data-line]");

    const ctx = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 0, y: 42, scale: 0.96 });
      gsap.set(line, { scaleX: 0, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1800",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(line, { scaleX: 1, autoAlpha: 1, duration: 0.22, ease: "none" }, 0.04);
      cards.forEach((card, index) => {
        tl.to(
          card,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, ease: "none" },
          0.12 + index * 0.095
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative z-20 min-h-screen overflow-hidden border-t border-[var(--border)] bg-transparent"
    >
      <div className="relative z-30 flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow mb-5">Process</p>
          <h2 className="hed text-[clamp(3.2rem,7vw,7rem)] leading-[0.9]">
            From first call<br />to final launch.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(0.9rem,1.2vw,1rem)] leading-[1.8] text-[var(--body)]">
            A guided path from first questions to launch. Most projects land in the 1–2 month range.
          </p>
        </div>

        <div ref={cardsRef} className="relative mx-auto mt-14 w-full max-w-[1500px]">
          <div
            data-line
            className="pointer-events-none absolute left-4 right-4 top-1/2 hidden h-px origin-left bg-gradient-to-r from-transparent via-[rgba(58,191,138,0.62)] to-transparent lg:block"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {steps.map((step) => (
              <article
                key={step.n}
                data-step
                className="relative min-h-[230px] overflow-hidden rounded-[1.35rem] border border-[rgba(58,191,138,0.34)] bg-[rgba(9,9,9,0.88)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.36)] backdrop-blur-md"
              >
                <span className="absolute -right-2 -top-3 font-mono text-[4.5rem] font-black leading-none tracking-[-0.1em] text-[rgba(58,191,138,0.12)]">
                  {step.n}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[var(--teal)]">
                  {step.n}
                </span>
                <h3 className="hed mt-8 text-[clamp(1.2rem,1.7vw,1.7rem)] leading-[0.95]">
                  {step.title}
                </h3>
                <p className="mt-5 text-[0.82rem] leading-[1.6] text-[var(--fg)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
