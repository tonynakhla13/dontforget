"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxCTABar, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

/* ── tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg:        TK.ink,
  panel:     TK.panel,
  card:      TK.card,
  border:    TK.border,
  text:      TK.paper,
  muted:     TK.textMuted,
  faint:     TK.textFaint,
  accent:    TK.green,
  accentRgb: "70,174,34",
  accentHot: TK.greenHot,
} as const;

const WRAP = "clamp(1.5rem,5vw,4rem)";

/* ── service data ────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    n: "01", slug: "web-development", title: "Web Development", tag: "Sites, apps & platforms",
    body: "We build fast, scalable digital products that perform under pressure and look impossible to ignore. From marketing sites to full-stack web applications — everything is engineered to convert, load in milliseconds, and hold up at scale.",
    delivers: ["Landing pages", "Marketing sites", "Web apps", "Dashboards", "CMS integration", "APIs & backends"],
    tech: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Vercel"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="9 9 6 12 9 15"/><polyline points="15 9 18 12 15 15"/></svg>,
  },
  {
    n: "02", slug: "ui-ux-design", title: "UI / UX Design", tag: "Research, systems & prototypes",
    body: "We start with behavior before aesthetics. Every interface is grounded in how real users think — not how designers imagine they think. The result is work that feels obvious, reduces friction, and converts better than it looks.",
    delivers: ["UX research", "Wireframes", "Design systems", "Prototypes", "Usability testing", "Handoff specs"],
    tech: ["Figma", "Framer", "Maze", "Hotjar", "Lottie", "Storybook"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  },
  {
    n: "03", slug: "ecommerce", title: "E-Commerce", tag: "Shopify, WooCommerce & custom",
    body: "Stores engineered around one goal — selling more. We handle everything from storefront design to checkout flow, payment integration, and post-purchase experience. Every decision is made with conversion rate in mind.",
    delivers: ["Shopify builds", "WooCommerce", "Custom storefronts", "Product pages", "Checkout optimisation", "Subscription setup"],
    tech: ["Shopify", "WooCommerce", "Salla", "Stripe", "Klaviyo", "Recharge"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  },
  {
    n: "04", slug: "mobile-apps", title: "Mobile Apps", tag: "iOS, Android & React Native",
    body: "Native-feeling apps built for real users. Tight onboarding, frictionless flows, and retention mechanics baked in from day one — not bolted on after launch. We ship on both platforms without doubling the timeline.",
    delivers: ["iOS apps", "Android apps", "React Native", "Onboarding flows", "Push notifications", "App Store submission"],
    tech: ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "RevenueCat"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5}/></svg>,
  },
  {
    n: "05", slug: "seo-site-health", title: "SEO & Site Health", tag: "Technical, content & AI search",
    body: "SEO that compounds. We combine technical audits, content architecture, and Core Web Vitals optimisation with AI search visibility strategies — the kind of work that keeps paying back long after the engagement ends.",
    delivers: ["Technical audits", "Content strategy", "Core Web Vitals", "Schema markup", "Link building", "AI search readiness"],
    tech: ["Ahrefs", "Semrush", "Search Console", "Screaming Frog", "PageSpeed", "Clearscope"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    n: "06", slug: "crm-systems", title: "CRM Platforms", tag: "Bookings, pipelines & automations",
    body: "Custom operational systems built around how your team actually works. Booking engines, sales pipelines, client dashboards, and internal tools — designed to reduce manual work and give leadership real-time visibility.",
    delivers: ["Booking systems", "Sales pipelines", "Client portals", "Role-based access", "Automations", "Analytics dashboards"],
    tech: ["HubSpot", "Notion", "Airtable", "Zapier", "Make", "Supabase"],
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  },
];

/* ── service card ────────────────────────────────────────────────────────── */
function ServiceCard({ s, index }: { s: (typeof SERVICES)[0]; index: number }) {
  const [hov, setHov] = useState(false);

  return (
    <>
      <style>{`
        .sf-card-${index} {
          transition: box-shadow 300ms ease, background 300ms ease;
          box-shadow: inset 0 0 0 1px var(--nox-border, rgba(255,255,255,0.09));
        }
        .sf-card-${index}:hover {
          box-shadow: inset 0 0 0 2px ${C.accent}, 0 12px 48px rgba(${C.accentRgb},0.1);
        }
        .sf-pill-${index} { display:inline-flex; align-items:center; padding:0.4rem 0.9rem; border:1px solid var(--nox-border, rgba(255,255,255,0.12)); background:rgba(${C.accentRgb},0.06); font-family:${SANS}; font-size:0.75rem; letter-spacing:0.05em; color:${C.accent}; }
        .sf-card-${index}:hover .sf-pill-${index} { border-color:rgba(${C.accentRgb},0.4); background:rgba(${C.accentRgb},0.13); }
        .sf-del-${index} { display:flex; align-items:flex-start; gap:0.5rem; }
      `}</style>

      <div
        className={`sf-service-card sf-card-${index}`}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ position: "relative", background: C.card, overflow: "hidden" }}
      >
        {/* ── title + icon row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr clamp(100px,12vw,160px)", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ padding: `clamp(1.8rem,2.8vw,3rem) clamp(1.8rem,3.5vw,3rem)`, borderRight: `1px solid ${C.border}` }}>
            <h2 style={{
              fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2rem,4vw,5rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: "transparent",
              WebkitTextStroke: hov ? `1.5px ${C.accent}` : `1.5px ${C.text}`,
              margin: 0, transition: "-webkit-text-stroke-color 280ms ease",
            }}>{s.title}</h2>
          </div>
          <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{
              color: hov ? C.accent : TK.iconFaint,
              lineHeight: 0, display: "block",
              transform: hov ? "scale(1.1)" : "scale(1)",
              transition: "color 350ms, transform 350ms cubic-bezier(0.22,1,0.36,1)",
            }}>
              <span style={{ display: "block", transform: "scale(4.5)", transformOrigin: "center" }}>{s.icon}</span>
            </span>
          </div>
        </div>

        {/* ── body: description → deliverables → tech ── */}
        <div style={{ padding: `clamp(1.8rem,2.8vw,3rem) clamp(1.8rem,3.5vw,3rem)`, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "clamp(1.5rem,2.2vw,2.2rem)" }}>
          <p style={{
            fontFamily: SANS, fontSize: "clamp(0.92rem,1.05vw,1.05rem)",
            lineHeight: 1.75, color: hov ? C.muted : TK.textMuted,
            margin: 0, transition: "color 260ms",
          }}>{s.body}</p>

          <div>
            <p style={{ fontFamily: SANS, fontSize: "0.48rem", letterSpacing: "0.26em", textTransform: "uppercase", color: hov ? C.accent : C.faint, margin: "0 0 0.75rem", transition: "color 260ms" }}>Deliverables</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 2rem" }}>
              {s.delivers.map((d, i) => (
                <div key={i} className={`sf-del-${index}`}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", flexShrink: 0, marginTop: "0.42em", background: hov ? C.accent : C.faint, transition: "background 260ms" }} />
                  <span style={{ fontFamily: SANS, fontSize: "clamp(0.82rem,0.95vw,0.95rem)", lineHeight: 1.5, color: hov ? C.text : C.muted, transition: "color 260ms" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: SANS, fontSize: "0.48rem", letterSpacing: "0.26em", textTransform: "uppercase", color: hov ? C.accent : C.faint, margin: "0 0 0.75rem", transition: "color 260ms" }}>Tech &amp; tools</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {s.tech.map((t, i) => (
                <span key={i} className={`sf-pill-${index}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── footer ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: `clamp(1.1rem,1.8vw,1.8rem) clamp(1.8rem,3.5vw,3rem)` }}>
          <Link href="/en/focused/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "0.6rem 1.4rem",
            background: hov ? C.accent : `rgba(${C.accentRgb},0.08)`,
            border: `1px solid ${hov ? C.accent : `rgba(${C.accentRgb},0.25)`}`,
            color: hov ? "#000" : C.accent,
            fontFamily: SANS, fontWeight: 700, fontSize: "0.62rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            textDecoration: "none", transition: "background 260ms, border-color 260ms, color 260ms",
          }}>
            Start a project
            <svg width={9} height={9} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg>
          </Link>
          <Link href={`/en/focused/services/${s.slug}`} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "0.6rem 1.4rem",
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: hov ? C.text : C.muted,
            fontFamily: SANS, fontWeight: 600, fontSize: "0.62rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            textDecoration: "none", transition: "border-color 260ms, color 260ms",
          }}>
            Full service
            <svg width={9} height={9} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 5h6M5 2l3 3-3 3"/></svg>
          </Link>
        </div>
      </div>
    </>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function ServicesFocused() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sf-eyebrow", { x: -16, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.08 });
      gsap.from(".sf-title",   { y: 55,  opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.18 });
      gsap.from(".sf-lede",    { y: 22,  opacity: 0, duration: 0.75, ease: "power2.out", delay: 0.48 });

      gsap.utils.toArray<HTMLElement>(".sf-service-card").forEach((card, i) => {
        gsap.from(card, {
          y: 40, opacity: 0,
          duration: 0.75, ease: "power3.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      gsap.from(".sf-hw-head", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".sf-hw-head", start: "top 85%", once: true } });
      gsap.utils.toArray<HTMLElement>(".tk-hw-item").forEach((el, i) => {
        gsap.from(el, { x: -24, opacity: 0, duration: 0.62, ease: "power2.out", delay: i * 0.09, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: C.bg, color: C.text, fontFamily: SANS }}>

      {/* sticky navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.border}`, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <NoxNavbar active="services" />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(var(--nox-border-faint, rgba(255,255,255,0.03)) 1px,transparent 1px),linear-gradient(90deg,var(--nox-border-faint, rgba(255,255,255,0.03)) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div aria-hidden style={{
          position: "absolute", top: "-6rem", left: "-4rem",
          width: "clamp(300px,45vw,600px)", height: "clamp(300px,45vw,600px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${C.accentRgb},0.11) 0%, transparent 65%)`,
          filter: "blur(90px)", pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
          background: `linear-gradient(to bottom, transparent, ${C.bg})`, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, padding: `clamp(5.5rem,10vw,11rem) ${WRAP} clamp(5rem,9vw,10rem)` }}>
          <div className="sf-eyebrow" style={{ marginBottom: "clamp(2rem,3.5vw,3.5rem)" }}>
            <span style={{ fontFamily: SANS, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>
              / our services
            </span>
          </div>
          <h1 className="sf-title" style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(3.5rem,9vw,11rem)", lineHeight: 0.88, letterSpacing: "-0.03em",
            color: C.text, margin: "0 0 clamp(1.8rem,3vw,3rem)", maxWidth: "16ch",
          }}>
            six disciplines,{" "}
            <span style={{ color: TK.textFaint }}>one studio.</span>
          </h1>
          <p className="sf-lede" style={{
            fontFamily: SANS, fontSize: "clamp(1rem,1.35vw,1.35rem)",
            lineHeight: 1.65, color: C.muted, margin: 0, maxWidth: "52ch",
          }}>
            From naming the thing to launching it — we cover the full spectrum of what makes a brand impossible to forget.
          </p>
        </div>
      </section>

      {/* ══ SERVICE CARDS ═════════════════════════════════════════════════ */}
      <section style={{ padding: `clamp(3rem,6vw,6rem) ${WRAP}`, display: "flex", flexDirection: "column", gap: "clamp(0.75rem,1.2vw,1.2rem)" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "clamp(0.5rem,1vw,1rem)",
        }}>
          <span style={{ fontFamily: SANS, fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, opacity: 0.6 }}>
            / what we do
          </span>
          <span style={{ fontFamily: SANS, fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.faint }}>
            {SERVICES.length} services
          </span>
        </div>

        {SERVICES.map((s, i) => (
          <ServiceCard key={s.n} s={s} index={i} />
        ))}
      </section>

      {/* ══ HOW WE WORK ═══════════════════════════════════════════════════ */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.panel,
        margin: `0 ${WRAP}`,
        marginBottom: "clamp(3rem,6vw,6rem)",
      }}>
        <div style={{ padding: `clamp(4rem,8vw,9rem) clamp(2rem,4vw,4rem)`, borderRight: `1px solid ${C.border}` }}>
          <span style={{ display: "block", fontFamily: SANS, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, fontWeight: 600, opacity: 0.6, marginBottom: "clamp(1.5rem,2.5vw,2.5rem)" }}>
            / how we work
          </span>
          <h2 className="sf-hw-head" style={{
            fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(2.2rem,4.5vw,5.5rem)", lineHeight: 0.92, letterSpacing: "-0.02em",
            color: C.text, margin: 0,
          }}>Every project starts with the right question.</h2>
        </div>

        <div style={{ padding: `clamp(4rem,8vw,9rem) clamp(2rem,4vw,4rem)`, display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(1.4rem,2.5vw,2.5rem)" }}>
          {[
            { label: "No retainers, no billable hours",  detail: "You pay for outcomes, not time." },
            { label: "Direct access to the makers",       detail: "You talk to the people doing the work." },
            { label: "Ship in 4–8 weeks",                 detail: "Most projects don't need to take longer." },
            { label: "Radical honesty always",            detail: "If something won't work, we say so first." },
          ].map((item, i) => (
            <div key={i} className="tk-hw-item" style={{ display: "grid", gridTemplateColumns: "clamp(28px,3vw,36px) 1fr", gap: "clamp(0.75rem,1.5vw,1.5rem)", alignItems: "start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: "0.45em", display: "block" }} />
              <div>
                <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(0.9rem,1.15vw,1.15rem)", color: C.text, margin: "0 0 0.3rem", letterSpacing: "-0.01em" }}>{item.label}</p>
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.78rem,0.92vw,0.92rem)", color: C.muted, margin: 0, lineHeight: 1.6 }}>{item.detail}</p>
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
