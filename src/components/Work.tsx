"use client";

import Image from "next/image";
import { PointerEvent, WheelEvent, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface Project {
  id: string;
  slug?: string | null;
  title: string;
  category: string | null;
  year: string | null;
  description: string | null;
  liveUrl: string | null;
  coverImage?: string | null;
}

const PROJECT_META: Record<string, { kind: string; business: string }> = {
  "elia-clinic": { kind: "Website", business: "Healthcare" },
  montgab: { kind: "E-Commerce", business: "Retail" },
  "180-degrees": { kind: "UI/UX", business: "Agency / Brand" },
  launchpad: { kind: "App", business: "SaaS Platform" },
};

const FALLBACK: Project[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description: "Calm, conversion-led medical site with modular content and refined motion.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description: "Tactile storefront balancing product storytelling, speed, and editorial whitespace.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "180-degrees",
    slug: "180-degrees",
    title: "180 Degrees",
    category: "Agency / Brand",
    year: "2026",
    description: "A flexible studio identity translated into web, motion, and campaign surfaces.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description: "Developer-focused dashboard built for speed, clarity, and team collaboration.",
    liveUrl: null,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

function projectHref(p: Project) {
  return `/work/${p.slug ?? p.id}`;
}

function metaFor(p: Project) {
  return PROJECT_META[p.slug ?? p.id] ?? {
    kind: p.category?.includes("App") ? "App" : p.category?.includes("Commerce") ? "E-Commerce" : "Website",
    business: p.category ?? "Business",
  };
}

function HologramField() {
  const arrowDots = [
    [0, 0], [22, 18], [44, 36], [66, 54], [88, 72],
    [88, 72], [112, 50], [136, 28], [160, 6],
    [88, 72], [90, 38], [92, 4],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[54%] top-[49%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-45 [perspective:1200px]">
        <div className="relative h-full w-full animate-[work-holo_24s_linear_infinite] [transform-style:preserve-3d]">
          {[0, 24, 48, 72, 96, 120, 144].map((deg) => (
            <span
              key={deg}
              className="absolute inset-0 rounded-[38%] border border-[rgba(58,191,138,0.28)]"
              style={{ transform: `rotateX(${deg}deg) rotateY(${deg * 0.65}deg) rotateZ(${deg * 0.2}deg)` }}
            />
          ))}
          {Array.from({ length: 46 }).map((_, i) => {
            const angle = i * 137.5;
            const radius = 28 + (i % 9) * 6;
            const z = ((i % 11) - 5) * 18;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[var(--teal)] shadow-[0_0_10px_rgba(58,191,138,0.9)]"
                style={{
                  transform: `rotate(${angle}deg) translateX(${radius * 3}px) translateZ(${z}px)`,
                  opacity: 0.35 + (i % 5) * 0.09,
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="absolute right-[20%] top-[24%] hidden h-[110px] w-[180px] opacity-80 md:block">
        {arrowDots.map(([x, y], index) => (
          <span
            key={`${x}-${y}-${index}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-[var(--teal)] shadow-[0_0_14px_rgba(58,191,138,0.95)]"
            style={{
              left: x,
              top: y,
              animation: `work-arrow-pulse 1.8s ease-in-out ${index * 0.045}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes work-holo {
          from { transform: rotateX(62deg) rotateY(0deg) rotateZ(-12deg); }
          to { transform: rotateX(62deg) rotateY(360deg) rotateZ(-12deg); }
        }
        @keyframes work-arrow-pulse {
          from { opacity: 0.28; transform: scale(0.75); }
          to { opacity: 1; transform: scale(1.18); }
        }
        @keyframes work-heading-in {
          from { opacity: 0; transform: translateY(28px) skewY(2deg); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

export default function Work({ projects }: { projects?: Project[] }) {
  const list = projects?.length ? projects : FALLBACK;
  const slides = Array.from({ length: Math.max(6, list.length) }, (_, index) => ({
    ...list[index % list.length],
    carouselKey: `${list[index % list.length].id}-${index}`,
  }));
  const [visualIndex, setVisualIndex] = useState(0);
  const targetIndex = useRef(0);
  const motion = useRef({ value: 0 });
  const dragStart = useRef<number | null>(null);
  const wheelAt = useRef(0);

  const moveTo = (nextValue: number) => {
    targetIndex.current = nextValue;
    gsap.killTweensOf(motion.current);
    gsap.to(motion.current, {
      value: targetIndex.current,
      duration: 0.86,
      ease: "back.out(1.08)",
      overwrite: true,
      onUpdate: () => setVisualIndex(motion.current.value),
    });
  };

  const next = () => moveTo(targetIndex.current + 1);
  const prev = () => moveTo(targetIndex.current - 1);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) < 55) return;
    if (delta < 0) next();
    else prev();
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 22) return;
    const now = Date.now();
    if (now - wheelAt.current < 360) return;
    wheelAt.current = now;
    if (delta > 0) next();
    else prev();
  };

  return (
    <section
      id="work"
      className="relative min-h-svh overflow-hidden border-t border-[var(--border)] bg-transparent px-[var(--gutter)] pb-20 pt-16 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(58,191,138,0.05),transparent_68%)]" />
      <HologramField />

      <div className="pointer-events-none relative z-50 max-w-4xl">
        <p className="eyebrow mb-4">Selected work</p>
        <h2
          className="hed relative whitespace-nowrap text-[clamp(2rem,3.8vw,4.2rem)] leading-[0.86]"
          style={{ animation: "work-heading-in 0.9s cubic-bezier(.22,1,.36,1) both" }}
        >
          What should <span className="text-[var(--teal)]">you see?</span>
          <span
            className="pointer-events-none absolute left-2 top-2 -z-10 text-[rgba(248,245,238,0.10)]"
            aria-hidden="true"
          >
            What should you see?
          </span>
        </h2>
      </div>

      <div
        className="absolute inset-x-0 bottom-4 h-[66vh] cursor-move select-none touch-pan-y overflow-hidden"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 50%", transformStyle: "preserve-3d" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        {slides.map((p, index) => {
          const raw = index - visualIndex;
          const offset =
            raw > slides.length / 2 ? raw - slides.length : raw < -slides.length / 2 ? raw + slides.length : raw;
          const abs = Math.abs(offset);
          const isActive = abs < 0.5;
          const meta = metaFor(p);
          const angle = offset * 46;
          const radians = (angle * Math.PI) / 180;
          const radius = 620;
          const orbitX = Math.sin(radians) * radius;
          const orbitZ = Math.cos(radians) * radius - radius;

          return (
            <a
              key={p.carouselKey}
              href={projectHref(p)}
              className="group absolute left-1/2 top-[52%] block w-[min(760px,54vw)] overflow-hidden border border-white/10 bg-black shadow-[0_45px_120px_rgba(0,0,0,0.62)] transition-[transform,opacity,border-radius,filter] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{
                aspectRatio: "16 / 9",
                borderRadius: isActive
                  ? "1.35rem"
                  : offset > 0
                    ? "1.2rem 8rem 8rem 1.2rem"
                    : "8rem 1.2rem 1.2rem 8rem",
                filter: isActive ? "brightness(1)" : "brightness(0.54)",
                opacity: abs > 3 ? 0.18 : isActive ? 1 : 0.78,
                pointerEvents: abs > 2.2 ? "none" : "auto",
                zIndex: Math.round(80 - abs * 8 + (isActive ? 30 : 0)),
                transform: `
                  translate(-50%, -50%)
                  translateX(${orbitX}px)
                  translateZ(${orbitZ}px)
                  rotateY(${-angle}deg)
                  rotateZ(${isActive ? -2.8 : offset * 4.8}deg)
                  scale(${isActive ? 1 : 0.98})
                `,
                transformStyle: "preserve-3d",
                transformOrigin: "50% 50%",
                backfaceVisibility: "visible",
              }}
            >
              {p.coverImage ? (
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  preload={isActive}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1408px) 54vw, 760px"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--surface2)]" />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/28 to-black/36" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/34 to-black/8" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(58,191,138,0.20),transparent_34%)]" />
              <div
                className="absolute bottom-7 left-7 right-7 transition-opacity duration-300 md:bottom-10 md:left-10 md:right-10"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-md bg-white/15 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/85">
                    {meta.kind}
                  </span>
                  <span className="rounded-md border border-white/15 bg-black/25 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/70">
                    {meta.business}
                  </span>
                </div>
                <h2 className="hed text-[clamp(2.4rem,5.2vw,5.4rem)] uppercase leading-[0.78] text-white">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-[520px] font-mono text-[0.7rem] uppercase leading-[1.5] text-white/82">
                  {p.description}
                </p>
                <span className="mt-5 inline-flex min-w-[160px] justify-center rounded-2xl border border-[var(--teal)] bg-white px-6 py-3 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-black shadow-[0_0_22px_rgba(58,191,138,0.25)] transition group-hover:bg-[var(--teal)]">
                  Launch
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="pointer-events-auto absolute bottom-10 right-[var(--gutter)] z-50">
        <a href="/work" className="font-mono text-[0.74rem] font-bold uppercase tracking-[0.28em] text-white">
          See all work ▶
        </a>
      </div>
    </section>
  );
}
