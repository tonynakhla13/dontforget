"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/* ── API shape ─────────────────────────────────────────────────────────── */
type ClientItem = {
  id: string;
  name: string;
  company: string | null;
  logo: string | null;
  website: string | null;
};

/* ── Logo card ─────────────────────────────────────────────────────────── */
function LogoCard({ client }: { client: ClientItem }) {
  const display = client.company || client.name;
  const initials = display
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="group relative flex-shrink-0 flex flex-col items-center justify-center gap-3 cursor-default"
      style={{
        width: 200,
        height: 120,
        margin: "0 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "border-color 0.3s, background 0.3s",
        overflow: "hidden",
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
      {/* hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(58,191,138,0.10) 0%, transparent 70%)",
          transition: "opacity 0.35s",
        }}
      />

      {/* logo or initials */}
      {client.logo ? (
        <img
          src={client.logo}
          alt={display}
          style={{
            maxWidth: 110,
            maxHeight: 52,
            objectFit: "contain",
            opacity: 0.6,
            transition: "opacity 0.3s",
            filter: "brightness(0) invert(1)",
          }}
          className="group-hover:!opacity-90"
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-mono-next)",
            fontSize: "1.35rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(58,191,138,0.55)",
            transition: "color 0.3s",
          }}
          className="group-hover:!text-[rgba(58,191,138,0.9)]"
        >
          {initials}
        </span>
      )}

      {/* name */}
      <span
        style={{
          fontFamily: "var(--font-mono-next)",
          fontSize: "0.5rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(240,236,227,0.28)",
          transition: "color 0.3s",
          whiteSpace: "nowrap",
          maxWidth: 160,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="group-hover:!text-[rgba(240,236,227,0.65)]"
      >
        {display}
      </span>
    </div>
  );
}

/* ── Marquee row ───────────────────────────────────────────────────────── */
function wrapOffset(x: number, width: number) {
  if (!width) return x;
  while (x <= -width) x += width;
  while (x > 0) x -= width;
  return x;
}

function MarqueeRow({
  clients,
  reverse = false,
  speed = 145,
}: {
  clients: ClientItem[];
  reverse?: boolean;
  speed?: number;
}) {
  const reduceMotion = useReducedMotion();
  const trackRef     = useRef<HTMLDivElement>(null);
  const xRef         = useRef(0);
  const loopWidthRef = useRef(0);
  const hoveredRef   = useRef(false);
  const draggingRef  = useRef(false);
  const impulseRef   = useRef(0);
  const pointerRef   = useRef({ id: -1, x: 0, time: 0 });
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
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
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
      <div ref={trackRef} className="flex" style={{ willChange: "transform" }}>
        {clients.map((c, i) => <LogoCard key={`a-${i}`} client={c} />)}
        {clients.map((c, i) => <LogoCard key={`b-${i}`} client={c} />)}
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */
export default function ClientsMarquee() {
  const [clients, setClients] = useState<ClientItem[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then(r => r.json())
      .then((data: ClientItem[]) => {
        if (Array.isArray(data) && data.length > 0) setClients(data);
      })
      .catch(() => {});
  }, []);

  if (clients.length === 0) return null;

  return <ClientsMarqueeSection clients={clients} />;
}

function ClientsMarqueeSection({ clients }: { clients: ClientItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 20%"] });
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  /* Need at least enough cards to fill the viewport width twice */
  const padded = clients.length > 0
    ? [...Array(Math.ceil(20 / clients.length))].flatMap(() => clients)
    : [];
  const rowA = padded;
  const rowB = [...padded.slice(Math.floor(padded.length / 3)), ...padded.slice(0, Math.floor(padded.length / 3))];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[var(--border)]"
      style={{
        background: "rgba(9,9,9,0.28)",
        paddingTop: "clamp(4rem,7vw,6rem)",
        paddingBottom: "clamp(4rem,7vw,6rem)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.18), transparent)" }} />

      <motion.div style={{ y, opacity }}>
        <div className="wrap mb-10 flex items-end justify-between">
          <p className="eyebrow">Trusted by</p>
          <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--body)", opacity: 0.35 }}>
            {clients.length} brands &amp; counting
          </p>
        </div>

        <div className="mb-4">
          <MarqueeRow clients={rowA} speed={165} />
        </div>
        <MarqueeRow clients={rowB} reverse speed={140} />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.10), transparent)" }} />
    </section>
  );
}
