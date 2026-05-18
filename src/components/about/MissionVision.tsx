"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PILLARS = [
  {
    label: "Mission",
    num: "01",
    heading: "Build things\npeople remember.",
    body: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    label: "Vision",
    num: "02",
    heading: "World-class craft\nfor every brand.",
    body: "A world where every business, regardless of size or budget, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
  {
    label: "Why",
    num: "03",
    heading: "Because forgettable\nis a waste.",
    body: "Most digital work gets scrolled past in under a second. We started DON'T FORGET because we believe that's a failure — of execution, of intent, and of respect for the people on the other side of the screen.",
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
    const pillars = sectionRef.current?.querySelectorAll("[data-pillar]") ?? [];
    const values  = sectionRef.current?.querySelectorAll("[data-value]")  ?? [];

    gsap.fromTo(pillars,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0, stagger: 0.14, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
      }
    );
    gsap.fromTo(values,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: "[data-values-grid]", start: "top 80%", toggleActions: "play none none none" },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">

        {/* ── Mission / Vision / Why ── */}
        <div className="mb-4">
          <p className="eyebrow mb-8">What drives us</p>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                data-pillar
                className="group relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-10 transition-colors duration-300 hover:border-[var(--teal-mid)] hover:bg-[var(--teal-faint)]"
                style={{ visibility: "hidden" }}
              >
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--teal)] transition-transform duration-500 group-hover:scale-x-100" />
                <div className="mb-8 flex items-center justify-between">
                  <span className="eyebrow">{p.label}</span>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--teal)] opacity-50">{p.num}</span>
                </div>
                <h3 className="hed text-[1.8rem] leading-[1.1] text-[var(--fg)]">
                  {p.heading.split("\n").map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h3>
                <p className="mt-6 text-[0.875rem] leading-[1.9] text-[var(--body)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div className="mt-24">
          <p className="eyebrow mb-8">How we work</p>
          <div data-values-grid className="grid gap-px border border-[var(--border)] rounded-[var(--radius)] overflow-hidden md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div
                key={i}
                data-value
                className="group relative bg-[var(--surface)] px-8 py-9 transition-colors duration-300 hover:bg-[var(--teal-faint)]"
                style={{ visibility: "hidden" }}
              >
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--teal)] transition-transform duration-500 group-hover:scale-x-100" />
                <span className="mb-4 block font-mono text-[0.48rem] uppercase tracking-[0.44em] text-[var(--teal)] opacity-55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="hed text-[1.1rem] text-[var(--fg)]">{v.title}</h4>
                <p className="mt-3 text-[0.84rem] leading-[1.8] text-[var(--body)]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
