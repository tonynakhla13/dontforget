"use client";

import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Tony Nakhla",
    role: "Founder & Lead Developer",
    bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
    initials: "TN",
    accent: "rgba(58,191,138,0.9)",
  },
  {
    name: "— Open",
    role: "Senior UI/UX Designer",
    bio: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
  {
    name: "— Open",
    role: "Mobile Developer",
    bio: "iOS + Android, React Native. You care about feel, not just functionality. Performance is non-negotiable.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
  {
    name: "— Open",
    role: "SEO & Growth Strategist",
    bio: "Data-driven, creative enough to see what the data misses. AI search fluency is a plus.",
    initials: "?",
    accent: "rgba(58,191,138,0.35)",
  },
];

function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-[1rem] overflow-hidden"
      style={{ width: "100%", aspectRatio: "1", background: "var(--surface2)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 38% 32%, ${accent} 0%, rgba(9,9,9,0.85) 70%)`,
        }}
      />
      <span className="relative z-10 hed text-[3.5rem] text-[var(--fg)] opacity-30">
        {initials}
      </span>
      {/* Corner teal accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-30" />
    </div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TeamSection() {
  return (
    <section className="relative section-py border-t border-[var(--border)]" style={{ background: "rgba(9,9,9,0.72)", backdropFilter: "blur(4px)" }}>
      <div className="wrap">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <motion.p
              className="eyebrow mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              viewport={{ once: true, margin: "-80px" }}
            >
              The team
            </motion.p>
            <motion.h2
              className="hed text-[3rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              viewport={{ once: true, margin: "-80px" }}
            >
              Small team.<br />
              <span className="text-[var(--teal)]">Big output.</span>
            </motion.h2>
          </div>
          <motion.p
            className="self-end text-[0.9375rem] leading-[1.85] text-[var(--body)] md:mb-2 md:max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            We stay lean on purpose. Every project gets senior-level attention from start to ship.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              data-team-card
              className="group flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-300 hover:border-[var(--teal-mid)]"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <Avatar initials={member.initials} accent={member.accent} />
              <div>
                <h3 className="hed text-[1.1rem] text-[var(--fg)]">{member.name}</h3>
                <span className="mt-1 block font-mono text-[0.52rem] uppercase tracking-[0.34em] text-[var(--teal)]">
                  {member.role}
                </span>
                <p className="mt-4 text-[0.8rem] leading-[1.8] text-[var(--body)]">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hiring CTA */}
        <motion.div
          className="mt-16 flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-8 py-7"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <div>
            <p className="hed text-[1.2rem] text-[var(--fg)]">Think you belong here?</p>
            <p className="mt-1 text-[0.875rem] text-[var(--body)]">We&apos;re always open to people who are unreasonably good at what they do.</p>
          </div>
          <a href="mailto:hello@dontforget.studio" className="btn btn-primary shrink-0 ml-8">
            Get in touch →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
