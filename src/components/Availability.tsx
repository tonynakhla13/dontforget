"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

export default function Availability() {
  const ref = useFadeUp();

  return (
    <section className="relative border-y hairline py-[calc(var(--section-space)*0.8)]">
      <div
        ref={ref}
        className="section-shell grid gap-10 rounded-[32px] border hairline bg-[linear-gradient(135deg,rgba(248,243,234,0.04),rgba(0,200,176,0.08))] p-8 md:grid-cols-[1fr_auto] md:items-end md:p-10"
      >
        <div>
          <p className="eyebrow mb-6">Availability</p>
          <h2 className="display-text max-w-3xl text-4xl leading-[0.98] text-[var(--paper)] md:text-6xl">
            Taking on a small number of focused builds this season.
          </h2>
        </div>

        <a
          href="#contact"
          className="inline-flex w-fit items-center rounded-full bg-[var(--teal)] px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1"
        >
          Start a project
        </a>
      </div>
    </section>
  );
}
