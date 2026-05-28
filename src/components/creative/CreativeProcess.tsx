"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STEPS = [
  { n: "01", title: "Intake",    body: "We ask the right questions before the brief exists." },
  { n: "02", title: "Discovery", body: "We define the real job, audience, and constraints." },
  { n: "03", title: "Research",  body: "We study the market and choose the strongest route." },
  { n: "04", title: "Proposal",  body: "You get clear options, scope, trade-offs, and timing." },
  { n: "05", title: "Strategy",  body: "We shape the UX, structure, references, and plan." },
  { n: "06", title: "Build",     body: "We make the system work, then make it unforgettable." },
  { n: "07", title: "Launch",    body: "We test, refine, ship, and support what comes next." },
];

function Connector({ fromLeft }: { fromLeft: boolean }) {
  return (
    <div className="c-proc-connector" aria-hidden="true">
      <svg viewBox="0 0 100 60" fill="none" width="100%" height="60">
        <path
          d={fromLeft
            ? "M 29 0 C 29 30, 71 30, 71 60"
            : "M 71 0 C 71 30, 29 30, 29 60"
          }
          stroke="rgba(35,31,32,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx={fromLeft ? 71 : 29} cy={60} r={3} fill="#46D12A" />
      </svg>
    </div>
  );
}

export default function CreativeProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const steps = [...section.querySelectorAll<HTMLElement>("[data-step]")];
    const connectors = [...section.querySelectorAll<HTMLElement>(".c-proc-connector")];

    const ctx = gsap.context(() => {
      // Initial hidden state
      gsap.set(steps, { autoAlpha: 0, y: 60, scale: 0.92, rotateX: 8 });
      gsap.set(connectors, { autoAlpha: 0, scaleY: 0, transformOrigin: "top center" });

      steps.forEach((step, i) => {
        const isLeft = i % 2 === 0;

        // Card entrance
        gsap.to(step, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          x: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: step,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        // Connector reveal after card
        if (connectors[i]) {
          gsap.to(connectors[i], {
            autoAlpha: 1,
            scaleY: 1,
            duration: 0.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: step,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Subtle x drift per side
        gsap.fromTo(
          step,
          { x: isLeft ? -30 : 30 },
          {
            x: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="c-process">

      {/* ── Background decorations ── */}
      <div className="c-process__bg-ring c-process__bg-ring--lg" aria-hidden="true" />
      <div className="c-process__bg-ring c-process__bg-ring--sm" aria-hidden="true" />
      <div className="c-process__bg-star"  aria-hidden="true" />
      <div className="c-process__bg-grain" aria-hidden="true" />

      <div className="c-process__inner">

        {/* ── LEFT: sticky heading ── */}
        <div className="c-process__aside">
          <span className="c-process__label">— OUR PROCESS</span>
          <h2 className="c-process__title">
            <span>HOW</span>
            <span className="c-process__title-row2">
              <span className="c-process__title-star" aria-hidden="true" />
              <span>WE</span>
            </span>
            <span>WORK</span>
          </h2>
          <p className="c-process__desc">
            A guided path — from the first question to final launch. Most projects
            land in the 1–2 month range.
          </p>
          <div className="c-process__count">
            <span className="c-process__count-n">07</span>
            <span className="c-process__count-l">STEPS</span>
          </div>
        </div>

        {/* ── RIGHT: scrolling zigzag cards ── */}
        <div className="c-process__flow">
          {STEPS.map((step, i) => (
            <div key={step.n}>
              <div
                data-step
                className={`c-proc-step c-proc-step--${i % 2 === 0 ? "a" : "b"}`}
              >
                <article className="c-proc-card">
                  <span className="c-proc-card__ghost" aria-hidden="true">{step.n}</span>
                  <span className="c-proc-card__num">{step.n}</span>
                  <h3 className="c-proc-card__title">{step.title}</h3>
                  <p className="c-proc-card__body">{step.body}</p>
                  <div className="c-proc-card__corner" aria-hidden="true" />
                </article>
              </div>
              {i < STEPS.length - 1 && <Connector fromLeft={i % 2 === 0} />}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
