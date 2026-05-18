"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

const services = [
  {
    number: "01",
    title: "Brand systems",
    description: "Names, identities, rules, and visual logic that keep every touchpoint coherent.",
  },
  {
    number: "02",
    title: "Digital products",
    description: "Interfaces and flows built to feel fast, clear, and unmistakably yours.",
  },
  {
    number: "03",
    title: "Immersive web",
    description: "Three.js, GSAP, and tactile interactions that make the browser feel spatial.",
  },
  {
    number: "04",
    title: "Motion identities",
    description: "Systems that move with intent—from logo behavior to launch films.",
  },
];

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const ref = useFadeUp(index * 0.08);

  return (
    <article
      ref={ref}
      className="group grid gap-4 border-t hairline py-6 transition-colors duration-300 md:grid-cols-[80px_1fr_1fr] md:items-start"
    >
      <span className="font-mono text-xs tracking-[0.28em] text-[var(--teal)]">
        {service.number}
      </span>
      <h3 className="display-text text-2xl text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
        {service.title}
      </h3>
      <p className="max-w-md leading-7 text-[var(--text-dark)]">{service.description}</p>
    </article>
  );
}

export default function Services() {
  const titleRef = useFadeUp();

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="section-shell grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div ref={titleRef}>
          <p className="eyebrow mb-6">Services</p>
          <h2 className="display-text max-w-md text-3xl leading-tight text-[var(--paper)] md:text-5xl">
            Systems for brands that move.
          </h2>
        </div>

        <div>
          {services.map((service, index) => (
            <ServiceRow key={service.number} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
