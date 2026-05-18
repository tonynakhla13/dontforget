"use client";

import { useRevealUp } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries reached" },
  { value: "0",   label: "Boring websites made" },
];

export default function About() {
  const ref = useRevealUp();

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center section-py overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Vignette keeps text readable over the blob */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(9,9,9,0.6) 100%)",
        }}
      />

      <div ref={ref} className="relative z-10 wrap text-center">
        <p className="eyebrow mb-10">About us</p>

        <h2 className="hed mx-auto max-w-4xl text-[clamp(3rem,7vw,8rem)] leading-[0.9]">
          We design systems<br />
          with enough{" "}
          <span
            className="italic normal-case"
            style={{
              fontFamily: "var(--font-script-next)",
              fontSize: "1.05em",
              color: "var(--teal)",
            }}
          >
            personality
          </span>
          <br />
          to survive the scroll.
        </h2>

        <p className="mx-auto mt-10 max-w-xl text-[0.9375rem] leading-[1.85] text-[var(--body)]">
          We&apos;re a small studio that makes big things. Not a factory, not a
          freelancer — something in between, with better taste than both.
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-12 md:gap-20">
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
