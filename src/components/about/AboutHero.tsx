"use client";

import { motion } from "framer-motion";

/* ── Fluid iridescent blob art (teal-dominant, on-brand) ──────────────── */

function BlobField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Core teal mass — top center, drifting */}
      <motion.div
        className="absolute"
        style={{
          top: "4%",
          left: "32%",
          width: "46vw",
          height: "46vw",
          borderRadius: "47% 53% 44% 56% / 53% 46% 54% 47%",
          background:
            "radial-gradient(40% 40% at 38% 32%, rgba(58,191,138,0.55) 0%, rgba(58,191,138,0.12) 45%, transparent 72%)",
          filter: "blur(50px)",
          mixBlendMode: "screen",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cyan sheen — overlaps for iridescence */}
      <motion.div
        className="absolute"
        style={{
          top: "14%",
          left: "44%",
          width: "34vw",
          height: "34vw",
          borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(45,212,191,0.42) 0%, rgba(34,211,238,0.10) 50%, transparent 74%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
        }}
        animate={{ x: [0, -50, 25, 0], y: [0, 25, -15, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      {/* Warm accent — small iridescent kiss (orange→pink) */}
      <motion.div
        className="absolute"
        style={{
          top: "26%",
          left: "30%",
          width: "22vw",
          height: "22vw",
          borderRadius: "50%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(251,146,60,0.30) 0%, rgba(236,72,153,0.10) 55%, transparent 75%)",
          filter: "blur(55px)",
          mixBlendMode: "screen",
        }}
        animate={{ x: [0, 30, -25, 0], y: [0, -20, 20, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Deep emerald base — anchors lower mass */}
      <motion.div
        className="absolute"
        style={{
          top: "40%",
          left: "38%",
          width: "40vw",
          height: "40vw",
          borderRadius: "55% 45% 48% 52% / 50% 52% 48% 50%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(16,185,129,0.40) 0%, rgba(58,191,138,0.10) 50%, transparent 73%)",
          filter: "blur(65px)",
          mixBlendMode: "screen",
        }}
        animate={{ x: [0, -30, 35, 0], y: [0, 35, -10, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      />
      {/* Far-right faint orb */}
      <motion.div
        className="absolute"
        style={{
          top: "8%",
          right: "-6%",
          width: "18vw",
          height: "18vw",
          borderRadius: "50%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(58,191,138,0.30) 0%, transparent 70%)",
          filter: "blur(45px)",
          mixBlendMode: "screen",
        }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── Scattered stat callout ───────────────────────────────────────────── */

function Stat({
  value,
  label,
  style,
  delay,
}: {
  value: string;
  label: string;
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute z-20"
      style={style}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="hed leading-none text-[var(--fg)]" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}>
        {value}
      </p>
      <p
        className="mt-1 font-mono uppercase text-[var(--body)]"
        style={{ fontSize: "0.55rem", letterSpacing: "0.28em" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "transparent" }}>
      <BlobField />

      {/* Vignette to keep edges legible */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, rgba(9,9,9,0.35) 70%, rgba(9,9,9,0.85) 100%)",
        }}
      />

      {/* ── Band 1: overlapping headline + scattered stats ── */}
      <div className="wrap relative z-10" style={{ paddingTop: "clamp(9rem,18vh,15rem)", paddingBottom: "4rem" }}>
        <div className="relative" style={{ minHeight: "min(58vw, 640px)" }}>
          {/* WE */}
          <motion.h1
            className="hed"
            style={{
              position: "relative",
              fontSize: "clamp(4.5rem,17vw,18rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
              color: "var(--fg)",
              zIndex: 12,
            }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            we build
          </motion.h1>

          {/* THINGS — offset right, overlapping */}
          <motion.h1
            className="hed"
            style={{
              position: "relative",
              marginTop: "-0.06em",
              textAlign: "right",
              fontSize: "clamp(4.5rem,17vw,18rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(240,236,227,0.55)",
              zIndex: 11,
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            things
          </motion.h1>

          {/* UNFORGETTABLE — lower, teal-tinted */}
          <motion.h1
            className="hed script"
            style={{
              position: "relative",
              marginTop: "-0.04em",
              fontSize: "clamp(3rem,11vw,12rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.01em",
              color: "var(--teal)",
              fontStyle: "italic",
              zIndex: 12,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          >
            unforgettable.
          </motion.h1>

          {/* Scattered stats */}
          <Stat
            value="14+"
            label="projects shipped"
            delay={0.7}
            style={{ top: "2%", right: "2%" }}
          />
          <Stat
            value="6"
            label="countries served"
            delay={0.85}
            style={{ top: "42%", left: "1%" }}
          />
          <Stat
            value="3 yrs"
            label="building since 2022"
            delay={1}
            style={{ bottom: "0%", right: "8%" }}
          />
        </div>
      </div>

      {/* ── Band 2: eyebrow + CTA pill ── */}
      <div className="wrap relative z-10 flex flex-col items-center gap-8 pb-6 text-center">
        <motion.p
          className="eyebrow"
          style={{ letterSpacing: "0.36em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.05 }}
        >
          Est. 2022 — Digital Studio
        </motion.p>

        <motion.div
          className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1.5 pl-6"
          style={{ background: "rgba(17,17,17,0.6)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
        >
          <span className="text-sm text-[var(--body)]">Got something worth remembering?</span>
          <a
            href="#contact"
            className="rounded-full px-6 py-3 text-sm font-medium transition-colors"
            style={{ background: "var(--teal)", color: "var(--bg)" }}
          >
            Let&apos;s talk
          </a>
        </motion.div>
      </div>

      {/* ── Band 3: mid paragraph (right-aligned like reference) ── */}
      <div className="wrap relative z-10 grid gap-8 pb-20 pt-10 md:grid-cols-2">
        <motion.p
          className="self-end text-[var(--teal)]"
          style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          For brands worth remembering
        </motion.p>
        <motion.p
          className="max-w-md justify-self-end text-[0.95rem] leading-[1.9] text-[var(--body)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          A small studio obsessed with craft, speed, and digital work that makes people stop
          scrolling. We build fast, beautiful, memorable websites, apps, and systems — not a
          factory, not a freelancer, something better than both.
        </motion.p>
      </div>
    </section>
  );
}
