"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import Navbar from "@/components/Navbar";
import ParticleLayer from "@/components/ParticleLayer";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   Types & helpers
───────────────────────────────────────────────────────────────── */
type FullPost = {
  id: string; slug: string; title: string;
  excerpt: string | null; content: string;
  tags: string[]; coverImage: string | null;
  publishedAt: Date | null;
};

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
    level: m[1].length as 2 | 3,
    text:  m[2].trim(),
    id:    toId(m[2].trim()),
  }));
}

/* ── ReactMarkdown overrides: inject heading ids for TOC ── */
const mdComponents: Components = {
  h2: ({ children, ...p }) => <h2 id={toId(nodeText(children))} {...p}>{children}</h2>,
  h3: ({ children, ...p }) => <h3 id={toId(nodeText(children))} {...p}>{children}</h3>,
};

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default function BlogPostImmersive({ post, locale = "en" }: { post: FullPost; locale?: string }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  const toc     = useMemo(() => extractToc(post.content), [post.content]);
  const mins    = readingMins(post.content);
  const date    = fmt(post.publishedAt);
  const showToc = toc.length > 2;

  /* ── Reading progress ── */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setProgress(d.scrollHeight - d.clientHeight > 0
        ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── TOC: IntersectionObserver ── */
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting);
        if (vis.length) setActiveId(vis[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    toc.forEach(h => { const el = document.getElementById(h.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [toc]);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Word-split the title */
      const titleEl = rootRef.current?.querySelector<HTMLElement>(".bpi-title");
      if (titleEl) {
        const raw = titleEl.textContent ?? "";
        titleEl.innerHTML = raw
          .split(" ")
          .map(w => `<span class="bpi-word"><span class="bpi-word-i">${w}</span></span>`)
          .join(" ");
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".bpi-back",       { x: -20, opacity: 0, duration: 0.45 }, 0)
        .from(".bpi-tags",       { y: 14, opacity: 0, duration: 0.45 }, 0.12)
        .from(".bpi-title .bpi-word-i",
                                 { y: "110%", duration: 0.72, stagger: 0.052 }, 0.22)
        .from(".bpi-excerpt",    { y: 22, opacity: 0, duration: 0.55 }, 0.58)
        .from(".bpi-meta",       { y: 14, opacity: 0, duration: 0.45 }, 0.68)
        .from(".bpi-scroll",     { opacity: 0, duration: 0.6 }, 1.1);

      gsap.from(".bpi-prose", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".bpi-body", start: "top 88%", once: true },
      });
      if (showToc) {
        gsap.from(".bpi-toc", {
          y: 28, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".bpi-body", start: "top 84%", once: true },
        });
      }
      gsap.from(".bpi-cta", {
        y: 28, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".bpi-cta", start: "top 88%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [showToc]);

  /* ── JSON-LD ── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:    post.title,
    description: post.excerpt ?? post.content.substring(0, 155),
    ...(post.coverImage  && { image: post.coverImage }),
    ...(post.publishedAt && { datePublished: new Date(post.publishedAt).toISOString() }),
    author:    { "@type": "Organization", name: "NOX Studio" },
    publisher: { "@type": "Organization", name: "NOX Studio",
      logo: { "@type": "ImageObject", url: "/immersive/nokx-studio-logo.svg" } },
    keywords: post.tags.join(", "),
  };

  return (
    <div ref={rootRef} className="relative overflow-x-clip" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      {/* ── Structured data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Reading progress bar ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] shadow-[0_0_12px_var(--teal)] transition-[width] duration-[80ms] linear"
        style={{ width: `${progress}%`, background: "var(--teal)" }}
      />

      {/* ── Background: particle mesh ── */}
      <ParticleLayer />

      <Navbar inner />

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative z-[1] flex min-h-[88dvh] flex-col justify-end overflow-hidden">
        {/* Cover image or fallback gradient */}
        {post.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%] saturate-[0.6] brightness-[0.4]"
              style={{ zIndex: 0 }}
            />
            {/* Gradient overlay — dark at bottom for text readability */}
            <div
              className="absolute inset-0"
              style={{
                zIndex: 1,
                background: "linear-gradient(to top, rgba(9,9,9,1) 0%, rgba(9,9,9,0.88) 28%, rgba(9,9,9,0.35) 62%, rgba(9,9,9,0.08) 100%)",
              }}
              aria-hidden="true"
            />
          </>
        ) : (
          /* No cover — dark gradient so particles show through */
          <div
            className="absolute inset-0"
            style={{
              zIndex: 0,
              background: "linear-gradient(to bottom, rgba(9,9,9,0.55) 0%, rgba(9,9,9,0.82) 100%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Hero content */}
        <div className="relative z-[2] wrap pb-[clamp(3rem,6vw,6rem)] pt-[clamp(6rem,9vw,9rem)]">
          {/* Back + eyebrow row */}
          <div className="mb-[clamp(1.8rem,3vw,3.5rem)] flex items-center gap-5">
            <Link
              href={`/${locale}/immersive/blog`}
              className="bpi-back inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--teal)] opacity-70 transition-opacity hover:opacity-100"
            >
              ← All Posts
            </Link>
            <span className="h-[1em] w-px flex-shrink-0 opacity-25" style={{ background: "var(--fg)" }} />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--body)]">
              / our blog
            </span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="bpi-tags mb-[clamp(1rem,1.8vw,2rem)] flex flex-wrap gap-2">
              {post.tags.map(t => (
                <span
                  key={t}
                  className="border px-3 py-[3px] font-mono text-[0.58rem] uppercase tracking-[0.22em]"
                  style={{
                    borderColor: "rgba(var(--teal-rgb),0.45)",
                    color: "var(--teal)",
                    background: "rgba(var(--teal-rgb),0.1)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="bpi-title hed mb-[clamp(1.2rem,2vw,2.2rem)] max-w-[18ch]"
            style={{ fontSize: "clamp(3rem,8vw,9.5rem)", lineHeight: 0.92, letterSpacing: "-0.03em" }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className="bpi-excerpt mb-[clamp(1.5rem,2.5vw,2.5rem)] max-w-[56ch] leading-[1.6]"
              style={{ fontSize: "clamp(1rem,1.5vw,1.45rem)", color: "var(--body)" }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Meta bar */}
          <div className="bpi-meta flex flex-wrap items-center gap-[clamp(1rem,2vw,2rem)]">
            {[
              `${mins} min read`,
              ...(date ? [date] : []),
              "NOX Studio",
            ].map((item, i, arr) => (
              <span key={i} className="flex items-center gap-[clamp(1rem,2vw,2rem)]">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--body)" }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span className="h-[3px] w-[3px] flex-shrink-0 rounded-full opacity-40" style={{ background: "var(--fg)" }} />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="bpi-scroll pointer-events-none absolute bottom-[clamp(1.5rem,3vw,2.5rem)] right-[clamp(1.5rem,4vw,3.5rem)] z-[2] flex flex-col items-center gap-[6px] opacity-40"
          aria-hidden="true"
        >
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: "var(--fg)" }}>scroll</span>
          <div className="w-px h-9" style={{ background: `linear-gradient(to bottom, var(--teal), transparent)` }} />
        </div>
      </section>

      {/* ══ BODY ════════════════════════════════════════════════ */}
      <section
        className="bpi-body relative z-[1]"
        style={{
          background: "rgba(9,9,9,0.85)",
          borderTop: "1px solid rgba(var(--teal-rgb),0.12)",
          borderBottom: "1px solid rgba(var(--teal-rgb),0.12)",
        }}
      >
        <div
          className="wrap py-[clamp(3.5rem,7vw,8rem)]"
          style={{
            display: "grid",
            gridTemplateColumns: showToc ? "1fr 260px" : "1fr",
            maxWidth: showToc ? 1200 : 860,
            gap: "clamp(2rem,4vw,5rem)",
            alignItems: "start",
          }}
        >
          {/* ── Prose ── */}
          <article
            className="bpi-prose"
            style={{
              background:     "rgba(17,17,17,0.96)",
              border:         "1px solid rgba(var(--teal-rgb),0.16)",
              borderLeft:     "3px solid rgba(var(--teal-rgb),0.55)",
              padding:        "clamp(2rem,4vw,4rem) clamp(1.5rem,3.5vw,3.5rem)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Inline prose styles */}
            <style>{`
              .bpi-prose { color: var(--fg); }
              .bpi-prose > p:first-of-type::first-letter {
                font-size: 5em; font-weight: 700;
                float: left; line-height: .76;
                padding-right: .12em; padding-top: .06em;
                color: var(--teal);
              }
              .bpi-prose p {
                font-size: clamp(1.05rem,1.3vw,1.28rem);
                line-height: 1.82;
                color: rgba(240,236,227,0.78);
                margin: 0 0 1.55em;
              }
              .bpi-prose h2 {
                font-weight: 700;
                font-size: clamp(1.6rem,2.5vw,2.5rem);
                line-height: 1.08; letter-spacing: -0.015em;
                color: var(--fg); margin: 3em 0 0.75em;
              }
              .bpi-prose h2::before {
                content: "";
                display: inline-block; width: 4px; height: 0.9em;
                background: var(--teal);
                margin-right: 0.55em; vertical-align: middle;
                position: relative; top: -0.06em;
              }
              .bpi-prose h3 {
                font-weight: 700;
                font-size: clamp(1.15rem,1.65vw,1.6rem);
                line-height: 1.18; color: var(--fg);
                margin: 2.2em 0 0.6em;
              }
              .bpi-prose ul, .bpi-prose ol {
                font-size: clamp(1rem,1.25vw,1.22rem);
                line-height: 1.78; color: rgba(240,236,227,0.74);
                margin: 0 0 1.5em; padding-left: 1.5em;
              }
              .bpi-prose li { margin-bottom: .45em; }
              .bpi-prose li::marker { color: var(--teal); }
              .bpi-prose strong { color: var(--fg); font-weight: 700; }
              .bpi-prose em     { color: var(--teal); font-style: italic; }
              .bpi-prose blockquote {
                border-left: 3px solid var(--teal);
                background: rgba(var(--teal-rgb),0.06);
                margin: 2.2em 0; padding: 1.2em 1.6em;
              }
              .bpi-prose blockquote p {
                margin: 0; font-size: clamp(1.1rem,1.45vw,1.42rem);
                font-style: italic; color: var(--fg); opacity: 0.82;
              }
              .bpi-prose a {
                color: var(--teal); text-decoration: underline;
                text-underline-offset: 4px; text-decoration-thickness: 1px;
              }
              .bpi-prose a:hover { color: var(--fg); }
              .bpi-prose code {
                font-size: .87em;
                background: rgba(var(--teal-rgb),0.1);
                color: var(--teal);
                padding: 2px 7px;
                border: 1px solid rgba(var(--teal-rgb),0.2);
              }
              .bpi-prose pre {
                background: rgba(var(--teal-rgb),0.05);
                border: 1px solid rgba(var(--teal-rgb),0.16);
                padding: 1.4em 1.6em; overflow-x: auto; margin: 2em 0;
              }
              .bpi-prose pre code { background: none; border: none; padding: 0; }
              .bpi-prose hr {
                border: none; height: 1px;
                background: rgba(var(--teal-rgb),0.18); margin: 2.5em 0;
              }
              .bpi-word { display: inline-block; overflow: hidden; vertical-align: bottom; margin-right: .28em; }
              .bpi-word-i { display: inline-block; }
            `}</style>

            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.content}
            </ReactMarkdown>

            {/* Tags footer */}
            {post.tags.length > 0 && (
              <div
                className="mt-[clamp(2.5rem,4vw,4rem)] flex flex-wrap items-center gap-2 pt-[clamp(1.2rem,2vw,2rem)]"
                style={{ borderTop: "1px solid rgba(var(--teal-rgb),0.16)" }}
              >
                <span
                  className="mr-1 font-mono text-[0.6rem] uppercase tracking-[0.24em]"
                  style={{ color: "var(--body)" }}
                >
                  Filed under
                </span>
                {post.tags.map(t => (
                  <span
                    key={t}
                    className="border px-3 py-[3px] font-mono text-[0.6rem] uppercase tracking-[0.2em]"
                    style={{
                      borderColor: "rgba(var(--teal-rgb),0.3)",
                      color: "var(--teal)",
                      background: "rgba(var(--teal-rgb),0.08)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* ── TOC ── */}
          {showToc && (
            <aside
              className="bpi-toc"
              style={{
                position:      "sticky",
                top:           "6rem",
                maxHeight:     "calc(100dvh - 8rem)",
                overflowY:     "auto",
                padding:       "clamp(1.2rem,2vw,1.8rem)",
                background:    "rgba(17,17,17,0.96)",
                border:        "1px solid rgba(var(--teal-rgb),0.16)",
                borderTop:     "2px solid rgba(var(--teal-rgb),0.5)",
                backdropFilter:"blur(8px)",
              }}
            >
              <p className="mb-[clamp(.8rem,1.4vw,1.4rem)] font-mono text-[0.58rem] uppercase tracking-[0.3em] opacity-50"
                style={{ color: "var(--teal)" }}>
                / in this article
              </p>

              <nav className="flex flex-col gap-0.5" aria-label="Table of contents">
                {toc.map(h => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block py-1.5 font-mono text-[0.75rem] leading-[1.45] transition-[color,opacity,border-color] duration-200"
                    style={{
                      paddingLeft:  h.level === 3 ? "1.2em" : "0.4em",
                      paddingRight: "0.5rem",
                      color:        activeId === h.id ? "var(--fg)" : "var(--teal)",
                      opacity:      activeId === h.id ? 1 : 0.45,
                      borderLeft:   `2px solid ${activeId === h.id ? "var(--teal)" : "transparent"}`,
                      fontSize:     h.level === 3 ? "0.7rem" : "0.75rem",
                    }}
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>

              {/* Mini progress */}
              <div
                className="mt-[clamp(1.5rem,2.5vw,2.5rem)] h-[2px] overflow-hidden rounded-sm"
                style={{ background: "rgba(var(--teal-rgb),0.1)" }}
              >
                <div
                  className="h-full rounded-sm transition-[width] duration-100 linear"
                  style={{ width: `${progress}%`, background: "var(--teal)" }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] opacity-35"
                style={{ color: "var(--teal)" }}>
                {Math.round(progress)}% read
              </p>
            </aside>
          )}
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════ */}
      <section
        className="bpi-cta relative z-[1]"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(var(--teal-rgb),0.12)" }}
      >
        <div className="wrap py-[clamp(4rem,8vw,8rem)]">
          <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: "var(--teal)" }}>
            Ready to start?
          </p>
          <h2 className="hed mb-8 max-w-[14ch] text-[clamp(2.5rem,6vw,7rem)] leading-[0.9] tracking-[-0.04em]">
            Let&apos;s make it<br />
            <span style={{ color: "var(--teal)" }}>hard to forget.</span>
          </h2>
          <Link href={`/${locale}/immersive/contact`} className="btn-glass inline-flex">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Start a project →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
