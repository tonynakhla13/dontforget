"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxCTABar, NoxPageIntro, SANS, TK } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

const G  = TK.green;
const W  = TK.paper;
const LN = "rgba(70,174,34,0.22)";

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
    slug:     "ecommerce",
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
    slug:     "seo-site-health",
    n:        "05",
    title:    "SEO & Site Health",
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
    slug:     "crm-systems",
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
export default function ServiceDetailFocused({ service, locale }: { service: { id: string; title: string; description: string | null; icon?: string | null; tagline?: string | null }; locale?: string }) {
  const slug   = service.id;
  const svc    = SERVICES_DATA.find((s) => s.slug === slug);
  const root   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !svc) return;
    const ctx = gsap.context(() => {
      gsap.from([".sdf-num", ".sdf-title", ".sdf-tag"], { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out" });
      gsap.from(".sdf-in", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".sdf-body", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, [svc]);

  if (!svc) return (
    <div style={{ minHeight: "100vh", fontFamily: SANS, color: W, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
      <NoxNavbar active="services" />
      <span style={{ fontSize: "5rem", color: G, opacity: 0.2 }}>404</span>
      <h1 style={{ fontSize: "2rem", textTransform: "uppercase", margin: 0, color: W }}>Service not found</h1>
      <Link href="/en/focused/services" style={{ color: G, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>← All services</Link>
      <NoxFooter />
    </div>
  );

  const others = SERVICES_DATA.filter((s) => s.slug !== slug);
  const title  = svc?.title ?? service.title;

  return (
    <div ref={root} style={{ fontFamily: SANS, color: W, minHeight: "100vh" }}>
      <NoxNavbar active="services" />

      {/* ── HERO — exact same as services listing page ─────── */}
      <NoxPageIntro
        eyebrow={`/ ${svc.n} — our services`}
        title={`${svc.title},`}
        italic={svc.tag}

      />

      {/* ── BODY ───────────────────────────────────────────── */}
      <section className="sdf-body" style={{ padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem) clamp(5rem,10vw,8rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)", alignItems: "start" }}>

        {/* LEFT */}
        <div>
          <p className="sdf-in" style={{ fontSize: "clamp(1rem,1.4vw,1.2rem)", lineHeight: 1.75, color: W, opacity: 0.72, margin: "0 0 clamp(2.5rem,5vw,4rem)" }}>
            {svc.body}
          </p>

          {/* section label — green */}
          <p className="sdf-in" style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: G, opacity: 0.8, marginBottom: "0.75rem" }}>How it works</p>

          {svc.process.map((p, i) => (
            <div key={p.step} className="sdf-in" style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "0.75rem", padding: "1.1rem 0", borderTop: `1px solid ${LN}` }}>
              {/* step number — green */}
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: G, opacity: 0.5, paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em", textTransform: "uppercase", color: W, margin: "0 0 0.3rem" }}>{p.step}</p>
                <p style={{ fontSize: "0.86rem", color: W, opacity: 0.55, margin: 0, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem,3vw,2rem)" }}>

          {/* delivers */}
          <div className="sdf-in" style={{ border: `1px solid ${LN}`, borderRadius: 14, padding: "clamp(1.2rem,2.5vw,2rem)" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: G, opacity: 0.7, marginBottom: "1.1rem" }}>What we deliver</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {svc.delivers.map((d) => (
                <span key={d} style={{ fontSize: "0.78rem", padding: "0.28rem 0.72rem", border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 99, color: W, opacity: 0.8 }}>{d}</span>
              ))}
            </div>
          </div>

          {/* tech */}
          <div className="sdf-in" style={{ border: `1px solid ${LN}`, borderRadius: 14, padding: "clamp(1.2rem,2.5vw,2rem)" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: G, opacity: 0.7, marginBottom: "1.1rem" }}>Tech &amp; tools</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {svc.tech.map((t) => (
                <span key={t} style={{ fontSize: "0.78rem", padding: "0.28rem 0.72rem", background: "rgba(255,255,255,0.07)", borderRadius: 99, color: W, opacity: 0.75 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* other services */}
          <div className="sdf-in">
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: G, opacity: 0.7, marginBottom: "0.75rem" }}>Other services</p>
            {others.map((s) => (
              <Link key={s.slug} href={`/en/focused/services/${s.slug}`} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 0", borderBottom: `1px solid ${LN}`,
                color: W, textDecoration: "none", opacity: 0.45,
                fontSize: "0.84rem", letterSpacing: "0.04em", transition: "opacity .2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.45")}
              >
                <span>{s.n} — {s.title}</span>
                <span style={{ color: G }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NoxCTABar label={`Start a ${svc.title} project`} />
      <NoxFooter />
    </div>
  );
}
