"use client";

import { useRevealUp, useStaggerChildren } from "@/hooks/useScrollAnimation";

const items = [
  { n: "01", title: "Clarity over clutter", body: "Every layer has a job. If it does not sharpen the message, it leaves the frame." },
  { n: "02", title: "Motion with intent", body: "Animation should reveal hierarchy and create memory — never beg for attention." },
  { n: "03", title: "Systems, not one-offs", body: "The best work survives beyond launch because the logic behind it is as strong as the visuals." },
  { n: "04", title: "Built to be felt", body: "Good digital work is not only seen. It has pace, pressure, rhythm, and restraint." },
];

export default function Principles() {
  const headRef = useRevealUp();
  const cardsRef = useStaggerChildren(0.1, 0.09);

  return (
    <section className="relative overflow-hidden py-[var(--section-gap)]">
      <div className="wrap">
        <div ref={headRef} className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">Principles</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              The rules<br />behind the work.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--text-muted)] md:mb-2 md:max-w-sm">
            Not guidelines. Rules. Every decision we make goes through these filters first.
          </p>
        </div>

        <div ref={cardsRef} className="grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <div
              key={p.n}
              className="group relative overflow-hidden rounded-[var(--card-radius)] border border-white/8 bg-[var(--surface)] p-10 transition-all duration-400 hover:border-[rgba(58,191,138,0.22)]"
            >
              <div className="absolute left-0 right-0 top-0 h-px origin-left scale-x-0 bg-[var(--teal)] transition-transform duration-500 group-hover:scale-x-100" />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--teal)]">{p.n}</span>
              <h3 className="display-text mt-6 text-[clamp(1.4rem,2.5vw,2rem)] text-[var(--paper)]">{p.title}</h3>
              <p className="mt-4 text-sm leading-[1.85] text-[var(--text-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
