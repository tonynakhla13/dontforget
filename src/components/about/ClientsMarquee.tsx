"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   LOGO DATA
   Replace `icon` with a real <img src="…" /> or next/image once you have
   actual SVG assets. The geometric marks below are placeholder brand marks.
───────────────────────────────────────────────────────────────────────── */
type Client = { name: string; icon: React.ReactNode };

const TEAL = "rgba(58,191,138,0.70)";
const DIM  = "rgba(255,255,255,0.18)";

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
function MarqueeRow({ clients, reverse = false, duration = 38 }: { clients: Client[]; reverse?: boolean; duration?: number }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
    >
      <div
        className="flex"
        style={{
          animation: `marquee-${reverse ? "rev" : "fwd"} ${duration}s linear infinite`,
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
      {/* inject keyframes once */}
      <style>{`
        @keyframes marquee-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

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
            <MarqueeRow clients={ROW_A} reverse={false} duration={52} />
          </div>

          {/* Row 2 — scrolls right, slower */}
          <MarqueeRow clients={ROW_B} reverse={true} duration={68} />

        </motion.div>

        {/* bottom line accent */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.10), transparent)" }} />
      </section>
    </>
  );
}
