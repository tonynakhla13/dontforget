"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { NoxNavbar, NoxFooter, NoxPageIntro, TK, SANS } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type FocusedPost = {
  id:         string;
  slug:       string;
  title:      string;
  tags:       string[];
  coverImage: string | null;
  excerpt:    string | null;
};

const FALLBACK: FocusedPost[] = [
  { id: "1", slug: "website-vs-brand",    title: "A website is not a brand. Here's the difference.",          tags: ["Strategy"],  coverImage: null, excerpt: "Most founders confuse the two. Here's a fast way to know which one you're missing." },
  { id: "2", slug: "interface-feels-slow", title: "Why your interface feels slow (even when it isn't)",        tags: ["Dev"],        coverImage: null, excerpt: "Perceived speed is a design problem, not an engineering one." },
  { id: "3", slug: "first-impression",     title: "The 4 things clients notice before they read a word",       tags: ["Branding"],   coverImage: null, excerpt: "Color, hierarchy, whitespace, motion — in that order. Always." },
  { id: "4", slug: "naming-your-startup",  title: "How to name your startup without hating it in six months", tags: ["Naming"],     coverImage: null, excerpt: "The framework we use when clients can't agree on anything." },
  { id: "5", slug: "seo-for-agencies",     title: "SEO for agencies: stop writing and start building links",   tags: ["SEO"],        coverImage: null, excerpt: null },
  { id: "6", slug: "conversion-design",    title: "The three conversion levers that actually move the needle", tags: ["Conversion"], coverImage: null, excerpt: null },
];

export default function BlogFocused({ posts }: { posts?: FocusedPost[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const list    = posts ?? FALLBACK;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tk-blog-card", {
        y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-blog-grid", start: "top 78%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="blog" />

      <NoxPageIntro
        eyebrow="/ our blog"
        title="things we"
        italic="think about."
        lede="Insights on branding, web performance, design systems, SEO, and conversion from the NOX Studio team."
      />

      {/* ── Blog grid ── */}
      <section className="tk-blog-grid" style={{
        padding:             "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(5rem, 9vw, 10rem)",
        borderTop:           `1px solid ${TK.line}`,
        display:             "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap:                 "clamp(1.5rem, 3vw, 3rem)",
      }}>
        {list.map((post, i) => (
          <Link key={post.id}
            href={`/en/focused/blog/${post.slug}`}
            className="tk-blog-card"
            style={{ display: "block", textDecoration: "none" }}
          >
            {/* Cover */}
            <div style={{
              background:   TK.green,
              aspectRatio:  "4 / 3",
              marginBottom: 20,
              overflow:     "hidden",
              transition:   "filter 200ms ease, transform 300ms ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.filter = "brightness(1.1)";
              el.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.filter = "brightness(1)";
              el.style.transform = "translateY(0)";
            }}
            >
              {post.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            {/* Tag */}
            <p style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.65rem, 0.82vw, 0.82rem)",
              letterSpacing: "0.18em",
              color:         TK.green,
              textTransform: "uppercase",
              margin:        "0 0 8px",
              opacity:       0.72,
            }}>{post.tags[0]}</p>

            {/* Title */}
            <h2 style={{
              fontFamily:  SANS,
              fontWeight:  700,
              fontSize:    "clamp(1rem, 1.6vw, 1.5rem)",
              lineHeight:  1.25,
              color:       TK.paper,
              margin:      "0 0 10px",
              transition:  "color 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TK.green)}
            onMouseLeave={e => (e.currentTarget.style.color = TK.paper)}
            >{post.title}</h2>

            {post.excerpt && (
              <p style={{
                fontFamily: SANS,
                fontSize:   "clamp(0.78rem, 0.95vw, 0.95rem)",
                lineHeight: 1.55,
                color:      TK.green,
                margin:     0,
                opacity:    0.8,
              }}>{post.excerpt}</p>
            )}
          </Link>
        ))}
      </section>

      <NoxFooter />
    </div>
  );
}
