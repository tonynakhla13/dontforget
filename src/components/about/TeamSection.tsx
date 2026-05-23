"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   GSAP SCROLL-REVEAL
───────────────────────────────────────────────────────────────────────── */
function Reveal({
  children,
  start  = "top 90%",
  end    = "top 55%",
  scrub  = 0.9,
  style,
  className,
}: {
  children:   React.ReactNode;
  start?:     string;
  end?:       string;
  scrub?:     number;
  style?:     React.CSSProperties;
  className?: string;
}) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        innerRef.current,
        { y: "110%", opacity: 0 },
        {
          y: "0%", opacity: 1, ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start, end, scrub },
        }
      );
    },
    { dependencies: [] }
  );

  return (
    <div ref={wrapRef} style={{ overflow: "hidden", ...style }} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const EASE   = [0.22, 1, 0.36, 1] as const;

const CARD_W = 320;
const CARD_H = 460;
const OFFSET = 220;
const ROT_Y  = 52;
const DEPTH  = 160;

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
const TEAM = [
  { name: "Tony Nakhla",  role: "Founder & Lead Developer",   bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",                                         initials: "TN", isFounder: true,  tags: ["Next.js","React","Node.js","Systems"]     },
  { name: "— Hiring",     role: "Senior UI/UX Designer",      bio: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",                                 initials: "?",  isFounder: false, tags: ["Figma","Motion Design","Brand Systems"]  },
  { name: "— Hiring",     role: "Mobile Developer",           bio: "iOS + Android, React Native. You care about feel, not just functionality. Performance is non-negotiable.",                            initials: "?",  isFounder: false, tags: ["iOS","Android","React Native"]           },
  { name: "— Hiring",     role: "SEO & Growth Strategist",    bio: "Data-driven, creative enough to see what the data misses. AI search fluency is a plus.",                                             initials: "?",  isFounder: false, tags: ["SEO","AI Search","Analytics"]            },
];

/* ─────────────────────────────────────────────────────────────────────────
   NAV BUTTON
───────────────────────────────────────────────────────────────────────── */
function NavBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--surface)", color: disabled ? "var(--body)" : "var(--fg)", opacity: disabled ? 0.3 : 1, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", transition: "border-color 0.2s" }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(58,191,138,0.45)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   TEAM CARD FACE
───────────────────────────────────────────────────────────────────────── */
function TeamCardFace({ member, isActive }: { member: typeof TEAM[0]; isActive: boolean }) {
  return (
    <div className="relative flex flex-col overflow-hidden h-full" style={{ borderRadius: "1.35rem", border: isActive ? (member.isFounder ? "1px solid rgba(58,191,138,0.50)" : "1px solid rgba(58,191,138,0.28)") : "1px solid var(--border)", background: isActive && member.isFounder ? "linear-gradient(145deg, rgba(10,22,16,0.96), rgba(9,9,9,0.92))" : "var(--surface)", transition: "border-color 0.4s, background 0.4s" }}>
      {member.isFounder && isActive && <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 50% at 15% 10%, rgba(58,191,138,0.18) 0%, transparent 65%)" }} />}
      {isActive && <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.55) 50%, transparent)" }} />}

      {/* Avatar */}
      <div className="relative overflow-hidden" style={{ height: 180, background: member.isFounder && isActive ? "radial-gradient(ellipse at 38% 32%, rgba(58,191,138,0.26) 0%, rgba(9,9,9,0.88) 65%)" : "radial-gradient(ellipse at 38% 32%, rgba(58,191,138,0.06) 0%, rgba(9,9,9,0.7) 65%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(58,191,138,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="hed" style={{ fontSize: member.isFounder ? "4.8rem" : "3.8rem", color: member.isFounder && isActive ? "rgba(58,191,138,0.38)" : "rgba(240,236,227,0.07)" }}>{member.initials}</span>
        </div>
        <div className="absolute" style={{ top: "1rem", right: "1rem", padding: "0.26rem 0.7rem", borderRadius: "99px", border: member.isFounder ? "1px solid rgba(58,191,138,0.45)" : "1px solid var(--border)", background: member.isFounder ? "rgba(58,191,138,0.1)" : "rgba(255,255,255,0.03)" }}>
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem", letterSpacing: "0.38em", textTransform: "uppercase", color: member.isFounder ? "var(--teal)" : "var(--body)", opacity: member.isFounder ? 1 : 0.5 }}>{member.isFounder ? "Founder" : "Open"}</span>
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col flex-1 p-6">
        <h3 className="hed" style={{ fontSize: "1.2rem", color: isActive ? "var(--fg)" : "rgba(240,236,227,0.45)", marginBottom: "0.35rem", lineHeight: 1.1 }}>{member.name}</h3>
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--teal)", opacity: isActive ? 1 : 0.45, marginBottom: "0.9rem", display: "block" }}>{member.role}</span>
        <p style={{ fontSize: "0.8rem", lineHeight: 1.82, color: "var(--body)", opacity: isActive ? 1 : 0.5, flex: 1 }}>{member.bio}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {member.tags.map(tag => (
            <span key={tag} style={{ padding: "0.22rem 0.6rem", borderRadius: "99px", border: "1px solid var(--border)", background: member.isFounder && isActive ? "rgba(58,191,138,0.07)" : "var(--surface2)", fontFamily: "var(--font-mono-next)", fontSize: "0.4rem", letterSpacing: "0.28em", textTransform: "uppercase", color: member.isFounder && isActive ? "var(--teal)" : "var(--body)", opacity: isActive ? 0.85 : 0.4 }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   3-D COVERFLOW
───────────────────────────────────────────────────────────────────────── */
function TeamCoverflow() {
  const [active, setActive] = useState(0);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const go     = (dir: number) => setActive(a => Math.max(0, Math.min(TEAM.length - 1, a + dir)));

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, ease: EASE }}>
      <div style={{ position: "relative", height: CARD_H, perspective: "1300px", perspectiveOrigin: "50% 50%", overflow: "visible" }}>
        {TEAM.map((member, i) => {
          const diff = i - active;
          const abs  = Math.abs(diff);
          return (
            <motion.div key={i} onClick={() => setActive(i)}
              style={{ position: "absolute", top: 0, left: "50%", width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2, cursor: diff === 0 ? "default" : "pointer", zIndex: 10 - abs }}
              animate={{ x: diff * OFFSET, rotateY: diff * -ROT_Y, z: -abs * DEPTH, opacity: abs > 2 ? 0 : 1 - abs * 0.28, scale: diff === 0 ? 1 : 0.86 }}
              transition={SPRING}
            >
              <TeamCardFace member={member} isActive={diff === 0} />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <NavBtn onClick={() => go(-1)} disabled={active === 0}>←</NavBtn>
        <div className="flex gap-2.5">
          {TEAM.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Team member ${i + 1}`} style={{ padding: 0, border: "none", background: "none", cursor: "pointer" }}>
              <motion.div animate={{ width: i === active ? 26 : 7, background: i === active ? "rgba(58,191,138,1)" : "rgba(255,255,255,0.16)" }} transition={{ duration: 0.3, ease: EASE }} style={{ height: 3, borderRadius: 99 }} />
            </button>
          ))}
        </div>
        <NavBtn onClick={() => go(1)} disabled={active === TEAM.length - 1}>→</NavBtn>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scrubbed header entrance */
  useGSAP(
    () => {
      gsap.fromTo(
        ".team-header",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 30%", scrub: 1.2 } }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="relative section-py border-t border-[var(--border)] overflow-hidden" style={{ background: "rgba(9,9,9,0.78)", backdropFilter: "blur(6px)" }}>
      <div className="pointer-events-none absolute" style={{ top: "8%", left: "50%", transform: "translateX(-50%)", width: "55vw", height: "35vw", background: "radial-gradient(ellipse at 50% 50%, rgba(58,191,138,0.04) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />

      <div className="wrap relative z-10">

        {/* Header */}
        <div className="team-header mb-16 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal style={{ marginBottom: "1.5rem" }}>
              <p className="eyebrow">The team</p>
            </Reveal>
            <Reveal start="top 86%" end="top 44%" scrub={1}>
              <h2 className="hed" style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}>
                Small team.<br />
                <span style={{ color: "var(--teal)" }}>Unreasonable</span> output.
              </h2>
            </Reveal>
          </div>
          <Reveal start="top 86%" end="top 50%" scrub={0.9} className="md:mb-2 md:text-right">
            <p style={{ maxWidth: "26ch", fontSize: "0.9rem", lineHeight: 1.85, color: "var(--body)" }}>
              Every project gets senior-level attention from kick-off to ship.
            </p>
          </Reveal>
        </div>

        <TeamCoverflow />

        {/* CTA */}
        <div className="mt-20 relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-7 flex items-center justify-between">
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 80% at 0% 50%, rgba(58,191,138,0.06) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <Reveal><p className="hed" style={{ fontSize: "1.2rem" }}>Think you belong here?</p></Reveal>
            <Reveal start="top 88%" end="top 52%" scrub={0.8}><p className="mt-1.5" style={{ fontSize: "0.875rem", color: "var(--body)" }}>We&apos;re always open to people who are unreasonably good at what they do.</p></Reveal>
          </div>
          <a href="mailto:hello@dontforget.studio" className="btn btn-primary relative z-10 shrink-0 ml-8">
            Get in touch →
          </a>
        </div>

      </div>
    </section>
  );
}
