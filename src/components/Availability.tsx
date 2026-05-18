"use client";

import { useRevealUp } from "@/hooks/useScrollAnimation";

export default function Availability() {
  const ref = useRevealUp();

  return (
    <section className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div ref={ref} className="wrap">
        <div className="grid gap-16 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow mb-10">Availability</p>
            <h2 className="hed text-[3.2rem]">
              We take 3–4<br />
              projects per<br />
              <span className="text-[var(--teal)]">quarter.</span>
            </h2>
            <p className="mt-9 max-w-md text-[0.9375rem] leading-[1.9] text-[var(--body)]">
              Not because we&apos;re being precious about it. Because good work takes
              time and we don&apos;t half-ass things.
            </p>
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[var(--teal)]">
              — Currently: 2 spots open
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <a href="#contact" className="btn btn-primary">
              Start a project →
            </a>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--body)]">
              Response within 24h
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
