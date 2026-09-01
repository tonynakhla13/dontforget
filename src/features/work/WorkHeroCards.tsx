"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import { parseCanonicalPath, projectPath } from "@/lib/site-routing";
import type { WorkProject } from "./page";

const G = "70,174,34"; // NOX green

/* ── geometry of the curved gallery ── */
const CW = 366;      // card width
const CH = 480;      // card height (portrait, museum-plate ratio)
const SPACING = 300; // horizontal step between neighbours
const DEPTH = 196;   // how far each step recedes in Z
const ANGLE = 40;    // rotateY per step
const MAXA = 52;     // clamp the turn so far cards don't flip flat
const WINDOW = 3.3;  // how many slots out stay visible
const SPEED = 0.15;  // slots advanced per second (slow, cinematic)
const DRAG_PX = SPACING * 0.82; // pixels dragged per slot advanced

function slugOf(p: WorkProject) { return p.slug ?? p.id; }

function hrefOf(project: WorkProject, pathname: string) {
  const slug = slugOf(project);
  const route = parseCanonicalPath(pathname);
  return route ? projectPath(route.locale, route.theme, slug) : `/work/${encodeURIComponent(slug)}`;
}

export default function WorkHeroCards({ projects }: { projects: WorkProject[] }) {
  const pathname = usePathname();

  /* build a ring long enough to feel infinite — keeps EVERY project */
  const ring = useMemo(() => {
    const base = projects;
    if (!base.length) return [];
    let r = [...base];
    while (r.length < 7) r = r.concat(base);   // pad short lists so the ring stays full
    return r.slice(0, Math.max(7, base.length));
  }, [projects]);

  const N = ring.length;

  const stageRef  = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const posRef    = useRef(0);
  const targetRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const rafRef    = useRef(0);
  const lastRef   = useRef(0);
  const hoverRef  = useRef<number | null>(null);
  const hoverAmt  = useRef<number[]>([]);
  const draggedRef = useRef(false);
  const drag = useRef<{ down: boolean; startX: number; startPos: number; moved: boolean }>({
    down: false, startX: 0, startPos: 0, moved: false,
  });
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!N) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const last = lastRef.current || ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastRef.current = ts;

      const dragging = drag.current.down && drag.current.moved;

      /* advance — or ease toward a snap/clicked target — unless being dragged */
      if (!dragging) {
        if (targetRef.current !== null) {
          const diff = targetRef.current - posRef.current;
          if (Math.abs(diff) < 0.001) { posRef.current = targetRef.current; targetRef.current = null; }
          else posRef.current += diff * Math.min(1, dt * 7);
        } else if (!pausedRef.current && !reduce) {
          posRef.current += SPEED * dt;
        }
      }
      const pos = posRef.current;

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        /* hover lerp (suppressed while dragging) — snappy ease toward target */
        const ht  = (!dragging && hoverRef.current === i) ? 1 : 0;
        const cur = hoverAmt.current[i] ?? 0;
        const hv  = cur + (ht - cur) * Math.min(1, dt * 34);
        hoverAmt.current[i] = hv;

        let rel = i - pos;
        rel = ((rel % N) + N) % N;     // 0 .. N
        if (rel > N / 2) rel -= N;     // -N/2 .. N/2
        const a = Math.abs(rel);
        const visible = a <= WINDOW || hv > 0.01;

        const x  = rel * SPACING;
        const z  = -a * DEPTH + hv * 72;                                  // gentler lift on hover
        const ry = Math.max(-MAXA, Math.min(MAXA, -rel * ANGLE)) * (1 - hv * 0.48); // keep carousel depth readable
        const scale = Math.max(0.52, 1 - a * 0.075) * (1 - hv * 0.06);     // shrink slightly on hover
        const opacity = visible ? Math.max(0, Math.min(1, (1 - a * 0.235) + hv * 0.25)) : 0;
        const bright  = Math.max(0.42, 1 - a * 0.17) + hv * 0.14;
        const sat     = Math.max(0.55, 1 - a * 0.16) + hv * 0.12;
        const isFront = a < 0.6;

        el.style.transform = `translate(-50%,-50%) translate3d(${x}px,0px,${z}px) rotateY(${ry}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(1000 - Math.round(a * 10) + (hv > 0.02 ? 600 : 0));
        el.style.filter = `brightness(${bright}) saturate(${sat}) contrast(1.06)`;
        el.style.pointerEvents = visible ? "auto" : "none";
        el.style.boxShadow = (isFront || hv > 0.3)
          ? `0 38px 92px rgba(0,0,0,0.72), 0 0 0 1.5px rgba(${G},${(0.42 + hv * 0.26).toFixed(2)}), 0 0 ${52 + hv * 26}px rgba(${G},${(0.14 + hv * 0.16).toFixed(2)})`
          : `0 ${22 + a * 8}px ${56 + a * 16}px rgba(0,0,0,0.6)`;
        el.dataset.front = isFront ? "1" : "0";
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [N]);

  if (!N) return null;

  /* ── drag / swipe handlers (pointer = mouse + touch) ── */
  const onPointerDown = (e: RPE<HTMLDivElement>) => {
    draggedRef.current = false; // start each gesture clean (browser may suppress click after a drag)
    drag.current = { down: true, startX: e.clientX, startPos: posRef.current, moved: false };
    targetRef.current = null;
    pausedRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: RPE<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      stageRef.current?.setAttribute("data-drag", "1");
    }
    if (d.moved) posRef.current = d.startPos - dx / DRAG_PX;
  };
  const endDrag = (e: RPE<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    draggedRef.current = d.moved;
    stageRef.current?.setAttribute("data-drag", "0");
    if (d.moved) targetRef.current = Math.round(posRef.current);  // snap to nearest card
    if (e.pointerType !== "mouse") pausedRef.current = false;     // touch/pen: resume auto-rotate
  };

  return (
    <div
      ref={stageRef}
      className="nox-stage"
      data-drag="0"
      style={{
        position: "relative",
        width: "100%",
        height: CH + 72,
        perspective: "1900px",
        perspectiveOrigin: "50% 48%",
        touchAction: "pan-y",
        cursor: "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; hoverRef.current = null; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <style>{`
        .nox-stage[data-drag="1"] { cursor: grabbing !important; }
        /* bottom drawer — reveal details by sliding the panel, not resizing layout */
        .nox-stage .nox-copy {
          transform: translateY(6.35rem);
          transition:
            transform .34s cubic-bezier(.16,1,.3,1),
            opacity .2s ease;
          will-change: transform;
        }
        .nox-stage .nox-detail {
          opacity: 0;
          pointer-events: none;
          transform: translateY(12px);
          transition:
            opacity .22s ease,
            transform .3s cubic-bezier(.16,1,.3,1);
        }
        .nox-stage .nox-detail-inner { min-height: 0; }
        .nox-stage:not([data-drag="1"]) .nox-wcard:hover .nox-copy,
        .nox-stage:not([data-drag="1"]) .nox-wcard:focus-within .nox-copy {
          transform: translateY(0);
        }
        .nox-stage:not([data-drag="1"]) .nox-wcard:hover .nox-detail,
        .nox-stage:not([data-drag="1"]) .nox-wcard:focus-within .nox-detail {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        /* strengthen the read of the bottom panel on hover */
        .nox-stage .nox-scrim { opacity: 0; transition: opacity .24s ease; }
        .nox-stage:not([data-drag="1"]) .nox-wcard:hover .nox-scrim,
        .nox-stage:not([data-drag="1"]) .nox-wcard:focus-within .nox-scrim { opacity: 1; }
        @media (hover: none) {
          .nox-stage .nox-copy { transform: translateY(0); }
          .nox-stage .nox-detail { opacity: 1; transform: none; pointer-events: auto; }
          .nox-stage .nox-scrim { opacity: 1; }
        }
      `}</style>

      {/* floor glow that anchors the gallery in the dark */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", bottom: "4%", width: 720, height: 200,
        transform: "translateX(-50%)",
        background: `radial-gradient(ellipse at 50% 50%, rgba(${G},0.16) 0%, transparent 68%)`,
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        {ring.map((p, i) => {
          const failed = imgErr[i];
          return (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="nox-wcard"
              onMouseEnter={() => { hoverRef.current = i; }}
              onMouseLeave={() => { if (hoverRef.current === i) hoverRef.current = null; }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                width: CW, height: CH,
                borderRadius: 14, overflow: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                // box-shadow + filter are driven every frame by the rAF hover-lerp,
                // so a CSS transition here only fights it and smears the glow. None = crisp.
                transition: "none",
                cursor: "inherit",
                background: "#05090b",
              }}
            >
              <Link
                href={hrefOf(p, pathname)}
                aria-label={`Explore ${p.title}`}
                draggable={false}
                onClick={(e) => { if (draggedRef.current) { e.preventDefault(); draggedRef.current = false; } }}
                style={{ position: "absolute", inset: 0, display: "block" }}
              >
                {/* image */}
                {p.coverImage && !failed ? (
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    sizes="380px"
                    draggable={false}
                    style={{ objectFit: "cover" }}
                    onError={() => setImgErr((e) => ({ ...e, [i]: true }))}
                  />
                ) : (
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundColor: "#05090b",
                    backgroundImage: `linear-gradient(rgba(${G},0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(${G},0.08) 1px,transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }} />
                )}

                {/* cinematic vignette */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(4,9,7,0.05) 0%, rgba(4,9,7,0.32) 46%, rgba(4,9,7,0.92) 100%)",
                }} />

                {/* top category chip */}
                {p.category && (
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    fontFamily: "var(--font-mono-next)", fontSize: "0.4rem",
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    color: `rgba(${G},0.95)`,
                    background: "rgba(4,9,7,0.6)", backdropFilter: "blur(6px)",
                    border: `1px solid rgba(${G},0.34)`,
                    borderRadius: 999, padding: "3px 8px",
                  }}>
                    {p.category}
                  </span>
                )}

                {/* extra scrim that deepens the bottom on hover for legibility */}
                <div className="nox-scrim" aria-hidden style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(180deg, rgba(4,9,7,0) 32%, rgba(4,9,7,0.55) 64%, rgba(4,9,7,0.96) 100%)",
                }} />

                {/* bottom panel — title/year always; full detail on hover */}
                <div className="nox-copy" style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "1.05rem 1.15rem" }}>
                  <div style={{
                    height: 1, marginBottom: "0.6rem",
                    background: `linear-gradient(90deg, rgba(${G},0.6), transparent)`,
                  }} />
                  <h3 style={{
                    fontFamily: "var(--font-display-next)",
                    fontSize: "1.72rem", lineHeight: 0.95, letterSpacing: "-0.02em",
                    color: "#F8F5EE",
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    marginTop: "0.35rem",
                    fontFamily: "var(--font-mono-next)", fontSize: "0.44rem",
                    letterSpacing: "0.26em", textTransform: "uppercase",
                    color: `rgba(${G},0.85)`,
                  }}>
                    {p.year ?? "2025"}
                  </p>

                  {/* ── revealed on hover: description + Explore button ── */}
                  <div className="nox-detail">
                    <div className="nox-detail-inner">
                    {p.description ? (
                      <p style={{
                        marginTop: "0.75rem",
                        fontSize: "0.8rem", lineHeight: 1.6,
                        color: "rgba(255,255,255,0.68)",
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {p.description}
                      </p>
                    ) : null}
                    <span style={{
                      marginTop: "0.95rem",
                      display: "inline-flex", alignItems: "center", gap: 10,
                      padding: "0.72rem 1.4rem",
                      fontFamily: "var(--font-mono-next)", fontSize: "0.62rem",
                      letterSpacing: "0.3em", textTransform: "uppercase",
                      color: "#F8F5EE", whiteSpace: "nowrap",
                      background: `rgba(${G},0.16)`,
                      border: `1.5px solid rgba(${G},0.9)`,
                      borderRadius: 999,
                      backdropFilter: "blur(10px)",
                      boxShadow: `0 0 30px rgba(${G},0.38), inset 0 0 22px rgba(${G},0.12)`,
                    }}>
                      Explore
                      <span style={{ fontSize: "0.82rem", lineHeight: 1 }}>→</span>
                    </span>
                    </div>
                  </div>
                </div>

                {/* inner edge */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none",
                  border: "1px solid rgba(255,255,255,0.06)",
                }} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
