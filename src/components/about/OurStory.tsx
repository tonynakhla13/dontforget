"use client";

import { motion } from "framer-motion";
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

function TimelineCard({
  event,
  index,
  isLeft,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  isLeft: boolean;
}) {
  return (
    <div
      className="relative grid gap-12 items-center"
      style={{ gridTemplateColumns: isLeft ? "1fr 60px 1fr" : "1fr 60px 1fr" }}
    >
      {/* Left card or spacer */}
      {isLeft ? (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-right"
        >
          <div
            className="relative rounded-[1.25rem] overflow-hidden"
            style={{
              border: "1px solid rgba(58,191,138,0.30)",
              padding: "2.5rem 2.75rem",
              background: "rgba(9,9,9,0.92)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 rounded-t-[1.25rem]"
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.60) 50%, transparent)",
              }}
            />
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.46rem",
                letterSpacing: "0.44em",
                textTransform: "uppercase",
                color: "var(--teal)",
                marginBottom: "1rem",
              }}
            >
              {event.num}
            </span>
            <h3
              className="hed"
              style={{
                fontSize: "clamp(1.6rem,2.4vw,2.2rem)",
                lineHeight: 1.08,
                color: "var(--fg)",
                marginBottom: "1.25rem",
              }}
            >
              {event.title}
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.85, color: "var(--body)" }}>
              {event.body}
            </p>
            <p
              style={{
                marginTop: "1.5rem",
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.52rem",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--teal)",
              }}
            >
              {event.year}
            </p>
          </div>
        </motion.div>
      ) : (
        <div />
      )}

      {/* Center timeline dot */}
      <div className="flex flex-col items-center h-full">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            background: "var(--teal)",
            borderRadius: "50%",
            border: "2px solid rgba(9,9,9,1)",
            boxShadow: "0 0 0 4px rgba(9,9,9,1), 0 0 0 7px rgba(58,191,138,0.92), 0 0 20px rgba(58,191,138,0.68)",
            zIndex: 10,
            flexShrink: 0,
          }}
        />
        {index < EVENTS.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-80px" }}
            style={{
              width: 1,
              flex: 1,
              background: "linear-gradient(to bottom, rgba(58,191,138,0.5) 0%, rgba(58,191,138,0.1) 100%)",
              transformOrigin: "top",
              minHeight: "80px",
            }}
          />
        )}
      </div>

      {/* Right card or spacer */}
      {!isLeft ? (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-left"
        >
          <div
            className="relative rounded-[1.25rem] overflow-hidden"
            style={{
              border: "1px solid rgba(58,191,138,0.30)",
              padding: "2.5rem 2.75rem",
              background: "rgba(9,9,9,0.92)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 rounded-t-[1.25rem]"
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(58,191,138,0.60) 50%, transparent)",
              }}
            />
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.46rem",
                letterSpacing: "0.44em",
                textTransform: "uppercase",
                color: "var(--teal)",
                marginBottom: "1rem",
              }}
            >
              {event.num}
            </span>
            <h3
              className="hed"
              style={{
                fontSize: "clamp(1.6rem,2.4vw,2.2rem)",
                lineHeight: 1.08,
                color: "var(--fg)",
                marginBottom: "1.25rem",
              }}
            >
              {event.title}
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.85, color: "var(--body)" }}>
              {event.body}
            </p>
            <p
              style={{
                marginTop: "1.5rem",
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.52rem",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--teal)",
              }}
            >
              {event.year}
            </p>
          </div>
        </motion.div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default function OurStory() {
  return (
    <section
      className="relative border-t border-[var(--border)] section-py overflow-hidden"
      style={{ background: "rgba(9,9,9,0.72)" }}
    >
      {/* Readability gradient */}
      <div
        className="pointer-events-none fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(9,9,9,0.10) 0%, rgba(9,9,9,0.58) 100%)",
          zIndex: 0,
        }}
      />

      {/* TorusShape — background decoration */}
      <div
        className="pointer-events-none fixed"
        style={{
          right: "6%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.15,
          zIndex: 0,
        }}
      >
        <TorusShape />
      </div>

      <div className="wrap relative z-10">
        {/* Section header */}
        <div className="mb-20">
          <motion.p
            className="eyebrow mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            Our Story
          </motion.p>
          <motion.h2
            className="hed"
            style={{ fontSize: "clamp(3rem,6vw,5rem)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            How we got{" "}
            <span className="script" style={{ color: "var(--teal)" }}>
              here.
            </span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="space-y-16">
          {EVENTS.map((event, i) => (
            <TimelineCard key={i} event={event} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
