"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TEAM = [
  {
    name: "Tony Nakhla",
    role: "Founder & Lead Developer",
    bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
    initials: "TN",
    accent: "rgba(58,191,138,0.9)",
  },
  {
    name: "— Open",
    role: "Senior UI/UX Designer",
    bio: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
  {
    name: "— Open",
    role: "Mobile Developer",
    bio: "iOS + Android, React Native. You care about feel, not just functionality. Performance is non-negotiable.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
  {
    name: "— Open",
    role: "SEO & Growth Strategist",
    bio: "Data-driven, creative enough to see what the data misses. AI search fluency is a plus.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
];

function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-[1rem] overflow-hidden"
      style={{ width: "100%", aspectRatio: "1", background: "var(--surface2)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 38% 32%, ${accent} 0%, rgba(9,9,9,0.85) 70%)`,
        }}
      />
      <span className="relative z-10 hed text-[3.5rem] text-[var(--fg)] opacity-30">
        {initials}
      </span>
      {/* Corner teal accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-30" />
    </div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll("[data-team-card]") ?? [];
    gsap.fromTo(cards,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative section-py border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="wrap">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-8">The team</p>
            <h2 className="hed text-[3rem]">
              Small team.<br />
              <span className="text-[var(--teal)]">Big output.</span>
            </h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-[1.85] text-[var(--body)] md:mb-2 md:max-w-xs">
            We stay lean on purpose. Every project gets senior-level attention from start to ship.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <div
              key={i}
              data-team-card
              className="group flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-300 hover:border-[var(--teal-mid)]"
              style={{ visibility: "hidden" }}
            >
              <Avatar initials={member.initials} accent={member.accent} />
              <div>
                <h3 className="hed text-[1.1rem] text-[var(--fg)]">{member.name}</h3>
                <span className="mt-1 block font-mono text-[0.52rem] uppercase tracking-[0.34em] text-[var(--teal)]">
                  {member.role}
                </span>
                <p className="mt-4 text-[0.8rem] leading-[1.8] text-[var(--body)]">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hiring CTA */}
        <div className="mt-16 flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-8 py-7">
          <div>
            <p className="hed text-[1.2rem] text-[var(--fg)]">Think you belong here?</p>
            <p className="mt-1 text-[0.875rem] text-[var(--body)]">We&apos;re always open to people who are unreasonably good at what they do.</p>
          </div>
          <a href="mailto:hello@dontforget.studio" className="btn btn-primary shrink-0 ml-8">
            Get in touch →
          </a>
        </div>
      </div>
    </section>
  );
}
