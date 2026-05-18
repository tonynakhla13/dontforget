"use client";

import { useFadeUp, useRevealUp } from "@/hooks/useScrollAnimation";

interface Service { id: string; title: string; description: string | null; icon: string | null; }

const FALLBACK: Service[] = [
  {
    id: "brand",
    title: "Brand Systems",
    description: "Because \"we'll figure out the logo later\" isn't a strategy. We build identities that hold together at every scale.",
    icon: "01",
  },
  {
    id: "product",
    title: "Digital Products",
    description: "Interfaces so intuitive your users won't notice how much thought went into them. (A lot. A lot of thought.)",
    icon: "02",
  },
  {
    id: "web",
    title: "Immersive Web",
    description: "Three.js, GSAP, and the kind of scroll animations that make people say \"wait, how did they do that.\"",
    icon: "03",
  },
  {
    id: "motion",
    title: "Motion Identity",
    description: "Animation that earns its place on screen. Not just vibes. (Okay, also vibes — but intentional ones.)",
    icon: "04",
  },
];

function Row({ s, i }: { s: Service; i: number }) {
  const ref = useFadeUp(i * 0.06);
  return (
    <article
      ref={ref}
      className="group grid grid-cols-[52px_1fr] gap-8 border-b border-[var(--border)] py-10 transition-all duration-300 hover:bg-[var(--teal-faint)] md:grid-cols-[72px_1.2fr_1fr] md:gap-14 md:px-6"
    >
      <span className="font-mono text-[0.6rem] tracking-[0.3em] text-[var(--teal)] self-start pt-1">
        {s.icon ?? String(i + 1).padStart(2, "0")}
      </span>
      <h3 className="hed text-[clamp(2rem,4.5vw,4rem)] text-[var(--fg)] transition-transform duration-300 group-hover:translate-x-1">
        {s.title}
      </h3>
      <p className="col-span-2 self-center text-[0.875rem] leading-[1.85] text-[var(--body)] md:col-span-1">
        {s.description}
      </p>
    </article>
  );
}

export default function Services({ services }: { services?: Service[] }) {
  const headRef = useRevealUp();
  const list = services?.length ? services : FALLBACK;

  return (
    <section id="services" className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">
        <div ref={headRef} className="mb-4 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">Services</p>
            <h2 className="hed text-[clamp(2.8rem,6.5vw,7rem)]">
              Systems for<br />brands that move.
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--body)] md:mb-2 md:max-w-xs">
            Every engagement is a full system build. Not a one-off deliverable you&apos;ll need to redo in six months.
          </p>
        </div>

        <div className="border-t border-[var(--border)]">
          {list.map((s, i) => <Row key={s.id} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
