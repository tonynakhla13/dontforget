"use client";

import FocusedLayout, { C, TEKO, MONO } from "./FocusedLayout";

export type FocusedPost = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  coverImage: string | null;
  excerpt: string | null;
};

const FALLBACK: FocusedPost[] = [
  { id: "1", slug: "branding-mistakes", title: "5 branding mistakes that are costing you clients",    tags: ["Branding"], coverImage: null, excerpt: null },
  { id: "2", slug: "web-performance",   title: "Why your website speed is your most important metric", tags: ["Web"],      coverImage: null, excerpt: null },
  { id: "3", slug: "design-systems",    title: "What a design system actually saves you",              tags: ["Design"],   coverImage: null, excerpt: null },
  { id: "4", slug: "seo-in-2026",       title: "SEO in 2026: what still works and what doesn't",      tags: ["Strategy"], coverImage: null, excerpt: null },
  { id: "5", slug: "conversion-copy",   title: "Writing copy that converts without being pushy",       tags: ["Content"],  coverImage: null, excerpt: null },
  { id: "6", slug: "gsap-animations",   title: "How we use GSAP to make interfaces feel alive",        tags: ["Dev"],      coverImage: null, excerpt: null },
];

function ThumbPlaceholder() {
  return (
    <svg width="40%" viewBox="0 0 120 80" fill="none">
      <rect width="120" height="80" rx="8" fill={C.cream} />
      <rect x="10" y="10" width="100" height="12" rx="6" fill={C.green} opacity="0.35" />
      <rect x="10" y="30" width="72" height="8" rx="4" fill={C.green} opacity="0.25" />
      <rect x="10" y="46" width="88" height="8" rx="4" fill={C.green} opacity="0.25" />
      <rect x="10" y="62" width="56" height="8" rx="4" fill={C.green} opacity="0.25" />
    </svg>
  );
}

export default function BlogFocused({ posts = FALLBACK }: { posts?: FocusedPost[] }) {
  return (
    <FocusedLayout title="Our Latest Blog" activeNav="blog" animationClass="kbm-blog-content">

      <section className="kbm-blog-content" style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 8rem)",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2rem)",
      }}>
        {posts.map((post, i) => (
          <a key={post.id} href={`/blog/${post.slug}`} style={{
            display: "flex", flexDirection: "column", gap: 14,
            textDecoration: "none", cursor: "pointer",
          }}>
            {/* thumb */}
            <div style={{
              height: "clamp(160px, 22vw, 360px)",
              borderRadius: 40,
              backgroundColor: post.coverImage ? undefined : C.ph,
              backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
              backgroundSize: "cover", backgroundPosition: "center",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              transition: "transform .25s ease",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-6px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              {!post.coverImage && <ThumbPlaceholder />}
            </div>

            <div style={{ fontFamily: TEKO, fontWeight: 500, fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)", color: C.ink, paddingTop: 6, letterSpacing: "0.04em" }}>
              {post.tags[0] ?? "Post"}
            </div>
            <div style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1rem, 1.8vw, 1.7rem)", lineHeight: 1.1, color: C.ink }}>
              {post.title}
            </div>

            <span style={{
              display: "inline-flex", alignItems: "center", gap: 12, marginTop: 4,
              fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)",
              color: C.ink,
            }}>
              Explore Now{" "}
              <span style={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: C.yellow, color: C.ink,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, transition: "transform .2s",
              }}>↗</span>
            </span>
          </a>
        ))}
      </section>

    </FocusedLayout>
  );
}
