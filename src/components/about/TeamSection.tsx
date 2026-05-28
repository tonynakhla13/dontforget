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
const CARD_COUNT = CARDS.length;
const LOOPED_CARDS = Array.from({ length: CARD_COUNT * 3 }, (_, position) => ({
  card: CARDS[position % CARD_COUNT],
  position,
}));

function logicalIndex(position: number) {
  return ((position % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
}

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
          backgroundColor: "transparent",
          backgroundImage: active
            ? `radial-gradient(circle at 50% 50%,${teal(0.15)} 0%,transparent 70%)`
            : `radial-gradient(${white(0.04)} 1px,transparent 1px)`,
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
  const [position, setPosition] = useState(CARD_COUNT);
  const positionRef         = useRef(CARD_COUNT);
  const containerRef        = useRef<HTMLDivElement>(null);
  const trackRef            = useRef<HTMLDivElement>(null);
  const cardRefs            = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart           = useRef<{ x: number; trackX: number; moved: boolean } | null>(null);
  const suppressClick       = useRef(false);
  const active              = logicalIndex(position);

  const positionTrack = useCallback((nextPosition: number, immediate = false) => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;
    const cW    = container.offsetWidth;
    const cardW = cardRefs.current[0]?.offsetWidth ?? Math.min(460, cW * 0.78);
    const offset = nextPosition * (cardW + GAP) - (cW - cardW) / 2;
    gsap.to(track, { x: -offset, duration: immediate ? 0 : 0.72, ease: "expo.out", overwrite: true });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        scale: i === nextPosition ? 1 : 0.88,
        opacity: i === nextPosition ? 1 : 0.35,
        duration: immediate ? 0 : 0.62,
        ease: "expo.out",
        overwrite: true,
      });
    });
  }, []);

  const goToPosition = useCallback((nextPosition: number) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    positionTrack(nextPosition);

    if (nextPosition < CARD_COUNT || nextPosition >= CARD_COUNT * 2) {
      const normalized = CARD_COUNT + logicalIndex(nextPosition);
      gsap.delayedCall(0.73, () => {
        if (positionRef.current !== nextPosition) return;
        positionRef.current = normalized;
        setPosition(normalized);
        positionTrack(normalized, true);
      });
    }
  }, [positionTrack]);

  const goToCard = useCallback((nextActive: number) => {
    const current = logicalIndex(positionRef.current);
    let delta = nextActive - current;
    if (delta > CARD_COUNT / 2) delta -= CARD_COUNT;
    if (delta < -CARD_COUNT / 2) delta += CARD_COUNT;
    goToPosition(positionRef.current + delta);
  }, [goToPosition]);

  useEffect(() => {
    positionTrack(CARD_COUNT, true);
    const onResize = () => positionTrack(positionRef.current, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionTrack]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPosition(positionRef.current - 1);
      if (e.key === "ArrowRight") goToPosition(positionRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPosition]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const currentX = (gsap.getProperty(trackRef.current, "x") as number) || 0;
    suppressClick.current = false;
    dragStart.current = { x: e.clientX, trackX: currentX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || !trackRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 5) dragStart.current.moved = true;
    gsap.set(trackRef.current, { x: dragStart.current.trackX + dx });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    suppressClick.current = dragStart.current.moved;
    if (Math.abs(dx) > 55) goToPosition(positionRef.current + (dx < 0 ? 1 : -1));
    else positionTrack(positionRef.current);
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
            overflow: "hidden", cursor: "grab", touchAction: "pan-y",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={trackRef} style={{ display: "flex", gap: GAP, willChange: "transform" }}>
            {LOOPED_CARDS.map(({ card, position: cardPosition }) => (
              <div
                key={`${card.num}-${cardPosition}`}
                ref={el => { cardRefs.current[cardPosition] = el; }}
                onClick={() => {
                  if (!suppressClick.current) goToPosition(cardPosition);
                  suppressClick.current = false;
                }}
              >
                {card.type === "founder"
                  ? <FounderCardEl card={card as FounderCard} active={cardPosition === position} />
                  : <OpenCardEl    card={card as OpenCard}    active={cardPosition === position} />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="wrap mt-8" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {CARDS.map((_, i) => (
              <button key={i} aria-label={`Card ${i + 1}`} onClick={() => goToCard(i)} style={{
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
              return (
                <button key={dir} onClick={() => goToPosition(positionRef.current + dir)} style={{
                  width: 48, height: 48, borderRadius: "50%", fontSize: "1rem",
                  border: dir > 0 ? "1px solid rgba(58,191,138,0.48)" : "1px solid rgba(255,255,255,0.15)",
                  background: dir > 0 ? "rgba(58,191,138,0.11)" : "rgba(255,255,255,0.04)",
                  color: dir > 0 ? "var(--teal)" : "var(--fg)",
                  cursor: "pointer",
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
