"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { DodecaShape } from "./shapes";

/* ── SVG Sketch Annotations ───────────────────────────────────────────── */

function SquigglyUnderline({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        bottom: -8,
        width: "100%",
        height: 14,
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 6 Q25 1 50 6 Q75 11 100 6 Q125 1 150 6 Q175 11 200 6"
        stroke="rgba(58,191,138,0.55)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
        whileInView={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2, delay, ease: "easeInOut" }}
        viewport={{ once: true, margin: "-80px" }}
      />
    </svg>
  );
}

function OvalCircle({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: "-8%",
        top: "-22%",
        width: "116%",
        height: "145%",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
      viewBox="0 0 240 60"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M120 4 C180 2, 238 16, 236 30 C234 44, 178 57, 120 56 C62 58, 5 44, 4 30 C3 16, 60 6, 120 4 Z"
        stroke="rgba(58,191,138,0.40)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: 400, strokeDashoffset: 400 }}
        whileInView={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.4, delay, ease: "easeInOut" }}
        viewport={{ once: true, margin: "-80px" }}
      />
    </svg>
  );
}

function SketchArrow({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        right: "-3rem",
        top: "0.5rem",
        width: 56,
        height: 36,
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox="0 0 56 36"
    >
      <motion.path
        d="M0 0 L36 0 L36 26"
        stroke="rgba(240,236,227,0.22)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
        whileInView={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        viewport={{ once: true, margin: "-80px" }}
      />
      <motion.path
        d="M27 18 L36 26 L45 18"
        stroke="rgba(240,236,227,0.22)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
        whileInView={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.7, ease: "easeOut" }}
        viewport={{ once: true, margin: "-80px" }}
      />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "01",
    label: "Mission",
    heading: "Build things people remember.",
    accentWord: "remember",
    annotation: "underline" as const,
    body: "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.",
  },
  {
    num: "02",
    label: "Vision",
    heading: "World-class craft for every brand.",
    accentWord: "every brand",
    annotation: "circle" as const,
    body: "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.",
  },
  {
    num: "03",
    label: "Why",
    heading: "Because forgettable is a waste.",
    accentWord: "a waste",
    annotation: "arrow" as const,
    body: "Most digital work gets scrolled past in under a second. We started DON'T FORGET because we believe that's a failure — of execution, of intent, and of respect for the audience.",
  },
];

const VALUES = [
  { title: "Clarity over clutter", body: "If it doesn't sharpen the message, it doesn't ship." },
  { title: "Motion with intent", body: "Every animation earns its place or it doesn't exist." },
  { title: "Systems, not one-offs", body: "We build logic as strong as the visuals." },
  { title: "Honesty, always", body: "We'll tell you when your brief needs work. You'll thank us." },
  { title: "Speed is a feature", body: "Slow websites lose business. We build fast by default." },
  { title: "Ownership mindset", body: "We treat your project like it's ours. Because it is." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Component ────────────────────────────────────────────────────────── */

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.88)", backdropFilter: "blur(6px)" }}
    >
      {/* Top glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.28), transparent)" }}
      />

      {/* DodecaShape corner */}
      <div
        className="pointer-events-none absolute"
        style={{ right: -40, top: "8%", opacity: 0.18, zIndex: 0 }}
      >
        <DodecaShape />
      </div>

      <div className="wrap relative z-10">
        <motion.p
          className="eyebrow"
          style={{ marginBottom: "4rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
        >
          What drives us
        </motion.p>

        {/* ── Pillars ── */}
        <div className="divide-y divide-[var(--border)]">
          {PILLARS.map((p, i) => {
            const isEven = i % 2 === 1;
            const labelCol = (
              <div className="flex flex-col gap-1 pt-1">
                <span className="eyebrow">{p.label}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono-next)",
                    fontSize: "0.46rem",
                    letterSpacing: "0.44em",
                    textTransform: "uppercase",
                    color: "var(--body)",
                    opacity: 0.45,
                    marginTop: 4,
                  }}
                >
                  {p.num}
                </span>
              </div>
            );
            const contentCol = (
              <div style={{ position: "relative" }}>
                <motion.h3
                  className="hed"
                  style={{
                    fontSize: "clamp(1.9rem,3.2vw,3rem)",
                    lineHeight: 1.06,
                    color: "var(--fg)",
                    display: "inline-block",
                    transformOrigin: "left center",
                    cursor: "default",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                  onHoverStart={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1.04) translateX(6px)";
                  }}
                  onHoverEnd={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1) translateX(0)";
                  }}
                >
                  {p.heading.split(p.accentWord).map((part, pi, arr) => (
                    <span key={pi}>
                      {part}
                      {pi < arr.length - 1 && (
                        <span style={{ position: "relative", display: "inline-block" }}>
                          {p.accentWord}
                          {p.annotation === "underline" && <SquigglyUnderline delay={0.4} />}
                          {p.annotation === "circle" && <OvalCircle delay={0.3} />}
                          {p.annotation === "arrow" && <SketchArrow delay={0.35} />}
                        </span>
                      )}
                    </span>
                  ))}
                </motion.h3>
                <motion.p
                  style={{
                    marginTop: "1.75rem",
                    maxWidth: "56ch",
                    fontSize: "0.9375rem",
                    lineHeight: 1.9,
                    color: "var(--body)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                >
                  {p.body}
                </motion.p>
              </div>
            );

            return (
              <div
                key={p.num}
                className="grid gap-8 py-14"
                style={{
                  gridTemplateColumns: isEven ? "1fr 180px" : "180px 1fr",
                }}
              >
                {isEven ? [contentCol, labelCol] : [labelCol, contentCol]}
              </div>
            );
          })}
        </div>

        {/* ── Values bento grid ── */}
        <div className="mt-20 pt-14 border-t border-[var(--border)]">
          <motion.p
            className="eyebrow"
            style={{ marginBottom: "3rem" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            How we work
          </motion.p>

          <div
            data-values-bento
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {VALUES.map((v, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div
                  key={i}
                  data-val
                  style={{
                    gridColumn: isLarge ? "span 2" : "span 1",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: isLarge ? "2.25rem 2.5rem" : "1.75rem 2rem",
                    background: "var(--surface)",
                    cursor: "default",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.07,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, margin: "-80px" }}
                  onHoverStart={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-5px)";
                    el.style.borderColor = "rgba(58,191,138,0.38)";
                    el.style.background =
                      "radial-gradient(ellipse 80% 80% at 30% 30%, rgba(58,191,138,0.07) 0%, var(--surface) 70%)";
                  }}
                  onHoverEnd={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "var(--border)";
                    el.style.background = "var(--surface)";
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono-next)",
                      fontSize: "0.46rem",
                      letterSpacing: "0.48em",
                      textTransform: "uppercase",
                      color: "var(--teal)",
                      marginBottom: "1rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="hed"
                    style={{
                      fontSize: isLarge ? "1.2rem" : "1.05rem",
                      color: "var(--fg)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {v.title}
                  </h4>
                  <p style={{ fontSize: "0.84rem", lineHeight: 1.8, color: "var(--body)" }}>
                    {v.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
