"use client";

/**
 * TeamSection — "NOX PERSONNEL ROSTER"
 *
 * A holographic dossier coverflow. Side cards angle back into 3D depth; the
 * centered card "powers on" — a green-duotone portrait resolves toward full
 * colour, a scan-line sweeps it, HUD corner brackets light up, and it tilts
 * toward the cursor with light parallax on the image + text.
 *
 * Open roles render as glowing "empty seat" holograms (wireframe silhouette,
 * AWAITING // YOU) so the hiring story reads visually.
 *
 * Mechanics: an infinite triple-loop track, GSAP coverflow transforms per card
 * (rotateY + translateZ + scale + fade via per-element transformPerspective),
 * drag / arrows / dots / keyboard, and a scroll-triggered boot-up entrance.
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
type FounderCard = {
  type: "founder"; num: string; name: string; role: string; bio: string;
  image: string; location: string; tags: string[];
  stats: { value: string; label: string }[];
};
type OpenCard = {
  type: "open"; num: string; role: string; note: string; tags: string[];
};
type CardData = FounderCard | OpenCard;

const CARDS: CardData[] = [
  {
    type: "founder", num: "01",
    name: "Tony Nakhla", role: "Founder · Lead Developer",
    bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
    // ⚠ Placeholder headshot — swap with Tony's real photo (any portrait URL or /public path).
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    location: "Remote · GMT+2",
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
    note: "Data-driven, creative enough to see what the data misses. AI-search fluency a plus.",
    tags: ["SEO", "AI Search", "Analytics"],
  },
];

const GAP = 18;
const CARD_COUNT = CARDS.length;
const LOOPED_CARDS = Array.from({ length: CARD_COUNT * 3 }, (_, position) => ({
  card: CARDS[position % CARD_COUNT],
  position,
}));

function logicalIndex(position: number) {
  return ((position % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
}

/* fractal-noise grain (data-URI so there's no asset dependency) */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ─────────────────────────────────────────────────────────────────────────
   HOLO SILHOUETTE — the "empty seat" visual for open roles
───────────────────────────────────────────────────────────────────────── */
function HoloSilhouette() {
  return (
    <svg className="th-silhouette" viewBox="0 0 200 264" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="thDots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.9" fill="rgba(70,174,34,0.55)" />
        </pattern>
      </defs>
      <g>
        <circle cx="100" cy="90" r="41" fill="url(#thDots)" opacity="0.85" />
        <path d="M22 276 C22 190 178 190 178 276 Z" fill="url(#thDots)" opacity="0.7" />
        <circle cx="100" cy="90" r="41" fill="none" stroke="rgba(70,209,42,0.4)" strokeWidth="1" />
        <path d="M22 276 C22 190 178 190 178 276 Z" fill="none" stroke="rgba(70,209,42,0.34)" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD
───────────────────────────────────────────────────────────────────────── */
function HoloCardEl({ card, active }: { card: CardData; active: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isFounder = card.type === "founder";
  const name = card.type === "founder" ? card.name : card.role;
  const roleLabel = isFounder ? card.role : "Open position";

  return (
    <article className="th-card" data-active={active} data-open={!isFounder}>
      {/* ── media ── */}
      <div className="th-media">
        {card.type === "founder" ? (
          !imgFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="th-media-img" src={card.image} alt={`${card.name} — ${card.role}`}
              draggable={false} loading="lazy" onError={() => setImgFailed(true)} />
          )
        ) : (
          <div className="th-open-bg"><HoloSilhouette /></div>
        )}
        <div className="th-wash" />
        <div className="th-tint" />
        <div className="th-grain" />
        <div className="th-scanlines" />
        <div className="th-scrim" />
        <div className="th-sweep" />
      </div>

      {/* ── HUD ── */}
      <span className="th-num">{card.num}</span>
      <span className="th-bracket tl" /><span className="th-bracket tr" />
      <span className="th-bracket bl" /><span className="th-bracket br" />

      <div className="th-toprow">
        <span className="th-idx">{card.num} / {String(CARD_COUNT).padStart(2, "0")}</span>
        <span className="th-status" data-open={!isFounder}>
          {isFounder ? "Founder" : "We're hiring"}
        </span>
      </div>

      {!isFounder && <span className="th-openmark">?</span>}

      {/* ── info ── */}
      <div className="th-info">
        <p className="th-role">{roleLabel}</p>
        <h3 className="hed th-name">{name}</h3>

        <div className="th-detail">
          <div>
            <p className="th-bio">{card.type === "founder" ? card.bio : card.note}</p>

            {card.type === "founder" && (
              <div className="th-stats">
                {card.stats.map((s) => (
                  <div key={s.label}>
                    <p className="hed th-stat-v">{s.value}</p>
                    <p className="th-stat-l">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="th-tags">
              {card.tags.map((t) => <span key={t} className="th-tag">{t}</span>)}
            </div>

            {card.type === "founder" ? (
              <p className="th-loc">◦ {card.location}</p>
            ) : (
              <a href="mailto:HELLO@NOXDEVS.COM" className="th-apply" onClick={(e) => e.stopPropagation()}>
                Apply for this seat →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────── */
export default function TeamSection() {
  const [position, setPosition] = useState(CARD_COUNT);
  const positionRef   = useRef(CARD_COUNT);
  const containerRef  = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef     = useRef<HTMLDivElement>(null);
  const controlsRef   = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const dragStart     = useRef<{ x: number; trackX: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const reduceRef     = useRef(false);
  const active        = logicalIndex(position);

  /* coverflow layout: centre the active card + fan the rest back in 3D */
  const positionTrack = useCallback((nextPosition: number, immediate = false) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const cW = container.offsetWidth;
    const cardW = cardRefs.current[0]?.offsetWidth ?? Math.min(400, cW * 0.84);
    const offset = nextPosition * (cardW + GAP) - (cW - cardW) / 2;
    gsap.to(track, { x: -offset, duration: immediate ? 0 : 0.74, ease: "expo.out", overwrite: true });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = i - nextPosition;                 // signed distance from active
      const ad = Math.abs(d);
      const dir = d === 0 ? 0 : d > 0 ? 1 : -1;
      gsap.to(el, {
        rotationY: dir * Math.min(ad, 2) * 15,    // side cards turn to face centre
        z: -Math.min(ad, 3) * 95,
        scale: ad === 0 ? 1 : Math.max(0.78, 1 - ad * 0.11),
        autoAlpha: ad === 0 ? 1 : Math.max(0.22, 1 - ad * 0.4),
        transformPerspective: 1300,
        transformOrigin: "center center",
        duration: immediate ? 0 : 0.7,
        ease: "expo.out",
        overwrite: true,
      });
    });
  }, []);

  const resetTilts = useCallback(() => {
    cardRefs.current.forEach((el) => {
      const inner = el?.querySelector(".th-card") as HTMLElement | null;
      if (inner) { inner.style.setProperty("--px", "0"); inner.style.setProperty("--py", "0"); }
    });
  }, []);

  const goToPosition = useCallback((nextPosition: number) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    resetTilts();
    positionTrack(nextPosition);

    // teleport back into the middle loop once we drift into an outer copy
    if (nextPosition < CARD_COUNT || nextPosition >= CARD_COUNT * 2) {
      const normalized = CARD_COUNT + logicalIndex(nextPosition);
      gsap.delayedCall(0.75, () => {
        if (positionRef.current !== nextPosition) return;
        positionRef.current = normalized;
        setPosition(normalized);
        positionTrack(normalized, true);
      });
    }
  }, [positionTrack, resetTilts]);

  const goToCard = useCallback((nextActive: number) => {
    const current = logicalIndex(positionRef.current);
    let delta = nextActive - current;
    if (delta > CARD_COUNT / 2) delta -= CARD_COUNT;
    if (delta < -CARD_COUNT / 2) delta += CARD_COUNT;
    goToPosition(positionRef.current + delta);
  }, [goToPosition]);

  /* mount: arrange + resize + reduced-motion flag */
  useEffect(() => {
    reduceRef.current = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    positionTrack(CARD_COUNT, true);
    const onResize = () => positionTrack(positionRef.current, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionTrack]);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPosition(positionRef.current - 1);
      if (e.key === "ArrowRight") goToPosition(positionRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPosition]);

  /* scroll boot-up entrance */
  useEffect(() => {
    const els = [headerRef.current, containerRef.current, controlsRef.current, ctaRef.current].filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const ctx = gsap.context(() => {
      if (reduceRef.current) { gsap.set(els, { autoAlpha: 1, y: 0 }); return; }
      gsap.set(els, { autoAlpha: 0, y: 42 });
      ScrollTrigger.create({
        trigger: containerRef.current!, start: "top 82%", once: true,
        onEnter() { gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }); },
      });
    });
    return () => ctx.revert();
  }, []);

  /* drag */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const currentX = (gsap.getProperty(trackRef.current, "x") as number) || 0;
    suppressClick.current = false;
    dragStart.current = { x: e.clientX, trackX: currentX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    if (dragStart.current) {
      const dx = e.clientX - dragStart.current.x;
      if (Math.abs(dx) > 5) dragStart.current.moved = true;
      gsap.set(trackRef.current, { x: dragStart.current.trackX + dx });
      return;
    }
    // cursor parallax/tilt on the active card only
    if (reduceRef.current) return;
    const el = cardRefs.current[positionRef.current];
    const inner = el?.querySelector(".th-card") as HTMLElement | null;
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    const py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    inner.style.setProperty("--px", String(px));
    inner.style.setProperty("--py", String(py));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    suppressClick.current = dragStart.current.moved;
    if (Math.abs(dx) > 55) goToPosition(positionRef.current + (dx < 0 ? 1 : -1));
    else positionTrack(positionRef.current);
    dragStart.current = null;
  };
  const onPointerLeave = () => { dragStart.current = null; resetTilts(); };

  return (
    <section className="team-holo relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(9,9,9,0.52) 0px, rgba(8,8,8,0.82) 180px, rgba(8,8,8,0.82) 100%)",
        backdropFilter: "blur(6px)",
      }}>
      <style>{CSS}</style>

      {/* ambient field */}
      <div className="th-glow" aria-hidden="true" />
      <div className="th-hgrid" aria-hidden="true" />

      <div className="relative z-10">
        {/* header + HUD strip */}
        <div ref={headerRef} className="wrap" style={{ visibility: "hidden" }}>
          <div className="th-strip">
            <span className="th-live"><i />Roster · live</span>
            <span className="th-strip-mid">NOX // PERSONNEL</span>
            <span className="th-strip-idx">{String(active + 1).padStart(2, "0")}—{String(CARD_COUNT).padStart(2, "0")}</span>
          </div>
          <div className="th-head">
            <div>
              <p className="eyebrow mb-3">The team</p>
              <h2 className="hed th-title">
                Small team.<br /><span style={{ color: "var(--teal)" }}>Unreasonable</span> output.
              </h2>
            </div>
            <p className="th-head-note">
              One filled seat, three holographic vacancies. Every project gets senior-level attention from kick-off to ship.
            </p>
          </div>
        </div>

        {/* coverflow */}
        <div
          ref={containerRef}
          className="th-viewport"
          style={{ visibility: "hidden" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
        >
          <div ref={trackRef} className="th-track">
            {LOOPED_CARDS.map(({ card, position: cardPosition }) => (
              <div
                key={`${card.num}-${cardPosition}`}
                className="th-cardwrap"
                ref={(el) => { cardRefs.current[cardPosition] = el; }}
                onClick={() => { if (!suppressClick.current) goToPosition(cardPosition); suppressClick.current = false; }}
              >
                <HoloCardEl card={card} active={cardPosition === position} />
              </div>
            ))}
          </div>
        </div>

        {/* controls */}
        <div ref={controlsRef} className="wrap th-controls" style={{ visibility: "hidden" }}>
          <div className="th-dots">
            {CARDS.map((_, i) => (
              <button key={i} aria-label={`Go to card ${i + 1}`} onClick={() => goToCard(i)}
                className="th-dot" data-on={i === active} />
            ))}
            <span className="th-counter">{String(active + 1).padStart(2, "0")} / {String(CARD_COUNT).padStart(2, "0")}</span>
          </div>
          <div className="th-arrows">
            <button aria-label="Previous" className="th-arrow" onClick={() => goToPosition(positionRef.current - 1)}>←</button>
            <button aria-label="Next" className="th-arrow th-arrow--next" onClick={() => goToPosition(positionRef.current + 1)}>→</button>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="wrap th-cta-wrap" style={{ visibility: "hidden" }}>
          <div className="th-cta">
            <div className="th-cta-glow" />
            <div className="relative z-10">
              <p className="hed th-cta-title">Think you belong here?</p>
              <p className="th-cta-sub">We&apos;re always open to people who are unreasonably good at what they do.</p>
            </div>
            <a href="mailto:HELLO@NOXDEVS.COM" className="th-cta-btn">Get in touch →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────────────────────────── */
const CSS = `
.team-holo { --g: 70,174,34; --gb: 70,209,42; --card-w: min(400px, 84vw); --card-h: min(560px, 66vh); }

.th-glow { position:absolute; top:6%; left:50%; transform:translateX(-50%); width:70vw; height:46vw;
  background: radial-gradient(ellipse at 50% 50%, rgba(var(--g),0.07) 0%, transparent 68%);
  filter: blur(70px); pointer-events:none; z-index:0; }
.th-hgrid { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.4;
  background-image: linear-gradient(rgba(var(--g),0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(var(--g),0.05) 1px, transparent 1px);
  background-size: 46px 46px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000, transparent 80%); }

/* header */
.th-strip { display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding-bottom:14px; margin-bottom:22px; border-bottom:1px solid rgba(var(--g),0.16);
  font-family: var(--font-mono-next), monospace; font-size:0.42rem; letter-spacing:0.42em;
  text-transform:uppercase; color: rgba(var(--g),0.7); }
.th-live { display:inline-flex; align-items:center; gap:8px; color: rgb(var(--gb)); }
.th-live i { width:6px; height:6px; border-radius:50%; background: rgb(var(--gb));
  box-shadow:0 0 9px rgb(var(--gb)); animation: thBlink 1.8s ease-in-out infinite; }
.th-strip-mid { opacity:.5; }
.th-strip-idx { color: rgba(var(--g),0.85); }
.th-head { margin-bottom: 38px; display:flex; flex-direction:column; gap:16px; }
@media (min-width:768px){ .th-head { flex-direction:row; align-items:flex-end; justify-content:space-between; } }
.th-title { font-size: clamp(2.4rem,5vw,4.4rem); line-height:1.0; }
.th-head-note { max-width: 30ch; font-size:0.82rem; line-height:1.85; color: var(--body); }

/* viewport / track */
.th-viewport { overflow:visible; cursor:grab; touch-action:pan-y; }
.th-viewport:active { cursor:grabbing; }
.th-track { display:flex; gap:${GAP}px; will-change:transform; }
.th-cardwrap { width:var(--card-w); height:var(--card-h); flex-shrink:0; cursor:pointer;
  will-change:transform,opacity; }

/* card shell */
.th-card { position:relative; width:100%; height:100%; border-radius:20px; overflow:hidden;
  background:#070707; border:1px solid rgba(255,255,255,0.07);
  transform: perspective(1100px) rotateY(calc(var(--px,0) * 7deg)) rotateX(calc(var(--py,0) * -7deg));
  transition: transform .3s ease-out, border-color .5s ease, box-shadow .5s ease; }
.th-card[data-active="true"] { border-color: rgba(var(--g),0.82);
  box-shadow: 0 0 0 1px rgba(var(--gb),0.4), 0 34px 90px rgba(0,0,0,0.6), 0 0 80px rgba(var(--g),0.28); }

/* media */
.th-media { position:absolute; inset:0; }
.th-media-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  transform:scale(1.05); transition: filter .6s ease, transform .3s ease-out;
  filter: grayscale(.85) brightness(.55) contrast(1.05); }
.th-card[data-active="true"] .th-media-img { filter: grayscale(.08) brightness(.94) contrast(1.04);
  transform: scale(1.07) translate(calc(var(--px,0) * -9px), calc(var(--py,0) * -7px)); }
.th-open-bg { position:absolute; inset:0; background:
  radial-gradient(ellipse 70% 55% at 50% 34%, rgba(var(--g),0.10), transparent 62%), #060807;
  display:flex; align-items:flex-start; justify-content:center; }
.th-silhouette { width:84%; height:84%; margin-top:6%;
  transform: translate(calc(var(--px,0) * -6px), calc(var(--py,0) * -5px)); transition: transform .3s ease-out; }

.th-wash { position:absolute; inset:0; background: rgb(var(--g)); mix-blend-mode:color; opacity:.62;
  transition:opacity .6s ease; }
.th-card[data-active="true"] .th-wash { opacity:.14; }
.th-card[data-open="true"] .th-wash { opacity:.32; }
.th-tint { position:absolute; inset:0; opacity:.5; transition:opacity .6s ease;
  background: radial-gradient(120% 78% at 50% -8%, rgba(var(--g),0.20), transparent 60%); }
.th-card[data-active="true"] .th-tint { opacity:1; }
.th-grain { position:absolute; inset:0; background-image:${GRAIN}; opacity:.06; mix-blend-mode:overlay; pointer-events:none; }
.th-scanlines { position:absolute; inset:0; mix-blend-mode:multiply; opacity:.5; pointer-events:none;
  background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.20) 2px 3px); }
.th-scrim { position:absolute; inset:0; pointer-events:none;
  background: linear-gradient(180deg, rgba(7,7,7,.18) 0%, rgba(7,7,7,0) 30%, rgba(7,7,7,.7) 66%, rgba(7,7,7,.97) 100%); }
.th-sweep { position:absolute; left:0; right:0; top:0; height:16%; opacity:0; pointer-events:none;
  background: linear-gradient(180deg, transparent, rgba(var(--gb),0.14) 44%, rgba(var(--gb),0.5) 50%, rgba(var(--gb),0.14) 56%, transparent); }
.th-card[data-active="true"] .th-sweep { opacity:1; animation: thSweep 3.4s linear infinite; }

/* HUD */
.th-num { position:absolute; right:6px; bottom:-22px; font-family: var(--font-display-next), sans-serif;
  font-weight:900; font-size:9rem; line-height:1; color: rgba(255,255,255,0.04); pointer-events:none;
  transition: color .5s ease; }
.th-card[data-active="true"] .th-num { color: rgba(var(--g),0.11); }
.th-bracket { position:absolute; width:20px; height:20px; pointer-events:none;
  border-color: rgba(var(--gb),0); transition: border-color .5s ease; }
.th-card[data-active="true"] .th-bracket { border-color: rgba(var(--gb),0.9); }
.th-bracket.tl { top:13px; left:13px; border-top:2px solid; border-left:2px solid; }
.th-bracket.tr { top:13px; right:13px; border-top:2px solid; border-right:2px solid; }
.th-bracket.bl { bottom:13px; left:13px; border-bottom:2px solid; border-left:2px solid; }
.th-bracket.br { bottom:13px; right:13px; border-bottom:2px solid; border-right:2px solid; }
.th-toprow { position:absolute; top:0; left:0; right:0; padding:18px; display:flex; align-items:center;
  justify-content:space-between; z-index:3; }
.th-idx { font-family: var(--font-mono-next), monospace; font-size:0.4rem; letter-spacing:0.46em;
  text-transform:uppercase; color: rgba(255,255,255,0.35); }
.th-card[data-active="true"] .th-idx { color: rgba(var(--gb),0.9); }
.th-status { font-family: var(--font-mono-next), monospace; font-size:0.38rem; letter-spacing:0.36em;
  text-transform:uppercase; padding:0.26rem 0.7rem; border-radius:99px; color: rgba(255,255,255,0.4);
  border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); transition: all .5s ease; }
.th-card[data-active="true"] .th-status { color: rgb(var(--gb)); border-color: rgba(var(--g),0.7);
  background: rgba(var(--g),0.14); }
.th-openmark { position:absolute; top:46%; left:50%; transform:translate(-50%,-50%);
  font-family: var(--font-display-next), sans-serif; font-weight:900; font-size:5rem; line-height:1;
  color: rgba(var(--gb),0.16); z-index:2; pointer-events:none; transition: color .5s ease; }
.th-card[data-active="true"] .th-openmark { color: rgba(var(--gb),0.5); animation: thFlicker 4s steps(1) infinite; }

/* info */
.th-info { position:absolute; left:0; right:0; bottom:0; padding:22px; z-index:4;
  transition: transform .3s ease-out;
  transform: translate(calc(var(--px,0) * 6px), calc(var(--py,0) * 4px)); }
.th-role { font-family: var(--font-mono-next), monospace; font-size:0.44rem; letter-spacing:0.34em;
  text-transform:uppercase; color: rgba(var(--g),0.5); margin-bottom:0.5rem; transition: color .5s ease; }
.th-card[data-active="true"] .th-role { color: rgb(var(--gb)); }
.th-name { font-size: clamp(1.5rem,2.7vw,2.25rem); line-height:1.02; color: rgba(240,236,227,0.5);
  text-shadow:none; transition: color .5s ease, text-shadow .5s ease; }
.th-card[data-active="true"] .th-name { color: var(--fg); text-shadow: 0 0 26px rgba(var(--g),0.35); }
.th-detail { display:grid; grid-template-rows:0fr; opacity:0;
  transition: grid-template-rows .55s cubic-bezier(.22,1,.36,1), opacity .45s ease; }
.th-detail > div { overflow:hidden; min-height:0; }
.th-card[data-active="true"] .th-detail { grid-template-rows:1fr; opacity:1; }
.th-bio { margin-top:0.85rem; font-size:0.83rem; line-height:1.78; color: var(--body); max-width:42ch; }
.th-stats { display:flex; gap:34px; margin-top:1.1rem; }
.th-stat-v { font-size:1.55rem; line-height:1; color: var(--fg); }
.th-stat-l { margin-top:0.25rem; font-family: var(--font-mono-next), monospace; font-size:0.36rem;
  letter-spacing:0.26em; text-transform:uppercase; color: rgba(240,236,227,0.55); }
.th-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:1.1rem; }
.th-tag { padding:0.24rem 0.66rem; border-radius:99px; border:1px solid rgba(var(--g),0.4);
  background: rgba(var(--g),0.1); font-family: var(--font-mono-next), monospace; font-size:0.36rem;
  letter-spacing:0.22em; text-transform:uppercase; color: rgba(var(--gb),0.95); }
.th-loc { margin-top:1rem; font-family: var(--font-mono-next), monospace; font-size:0.4rem;
  letter-spacing:0.28em; text-transform:uppercase; color: rgba(240,236,227,0.4); }
.th-apply { display:inline-block; margin-top:1.1rem; font-family: var(--font-mono-next), monospace;
  font-size:0.42rem; letter-spacing:0.3em; text-transform:uppercase; text-decoration:none;
  color: rgb(var(--gb)); transition: letter-spacing .3s ease; }
.th-apply:hover { letter-spacing:0.42em; }

/* controls */
.th-controls { margin-top:32px; display:flex; align-items:center; justify-content:space-between; }
.th-dots { display:flex; align-items:center; gap:8px; }
.th-dot { width:8px; height:8px; padding:0; border:none; border-radius:99px; cursor:pointer;
  background: rgba(255,255,255,0.14); transition: width .35s cubic-bezier(.4,0,.2,1), background .35s ease; }
.th-dot[data-on="true"] { width:32px; background: rgb(var(--gb)); box-shadow:0 0 14px rgba(var(--g),0.55); }
.th-counter { margin-left:10px; font-family: var(--font-mono-next), monospace; font-size:0.38rem;
  letter-spacing:0.36em; text-transform:uppercase; color: var(--body); opacity:.4; }
.th-arrows { display:flex; gap:12px; }
.th-arrow { width:48px; height:48px; border-radius:50%; font-size:1rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center; color: var(--fg);
  border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04);
  transition: transform .3s ease, background .3s ease, border-color .3s ease, color .3s ease; }
.th-arrow:hover { transform: translateY(-2px); border-color: rgba(var(--g),0.5); }
.th-arrow--next { border-color: rgba(var(--g),0.5); background: rgba(var(--g),0.12); color: rgb(var(--gb)); }
.th-arrow--next:hover { box-shadow:0 0 26px rgba(var(--g),0.35); }

/* CTA */
.th-cta-wrap { margin-top:48px; }
.th-cta { position:relative; overflow:hidden; border-radius:18px; border:1px solid var(--border);
  background: var(--surface); padding:28px 32px; display:flex; flex-wrap:wrap; gap:16px;
  align-items:center; justify-content:space-between; }
.th-cta-glow { position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(ellipse 45% 80% at 0% 50%, rgba(var(--g),0.08), transparent 60%); }
.th-cta-title { font-size:1.18rem; }
.th-cta-sub { margin-top:0.4rem; font-size:0.84rem; color: var(--body); }
.th-cta-btn { position:relative; z-index:1; flex-shrink:0; border-radius:99px; padding:0.78rem 1.5rem;
  font-size:0.85rem; font-weight:500; text-decoration:none; background: var(--teal); color: #04140a;
  box-shadow:0 10px 30px rgba(var(--g),0.3); transition: transform .3s ease, box-shadow .3s ease; }
.th-cta-btn:hover { transform: translateY(-2px); box-shadow:0 16px 40px rgba(var(--g),0.45); }

@keyframes thSweep { from { transform: translateY(-110%); } to { transform: translateY(760%); } }
@keyframes thBlink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
@keyframes thFlicker { 0%,100%{opacity:1;} 92%{opacity:1;} 94%{opacity:.4;} 96%{opacity:1;} }

@media (prefers-reduced-motion: reduce) {
  .th-card, .th-media-img, .th-info, .th-silhouette { transition:none; }
  .th-sweep, .th-live i, .th-openmark { animation:none !important; }
}
`;
