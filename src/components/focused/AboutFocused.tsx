"use client";

import FocusedLayout, { C, TEKO, MONO } from "./FocusedLayout";

export type FocusedTeamMember = {
  name: string;
  role: string;
  photo?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
};

const TEAM_FALLBACK: FocusedTeamMember[] = [
  { name: "Tony Nakhla",    role: "Founder & Lead Developer" },
  { name: "Sarah Chen",     role: "Creative Director" },
  { name: "Marcus Webb",    role: "UI/UX Designer" },
  { name: "Leila Hassan",   role: "Brand Strategist" },
];

function AvatarPlaceholder({ size = 280 }: { size?: number }) {
  return (
    <svg width={size * 0.6} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="30" r="18" fill={C.ph} stroke={C.green} strokeWidth="2" />
      <path d="M8 76c0-17.7 14.3-32 32-32s32 14.3 32 32" fill={C.ph} stroke={C.green} strokeWidth="2" />
    </svg>
  );
}

/* ── Social icon definitions ────────────────────────────────────── */
const SOCIAL_DEFS = [
  {
    label: "Instagram",
    getHref: (m: FocusedTeamMember) => m.instagramUrl,
    render: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    getHref: (m: FocusedTeamMember) => m.twitterUrl,
    render: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 5.8a8.6 8.6 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.2 4.2 0 0 0-7.1 3.8A11.9 11.9 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1c0 2 1.4 3.7 3.4 4.1a4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9 8.4 8.4 0 0 1-6.2 1.7A11.9 11.9 0 0 0 8 20.4c7.7 0 11.9-6.4 11.9-11.9v-.5A8.5 8.5 0 0 0 22 5.8z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    getHref: (m: FocusedTeamMember) => m.linkedinUrl,
    render: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function AboutFocused({ team = TEAM_FALLBACK }: { team?: FocusedTeamMember[] }) {
  return (
    <FocusedLayout title="About Us" activeNav="about" animationClass="kbm-about-content">

      {/* ── Hero image ───────────────────────────────────────────── */}
      <div className="kbm-about-content" style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem)",
        height: "clamp(260px, 40vw, 640px)",
        borderRadius: 40,
        backgroundColor: C.ph,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <svg width="40%" viewBox="0 0 320 200" fill="none">
          <rect width="320" height="200" rx="16" fill={C.cream} />
          <rect x="20" y="20" width="280" height="160" rx="12" fill={C.ph} />
          <text x="160" y="110" textAnchor="middle" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill={C.green} opacity="0.4">DON&apos;T FORGET</text>
        </svg>
      </div>

      {/* ── Byline ───────────────────────────────────────────────── */}
      <section style={{
        margin: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3.75rem) 0",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 4vw, 4rem)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1rem, 1.5vw, 1.3rem)", color: C.ink }}>
            Tony Nakhla — Founder
          </span>
          <div style={{
            padding: "12px 28px", borderRadius: 8, backgroundColor: "#E5E3DF",
            fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.2rem, 2vw, 2rem)",
            color: "#888", letterSpacing: "0.05em",
          }}>DON&apos;T FORGET</div>
        </div>
        <p style={{ fontFamily: MONO, fontSize: "clamp(0.82rem, 1.1vw, 1.05rem)", lineHeight: 1.65, color: C.ink }}>
          We started DON&apos;T FORGET because we were tired of digital work that disappears into the feed.
          Tired of websites built to check boxes rather than build businesses. We believe every brand
          deserves a digital presence that actually does something — one that converts, communicates,
          and compounds over time. That conviction is behind every project we take on.
        </p>
      </section>

      {/* ── Vision / Mission ─────────────────────────────────────── */}
      <section style={{
        margin: "clamp(3rem, 6vw, 7rem) clamp(1.5rem, 4vw, 3.75rem) 0",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 2rem)",
      }}>
        {/* Vision — dark */}
        <div style={{
          backgroundColor: C.ink, borderRadius: 40,
          padding: "clamp(2rem, 4vw, 4rem)",
          display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 2rem)",
        }}>
          <h2 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1, color: C.white, textTransform: "capitalize" }}>
            Our Vision
          </h2>
          <p style={{ fontFamily: MONO, fontSize: "clamp(0.82rem, 1.1vw, 1.05rem)", lineHeight: 1.65, color: "#B0ACA4" }}>
            We create digital experiences that are impossible to forget. In a world saturated with
            noise, we build brands, systems, and products that cut through — with craft, clarity,
            and code. We believe the best digital work doesn&apos;t just look good; it performs,
            compounds, and becomes a genuine asset for the businesses it serves.
          </p>
        </div>

        {/* Mission — yellow */}
        <div style={{
          backgroundColor: C.yellow, borderRadius: 40,
          padding: "clamp(2rem, 4vw, 4rem)",
          display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 2rem)",
        }}>
          <h2 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1, color: C.ink, textTransform: "capitalize" }}>
            Our Mission
          </h2>
          <p style={{ fontFamily: MONO, fontSize: "clamp(0.82rem, 1.1vw, 1.05rem)", lineHeight: 1.65, color: C.ink }}>
            Build strong digital brands. Distinctive, scalable, and conversion-focused.
            Strategy first, execution always.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Craft over shortcuts", "Performance by default", "Radical honesty"].map(item => (
              <li key={item} style={{ fontFamily: MONO, fontSize: "clamp(0.82rem, 1.1vw, 1.05rem)", lineHeight: 1.5, color: C.ink }}>
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section style={{
        margin: "clamp(3rem, 6vw, 7rem) clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 8rem)",
      }}>
        <h2 style={{
          fontFamily: TEKO, fontWeight: 700,
          fontSize: "clamp(2rem, 4vw, 4rem)",
          lineHeight: 1, color: C.ink,
          marginBottom: "clamp(2rem, 4vw, 4rem)",
        }}>Meet Our Team</h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
          gap: "clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2rem)",
        }}>
          {team.map((member, i) => {
            const hasSocials = SOCIAL_DEFS.some(s => s.getHref(member));
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                {/* photo */}
                <div style={{
                  height: "clamp(200px, 28vw, 480px)",
                  borderRadius: 40,
                  backgroundColor: C.ph,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  {member.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={member.photo} alt={member.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <AvatarPlaceholder />
                  )}

                  {hasSocials && (
                    <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", gap: 10 }}>
                      {SOCIAL_DEFS.map(({ label, getHref, render }) => {
                        const href = getHref(member);
                        if (!href) return null;
                        return (
                          <a key={label} href={href} aria-label={label}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                              width: 40, height: 40, borderRadius: "50%",
                              backgroundColor: C.yellow, color: C.ink,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background .2s",
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = C.orange)}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = C.yellow)}
                          >
                            {render()}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1rem, 1.8vw, 1.5rem)", color: C.ink, marginTop: 20 }}>
                  {member.name}
                </div>
                <div style={{ fontFamily: MONO, fontSize: "clamp(0.8rem, 1.1vw, 1rem)", color: C.ink, marginTop: 6, opacity: 0.75 }}>
                  {member.role}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </FocusedLayout>
  );
}
