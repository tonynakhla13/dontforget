"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NoxNavbar, NoxFooter, TK, SANS } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type FullPost = {
  id:          string;
  slug:        string;
  title:       string;
  excerpt:     string | null;
  content:     string;
  tags:        string[];
  coverImage:  string | null;
  publishedAt: Date | null;
};

/* ── date formatter ──────────────────────────────────────────────── */
function fmt(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(d));
}

export default function BlogPostFocused({ post, locale = "en" }: { post: FullPost; locale?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".bpf-back",    { x: -24, opacity: 0, duration: 0.5 }, 0)
        .from(".bpf-tags",    { y: 16, opacity: 0, duration: 0.5 },  0.1)
        .from(".bpf-title",   { y: 64, opacity: 0, duration: 0.9 },  0.18)
        .from(".bpf-excerpt", { y: 28, opacity: 0, duration: 0.7 },  0.42)
        .from(".bpf-meta",    { y: 14, opacity: 0, duration: 0.5 },  0.54)
        .from(".bpf-cover",   { scale: 1.06, opacity: 0, duration: 1.1, ease: "power2.out" }, 0.3)
        .from(".bpf-divider", { scaleX: 0, duration: 0.7, ease: "power3.out", transformOrigin: "left" }, 0.65);

      // Prose scroll reveal
      gsap.from(".bpf-prose", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".bpf-prose", start: "top 88%", once: true },
      });

      // CTA reveal
      gsap.from(".bpf-cta-block", {
        y: 32, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".bpf-cta-block", start: "top 88%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const date = fmt(post.publishedAt);

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="blog" />

      {/* ── HERO ── */}
      <section style={{
        padding:   "clamp(5rem, 9vw, 10rem) clamp(1.5rem, 4vw, 3.5rem) clamp(3rem, 5vw, 5rem)",
        maxWidth:  "min(900px, 100%)",
        margin:    "0 auto",
        boxSizing: "border-box",
      }}>

        {/* Back link */}
        <Link
          href={`/${locale}/focused/blog`}
          className="bpf-back"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            fontFamily:     SANS,
            fontSize:        "clamp(0.72rem, 0.88vw, 0.88rem)",
            letterSpacing:  "0.14em",
            textTransform:  "uppercase",
            color:          TK.green,
            textDecoration: "none",
            marginBottom:   "clamp(2rem, 3.5vw, 3.5rem)",
            opacity:        0.7,
            transition:     "opacity 150ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
        >
          ← All Posts
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="bpf-tags" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "clamp(1rem, 1.8vw, 1.8rem)" }}>
            {post.tags.map((t) => (
              <span key={t} style={{
                fontFamily:    SANS,
                fontSize:      "clamp(0.62rem, 0.8vw, 0.8rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         TK.green,
                background:    "rgba(70,174,34,0.12)",
                border:        `1px solid rgba(70,174,34,0.35)`,
                padding:       "3px 10px",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="bpf-title"
          style={{
            fontFamily:   SANS,
            fontWeight:   700,
            fontSize:     "clamp(2.4rem, 6vw, 6.5rem)",
            lineHeight:   0.96,
            letterSpacing:"-0.02em",
            color:        TK.paper,
            margin:       "0 0 clamp(1.2rem, 2.2vw, 2.2rem)",
          }}
        >{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className="bpf-excerpt"
            style={{
              fontFamily: SANS,
              fontSize:   "clamp(1rem, 1.6vw, 1.6rem)",
              lineHeight: 1.5,
              color:      TK.green,
              opacity:    0.82,
              margin:     "0 0 clamp(1.2rem, 2vw, 2rem)",
            }}
          >{post.excerpt}</p>
        )}

        {/* Meta */}
        {date && (
          <p
            className="bpf-meta"
            style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.68rem, 0.82vw, 0.82rem)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.5,
              margin:        0,
            }}
          >Published {date}</p>
        )}
      </section>

      {/* ── COVER IMAGE ── */}
      {post.coverImage && (
        <div
          className="bpf-cover"
          style={{
            maxWidth:     "min(1100px, 100%)",
            margin:       "0 auto clamp(3rem, 5vw, 5rem)",
            padding:      "0 clamp(1.5rem, 4vw, 3.5rem)",
            boxSizing:    "border-box",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width:      "100%",
              display:    "block",
              aspectRatio:"16 / 7",
              objectFit:  "cover",
            }}
          />
        </div>
      )}

      {/* ── DIVIDER ── */}
      <div
        className="bpf-divider"
        style={{
          maxWidth:     "min(900px, 100%)",
          margin:       "0 auto clamp(2.5rem, 4vw, 4rem)",
          padding:      "0 clamp(1.5rem, 4vw, 3.5rem)",
          boxSizing:    "border-box",
        }}
      >
        <div style={{ height: 1, background: TK.line }} />
      </div>

      {/* ── PROSE ── */}
      <article
        className="bpf-prose"
        style={{
          maxWidth:  "min(740px, 100%)",
          margin:    "0 auto clamp(5rem, 9vw, 10rem)",
          padding:   "0 clamp(1.5rem, 4vw, 3.5rem)",
          boxSizing: "border-box",
        }}
      >
        <style>{`
          .bpf-prose p {
            font-family: ${SANS};
            font-size: clamp(1rem, 1.25vw, 1.22rem);
            line-height: 1.75;
            color: ${TK.green};
            opacity: 0.88;
            margin: 0 0 1.4em;
          }
          .bpf-prose h2 {
            font-family: ${SANS};
            font-weight: 700;
            font-size: clamp(1.5rem, 2.4vw, 2.4rem);
            line-height: 1.1;
            color: ${TK.paper};
            margin: 2.8em 0 0.7em;
            letter-spacing: -0.01em;
          }
          .bpf-prose h3 {
            font-family: ${SANS};
            font-weight: 700;
            font-size: clamp(1.15rem, 1.6vw, 1.6rem);
            line-height: 1.2;
            color: ${TK.paper};
            margin: 2em 0 0.6em;
          }
          .bpf-prose ul, .bpf-prose ol {
            font-family: ${SANS};
            font-size: clamp(1rem, 1.25vw, 1.22rem);
            line-height: 1.7;
            color: ${TK.green};
            opacity: 0.88;
            margin: 0 0 1.4em 1.2em;
            padding: 0;
          }
          .bpf-prose li { margin-bottom: 0.4em; }
          .bpf-prose li::marker { color: ${TK.green}; }
          .bpf-prose strong {
            color: ${TK.paper};
            font-weight: 700;
          }
          .bpf-prose em { color: ${TK.green}; }
          .bpf-prose blockquote {
            border-left: 3px solid ${TK.green};
            margin: 2em 0;
            padding: 0.6em 0 0.6em 1.5em;
          }
          .bpf-prose blockquote p { margin: 0; opacity: 0.7; font-style: italic; }
          .bpf-prose a { color: ${TK.green}; text-decoration: underline; text-underline-offset: 3px; }
          .bpf-prose a:hover { color: ${TK.paper}; }
          .bpf-prose code {
            font-size: 0.88em;
            background: rgba(70,174,34,0.12);
            color: ${TK.green};
            padding: 2px 6px;
            border: 1px solid rgba(70,174,34,0.25);
          }
          .bpf-prose pre {
            background: rgba(70,174,34,0.08);
            border: 1px solid rgba(70,174,34,0.2);
            padding: 1.2em 1.5em;
            overflow-x: auto;
            margin: 1.8em 0;
          }
          .bpf-prose pre code { background: none; border: none; padding: 0; }
        `}</style>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      {/* ── CTA / BACK ── */}
      <section
        className="bpf-cta-block"
        style={{
          borderTop:   `1px solid ${TK.line}`,
          borderBottom:`1px solid ${TK.line}`,
          padding:     "clamp(3rem, 5vw, 5rem) clamp(1.5rem, 4vw, 3.5rem)",
          display:     "flex",
          alignItems:  "center",
          justifyContent:"space-between",
          flexWrap:    "wrap",
          gap:         "1.5rem",
        }}
      >
        <div>
          <p style={{
            fontFamily:    SANS,
            fontSize:      "clamp(0.68rem, 0.82vw, 0.82rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         TK.green,
            opacity:       0.55,
            margin:        "0 0 0.4rem",
          }}>
            Ready to apply this?
          </p>
          <p style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize:   "clamp(1.4rem, 2.5vw, 2.5rem)",
            lineHeight: 1.1,
            color:      TK.paper,
            margin:     0,
          }}>
            Let&apos;s make it hard to forget.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href={`/${locale}/focused/blog`}
            style={{
              fontFamily:     SANS,
              fontSize:       "clamp(0.82rem, 1vw, 1rem)",
              letterSpacing:  "0.08em",
              color:          TK.green,
              textDecoration: "none",
              opacity:        0.7,
              transition:     "opacity 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
          >
            ← More posts
          </Link>
          <Link
            href={`/${locale}/focused/contact`}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            8,
              height:         "clamp(44px, 4.2vw, 54px)",
              padding:        "0 clamp(1.2rem, 2.5vw, 2.5rem)",
              background:     TK.green,
              color:          TK.paper,
              fontFamily:     SANS,
              fontWeight:     600,
              fontSize:       "clamp(0.82rem, 1vw, 1rem)",
              textDecoration: "none",
              transition:     "background 200ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#46d12a")}
            onMouseLeave={e => (e.currentTarget.style.background = TK.green)}
          >
            Start a project →
          </Link>
        </div>
      </section>

      <NoxFooter />
    </div>
  );
}
