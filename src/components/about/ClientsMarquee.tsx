"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────
   LOGO DATA
   Replace `icon` with a real <img src="…" /> or next/image once you have
   actual SVG assets. The geometric marks below are placeholder brand marks.
───────────────────────────────────────────────────────────────────────── */
type Client = { name: string; icon: React.ReactNode };

const TEAL = "rgba(58,191,138,0.70)";

const mkIcon = (children: React.ReactNode) => (
  <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
    {children}
  </svg>
);

const CLIENTS: Client[] = [
  { name: "Atelier Noir", icon: mkIcon(<><circle cx="18" cy="18" r="13" stroke={TEAL} strokeWidth="1.2"/><circle cx="18" cy="18" r="6" stroke={TEAL} strokeWidth="1.2" opacity="0.5"/><circle cx="18" cy="18" r="1.8" fill={TEAL}/></>) },
  { name: "Meridian",     icon: mkIcon(<><polygon points="18,3 33,30 3,30" stroke={TEAL} strokeWidth="1.2" fill="none"/><line x1="18" y1="10" x2="18" y2="24" stroke={TEAL} strokeWidth="1.2" opacity="0.5"/></>) },
  { name: "Solaris Labs", icon: mkIcon(<><rect x="5" y="5" width="26" height="26" rx="3" stroke={TEAL} strokeWidth="1.2" fill="none"/><rect x="12" y="12" width="12" height="12" rx="1.5" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/><circle cx="18" cy="18" r="2" fill={TEAL}/></>) },
  { name: "Parcel",       icon: mkIcon(<><path d="M18 3 L33 12 L33 24 L18 33 L3 24 L3 12 Z" stroke={TEAL} strokeWidth="1.2" fill="none"/><path d="M18 10 L26 15 L26 21 L18 26 L10 21 L10 15 Z" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.45"/></>) },
  { name: "Drift & Co.",  icon: mkIcon(<><circle cx="12" cy="18" r="9" stroke={TEAL} strokeWidth="1.2" fill="none"/><circle cx="24" cy="18" r="9" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/></>) },
  { name: "Orbit Travel", icon: mkIcon(<><ellipse cx="18" cy="18" rx="14" ry="7" stroke={TEAL} strokeWidth="1.2" fill="none"/><ellipse cx="18" cy="18" rx="7" ry="14" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/><circle cx="18" cy="18" r="2.5" fill={TEAL}/></>) },
  { name: "Nexus",        icon: mkIcon(<><line x1="18" y1="3" x2="18" y2="33" stroke={TEAL} strokeWidth="1.2"/><line x1="3" y1="18" x2="33" y2="18" stroke={TEAL} strokeWidth="1.2"/><line x1="7" y1="7" x2="29" y2="29" stroke={TEAL} strokeWidth="1.2" opacity="0.45"/><line x1="29" y1="7" x2="7" y2="29" stroke={TEAL} strokeWidth="1.2" opacity="0.45"/><circle cx="18" cy="18" r="3" stroke={TEAL} strokeWidth="1.2" fill="none"/></>) },
  { name: "Forma Studio", icon: mkIcon(<><rect x="4" y="4" width="28" height="28" rx="14" stroke={TEAL} strokeWidth="1.2" fill="none"/><rect x="10" y="10" width="16" height="16" rx="3" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/></>) },
  { name: "Arca",         icon: mkIcon(<><path d="M18 4 L32 28 H4 Z" stroke={TEAL} strokeWidth="1.2" fill="none"/><path d="M18 13 L25 26 H11 Z" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.45"/></>) },
  { name: "Tessera",      icon: mkIcon(<><rect x="4" y="4" width="11" height="11" stroke={TEAL} strokeWidth="1.2" fill="none"/><rect x="21" y="4" width="11" height="11" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.6"/><rect x="4" y="21" width="11" height="11" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.6"/><rect x="21" y="21" width="11" height="11" stroke={TEAL} strokeWidth="1.2" fill="none"/></>) },
  { name: "Lumen Digital",icon: mkIcon(<><path d="M18 4 Q30 4 32 18 Q30 32 18 32 Q6 32 4 18 Q6 4 18 4" stroke={TEAL} strokeWidth="1.2" fill="none"/><path d="M18 10 Q24 10 26 18 Q24 26 18 26 Q12 26 10 18 Q12 10 18 10" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/><circle cx="18" cy="18" r="2" fill={TEAL}/></>) },
  { name: "Haven",        icon: mkIcon(<><path d="M18 4 L30 16 L30 32 L6 32 L6 16 Z" stroke={TEAL} strokeWidth="1.2" fill="none"/><path d="M13 32 L13 22 L23 22 L23 32" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/></>) },
  { name: "Strata",       icon: mkIcon(<><line x1="4" y1="10" x2="32" y2="10" stroke={TEAL} strokeWidth="1.4"/><line x1="4" y1="18" x2="32" y2="18" stroke={TEAL} strokeWidth="1.4" opacity="0.6"/><line x1="4" y1="26" x2="32" y2="26" stroke={TEAL} strokeWidth="1.4" opacity="0.35"/></>) },
  { name: "Cove",         icon: mkIcon(<><path d="M4 28 Q18 4 32 28" stroke={TEAL} strokeWidth="1.2" fill="none"/><path d="M8 28 Q18 10 28 28" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5"/><path d="M12 28 Q18 16 24 28" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.3"/></>) },
];

/* ── duplicate for seamless loop ── */
const ROW_A = [...CLIENTS, ...CLIENTS];
const ROW_B = [...CLIENTS.slice(7), ...CLIENTS.slice(0, 7), ...CLIENTS.slice(7), ...CLIENTS.slice(0, 7)];

/* ─────────────────────────────────────────────────────────────────────────
   LOGO CARD
───────────────────────────────────────────────────────────────────────── */
function LogoCard({ client }: { client: Client }) {
  return (
    <div
      className="group relative flex-shrink-0 flex flex-col items-center justify-center gap-4 cursor-default"
      style={{
        width: 220,
        height: 140,
        margin: "0 16px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "border-color 0.3s, background 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(58,191,138,0.30)";
        el.style.background  = "rgba(58,191,138,0.04)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.06)";
        el.style.background  = "rgba(255,255,255,0.02)";
      }}
    >
      {/* glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(58,191,138,0.10) 0%, transparent 70%)",
          transition: "opacity 0.35s",
        }}
      />

      {/* icon */}
      <div style={{ opacity: 0.55, transition: "opacity 0.3s" }}
        className="group-hover:!opacity-90">
        {client.icon}
      </div>

      {/* name */}
      <span
        style={{
          fontFamily: "var(--font-mono-next)",
          fontSize: "0.52rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(240,236,227,0.30)",
          transition: "color 0.3s",
          whiteSpace: "nowrap",
        }}
        className="group-hover:!text-[rgba(240,236,227,0.70)]"
      >
        {client.name}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MARQUEE ROW
───────────────────────────────────────────────────────────────────────── */
function wrapOffset(x: number, width: number) {
  if (!width) return x;
  while (x <= -width) x += width;
  while (x > 0) x -= width;
  return x;
}

function MarqueeRow({ clients, reverse = false, speed = 145 }: { clients: Client[]; reverse?: boolean; speed?: number }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const loopWidthRef = useRef(0);
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const impulseRef = useRef(0);
  const pointerRef = useRef({ id: -1, x: 0, time: 0 });
  const [dragging, setDragging] = useState(false);

  function paint() {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let initialised = false;
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      loopWidthRef.current = track.scrollWidth / 2;
      if (!initialised) {
        xRef.current = reverse ? -loopWidthRef.current : 0;
        initialised = true;
      }
      xRef.current = wrapOffset(xRef.current, loopWidthRef.current);
      paint();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();

    const tick = (now: number) => {
      const seconds = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!draggingRef.current && !hoveredRef.current) {
        const cruise = reduceMotion ? 0 : (reverse ? speed : -speed);
        xRef.current = wrapOffset(
          xRef.current + (cruise + impulseRef.current) * seconds,
          loopWidthRef.current,
        );
        impulseRef.current *= Math.pow(0.05, seconds);
        if (Math.abs(impulseRef.current) < 1) impulseRef.current = 0;
        paint();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [reduceMotion, reverse, speed]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    impulseRef.current = 0;
    pointerRef.current = { id: event.pointerId, x: event.clientX, time: performance.now() };
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || pointerRef.current.id !== event.pointerId) return;
    const now = performance.now();
    const delta = event.clientX - pointerRef.current.x;
    const seconds = Math.max(now - pointerRef.current.time, 16) / 1000;
    xRef.current = wrapOffset(xRef.current + delta, loopWidthRef.current);
    impulseRef.current = Math.max(-1800, Math.min(1800, delta / seconds));
    pointerRef.current = { id: event.pointerId, x: event.clientX, time: now };
    paint();
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerRef.current.id !== event.pointerId) return;
    draggingRef.current = false;
    pointerRef.current.id = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  return (
    <div
      className={`relative overflow-hidden select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        touchAction: "pan-y",
      }}
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          willChange: "transform",
        }}
      >
        {/* First copy */}
        {clients.map((c, i) => <LogoCard key={`a-${i}`} client={c} />)}
        {/* Duplicate for seamless loop */}
        {clients.map((c, i) => <LogoCard key={`b-${i}`} client={c} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────────────────── */
export default function ClientsMarquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 20%"] });
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <>
      <section
        ref={ref}
        className="relative overflow-hidden border-t border-[var(--border)]"
        style={{
          background: "rgba(9,9,9,0.28)",
          paddingTop: "clamp(4rem,7vw,6rem)",
          paddingBottom: "clamp(4rem,7vw,6rem)",
        }}
      >
        {/* top line accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.18), transparent)" }} />

        <motion.div style={{ y, opacity }}>

          {/* Header */}
          <div className="wrap mb-10 flex items-end justify-between">
            <p className="eyebrow">Trusted by</p>
            <p style={{ fontFamily:"var(--font-mono-next)", fontSize:"0.52rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--body)", opacity:0.35 }}>
              {CLIENTS.length} brands &amp; counting
            </p>
          </div>

          {/* Row 1 — scrolls left */}
          <div className="mb-4">
            <MarqueeRow clients={ROW_A} speed={165} />
          </div>

          {/* Row 2 — scrolls right, slower */}
          <MarqueeRow clients={ROW_B} reverse speed={140} />

        </motion.div>

        {/* bottom line accent */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.10), transparent)" }} />
      </section>
    </>
  );
}
