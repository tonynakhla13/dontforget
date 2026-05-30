"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

export type BlogPost = {
  id: string; slug: string; title: string;
  tags: string[]; coverImage: string | null;
  excerpt: string | null; publishedAt: Date | string | null;
};

function fmt(d: Date | string | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(d));
}

export default function CreativeBlogList({ posts, locale }: { posts: BlogPost[]; locale: string }) {
  /* ── Refs ── */
  const wrapRef  = useRef<HTMLDivElement>(null);   // position wrapper — lerp target
  const innerRef = useRef<HTMLDivElement>(null);   // inner card — opacity/scale
  const imgRef   = useRef<HTMLImageElement>(null);

  /* lerp state (mutable, not React state → no re-renders) */
  const cur  = useRef({ x: -1200, y: -1200 });
  const tgt  = useRef({ x: -1200, y: -1200 });
  const rafId = useRef(0);

  /* ── Continuous lerp loop (started once, runs for the component lifetime) ── */
  useEffect(() => {
    const LERP = 0.11; // lower = more lag / more cushion

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

  return (
    <div onMouseMove={handleMove}>

      {/* ══ Floating preview ═══════════════════════════════════════ */}
      {/* Outer: GPU transform only — no layout triggers */}
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
        {/* Inner: opacity + scale only — clean CSS transitions */}
        <div
          ref={innerRef}
          style={{
            width:           "clamp(200px, 18vw, 290px)",
            aspectRatio:     "4 / 3",
            overflow:        "hidden",
            /* Curved corners */
            borderRadius:    "14px",
            border:          "2px solid #231f20",
            boxShadow:       "6px 8px 0 #46D12A, 10px 14px 0 #231f20",
            background:      "#e9e9e9",
            opacity:         0,
            transform:       "scale(0.9)",
            transition:      "opacity 0.2s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src=""
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Lime corner pip */}
          <span style={{
            position:      "absolute",
            bottom:        0,
            right:         0,
            width:         24,
            height:        24,
            background:    "#46D12A",
            borderRadius:  "14px 0 14px 0",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* ══ Post rows ══════════════════════════════════════════════ */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map((post, i) => {
          const date = fmt(post.publishedAt);
          return (
            <Link
              key={post.id}
              href={`/${locale}/creative/blog/${post.slug}`}
              onMouseEnter={() => handleEnter(post.coverImage)}
              onMouseLeave={handleLeave}
              style={{
                display:             "grid",
                gridTemplateColumns: "clamp(40px,5vw,72px) 1fr clamp(80px,10vw,140px)",
                alignItems:          "start",
                gap:                 "clamp(20px,3vw,48px)",
                padding:             "clamp(28px,4vw,44px) 0",
                borderTop:           "1px solid rgba(35,31,32,.1)",
                textDecoration:      "none",
                position:            "relative",
                transition:          "background .18s, padding-left .18s, padding-right .18s, border-radius .18s",
              }}
              className="c-blog-row"
            >
              {/* Number */}
              <span style={{
                fontFamily:    "var(--c-f-display)",
                fontSize:      "clamp(14px,1.6vw,22px)",
                color:         "#46D12A",
                letterSpacing: ".04em",
                paddingTop:    4,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {post.tags.length > 0 && (
                  <span style={{
                    fontFamily:    "var(--c-f-ui)",
                    fontSize:      11,
                    letterSpacing: ".22em",
                    textTransform: "uppercase",
                    color:         "var(--c-ink)",
                    opacity:       .45,
                  }}>
                    {post.tags[0]}
                  </span>
                )}
                <h2 style={{
                  fontFamily:    "var(--c-f-display)",
                  fontWeight:    400,
                  fontSize:      "clamp(22px,3.2vw,52px)",
                  lineHeight:    .96,
                  letterSpacing: "-.025em",
                  color:         "var(--c-ink)",
                  margin:        0,
                }}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p style={{
                    fontFamily: "var(--c-f-body)",
                    fontSize:   "clamp(14px,1.1vw,16px)",
                    lineHeight: 1.6,
                    color:      "var(--c-ink)",
                    opacity:    .55,
                    margin:     0,
                    maxWidth:   600,
                  }}>
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Date + arrow */}
              <div style={{
                display:       "flex",
                flexDirection: "column",
                alignItems:    "flex-end",
                gap:           16,
                paddingTop:    4,
              }}>
                {date && (
                  <span style={{
                    fontFamily:    "var(--c-f-ui)",
                    fontSize:      11,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color:         "var(--c-ink)",
                    opacity:       .35,
                    whiteSpace:    "nowrap",
                  }}>
                    {date}
                  </span>
                )}
                <span
                  className="c-blog-row__arrow"
                  style={{
                    width: 38, height: 38,
                    borderRadius:   "50%",
                    border:         "1px solid var(--c-ink)",
                    display:        "inline-flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       14,
                    color:          "var(--c-ink)",
                    flexShrink:     0,
                  }}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </Link>
          );
        })}

        <div style={{ borderBottom: "1px solid rgba(35,31,32,.1)" }} />
      </div>

      <style>{`
        .creative-mode .c-blog-row:hover {
          background: rgba(70,209,42,.06);
          padding-left: 20px !important;
          padding-right: 20px !important;
          border-radius: 12px;
        }
        .creative-mode .c-blog-row:hover h2 { color: var(--c-ink) !important; }
        .creative-mode .c-blog-row__arrow {
          transition: background .18s, color .18s, transform .2s cubic-bezier(.34,1.56,.64,1) !important;
        }
        .creative-mode .c-blog-row:hover .c-blog-row__arrow {
          background: #46D12A;
          border-color: #231f20 !important;
          color: #231f20;
          transform: rotate(12deg);
        }
        @media (max-width: 768px) {
          .creative-mode .c-blog-row { grid-template-columns: 36px 1fr !important; }
          .creative-mode .c-blog-row > div:last-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
