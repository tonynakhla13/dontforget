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
  { id: "1", slug: "branding-mistakes",  title: "5 branding mistakes that are costing you clients",         tags: ["Branding"],  coverImage: null, excerpt: null },
  { id: "2", slug: "web-performance",    title: "Why your website speed is your most important metric",     tags: ["Web"],       coverImage: null, excerpt: null },
  { id: "3", slug: "design-systems",     title: "What a design system actually saves you",                  tags: ["Design"],    coverImage: null, excerpt: null },
  { id: "4", slug: "seo-in-2026",        title: "SEO in 2026: what still works and what doesn't",           tags: ["Strategy"],  coverImage: null, excerpt: null },
  { id: "5", slug: "conversion-copy",    title: "Writing copy that converts without being pushy",            tags: ["Content"],   coverImage: null, excerpt: null },
  { id: "6", slug: "gsap-animations",    title: "How we use GSAP to make interfaces feel alive",             tags: ["Dev"],       coverImage: null, excerpt: null },
];

function CardPlaceholder() {
  return (
    <svg width="50%" viewBox="0 0 120 80" fill="none" aria-hidden="true">
      <rect width="120" height="80" rx="8" fill="rgba(255,255,255,0.04)" />
      <rect x="10" y="10" width="100" height="12" rx="6" fill="rgba(20,184,166,0.2)" />
      <rect x="10" y="30" width="72" height="8"  rx="4" fill="rgba(20,184,166,0.12)" />
      <rect x="10" y="46" width="88" height="8"  rx="4" fill="rgba(20,184,166,0.12)" />
      <rect x="10" y="62" width="56" height="8"  rx="4" fill="rgba(20,184,166,0.12)" />
    </svg>
  );
}

export default function DarkBlogList({ posts, basePath }: { posts?: Post[]; basePath: string }) {
  const list = posts && posts.length ? posts : FALLBACK;
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dbl-head", { y: 60, opacity: 0, duration: 1, ease: "power4.out" });
      gsap.from(".dbl-card", {
        y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".dbl-grid", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section-py wrap">
      {/* Heading */}
      <div className="mb-14">
        <p className="eyebrow mb-4 dbl-head">Latest thinking</p>
        <h1 className="hed text-[clamp(3rem,8vw,7rem)] leading-[0.88] dbl-head">
          Our<br />
          <span className="text-[var(--teal)]">Blog</span>
        </h1>
      </div>

      {/* Grid */}
      <div className="dbl-grid grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <a
            key={post.id}
            href={`${basePath}/${post.slug}`}
            className="dbl-card group flex flex-col gap-4 no-underline"
          >
            {/* Thumbnail */}
            <div
              className="relative overflow-hidden rounded-2xl bg-[var(--surface)] flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5"
              style={{
                height: "clamp(180px, 22vw, 320px)",
                backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!post.coverImage && <CardPlaceholder />}
              {/* Teal overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-[var(--teal)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>

            {/* Tag */}
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--teal)]">
              {post.tags[0] ?? "Post"}
            </span>

            {/* Title */}
            <h2 className="hed text-[clamp(1rem,1.6vw,1.5rem)] leading-[1.15] text-[var(--fg)] group-hover:text-[var(--teal)] transition-colors duration-200">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-[0.875rem] leading-[1.8] text-[var(--body)] line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Read more */}
            <span className="mt-auto flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--body)] group-hover:text-[var(--teal)] transition-colors duration-200">
              Read more
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-current text-sm transition-transform duration-200 group-hover:translate-x-1">
                ↗
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
