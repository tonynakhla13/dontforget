"use client";

import { useRevealUp, useStaggerChildren } from "@/hooks/useScrollAnimation";

const steps = [
  { n: "01", title: "Frame", body: "We define the signal: audience, offer, references, constraints, and the feeling the work needs to leave behind." },
  { n: "02", title: "Shape", body: "Identity, interface, motion, and system rules are designed together so every surface speaks the same language." },
  { n: "03", title: "Launch", body: "We build the live experience, tune the details, and leave behind a system your team can keep extending." },
];

export default function Process() {
  const headRef = useRevealUp();
  const stepsRef = useStaggerChildren(0.1, 0.12);

  return (
    <section className="relative overflow-hidden border-y border-white/8 py-[var(--section-gap)]">
      <div className="wrap">
        <div ref={headRef} className="mb-20 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">Process</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              First signal.<br />Finished system.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--text-muted)] md:mb-2 md:max-w-sm">
            Three focused phases. No retainers with vague deliverables.
          </p>
        </div>

        <div ref={stepsRef} className="grid gap-px md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col border-t border-white/8 pt-10 md:pr-12">
              <span className="display-text mb-10 text-[clamp(4rem,9vw,8rem)] leading-none text-[rgba(58,191,138,0.15)]">
                {s.n}
              </span>
              <h3 className="display-text text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--paper)]">{s.title}</h3>
              <p className="mt-5 text-sm leading-[1.85] text-[var(--text-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
