"use client";

import { useRevealUp } from "@/hooks/useScrollAnimation";

export default function Availability() {
  const ref = useRevealUp();

  return (
    <section className="relative overflow-hidden border-y border-white/8 section-py">
      <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(58,191,138,0.09),transparent_65%)] blur-[120px]" />

      <div ref={ref} className="wrap">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow mb-8">Availability</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              Taking on focused<br />builds this season.
            </h2>
            <p className="mt-8 max-w-lg text-[0.9375rem] leading-[1.85] text-[var(--text-muted)]">
              We work with a limited number of clients at a time to ensure every project gets the depth it deserves. Slots are limited.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <a href="#contact" className="btn btn-primary">Start a project →</a>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--text-muted)]">Response within 24h</span>
          </div>
        </div>
      </div>
    </section>
  );
}
