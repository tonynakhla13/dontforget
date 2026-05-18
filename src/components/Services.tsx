"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

const FALLBACK_SERVICES: Service[] = [
  {
    id: "brand-systems",
    title: "Brand systems",
    description: "Names, identities, rules, and visual logic that keep every touchpoint coherent.",
    icon: "✦",
  },
  {
    id: "digital-products",
    title: "Digital products",
    description: "Interfaces and flows built to feel fast, clear, and unmistakably yours.",
    icon: "⟡",
  },
  {
    id: "immersive-web",
    title: "Immersive web",
    description: "Three.js, GSAP, and tactile interactions that make the browser feel spatial.",
    icon: "◈",
  },
  {
    id: "motion-identities",
    title: "Motion identities",
    description: "Systems that move with intent—from logo behavior to launch films.",
    icon: "◎",
  },
];

function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const ref = useFadeUp(index * 0.08);

  return (
    <article
      ref={ref}
      className="group grid gap-5 border-t hairline py-8 transition-colors duration-300 md:grid-cols-[88px_1fr_1fr] md:items-start"
    >
      <span className="font-mono text-xs tracking-[0.28em] text-[var(--teal)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="display-text text-2xl text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
        {service.title}
      </h3>
      <p className="max-w-md leading-7 text-[var(--text-dark)]">
        {service.description}
      </p>
    </article>
  );
}

export default function Services({ services }: { services?: Service[] }) {
  const titleRef = useFadeUp();
  const list = services && services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section
      id="services"
      className="relative flex min-h-screen scroll-mt-28 items-center py-[var(--section-space)]"
    >
      <div className="section-shell grid gap-20 md:grid-cols-[0.8fr_1.2fr] lg:gap-28">
        <div ref={titleRef}>
          <p className="eyebrow mb-6">Services</p>
          <h2 className="display-text max-w-md text-3xl leading-tight text-[var(--paper)] md:text-5xl">
            Systems for brands that move.
          </h2>
        </div>

        <div className="space-y-3">
          {list.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
