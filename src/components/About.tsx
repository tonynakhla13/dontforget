"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

const metrics = [
  { value: "14", label: "systems shipped" },
  { value: "06", label: "countries reached" },
  { value: "48h", label: "first concept sprint" },
];

export default function About() {
  const copyRef = useFadeUp();
  const statsRef = useFadeUp(0.12);

  return (
    <section
      id="about"
      className="relative flex min-h-[72vh] scroll-mt-28 items-center border-y hairline py-[var(--section-space)]"
    >
      <div className="section-shell grid gap-20 md:grid-cols-[1.15fr_0.85fr] md:items-end lg:gap-32">
        <div ref={copyRef}>
          <p className="eyebrow mb-6">Studio</p>
          <h2 className="display-text max-w-4xl text-4xl leading-tight text-[var(--paper)] md:text-6xl">
            We design digital systems with enough personality to survive the scroll.
          </h2>
        </div>

        <div ref={statsRef} className="grid gap-10 sm:grid-cols-3 md:grid-cols-1">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-t hairline pt-5">
              <div className="display-text text-4xl text-[var(--paper)]">{metric.value}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--text-dark)]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
