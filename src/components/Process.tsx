"use client";

import { useRevealUp, useStaggerChildren } from "@/hooks/useScrollAnimation";

const steps = [
  {
    n: "01",
    title: "Frame",
    body: "We ask a lot of questions. More than feels comfortable. Then we actually listen — which, in this industry, is apparently rare.",
  },
  {
    n: "02",
    title: "Build",
    body: "This is the obsessive part. The details-nobody-notices-but-everybody-feels part. Do not disturb.",
  },
  {
    n: "03",
    title: "Ship",
    body: "Live, tested, polished. And we stick around after launch — which shouldn't be a flex, but here we are.",
  },
];

export default function Process() {
  const headRef  = useRevealUp();
  const stepsRef = useStaggerChildren(0.1, 0.1);

  return (
    <section id="process" className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">
        <div ref={headRef} className="mb-20 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">Process</p>
            <h2 className="hed text-[3rem]">
              First signal.<br />
              Finished system.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--body)] md:mb-2 md:max-w-xs">
            Three focused phases. No retainers with vague deliverables and even vaguer timelines.
          </p>
        </div>

        <div ref={stepsRef} className="grid gap-0 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col border-t border-[var(--border)] pt-10 pb-2 md:pr-14"
            >
              <span className="hed text-[5rem] leading-none text-[var(--teal)] opacity-[0.12]">
                {s.n}
              </span>
              <h3 className="hed mt-4 text-[1.6rem] text-[var(--fg)]">
                {s.title}
              </h3>
              <p className="mt-5 text-sm leading-[1.85] text-[var(--body)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
