"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   GSAP SCROLL-REVEAL — text rises from below the clip boundary
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
   3-D ICONS (CSS-only, no framework)
───────────────────────────────────────────────────────────────────────── */
function MissionIcon() {
  return (
    <div className="pointer-events-none select-none" style={{ width: 72, height: 72, perspective: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: "dodeca-spin 18s linear infinite" }}>
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1.5px solid rgba(var(--teal-rgb),0.70)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", border: "1px solid rgba(var(--teal-rgb),0.45)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", inset: "40%", borderRadius: "50%", border: "1px solid rgba(var(--teal-rgb),0.35)", transform: "rotateX(70deg)" }} />
        <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "rgba(var(--teal-rgb),0.25)", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 1, background: "rgba(var(--teal-rgb),0.25)", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", inset: "46%", borderRadius: "50%", background: "rgba(var(--teal-rgb),0.9)", boxShadow: "0 0 10px rgba(var(--teal-rgb),0.7)" }} />
        <div style={{ position: "absolute", inset: "15%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(var(--teal-rgb),0.14) 0%, transparent 70%)" }} />
      </div>
    </div>
  );
}

function VisionIcon() {
  return (
    <div className="pointer-events-none select-none" style={{ width: 72, height: 72, perspective: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: "arm-spin 22s linear infinite" }}>
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1.5px solid rgba(var(--teal-rgb),0.70)", transform: "rotateX(90deg)", boxShadow: "0 0 14px rgba(var(--teal-rgb),0.22)" }} />
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1px solid rgba(var(--teal-rgb),0.50)", transform: "rotateY(0deg)" }} />
        <div style={{ position: "absolute", inset: 0,     borderRadius: "50%", border: "1px solid rgba(var(--teal-rgb),0.38)", transform: "rotateY(90deg)" }} />
        <div style={{ position: "absolute", inset: "13%", borderRadius: "50%", border: "1px solid rgba(var(--teal-rgb),0.22)", transform: "translateY(-18%) rotateX(90deg)" }} />
        <div style={{ position: "absolute", inset: "20%", borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, rgba(var(--teal-rgb),0.18) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "3%",  width: 5, height: 5, borderRadius: "50%", background: "rgba(var(--teal-rgb),0.85)", transform: "translateX(-50%)", boxShadow: "0 0 8px rgba(var(--teal-rgb),0.6)" }} />
        <div style={{ position: "absolute", left: "50%", top: "92%", width: 4, height: 4, borderRadius: "50%", background: "rgba(var(--teal-rgb),0.55)", transform: "translateX(-50%)" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   NEON UNDERLINE — a precise brand-green bar that wipes in on scroll
   (replaces the old hand-drawn squiggle / oval doodles)
───────────────────────────────────────────────────────────────────────── */
function NeonUnderline() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 88%", end: "top 54%", scrub: 1 } }
    );
  }, { dependencies: [] });
  return (
    <span ref={ref} aria-hidden style={{
      position: "absolute", left: 0, right: 0, bottom: "-0.18em", height: 3, borderRadius: 99,
      transformOrigin: "left center", transform: "scaleX(0)",
      background: "linear-gradient(90deg, rgba(var(--teal-rgb),0.95), rgba(var(--immersive-particles-rgb),1))",
      boxShadow: "0 0 10px rgba(var(--teal-rgb),0.7), 0 0 22px rgba(var(--teal-rgb),0.35)",
    }} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
const DEFAULT_CARDS = [
  {
    num: "01", label: "Mission", Icon: MissionIcon,
    heading: "Build things people remember.",
    accentWord: "remember", annotation: "underline" as const,
    defaultBody: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    num: "02", label: "Vision", Icon: VisionIcon,
    heading: "World-class craft for every brand.",
    accentWord: "every brand", annotation: "circle" as const,
    defaultBody: "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
];

// First 4 shown in the 2×2 grid
const RULES = [
  { icon: "◈", title: "Clarity over clutter",  body: "If it doesn't sharpen the message, it doesn't ship." },
  { icon: "◎", title: "Motion with intent",    body: "Every animation earns its place or it doesn't exist." },
  { icon: "▷", title: "Speed is a feature",    body: "Slow websites lose business. We build fast by default." },
  { icon: "◉", title: "Ownership mindset",     body: "We treat your project like it's ours. Because it is." },
];

/* ─────────────────────────────────────────────────────────────────────────
   PILLAR CARD
───────────────────────────────────────────────────────────────────────── */
type CardWithBody = typeof DEFAULT_CARDS[0] & { body: string };

function PillarCard({ card }: { card: CardWithBody }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { y: 110, opacity: 0, rotateX: 16, transformPerspective: 900 },
      { y: 0, opacity: 1, rotateX: 0, ease: "none",
        scrollTrigger: { trigger: cardRef.current, start: "top 94%", end: "top 18%", scrub: 1.2 } }
    );
  }, { dependencies: [] });

  return (
    <div ref={cardRef} className="relative flex flex-col overflow-hidden rounded-[1.5rem]">
      <div className="relative flex flex-col flex-1 overflow-hidden rounded-[1.5rem]"
        style={{ border: "1px solid rgba(var(--teal-rgb),0.28)", background: "linear-gradient(145deg,rgba(10,22,16,0.96) 0%,rgba(9,9,9,0.92) 100%)", backdropFilter: "blur(20px)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 12% 10%, rgba(var(--teal-rgb),0.18) 0%, rgba(var(--teal-rgb),0.05) 40%, transparent 68%)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--teal-rgb),0.6) 40%, rgba(var(--teal-rgb),0.25) 100%)" }} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ background: "linear-gradient(to bottom, rgba(var(--teal-rgb),0.45), transparent 60%)" }} />

        <div className="relative z-10 flex flex-col flex-1 p-10">
          <Reveal start="top 92%" end="top 60%" scrub={0.8} style={{ marginBottom: "2.5rem" }}>
            <card.Icon />
          </Reveal>
          <Reveal start="top 90%" end="top 58%" scrub={0.8} style={{ marginBottom: "1.5rem" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--body)", opacity: 0.4 }}>{card.num}</span>
              <div style={{ height: 1, width: 20, background: "rgba(var(--teal-rgb),0.35)" }} />
              <span className="eyebrow" style={{ fontSize: "0.58rem", letterSpacing: "0.42em" }}>{card.label}</span>
            </div>
          </Reveal>
          <Reveal start="top 88%" end="top 50%" scrub={1} style={{ marginBottom: "1.75rem" }}>
            <h3 className="hed" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.04, color: "var(--fg)", letterSpacing: "-0.01em" }}>
              {card.heading.split(card.accentWord).map((part, pi, arr) => (
                <span key={pi}>
                  {part}
                  {pi < arr.length - 1 && (
                    <span style={{ position: "relative", display: "inline-block", color: "var(--teal)", textShadow: "0 0 22px rgba(var(--teal-rgb),0.45)" }}>
                      {card.accentWord}
                      <NeonUnderline />
                    </span>
                  )}
                </span>
              ))}
            </h3>
          </Reveal>
          <Reveal start="top 86%" end="top 48%" scrub={0.8} style={{ marginBottom: "1.75rem" }}>
            <div style={{ height: 1, background: "rgba(var(--teal-rgb),0.18)" }} />
          </Reveal>
          <Reveal start="top 84%" end="top 44%" scrub={0.8} style={{ flex: 1 }}>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.95, color: "var(--body)", whiteSpace: "pre-line" }}>{card.body}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   RULES GRID — 4 cards, 2×2, all visible in one viewport
───────────────────────────────────────────────────────────────────────── */
function RulesGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll(".rule-card");
    if (!cards?.length) return;
    gsap.fromTo(cards,
      { autoAlpha: 0, y: 36, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.09, ease: "none",
        scrollTrigger: { trigger: gridRef.current, start: "top 86%", end: "top 22%", scrub: 1.1 } }
    );
  }, { dependencies: [] });

  return (
    <div ref={gridRef}
      style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(0.75rem,1.5vw,1.25rem)" }}>
      {RULES.map((r, i) => (
        <div key={r.title} className="rule-card relative overflow-hidden rounded-[1.1rem]"
          style={{ border: "1px solid var(--border)", background: "var(--surface)", padding: "clamp(1.25rem,2vw,1.75rem)" }}>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 65% 50% at 12% 12%, rgba(var(--teal-rgb),0.07) 0%, transparent 65%)" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.28) 50%,transparent)" }} />
          <div className="relative z-10">
            <span style={{ fontSize: "1.1rem", color: "var(--teal)", opacity: 0.75, display: "block", marginBottom: "0.9rem" }}>{r.icon}</span>
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.48em", textTransform: "uppercase", color: "var(--body)", opacity: 0.28, display: "block", marginBottom: "0.65rem" }}>{String(i+1).padStart(2,"0")}</span>
            <h4 className="hed" style={{ fontSize: "clamp(0.95rem,1.4vw,1.15rem)", color: "var(--fg)", marginBottom: "0.55rem", lineHeight: 1.1 }}>{r.title}</h4>
            <p style={{ fontSize: "0.78rem", lineHeight: 1.85, color: "var(--body)" }}>{r.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { y: 55, opacity: 0 }, { y: 0, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 92%", end: "top 38%", scrub: 1 } }
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

/* ─────────────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function MissionVision({ mission, vision }: { mission?: string | null; vision?: string | null }) {
  const CARDS: CardWithBody[] = DEFAULT_CARDS.map((c, i) => ({
    ...c,
    body: i === 0 ? (mission || c.defaultBody) : (vision || c.defaultBody),
  }));

  return (
    <section className="relative border-t border-[var(--border)] overflow-hidden"
      style={{ background: "rgba(9,9,9,0.92)", backdropFilter: "blur(8px)", paddingTop: "clamp(4rem,8vh,7rem)", paddingBottom: "clamp(3rem,6vh,5rem)" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.38),transparent)" }} />

      <div className="wrap relative z-10">
        <SectionHeader />

        <div className="grid gap-5 md:grid-cols-2">
          {CARDS.map(card => <PillarCard key={card.num} card={card} />)}
        </div>
      </div>
    </section>
  );
}
