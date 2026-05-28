"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NoxNavbar,
  NoxFooter,
  NoxCTABar,
  TK,
  SANS,
} from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

/* ── colour tokens ─────────────────────────────────────────────── */
const C = {
  ink:    "var(--nox-ink)",
  paper:  "var(--nox-paper)",
  green:  "var(--nox-green)",
  border: "var(--nox-svc-border)",
  body:   "var(--nox-svc-body)",
};

/* ── service data (mirrors ServicesFocused) ────────────────────── */
export const SERVICES_DATA = [
  {
    slug:     "web-development",
    n:        "01",
    title:    "Web Development",
    tag:      "Sites, apps & platforms",
    body:     "We build fast, scalable digital products that perform under pressure and look impossible to ignore. From marketing sites to full-stack web applications — everything is engineered to convert, load in milliseconds, and hold up at scale.",
    delivers: ["Landing pages", "Marketing sites", "Web apps", "Dashboards", "CMS integration", "APIs & backends"],
    tech:     ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Vercel", "Tailwind"],
    process: [
      { step: "Discovery", desc: "We map your goals, audience, and constraints before writing a single line." },
      { step: "Architecture", desc: "Schema, routing, and data flow designed for scale from day one." },
      { step: "Build", desc: "Iterative sprints with shared staging so you see progress weekly." },
      { step: "Launch", desc: "Deployment, monitoring, and a 30-day post-launch window included." },
    ],
  },
  {
    slug:     "ui-ux-design",
    n:        "02",
    title:    "UI / UX Design",
    tag:      "Research, systems & prototypes",
    body:     "We start with behavior before aesthetics. Every interface is grounded in how real users think — not how designers imagine they think. The result is work that feels obvious, reduces friction, and converts better than it looks.",
    delivers: ["UX research", "Wireframes", "Design systems", "Prototypes", "Usability testing", "Handoff specs"],
    tech:     ["Figma", "Framer", "Maze", "Hotjar", "Lottie", "Storybook"],
    process: [
      { step: "Research", desc: "User interviews, competitive analysis, and heuristic audits." },
      { step: "Information architecture", desc: "Flows, sitemaps, and content hierarchy before any pixels." },
      { step: "Design", desc: "High-fidelity screens with interactive prototypes for real feedback." },
      { step: "Handoff", desc: "Annotated specs, design tokens, and component docs ready for dev." },
    ],
  },
  {
    slug:     "e-commerce",
    n:        "03",
    title:    "E-Commerce",
    tag:      "Shopify, WooCommerce & custom",
    body:     "Stores engineered around one goal — selling more. We handle everything from storefront design to checkout flow, payment integration, and post-purchase experience. Every decision is made with conversion rate in mind.",
    delivers: ["Shopify builds", "WooCommerce", "Custom storefronts", "Product pages", "Checkout optimisation", "Subscription setup"],
    tech:     ["Shopify", "WooCommerce", "Salla", "Stripe", "Klaviyo", "Recharge"],
    process: [
      { step: "Audit", desc: "We review your current funnel and identify where revenue is lost." },
      { step: "Store build", desc: "Theme, product pages, and checkout flow rebuilt for conversion." },
      { step: "Integrations", desc: "Payments, email, analytics, and loyalty programs wired up." },
      { step: "CRO", desc: "Post-launch A/B testing and ongoing optimisation until numbers move." },
    ],
  },
  {
    slug:     "mobile-apps",
    n:        "04",
    title:    "Mobile Apps",
    tag:      "iOS, Android & React Native",
    body:     "Native-feeling apps built for real users. Tight onboarding, frictionless flows, and retention mechanics baked in from day one — not bolted on after launch. We ship on both platforms without doubling the timeline.",
    delivers: ["iOS apps", "Android apps", "React Native", "Onboarding flows", "Push notifications", "App Store submission"],
    tech:     ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "RevenueCat"],
    process: [
      { step: "Product scoping", desc: "Core user journeys mapped and prioritised before any design." },
      { step: "Prototype", desc: "Clickable prototype tested with real users before development starts." },
      { step: "Development", desc: "Sprint-based build with TestFlight / Play Store betas throughout." },
      { step: "Submission", desc: "App Store and Google Play submission, review handling included." },
    ],
  },
  {
    slug:     "seo",
    n:        "05",
    title:    "SEO",
    tag:      "Technical, content & AI search",
    body:     "SEO that compounds. We combine technical audits, content architecture, and Core Web Vitals optimisation with AI search visibility strategies — the kind of work that keeps paying back long after the engagement ends.",
    delivers: ["Technical audits", "Content strategy", "Core Web Vitals", "Schema markup", "Link building", "AI search readiness"],
    tech:     ["Ahrefs", "Semrush", "Search Console", "Screaming Frog", "PageSpeed", "Clearscope"],
    process: [
      { step: "Audit", desc: "Full technical crawl, Core Web Vitals, and keyword gap analysis." },
      { step: "Strategy", desc: "Content clusters, internal linking plan, and quick-win fixes." },
      { step: "Execution", desc: "On-page optimisation, schema, and link building in parallel." },
      { step: "Reporting", desc: "Monthly dashboards with ranking movement and traffic attribution." },
    ],
  },
  {
    slug:     "crm-platforms",
    n:        "06",
    title:    "CRM Platforms",
    tag:      "Bookings, pipelines & automations",
    body:     "Custom operational systems built around how your team actually works. Booking engines, sales pipelines, client dashboards, and internal tools — designed to reduce manual work and give leadership real-time visibility.",
    delivers: ["Booking systems", "Sales pipelines", "Client portals", "Role-based access", "Automations", "Analytics dashboards"],
    tech:     ["HubSpot", "Notion", "Airtable", "Zapier", "Make", "Supabase"],
    process: [
      { step: "Process mapping", desc: "We shadow your team to understand exactly how work moves." },
      { step: "System design", desc: "Data model, roles, and automation logic designed before build." },
      { step: "Build & integrate", desc: "Custom dashboards, automations, and third-party connections." },
      { step: "Training", desc: "Onboarding sessions and documentation so the team actually uses it." },
    ],
  },
];

/* ── main component ────────────────────────────────────────────── */
export default function ServiceDetailFocused({ slug }: { slug: string }) {
  const svc = SERVICES_DATA.find((s) => s.slug === slug);
  const heroRef  = useRef<HTMLDivElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !bodyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".sdf-hero-num",   { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" });
      gsap.from(".sdf-hero-title", { y: 40, opacity: 0, duration: 0.9, delay: 0.1, ease: "power3.out" });
      gsap.from(".sdf-hero-tag",   { y: 20, opacity: 0, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".sdf-body-block", {
        y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: bodyRef.current!, start: "top 82%" },
      });
    });
    return () => ctx.revert();
  }, [slug]);

  if (!svc) return <ServiceNotFound />;

  return (
    <div style={{ background: C.paper, minHeight: "100vh", color: C.ink }}>
      <NoxNavbar active="services" />

      {/* ── HERO ──────────────────────────────────────────── */}
      <div ref={heroRef} style={{ padding: "clamp(7rem,14vw,11rem) clamp(1.5rem,7vw,6rem) clamp(3rem,6vw,5rem)" }}>
        {/* back link */}
        <Link
          href="/en/focused/services"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: SANS, fontSize: "0.8rem", letterSpacing: "0.12em",
            textTransform: "uppercase", color: C.green, opacity: 0.8,
            textDecoration: "none", marginBottom: "clamp(2rem,4vw,3.5rem)",
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          All services
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 60%" }}>
            <p className="sdf-hero-num" style={{ fontFamily: TK.bold, fontSize: "clamp(1rem,1.8vw,1.4rem)", color: C.green, letterSpacing: "0.08em", margin: "0 0 0.5rem" }}>
              {svc.n}
            </p>
            <h1
              className="sdf-hero-title"
              style={{ fontFamily: TK.bold, fontSize: "clamp(3.5rem,10vw,9rem)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", margin: "0 0 1.5rem", color: C.ink }}
            >
              {svc.title}
            </h1>
            <p className="sdf-hero-tag" style={{ fontFamily: SANS, fontSize: "clamp(0.85rem,1.2vw,1rem)", color: C.green, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.75 }}>
              {svc.tag}
            </p>
          </div>

          {/* large number watermark */}
          <p aria-hidden style={{
            fontFamily: TK.bold, fontSize: "clamp(6rem,18vw,18rem)", lineHeight: 1,
            color: "transparent", WebkitTextStroke: `2px ${C.green}`, opacity: 0.08,
            userSelect: "none", flexShrink: 0,
          }}>
            {svc.n}
          </p>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: C.green, opacity: 0.18, margin: "clamp(2rem,4vw,3rem) 0 0" }} />
      </div>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ padding: "0 clamp(1.5rem,7vw,6rem) clamp(5rem,10vw,8rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem,6vw,5rem)", alignItems: "start" }}>

        {/* left: description */}
        <div>
          <p className="sdf-body-block" style={{ fontFamily: SANS, fontSize: "clamp(1rem,1.5vw,1.25rem)", lineHeight: 1.7, color: C.ink, opacity: 0.75, margin: 0 }}>
            {svc.body}
          </p>

          {/* process */}
          <div className="sdf-body-block" style={{ marginTop: "clamp(2.5rem,5vw,4rem)" }}>
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.green, marginBottom: "1.5rem", opacity: 0.7 }}>
              How it works
            </p>
            {svc.process.map((p, i) => (
              <div key={p.step} style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "1rem", marginBottom: "1.25rem", alignItems: "start" }}>
                <span style={{ fontFamily: TK.bold, fontSize: "0.85rem", color: C.green, paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p style={{ fontFamily: TK.bold, fontSize: "1rem", textTransform: "uppercase", color: C.ink, margin: "0 0 0.2rem", letterSpacing: "0.04em" }}>{p.step}</p>
                  <p style={{ fontFamily: SANS, fontSize: "0.9rem", color: C.ink, opacity: 0.6, margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: delivers + tech */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3rem)" }}>

          {/* what we deliver */}
          <div className="sdf-body-block" style={{ border: `1px solid ${C.green}`, borderRadius: 16, padding: "clamp(1.5rem,3vw,2.5rem)" }}>
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.green, marginBottom: "1.25rem", opacity: 0.7 }}>
              What we deliver
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {svc.delivers.map((d) => (
                <span key={d} style={{
                  fontFamily: SANS, fontSize: "0.82rem", padding: "0.35rem 0.85rem",
                  border: `1px solid ${C.green}`, borderRadius: 99, color: C.green,
                  opacity: 0.85, letterSpacing: "0.02em",
                }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* tech stack */}
          <div className="sdf-body-block" style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: "clamp(1.5rem,3vw,2.5rem)" }}>
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.green, marginBottom: "1.25rem", opacity: 0.7 }}>
              Tech &amp; tools
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {svc.tech.map((t) => (
                <span key={t} style={{
                  fontFamily: SANS, fontSize: "0.82rem", padding: "0.35rem 0.85rem",
                  background: "rgba(70,174,34,0.08)", borderRadius: 99, color: C.ink, opacity: 0.7,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* nav to other services */}
          <div className="sdf-body-block">
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.green, marginBottom: "1rem", opacity: 0.7 }}>
              Other services
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {SERVICES_DATA.filter((s) => s.slug !== slug).map((s) => (
                <Link key={s.slug} href={`/en/focused/services/${s.slug}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.65rem 0", borderBottom: `1px solid ${C.border}`,
                  textDecoration: "none", color: C.ink, opacity: 0.55,
                  fontFamily: SANS, fontSize: "0.88rem",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
                >
                  <span>{s.n} — {s.title}</span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NoxCTABar label={`Start a ${svc.title} project`} />
      <NoxFooter />
    </div>
  );
}

function ServiceNotFound() {
  return (
    <div style={{ background: "var(--nox-paper)", minHeight: "100vh", color: "var(--nox-ink)" }}>
      <NoxNavbar active="services" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: "1.5rem", textAlign: "center", padding: "2rem" }}>
        <p style={{ fontFamily: TK.bold, fontSize: "6rem", color: "var(--nox-green)", opacity: 0.2, margin: 0 }}>404</p>
        <h1 style={{ fontFamily: TK.bold, fontSize: "clamp(2rem,6vw,4rem)", textTransform: "uppercase", margin: 0 }}>Service not found</h1>
        <Link href="/en/focused/services" style={{ fontFamily: SANS, color: "var(--nox-green)", textDecoration: "none", borderBottom: "1px solid", paddingBottom: 2 }}>
          View all services →
        </Link>
      </div>
      <NoxFooter />
    </div>
  );
}
