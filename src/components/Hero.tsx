"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const headline = ["We build", "what stays", "with people."];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.2 })
        .from(lineRefs.current, {
          y: 28,
          stagger: 0.12,
          duration: 1,
          ease: "power4.out",
        })
        .from(
          copyRef.current,
          {
            y: 18,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .from(
          ctaRef.current,
          {
            y: 16,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .from(
          metaRef.current,
          {
            y: 14,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen items-end overflow-hidden pb-14 pt-36 md:items-center md:pb-16 md:pt-40"
    >
      <div className="absolute inset-0 -z-20">
        <HeroScene />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_48%,rgba(0,200,176,0.18),transparent_26%),radial-gradient(circle_at_74%_48%,rgba(248,243,234,0.06),transparent_18%),linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.9)_42%,rgba(5,5,5,0.42)_100%)]" />

      <div className="section-shell grid gap-16 md:grid-cols-[0.95fr_1.05fr] md:items-end lg:gap-24">
        <div className="relative z-10 max-w-3xl">
          <h1 className="display-text text-[clamp(2.7rem,7vw,5.8rem)] leading-[0.88] tracking-[-0.05em] text-[var(--paper)]">
            {headline.map((line, index) => (
              <span key={line} className="block pb-2">
                <span
                  ref={(element) => {
                    lineRefs.current[index] = element;
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            ref={copyRef}
            className="mt-9 max-w-xl text-base leading-8 text-[var(--text-dark)] md:text-lg"
          >
            Strategy, design, code, and motion for brands that refuse to blur into the
            background.
          </p>

          <div ref={ctaRef} className="mt-11 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-[var(--teal)] px-6 py-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1"
            >
              Start a project
            </a>
            <a
              href="#work"
              className="rounded-full border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--paper)] transition-all duration-300 hover:border-[rgba(0,200,176,0.55)] hover:text-[var(--teal)]"
            >
              View work
            </a>
          </div>
        </div>

        <div
          ref={metaRef}
          className="relative z-10 flex flex-col gap-5 self-end border-t hairline pt-6 text-[var(--text-dark)] md:justify-self-end md:text-right"
        >
          <span className="font-mono text-xs uppercase tracking-[0.28em]">Creative systems studio</span>
          <span className="max-w-xs text-sm leading-7">
            Built for identities, websites, and products that need memory—not noise.
          </span>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[var(--text-dark)] md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.36em]">Scroll</span>
        <span className="h-16 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </div>
    </section>
  );
}
