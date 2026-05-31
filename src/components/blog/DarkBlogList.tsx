"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Post = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  coverImage?: string | null;
  excerpt?: string | null;
  publishedAt?: Date | string | null;
};

const FALLBACK: Post[] = [
  { id: "1", slug: "branding-mistakes",  title: "5 branding mistakes that are costing you clients",         tags: ["Branding"],  coverImage: null, excerpt: "Common pitfalls and how to avoid them when building a recognisable brand." },
  { id: "2", slug: "web-performance",    title: "Why your website speed is your most important metric",     tags: ["Web"],       coverImage: null, excerpt: "A practical look at performance budgets and the decisions that make sites feel instant." },
  { id: "3", slug: "design-systems",     title: "What a design system actually saves you",                  tags: ["Design"],    coverImage: null, excerpt: "The smallest system that keeps a growing product consistent — and sane." },
  { id: "4", slug: "seo-in-2026",        title: "SEO in 2026: what still works and what doesn't",           tags: ["Strategy"],  coverImage: null, excerpt: "The landscape has shifted. Here's what matters now." },
  { id: "5", slug: "conversion-copy",    title: "Writing copy that converts without being pushy",            tags: ["Content"],   coverImage: null, excerpt: "Persuasion without pressure — words that earn trust." },
  { id: "6", slug: "gsap-animations",    title: "How we use GSAP to make interfaces feel alive",             tags: ["Dev"],       coverImage: null, excerpt: "Motion that communicates rather than decorates." },
];

function fmt(d?: Date | string | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(d));
}

/* ── Single 3-D tilt card ─────────────────────────────────────── */
function BlogCard({ post, href }: { post: Post; href: string }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;

    /* Kill transition so the tilt tracks instantly — no lag */
    el.style.transition = "box-shadow 0.2s ease, border-color 0.2s ease";

    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const nx = (cx / rect.width  - 0.5) * 2;  // -1 … 1
    const ny = (cy / rect.height - 0.5) * 2;  // -1 … 1

    /* 3-D tilt — instant, no easing */
    el.style.transform = `perspective(900px) rotateY(${nx * 9}deg) rotateX(${ny * -9}deg) translateZ(18px) scale(1.02)`;

    /* cursor-following glow */
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(ellipse 80% 60% at ${cx}px ${cy}px, rgba(70,174,34,0.18) 0%, transparent 70%)`;
    }

    /* specular shine strip */
    if (shineRef.current) {
      shineRef.current.style.opacity   = "1";
      shineRef.current.style.transform = `translateX(${nx * 40}%)`;
    }
  }

  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    /* Restore transition only for the spring-back */
    el.style.transition = "transform 0.55s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease";
    el.style.transform  = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)";
    el.style.boxShadow  = "0 4px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(70,174,34,0.08) inset";
    el.style.borderColor    = "rgba(70,174,34,0.2)";
    el.style.borderTopColor = "rgba(70,174,34,0.6)";
    if (glowRef.current)  glowRef.current.style.background   = "none";
    if (shineRef.current) shineRef.current.style.opacity     = "0";
  }

  const date = fmt(post.publishedAt);

  return (
    <a
      ref={cardRef}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="dbl-card"
      style={{
        display:         "flex",
        flexDirection:   "column",
        textDecoration:  "none",
        position:        "relative",
        background:      "rgba(10,10,10,0.94)",
        border:          "1px solid rgba(70,174,34,0.2)",
        borderTop:       "2px solid rgba(70,174,34,0.6)",
        borderRadius:    "16px",
        backdropFilter:  "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:       "0 4px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(70,174,34,0.08) inset",
        overflow:        "hidden",
        transformStyle:  "preserve-3d",
        transition:      "transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s ease-out, border-color 0.18s ease-out",
        willChange:      "transform",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.boxShadow  = "0 12px 56px rgba(0,0,0,0.7), 0 0 28px rgba(70,174,34,0.18), 0 0 0 1px rgba(70,174,34,0.35) inset";
        el.style.borderColor = "rgba(70,174,34,0.45)";
        el.style.borderTopColor = "rgba(70,174,34,0.9)";
      }}
    >
      {/* Cursor glow layer */}
      <div
        ref={glowRef}
        style={{
          position:       "absolute", inset: 0,
          pointerEvents:  "none", zIndex: 1,
          transition:     "background 0.08s linear",
        }}
        aria-hidden="true"
      />

      {/* Specular shine */}
      <div
        ref={shineRef}
        style={{
          position:        "absolute", inset: 0,
          pointerEvents:   "none", zIndex: 2,
          opacity:         0,
          background:      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.045) 50%, transparent 70%)",
          transition:      "opacity 0.2s ease-out, transform 0.12s ease-out",
        }}
        aria-hidden="true"
      />

      {/* Cover image / placeholder */}
      <div
        style={{
          position:       "relative",
          width:          "100%",
          aspectRatio:    "16/9",
          flexShrink:     0,
          overflow:       "hidden",
          background:     "rgba(20,20,20,0.9)",
        }}
      >
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              display: "block",
              filter: "brightness(0.7) saturate(0.8)",
              transition: "transform 0.5s cubic-bezier(.22,1,.36,1), filter 0.3s ease",
            }}
            className="dbl-thumb"
          />
        ) : (
          /* Geometric placeholder */
          <svg
            viewBox="0 0 320 180" fill="none" aria-hidden="true"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <rect width="320" height="180" fill="rgba(12,12,12,0.8)" />
            <rect x="20" y="20" width="100" height="8" rx="4" fill="rgba(70,174,34,0.2)" />
            <rect x="20" y="36" width="260" height="28" rx="4" fill="rgba(70,174,34,0.1)" />
            <rect x="20" y="72" width="200" height="16" rx="3" fill="rgba(70,174,34,0.08)" />
            <rect x="20" y="96" width="240" height="16" rx="3" fill="rgba(70,174,34,0.08)" />
            <rect x="20" y="120" width="160" height="16" rx="3" fill="rgba(70,174,34,0.06)" />
            <circle cx="280" cy="150" r="20" stroke="rgba(70,174,34,0.2)" strokeWidth="1.5" fill="none" />
            <path d="M275 150 L280 145 L285 150 L280 155 Z" fill="rgba(70,174,34,0.35)" />
          </svg>
        )}

        {/* Teal gradient overlay on image */}
        <div
          style={{
            position:   "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Card body */}
      <div style={{ padding: "clamp(1.2rem,2.2vw,1.8rem)", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>

        {/* Tag */}
        {post.tags[0] && (
          <span style={{
            fontFamily:     "var(--font-mono, monospace)",
            fontSize:       "0.58rem",
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            color:          "var(--teal, #46ae22)",
            opacity:        0.8,
          }}>
            {post.tags[0]}
          </span>
        )}

        {/* Title */}
        <h2 style={{
          margin:         0,
          fontFamily:     "var(--font-display, sans-serif)",
          fontWeight:     700,
          fontSize:       "clamp(1.05rem,1.7vw,1.5rem)",
          lineHeight:     1.15,
          letterSpacing:  "-0.02em",
          color:          "var(--fg, #F0ECE3)",
          transition:     "color 0.2s ease",
        }}
          className="dbl-title"
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{
            margin:     0,
            fontFamily: "inherit",
            fontSize:   "clamp(0.82rem,1.1vw,0.95rem)",
            lineHeight: 1.72,
            color:      "var(--body, #7A7A7A)",
            display:    "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow:   "hidden",
          }}>
            {post.excerpt}
          </p>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer row: date + read arrow */}
        <div style={{
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          paddingTop:    "clamp(0.8rem,1.2vw,1.1rem)",
          borderTop:     "1px solid rgba(70,174,34,0.1)",
          marginTop:     "auto",
        }}>
          {date ? (
            <span style={{
              fontFamily:    "var(--font-mono, monospace)",
              fontSize:      "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "var(--body, #7A7A7A)",
              opacity:       0.7,
            }}>
              {date}
            </span>
          ) : <span />}

          <span
            className="dbl-arrow"
            style={{
              width: 34, height: 34,
              borderRadius:  "50%",
              border:        "1px solid rgba(70,174,34,0.35)",
              display:       "inline-flex",
              alignItems:    "center",
              justifyContent:"center",
              fontSize:      "0.9rem",
              color:         "var(--teal, #46ae22)",
              flexShrink:    0,
              transition:    "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            }}
            aria-hidden="true"
          >
            ↗
          </span>
        </div>
      </div>

      {/* Bottom edge teal line (scale in on hover via CSS) */}
      <div
        className="dbl-edge"
        style={{
          position:        "absolute", bottom: 0, left: 0, right: 0,
          height:          "2px",
          background:      "linear-gradient(90deg, transparent, rgba(70,174,34,0.7), transparent)",
          transform:       "scaleX(0)",
          transition:      "transform 0.35s cubic-bezier(.22,1,.36,1)",
          pointerEvents:   "none",
        }}
        aria-hidden="true"
      />
    </a>
  );
}

/* ── List ─────────────────────────────────────────────────────── */
export default function DarkBlogList({
  posts,
  basePath,
  locale,
}: {
  posts?: Post[];
  basePath: string;
  locale?: string;
}) {
  const list = posts && posts.length ? posts : FALLBACK;
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dbl-head", { y: 60, opacity: 0, duration: 1, ease: "power4.out" });
      gsap.from(".dbl-card", {
        y: 60, opacity: 0, scale: 0.97,
        stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".dbl-grid", start: "top 86%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .dbl-card:hover .dbl-thumb { transform: scale(1.06); filter: brightness(0.8) saturate(1); }
        .dbl-card:hover .dbl-title { color: var(--teal, #46ae22) !important; }
        .dbl-card:hover .dbl-arrow { background: rgba(70,174,34,0.18); border-color: rgba(70,174,34,0.7); transform: rotate(12deg); }
        .dbl-card:hover .dbl-edge  { transform: scaleX(1); }
      `}</style>

      <section ref={rootRef} className="section-py wrap">
        {/* Heading */}
        <div className="mb-[clamp(2.5rem,5vw,5rem)]">
          <p
            className="dbl-head eyebrow mb-4"
            style={{ color: "var(--teal)" }}
          >
            Latest thinking
          </p>
          <h1
            className="dbl-head hed"
            style={{ fontSize: "clamp(3rem,8vw,7rem)", lineHeight: 0.88 }}
          >
            Our<br />
            <span style={{ color: "var(--teal)" }}>Blog</span>
          </h1>
        </div>

        {/* Grid — perspective wrapper per cell so cards pop independently */}
        <div
          className="dbl-grid"
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px,30vw,400px),1fr))",
            gap:                 "clamp(1rem,2vw,1.75rem)",
          }}
        >
          {list.map((post) => {
            const href = locale
              ? `/${locale}${basePath}/${post.slug}`
              : `${basePath}/${post.slug}`;
            return (
              <div key={post.id} style={{ perspective: "1200px" }}>
                <BlogCard post={post} href={href} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
