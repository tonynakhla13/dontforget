"use client";
// v3

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ── design tokens ─────────────────────────────────────────────── */
const C = {
  cream:  "#EBDECE",
  green:  "#324438",
  yellow: "#F4B905",
  orange: "#E35523",
  ink:    "#221F1A",
  white:  "#FFFFFF",
  ph:     "#CFCBC4",
} as const;

const PAGE_BG = "#EBDECE";

const TEKO = "var(--font-teko), 'Teko', sans-serif";
const MONO = "var(--font-dm-sans), 'DM Sans', sans-serif";

/* ── star SVG for testimonials ─────────────────────────────────── */
function Star() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={C.yellow}>
      <polygon points="12,2 15,9 22,9.5 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.5 9,9" />
    </svg>
  );
}

/* ── social icons ───────────────────────────────────────────────── */
function SocialLinks() {
  return (
    <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
      {/* Instagram */}
      <a href="#" aria-label="Instagram" style={{ color: C.white }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      </a>
      {/* Twitter */}
      <a href="#" aria-label="Twitter" style={{ color: C.white }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 5.8a8.6 8.6 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.2 4.2 0 0 0-7.1 3.8A11.9 11.9 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1c0 2 1.4 3.7 3.4 4.1a4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9 8.4 8.4 0 0 1-6.2 1.7A11.9 11.9 0 0 0 8 20.4c7.7 0 11.9-6.4 11.9-11.9v-.5A8.5 8.5 0 0 0 22 5.8z" />
        </svg>
      </a>
      {/* LinkedIn */}
      <a href="#" aria-label="LinkedIn" style={{ color: C.white }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
    </div>
  );
}

/* ── marquee ────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "We Don't Do Boring", "★", "We Don't Do Boring", "★",
  "We Don't Do Boring", "★", "We Don't Do Boring", "★",
  "We Don't Do Boring", "★", "We Don't Do Boring", "★",
];

/* ── project data ───────────────────────────────────────────────── */
const PROJECTS = [
  { slug: "elia-clinic",  tag: "Healthcare",    title: "Elia Clinic" },
  { slug: "montgab",      tag: "E-Commerce",    title: "Montgab" },
  { slug: "180-degrees",  tag: "Agency / Brand", title: "180 Degrees" },
  { slug: "launchpad",    tag: "SaaS Platform", title: "Launchpad" },
];

/* ── services data ──────────────────────────────────────────────── */
const SERVICES = [
  { num: "01", title: "Web Dev",     body: "Fast, scalable, impossible to ignore. Landing pages to full web apps — built to perform and built to last." },
  { num: "02", title: "UI / UX",    body: "Research before aesthetics. Interfaces that feel obvious and convert better than they look." },
  { num: "03", title: "E-Commerce", body: "Shopify, WooCommerce, or custom. Stores designed around one goal — selling more." },
  { num: "04", title: "Mobile",     body: "iOS and Android. The kind of app people actually keep on their home screen." },
  { num: "05", title: "SEO",        body: "Growth that compounds. Structure, content, and authority working together — not in isolation." },
  { num: "06", title: "CRM",        body: "Custom systems built around how your business actually runs. Not how a template assumes it does." },
];

/* ── stats data ─────────────────────────────────────────────────── */
const STATS = [
  { value: "14+", label: "Projects shipped" },
  { value: "6",   label: "Countries reached" },
  { value: "24h", label: "Average response" },
  { value: "0",   label: "Boring websites made" },
];

/* ── process data ───────────────────────────────────────────────── */
const PROCESS = [
  { n: "01", title: "Ask",      body: "Right questions before the brief exists." },
  { n: "02", title: "Define",   body: "The real problem, the real audience, the real constraints." },
  { n: "03", title: "Research", body: "Study the market. Pick the strongest route." },
  { n: "04", title: "Propose",  body: "Options, scope, trade-offs. No surprises." },
  { n: "05", title: "Plan",     body: "UX, structure, references — locked and aligned." },
  { n: "06", title: "Build",    body: "Make it work. Then make it unforgettable." },
  { n: "07", title: "Ship",     body: "Test, refine, launch. Then we stay." },
];

/* ── principles data ────────────────────────────────────────────── */
const PRINCIPLES = [
  { n: "01", name: "Clarity",  line: "If it doesn't sharpen the message, it doesn't make the cut." },
  { n: "02", name: "Motion",   line: "Every movement has to explain, reveal, or guide." },
  { n: "03", name: "Systems",  line: "The launch is not the finish line. It is the first stress test." },
  { n: "04", name: "Honesty",  line: "The strongest result starts with saying the useful thing early." },
];

/* ── testimonials data ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:  "They didn't just build a website. They made something people actually remember. First agency that ever made that happen for us.",
    name:   "Amanda Reed",
    role:   "Creative Director, WBS",
  },
  {
    quote:  "Sharp, fast, no fluff. They shipped something we're proud of and it converted from day one. Didn't know agencies like this still existed.",
    name:   "Bryan Knight",
    role:   "Head of Product, Google",
  },
];

/* ── blog data ──────────────────────────────────────────────────── */
const BLOG = [
  { tag: "Strategy", title: "A website is not a brand. Here's the difference." },
  { tag: "Dev",      title: "Why your interface feels slow (even when it isn't)" },
  { tag: "Branding", title: "The 4 things clients notice before they read a word" },
];

/* ── pill button ────────────────────────────────────────────────── */
function PillOutline({ children, href }: { children: React.ReactNode; href?: string }) {
  const style: React.CSSProperties = {
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "10px 28px",
    border:         `2px solid ${C.ink}`,
    borderRadius:   40,
    fontFamily:     TEKO,
    fontWeight:     700,
    fontSize:       18,
    color:          C.ink,
    background:     "transparent",
    cursor:         "pointer",
    transition:     "background .2s, color .2s",
    textDecoration: "none",
  };
  if (href)
    return (
      <Link href={href} style={style}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.ink; (e.currentTarget as HTMLElement).style.color = C.yellow; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.ink; }}
      >{children}</Link>
    );
  return (
    <button style={style}
      onMouseEnter={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.yellow; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ink; }}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function HomeFocused() {
  const rootRef   = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Banner entrance ─────────────────────────────────── */
      gsap.from(".kbm-banner-title", {
        y:        100,
        opacity:  0,
        duration: 1.1,
        ease:     "power4.out",
      });

      gsap.from(".kbm-nav-item", {
        y:        24,
        opacity:  0,
        stagger:  0.07,
        duration: 0.7,
        ease:     "power2.out",
        delay:    0.5,
      });

      /* ── 2. Hero cards stagger ──────────────────────────────── */
      gsap.from(".kbm-hero-card", {
        y:       50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease:    "power3.out",
        scrollTrigger: {
          trigger: ".kbm-hero",
          start:   "top 82%",
        },
      });

      /* ── 3. Projects stagger ────────────────────────────────── */
      gsap.from(".kbm-proj-card", {
        y:        60,
        opacity:  0,
        stagger:  0.1,
        duration: 0.8,
        ease:     "power3.out",
        scrollTrigger: {
          trigger: ".kbm-projects",
          start:   "top 80%",
        },
      });

      /* ── 4. Services reveal ─────────────────────────────────── */
      gsap.from(".kbm-svc-card", {
        y:        40,
        opacity:  0,
        stagger:  0.08,
        duration: 0.75,
        ease:     "power3.out",
        scrollTrigger: {
          trigger: ".kbm-services",
          start:   "top 80%",
        },
      });

      /* ── 5. Testimonial ─────────────────────────────────────── */
      gsap.from(".kbm-test-item", {
        y:       40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease:    "power3.out",
        scrollTrigger: {
          trigger: ".kbm-testimonial",
          start:   "top 80%",
        },
      });

      /* ── 6. Clients fade in ─────────────────────────────────── */
      gsap.from(".kbm-client-logo", {
        y:        30,
        opacity:  0,
        stagger:  0.06,
        duration: 0.5,
        ease:     "power2.out",
        scrollTrigger: {
          trigger: ".kbm-clients",
          start:   "top 90%",
        },
      });

      /* ── 7. Blog cards ──────────────────────────────────────── */
      gsap.from(".kbm-blog-card", {
        y:       40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75,
        ease:    "power3.out",
        scrollTrigger: {
          trigger: ".kbm-blog",
          start:   "top 80%",
        },
      });

      /* ── 8. Footer ──────────────────────────────────────────── */
      gsap.from(".kbm-footer-card", {
        y:       30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease:    "power2.out",
        scrollTrigger: {
          trigger: ".kbm-footer",
          start:   "top 90%",
        },
      });

    }, rootRef);

    /* ── GSAP marquee (replaces CSS animation for smoothness) ─── */
    const track = marqueeRef.current;
    if (track) {
      const totalW = track.scrollWidth / 2;
      gsap.to(track, {
        x:        -totalW,
        duration: 28,
        ease:     "none",
        repeat:   -1,
      });
    }

    return () => ctx.revert();
  }, []);

  /* ── section title ──────────────────────────────────────────── */
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{
      fontFamily: TEKO,
      fontWeight: 700,
      fontSize:   "clamp(3rem, 6vw, 5.5rem)",
      lineHeight: 1,
      color:      C.ink,
      marginBottom: "clamp(2rem, 4vw, 3.5rem)",
    }}>{children}</h2>
  );

  return (
    <div ref={rootRef} style={{ backgroundColor: "transparent", color: C.ink, overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════
          BANNER
      ═══════════════════════════════════════ */}
      <section style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.75rem) 0" }}>
        {/* Giant heading */}
        <h1
          className="kbm-banner-title"
          style={{
            fontFamily:    TEKO,
            fontWeight:    700,
            fontSize:      "clamp(4.5rem, 18vw, 22rem)",
            lineHeight:    0.9,
            color:         C.green,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            marginBottom:  "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          DON&apos;T FORGET
        </h1>

        {/* Nav */}
        <nav style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          paddingBottom:  "clamp(1rem, 2vw, 1.5rem)",
          flexWrap:       "wrap",
          gap:            "0.5rem",
        }}>
          {[
            { label: "Home",     href: "/focused" },
            { label: "About",    href: "/focused/about" },
            { label: "Projects", href: "/focused/work" },
            { label: "Services", href: "/focused/services" },
            { label: "Blog",     href: "/focused/blog" },
            { label: "Contact",  href: "/focused/contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="kbm-nav-item"
              style={{
                fontFamily:    TEKO,
                fontWeight:    500,
                fontSize:      "clamp(1rem, 1.5vw, 1.5rem)",
                color:         C.ink,
                textTransform: "capitalize",
                letterSpacing: "0.04em",
                padding:       "8px 0",
                position:      "relative",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>

      {/* ═══════════════════════════════════════
          HERO CARDS
      ═══════════════════════════════════════ */}
      <section
        className="kbm-hero"
        style={{
          padding:  "clamp(1rem, 2vw, 2rem) clamp(1.5rem, 4vw, 3.75rem)",
          display:  "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:      "clamp(1rem, 2vw, 2rem)",
        }}
      >
        {/* Card: Who we are */}
        <div
          className="kbm-hero-card"
          style={{
            backgroundColor: C.yellow,
            borderRadius:    40,
            padding:         "clamp(2rem, 4vw, 3.5rem)",
            display:         "flex",
            flexDirection:   "column",
            justifyContent:  "space-between",
            minHeight:       "clamp(280px, 35vw, 560px)",
            overflow:        "hidden",
            position:        "relative",
          }}
        >
          <div>
            <h2 style={{
              fontFamily: TEKO,
              fontWeight: 700,
              fontSize:   "clamp(2.4rem, 5.5vw, 6rem)",
              lineHeight: 1,
              color:      C.ink,
            }}>We build things<br />unforgettable.</h2>
            <p style={{
              fontFamily: MONO,
              fontSize:   "clamp(0.8rem, 1.1vw, 1.1rem)",
              lineHeight: 1.4,
              color:      C.ink,
              marginTop:  "clamp(1.5rem, 3vw, 3rem)",
              maxWidth:   620,
            }}>
              Most websites are forgotten before the tab closes.
              Ours aren&apos;t. Ask your competitors.
            </p>
          </div>

          {/* Marquee strip */}
          <div style={{
            overflow: "hidden",
            height:   "clamp(50px, 7vw, 90px)",
            display:  "flex",
            alignItems: "center",
          }}>
            <div
              ref={marqueeRef}
              style={{
                display:   "flex",
                gap:       "clamp(30px, 4vw, 60px)",
                whiteSpace: "nowrap",
                willChange: "transform",
              }}
            >
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} style={{
                  fontFamily: TEKO,
                  fontWeight: 700,
                  fontSize:   "clamp(1.5rem, 4vw, 4rem)",
                  lineHeight: 1,
                  color:      C.ink,
                }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 2 stacked rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 2rem)" }}>
          {/* Top row: transform + image */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:     "clamp(1rem, 2vw, 2rem)",
            flex:    "1",
          }}>
            {/* Quote card */}
            <div
              className="kbm-hero-card"
              style={{
                backgroundColor: C.orange,
                borderRadius:    40,
                padding:         "clamp(1.5rem, 3vw, 2.5rem)",
                position:        "relative",
                overflow:        "hidden",
                display:         "flex",
                flexDirection:   "column",
                justifyContent:  "space-between",
              }}
            >
              {/* giant decorative quote mark */}
              <div style={{
                position:   "absolute",
                top:        "-10%",
                right:      "4%",
                fontFamily: TEKO,
                fontWeight: 900,
                fontSize:   "clamp(8rem, 14vw, 14rem)",
                lineHeight: 1,
                color:      "rgba(34,31,26,0.12)",
                pointerEvents: "none",
                userSelect: "none",
              }}>&ldquo;</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{
                  fontFamily: TEKO,
                  fontWeight: 700,
                  fontSize:   "clamp(1.2rem, 2.4vw, 2.6rem)",
                  lineHeight: 1.1,
                  color:      C.ink,
                }}>Ask your<br />competitors.</p>
                <p style={{
                  fontFamily: MONO,
                  fontSize:   "clamp(0.65rem, 0.9vw, 0.9rem)",
                  color:      C.ink,
                  opacity:    0.7,
                  marginTop:  10,
                }}>They know our work.</p>
              </div>
            </div>

            {/* Availability card */}
            <div
              className="kbm-hero-card"
              style={{
                backgroundColor: C.green,
                borderRadius:    40,
                padding:         "clamp(1.5rem, 3vw, 2.5rem)",
                display:         "flex",
                flexDirection:   "column",
                justifyContent:  "space-between",
              }}
            >
              <div style={{
                display:    "flex",
                alignItems: "center",
                gap:        8,
              }}>
                <span style={{
                  width:           10,
                  height:          10,
                  borderRadius:    "50%",
                  backgroundColor: C.yellow,
                  flexShrink:      0,
                }} />
                <span style={{
                  fontFamily:    MONO,
                  fontSize:      "clamp(0.6rem, 0.8vw, 0.8rem)",
                  color:         C.cream,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>2 spots open</span>
              </div>
              <div>
                <div style={{
                  fontFamily: TEKO,
                  fontWeight: 700,
                  fontSize:   "clamp(1.2rem, 2.4vw, 2.6rem)",
                  lineHeight: 1.1,
                  color:      C.yellow,
                }}>3–4 projects<br />per quarter.</div>
                <div style={{
                  fontFamily: MONO,
                  fontSize:   "clamp(0.6rem, 0.8vw, 0.8rem)",
                  color:      C.cream,
                  marginTop:  8,
                  opacity:    0.7,
                }}>Response within 24h</div>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <Link
            href="/focused/contact"
            className="kbm-hero-card"
            style={{
              backgroundColor: C.ink,
              borderRadius:    40,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              minHeight:       "clamp(80px, 12vw, 200px)",
              cursor:          "pointer",
              textDecoration:  "none",
              padding:         "clamp(1.5rem, 3vw, 2.5rem)",
              transition:      "background .25s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.green)}
            onMouseLeave={e => (e.currentTarget.style.background = C.ink)}
          >
            <span style={{
              fontFamily: TEKO,
              fontWeight: 700,
              fontSize:   "clamp(1.5rem, 3.5vw, 3.5rem)",
              lineHeight: 1,
              color:      C.cream,
            }}>Start a project.</span>
            <span style={{
              fontFamily:      TEKO,
              fontWeight:      700,
              fontSize:        "clamp(2rem, 4vw, 4.5rem)",
              lineHeight:      1,
              color:           C.yellow,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              width:           "clamp(60px, 8vw, 100px)",
              height:          "clamp(60px, 8vw, 100px)",
              borderRadius:    "50%",
              border:          `2px solid ${C.yellow}`,
              flexShrink:      0,
            }}>↗</span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <section style={{
        padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(3rem, 5vw, 5rem)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:     "clamp(1rem, 1.5vw, 1.5rem)",
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            backgroundColor: i === 3 ? C.yellow : C.green,
            borderRadius:    24,
            padding:         "clamp(1.5rem, 2.5vw, 2.5rem)",
            display:         "flex",
            flexDirection:   "column",
            gap:             8,
          }}>
            <div style={{
              fontFamily: TEKO,
              fontWeight: 700,
              fontSize:   "clamp(2.5rem, 4vw, 5rem)",
              lineHeight: 1,
              color:      i === 3 ? C.ink : C.yellow,
            }}>{s.value}</div>
            <div style={{
              fontFamily:    MONO,
              fontSize:      "clamp(0.65rem, 0.85vw, 0.85rem)",
              lineHeight:    1.4,
              color:         i === 3 ? C.ink : C.cream,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════
          RECENT PROJECTS
      ═══════════════════════════════════════ */}
      <section
        className="kbm-projects"
        style={{
          padding: "clamp(4rem, 8vw, 10rem) clamp(1.5rem, 4vw, 3.75rem)",
        }}
      >
        <SectionTitle>Recent projects</SectionTitle>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap:                 "clamp(1.5rem, 3vw, 4rem)",
        }}>
          {PROJECTS.map((p, i) => (
            <a
              key={i}
              href={`/focused/work/${p.slug}`}
              className="kbm-proj-card"
              style={{
                display:        "flex",
                flexDirection:  "column",
                gap:            8,
                cursor:         "pointer",
                textDecoration: "none",
              }}
            >
              {/* image */}
              <div style={{
                height:          "clamp(180px, 28vw, 500px)",
                borderRadius:    40,
                backgroundColor: C.ph,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                overflow:        "hidden",
                transition:      "transform .35s ease",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-6px)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
              >
                <svg width="30%" viewBox="0 0 80 80" fill="none">
                  <rect width="80" height="80" rx="12" fill={C.cream} />
                  <rect x="16" y="28" width="48" height="32" rx="4" stroke={C.green} strokeWidth="2" />
                  <circle cx="30" cy="42" r="6" fill={C.green} opacity="0.4" />
                  <path d="M42 52 l12-12 8 8" stroke={C.green} strokeWidth="2" />
                </svg>
              </div>
              <div style={{
                fontFamily:  TEKO,
                fontWeight:  700,
                fontSize:    "clamp(0.9rem, 1.2vw, 1.2rem)",
                color:       C.ink,
                paddingTop:  14,
                letterSpacing: "0.04em",
              }}>{p.tag}</div>
              <div style={{
                fontFamily: TEKO,
                fontWeight: 700,
                fontSize:   "clamp(1.1rem, 2vw, 1.9rem)",
                color:      C.ink,
              }}>{p.title}</div>
              <PillOutline>View Project</PillOutline>
            </a>
          ))}
        </div>

        {/* View All bar */}
        <Link
          href="/focused/work"
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            height:          "clamp(56px, 6vw, 90px)",
            borderRadius:    40,
            backgroundColor: C.yellow,
            fontFamily:      TEKO,
            fontWeight:      700,
            fontSize:        "clamp(1.5rem, 2.5vw, 2.5rem)",
            color:           C.green,
            marginTop:       "clamp(2rem, 4vw, 5rem)",
            cursor:          "pointer",
            transition:      "background .2s",
            textDecoration:  "none",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#ffc619")}
          onMouseLeave={e => (e.currentTarget.style.background = C.yellow)}
        >
          View All Projects
        </Link>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════ */}
      <section
        className="kbm-services"
        style={{ padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)" }}
      >
        <SectionTitle>Services</SectionTitle>
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "clamp(1rem, 1.5vw, 1.5rem)",
        }}>
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="kbm-svc-card"
              style={{
                backgroundColor: i % 2 === 0 ? C.green : C.ink,
                borderRadius:    32,
                padding:         "clamp(1.5rem, 2.5vw, 2.5rem)",
                transition:      "transform .25s ease",
                display:         "flex",
                flexDirection:   "column",
                gap:             12,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: C.yellow, letterSpacing: "0.1em" }}>{s.num}</div>
              <h3 style={{
                fontFamily:    TEKO,
                fontWeight:    700,
                fontSize:      "clamp(1.4rem, 2.5vw, 2.8rem)",
                lineHeight:    1,
                color:         C.yellow,
                textTransform: "uppercase",
              }}>{s.title}</h3>
              <p style={{
                fontFamily: MONO,
                fontSize:   "clamp(0.72rem, 0.9vw, 0.9rem)",
                lineHeight: 1.5,
                color:      C.cream,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROCESS  (5 scattered cards)
      ═══════════════════════════════════════ */}
      <section
        className="kbm-process"
        style={{ padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(2rem, 3.5vw, 3.5rem)" }}>
          <SectionTitle>Process</SectionTitle>
          <p style={{ fontFamily: MONO, fontSize: "clamp(0.75rem, 1vw, 1rem)", color: C.ink, opacity: 0.5, paddingBottom: "0.6rem" }}>
            5 steps · 1–2 months · no surprises
          </p>
        </div>

        <style>{`
          @keyframes kbm-draw { to { stroke-dashoffset: 0; } }
          @keyframes kbm-trace {
            0%   { stroke-dashoffset: 1; }
            55%  { stroke-dashoffset: 0; }
            88%  { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 1; }
          }
        `}</style>
        {/* scattered pinboard layout */}
        {(() => {
          const FIVE = [PROCESS[0], PROCESS[1], PROCESS[2], PROCESS[4], PROCESS[6]].map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));
          const PALETTES = [
            { bg: C.ink,    num: C.yellow, text: C.cream, body: "rgba(235,222,206,0.65)" },
            { bg: C.green,  num: C.yellow, text: C.cream, body: "rgba(235,222,206,0.7)"  },
            { bg: C.orange, num: C.cream,  text: C.cream, body: "rgba(235,222,206,0.78)" },
            { bg: C.yellow, num: C.white,  text: C.white, body: "rgba(255,255,255,0.75)" },
            { bg: "#7B3F2A", num: C.yellow, text: C.cream, body: "rgba(235,222,206,0.75)" },
          ];
          const TR = (delay = 0, dur = 3.5) =>
            ({ strokeDasharray:"1", pathLength:"1",
               strokeDashoffset:"1",
               style:{animation:`kbm-trace ${dur}s ${delay}s ease-in-out infinite`} as React.CSSProperties });
          const CARD_ICONS = [
            /* ASK — speech bubble */
            <svg key="ask" width="68" height="68" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
              <path {...TR(0)}     d="M8 10h36v26H30l-6 8-2-8H8z"/>
              <path {...TR(0.6)}   d="M18 22h16M18 28h10"/>
            </svg>,
            /* DEFINE — bullseye */
            <svg key="def" width="68" height="68" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
              <circle cx="26" cy="26" r="18" {...TR(0)}/>
              <circle cx="26" cy="26" r="11" {...TR(0.5)}/>
              <circle cx="26" cy="26" r="4"  {...TR(1)}/>
              <line x1="44" y1="8" x2="30" y2="22" {...TR(1.4)}/>
              <polyline points="44,8 44,14 38,8" {...TR(1.7)}/>
            </svg>,
            /* RESEARCH — magnifier */
            <svg key="res" width="68" height="68" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
              <circle cx="21" cy="21" r="13" {...TR(0)}/>
              <line x1="31" y1="31" x2="44" y2="44" {...TR(0.8)}/>
              <line x1="16" y1="21" x2="26" y2="21" {...TR(1.2)}/>
              <line x1="21" y1="16" x2="21" y2="26" {...TR(1.5)}/>
            </svg>,
            /* PLAN — clipboard + check */
            <svg key="plan" width="68" height="68" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
              <rect x="10" y="8" width="32" height="38" rx="3" {...TR(0)}/>
              <polyline points="18,22 22,27 32,17" {...TR(0.7)}/>
              <line x1="18" y1="33" x2="34" y2="33" {...TR(1.1)}/>
              <line x1="18" y1="39" x2="27" y2="39" {...TR(1.4)}/>
            </svg>,
            /* SHIP — rocket */
            <svg key="ship" width="68" height="68" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
              <path {...TR(0)}   d="M26 5c0 0 13 9 13 23l-13 5-13-5C13 14 26 5 26 5z"/>
              <circle cx="26" cy="23" r="4" {...TR(0.8)}/>
              <path {...TR(1.2)} d="M17 33l-5 9 9-3"/>
              <path {...TR(1.5)} d="M35 33l5 9-9-3"/>
            </svg>,
          ];
          return (
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap:                 "clamp(0.75rem, 1.5vw, 1.25rem)",
            }}>
              {FIVE.map((step, i) => {
                const p = PALETTES[i];
                return (
                  <div
                    key={step.n}
                    style={{
                      background:    p.bg,
                      borderRadius:  14,
                      padding:       "clamp(1.2rem, 2vw, 1.6rem)",
                      display:       "flex",
                      flexDirection: "column",
                      gap:           8,
                      minHeight:     "clamp(200px, 22vw, 260px)",
                      position:      "relative",
                      overflow:      "hidden",
                    }}
                  >
                    <span style={{
                      fontFamily:    TEKO,
                      fontWeight:    700,
                      fontSize:      "clamp(2rem, 3vw, 3rem)",
                      lineHeight:    1,
                      color:         p.num,
                      letterSpacing: "-0.02em",
                    }}>{step.n}</span>
                    <h3 style={{
                      fontFamily:    TEKO,
                      fontWeight:    700,
                      fontSize:      "clamp(1.1rem, 1.8vw, 1.5rem)",
                      lineHeight:    1.1,
                      color:         p.text,
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                      marginTop:     0,
                    }}>{step.title}</h3>
                    <p style={{
                      fontFamily: MONO,
                      fontSize:   "clamp(0.85rem, 1.1vw, 1rem)",
                      lineHeight: 1.5,
                      color:      p.body,
                      marginTop:  0,
                    }}>{step.body}</p>
                    <div style={{
                      position: "absolute",
                      bottom:   12,
                      right:    12,
                      color:    p.num,
                      opacity:  0.9,
                    }}>
                      {CARD_ICONS[i]}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* ═══════════════════════════════════════
          PRINCIPLES  (Our Musts)
      ═══════════════════════════════════════ */}
      <section
        className="kbm-principles"
        style={{ padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(2rem, 3.5vw, 3.5rem)" }}>
          <SectionTitle>Our Musts</SectionTitle>
          <p style={{ fontFamily: MONO, fontSize: "clamp(0.75rem, 1vw, 1rem)", color: C.ink, opacity: 0.5, paddingBottom: "0.6rem" }}>
            non-negotiable · always
          </p>
        </div>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap:                 "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}>
          {PRINCIPLES.map((rule, i) => {
            const palettes = [
              { bg: C.ink,    num: C.yellow,  name: C.cream,  line: "rgba(235,222,206,0.6)" },
              { bg: C.green,  num: C.yellow,  name: C.cream,  line: "rgba(235,222,206,0.7)" },
              { bg: C.orange, num: C.cream,   name: C.cream,  line: "rgba(235,222,206,0.75)" },
              { bg: C.yellow, num: C.white,  name: C.white,  line: "rgba(255,255,255,0.7)" },
            ];
            const p = palettes[i % palettes.length];
            return (
              <div
                key={rule.n}
                style={{
                  background:    p.bg,
                  borderRadius:  16,
                  padding:       "clamp(1.5rem, 2.5vw, 2.5rem)",
                  position:      "relative",
                  overflow:      "hidden",
                  minHeight:     "clamp(180px, 22vw, 280px)",
                  display:       "flex",
                  flexDirection: "column",
                  justifyContent:"space-between",
                }}
              >
                {/* watermark number */}
                <span aria-hidden="true" style={{
                  position:      "absolute",
                  bottom:        "-0.15em",
                  right:         "-0.05em",
                  fontFamily:    TEKO,
                  fontWeight:    700,
                  fontSize:      "clamp(6rem, 14vw, 16rem)",
                  lineHeight:    1,
                  color:         p.num,
                  opacity:       0.12,
                  letterSpacing: "-0.04em",
                  userSelect:    "none",
                  pointerEvents: "none",
                }}>{rule.n}</span>

                {/* small label */}
                <span style={{
                  fontFamily:    MONO,
                  fontSize:      "clamp(0.6rem, 0.8vw, 0.8rem)",
                  color:         p.num,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  opacity:       0.85,
                }}>{rule.n}</span>

                {/* principle name */}
                <div>
                  <h3 style={{
                    fontFamily:    TEKO,
                    fontWeight:    700,
                    fontSize:      "clamp(2.8rem, 5vw, 6rem)",
                    lineHeight:    1,
                    color:         p.name,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    marginBottom:  "clamp(0.4rem, 0.8vw, 0.8rem)",
                  }}>{rule.name}</h3>
                  <p style={{
                    fontFamily: MONO,
                    fontSize:   "clamp(0.7rem, 0.9vw, 0.9rem)",
                    lineHeight: 1.5,
                    color:      p.line,
                    maxWidth:   320,
                  }}>{rule.line}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════════ */}
      <section
        className="kbm-testimonial"
        style={{
          margin:              "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)",
          backgroundColor:     C.ink,
          borderRadius:        40,
          padding:             "clamp(2rem, 5vw, 5rem)",
          color:               C.cream,
          display:             "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap:                 "clamp(2rem, 4vw, 5rem)",
          alignItems:          "start",
        }}
      >
        {/* Title */}
        <h2 style={{
          fontFamily: TEKO,
          fontWeight: 700,
          fontSize:   "clamp(2.5rem, 5vw, 5rem)",
          lineHeight: 1,
          color:      C.yellow,
        }}>Testimonial</h2>

        {/* Reviews */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 5vw, 5rem)" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="kbm-test-item" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[...Array(5)].map((_, j) => <Star key={j} />)}
              </div>
              <p style={{
                fontFamily: MONO,
                fontSize:   "clamp(0.85rem, 1.3vw, 1.3rem)",
                lineHeight: 1.5,
                color:      C.cream,
              }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{
                  width:           56,
                  height:          56,
                  borderRadius:    10,
                  backgroundColor: C.ph,
                  flexShrink:      0,
                }} />
                <div>
                  <div style={{
                    fontFamily: TEKO,
                    fontWeight: 700,
                    fontSize:   18,
                    color:      C.cream,
                  }}>{t.name}</div>
                  <div style={{
                    fontFamily: MONO,
                    fontSize:   14,
                    color:      C.cream,
                    opacity:    0.75,
                  }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CLIENTS
      ═══════════════════════════════════════ */}
      <section
        className="kbm-clients"
        style={{
          padding:   "0 0 clamp(4rem, 8vw, 10rem)",
          overflow:  "hidden",
        }}
      >
        <style>{`
          @keyframes kbm-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
        <div style={{
          display:   "flex",
          gap:       "clamp(0.75rem, 1.5vw, 1.25rem)",
          animation: "kbm-marquee 18s linear infinite",
          width:     "max-content",
        }}>
          {[...["ACME","NEON","PIXEL","FORGE","SHIFT","APEX","VOLT","GRID","ACME","NEON","PIXEL","FORGE","SHIFT","APEX","VOLT","GRID"]].map((name, i) => (
            <div
              key={i}
              className="kbm-client-logo"
              style={{
                backgroundColor: C.ink,
                borderRadius:    10,
                height:          "clamp(52px, 6vw, 80px)",
                width:           "clamp(100px, 12vw, 160px)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                fontFamily:      TEKO,
                fontWeight:      700,
                fontSize:        "clamp(1rem, 1.6vw, 1.6rem)",
                color:           C.cream,
                letterSpacing:   "0.08em",
                flexShrink:      0,
              }}
            >{name}</div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RECENT BLOG
      ═══════════════════════════════════════ */}
      <section
        className="kbm-blog"
        style={{
          padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)",
        }}
      >
        <SectionTitle>Recent blog</SectionTitle>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "clamp(1rem, 2vw, 2rem)",
        }}>
          {BLOG.map((b, i) => (
            <a
              key={i}
              href="#"
              className="kbm-blog-card"
              style={{ display: "flex", flexDirection: "column", cursor: "pointer", textDecoration: "none" }}
            >
              <div style={{
                height:          "clamp(140px, 20vw, 320px)",
                borderRadius:    40,
                backgroundColor: C.ph,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                marginBottom:    16,
                overflow:        "hidden",
                transition:      "transform .25s ease",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
              >
                <svg width="30%" viewBox="0 0 80 80" fill="none">
                  <rect width="80" height="80" rx="8" fill={C.cream} />
                  <rect x="12" y="16" width="56" height="8" rx="4" fill={C.green} opacity="0.4" />
                  <rect x="12" y="32" width="40" height="6" rx="3" fill={C.green} opacity="0.3" />
                  <rect x="12" y="46" width="48" height="6" rx="3" fill={C.green} opacity="0.3" />
                  <rect x="12" y="60" width="32" height="6" rx="3" fill={C.green} opacity="0.3" />
                </svg>
              </div>
              <div style={{
                fontFamily: TEKO,
                fontSize:   "clamp(0.85rem, 1.1vw, 1.1rem)",
                color:      C.ink,
                padding:    "8px 0",
                letterSpacing: "0.04em",
              }}>{b.tag}</div>
              <div style={{
                fontFamily: TEKO,
                fontWeight: 700,
                fontSize:   "clamp(1rem, 1.8vw, 1.7rem)",
                color:      C.ink,
                lineHeight: 1.2,
              }}>{b.title}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AVAILABILITY
      ═══════════════════════════════════════ */}
      <section style={{
        margin:          "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)",
        backgroundColor: C.yellow,
        borderRadius:    40,
        padding:         "clamp(2rem, 5vw, 5rem)",
        display:         "flex",
        justifyContent:  "space-between",
        alignItems:      "center",
        flexWrap:        "wrap",
        gap:             "clamp(1.5rem, 3vw, 3rem)",
      }}>
        <div>
          <h2 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 4.5rem)", lineHeight: 1, color: C.ink }}>
            We take 3–4 projects per quarter.
          </h2>
          <p style={{ fontFamily: MONO, fontSize: "clamp(0.8rem, 1.1vw, 1rem)", lineHeight: 1.6, color: C.ink, marginTop: 12, maxWidth: 480 }}>
            Not because we&apos;re precious. Because good work takes time and we don&apos;t half-ass things.
          </p>
          <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: C.green, marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            — Currently: 2 spots open
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <Link
            href="/focused/contact"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              padding:        "14px 36px",
              backgroundColor: C.ink,
              borderRadius:   40,
              fontFamily:     TEKO,
              fontWeight:     700,
              fontSize:       "clamp(1.1rem, 1.8vw, 1.8rem)",
              color:          C.yellow,
              textDecoration: "none",
              transition:     "background .2s",
            }}
          >Start a project →</Link>
          <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: C.ink, letterSpacing: "0.1em" }}>Response within 24h</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer
        className="kbm-footer"
        style={{
          padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(3rem, 6vw, 6rem)",
        }}
      >
        {/* Row 1 */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1.8fr 1fr 1fr",
          gap:                 "clamp(1rem, 2vw, 2rem)",
          marginBottom:        "clamp(1rem, 2vw, 2rem)",
        }}>
          {/* Contact card */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.green,
              borderRadius:    40,
              padding:         "clamp(2rem, 4vw, 4rem)",
              color:           C.white,
              minHeight:       "clamp(200px, 24vw, 380px)",
              display:         "flex",
              flexDirection:   "column",
              justifyContent:  "space-between",
            }}
          >
            <h2 style={{
              fontFamily: TEKO,
              fontWeight: 500,
              fontSize:   "clamp(1.5rem, 3.5vw, 3.5rem)",
              lineHeight: 1.2,
              color:      C.white,
              maxWidth:   500,
            }}>Have a question, a project? We&apos;d love to discuss</h2>
            <div>
              <a href="mailto:hello@dontforget.studio" style={{
                display:    "block",
                fontFamily: MONO,
                fontSize:   "clamp(0.9rem, 1.5vw, 1.6rem)",
                color:      C.white,
                lineHeight: 1.4,
              }}>hello@dontforget.studio</a>
              <a href="tel:+13125550173" style={{
                display:    "block",
                fontFamily: MONO,
                fontSize:   "clamp(0.9rem, 1.5vw, 1.6rem)",
                color:      C.white,
                lineHeight: 1.4,
              }}>+1 (312) 555-0173</a>
            </div>
          </div>

          {/* Links card */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.yellow,
              borderRadius:    40,
              padding:         "clamp(2rem, 3vw, 3rem)",
            }}
          >
            {[
              { label: "Home",     href: "/focused" },
              { label: "About",    href: "/focused/about" },
              { label: "Projects", href: "/focused/work" },
              { label: "Services", href: "/focused/services" },
              { label: "Blog",     href: "/focused/blog" },
              { label: "Contact",  href: "/focused/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{
                display:       "block",
                fontFamily:    TEKO,
                fontWeight:    500,
                fontSize:      "clamp(1rem, 1.8vw, 1.8rem)",
                lineHeight:    1.6,
                color:         C.ink,
                textTransform: "capitalize",
              }}>{label}</Link>
            ))}
          </div>

          {/* Utils card */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.orange,
              borderRadius:    40,
              padding:         "clamp(2rem, 3vw, 3rem)",
            }}
          >
            {["Style Guide", "Instructions", "Licenses", "Changelog", "Error 404"].map(label => (
              <a key={label} href="#" style={{
                display:       "block",
                fontFamily:    TEKO,
                fontWeight:    500,
                fontSize:      "clamp(1rem, 1.8vw, 1.8rem)",
                lineHeight:    1.6,
                color:         C.ink,
                textTransform: "capitalize",
              }}>{label}</a>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "clamp(1rem, 2vw, 2rem)",
        }}>
          {/* Brand */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.yellow,
              borderRadius:    40,
              padding:         "clamp(2rem, 3vw, 3rem)",
              display:         "flex",
              flexDirection:   "column",
              justifyContent:  "space-between",
              minHeight:       "clamp(160px, 20vw, 340px)",
            }}
          >
            <div style={{
              fontFamily:    TEKO,
              fontWeight:    700,
              fontSize:      "clamp(1.5rem, 3vw, 3rem)",
              color:         C.green,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}>DON&apos;T FORGET</div>
            <div style={{
              fontFamily: MONO,
              fontSize:   "clamp(0.75rem, 1vw, 1rem)",
              lineHeight: 1.4,
              color:      C.ink,
            }}>© 2026. All rights reserved. Designed by Experts</div>
          </div>

          {/* Subscribe */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.orange,
              borderRadius:    40,
              padding:         "clamp(2rem, 3vw, 3rem)",
              display:         "flex",
              flexDirection:   "column",
              gap:             "clamp(1.5rem, 2.5vw, 2.5rem)",
            }}
          >
            <h3 style={{
              fontFamily:    TEKO,
              fontWeight:    700,
              fontSize:      "clamp(1.5rem, 2.5vw, 2.5rem)",
              lineHeight:    1.1,
              color:         C.white,
              textTransform: "uppercase",
            }}>Sign up now and stay inspired!</h3>
            <form
              onSubmit={e => { e.preventDefault(); (e.currentTarget.querySelector("button") as HTMLButtonElement).textContent = "THANKS!"; }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                style={{
                  height:       52,
                  borderRadius: 40,
                  border:       `2px solid ${C.ink}`,
                  background:   "transparent",
                  padding:      "0 20px",
                  fontFamily:   TEKO,
                  fontWeight:   700,
                  fontSize:     18,
                  color:        C.ink,
                  outline:      "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height:     52,
                  width:      160,
                  borderRadius: 40,
                  border:     `2px solid ${C.ink}`,
                  background: "transparent",
                  fontFamily: TEKO,
                  fontWeight: 700,
                  fontSize:   18,
                  color:      C.ink,
                  cursor:     "pointer",
                }}
              >SUBMIT</button>
            </form>
          </div>

          {/* Hours */}
          <div
            className="kbm-footer-card"
            style={{
              backgroundColor: C.ink,
              borderRadius:    40,
              padding:         "clamp(2rem, 3vw, 3rem)",
              display:         "flex",
              flexDirection:   "column",
              gap:             6,
            }}
          >
            <h3 style={{
              fontFamily:   TEKO,
              fontWeight:   700,
              fontSize:     "clamp(1.5rem, 2.5vw, 2.5rem)",
              color:        C.white,
              marginBottom: 10,
            }}>We&apos;re here for you</h3>
            {[
              "NOX Studio — New York",
              "New York, NY 10001",
              "",
              "Mon – Fri: 9:30 – 18:00",
              "Sat: 9:30 – 13:00",
              "Sun: Closed",
            ].map((row, i) => (
              row === "" ? <div key={i} style={{ height: 8 }} /> :
              <div key={i} style={{
                fontFamily: MONO,
                fontSize:   "clamp(0.7rem, 0.9vw, 0.95rem)",
                lineHeight: 1.5,
                color:      C.white,
              }}>{row}</div>
            ))}
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
