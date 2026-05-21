"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PILLARS = [
  {
    num: "01",
    label: "Mission",
    heading: "Build things people remember.",
    body: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    num: "02",
    label: "Vision",
    heading: "World-class craft for every brand.",
    body: "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
  {
    num: "03",
    label: "Why",
    heading: "Because forgettable is a waste.",
    body: "Most digital work gets scrolled past in under a second. We started DON'T FORGET because we believe that's a failure — of execution, of intent, and of respect for the audience.",
  },
];

const VALUES = [
  { title: "Clarity over clutter",     body: "If it doesn't sharpen the message, it doesn't ship." },
  { title: "Motion with intent",       body: "Every animation earns its place or it doesn't exist." },
  { title: "Systems, not one-offs",    body: "We build logic as strong as the visuals." },
  { title: "Honesty, always",          body: "We'll tell you when your brief needs work. You'll thank us." },
  { title: "Speed is a feature",       body: "Slow websites lose business. We build fast by default." },
  { title: "Ownership mindset",        body: "We treat your project like it's ours. Because it is." },
];

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll("[data-row]") ?? [];
      rows.forEach((row) => {
        gsap.fromTo(row,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      const vals = sectionRef.current?.querySelectorAll("[data-val]") ?? [];
      vals.forEach((v, i) => {
        gsap.fromTo(v,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: "[data-values]", start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--border)] section-py"
      style={{ background: "rgba(9,9,9,0.88)", backdropFilter: "blur(6px)" }}
    >
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.25), transparent)" }} />

      <div className="wrap">
        <p className="eyebrow mb-16">What drives us</p>

        {/* ── Pillars ── */}
        <div className="divide-y divide-[var(--border)]">
          {PILLARS.map((p) => (
            <div
              key={p.num}
              data-row
              className="grid gap-8 py-14 lg:grid-cols-[180px_1fr]"
              style={{ visibility: "hidden" }}
            >
              {/* Left label */}
              <div className="flex flex-col gap-1 pt-1">
                <span className="eyebrow">{p.label}</span>
                <span className="font-mono text-[0.46rem] uppercase tracking-[0.44em] text-[var(--body)] opacity-45 mt-1">{p.num}</span>
              </div>

              {/* Right content */}
              <div>
                <h3 className="hed text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.06] text-[var(--fg)]">
                  {p.heading}
                </h3>
                <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.9] text-[var(--body)]">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Values ── */}
        <div className="mt-20 pt-14 border-t border-[var(--border)]">
          <p className="eyebrow mb-12">How we work</p>
          <div data-values className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={i} data-val style={{ visibility: "hidden" }}>
                <span className="block font-mono text-[0.46rem] uppercase tracking-[0.48em] text-[var(--teal)] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="hed text-[1.05rem] text-[var(--fg)] mb-2">{v.title}</h4>
                <p className="text-[0.84rem] leading-[1.8] text-[var(--body)]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
