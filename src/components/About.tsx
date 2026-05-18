"use client";

import { useRevealUp, useStaggerChildren, useParallax } from "@/hooks/useScrollAnimation";

const metrics = [
  { value: "14+", label: "Systems shipped" },
  { value: "6", label: "Countries" },
  { value: "48h", label: "First concept" },
];

export default function About() {
  const headRef = useRevealUp();
  const statsRef = useStaggerChildren(0, 0.12);
  const hexRef = useParallax(-30, 30);

  return (
    <section id="about" className="relative overflow-hidden py-[var(--section-gap)]">
      {/* Hex */}
      <div ref={hexRef} aria-hidden="true" className="pointer-events-none absolute -right-20 top-0 opacity-[0.1]">
        <svg width="480" height="480" viewBox="0 0 100 100" fill="none">
          <polygon points="50,3 91,26 91,74 50,97 9,74 9,26" stroke="#3abf8a" strokeWidth="0.6" fill="none" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="wrap">
        <div className="grid gap-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-32">
          {/* Headline */}
          <div ref={headRef}>
            <p className="eyebrow mb-8">Studio</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              We design digital systems with enough personality to survive the scroll.
            </h2>
            <p className="mt-8 max-w-lg text-[1rem] leading-[1.9] text-[var(--text-muted)]">
              DON&apos;T FORGET is a focused web development studio. We build fast, scalable, and memorable digital experiences that help brands grow in the digital world.
            </p>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid gap-0 border-t border-white/8">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-end justify-between border-b border-white/8 py-8">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {m.label}
                </span>
                <span className="display-text text-[clamp(2.8rem,6vw,5rem)] text-[var(--teal)]">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
