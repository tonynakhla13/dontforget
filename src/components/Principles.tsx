"use client";

import { useRevealUp, useStaggerChildren } from "@/hooks/useScrollAnimation";

const rules = [
  {
    n: "01",
    title: "Clarity over clutter",
    body: "If it doesn't sharpen the message, it doesn't make the cut. Yes, even if it looks cool.",
  },
  {
    n: "02",
    title: "Motion with intent",
    body: "Animation should reveal, not distract. Every frame earns its place or it doesn't ship.",
  },
  {
    n: "03",
    title: "Systems over one-offs",
    body: "We build things that outlive the launch party. The logic is as strong as the visuals.",
  },
  {
    n: "04",
    title: "Honesty by default",
    body: "We'll tell you when your brief needs work. You won't always love us for it. You will eventually.",
  },
];

export default function Principles() {
  const headRef  = useRevealUp();
  const cardsRef = useStaggerChildren(0.1, 0.09);

  return (
    <section className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">
        <div ref={headRef} className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">The Rules</p>
            <h2 className="hed text-[clamp(2.8rem,6.5vw,7rem)]">
              Not guidelines.<br />Rules.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--body)] md:mb-2 md:max-w-xs">
            Every decision goes through these filters first. We&apos;ve learned the hard way why each one matters.
          </p>
        </div>

        <div ref={cardsRef} className="grid gap-px md:grid-cols-2">
          {rules.map((r) => (
            <div
              key={r.n}
              className="group relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-10 transition-all duration-300 hover:border-[var(--teal-mid)] hover:bg-[var(--teal-faint)]"
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--teal)] transition-transform duration-500 group-hover:scale-x-100" />
              <span className="eyebrow">{r.n}</span>
              <h3 className="hed mt-7 text-[clamp(1.4rem,2.4vw,2rem)] text-[var(--fg)]">
                {r.title}
              </h3>
              <p className="mt-4 text-sm leading-[1.85] text-[var(--body)]">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
