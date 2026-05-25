"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const stats = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries reached" },
  { value: "24h", label: "Average response" },
  { value: "0",   label: "Boring websites made", featured: true },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const copy = copyRef.current;
    const statsWrap = statsRef.current;
    if (!section || !eyebrow || !heading || !copy || !statsWrap) return;

    const lines = heading.querySelectorAll("[data-line]");
    const statItems = statsWrap.children;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2200",
          scrub: 1,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })
        .fromTo(eyebrow, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "none" }, 0)
        .fromTo(
          lines,
          { autoAlpha: 0, yPercent: 115, rotateX: -18 },
          { autoAlpha: 1, yPercent: 0, rotateX: 0, stagger: 0.1, duration: 0.34, ease: "none" },
          0.08
        )
        .fromTo(copy, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "none" }, 0.42)
        .to({}, { duration: 0.18 })
        .fromTo(
          statItems,
          {
            autoAlpha: 0,
            y: 46,
            scale: 0.88,
            boxShadow: "0 0 0 rgba(58,191,138,0)",
            borderColor: "rgba(58,191,138,0.16)",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            boxShadow: "0 0 48px rgba(58,191,138,0.38), 0 0 96px rgba(58,191,138,0.14)",
            borderColor: "rgba(58,191,138,0.72)",
            stagger: 0.18,
            duration: 0.22,
            ease: "none",
          },
          0.72
        )
        .fromTo(
          statItems[statItems.length - 1],
          { x: 0 },
          { x: 10, repeat: 5, yoyo: true, duration: 0.035, ease: "none" },
          1.25
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center section-py overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 66% 62% at 50% 48%, transparent 0%, rgba(9,9,9,0.2) 76%, rgba(9,9,9,0.46) 100%)",
        }}
      />

      {/* Stat boxes — positioned relative to the section (min-h-screen) so
          top/bottom % values span the full viewport height, not just the
          text-content height of the inner .wrap div. */}
      <div
        ref={statsRef}
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden="true"
      >
        {stats.map((s) => (
          <div
            key={s.value}
            className={`absolute flex min-w-[180px] flex-col gap-2 rounded-[1.2rem] border bg-[rgba(9,9,9,0.72)] px-6 py-5 backdrop-blur-md ${
              s.featured
                ? "min-w-[200px] border-[var(--teal)] bg-[rgba(58,191,138,0.96)] px-7 py-6 shadow-[0_0_48px_rgba(58,191,138,0.55),0_0_96px_rgba(58,191,138,0.22)]"
                : "border-[rgba(58,191,138,0.38)] shadow-[0_0_36px_rgba(58,191,138,0.28),0_0_72px_rgba(58,191,138,0.10),0_12px_40px_rgba(0,0,0,0.5)]"
            }`}
            style={
              s.value === "14+"
                ? { left: "5%", top: "31%" }
                : s.value === "6"
                  ? { right: "5%", top: "31%" }
                  : s.value === "24h"
                    ? { left: "5%", bottom: "31%" }
                    : { right: "5%", bottom: "31%" }
            }
          >
            <span
              className={`hed text-[clamp(2rem,4vw,4rem)] text-[var(--teal)] ${
                s.featured ? "!text-white" : ""
              }`}
            >
              {s.value}
            </span>
            <span
              className={`font-mono text-[0.55rem] uppercase tracking-[0.32em] ${
                s.featured ? "text-white" : "text-[var(--body)]"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 wrap text-center">
        <p ref={eyebrowRef} className="eyebrow mb-10">About us</p>

        <h2
          ref={headingRef}
          className="hed mx-auto max-w-5xl text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1.15] [perspective:900px]"
        >
          <span data-line className="block overflow-hidden md:whitespace-nowrap">
            We design systems
          </span>
          <span data-line className="block overflow-hidden md:whitespace-nowrap">
            with enough{" "}
            <span className="script text-[1.05em]">Personality</span>
          </span>
          <span data-line className="block overflow-hidden md:whitespace-nowrap">
            to survive the{" "}
            <span className="text-[var(--teal)]">scroll.</span>
          </span>
        </h2>

        <p
          ref={copyRef}
          className="mx-auto mt-10 max-w-xl text-[0.9375rem] leading-[1.85] text-[var(--body)]"
        >
          We&apos;re a small studio that makes big things. Not a factory, not a
          freelancer — something in between, with better taste than both.
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-12 md:hidden">
          {stats.map((s) => (
            <div key={s.value} className="flex flex-col items-center gap-2">
              <span className="hed text-[clamp(3rem,6vw,6rem)] text-[var(--teal)]">
                {s.value}
              </span>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.38em] text-[var(--body)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
