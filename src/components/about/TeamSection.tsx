"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
type FounderCard = {
  type: "founder"; num: string; name: string; role: string; bio: string;
  initials: string; tags: string[]; stats: { value: string; label: string }[];
};
type OpenCard = {
  type: "open"; num: string; role: string; note: string; tags: string[];
};
type CardData = FounderCard | OpenCard;

const CARDS: CardData[] = [
  {
    type: "founder", num: "01",
    name: "Tony Nakhla", role: "Founder & Lead Developer",
    bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
    initials: "TN",
    tags: ["Next.js", "React", "Node.js", "Systems", "Mobile"],
    stats: [{ value: "14+", label: "projects shipped" }, { value: "3yr", label: "building" }],
  },
  {
    type: "open", num: "02", role: "Senior UI/UX Designer",
    note: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",
    tags: ["Figma", "Motion Design", "Brand Systems"],
  },
  {
    type: "open", num: "03", role: "Mobile Developer",
    note: "iOS + Android, React Native. You care about feel, not just functionality.",
    tags: ["iOS", "Android", "React Native"],
  },
  {
    type: "open", num: "04", role: "SEO & Growth Strategist",
    note: "Data-driven, creative enough to see what the data misses. AI search fluency a plus.",
    tags: ["SEO", "AI Search", "Analytics"],
  },
];

const GAP = 20;

/* ─────────────────────────────────────────────────────────────────────────
   CARD SHELL STYLE
───────────────────────────────────────────────────────────────────────── */
function shell(active: boolean): React.CSSProperties {
  return {
    width: "min(460px, 78vw)",
    minHeight: 360,
    borderRadius: "1.5rem",
    overflow: "hidden",
    flexShrink: 0,
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    border: active ? "2px solid rgba(58,191,138,0.88)" : "1px solid rgba(255,255,255,0.08)",
    background: active
      ? "linear-gradient(145deg,rgba(16,42,28,0.99) 0%,rgba(8,22,16,0.99) 100%)"
      : "rgba(11,11,11,0.97)",
    boxShadow: active
      ? "0 0 120px rgba(58,191,138,0.22),0 32px 80px rgba(0,0,0,0.45),inset 0 1px 0 rgba(58,191,138,0.25)"
      : "none",
    transition: "border-color .45s,background .45s,box-shadow .45s",
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   FOUNDER CARD
───────────────────────────────────────────────────────────────────────── */
function FounderCardEl({ card, active }: { card: FounderCard; active: boolean }) {
  const teal  = (o: number) => `rgba(58,191,138,${o})`;
  const white = (o: number) => `rgba(255,255,255,${o})`;
  return (
    <div style={shell(active)}>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: active
        ? "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(58,191,138,0.018) 3px,rgba(58,191,138,0.018) 4px)"
        : "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.006) 3px,rgba(255,255,255,0.006) 4px)" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: active ? 2 : 1,
        background: active ? `linear-gradient(90deg,transparent,${teal(1)} 30%,${teal(0.7)} 100%)`
          : `linear-gradient(90deg,transparent,${teal(0.22)},transparent)`, transition: "background .45s" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: active
        ? `radial-gradient(ellipse 60% 55% at 0% 0%,${teal(0.24)} 0%,transparent 55%)`
        : `radial-gradient(ellipse 60% 55% at 0% 0%,${teal(0.06)} 0%,transparent 55%)`, transition: "background .45s" }} />
      <div className="pointer-events-none absolute select-none" style={{ right: -6, bottom: -12,
        fontSize: "10rem", lineHeight: 1, fontFamily: "var(--font-hed)", fontWeight: 900,
        color: active ? teal(0.09) : white(0.025) }}>{card.num}</div>

      <div className="relative z-10 p-6 flex flex-col gap-4" style={{ minHeight: 360 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem", letterSpacing: "0.5em",
            textTransform: "uppercase", color: active ? teal(0.85) : white(0.25) }}>{card.num} / 04</span>
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.44em",
            textTransform: "uppercase", color: active ? teal(1) : white(0.3),
            padding: "0.22rem 0.72rem", borderRadius: 99,
            border: `1px solid ${active ? teal(0.7) : white(0.12)}`,
            background: active ? teal(0.14) : white(0.03), transition: "all .45s" }}>Founder</span>
        </div>

        <div style={{ width: 76, height: 76, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${active ? teal(0.72) : white(0.12)}`,
          background: active ? `radial-gradient(circle at 38% 32%,${teal(0.38)} 0%,rgba(8,22,16,0.9) 68%)` : white(0.03),
          boxShadow: active ? `0 0 32px ${teal(0.25)}` : "none", transition: "all .45s" }}>
          <span className="hed" style={{ fontSize: "1.55rem", color: active ? teal(0.9) : white(0.2) }}>{card.initials}</span>
        </div>

        <div>
          <h3 className="hed" style={{ fontSize: "clamp(1.55rem,2.8vw,2.3rem)", lineHeight: 1.05,
            marginBottom: "0.4rem", color: active ? "var(--fg)" : "rgba(240,236,227,0.45)" }}>{card.name}</h3>
          <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.34em",
            textTransform: "uppercase", color: active ? teal(0.9) : teal(0.35) }}>{card.role}</p>
        </div>

        <p style={{ fontSize: "0.875rem", lineHeight: 1.9, flexGrow: 1,
          color: active ? "var(--body)" : "rgba(240,236,227,0.28)" }}>{card.bio}</p>

        <div className="flex gap-8">
          {card.stats.map(s => (
            <div key={s.label}>
              <p className="hed" style={{ fontSize: "1.65rem", lineHeight: 1,
                color: active ? "var(--fg)" : "rgba(240,236,227,0.3)" }}>{s.value}</p>
              <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.36rem", letterSpacing: "0.28em",
                textTransform: "uppercase", marginTop: "0.2rem",
                color: active ? "rgba(240,236,227,0.55)" : "rgba(240,236,227,0.2)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {card.tags.map(tag => (
            <span key={tag} style={{ padding: "0.22rem 0.65rem", borderRadius: 99,
              border: `1px solid ${active ? teal(0.45) : white(0.08)}`,
              background: active ? teal(0.1) : white(0.03),
              fontFamily: "var(--font-mono-next)", fontSize: "0.36rem", letterSpacing: "0.24em",
              textTransform: "uppercase", color: active ? teal(0.95) : white(0.25), transition: "all .45s" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   OPEN POSITION CARD
───────────────────────────────────────────────────────────────────────── */
function OpenCardEl({ card, active }: { card: OpenCard; active: boolean }) {
  const teal  = (o: number) => `rgba(58,191,138,${o})`;
  const white = (o: number) => `rgba(255,255,255,${o})`;
  return (
    <div style={shell(active)}>
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `radial-gradient(${active ? teal(0.1) : white(0.045)} 1px,transparent 1px)`,
        backgroundSize: "22px 22px" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: active ? 2 : 1,
        background: active ? `linear-gradient(90deg,transparent,${teal(1)} 30%,${teal(0.6)} 100%)`
          : `linear-gradient(90deg,transparent,${white(0.08)},transparent)`, transition: "background .45s" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: active
        ? `radial-gradient(ellipse 70% 35% at 50% 0%,${teal(0.12)} 0%,transparent 55%)` : "none", transition: "background .45s" }} />
      <div className="pointer-events-none absolute select-none" style={{ right: -6, bottom: -12,
        fontSize: "10rem", lineHeight: 1, fontFamily: "var(--font-hed)", fontWeight: 900,
        color: active ? teal(0.07) : white(0.02) }}>{card.num}</div>

      <div className="relative z-10 p-6 flex flex-col gap-4" style={{ minHeight: 360 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem", letterSpacing: "0.5em",
            textTransform: "uppercase", color: active ? teal(0.8) : white(0.22) }}>{card.num} / 04</span>
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.4em",
            textTransform: "uppercase", color: active ? teal(0.95) : white(0.25),
            padding: "0.22rem 0.65rem", borderRadius: 99,
            border: `1px solid ${active ? teal(0.6) : white(0.1)}`,
            background: active ? teal(0.12) : white(0.02), transition: "all .45s" }}>We&apos;re hiring</span>
        </div>

        <div style={{ width: 76, height: 76, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: `1px ${active ? "solid" : "dashed"} ${active ? teal(0.65) : white(0.12)}`,
          background: active ? `radial-gradient(circle at 50% 50%,${teal(0.15)} 0%,transparent 70%)` : "none",
          backgroundImage: active ? undefined : `radial-gradient(${white(0.04)} 1px,transparent 1px)`,
          backgroundSize: "12px 12px", transition: "all .45s" }}>
          <span className="hed" style={{ fontSize: "2rem", color: active ? teal(0.55) : white(0.08) }}>?</span>
        </div>

        <div>
          <h3 className="hed" style={{ fontSize: "clamp(1.3rem,2.4vw,2rem)", lineHeight: 1.1,
            marginBottom: "0.55rem", color: active ? "var(--fg)" : "rgba(240,236,227,0.38)" }}>{card.role}</h3>
          <div style={{ width: 32, height: 2, borderRadius: 2,
            background: active ? teal(0.75) : white(0.12), transition: "background .45s" }} />
        </div>

        <p style={{ fontSize: "0.875rem", lineHeight: 1.9, flexGrow: 1,
          color: active ? "var(--body)" : "rgba(240,236,227,0.25)" }}>{card.note}</p>

        <div className="flex flex-wrap gap-2">
          {card.tags.map(tag => (
            <span key={tag} style={{ padding: "0.22rem 0.65rem", borderRadius: 99,
              border: `1px solid ${active ? teal(0.4) : white(0.08)}`,
              background: active ? teal(0.09) : white(0.02),
              fontFamily: "var(--font-mono-next)", fontSize: "0.36rem", letterSpacing: "0.24em",
              textTransform: "uppercase", color: active ? teal(0.9) : white(0.2), transition: "all .45s" }}>{tag}</span>
          ))}
        </div>

        <a href="mailto:hello@dontforget.studio" style={{ fontFamily: "var(--font-mono-next)",
          fontSize: "0.42rem", letterSpacing: "0.3em", textTransform: "uppercase",
          textDecoration: "none", color: active ? teal(0.9) : teal(0.25), transition: "color .45s" }}>
          Apply →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────── */
export default function TeamSection() {
  const [active, setActive] = useState(0);
  const activeRef           = useRef(0);
  const containerRef        = useRef<HTMLDivElement>(null);
  const trackRef            = useRef<HTMLDivElement>(null);
  const cardRefs            = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart           = useRef<{ x: number; trackX: number } | null>(null);

  const animateTrack = useCallback((idx: number) => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;
    const cW    = container.offsetWidth;
    const cardW = cardRefs.current[0]?.offsetWidth ?? Math.min(460, cW * 0.78);
    const raw   = idx * (cardW + GAP) - (cW - cardW) / 2;
    const max   = CARDS.length * (cardW + GAP) - GAP - cW;
    gsap.to(track, { x: -Math.max(0, Math.min(raw, max)), duration: 0.75, ease: "expo.out" });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { scale: i === idx ? 1 : 0.88, opacity: i === idx ? 1 : 0.35, duration: 0.65, ease: "expo.out" });
    });
  }, []);

  const goTo = useCallback((raw: number) => {
    const idx = Math.max(0, Math.min(CARDS.length - 1, raw));
    activeRef.current = idx;
    setActive(idx);
    animateTrack(idx);
  }, [animateTrack]);

  useEffect(() => { animateTrack(0); }, []); // eslint-disable-line

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goTo(activeRef.current - 1);
      if (e.key === "ArrowRight") goTo(activeRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const currentX = (gsap.getProperty(trackRef.current, "x") as number) || 0;
    dragStart.current = { x: e.clientX, trackX: currentX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || !trackRef.current) return;
    gsap.set(trackRef.current, { x: dragStart.current.trackX + (e.clientX - dragStart.current.x) });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 55) goTo(activeRef.current + (dx < 0 ? 1 : -1));
    else animateTrack(activeRef.current);
    dragStart.current = null;
  };

  return (
    <section
      className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.78)", backdropFilter: "blur(6px)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute" style={{
        top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "65vw", height: "50vw", zIndex: 0,
        background: "radial-gradient(ellipse at 50% 50%,rgba(58,191,138,0.05) 0%,transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div className="relative z-10">

        {/* Header */}
        <div className="wrap mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">The team</p>
            <h2 className="hed" style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)" }}>
              Small team.<br />
              <span style={{ color: "var(--teal)" }}>Unreasonable</span> output.
            </h2>
          </div>
          <p style={{ maxWidth: "24ch", fontSize: "0.875rem", lineHeight: 1.85, color: "var(--body)" }}>
            Every project gets senior-level attention from kick-off to ship.
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          style={{
            overflow: "hidden", cursor: "grab",
            paddingLeft: "max(1.5rem, calc((100vw - min(1280px, 100vw - 3rem)) / 2 + 1.5rem))",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={trackRef} style={{ display: "flex", gap: GAP, willChange: "transform" }}>
            {CARDS.map((card, i) => (
              <div key={card.num} ref={el => { cardRefs.current[i] = el; }} onClick={() => goTo(i)}>
                {card.type === "founder"
                  ? <FounderCardEl card={card as FounderCard} active={i === active} />
                  : <OpenCardEl    card={card as OpenCard}    active={i === active} />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="wrap mt-8" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {CARDS.map((_, i) => (
              <button key={i} aria-label={`Card ${i + 1}`} onClick={() => goTo(i)} style={{
                width: i === active ? 30 : 8, height: 8, padding: 0, borderRadius: 99,
                border: "none", cursor: "pointer",
                background: i === active ? "var(--teal)" : "rgba(255,255,255,0.14)",
                transition: "width .35s cubic-bezier(.4,0,.2,1),background .35s",
              }} />
            ))}
            <span style={{ marginLeft: 8, fontFamily: "var(--font-mono-next)", fontSize: "0.38rem",
              letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--body)", opacity: 0.3 }}>
              {String(active + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {([[-1, "←"], [1, "→"]] as [number, string][]).map(([dir, label]) => {
              const off = dir < 0 ? active === 0 : active === CARDS.length - 1;
              return (
                <button key={dir} onClick={() => goTo(active + dir)} disabled={off} style={{
                  width: 48, height: 48, borderRadius: "50%", fontSize: "1rem",
                  border: off ? "1px solid rgba(255,255,255,0.07)"
                    : dir > 0 ? "1px solid rgba(58,191,138,0.48)" : "1px solid rgba(255,255,255,0.15)",
                  background: off ? "transparent"
                    : dir > 0 ? "rgba(58,191,138,0.11)" : "rgba(255,255,255,0.04)",
                  color: off ? "rgba(255,255,255,0.18)" : dir > 0 ? "var(--teal)" : "var(--fg)",
                  cursor: off ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .3s",
                }}>{label}</button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="wrap mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-7"
            style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <div className="pointer-events-none absolute inset-0" style={{
              background: "radial-gradient(ellipse 45% 80% at 0% 50%,rgba(58,191,138,0.06) 0%,transparent 60%)" }} />
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

      </div>
    </section>
  );
}
