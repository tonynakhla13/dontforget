"use client";

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

const TEKO = "var(--font-teko), 'Teko', sans-serif";
const MONO = "var(--font-source-code-pro), 'Source Code Pro', ui-monospace, monospace";

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
  "Digital Creative Agency", "★", "Digital Creative Agency", "★",
  "Digital Creative Agency", "★", "Digital Creative Agency", "★",
  "Digital Creative Agency", "★", "Digital Creative Agency", "★",
];

/* ── project data ───────────────────────────────────────────────── */
const PROJECTS = [
  { tag: "Branding",       title: "Corporate Branding" },
  { tag: "Developing",     title: "Interior Design Ideas" },
  { tag: "Mobile",         title: "The Coding Awards" },
  { tag: "Developing",     title: "No-Bull Bootcamp" },
];

/* ── services data ──────────────────────────────────────────────── */
const SERVICES = [
  {
    title: "Design & Development",
    body:  "We craft pixel-perfect interfaces backed by clean, scalable code — built to perform at every breakpoint.",
  },
  {
    title: "Branding & Content",
    body:  "From visual identity to tone of voice, we build brands that feel distinct, coherent, and impossible to forget.",
  },
  {
    title: "Marketing Performance",
    body:  "Data-driven campaigns, SEO architecture, and conversion strategy that turns attention into lasting growth.",
  },
];

/* ── testimonials data ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:  "Working with DON'T FORGET transformed our online presence completely. Their attention to detail and creative vision exceeded every expectation we had going in.",
    name:   "Amanda Reed",
    role:   "Creative Director, WBS",
  },
  {
    quote:  "Exceptional work from start to finish. The team delivered a website that truly represents our brand and has driven measurable growth in our conversion rates.",
    name:   "Bryan Knight",
    role:   "Head of Product, Google",
  },
];

/* ── blog data ──────────────────────────────────────────────────── */
const BLOG = [
  { tag: "Strategy", title: "Dirty little secrets about the business" },
  { tag: "Web",      title: "Skills that you can learn from business" },
  { tag: "Design",   title: "Bad habits that people in the industry" },
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
      gsap.from(".kbm-svc-col1", {
        x:        -50,
        opacity:  0,
        duration: 0.9,
        ease:     "power3.out",
        scrollTrigger: {
          trigger: ".kbm-services",
          start:   "top 80%",
        },
      });
      gsap.from(".kbm-svc-card", {
        x:        50,
        opacity:  0,
        stagger:  0.12,
        duration: 0.85,
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
    <div ref={rootRef} style={{ backgroundColor: C.cream, color: C.ink, overflowX: "hidden" }}>

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
            { label: "Home",     href: "/" },
            { label: "About",    href: "/about" },
            { label: "Projects", href: "/work" },
            { label: "Services", href: "/services" },
            { label: "Blog",     href: "/blog" },
            { label: "Contact",  href: "/contact" },
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
              fontSize:   "clamp(3rem, 7vw, 7rem)",
              lineHeight: 1,
              color:      C.ink,
            }}>Who we are</h2>
            <p style={{
              fontFamily: MONO,
              fontSize:   "clamp(0.8rem, 1.1vw, 1.1rem)",
              lineHeight: 1.4,
              color:      C.ink,
              marginTop:  "clamp(1.5rem, 3vw, 3rem)",
              maxWidth:   620,
            }}>
              We design visual identities. We are an insight and behavior-driven creative
              marketing agency. A Full Service Digital Creative Agency Specializing in:
              Video Production, Web Design, Branding, Brand Strategy.
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
            {/* Transform card */}
            <div
              className="kbm-hero-card"
              style={{
                backgroundColor: C.orange,
                borderRadius:    40,
                padding:         "clamp(1.5rem, 3vw, 2.5rem)",
                position:        "relative",
                overflow:        "hidden",
              }}
            >
              <p style={{
                fontFamily: MONO,
                fontSize:   "clamp(0.8rem, 1.1vw, 1.1rem)",
                lineHeight: 1.5,
                color:      C.ink,
                position:   "relative",
                zIndex:     1,
              }}>
                Transform your enterprise with resolutions tailored to your
                requirements & goals.
              </p>
              {/* decorative circle */}
              <svg
                style={{
                  position: "absolute",
                  right:    "-15%",
                  bottom:   "-15%",
                  width:    "60%",
                  opacity:  0.25,
                  pointerEvents: "none",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.ink}
                strokeWidth="1"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill={C.ink} />
              </svg>
            </div>

            {/* Image placeholder */}
            <div
              className="kbm-hero-card"
              style={{
                backgroundColor: C.ph,
                borderRadius:    40,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
              }}
            >
              <svg width="40%" viewBox="0 0 80 80" fill="none">
                <rect width="80" height="80" rx="12" fill={C.cream} />
                <rect x="16" y="28" width="48" height="32" rx="4" stroke={C.green} strokeWidth="2" />
                <circle cx="30" cy="42" r="6" fill={C.green} opacity="0.5" />
                <path d="M42 52 l12-12 8 8" stroke={C.green} strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* CTA card */}
          <Link
            href="/work"
            className="kbm-hero-card"
            style={{
              backgroundColor: C.green,
              borderRadius:    40,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              minHeight:       "clamp(80px, 12vw, 200px)",
              cursor:          "pointer",
              textDecoration:  "none",
              transition:      "background .25s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#283629")}
            onMouseLeave={e => (e.currentTarget.style.background = C.green)}
          >
            <span style={{
              fontFamily: TEKO,
              fontWeight: 700,
              fontSize:   "clamp(1.5rem, 3.5vw, 3.5rem)",
              lineHeight: 1,
              color:      C.yellow,
            }}>View Our Projects</span>
          </Link>
        </div>
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
              href="#"
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
          href="/work"
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
        style={{
          padding:             "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)",
          display:             "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap:                 "clamp(2rem, 4vw, 5rem)",
          alignItems:          "start",
        }}
      >
        {/* Left: title + copy */}
        <div className="kbm-svc-col1" style={{ paddingTop: "clamp(1rem, 3vw, 2rem)" }}>
          <SectionTitle>Services</SectionTitle>
          <p style={{
            fontFamily: MONO,
            fontSize:   "clamp(0.8rem, 1.1vw, 1.1rem)",
            lineHeight: 1.5,
            maxWidth:   520,
          }}>
            Building a strong brand. Distinctive, recognizable and consistent. Effective
            communication campaigns that activate your target group.
          </p>
        </div>

        {/* Right: service cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 2rem)" }}>
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="kbm-svc-card"
              style={{
                backgroundColor: C.green,
                borderRadius:    40,
                padding:         "clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 3vw, 3rem)",
                transition:      "transform .25s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              <h3 style={{
                fontFamily:    TEKO,
                fontWeight:    700,
                fontSize:      "clamp(1.5rem, 3.5vw, 4rem)",
                lineHeight:    1,
                color:         C.yellow,
                marginBottom:  "clamp(1rem, 3vw, 3rem)",
                textTransform: "uppercase",
              }}>{s.title}</h3>
              <p style={{
                fontFamily: MONO,
                fontSize:   "clamp(0.75rem, 1vw, 1rem)",
                lineHeight: 1.4,
                color:      C.cream,
              }}>{s.body}</p>
            </div>
          ))}
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
          padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 10rem)",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap:     "clamp(0.5rem, 1.5vw, 1.5rem)",
        }}
      >
        {["ACME", "NEON", "PIXEL", "FORGE", "SHIFT", "APEX", "VOLT", "GRID"].map((name, i) => (
          <div
            key={i}
            className="kbm-client-logo"
            style={{
              backgroundColor: "#E5E3DF",
              borderRadius:    8,
              height:          "clamp(44px, 6vw, 80px)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              fontFamily:      TEKO,
              fontWeight:      700,
              fontSize:        "clamp(0.8rem, 1.5vw, 1.5rem)",
              color:           "#999",
              letterSpacing:   "0.05em",
            }}
          >{name}</div>
        ))}
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
              <a href="tel:+12125550100" style={{
                display:    "block",
                fontFamily: MONO,
                fontSize:   "clamp(0.9rem, 1.5vw, 1.6rem)",
                color:      C.white,
                lineHeight: 1.4,
              }}>+1 (212) 555-0100</a>
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
              { label: "Home",     href: "/" },
              { label: "About",    href: "/about" },
              { label: "Projects", href: "/work" },
              { label: "Services", href: "/services" },
              { label: "Blog",     href: "/blog" },
              { label: "Contact",  href: "/contact" },
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
              "NYC Studio — Don't Forget",
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
