"use client";

import { useFadeUp, useRevealUp, useParallax } from "@/hooks/useScrollAnimation";

interface Service { id: string; title: string; description: string | null; icon: string | null; }

const FALLBACK: Service[] = [
  { id: "brand", title: "Brand Systems", description: "Names, identities, and visual logic that keeps every touchpoint coherent.", icon: "01" },
  { id: "product", title: "Digital Products", description: "Interfaces built to feel fast, clear, and unmistakably yours — from wireframe to launch.", icon: "02" },
  { id: "web", title: "Immersive Web", description: "Three.js, GSAP, and tactile interactions that make the browser feel spatial.", icon: "03" },
  { id: "motion", title: "Motion Identities", description: "Systems that move with intent — from logo behaviour to launch films.", icon: "04" },
];

function Row({ service, index }: { service: Service; index: number }) {
  const ref = useFadeUp(index * 0.06);
  return (
    <article ref={ref} className="group grid grid-cols-[48px_1fr] items-center gap-8 border-b border-white/8 py-10 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[72px_1fr_0.7fr] md:gap-10 md:px-4">
      <span className="font-mono text-[0.65rem] tracking-[0.3em] text-[var(--teal)]">{service.icon ?? String(index + 1).padStart(2, "0")}</span>
      <h3 className="display-text text-[clamp(1.6rem,3.5vw,3rem)] leading-none text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1">
        {service.title}
      </h3>
      <p className="col-span-2 text-sm leading-[1.85] text-[var(--text-muted)] md:col-span-1">{service.description}</p>
    </article>
  );
}

export default function Services({ services }: { services?: Service[] }) {
  const headRef = useRevealUp();
  const orbRef = useParallax(35, -35);
  const list = services?.length ? services : FALLBACK;

  return (
    <section id="services" className="relative overflow-hidden py-[var(--section-gap)]">
      <div ref={orbRef} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/3 h-[600px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(58,191,138,0.06),transparent_65%)] blur-[120px]" />

      <div className="wrap">
        <div ref={headRef} className="mb-4 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">Services</p>
            <h2 className="display-text text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
              Systems for<br />brands that move.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--text-muted)] md:mb-2 md:max-w-sm">
            Every engagement is a full system build — not a one-off deliverable.
          </p>
        </div>

        <div className="mt-4 border-t border-white/8">
          {list.map((s, i) => <Row key={s.id} service={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
