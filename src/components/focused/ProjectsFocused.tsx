"use client";

import FocusedLayout, { C, TEKO, MONO } from "./FocusedLayout";

export type FocusedProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  coverImage: string | null;
};

const FALLBACK: FocusedProject[] = [
  { id: "1", slug: "elia-clinic",    title: "Elia Clinic",       category: "Healthcare",    description: null, coverImage: null },
  { id: "2", slug: "montgab",        title: "Montgab",           category: "E-Commerce",    description: null, coverImage: null },
  { id: "3", slug: "180-degrees",    title: "180 Degrees",       category: "Branding",      description: null, coverImage: null },
  { id: "4", slug: "launchpad",      title: "Launchpad",         category: "SaaS",          description: null, coverImage: null },
  { id: "5", slug: "nova-foods",     title: "Nova Foods",        category: "Developing",    description: null, coverImage: null },
  { id: "6", slug: "studio-drift",   title: "Studio Drift",      category: "Branding",      description: null, coverImage: null },
];

function ThumbPlaceholder() {
  return (
    <svg width="40%" viewBox="0 0 120 80" fill="none">
      <rect width="120" height="80" rx="8" fill={C.cream} />
      <rect x="10" y="18" width="100" height="44" rx="6" stroke={C.green} strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="40" r="10" fill={C.green} opacity="0.3" />
      <path d="M60 52 l20-20 14 14" stroke={C.green} strokeWidth="1.5" />
    </svg>
  );
}

export default function ProjectsFocused({ projects = FALLBACK }: { projects?: FocusedProject[] }) {
  return (
    <FocusedLayout title="Our Projects" activeNav="work" animationClass="kbm-proj-content">

      <section className="kbm-proj-content" style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 8rem)",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2rem)",
      }}>
        {projects.map((p, i) => (
          <a key={p.id} href={`/work/${p.slug}`} style={{
            display: "flex", flexDirection: "column", gap: 14,
            textDecoration: "none",
          }}>
            {/* thumb */}
            <div style={{
              height: "clamp(160px, 22vw, 360px)",
              borderRadius: 40,
              backgroundColor: p.coverImage ? undefined : C.ph,
              backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
              backgroundSize: "cover", backgroundPosition: "center",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              transition: "transform .25s ease",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-6px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              {!p.coverImage && <ThumbPlaceholder />}
            </div>

            <div style={{ fontFamily: TEKO, fontWeight: 500, fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)", color: C.ink, paddingTop: 6, letterSpacing: "0.04em" }}>
              {p.category ?? "Project"}
            </div>
            <div style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1rem, 1.8vw, 1.7rem)", lineHeight: 1, color: C.ink }}>
              {p.title}
            </div>

            <button
              style={{
                alignSelf: "flex-start", marginTop: 8,
                padding: "10px 28px", border: `2px solid ${C.ink}`,
                borderRadius: 40, fontFamily: TEKO, fontWeight: 500,
                fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)", color: C.ink,
                background: "transparent", cursor: "pointer",
                transition: "background .2s, color .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.yellow; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ink; }}
            >
              View Project
            </button>
          </a>
        ))}
      </section>

    </FocusedLayout>
  );
}
