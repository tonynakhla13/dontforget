"use client";

import FocusedLayout, { C, TEKO, MONO } from "./FocusedLayout";

export type FocusedService = {
  title: string;
  body: string;
};

const SERVICES_FALLBACK: FocusedService[] = [
  {
    title: "Brand Systems",
    body: "Names, identities, rules, and visual logic that keep every touchpoint coherent across every surface. We build the complete language of a brand — mark, type, colour, motion — so it holds together at any scale.",
  },
  {
    title: "Digital Products",
    body: "Interfaces and flows built to feel fast, clear, and unmistakably yours — from wireframe to launch. We design and engineer web apps, dashboards, and consumer products that people actually want to use.",
  },
  {
    title: "Immersive Web",
    body: "Three.js, GSAP, and tactile interactions that make the browser feel spatial and alive. We create scroll-driven narratives, particle systems, and 3D environments that turn a website into an experience.",
  },
  {
    title: "Motion Identities",
    body: "Systems that move with intent — from logo behaviour to full campaign launch films. Motion is the final layer of a brand; we make sure it speaks the same language as the visual identity.",
  },
];

const PLANS = [
  {
    name:  "Starter",
    price: "$2,500",
    per:   "per project",
    color: C.orange,
    textColor: C.white,
    items: ["Landing page or brand refresh", "Up to 5 custom sections", "Mobile-responsive design", "Basic SEO setup", "2-week delivery"],
    dotColor: C.white,
    dotText: C.orange,
  },
  {
    name:  "Growth",
    price: "$7,500",
    per:   "per project",
    color: C.green,
    textColor: C.white,
    items: ["Full website (up to 10 pages)", "Brand identity system", "CMS integration", "On-page SEO + analytics", "6-week delivery"],
    dotColor: C.white,
    dotText: C.green,
  },
  {
    name:  "Enterprise",
    price: "Custom",
    per:   "let's talk",
    color: C.yellow,
    textColor: C.ink,
    items: ["Complex web applications", "Multi-phase campaigns", "Ongoing retainer support", "Dedicated project manager", "Priority turnaround"],
    dotColor: C.ink,
    dotText: C.yellow,
  },
];

function ImgPlaceholder() {
  return (
    <svg width="60%" viewBox="0 0 200 120" fill="none">
      <rect width="200" height="120" rx="10" fill={C.cream} />
      <rect x="20" y="30" width="160" height="60" rx="8" stroke={C.green} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="60" r="14" fill={C.green} opacity="0.35" />
      <path d="M90 80 l30-30 20 20" stroke={C.green} strokeWidth="2" />
    </svg>
  );
}

export default function ServicesFocused({ services = SERVICES_FALLBACK }: { services?: FocusedService[] }) {
  return (
    <FocusedLayout title="Our Services" activeNav="services" animationClass="kbm-svc-content">

      {/* ── Service rows ────────────────────────────────────────── */}
      <section className="kbm-svc-content" style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem)",
        display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 2rem)",
      }}>
        {services.map((svc, i) => (
          <div key={i} style={{
            backgroundColor: C.green, borderRadius: 40,
            padding: "clamp(1.5rem, 3vw, 3rem)",
            display: "grid",
            gridTemplateColumns: "clamp(160px, 22vw, 380px) 1fr",
            gap: "clamp(1.5rem, 3vw, 4rem)",
            alignItems: "center",
            transition: "transform .25s ease",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            {/* thumb */}
            <div style={{
              height: "clamp(120px, 16vw, 240px)",
              backgroundColor: C.ph, borderRadius: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ImgPlaceholder />
            </div>

            {/* content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.8rem, 1.5vw, 1.5rem)" }}>
              <h2 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 3rem)", lineHeight: 1, color: C.yellow }}>
                {svc.title}
              </h2>
              <p style={{ fontFamily: MONO, fontSize: "clamp(0.78rem, 1.05vw, 1rem)", lineHeight: 1.6, color: C.cream }}>
                {svc.body}
              </p>
              <a href="/focused/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.8rem, 1vw, 1rem)",
                color: C.white, textDecoration: "none",
              }}>
                Get in Touch{" "}
                <span style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: C.white, color: C.green,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, transition: "transform .2s",
                }}>↗</span>
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3.75rem) clamp(2rem, 4vw, 3rem)",
      }}>
        <h2 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1, color: C.ink }}>
          Pricing
        </h2>
      </div>

      <section style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 8rem)",
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: "clamp(1rem, 2vw, 2rem)",
      }}>
        {PLANS.map((plan, i) => (
          <div key={i} style={{
            backgroundColor: plan.color, borderRadius: 40,
            padding: "clamp(2rem, 3.5vw, 3.5rem)",
            display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 1.5rem)",
          }}>
            <h3 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", lineHeight: 1, color: plan.textColor }}>
              {plan.name}
            </h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, color: plan.textColor }}>
                {plan.price}
              </span>
              <span style={{ fontFamily: MONO, fontSize: "clamp(0.75rem, 1vw, 1rem)", opacity: 0.85, color: plan.textColor }}>
                {plan.per}
              </span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
              {plan.items.map(item => (
                <li key={item} style={{ fontFamily: MONO, fontSize: "clamp(0.78rem, 1vw, 1rem)", lineHeight: 1.5, color: plan.textColor }}>
                  • {item}
                </li>
              ))}
            </ul>
            <a href="/focused/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 12, marginTop: "auto",
              fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.8rem, 1vw, 1rem)",
              color: plan.textColor, textDecoration: "none",
            }}>
              Get Started{" "}
              <span style={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: plan.dotColor, color: plan.dotText,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, transition: "transform .2s",
              }}>↗</span>
            </a>
          </div>
        ))}
      </section>

    </FocusedLayout>
  );
}
