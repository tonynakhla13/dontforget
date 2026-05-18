"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Frame",
    description:
      "We define the signal: audience, offer, references, constraints, and the feeling the work needs to leave behind.",
  },
  {
    number: "02",
    title: "Shape",
    description:
      "Identity, interface, motion, and system rules are designed together so every surface speaks the same language.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "We build the live experience, tune the details, and leave behind a system your team can keep extending.",
  },
];

function ProcessStep({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useFadeUp(index * 0.08);

  return (
    <article ref={ref} className="border-t hairline pt-6">
      <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--teal)]">
        {step.number}
      </div>
      <h3 className="display-text mt-8 text-3xl text-[var(--paper)] md:text-4xl">
        {step.title}
      </h3>
      <p className="mt-5 max-w-sm text-base leading-8 text-[var(--text-dark)]">
        {step.description}
      </p>
    </article>
  );
}

export default function Process() {
  const titleRef = useFadeUp();

  return (
    <section className="relative border-y hairline py-[calc(var(--section-space)*1.1)]">
      <div className="section-shell">
        <div ref={titleRef} className="max-w-3xl">
          <p className="eyebrow mb-6">Process</p>
          <h2 className="display-text text-4xl leading-[0.98] text-[var(--paper)] md:text-6xl">
            From first signal to finished system.
          </h2>
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ProcessStep key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
