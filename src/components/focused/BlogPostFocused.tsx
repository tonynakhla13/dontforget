"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { NoxNavbar, NoxFooter, NoxCTABar, TK, SANS } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function fmt(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(d));
}

function readingMins(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function toId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function nodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in (node as object))
    return nodeText((node as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

function extractToc(content: string) {
  return [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map(m => ({
    level:  m[1].length as 2 | 3,
    text:   m[2].trim(),
    id:     toId(m[2].trim()),
  }));
}

/* ─────────────────────────────────────────────────────────────────
   Markdown component overrides  (add id attrs to headings)
───────────────────────────────────────────────────────────────── */
function makeComponents(proseClass: string): Components {
  return {
    h2: ({ children, ...p }) => {
      const id = toId(nodeText(children));
      return <h2 id={id} className={`${proseClass}__h2`} {...p}>{children}</h2>;
    },
    h3: ({ children, ...p }) => {
      const id = toId(nodeText(children));
      return <h3 id={id} className={`${proseClass}__h3`} {...p}>{children}</h3>;
    },
  };
}

/* ─────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────── */
export default function BlogPostFocused({ post, locale = "en" }: { post: FullPost; locale?: string }) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const [progress, setProgress]  = useState(0);
  const [activeId, setActiveId]  = useState("");

  const toc  = useMemo(() => extractToc(post.content), [post.content]);
  const mins = readingMins(post.content);
  const date = fmt(post.publishedAt);

  /* ── scroll progress bar ── */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setProgress(d.scrollHeight - d.clientHeight > 0
        ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100
        : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── TOC active heading via IntersectionObserver ── */
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting);
        if (vis.length) setActiveId(vis[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    toc.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".bpf-back",      { x: -20, opacity: 0, duration: 0.45 }, 0)
        .from(".bpf-tags-row",  { y: 14,  opacity: 0, duration: 0.45 }, 0.12)
        .from(".bpf-h1 .bpf-word", { y: "110%", duration: 0.75, stagger: 0.04, ease: "power3.out" }, 0.22)
        .from(".bpf-excerpt",   { y: 22,  opacity: 0, duration: 0.55 }, 0.55)
        .from(".bpf-metabar",   { y: 14,  opacity: 0, duration: 0.45 }, 0.66)
        .from(".bpf-scroll-hint",{ opacity: 0, duration: 0.6 }, 1.1);

      gsap.from(".bpf-prose-col", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".bpf-body", start: "top 88%", once: true },
      });
      gsap.from(".bpf-toc-col", {
        y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".bpf-body", start: "top 84%", once: true },
      });
      gsap.from(".bpf-cta", {
        y: 28, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".bpf-cta", start: "top 88%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ── JSON-LD structured data ── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.content.substring(0, 155),
    ...(post.coverImage && { image: post.coverImage }),
    ...(post.publishedAt && { datePublished: new Date(post.publishedAt).toISOString() }),
    author:    { "@type": "Organization", name: "NOX Studio" },
    publisher: { "@type": "Organization", name: "NOX Studio",
      logo: { "@type": "ImageObject", url: "/nox-mesh-logo.svg" } },
    keywords: post.tags.join(", "),
  };

  /* ── word-split for title ── */
  const titleWords = post.title.split(" ");

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS, overflowX: "clip" }}>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Reading progress bar ── */}
      <div aria-hidden style={{
        position:   "fixed",
        top:        0, left: 0,
        width:      `${progress}%`,
        height:     3,
        background: TK.green,
        zIndex:     9999,
        transformOrigin: "left",
        transition: "width 80ms linear",
        boxShadow:  `0 0 12px ${TK.green}`,
      }} />

      <NoxNavbar active="blog" />

      {/* ══════════════════════════════════════════════════
          HERO — full-bleed image with title overlaid
      ══════════════════════════════════════════════════ */}
      <section style={{
        position:        "relative",
        minHeight:       "90dvh",
        display:         "flex",
        flexDirection:   "column",
        justifyContent:  "flex-end",
        overflow:        "hidden",
      }}>

        {/* Cover image or grid-pattern fallback */}
        {post.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                position:   "absolute", inset: 0,
                width:      "100%", height: "100%",
                objectFit:  "cover",
                objectPosition: "center 30%",
                zIndex:     0,
                filter:     "saturate(0.72) brightness(0.55)",
              }}
            />
            {/* Gradient — dark at bottom so text is readable */}
            <div aria-hidden style={{
              position:   "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to top, rgba(4,12,5,1) 0%, rgba(4,12,5,0.88) 30%, rgba(4,12,5,0.35) 65%, rgba(4,12,5,0.08) 100%)",
            }} />
          </>
        ) : (
          /* No cover — dark grid pattern */
          <div aria-hidden style={{
            position:        "absolute", inset: 0, zIndex: 0,
            backgroundImage: `linear-gradient(rgba(70,209,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(70,209,42,0.06) 1px, transparent 1px)`,
            backgroundSize:  "48px 48px",
          }} />
        )}

        {/* Hero content */}
        <div style={{
          position:   "relative", zIndex: 2,
          padding:    "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(2.5rem, 4vw, 4rem)",
          maxWidth:   1100,
        }}>

          {/* Back + eyebrow row */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "clamp(1.5rem, 3vw, 3rem)" }}>
            <Link
              href={`/${locale}/focused/blog`}
              className="bpf-back"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            6,
                fontFamily:     SANS,
                fontSize:       "clamp(0.65rem, 0.82vw, 0.82rem)",
                letterSpacing:  "0.22em",
                textTransform:  "uppercase",
                color:          TK.green,
                textDecoration: "none",
                opacity:        0.75,
                transition:     "opacity 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
            >← All posts</Link>
            <span style={{ width: 1, height: "1em", background: TK.line, flexShrink: 0 }} />
            <span style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.62rem, 0.78vw, 0.78rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.5,
            }}>/ our blog</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="bpf-tags-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "clamp(1rem, 1.8vw, 1.8rem)" }}>
              {post.tags.map(t => (
                <span key={t} style={{
                  fontFamily:    SANS,
                  fontSize:      "clamp(0.6rem, 0.76vw, 0.76rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         TK.green,
                  background:    "rgba(70,174,34,0.14)",
                  border:        "1px solid rgba(70,174,34,0.4)",
                  padding:       "3px 12px",
                }}>{t}</span>
              ))}
            </div>
          )}

          {/* Title — word-split for animation */}
          <h1
            className="bpf-h1"
            style={{
              fontFamily:    SANS,
              fontWeight:    700,
              fontSize:      "clamp(2.8rem, 7vw, 8rem)",
              lineHeight:    0.95,
              letterSpacing: "-0.025em",
              color:         TK.paper,
              margin:        "0 0 clamp(1.2rem, 2vw, 2rem)",
              maxWidth:      "18ch",
              overflow:      "hidden",
            }}
          >
            {titleWords.map((w, i) => (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.28em" }}>
                <span className="bpf-word" style={{ display: "inline-block" }}>{w}</span>
              </span>
            ))}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="bpf-excerpt" style={{
              fontFamily: SANS,
              fontSize:   "clamp(1rem, 1.6vw, 1.55rem)",
              lineHeight: 1.55,
              color:      TK.green,
              opacity:    0.82,
              maxWidth:   "58ch",
              margin:     "0 0 clamp(1.5rem, 2.5vw, 2.5rem)",
            }}>{post.excerpt}</p>
          )}

          {/* Meta bar */}
          <div className="bpf-metabar" style={{
            display:    "flex",
            alignItems: "center",
            gap:        "clamp(1rem, 2vw, 2rem)",
            flexWrap:   "wrap",
          }}>
            <span style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.68rem, 0.84vw, 0.84rem)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.72,
            }}>
              {mins} min read
            </span>
            {date && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: TK.green, opacity: 0.45, flexShrink: 0 }} />
                <span style={{
                  fontFamily:    SANS,
                  fontSize:      "clamp(0.68rem, 0.84vw, 0.84rem)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         TK.green,
                  opacity:       0.55,
                }}>{date}</span>
              </>
            )}
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: TK.green, opacity: 0.45, flexShrink: 0 }} />
            <span style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.68rem, 0.84vw, 0.84rem)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.55,
            }}>NOX Studio</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="bpf-scroll-hint" aria-hidden style={{
          position:   "absolute",
          bottom:     "clamp(1.5rem, 3vw, 2.5rem)",
          right:      "clamp(1.5rem, 4vw, 3.5rem)",
          zIndex:     2,
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          gap:        6,
          opacity:    0.45,
        }}>
          <span style={{ fontFamily: SANS, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: TK.green }}>scroll</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${TK.green}, transparent)` }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BODY — prose + TOC sidebar
      ══════════════════════════════════════════════════ */}
      <section style={{
        background:      "rgba(70,174,34,0.028)",
        backgroundImage: "linear-gradient(rgba(70,209,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(70,209,42,0.045) 1px, transparent 1px)",
        backgroundSize:  "52px 52px",
        borderTop:       "1px solid rgba(70,174,34,0.14)",
        borderBottom:    "1px solid rgba(70,174,34,0.14)",
      }}>
      <div
        className="bpf-body"
        style={{
          display:             "grid",
          gridTemplateColumns: toc.length > 2 ? "1fr 260px" : "1fr",
          gap:                 "clamp(2rem, 4vw, 5rem)",
          maxWidth:            1200,
          margin:              "0 auto",
          padding:             "clamp(3rem, 6vw, 7rem) clamp(1.5rem, 4vw, 3.5rem) clamp(4rem, 8vw, 8rem)",
          alignItems:          "start",
          boxSizing:           "border-box",
        }}
      >
        {/* ── Prose ── */}
        <article
          className="bpf-prose-col"
          style={{
            background:     "rgba(4, 14, 6, 0.96)",
            border:         "1px solid rgba(70,174,34,0.16)",
            borderLeft:     "3px solid rgba(70,174,34,0.6)",
            padding:        "clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3.5vw, 3.5rem)",
            boxSizing:      "border-box",
            backdropFilter: "blur(8px)",
          }}
        >
          <style>{`
            /* ── Reset inherited opacity from parent ── */
            .bpf-prose-col { color: ${TK.green}; }

            /* ── Drop cap on first paragraph ── */
            .bpf-prose-col > p:first-child::first-letter {
              font-size: 4.8em;
              font-weight: 700;
              float: left;
              line-height: 0.78;
              padding-right: 0.12em;
              padding-top: 0.06em;
              color: ${TK.paper};
            }

            /* ── Paragraphs ── */
            .bpf-prose-col p {
              font-family: ${SANS};
              font-size: clamp(1.05rem, 1.3vw, 1.28rem);
              line-height: 1.82;
              color: rgba(255,255,255,0.78);
              margin: 0 0 1.55em;
            }

            /* ── H2 ── */
            .bpf-prose-col h2, .bpf-prose-col .bpf-prose-col__h2 {
              font-family: ${SANS};
              font-weight: 700;
              font-size: clamp(1.6rem, 2.6vw, 2.6rem);
              line-height: 1.08;
              letter-spacing: -0.015em;
              color: ${TK.paper};
              margin: 3em 0 0.75em;
              padding-top: 0.1em;
            }

            /* Green accent bar left of h2 */
            .bpf-prose-col h2::before {
              content: "";
              display: inline-block;
              width: 4px;
              height: 0.9em;
              background: ${TK.green};
              margin-right: 0.55em;
              vertical-align: middle;
              flex-shrink: 0;
              position: relative;
              top: -0.06em;
            }

            /* ── H3 ── */
            .bpf-prose-col h3, .bpf-prose-col .bpf-prose-col__h3 {
              font-family: ${SANS};
              font-weight: 700;
              font-size: clamp(1.15rem, 1.7vw, 1.65rem);
              line-height: 1.18;
              color: ${TK.paper};
              margin: 2.2em 0 0.6em;
            }

            /* ── Lists ── */
            .bpf-prose-col ul, .bpf-prose-col ol {
              font-family: ${SANS};
              font-size: clamp(1.02rem, 1.25vw, 1.22rem);
              line-height: 1.78;
              color: rgba(255,255,255,0.74);
              margin: 0 0 1.5em;
              padding-left: 1.5em;
            }
            .bpf-prose-col li { margin-bottom: 0.45em; }
            .bpf-prose-col li::marker { color: ${TK.green}; }

            /* ── Strong / em ── */
            .bpf-prose-col strong { color: ${TK.paper}; font-weight: 700; }
            .bpf-prose-col em     { color: ${TK.green}; font-style: italic; }

            /* ── Blockquote ── */
            .bpf-prose-col blockquote {
              border-left: 3px solid ${TK.green};
              background: rgba(70,174,34,0.06);
              margin: 2.2em 0;
              padding: 1.2em 1.6em;
            }
            .bpf-prose-col blockquote p {
              margin: 0;
              font-size: clamp(1.1rem, 1.5vw, 1.45rem);
              font-style: italic;
              color: ${TK.paper};
              opacity: 0.82;
              line-height: 1.6;
            }

            /* ── Links ── */
            .bpf-prose-col a {
              color: ${TK.green};
              text-decoration: underline;
              text-underline-offset: 4px;
              text-decoration-thickness: 1px;
            }
            .bpf-prose-col a:hover { color: ${TK.paper}; }

            /* ── Code ── */
            .bpf-prose-col code {
              font-size: 0.87em;
              background: rgba(70,174,34,0.1);
              color: ${TK.green};
              padding: 2px 7px;
              border: 1px solid rgba(70,174,34,0.22);
              border-radius: 2px;
            }
            .bpf-prose-col pre {
              background: rgba(70,174,34,0.06);
              border: 1px solid rgba(70,174,34,0.18);
              padding: 1.4em 1.6em;
              overflow-x: auto;
              margin: 2em 0;
            }
            .bpf-prose-col pre code { background: none; border: none; padding: 0; font-size: 0.9rem; }

            /* ── Horizontal rule ── */
            .bpf-prose-col hr {
              border: none;
              height: 1px;
              background: rgba(70,174,34,0.2);
              margin: 2.5em 0;
            }
          `}</style>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={makeComponents("bpf-prose-col")}
          >
            {post.content}
          </ReactMarkdown>

          {/* Tags footer */}
          {post.tags.length > 0 && (
            <div style={{
              borderTop:   `1px solid rgba(70,174,34,0.18)`,
              marginTop:   "clamp(2.5rem, 4vw, 4rem)",
              paddingTop:  "clamp(1.2rem, 2vw, 2rem)",
              display:     "flex",
              gap:         8,
              flexWrap:    "wrap",
              alignItems:  "center",
            }}>
              <span style={{
                fontFamily:    SANS,
                fontSize:      "clamp(0.6rem, 0.72vw, 0.72rem)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color:         TK.green,
                opacity:       0.45,
                marginRight:   4,
              }}>Filed under</span>
              {post.tags.map(t => (
                <span key={t} style={{
                  fontFamily:    SANS,
                  fontSize:      "clamp(0.62rem, 0.78vw, 0.78rem)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         TK.green,
                  background:    "rgba(70,174,34,0.1)",
                  border:        "1px solid rgba(70,174,34,0.3)",
                  padding:       "3px 12px",
                }}>{t}</span>
              ))}
            </div>
          )}
        </article>

        {/* ── TOC sidebar ── */}
        {toc.length > 2 && (
          <aside
            className="bpf-toc-col"
            style={{
              position:      "sticky",
              top:           "6rem",
              maxHeight:     "calc(100dvh - 8rem)",
              overflowY:     "auto",
              padding:       "clamp(1.2rem, 2vw, 1.8rem)",
              background:    "rgba(4,14,6,0.96)",
              border:        "1px solid rgba(70,174,34,0.16)",
              borderTop:     "2px solid rgba(70,174,34,0.55)",
              backdropFilter:"blur(8px)",
            }}
          >
            <p style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.6rem, 0.76vw, 0.76rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.5,
              margin:        "0 0 clamp(0.9rem, 1.4vw, 1.4rem)",
            }}>/ in this article</p>

            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {toc.map(h => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  style={{
                    display:        "block",
                    fontFamily:     SANS,
                    fontSize:       h.level === 2
                      ? "clamp(0.78rem, 0.94vw, 0.94rem)"
                      : "clamp(0.72rem, 0.86vw, 0.86rem)",
                    lineHeight:     1.45,
                    color:          activeId === h.id ? TK.paper : TK.green,
                    opacity:        activeId === h.id ? 1 : 0.52,
                    textDecoration: "none",
                    paddingLeft:    h.level === 3 ? "1.1em" : 0,
                    paddingTop:     "0.3em",
                    paddingBottom:  "0.3em",
                    borderLeft:     activeId === h.id
                      ? `2px solid ${TK.green}`
                      : "2px solid transparent",
                    paddingRight:   "0.5rem",
                    transition:     "color 180ms, opacity 180ms, border-color 180ms",
                  }}
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >{h.text}</a>
              ))}
            </nav>

            {/* Reading progress mini-bar */}
            <div style={{
              marginTop:   "clamp(1.5rem, 2.5vw, 2.5rem)",
              background:  "rgba(70,174,34,0.1)",
              height:      2,
              borderRadius:1,
              overflow:    "hidden",
            }}>
              <div style={{
                height:          "100%",
                width:           `${progress}%`,
                background:      TK.green,
                transition:      "width 100ms linear",
                borderRadius:    1,
              }} />
            </div>
            <p style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.58rem, 0.7vw, 0.7rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color:         TK.green,
              opacity:       0.38,
              margin:        "0.4rem 0 0",
            }}>{Math.round(progress)}% read</p>
          </aside>
        )}
      </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA bar
      ══════════════════════════════════════════════════ */}
      <div className="bpf-cta">
        <NoxCTABar label="Start a project" href={`/${locale}/focused/contact`} />
      </div>

      <NoxFooter />
    </div>
  );
}
