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
    <section id="about" className="relative border-y hairline py-24 md:py-32">
      <div className="section-shell grid gap-14 md:grid-cols-[1.25fr_0.75fr] md:items-end">
        <div ref={copyRef}>
          <p className="eyebrow mb-6">Studio</p>
          <h2 className="display-text max-w-4xl text-3xl leading-tight text-[var(--paper)] md:text-5xl">
            We design digital systems with enough personality to survive the scroll.
          </h2>
        </div>

        <div ref={statsRef} className="grid gap-6 sm:grid-cols-3 md:grid-cols-1">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-t hairline pt-4">
              <div className="display-text text-3xl text-[var(--paper)]">{metric.value}</div>
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
