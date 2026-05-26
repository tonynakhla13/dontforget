"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import { NoxNavbar, NoxFooter, NoxClients, NoxMusts, TK, SANS, DISPLAY } from "@/components/focused/NoxShared";
import NoxContactHome from "@/components/focused/NoxContactHome";

/* ── data ─────────────────────────────────────────────────────────── */
// lp = left%, tp = top% — positions across the full section width
const TAGS = [
  { text: "craft",     cls: "wg", lp:  22, tp:  4, rot: -4 },
  { text: "bold",      cls: "wg", lp:  66, tp:  7, rot:  4 },
  { text: "instinct",  cls: "gw", lp:   2, tp: 20, rot: -3 },
  { text: "precision", cls: "gw", lp:  44, tp: 22, rot:  2 },
  { text: "edge",      cls: "wg", lp:  79, tp: 18, rot: -2 },
  { text: "raw",       cls: "gw", lp:  11, tp: 40, rot: -5 },
  { text: "culture",   cls: "gw", lp:  61, tp: 43, rot: -7 },
  { text: "clarity",   cls: "wg", lp:   3, tp: 58, rot: -6 },
  { text: "sharp",     cls: "wg", lp:  37, tp: 61, rot:  6 },
  { text: "velocity",  cls: "gw", lp:  72, tp: 56, rot:  3 },
  { text: "grit",      cls: "gw", lp:  18, tp: 77, rot: -3 },
  { text: "form",      cls: "wg", lp:  52, tp: 80, rot:  2 },
];

const PROJECTS = [
  {
    slug:     "elia-clinic",
    name:     "Elia Clinic",
    category: "Healthcare",
    label:    "Brand identity and patient digital experience — 5 weeks from kickoff to launch, zero revision rounds.",
    visual:   "/creative/353706ca-1752-4775-8f6d-18ffc60338d9.jpeg",
    align:    "left" as const,
  },
  {
    slug:     "montgab",
    name:     "Montgab",
    category: "E-Commerce",
    label:    "Full Shopify redesign and UX overhaul. Streamlined checkout cut cart abandonment by 40% in month one.",
    visual:   "/creative/53cb6a99-88d0-49b2-a250-bc678bc725aa.jpeg",
    align:    "right" as const,
  },
  {
    slug:     "180-degrees",
    name:     "180 Degrees",
    category: "Agency Rebrand",
    label:    "New name, mark, site, and launch campaign — all shipped simultaneously. A major client signed the week it went live.",
    visual:   "/creative/68e9e822-c689-4c3c-a35555e9a818.jpeg",
    align:    "left" as const,
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

/* ── tag throw interaction ────────────────────────────────────────── */
function onTagHit(e: React.MouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  const rot = parseFloat(el.dataset.rot ?? "0");
  const rect = el.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width  / 2);
  const dy = e.clientY - (rect.top  + rect.height / 2);
  const norm = Math.sqrt(dx * dx + dy * dy) || 1;
  const power = 260 + Math.random() * 220;

  gsap.killTweensOf(el);
  gsap.timeline()
    .to(el, {
      x: -(dx / norm) * power,
      y: -(dy / norm) * power - 70,
      rotation: rot + (Math.random() - 0.5) * 80,
      scale: 0.88,
      duration: 0.36,
      ease: "power3.out",
    })
    .to(el, {
      x: 0, y: 0, rotation: rot, scale: 1,
      duration: 1.4,
      ease: "elastic.out(0.75, 0.38)",
    });
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

      const wsuaST = { trigger: ".tk-wsua", start: "top 70%", once: true };

      gsap.from(".tk-wsua-heading", { y: 50, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: wsuaST });
      gsap.from(".tk-wsua-sub",     { y: 24, opacity: 0, duration: 0.7,  ease: "power3.out", delay: 0.2, scrollTrigger: wsuaST });

      gsap.utils.toArray<HTMLElement>(".tk-tag-item").forEach((el, i) => {
        gsap.set(el, { transformOrigin: "center bottom" });
        gsap.from(el, {
          y: -(300 + i * 40),
          opacity: 0,
          duration: 1.1 + i * 0.05,
          ease: "bounce.out",
          delay: 0.3 + i * 0.12,
          scrollTrigger: wsuaST,
          onComplete() {
            gsap.timeline()
              .to(el, { scaleX: 1.18, scaleY: 0.78, duration: 0.07, ease: "none" })
              .to(el, { scaleX: 1, scaleY: 1, duration: 0.35, ease: "elastic.out(1.2, 0.4)" });
          },
        });
      });

      // ── Projects ──────────────────────────────────────
      gsap.from(".tk-proj-heading", {
        y: 50, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-projects", start: "top 82%" },
      });

      gsap.utils.toArray<HTMLElement>(".tk-proj-row").forEach((row) => {
        const card = row.querySelector<HTMLElement>(".tk-proj-card");
        const mask = row.querySelector<HTMLElement>(".tk-proj-mask");
        const image = row.querySelector<HTMLElement>(".tk-proj-image");
        const details = row.querySelector<HTMLElement>(".tk-proj-details");
        const kicker = row.querySelector<HTMLElement>(".tk-proj-kicker");
        if (!card || !mask || !image || !details || !kicker) return;

        gsap.set(card, { autoAlpha: 0.18, y: 120, scale: 0.94 });
        gsap.set(image, { xPercent: -12, scale: 1.2, filter: "saturate(0.72) contrast(1.18) brightness(0.56)" });
        gsap.set(mask, { xPercent: 0, backgroundColor: TK.green });
        gsap.set(details, { autoAlpha: 0, y: 28 });
        gsap.set(kicker, { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            end: "center 36%",
            scrub: 1,
          },
        });

        tl.to(card, { autoAlpha: 1, y: 0, scale: 1, ease: "none" }, 0)
          .to(image, { xPercent: 0, scale: 1, filter: "saturate(1) contrast(1) brightness(0.94)", ease: "none" }, 0.04)
          .to(mask, { xPercent: 62, backgroundColor: "#0b220d", ease: "none" }, 0.16)
          .to(kicker, { autoAlpha: 0, y: -18, ease: "none" }, 0.24)
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

      // ── Musts — each row appears one by one while section is sticky ──
      const mustRows = gsap.utils.toArray<HTMLElement>(".tk-must-row");
      gsap.set(mustRows, { opacity: 0, y: 36 });
      mustRows.forEach((row, i) => {
        gsap.to(row, {
          opacity: 1, y: 0,
          duration: 0.72, ease: "power3.out",
          scrollTrigger: {
            trigger: ".tk-musts",
            start:   `top+=${i * 380} top`,
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

        {/* NOX mesh logo — full-width hero wordmark */}
        <div className="tk-logo-hero" style={{ margin: "0 auto clamp(2rem, 4vw, 4rem)", maxWidth: 960 }}>
          <img
            src="/nox-mesh-logo.svg"
            alt="NOX STUDIO"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
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
        padding:    "clamp(5rem, 9vw, 10rem) clamp(1.5rem, 4vw, 3.5rem)",
        borderTop:  `1px solid ${TK.line}`,
        overflowX:  "clip",
      }}>
        <h2 className="tk-wsua-heading" style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(2.2rem, 5.5vw, 5.5rem)",
          lineHeight:    1,
          color:         TK.paper,
          textTransform: "uppercase",
          textAlign:     "center",
          margin:        "0 0 clamp(1.5rem, 2.5vw, 2rem)",
        }}>what sets us apart</h2>

        <p className="tk-wsua-sub" style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.88rem, 1.2vw, 1.2rem)",
          lineHeight: 1.55,
          color:      TK.green,
          textAlign:  "center",
          maxWidth:   540,
          margin:     "0 auto clamp(3rem, 6vw, 6rem)",
        }}>
          Small team. No middlemen. You talk directly to the people doing the work — from brief to launch.
        </p>

        <div style={{ position: "relative", height: "clamp(380px, 60vh, 680px)", width: "100%" }}>
          {TAGS.map((tag, i) => (
            <span
              key={i}
              className="tk-tag-item"
              data-rot={tag.rot}
              onMouseEnter={onTagHit}
              style={{
                position:      "absolute",
                left:          `${tag.lp}%`,
                top:           `${tag.tp}%`,
                padding:       "clamp(3px, 0.6vw, 7px) clamp(8px, 1.2vw, 16px)",
                fontFamily:    SANS,
                fontWeight:    700,
                fontSize:      "clamp(1rem, 3vw, 3.5rem)",
                lineHeight:    1,
                whiteSpace:    "nowrap",
                transform:     `rotate(${tag.rot}deg)`,
                background:    tag.cls === "wg" ? TK.paper : TK.green,
                color:         tag.cls === "wg" ? TK.green : TK.paper,
                cursor:        "pointer",
                userSelect:    "none",
              }}
            >{tag.text}</span>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="tk-proj-image"
                  src={p.visual}
                  alt={p.name}
                  style={{
                    position:   "absolute",
                    inset:      0,
                    width:      "100%",
                    height:     "100%",
                    objectFit:  "cover",
                    willChange: "transform, filter",
                  }}
                />
                <div
                  className="tk-proj-mask"
                  style={{
                    position:       "absolute",
                    inset:          0,
                    zIndex:         2,
                    padding:        "clamp(1.25rem, 3vw, 3.25rem)",
                    overflow:       "hidden",
                    boxShadow:      "inset -1px 0 0 rgba(255,255,255,0.06)",
                    willChange:     "transform, background-color",
                  }}
                >
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
                  <div className="tk-proj-details" style={{
                    position:      "absolute",
                    left:          "clamp(1.25rem, 3vw, 3.25rem)",
                    bottom:        "clamp(1.25rem, 3vw, 3.25rem)",
                    width:         "min(35%, 360px)",
                    minWidth:      "clamp(180px, 25vw, 280px)",
                    color:         TK.paper,
                  }}>
                    <span style={{
                      display:       "block",
                      fontFamily:    SANS,
                      fontSize:      "clamp(0.62rem, 0.78vw, 0.78rem)",
                      letterSpacing: "0.18em",
                      color:         "var(--nox-proj-sub, rgba(255,255,255,0.55))",
                      marginBottom:  12,
                      textTransform: "uppercase",
                    }}>{p.category}</span>
                    <strong style={{
                      display:       "block",
                      fontFamily:    SANS,
                      fontWeight:    700,
                      fontSize:      "clamp(1.45rem, 3vw, 3.35rem)",
                      lineHeight:    0.95,
                      color:         TK.paper,
                      marginBottom:  14,
                    }}>{p.name}</strong>
                    <span style={{
                      display:    "block",
                      fontFamily: SANS,
                      fontSize:   "clamp(0.74rem, 0.98vw, 0.98rem)",
                      lineHeight: 1.5,
                      color:      "var(--nox-proj-body, rgba(255,255,255,0.74))",
                    }}>{p.label}</span>
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

      {/* tall wrapper gives the sticky NoxMusts section scroll depth for row reveals */}
      <div style={{ position: "relative", height: "calc(100vh + 1600px)" }}>
        <NoxMusts />
      </div>
      <NoxContactHome />
      <NoxFooter />
    </div>
  );
}
