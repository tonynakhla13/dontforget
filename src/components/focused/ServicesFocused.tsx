"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxPageIntro, NoxCTABar, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

/* ── Service data ────────────────────────────────────────────────────── */
const SERVICES = [
  {
    n:        "01",
    title:    "Web Development",
    tag:      "Sites, apps & platforms",
    body:     "We build fast, scalable digital products that perform under pressure and look impossible to ignore. From marketing sites to full-stack web applications — everything is engineered to convert, load in milliseconds, and hold up at scale.",
    delivers: ["Landing pages", "Marketing sites", "Web apps", "Dashboards", "CMS integration", "APIs & backends"],
    tech:     ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Vercel", "Tailwind"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <polyline points="9 9 6 12 9 15"/>
        <polyline points="15 9 18 12 15 15"/>
      </svg>
    ),
  },
  {
    n:        "02",
    title:    "UI / UX Design",
    tag:      "Research, systems & prototypes",
    body:     "We start with behavior before aesthetics. Every interface is grounded in how real users think — not how designers imagine they think. The result is work that feels obvious, reduces friction, and converts better than it looks.",
    delivers: ["UX research", "Wireframes", "Design systems", "Prototypes", "Usability testing", "Handoff specs"],
    tech:     ["Figma", "Framer", "Maze", "Hotjar", "Lottie", "Storybook"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    n:        "03",
    title:    "E-Commerce",
    tag:      "Shopify, WooCommerce & custom",
    body:     "Stores engineered around one goal — selling more. We handle everything from storefront design to checkout flow, payment integration, and post-purchase experience. Every decision is made with conversion rate in mind.",
    delivers: ["Shopify builds", "WooCommerce", "Custom storefronts", "Product pages", "Checkout optimisation", "Subscription setup"],
    tech:     ["Shopify", "WooCommerce", "Salla", "Stripe", "Klaviyo", "Recharge"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    n:        "04",
    title:    "Mobile Apps",
    tag:      "iOS, Android & React Native",
    body:     "Native-feeling apps built for real users. Tight onboarding, frictionless flows, and retention mechanics baked in from day one — not bolted on after launch. We ship on both platforms without doubling the timeline.",
    delivers: ["iOS apps", "Android apps", "React Native", "Onboarding flows", "Push notifications", "App Store submission"],
    tech:     ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "RevenueCat"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5}/>
      </svg>
    ),
  },
  {
    n:        "05",
    title:    "SEO",
    tag:      "Technical, content & AI search",
    body:     "SEO that compounds. We combine technical audits, content architecture, and Core Web Vitals optimisation with AI search visibility strategies — the kind of work that keeps paying back long after the engagement ends.",
    delivers: ["Technical audits", "Content strategy", "Core Web Vitals", "Schema markup", "Link building", "AI search readiness"],
    tech:     ["Ahrefs", "Semrush", "Search Console", "Screaming Frog", "PageSpeed", "Clearscope"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    n:        "06",
    title:    "CRM Platforms",
    tag:      "Bookings, pipelines & automations",
    body:     "Custom operational systems built around how your team actually works. Booking engines, sales pipelines, client dashboards, and internal tools — designed to reduce manual work and give leadership real-time visibility.",
    delivers: ["Booking systems", "Sales pipelines", "Client portals", "Role-based access", "Automations", "Analytics dashboards"],
    tech:     ["HubSpot", "Notion", "Airtable", "Zapier", "Make", "Supabase"],
    icon: (
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
];

/* ── Service card ────────────────────────────────────────────────────── */
function ServiceCard({ s }: { s: typeof SERVICES[0] }) {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  return (
    <div
      className="tk-svc-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:      hov ? "var(--nox-svc-card-hov)" : "var(--nox-svc-card-bg)",
        backgroundImage: `linear-gradient(rgba(70,209,42,${hov ? "0.09" : "0.045"}) 1px, transparent 1px), linear-gradient(90deg, rgba(70,209,42,${hov ? "0.09" : "0.045"}) 1px, transparent 1px)`,
        backgroundSize:  "22px 22px",
        border:          `1px solid ${hov ? "var(--nox-svc-border-hov)" : "var(--nox-svc-border)"}`,
        transition:      "background 320ms ease, border-color 320ms ease, background-image 320ms ease",
        padding:         "clamp(1.8rem, 2.6vw, 2.4rem)",
        display:         "flex",
        flexDirection:   "column",
        gap:             "clamp(1.2rem, 2vw, 1.8rem)",
      }}
    >
      {/* ── Top: icon + number ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <span style={{
          color:      hov ? TK.greenHot : TK.green,
          lineHeight: 0,
          transition: "color 280ms ease",
        }}>{s.icon}</span>
        <span style={{
          fontFamily:    SANS,
          fontSize:      "0.6rem",
          letterSpacing: "0.3em",
          color:         TK.green,
          opacity:       hov ? 0.75 : 0.3,
          transition:    "opacity 280ms ease",
        }}>{s.n}</span>
      </div>

      {/* ── Heading + tag ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <h2 style={{
          fontFamily:    DISPLAY,
          fontStyle:     "italic",
          fontWeight:    700,
          fontSize:      "clamp(1.5rem, 2vw, 2rem)",
          lineHeight:    1.0,
          color:         TK.paper,
          margin:        0,
          letterSpacing: "-0.02em",
        }}>{s.title}</h2>
        <span style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.56rem, 0.68vw, 0.68rem)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         TK.green,
          opacity:       0.5,
        }}>{s.tag}</span>
      </div>

      {/* ── Description ── */}
      <p style={{
        fontFamily: SANS,
        fontSize:   "clamp(0.82rem, 0.96vw, 0.94rem)",
        lineHeight: 1.8,
        color:      hov ? "var(--nox-svc-body-hov)" : "var(--nox-svc-body)",
        margin:     0,
        transition: "color 300ms ease",
      }}>{s.body}</p>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(70,174,34,0.14)", flexShrink: 0 }} />

      {/* ── What we deliver ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p style={{
          fontFamily:    SANS,
          fontSize:      "0.58rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color:         TK.green,
          opacity:       0.38,
          margin:        0,
        }}>What we deliver</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "0.28rem", columnGap: "0.6rem" }}>
          {s.delivers.map((d, j) => (
            <span key={j} style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        6,
              fontFamily: SANS,
              fontSize:   "clamp(0.74rem, 0.86vw, 0.84rem)",
              color:      TK.green,
              lineHeight: 1.5,
            }}>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: TK.green, opacity: 0.5, flexShrink: 0 }} />
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tech & tools ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p style={{
          fontFamily:    SANS,
          fontSize:      "0.58rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color:         TK.green,
          opacity:       0.38,
          margin:        0,
        }}>Tech &amp; tools</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {s.tech.map((t, j) => (
            <span key={j} style={{
              padding:       "0.28rem 0.65rem",
              border:        `1px solid rgba(70,174,34,${hov ? "0.5" : "0.22"})`,
              background:    hov ? "rgba(70,174,34,0.1)" : "rgba(70,174,34,0.04)",
              fontFamily:    SANS,
              fontSize:      "clamp(0.6rem, 0.7vw, 0.7rem)",
              letterSpacing: "0.05em",
              color:         TK.green,
              transition:    "border-color 300ms ease, background 300ms ease",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.1rem", flexWrap: "nowrap", gap: "0.5rem" }}>
        {/* Start a project — compact pill */}
        <a
          href="/en/focused/contact"
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            padding:        "0.38rem 0.85rem",
            background:     btnHov ? TK.greenHot : TK.green,
            color:          "#000",
            fontFamily:     SANS,
            fontWeight:     700,
            fontSize:       "clamp(0.58rem, 0.68vw, 0.68rem)",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            textDecoration: "none",
            transition:     "background 200ms ease",
            cursor:         "pointer",
            whiteSpace:     "nowrap",
            flexShrink:     0,
          }}
        >
          Start a project
          <svg width={9} height={9} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8L8 2M8 2H4M8 2v4"/>
          </svg>
        </a>

        {/* Learn more — text link */}
        <a
          href="/en/focused/services"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            5,
            fontFamily:     SANS,
            fontSize:       "clamp(0.58rem, 0.68vw, 0.68rem)",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            color:          TK.green,
            opacity:        0.55,
            textDecoration: "none",
            transition:     "opacity 200ms ease",
            cursor:         "pointer",
            whiteSpace:     "nowrap",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
        >
          Learn more
          <svg width={8} height={8} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5h6M5 2l3 3-3 3"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function ServicesFocused() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tk-svc-card").forEach((card) => {
        gsap.from(card, {
          y: 40, opacity: 0,
          duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%", once: true },
        });
      });

      gsap.from(".tk-hw-item", {
        x: -24, opacity: 0, stagger: 0.09, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: ".tk-how-work", start: "top 80%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="services" />

      <NoxPageIntro
        eyebrow="/ our services"
        title="six disciplines,"
        italic="one studio."
        lede="From naming the thing to launching it — we cover the full spectrum of what makes a brand impossible to forget."
      />

      {/* ── 2-column, 3-row card grid ── */}
      <section style={{
        borderTop:           `1px solid ${TK.line}`,
        padding:             "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem)",
        display:             "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap:                 "clamp(1rem, 1.8vw, 1.8rem)",
        alignItems:          "start",
      }}>
        {SERVICES.map((s) => (
          <ServiceCard key={s.n} s={s} />
        ))}
      </section>

      {/* ── How we work ── */}
      <section className="tk-how-work" style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop:           `1px solid ${TK.line}`,
        borderBottom:        `1px solid ${TK.line}`,
      }}>
        <div style={{ padding: "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)", borderRight: `1px solid ${TK.line}` }}>
          <p style={{ fontFamily: SANS, fontSize: "clamp(0.62rem, 0.8vw, 0.8rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: TK.green, opacity: 0.5, margin: "0 0 clamp(1.5rem, 2.5vw, 2rem)" }}>/ how we work</p>
          <h3 style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem, 4.5vw, 5rem)", lineHeight: 1.0, color: TK.paper, letterSpacing: "-0.02em", margin: 0 }}>Every project starts with the right question.</h3>
        </div>

        <div style={{ padding: "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(1.2rem, 2.5vw, 2.5rem)" }}>
          {[
            { label: "No retainers, no billable hours",  detail: "You pay for outcomes, not time." },
            { label: "Direct access to the makers",       detail: "You talk to the people doing the work." },
            { label: "Ship in 4–8 weeks",                 detail: "Most projects don't need to take longer." },
            { label: "Radical honesty always",            detail: "If something won't work, we say so first." },
          ].map((item, i) => (
            <div key={i} className="tk-hw-item" style={{ display: "grid", gridTemplateColumns: "8px 1fr", gap: "clamp(0.75rem, 1.5vw, 1.5rem)", alignItems: "start" }}>
              <span style={{ width: 8, height: 8, background: TK.green, marginTop: 6, flexShrink: 0, display: "block" }} />
              <div>
                <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)", color: TK.paper, margin: "0 0 0.25rem" }}>{item.label}</p>
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)", color: TK.green, opacity: 0.7, margin: 0, lineHeight: 1.5 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NoxCTABar label="Start a project →" />
      <NoxFooter />
    </div>
  );
}
