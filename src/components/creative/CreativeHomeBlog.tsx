"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type HomeBlogPost = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
};

const FALLBACK: HomeBlogPost[] = [
  { id: "1", slug: "branding-mistakes",  title: "5 branding mistakes that are costing you clients",      tags: ["Branding"], excerpt: null, coverImage: null, publishedAt: null },
  { id: "2", slug: "web-performance",    title: "Why your website speed is your most important metric",  tags: ["Web"],      excerpt: null, coverImage: null, publishedAt: null },
  { id: "3", slug: "design-systems",     title: "What a design system actually saves you",               tags: ["Design"],   excerpt: null, coverImage: null, publishedAt: null },
];

function fmt(d: Date | string | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(d));
}

export default function CreativeHomeBlog({
  posts,
  locale = "en",
}: {
  posts?: HomeBlogPost[];
  locale?: string;
}) {
  const list = posts?.length ? posts.slice(0, 3) : FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Floating preview refs ── */
  const wrapRef  = useRef<HTMLDivElement>(null);   // GPU transform only
  const innerRef = useRef<HTMLDivElement>(null);   // opacity + scale
  const imgRef   = useRef<HTMLImageElement>(null);

  /* lerp state — mutable refs, no re-renders */
  const cur   = useRef({ x: -1200, y: -1200 });
  const tgt   = useRef({ x: -1200, y: -1200 });
  const rafId = useRef(0);

  /* ── Continuous lerp loop ── */
  useEffect(() => {
    const LERP = 0.11;

    function tick() {
      const dx = tgt.current.x - cur.current.x;
      const dy = tgt.current.y - cur.current.y;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        cur.current.x += dx * LERP;
        cur.current.y += dy * LERP;

        if (wrapRef.current) {
          wrapRef.current.style.transform =
            `translate(${cur.current.x}px, ${cur.current.y}px) rotate(2deg)`;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Mouse handlers ── */
  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const h = wrapRef.current?.offsetHeight ?? 180;
    tgt.current = { x: e.clientX + 28, y: e.clientY - h / 2 };
  }

  function handleEnter(coverImage: string | null) {
    const inner = innerRef.current;
    const img   = imgRef.current;
    if (!inner || !coverImage) return;
    if (img) img.src = coverImage;
    inner.style.opacity   = "1";
    inner.style.transform = "scale(1)";
  }

  function handleLeave() {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.opacity   = "0";
    inner.style.transform = "scale(0.9)";
  }

  /* ── GSAP scroll entrance ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hb-head]", {
        y: 70,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 82%" },
      });

      gsap.from("[data-hb-row]", {
        x: -50,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.13,
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ══ Floating preview (fixed, outside section) ══════════════ */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position:      "fixed",
          left:          0,
          top:           0,
          transform:     "translate(-1200px, -1200px) rotate(2deg)",
          pointerEvents: "none",
          zIndex:        9999,
          willChange:    "transform",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width:        "clamp(200px, 18vw, 290px)",
            aspectRatio:  "4 / 3",
            overflow:     "hidden",
            borderRadius: "14px",
            border:       "2px solid #231f20",
            boxShadow:    "6px 8px 0 #46D12A, 10px 14px 0 #231f20",
            background:   "#e9e9e9",
            opacity:      0,
            transform:    "scale(0.9)",
            transition:   "opacity 0.2s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Lime corner pip */}
          <span style={{
            position:     "absolute",
            bottom:       0,
            right:        0,
            width:        24,
            height:       24,
            background:   "#46D12A",
            borderRadius: "14px 0 14px 0",
            pointerEvents:"none",
          }} />
        </div>
      </div>

      {/* ══ Section ═══════════════════════════════════════════════ */}
      <section ref={sectionRef} className="c-hblog">

        {/* ── Heading row ── */}
        <div className="c-hblog__head" data-hb-head="">
          <div>
            <span className="c-hblog__eyebrow">/ Latest thinking</span>
            <h2 className="c-hblog__title">Blog</h2>
          </div>
          <Link href={`/${locale}/creative/blog`} className="c-btn c-btn--ink">
            Read all posts
            <span className="c-blink" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Post rows ── */}
        <div className="c-hblog__list" onMouseMove={handleMove}>
          {list.map((post, i) => {
            const date = fmt(post.publishedAt);
            return (
              <Link
                key={post.id}
                href={`/${locale}/creative/blog/${post.slug}`}
                className="c-hblog__row"
                data-hb-row=""
                onMouseEnter={() => handleEnter(post.coverImage)}
                onMouseLeave={handleLeave}
              >
                {/* Number */}
                <span className="c-hblog__num">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Tag + Title */}
                <div className="c-hblog__body">
                  {post.tags[0] && (
                    <span className="c-hblog__tag">{post.tags[0]}</span>
                  )}
                  <h3 className="c-hblog__post-title">{post.title}</h3>
                </div>

                {/* Date */}
                {date ? (
                  <span className="c-hblog__date">{date}</span>
                ) : (
                  <span />
                )}

                {/* Arrow */}
                <span className="c-hblog__arrow" aria-hidden="true">↗</span>
              </Link>
            );
          })}
          <div className="c-hblog__rule" />
        </div>

      </section>
    </>
  );
}
