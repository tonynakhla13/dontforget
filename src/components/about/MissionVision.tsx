"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   GSAP SCROLL-REVEAL — scrub tied to scroll position
   wraps any content in overflow:hidden and slides it up as you scroll
───────────────────────────────────────────────────────────────────────── */
function Reveal({
  children,
  start  = "top 90%",
  end    = "top 55%",
  scrub  = 0.9,
  style,
  className,
}: {
  children:  React.ReactNode;
  start?:    string;
  end?:      string;
  scrub?:    number;
  style?:    React.CSSProperties;
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
          y:    "0%",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start,
            end,
            scrub,
          },
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
   3-D ICONS
───────────────────────────────────────────────────────────────────────── */
function MissionIcon() {
  return (
    <div className="pointer-events-none select-none" style={{ width: 72, height: 72, perspective: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: "dodeca-spin 18s linear infinite" }}>
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1.5px solid rgba(58,191,138,0.70)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", border: "1px solid rgba(58,191,138,0.45)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", inset: "40%", borderRadius: "50%", border: "1px solid rgba(58,191,138,0.35)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "rgba(58,191,138,0.25)", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 1, background: "rgba(58,191,138,0.25)", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", inset: "46%", borderRadius: "50%", background: "rgba(58,191,138,0.9)", boxShadow: "0 0 10px rgba(58,191,138,0.7)" }} />
        <div style={{ position: "absolute", inset: "15%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(58,191,138,0.14) 0%, transparent 70%)" }} />
      </div>
    </div>
  );
}

function VisionIcon() {
  return (
    <div className="pointer-events-none select-none" style={{ width: 72, height: 72, perspective: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: "arm-spin 22s linear infinite" }}>
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1.5px solid rgba(58,191,138,0.70)", transform: "rotateX(90deg)", boxShadow: "0 0 14px rgba(58,191,138,0.22)" }} />
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1px solid rgba(58,191,138,0.50)", transform: "rotateY(0deg)" }} />
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1px solid rgba(58,191,138,0.38)", transform: "rotateY(90deg)" }} />
        <div style={{ position: "absolute", inset: "13%", borderRadius: "50%", border: "1px solid rgba(58,191,138,0.22)", transform: "translateY(-18%) rotateX(90deg)" }} />
        <div style={{ position: "absolute", inset: "20%", borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, rgba(58,191,138,0.18) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "3%",  width: 5, height: 5, borderRadius: "50%", background: "rgba(58,191,138,0.85)", transform: "translateX(-50%)", boxShadow: "0 0 8px rgba(58,191,138,0.6)" }} />
        <div style={{ position: "absolute", left: "50%", top: "92%", width: 4, height: 4, borderRadius: "50%", background: "rgba(58,191,138,0.55)", transform: "translateX(-50%)" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SVG ANNOTATIONS (path drawing tied to scroll)
───────────────────────────────────────────────────────────────────────── */
function SquigglyUnderline() {
  const pathRef = useRef<SVGPathElement>(null);
  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: path, start: "top 80%", end: "top 40%", scrub: 1 },
      }
    );
  }, { dependencies: [] });
  return (
    <svg aria-hidden style={{ position: "absolute", left: 0, bottom: -5, width: "100%", height: 10, overflow: "visible", pointerEvents: "none" }} viewBox="0 0 200 8" preserveAspectRatio="none">
      <path ref={pathRef} d="M0 4 Q25 1 50 4 Q75 7 100 4 Q125 1 150 4 Q175 7 200 4" stroke="rgba(58,191,138,0.75)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function OvalCircle() {
  const pathRef = useRef<SVGPathElement>(null);
  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: path, start: "top 80%", end: "top 35%", scrub: 1 },
      }
    );
  }, { dependencies: [] });
  return (
    <svg aria-hidden style={{ position: "absolute", left: "-6%", top: "-22%", width: "112%", height: "144%", overflow: "visible", pointerEvents: "none" }} viewBox="0 0 240 60" preserveAspectRatio="none">
      <path ref={pathRef} d="M120 4 C180 2, 238 16, 236 30 C234 44, 178 57, 120 56 C62 58, 5 44, 4 30 C3 16, 60 6, 120 4 Z" stroke="rgba(58,191,138,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    num: "01", label: "Mission", Icon: MissionIcon,
    heading: "Build things people remember.",
    accentWord: "remember", annotation: "underline" as const,
    body: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    num: "02", label: "Vision", Icon: VisionIcon,
    heading: "World-class craft for every brand.",
    accentWord: "every brand", annotation: "circle" as const,
    body: "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
];

const VALUES = [
  { icon: "◈", title: "Clarity over clutter",  body: "If it doesn't sharpen the message, it doesn't ship." },
  { icon: "◎", title: "Motion with intent",    body: "Every animation earns its place or it doesn't exist." },
  { icon: "⬡", title: "Systems, not one-offs", body: "We build logic as strong as the visuals." },
  { icon: "◇", title: "Honesty, always",       body: "We'll tell you when your brief needs work. You'll thank us." },
  { icon: "▷", title: "Speed is a feature",    body: "Slow websites lose business. We build fast by default." },
  { icon: "◉", title: "Ownership mindset",     body: "We treat your project like it's ours. Because it is." },
];

const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const EASE   = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────
   PILLAR CARD — full GSAP scroll-scrub entrance
───────────────────────────────────────────────────────────────────────── */
function PillarCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        { y: 110, opacity: 0, rotateX: 16, transformPerspective: 900 },
        {
          y:       0,
          opacity: 1,
          rotateX: 0,
          ease:    "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start:   "top 94%",
            end:     "top 18%",
            scrub:   1.2,
          },
        }
      );
    },
    { dependencies: [] }
  );

  const baseDelay = index * 0.08;

  return (
    <div ref={cardRef} className="relative flex flex-col overflow-hidden rounded-[1.5rem]">
      <div
        className="relative flex flex-col flex-1 overflow-hidden rounded-[1.5rem]"
        style={{
          border: "1px solid rgba(58,191,138,0.28)",
          background: "linear-gradient(145deg, rgba(10,22,16,0.96) 0%, rgba(9,9,9,0.92) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Green corner glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 12% 10%, rgba(58,191,138,0.18) 0%, rgba(58,191,138,0.05) 40%, transparent 68%)" }} />
        {/* Top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.6) 40%, rgba(58,191,138,0.25) 100%)" }} />
        {/* Left accent line */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ background: "linear-gradient(to bottom, rgba(58,191,138,0.45), transparent 60%)" }} />

        <div className="relative z-10 flex flex-col flex-1 p-10">
          {/* Icon */}
          <Reveal start="top 92%" end="top 60%" scrub={0.8} style={{ marginBottom: "2.5rem" }}>
            <card.Icon />
          </Reveal>

          {/* Number + label */}
          <Reveal start="top 90%" end="top 58%" scrub={0.8} style={{ marginBottom: "1.5rem" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--body)", opacity: 0.4 }}>{card.num}</span>
              <div style={{ height: 1, width: 20, background: "rgba(58,191,138,0.35)" }} />
              <span className="eyebrow" style={{ fontSize: "0.58rem", letterSpacing: "0.42em" }}>{card.label}</span>
            </div>
          </Reveal>

          {/* Heading — the beige text scrubbed reveal */}
          <Reveal start="top 88%" end="top 50%" scrub={1} style={{ marginBottom: "1.75rem" }}>
            <h3 className="hed" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.04, color: "var(--fg)", letterSpacing: "-0.01em", cursor: "default" }}>
              {card.heading.split(card.accentWord).map((part, pi, arr) => (
                <span key={pi}>
                  {part}
                  {pi < arr.length - 1 && (
                    <span style={{ position: "relative", display: "inline-block", color: "var(--teal)" }}>
                      {card.accentWord}
                      {card.annotation === "underline" && <SquigglyUnderline />}
                      {card.annotation === "circle"    && <OvalCircle />}
                    </span>
                  )}
                </span>
              ))}
            </h3>
          </Reveal>

          {/* Rule */}
          <Reveal start="top 86%" end="top 48%" scrub={0.8} style={{ marginBottom: "1.75rem" }}>
            <div style={{ height: 1, background: "rgba(58,191,138,0.18)" }} />
          </Reveal>

          {/* Body */}
          <Reveal start="top 84%" end="top 44%" scrub={0.8} style={{ flex: 1 }}>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.95, color: "var(--body)" }}>{card.body}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   3-D COVERFLOW for values
───────────────────────────────────────────────────────────────────────── */
const CV_W      = 256;
const CV_H      = 300;
const CV_OFFSET = 175;
const CV_ROT    = 50;
const CV_DEPTH  = 120;

function NavBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--surface)", color: disabled ? "var(--body)" : "var(--fg)", opacity: disabled ? 0.3 : 1, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", transition: "border-color 0.2s" }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(58,191,138,0.45)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}>
      {children}
    </button>
  );
}

function ValueCoverflow() {
  const [active, setActive] = useState(0);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const go = (dir: number) => setActive(a => Math.max(0, Math.min(VALUES.length - 1, a + dir)));

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.75, ease: EASE }}>
      <div style={{ position: "relative", height: CV_H, perspective: "1200px", perspectiveOrigin: "50% 50%", overflow: "visible" }}>
        {VALUES.map((v, i) => {
          const diff = i - active;
          const abs  = Math.abs(diff);
          return (
            <motion.div key={i} onClick={() => setActive(i)}
              style={{ position: "absolute", top: 0, left: "50%", width: CV_W, height: CV_H, marginLeft: -CV_W / 2, cursor: diff === 0 ? "default" : "pointer", zIndex: 10 - abs }}
              animate={{ x: diff * CV_OFFSET, rotateY: diff * -CV_ROT, z: -abs * CV_DEPTH, opacity: abs > 2 ? 0 : 1 - abs * 0.28, scale: diff === 0 ? 1 : 0.87 }}
              transition={SPRING}
            >
              <div className="relative flex flex-col overflow-hidden h-full" style={{ borderRadius: "1.1rem", border: diff === 0 ? "1px solid rgba(58,191,138,0.35)" : "1px solid var(--border)", background: diff === 0 ? "linear-gradient(145deg, rgba(10,22,16,0.96), rgba(9,9,9,0.92))" : "var(--surface)", padding: "1.75rem", transition: "border-color 0.4s, background 0.4s" }}>
                {diff === 0 && <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 15% 15%, rgba(58,191,138,0.14) 0%, transparent 60%)" }} />}
                <span style={{ fontSize: "1rem", color: "var(--teal)", opacity: diff === 0 ? 0.8 : 0.45, marginBottom: "1rem", display: "block" }}>{v.icon}</span>
                <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--body)", opacity: 0.3, marginBottom: "0.8rem", display: "block" }}>{String(i + 1).padStart(2, "0")}</span>
                <h4 className="hed" style={{ fontSize: "1rem", color: diff === 0 ? "var(--fg)" : "rgba(240,236,227,0.55)", marginBottom: "0.7rem", lineHeight: 1.1 }}>{v.title}</h4>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.85, color: "var(--body)", opacity: diff === 0 ? 1 : 0.6 }}>{v.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-10 flex items-center justify-center gap-6">
        <NavBtn onClick={() => go(-1)} disabled={active === 0}>←</NavBtn>
        <div className="flex gap-2.5">
          {VALUES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Value ${i + 1}`} style={{ padding: 0, border: "none", background: "none", cursor: "pointer" }}>
              <motion.div animate={{ width: i === active ? 26 : 7, background: i === active ? "rgba(58,191,138,1)" : "rgba(255,255,255,0.16)" }} transition={{ duration: 0.3, ease: EASE }} style={{ height: 3, borderRadius: 99 }} />
            </button>
          ))}
        </div>
        <NavBtn onClick={() => go(1)} disabled={active === VALUES.length - 1}>→</NavBtn>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION HEADER — GSAP scrub
───────────────────────────────────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { y: 55, opacity: 0 },
      { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 92%", end: "top 38%", scrub: 1 } }
    );
  }, { dependencies: [] });
  return (
    <div ref={ref} className="mb-16 flex items-end justify-between border-b border-[var(--border)] pb-10">
      <p className="eyebrow">What drives us</p>
      <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--body)", opacity: 0.35 }}>
        Mission / Vision
      </p>
    </div>
  );
}

function ValuesHeader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 45%", scrub: 1 } }
    );
  }, { dependencies: [] });
  return (
    <div ref={ref} className="mb-14 flex items-end justify-between">
      <p className="eyebrow">How we work</p>
      <h3 className="hed text-right" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", lineHeight: 1.02 }}>
        Six rules we<br /><span style={{ color: "var(--teal)" }}>never break.</span>
      </h3>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function MissionVision() {
  return (
    <section
      className="relative border-t border-[var(--border)] overflow-hidden"
      style={{ background: "rgba(9,9,9,0.92)", backdropFilter: "blur(8px)", paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.38), transparent)" }} />

      <div className="wrap relative z-10">
        <SectionHeader />

        <div className="grid gap-5 md:grid-cols-2">
          {CARDS.map((card, i) => <PillarCard key={card.num} card={card} index={i} />)}
        </div>

        <div className="mt-28 border-t border-[var(--border)] pt-20">
          <ValuesHeader />
          <ValueCoverflow />
        </div>
      </div>
    </section>
  );
}
