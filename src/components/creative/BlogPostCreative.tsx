"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativeFooter from "@/components/creative/CreativeFooter";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   Types & helpers
───────────────────────────────────────────────────────────────── */
type FullPost = {
  id: string; slug: string; title: string;
  excerpt: string | null; content: string;
  tags: string[]; coverImage: string | null;
  heroImage: string | null;
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
export default function BlogPostCreative({ post, locale = "en" }: { post: FullPost; locale?: string }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  const toc     = useMemo(() => extractToc(post.content), [post.content]);
  const mins    = readingMins(post.content);
  const date    = fmt(post.publishedAt);
  const showToc = toc.length > 2;

  /* ── Reading progress bar ── */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setProgress(d.scrollHeight - d.clientHeight > 0
        ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── TOC: IntersectionObserver tracks active heading ── */
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

  /* ── GSAP hero entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Word-split the title for animation */
      const titleEl = rootRef.current?.querySelector<HTMLElement>(".c-bpc-hero__title");
      if (titleEl) {
        const raw = titleEl.textContent ?? "";
        titleEl.innerHTML = raw
          .split(" ")
          .map(w => `<span class="c-bpc-word"><span class="c-bpc-word__i">${w}</span></span>`)
          .join(" ");
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".c-bpc-hero__back",    { x: -24, opacity: 0, duration: 0.5 }, 0.05)
        .from(".c-bpc-hero__tags",    { y: 14, opacity: 0, duration: 0.45 }, 0.18)
        .from(".c-bpc-hero__title .c-bpc-word__i",
                                      { y: "110%", duration: 0.72, stagger: 0.058 }, 0.28)
        .from(".c-bpc-hero__excerpt", { y: 22, opacity: 0, duration: 0.55 }, 0.62)
        .from(".c-bpc-hero__meta",    { y: 14, opacity: 0, duration: 0.45 }, 0.72);

      /* Portrait image entrance */
      gsap.from(".c-bpc-hero__portrait", {
        x: 60, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.35,
      });

      /* Decorative elements stagger */
      gsap.from(".c-bpc-deco-el", {
        opacity: 0, scale: 0.7, duration: 1.4, ease: "power3.out",
        stagger: 0.15, delay: 0.2,
      });

      gsap.from(".c-bpc-article", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".c-bpc-body", start: "top 88%", once: true },
      });
      if (showToc) {
        gsap.from(".c-bpc-toc", {
          y: 28, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".c-bpc-body", start: "top 84%", once: true },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [showToc]);

  /* ── JSON-LD structured data ── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:    post.title,
    description: post.excerpt ?? post.content.substring(0, 155),
    ...(post.coverImage  && { image: post.coverImage }),
    ...(post.publishedAt && { datePublished: new Date(post.publishedAt).toISOString() }),
    author:    { "@type": "Organization", name: "NOX Studio" },
    publisher: { "@type": "Organization", name: "NOX Studio",
      logo: { "@type": "ImageObject", url: "/nox-mesh-logo.svg" } },
    keywords: post.tags.join(", "),
  };

  return (
    <div ref={rootRef}>
      {/* ── Structured data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Reading progress bar ── */}
      <div aria-hidden className="c-bpc-progress" style={{ width: `${progress}%` }} />

      <CreativeNavbar />

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="c-bpc-hero">
        {/* ── Cover image (if set) ── */}
        {post.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" className="c-bpc-hero__img" aria-hidden="true" />
            <div className="c-bpc-hero__overlay" aria-hidden="true" />
          </>
        ) : (
          <div className="c-bpc-hero__no-img" aria-hidden="true" />
        )}

        {/* ── Decorative background layer ── */}
        <div className="c-bpc-hero__deco" aria-hidden="true">
          {/* Big star — top right */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creative/star.svg"
            alt=""
            className="c-bpc-deco-el c-bpc-deco__star c-bpc-deco__star--main"
          />
          {/* Asterisk glyph — bottom left */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creative/asterisk.svg"
            alt=""
            className="c-bpc-deco-el c-bpc-deco__asterisk"
          />
          {/* Lime outline rings */}
          <span className="c-bpc-deco-el c-bpc-deco__ring c-bpc-deco__ring--a" />
          <span className="c-bpc-deco-el c-bpc-deco__ring c-bpc-deco__ring--b" />
          {/* Small scattered star */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creative/star.svg"
            alt=""
            className="c-bpc-deco-el c-bpc-deco__star c-bpc-deco__star--sm"
          />
          {/* Lime dot cluster */}
          <span className="c-bpc-deco-el c-bpc-deco__dots" />
        </div>

        {/* ── Portrait image (philosopher) ── */}
        {post.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage}
            alt=""
            className="c-bpc-hero__portrait"
            aria-hidden="true"
          />
        )}

        <div className="c-bpc-hero__inner">
          <Link href={`/${locale}/creative/blog`} className="c-bpc-hero__back">
            ← All Posts
          </Link>

          {post.tags.length > 0 && (
            <div className="c-bpc-hero__tags">
              {post.tags.map(t => <span key={t} className="c-bpc-hero__tag">{t}</span>)}
            </div>
          )}

          <h1 className="c-bpc-hero__title">{post.title}</h1>

          {post.excerpt && (
            <p className="c-bpc-hero__excerpt">{post.excerpt}</p>
          )}

          <div className="c-bpc-hero__meta">
            <span className="c-bpc-hero__meta-item">{mins} min read</span>
            {date && (
              <>
                <span className="c-bpc-hero__divider" aria-hidden="true" />
                <span className="c-bpc-hero__meta-item">{date}</span>
              </>
            )}
            <span className="c-bpc-hero__divider" aria-hidden="true" />
            <span className="c-bpc-hero__meta-item">NOX Studio</span>
          </div>
        </div>
      </section>

      {/* ══ BODY ════════════════════════════════════════════════ */}
      <section className="c-bpc-body">
        <div className={`c-bpc-grid${showToc ? "" : " c-bpc-grid--no-toc"}`}>

          {/* ── Prose ── */}
          <article className="c-bpc-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.content}
            </ReactMarkdown>

            {post.tags.length > 0 && (
              <div className="c-bpc-tags-foot">
                <span style={{
                  fontFamily: "var(--c-f-ui)", fontSize: 11, letterSpacing: ".18em",
                  textTransform: "uppercase", color: "var(--c-gray)", marginRight: 4,
                }}>Filed under</span>
                {post.tags.map(t => <span key={t} className="c-bpc-tag-pill">{t}</span>)}
              </div>
            )}
          </article>

          {/* ── TOC ── */}
          {showToc && (
            <aside className="c-bpc-toc">
              <span className="c-bpc-toc__label">/ In this article</span>
              <nav className="c-bpc-toc__nav" aria-label="Table of contents">
                {toc.map(h => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={[
                      "c-bpc-toc__link",
                      h.level === 3 ? "c-bpc-toc__link--h3" : "",
                      activeId === h.id ? "c-bpc-toc__link--active" : "",
                    ].join(" ").trim()}
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
              <div className="c-bpc-toc__prog">
                <div className="c-bpc-toc__prog-bar" style={{ width: `${progress}%` }} />
              </div>
              <span className="c-bpc-toc__pct">{Math.round(progress)}% read</span>
            </aside>
          )}
        </div>
      </section>

      {/* ══ CTA STRIP ═══════════════════════════════════════════ */}
      <section className="c-svc-cta">
        <div className="c-svc-cta__bg" aria-hidden="true" />
        <span className="c-svc-cta__eyebrow">Ready to start?</span>
        <h2 className="c-svc-cta__title">Let&apos;s make it hard to forget.</h2>
        <div>
          <Link href={`/${locale}/creative/contact`} className="c-btn c-btn--ink">
            Start a project →
          </Link>
        </div>
      </section>

      <CreativeFooter />
    </div>
  );
}
