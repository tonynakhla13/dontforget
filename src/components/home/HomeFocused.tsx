"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import { NoxNavbar, NoxFooter, NoxClients, NoxMusts, NoxLogo, TK, SANS, DISPLAY } from "@/components/focused/NoxShared";
import NoxContactHome from "@/components/focused/NoxContactHome";

/* ── data ─────────────────────────────────────────────────────────── */
// lp = left%, tp = top% — positions across the full section width
const TAGS = [
  { text: "craft",     cls: "wg", lp:  22, tp:  4, rot: -4, desc: "Every pixel is intentional. We obsess over details until the output is undeniable." },
  { text: "bold",      cls: "wg", lp:  66, tp:  7, rot:  4, desc: "We don't design to blend in. We design to stop people mid-scroll." },
  { text: "instinct",  cls: "gw", lp:   2, tp: 20, rot: -3, desc: "Years of creative reps build gut-level judgment — we know what works before testing it." },
  { text: "precision", cls: "gw", lp:  44, tp: 22, rot:  2, desc: "No guesswork. Every decision is deliberate, measured, and earned." },
  { text: "edge",      cls: "wg", lp:  79, tp: 18, rot: -2, desc: "We stay ahead of the curve — tools, trends, and techniques others haven't touched yet." },
  { text: "raw",       cls: "gw", lp:  11, tp: 40, rot: -5, desc: "Authentic, unfiltered creative energy. No templates. No recycled ideas." },
  { text: "culture",   cls: "gw", lp:  61, tp: 43, rot: -7, desc: "Deep understanding of the audience before a single line gets written or drawn." },
  { text: "clarity",   cls: "wg", lp:   5, tp: 56, rot: -6, desc: "Complex problems distilled into clear, elegant solutions that make sense immediately." },
  { text: "sharp",     cls: "wg", lp:  37, tp: 60, rot:  6, desc: "Quick thinking, faster delivery. No months-long timelines for work that should ship now." },
  { text: "velocity",  cls: "gw", lp:  72, tp: 55, rot:  3, desc: "From brief to live in weeks, not quarters. Speed without cutting corners." },
  { text: "grit",      cls: "gw", lp:  18, tp: 72, rot: -3, desc: "We see things through. Revisions, pivots, pressure — we stay in it until it's right." },
  { text: "form",      cls: "wg", lp:  52, tp: 74, rot:  2, desc: "Function drives form. The best design is the one that works." },
];

const PROJECTS = [
  {
    slug:        "elia-clinic",
    name:        "Elia Clinic",
    category:    "Healthcare",
    description: "Brand identity and patient digital experience built from scratch. 5 weeks from kickoff to launch with zero revision rounds.",
    did:         ["Brand Identity", "UI/UX Design", "Web Development", "Patient Portal", "CMS Integration"],
    tech:        ["Next.js", "Figma", "Framer Motion", "Supabase", "Tailwind CSS"],
    gif:         "/creative/elia-clinic-scroll.mp4",
    visual:      "/creative/353706ca-1752-4775-8f6d-18ffc60338d9.jpeg",
    align:       "left" as const,
  },
  {
    slug:        "montgab",
    name:        "Montgab",
    category:    "E-Commerce",
    description: "Full Shopify redesign and UX overhaul. Streamlined checkout flow cut cart abandonment by 40% in the first month.",
    did:         ["UX Audit", "Shopify Theme", "Checkout Redesign", "Analytics Setup", "Speed Optimization"],
    tech:        ["Shopify", "Liquid", "React", "Custom Checkout", "Analytics"],
    gif:         "/creative/montgab-scroll.mp4",
    visual:      "/creative/53cb6a99-88d0-49b2-a250-bc678bc725aa.jpeg",
    align:       "right" as const,
  },
  {
    slug:        "180-degrees",
    name:        "180 Degrees",
    category:    "Agency Rebrand",
    description: "New name, mark, site, and launch campaign — all shipped simultaneously. A major client signed the week it went live.",
    did:         ["Naming & Strategy", "Visual Identity", "Website Build", "Launch Campaign", "Brand Guidelines"],
    tech:        ["Next.js", "GSAP", "Figma", "Three.js", "Vercel"],
    gif:         "/creative/180-degrees-scroll.mp4",
    visual:      "/creative/68e9e822-c689-4c3c-a35555e9a818.jpeg",
    align:       "left" as const,
  },
];

const SERVICES = [
  { n: "01", icon: "webdev",  title: "Web Development",  body: "Fast, scalable, impossible to ignore. Landing pages to full web apps — built to perform and built to last." },
  { n: "02", icon: "uiux",   title: "UI / UX Design",    body: "Research before aesthetics. Interfaces that feel obvious and convert better than they look." },
  { n: "03", icon: "ecom",   title: "E-Commerce",        body: "Shopify, WooCommerce, or custom. Stores engineered around one goal — selling more." },
  { n: "04", icon: "mobile", title: "Mobile Apps",       body: "iOS and Android. Native-feeling flows, tight onboarding, and retention built in from day one." },
  { n: "05", icon: "seo",    title: "SEO",               body: "Technical audits, content planning, Core Web Vitals, and AI-search visibility that compounds." },
  { n: "06", icon: "crm",    title: "CRM Platforms",     body: "Custom operational systems for bookings, teams, pipelines, reports, and business workflows." },
];

/* ── service icons ───────────────────────────────────────────────── */
const SZ = 46;
const IC: Record<string, React.ReactNode> = {
  webdev: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <polyline points="9 9 6 12 9 15"/>
      <polyline points="15 9 18 12 15 15"/>
    </svg>
  ),
  uiux: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  ecom: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  mobile: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5}/>
    </svg>
  ),
  seo: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  crm: (
    <svg width={SZ} height={SZ} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
};

/* ── tag hover: scale up + reveal description ─────────────────────── */
function onTagEnter(e: React.MouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  const desc = el.querySelector<HTMLElement>("[data-desc]");
  gsap.killTweensOf(el);
  gsap.killTweensOf(desc);
  el.style.zIndex = "20";
  gsap.to(el, { scale: 1.18, duration: 0.28, ease: "power2.out" });
  if (desc) gsap.to(desc, { height: "auto", opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
}
function onTagLeave(e: React.MouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  const desc = el.querySelector<HTMLElement>("[data-desc]");
  gsap.killTweensOf(el);
  gsap.killTweensOf(desc);
  gsap.to(el, {
    scale: 1, duration: 0.55, ease: "elastic.out(1, 0.45)",
    onComplete: () => { el.style.zIndex = "1"; },
  });
  if (desc) gsap.to(desc, { height: 0, opacity: 0, y: 4, duration: 0.18, ease: "power2.in" });
}

/* ── pixel decorations ────────────────────────────────────────────── */
function PxTri({ style, className }: { style: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ position: "absolute", width: 32, height: 48, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 0,  top: 0,  width: 16, height: 16, background: TK.green }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green }} />
      <span style={{ position: "absolute", left: 16, top: 32, width: 16, height: 16, background: TK.green }} />
    </div>
  );
}
function PxTriR({ style, className }: { style: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ position: "absolute", width: 32, height: 48, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 16, top: 0,  width: 16, height: 16, background: TK.green }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green }} />
      <span style={{ position: "absolute", left: 0,  top: 32, width: 16, height: 16, background: TK.green }} />
    </div>
  );
}
function PxPair({ style, className }: { style: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ position: "absolute", width: 24, height: 32, pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", left: 0,  top: 0,  width: 16, height: 16, background: TK.green }} />
      <span style={{ position: "absolute", left: 8,  top: 16, width: 16, height: 16, background: TK.green }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════════════ */
export default function HomeFocused() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(".tk-logo-hero", {
        y: 60, opacity: 0, duration: 1.3, ease: "power4.out",
      });
      gsap.from(".tk-hero-sub", {
        y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.5,
      });
      gsap.from(".tk-hero-cta", {
        scaleX: 0, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.8,
        transformOrigin: "left center",
      });
      gsap.from(".tk-px-deco", {
        opacity: 0, duration: 0.5, stagger: 0.07, delay: 1,
      });

      // ── What sets us apart — pin + cards fall in ─────────────────────
      gsap.set(".tk-wsua-heading", { opacity: 0, y: 40 });
      gsap.set(".tk-wsua-sub",     { opacity: 0, y: 20 });

      // Tags start invisible but at their FINAL position so overflow:hidden
      // doesn't clip them — we animate them from yPercent:-200 (above viewport)
      gsap.utils.toArray<HTMLElement>(".tk-tag-item").forEach((el) => {
        gsap.set(el, { opacity: 0, yPercent: -200 });
      });

      // Pin the section and animate on entry
      ScrollTrigger.create({
        trigger:       ".tk-wsua",
        start:         "top top",
        end:           "+=1000",
        pin:           true,
        anticipatePin: 1,
        onEnter() {
          gsap.to(".tk-wsua-heading", { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" });
          gsap.to(".tk-wsua-sub",     { opacity: 1, y: 0, duration: 0.6,  ease: "power3.out", delay: 0.15 });

          gsap.utils.toArray<HTMLElement>(".tk-tag-item").forEach((el, i) => {
            gsap.set(el, { transformOrigin: "center bottom" });
            gsap.to(el, {
              yPercent:  0,
              opacity:   1,
              duration:  0.6,
              ease:      "power3.in",
              delay:     0.3 + i * 0.1,
              onComplete() {
                gsap.timeline()
                  .to(el, { scaleX: 1.2,  scaleY: 0.75, duration: 0.06, ease: "none" })
                  .to(el, { scaleX: 1,    scaleY: 1,    duration: 0.35, ease: "elastic.out(1.2, 0.4)" });
              },
            });
          });
        },
      });

      // ── Projects ──────────────────────────────────────
      gsap.from(".tk-proj-heading", {
        y: 50, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-projects", start: "top 82%" },
      });

      gsap.utils.toArray<HTMLElement>(".tk-proj-row").forEach((row) => {
        const card    = row.querySelector<HTMLElement>(".tk-proj-card");
        const mask    = row.querySelector<HTMLElement>(".tk-proj-mask");
        const image   = row.querySelector<HTMLElement>(".tk-proj-image");
        const details = row.querySelector<HTMLElement>(".tk-proj-details");
        const kicker  = row.querySelector<HTMLElement>(".tk-proj-kicker");
        if (!card || !mask || !image || !details || !kicker) return;

        gsap.set(card,    { autoAlpha: 0.18, y: 120, scale: 0.94 });
        gsap.set(image,   { xPercent: -12, scale: 1.2, filter: "saturate(0.72) contrast(1.18) brightness(0.56)" });
        gsap.set(mask,    { xPercent: 0, backgroundColor: TK.green });
        gsap.set(details, { autoAlpha: 0, y: 28 });
        gsap.set(kicker,  { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            end: "center 36%",
            scrub: 1,
          },
        });

        tl.to(card,    { autoAlpha: 1, y: 0, scale: 1, ease: "none" }, 0)
          .to(image,   { xPercent: 0, scale: 1, filter: "saturate(1) contrast(1) brightness(0.94)", ease: "none" }, 0.04)
          .to(mask,    { xPercent: 62, backgroundColor: "#0b220d", ease: "none" }, 0.16)
          .to(kicker,  { autoAlpha: 0, y: -18, ease: "none" }, 0.24)
          .to(details, { autoAlpha: 1, y: 0, ease: "none" }, 0.42);
      });

      gsap.fromTo(".tk-proj-more", {
        scale: 0.86,
        y: 28,
        autoAlpha: 0,
      }, {
        scale: 1.14,
        y: 0,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".tk-proj-more-wrap",
          start: "top 88%",
          end: "bottom 62%",
          scrub: 0.8,
        },
      });
      gsap.fromTo(".tk-proj-more-arrow", {
        x: -8,
        scale: 0.85,
      }, {
        x: 12,
        scale: 1.35,
        ease: "none",
        scrollTrigger: {
          trigger: ".tk-proj-more-wrap",
          start: "top 88%",
          end: "bottom 62%",
          scrub: 0.8,
        },
      });

      // ── Services ──────────────────────────────────────
      gsap.from(".tk-svc-heading", {
        y: 50, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-services", start: "top 82%" },
      });
      gsap.from(".tk-svc-sub", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-services", start: "top 80%" },
      });
      const svcItems = gsap.utils.toArray<HTMLElement>(".tk-svc-item");
      gsap.set(svcItems, { opacity: 0, y: 44, scale: 0.94 });

      // Row 1 — first 3 cards appear when the section enters view
      gsap.to(svcItems.slice(0, 3), {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.11, duration: 0.78, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-services", start: "top 72%", once: true },
      });

      // Row 2 — last 3 cards appear when row 2 enters view
      gsap.to(svcItems.slice(3), {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.11, duration: 0.78, ease: "power3.out",
        scrollTrigger: { trigger: svcItems[3], start: "top 84%", once: true },
      });

      // ── Contact section entrance ──────────────────────────────────
      gsap.fromTo(".tk-contact-home",
        { y: 90, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: ".tk-contact-home", start: "top 88%", once: true },
        }
      );

      // ── Musts — rows fade+slide up as they enter the viewport ──
      const mustRows = gsap.utils.toArray<HTMLElement>(".tk-must-row");
      gsap.set(mustRows, { opacity: 0, y: 48 });
      mustRows.forEach((row, i) => {
        gsap.to(row, {
          opacity: 1, y: 0,
          duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start:   "top 88%",
            once:    true,
          },
        });
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS, overflowX: "clip" }}>

      <NoxNavbar active="home" />

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(3rem, 6vw, 7rem) clamp(1.5rem, 4vw, 3.5rem) 0" }}>
        <PxTri  className="tk-px-deco" style={{ left: "7%",  top: "12%" }} />
        <PxTriR className="tk-px-deco" style={{ right: "11%", top: "22%" }} />
        <PxPair className="tk-px-deco" style={{ left: "17%", bottom: "22%" }} />
        <PxPair className="tk-px-deco" style={{ right: "20%", bottom: "18%" }} />

        {/* NOX animated logo — full-width hero wordmark */}
        <div className="tk-logo-hero" style={{ margin: "0 auto clamp(2rem, 4vw, 4rem)", maxWidth: 980 }}>
          <NoxLogo height={200} />
          <style>{`.tk-logo-hero svg { width: 100% !important; height: auto !important; }`}</style>
        </div>

        <p className="tk-hero-sub" style={{
          fontFamily:  SANS,
          fontSize:    "clamp(0.88rem, 1.4vw, 1.4rem)",
          lineHeight:  1.55,
          color:       TK.green,
          maxWidth:    400,
          margin:      "0 auto clamp(3rem, 6vw, 6rem)",
          textAlign:   "center",
        }}>
          not your average creative agency.<br />we make things get noticed.
        </p>

        <Link
          href="/en/focused/contact"
          className="tk-hero-cta"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            height:         "clamp(48px, 5vw, 67px)",
            background:     TK.green,
            color:          TK.paper,
            fontFamily:     SANS,
            fontSize:       "clamp(0.95rem, 1.2vw, 1.2rem)",
            textDecoration: "none",
            transition:     "background 200ms ease",
            margin:         "0 -1.5rem",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = TK.greenHot)}
          onMouseLeave={e => (e.currentTarget.style.background = TK.green)}
        >Let&apos;s Create</Link>
      </section>

      <NoxClients />

      {/* ════════════════ WHAT SETS US APART ════════════════ */}
      <section className="tk-wsua" style={{
        minHeight:      "100dvh",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "center",
        padding:        "clamp(3rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderTop:      `1px solid ${TK.line}`,
        overflow:       "hidden",
        boxSizing:      "border-box",
      }}>
        <h2 className="tk-wsua-heading" style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(0.8rem, 1.5vw, 1.2rem)",
          flexShrink:    0,
        }}>what sets us apart</h2>

        <p className="tk-wsua-sub" style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.85rem, 1.1vw, 1.1rem)",
          lineHeight: 1.55,
          color:      TK.green,
          textAlign:  "center",
          maxWidth:   520,
          margin:     "0 auto clamp(1.2rem, 2.5vw, 2rem)",
          flexShrink: 0,
        }}>
          Small team. No middlemen. You talk directly to the people doing the work — from brief to launch.
        </p>

        {/* tag cloud — flex:1 fills remaining vh, overflow hidden clips fallers */}
        <div style={{ position: "relative", flex: 1, width: "100%", minHeight: 0 }}>
          {TAGS.map((tag, i) => (
            <span
              key={i}
              className="tk-tag-item"
              data-rot={tag.rot}
              onMouseEnter={onTagEnter}
              onMouseLeave={onTagLeave}
              style={{
                position:        "absolute",
                left:            `${tag.lp}%`,
                top:             `${tag.tp}%`,
                padding:         "clamp(3px, 0.5vw, 6px) clamp(7px, 1vw, 14px)",
                fontFamily:      SANS,
                fontWeight:      700,
                fontSize:        "clamp(0.9rem, 2.4vw, 2.8rem)",
                lineHeight:      1,
                transform:       `rotate(${tag.rot}deg)`,
                transformOrigin: "center center",
                background:      tag.cls === "wg" ? TK.paper : TK.green,
                color:           tag.cls === "wg" ? TK.green : TK.paper,
                cursor:          "default",
                userSelect:      "none",
                zIndex:          1,
                overflow:        "hidden",
                minWidth:        "max-content",
              }}
            >
              <span style={{ display: "block", whiteSpace: "nowrap" }}>{tag.text}</span>
              <span
                data-desc
                style={{
                  display:    "block",
                  height:     0,
                  opacity:    0,
                  overflow:   "hidden",
                  fontSize:   "clamp(0.55rem, 0.75vw, 0.72rem)",
                  fontWeight: 400,
                  lineHeight: 1.45,
                  marginTop:  "clamp(3px, 0.5vw, 6px)",
                  whiteSpace: "normal",
                  maxWidth:   "16em",
                  transform:  "translateY(4px)",
                }}
              >{tag.desc}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════ PROJECTS ════════════════ */}
      <section className="tk-projects" style={{
        padding:   "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderTop: `1px solid ${TK.line}`,
      }}>
        <h2 className="tk-proj-heading" style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2.2rem, 5.5vw, 5.5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(3rem, 5vw, 5rem)",
        }}>our projects</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 5rem)" }}>
          {PROJECTS.map((p, i) => (
            <Link key={i} href={`/en/focused/work/${p.slug}`}
              className="tk-proj-row"
              style={{
                minHeight:      "clamp(520px, 82vh, 760px)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <div
                className="tk-proj-card"
                style={{
                  position:       "sticky",
                  top:            "clamp(4rem, 12vh, 8rem)",
                  width:          "min(1120px, 100%)",
                  minHeight:      "clamp(340px, 58vh, 640px)",
                  aspectRatio:    "16 / 8.5",
                  background:     "var(--nox-proj-card-bg, #050805)",
                  overflow:       "hidden",
                  border:         `1px solid rgba(70,174,34,0.18)`,
                  isolation:      "isolate",
                  willChange:     "transform, opacity",
                }}
              >
                <video
                  className="tk-proj-image"
                  src={p.gif}
                  poster={p.visual}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    position:   "absolute",
                    inset:      0,
                    width:      "100%",
                    height:     "100%",
                    objectFit:  "cover",
                    willChange: "transform, filter",
                  }}
                />
                {/* full-card mask — slides right to reveal video, leaves green panel on right */}
                <div
                  className="tk-proj-mask"
                  style={{
                    position:    "absolute",
                    inset:       0,
                    zIndex:      2,
                    overflow:    "hidden",
                    willChange:  "transform, background-color",
                  }}
                >
                  {/* kicker shown before reveal */}
                  <span className="tk-proj-kicker" style={{
                    position:      "absolute",
                    left:          "clamp(1.25rem, 3vw, 3.25rem)",
                    bottom:        "clamp(1.25rem, 3vw, 3.25rem)",
                    fontFamily:    SANS,
                    fontSize:      "clamp(0.7rem, 0.92vw, 0.92rem)",
                    color:         TK.paper,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}>
                    {String(i + 1).padStart(2, "0")} / {p.category}
                  </span>

                  {/* details panel: constrained to the 38% visible portion of the mask */}
                  <div className="tk-proj-details" style={{
                    position:       "absolute",
                    left:           0,
                    top:            0,
                    bottom:         0,
                    width:          "38%",
                    overflow:       "hidden",
                    padding:        "clamp(1.4rem, 2.5vw, 2.5rem) clamp(1rem, 2vw, 2rem)",
                    display:        "flex",
                    flexDirection:  "column",
                    justifyContent: "flex-end",
                    gap:            "clamp(0.5rem, 0.8vw, 0.9rem)",
                    color:          TK.paper,
                  }}>
                    {/* category */}
                    <span style={{
                      fontFamily:    SANS,
                      fontSize:      "clamp(0.6rem, 0.76vw, 0.76rem)",
                      letterSpacing: "0.22em",
                      color:         "rgba(255,255,255,0.55)",
                      textTransform: "uppercase",
                    }}>{String(i + 1).padStart(2, "0")} — {p.category}</span>

                    {/* name */}
                    <strong style={{
                      display:    "block",
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize:   "clamp(1.5rem, 2.8vw, 3.2rem)",
                      lineHeight: 0.93,
                      color:      "#ffffff",
                    }}>{p.name}</strong>

                    {/* description */}
                    <p style={{
                      fontFamily: SANS,
                      fontSize:   "clamp(0.68rem, 0.82vw, 0.82rem)",
                      lineHeight: 1.6,
                      color:      "rgba(255,255,255,0.72)",
                      margin:     0,
                    }}>{p.description}</p>

                    {/* what we did */}
                    <div>
                      <span style={{
                        display:       "block",
                        fontFamily:    SANS,
                        fontSize:      "clamp(0.52rem, 0.6vw, 0.6rem)",
                        letterSpacing: "0.22em",
                        color:         "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                        marginBottom:  5,
                      }}>What we did</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {p.did.map((d) => (
                          <span key={d} style={{
                            fontFamily:  SANS,
                            fontSize:    "clamp(0.54rem, 0.65vw, 0.65rem)",
                            fontWeight:  600,
                            color:       "#46d12a",
                            background:  "rgba(70,174,34,0.18)",
                            border:      "1px solid rgba(70,212,42,0.55)",
                            padding:     "2px 8px",
                          }}>{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* built with */}
                    <div>
                      <span style={{
                        display:       "block",
                        fontFamily:    SANS,
                        fontSize:      "clamp(0.52rem, 0.6vw, 0.6rem)",
                        letterSpacing: "0.22em",
                        color:         "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                        marginBottom:  5,
                      }}>Built with</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {p.tech.map((t) => (
                          <span key={t} style={{
                            fontFamily:    SANS,
                            fontSize:      "clamp(0.52rem, 0.62vw, 0.62rem)",
                            fontWeight:    700,
                            letterSpacing: "0.06em",
                            color:         "#ffffff",
                            background:    "rgba(70,174,34,0.35)",
                            border:        "1px solid rgba(70,212,42,0.7)",
                            padding:       "2px 7px",
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="tk-proj-more-wrap" style={{ display: "flex", justifyContent: "center", marginTop: "clamp(3rem, 5vw, 5rem)", minHeight: "clamp(8rem, 16vw, 14rem)", alignItems: "center" }}>
          <Link href="/en/focused/work" className="tk-proj-more" style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "clamp(0.5rem, 1vw, 0.9rem)",
            padding:        "clamp(0.75rem, 1.5vw, 1.2rem)",
            border:         "none",
            background:     "transparent",
            fontFamily:     "'Syne', sans-serif",
            fontWeight:     700,
            fontSize:       "clamp(1.8rem, 4.2vw, 5.2rem)",
            lineHeight:     0.95,
            color:          TK.paper,
            textDecoration: "none",
            letterSpacing:  "0",
            transformOrigin:"center",
            willChange:     "transform, opacity",
          }}
          >
            <span>View more</span>
            <span className="tk-proj-more-arrow" aria-hidden="true" style={{
              display: "inline-block",
              color:   TK.paper,
              willChange: "transform",
            }}>→</span>
          </Link>
        </div>
      </section>

      {/* ════════════════ SERVICES ════════════════ */}
      <section className="tk-services" style={{
        padding:   "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderTop: `1px solid ${TK.line}`,
      }}>
        <h2 className="tk-svc-heading" style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2.2rem, 5.5vw, 5.5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(1.5rem, 2.5vw, 2rem)",
        }}>our services</h2>

        <p className="tk-svc-sub" style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.88rem, 1.2vw, 1.2rem)",
          lineHeight: 1.55,
          color:      TK.green,
          textAlign:  "center",
          maxWidth:   500,
          margin:     "0 auto clamp(2.5rem, 5vw, 5rem)",
        }}>
          Five disciplines. One studio. No retainers, no fluff — just work that performs.
        </p>

        {/* ── icon card grid ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "clamp(0.75rem, 1.2vw, 1.2rem)",
        }}>
          {SERVICES.map((s) => (
            <div
              key={s.n}
              className="tk-svc-item"
              style={{
                position:     "relative",
                overflow:     "hidden",
                background:   TK.ink,
                color:        TK.green,
                border:       `1px solid ${TK.line}`,
                padding:      "clamp(1.6rem, 2.8vw, 2.8rem)",
                display:      "flex",
                flexDirection:"column",
                minHeight:    "clamp(280px, 28vw, 360px)",
                transition:   "background 240ms ease, color 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
                cursor:       "default",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.classList.add("nox-card-lit");
                el.style.background  = TK.green;
                el.style.color       = TK.ink;
                el.style.borderColor = TK.green;
                el.style.boxShadow   = `0 24px 64px rgba(70,174,34,0.18)`;
                const t   = el.querySelector<HTMLElement>("[data-t]");
                const vs  = el.querySelector<HTMLElement>("[data-vs]");
                const bar = el.querySelector<HTMLElement>("[data-bar]");
                if (t)   { t.style.color = TK.ink; t.style.transform = "translateY(-3px)"; }
                if (vs)  { vs.style.opacity = "1"; vs.style.transform = "translateY(0)"; }
                if (bar) { bar.style.transform = "scaleX(0)"; }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.classList.remove("nox-card-lit");
                el.style.background  = TK.ink;
                el.style.color       = TK.green;
                el.style.borderColor = TK.line;
                el.style.boxShadow   = "none";
                const t   = el.querySelector<HTMLElement>("[data-t]");
                const vs  = el.querySelector<HTMLElement>("[data-vs]");
                const bar = el.querySelector<HTMLElement>("[data-bar]");
                if (t)   { t.style.color = TK.paper; t.style.transform = "translateY(0)"; }
                if (vs)  { vs.style.opacity = "0"; vs.style.transform = "translateY(6px)"; }
                if (bar) { bar.style.transform = "scaleX(1)"; }
              }}
            >
              <div className="nox-border-light" />
              {/* bottom accent bar */}
              <div data-bar style={{
                position:        "absolute",
                bottom:          0, left: 0, right: 0,
                height:          2,
                background:      TK.green,
                transformOrigin: "left",
                transition:      "transform 280ms ease",
              }} />

              {/* icon + number */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(1rem, 1.5vw, 1.5rem)" }}>
                <span style={{ lineHeight: 0, opacity: 0.85 }}>{IC[s.icon]}</span>
                <span style={{
                  fontFamily:    SANS,
                  fontSize:      "clamp(0.58rem, 0.75vw, 0.75rem)",
                  letterSpacing: "0.2em",
                  opacity:       0.35,
                }}>{s.n}</span>
              </div>

              {/* push content to bottom */}
              <div style={{ flex: 1 }} />

              {/* title + body + cta */}
              <div>
                <h3 data-t style={{
                  fontFamily:     SANS,
                  fontWeight:     700,
                  fontSize:       "clamp(1.3rem, 2.4vw, 2.5rem)",
                  lineHeight:     0.95,
                  color:          TK.paper,
                  margin:         "0 0 clamp(0.5rem, 0.8vw, 0.9rem)",
                  transition:     "color 240ms ease, transform 280ms ease",
                  display:        "block",
                }}>{s.title}</h3>
                <p style={{
                  fontFamily: SANS,
                  fontSize:   "clamp(0.76rem, 0.9vw, 0.9rem)",
                  lineHeight: 1.62,
                  margin:     "0 0 clamp(0.9rem, 1.4vw, 1.4rem)",
                }}>{s.body}</p>
                <span data-vs style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           6,
                  fontFamily:    SANS,
                  fontWeight:    600,
                  fontSize:      "clamp(0.72rem, 0.88vw, 0.88rem)",
                  letterSpacing: "0.06em",
                  opacity:       0,
                  transform:     "translateY(6px)",
                  transition:    "opacity 220ms ease, transform 220ms ease",
                }}>View Service →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NoxMusts />
      <NoxContactHome />
      <NoxFooter />
    </div>
  );
}
