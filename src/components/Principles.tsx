"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

const principles = [
  {
    title: "Clarity over clutter",
    body: "Every layer has a job. If it does not sharpen the message, it leaves the frame.",
  },
  {
    title: "Motion with intent",
    body: "Animation should reveal hierarchy, create memory, and never ask for attention it has not earned.",
  },
  {
    title: "Systems, not one-offs",
    body: "The best work survives beyond launch because the logic behind it is as strong as the visuals.",
  },
  {
    title: "Built to be felt",
    body: "Good digital work is not only seen. It has pace, pressure, rhythm, and restraint.",
  },
];

function PrincipleCard({
  principle,
  index,
}: {
  principle: (typeof principles)[number];
  index: number;
}) {
  const ref = useFadeUp(index * 0.08);

  return (
    <article
      ref={ref}
      className="rounded-[28px] border hairline bg-white/[0.02] p-7 md:p-8"
    >
      <h3 className="display-text text-3xl text-[var(--paper)]">
        {principle.title}
      </h3>
      <p className="mt-5 max-w-md text-base leading-8 text-[var(--text-dark)]">
        {principle.body}
      </p>
    </article>
  );
}

export default function Principles() {
  const titleRef = useFadeUp();

  return (
    <section className="relative py-[calc(var(--section-space)*1.05)]">
      <div className="section-shell grid gap-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-32">
        <div ref={titleRef}>
          <p className="eyebrow mb-6">Principles</p>
          <h2 className="display-text max-w-xl text-4xl leading-[0.98] text-[var(--paper)] md:text-6xl">
            The rules behind the work.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((principle, index) => (
            <PrincipleCard
              key={principle.title}
              principle={principle}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
