"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TorusShape } from "./shapes";

const EVENTS = [
  { year: "2022", num: "01", title: "Founded",         body: "DON'T FORGET was born out of frustration. Too many agencies building forgettable work. We set out to change that — a small team with an unreasonably high bar." },
  { year: "2022", num: "02", title: "First client",    body: "A high-converting landing page for a fashion brand. Two weeks, start to finish. The client tripled their conversion rate in month one." },
  { year: "2023", num: "03", title: "Mobile practice", body: "Expanded into iOS and Android. Our first app shipped to the App Store and got featured by Apple in its first week." },
  { year: "2023", num: "04", title: "10 projects",     body: "Ten live projects across three countries. Every one built from scratch, designed with intent, shipped on time. No templates. No shortcuts." },
  { year: "2024", num: "05", title: "E-commerce",      body: "Full e-commerce practice launched — Shopify, WooCommerce, and fully custom storefronts. The SEO-first approach started compounding fast." },
  { year: "2024", num: "06", title: "CRM & systems",   body: "First custom CRM built for a travel platform. Engineer-minded precision became our standard — and our edge over every other studio." },
  { year: "2025", num: "07", title: "SEO & AI search", body: "Launched AI-powered search and marketing. Results most agencies call impossible. We just call it doing the work properly." },
  { year: "2025", num: "08", title: "6 countries",     body: "Projects live in 6 countries. 14+ clients. Zero boring websites. Staying small on purpose — every client gets the A-team." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Card({ event, isLeft }: { event: (typeof EVENTS)[0]; isLeft: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -40 : 40 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div
        className="relative rounded-[1.25rem] overflow-hidden"
        style={{
          border: "1px solid rgba(58,191,138,0.28)",
          padding: "2rem 2.25rem",
          background: "rgba(9,9,9,0.90)",
          backdropFilter: "blur(18px)",
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.55) 50%, transparent)",
          }}
        />

        {/* Year + num row */}
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.52rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "var(--teal)",
            }}
          >
            {event.year}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.44rem",
              letterSpacing: "0.44em",
              textTransform: "uppercase",
              color: "var(--body)",
              opacity: 0.5,
            }}
          >
            {event.num}
          </span>
        </div>

        <h3
          className="hed"
          style={{
            fontSize: "clamp(1.4rem,2vw,1.9rem)",
            lineHeight: 1.1,
            color: "var(--fg)",
            marginBottom: "1rem",
          }}
        >
          {event.title}
        </h3>
        <p style={{ fontSize: "0.85rem", lineHeight: 1.85, color: "var(--body)" }}>
          {event.body}
        </p>
      </div>
    </motion.div>
  );
}

function Dot({ index }: { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative z-10 flex items-center justify-center"
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "var(--teal)",
        border: "2px solid rgba(9,9,9,1)",
        boxShadow: "0 0 0 4px rgba(9,9,9,1), 0 0 0 7px rgba(58,191,138,0.88), 0 0 22px rgba(58,191,138,0.60)",
        flexShrink: 0,
      }}
    >
      {/* Pulse ring — Framer Motion loop */}
      <motion.div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: "50%",
          border: "1px solid rgba(58,191,138,0.55)",
        }}
        animate={{ scale: [1, 1.8], opacity: [0.55, 0] }}
        transition={{
          duration: 2.2,
          delay: index * 0.28,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

export default function OurStory() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section
      className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.72)" }}
    >
      <div className="wrap relative z-10">
        {/* Section header */}
        <div className="mb-20" ref={headerRef}>
          <motion.p
            className="eyebrow mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Our Story
          </motion.p>
          <motion.h2
            className="hed"
            style={{ fontSize: "clamp(3rem,6vw,5rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            How we got{" "}
            <span className="script" style={{ color: "var(--teal)" }}>
              here.
            </span>
          </motion.h2>
        </div>

        {/* Timeline — continuous center line with alternating cards */}
        <div className="relative">

          {/* ── Continuous vertical line ── */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              bottom: 0,
              left: "50%",
              width: 1,
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom, rgba(58,191,138,0.55) 0%, rgba(58,191,138,0.08) 100%)",
              zIndex: 0,
            }}
          />

          {/* ── Cylinder shape — sits in center, behind cards ── */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.20,
              zIndex: 1,
            }}
          >
            <TorusShape />
          </div>

          {/* ── Cards ── */}
          {EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className="relative grid items-center"
                style={{
                  gridTemplateColumns: "1fr 60px 1fr",
                  paddingTop: "2.5rem",
                  paddingBottom: "2.5rem",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                }}
              >
                {/* Left slot */}
                {isLeft ? (
                  <Card event={event} isLeft />
                ) : (
                  <div />
                )}

                {/* Center dot */}
                <div className="flex items-center justify-center" style={{ zIndex: 2 }}>
                  <Dot index={i} />
                </div>

                {/* Right slot */}
                {!isLeft ? (
                  <Card event={event} isLeft={false} />
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
