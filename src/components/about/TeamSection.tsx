"use client";

/**
 * TeamSection — pure GSAP, zero Framer Motion.
 *
 * Layout: large featured founder card (full-width) + three hiring cards
 * in a horizontal row below.  On scroll the founder card falls in from
 * above; hiring cards stagger up from below.  GSAP hover lifts each card.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   GSAP SCROLL-REVEAL
───────────────────────────────────────────────────────────────────────── */
function Reveal({
  children, start="top 90%", end="top 55%", scrub=0.9, style, className,
}: {
  children: React.ReactNode; start?: string; end?: string; scrub?: number;
  style?: React.CSSProperties; className?: string;
}) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(innerRef.current,
      { y: "110%", opacity: 0 },
      { y: "0%", opacity: 1, ease: "none",
        scrollTrigger: { trigger: wrapRef.current, start, end, scrub } }
    );
  }, { dependencies: [] });
  return (
    <div ref={wrapRef} style={{ overflow: "hidden", ...style }} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
const FOUNDER = {
  name: "Tony Nakhla", role: "Founder & Lead Developer",
  bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
  initials: "TN",
  tags: ["Next.js", "React", "Node.js", "Systems", "Mobile"],
  stat1: { value: "14+", label: "projects shipped" },
  stat2: { value: "3yr", label: "building" },
};

const OPEN = [
  {
    role: "Senior UI/UX Designer",
    note: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",
    tags: ["Figma", "Motion Design", "Brand Systems"],
  },
  {
    role: "Mobile Developer",
    note: "iOS + Android, React Native. You care about feel, not just functionality.",
    tags: ["iOS", "Android", "React Native"],
  },
  {
    role: "SEO & Growth Strategist",
    note: "Data-driven, creative enough to see what the data misses. AI search fluency a plus.",
    tags: ["SEO", "AI Search", "Analytics"],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   FOUNDER CARD
───────────────────────────────────────────────────────────────────────── */
function FounderCard({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={innerRef} className="relative overflow-hidden rounded-[1.5rem]"
      style={{ border: "1px solid rgba(58,191,138,0.40)",
        background: "linear-gradient(145deg,rgba(10,22,16,0.97) 0%,rgba(9,9,9,0.93) 100%)",
        backdropFilter: "blur(20px)" }}>
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 70% at 8% 8%, rgba(58,191,138,0.20) 0%, rgba(58,191,138,0.06) 35%, transparent 65%)" }} />
      {/* Top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.70) 40%,rgba(58,191,138,0.30) 100%)" }} />
      {/* Left line */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{ background: "linear-gradient(to bottom,rgba(58,191,138,0.50),transparent 70%)" }} />

      <div className="relative z-10 p-10 flex flex-col md:flex-row gap-10 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0" style={{ width: 120, height: 120, borderRadius: "50%",
          border: "1.5px solid rgba(58,191,138,0.40)",
          background: "radial-gradient(circle at 35% 30%, rgba(58,191,138,0.28) 0%, rgba(9,9,9,0.85) 65%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(58,191,138,0.14)" }}>
          <span className="hed" style={{ fontSize: "3rem", color: "rgba(58,191,138,0.55)" }}>
            {FOUNDER.initials}
          </span>
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.5em",
              textTransform: "uppercase", color: "var(--teal)",
              padding: "0.24rem 0.7rem", borderRadius: 99,
              border: "1px solid rgba(58,191,138,0.40)", background: "rgba(58,191,138,0.08)" }}>
              Founder
            </span>
            <div style={{ height: 1, flex: 1, background: "rgba(58,191,138,0.15)" }} />
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem", letterSpacing: "0.36em",
              textTransform: "uppercase", color: "var(--body)", opacity: 0.30 }}>
              01 / 04
            </span>
          </div>

          <h3 className="hed" style={{ fontSize: "clamp(1.8rem,3vw,3rem)", color: "var(--fg)", lineHeight: 1.05, marginBottom: "0.5rem" }}>
            {FOUNDER.name}
          </h3>
          <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.48rem", letterSpacing: "0.38em",
            textTransform: "uppercase", color: "var(--teal)", marginBottom: "1.25rem", display: "block" }}>
            {FOUNDER.role}
          </p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.88, color: "var(--body)", maxWidth: "52ch", marginBottom: "1.5rem" }}>
            {FOUNDER.bio}
          </p>

          <div className="flex items-center gap-10 mb-6">
            {[FOUNDER.stat1, FOUNDER.stat2].map(s => (
              <div key={s.label}>
                <p className="hed" style={{ fontSize: "1.8rem", color: "var(--fg)", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem", letterSpacing: "0.3em",
                  textTransform: "uppercase", color: "var(--body)", marginTop: "0.2rem", opacity: 0.55 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {FOUNDER.tags.map(tag => (
              <span key={tag} style={{ padding: "0.24rem 0.65rem", borderRadius: 99,
                border: "1px solid rgba(58,191,138,0.30)", background: "rgba(58,191,138,0.07)",
                fontFamily: "var(--font-mono-next)", fontSize: "0.40rem", letterSpacing: "0.26em",
                textTransform: "uppercase", color: "var(--teal)", opacity: 0.85 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HIRING CARD
───────────────────────────────────────────────────────────────────────── */
function HiringCard({
  pos, idx, innerRef,
}: {
  pos: typeof OPEN[0]; idx: number; innerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={innerRef} className="relative overflow-hidden rounded-[1.25rem]"
      style={{ border: "1px solid var(--border)", background: "var(--surface)",
        flex: 1, cursor: "pointer" }}>
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 10% 10%, rgba(58,191,138,0.05) 0%, transparent 60%)" }} />

      <div className="relative z-10 p-7">
        {/* Badge row */}
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.48em",
            textTransform: "uppercase", color: "var(--body)", opacity: 0.28 }}>
            {String(idx + 2).padStart(2, "0")} / 04
          </span>
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.38em",
            textTransform: "uppercase", color: "var(--body)",
            padding: "0.18rem 0.55rem", borderRadius: 99,
            border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
            Open
          </span>
        </div>

        {/* Initials */}
        <div style={{ width: 52, height: 52, borderRadius: "50%",
          border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.1rem",
          backgroundImage: "radial-gradient(rgba(58,191,138,0.06) 1px, transparent 1px)",
          backgroundSize: "18px 18px" }}>
          <span className="hed" style={{ fontSize: "1.4rem", color: "rgba(240,236,227,0.08)" }}>?</span>
        </div>

        <h3 className="hed" style={{ fontSize: "clamp(0.95rem,1.4vw,1.15rem)", color: "rgba(240,236,227,0.75)",
          lineHeight: 1.15, marginBottom: "0.65rem" }}>
          {pos.role}
        </h3>
        <p style={{ fontSize: "0.78rem", lineHeight: 1.82, color: "var(--body)", marginBottom: "1.25rem" }}>
          {pos.note}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {pos.tags.map(tag => (
            <span key={tag} style={{ padding: "0.18rem 0.55rem", borderRadius: 99,
              border: "1px solid var(--border)", background: "var(--surface2)",
              fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.26em",
              textTransform: "uppercase", color: "var(--body)", opacity: 0.55 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function TeamSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const founderRef  = useRef<HTMLDivElement>(null);
  const hiringRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    /* ── Founder card — scrub down from above ── */
    gsap.fromTo(founderRef.current,
      { autoAlpha: 0, y: -50 },
      { autoAlpha: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 28%", scrub: 1.2 } }
    );

    /* ── Hiring cards — stagger up from below ── */
    const cards = hiringRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.fromTo(cards,
      { autoAlpha: 0, y: 55 },
      { autoAlpha: 1, y: 0, stagger: 0.10, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", end: "top 14%", scrub: 1.2 } }
    );

    /* ── GSAP hover lift (no Framer Motion) ── */
    [founderRef.current, ...cards].forEach(card => {
      if (!card) return;
      card.addEventListener("mouseenter", () =>
        gsap.to(card, { y: -5, duration: 0.22, ease: "power2.out" }));
      card.addEventListener("mouseleave", () =>
        gsap.to(card, { y: 0, duration: 0.22, ease: "power2.in" }));
    });

  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.78)", backdropFilter: "blur(6px)" }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute" style={{
        top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "40vw",
        background: "radial-gradient(ellipse at 50% 50%, rgba(58,191,138,0.04) 0%, transparent 70%)",
        filter: "blur(50px)", zIndex: 0 }} />

      <div className="wrap relative z-10">

        {/* ── Header ── */}
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal style={{ marginBottom: "1.25rem" }}>
              <p className="eyebrow">The team</p>
            </Reveal>
            <Reveal start="top 86%" end="top 44%" scrub={1}>
              <h2 className="hed" style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)" }}>
                Small team.<br />
                <span style={{ color: "var(--teal)" }}>Unreasonable</span> output.
              </h2>
            </Reveal>
          </div>
          <Reveal start="top 86%" end="top 50%" scrub={0.9} className="md:text-right">
            <p style={{ maxWidth: "24ch", fontSize: "0.875rem", lineHeight: 1.85, color: "var(--body)" }}>
              Every project gets senior-level attention from kick-off to ship.
            </p>
          </Reveal>
        </div>

        {/* ── Founder card (full width) ── */}
        <FounderCard innerRef={founderRef} />

        {/* ── Hiring cards row ── */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          {OPEN.map((pos, i) => (
            <HiringCard
              key={pos.role} pos={pos} idx={i}
              innerRef={el => { hiringRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* ── CTA bar ── */}
        <div className="mt-12 relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 45% 80% at 0% 50%, rgba(58,191,138,0.06) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <p className="hed" style={{ fontSize: "1.15rem" }}>Think you belong here?</p>
            <p className="mt-1.5" style={{ fontSize: "0.875rem", color: "var(--body)" }}>
              We&apos;re always open to people who are unreasonably good at what they do.
            </p>
          </div>
          <a href="mailto:hello@dontforget.studio"
            className="relative z-10 shrink-0 rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: "var(--teal)", color: "var(--bg)" }}>
            Get in touch →
          </a>
        </div>

      </div>
    </section>
  );
}
