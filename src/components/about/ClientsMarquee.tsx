"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   DATA — replace names with real clients
───────────────────────────────────────────────────────────────────────── */
const CLIENTS = [
  "Atelier Noir",
  "Meridian",
  "Solaris Labs",
  "Parcel",
  "Drift & Co.",
  "Orbit Travel",
  "Nexus",
  "Forma Studio",
  "Arca",
  "Tessera",
  "Lumen Digital",
  "Haven",
  "Strata",
  "Cove",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function ClientsMarquee() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 20%"],
  });
  const y       = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative border-t border-[var(--border)]"
      style={{ background: "rgba(9,9,9,0.80)", paddingTop: "clamp(5rem,9vw,8rem)", paddingBottom: "clamp(5rem,9vw,8rem)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.18), transparent)" }} />

      <motion.div style={{ y, opacity }} className="wrap">

        {/* Header row */}
        <div className="mb-14 flex items-end justify-between border-b border-[var(--border)] pb-8">
          <p className="eyebrow">Trusted by</p>
          <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--body)", opacity: 0.35 }}>
            {CLIENTS.length} brands &amp; counting
          </p>
        </div>

        {/* Client name grid */}
        <ul
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 0, listStyle: "none" }}
        >
          {CLIENTS.map((name, i) => (
            <motion.li
              key={name}
              className="group relative flex items-center"
              style={{
                padding: "1.25rem 0",
                borderBottom: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
              }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: EASE }}
            >
              <span style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", width: "100%", display: "block" }}>
                {/* Index */}
                <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.38rem", letterSpacing: "0.44em", textTransform: "uppercase", color: "var(--body)", opacity: 0.3, display: "block", marginBottom: "0.4rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Name */}
                <span
                  className="hed"
                  style={{
                    fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                    color: "rgba(240,236,227,0.45)",
                    lineHeight: 1.1,
                    display: "block",
                    transition: "color 0.22s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.90)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.45)")}
                >
                  {name}
                </span>
              </span>

              {/* Hover teal bar on left */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--teal)] opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
            </motion.li>
          ))}
        </ul>

      </motion.div>
    </section>
  );
}
