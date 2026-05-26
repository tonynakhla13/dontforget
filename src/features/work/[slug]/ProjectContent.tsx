"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import type { ProjectData } from "./page";

const ProjectScene = dynamic(
  () => import("@/components/three/ProjectScene"),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────────────
// Tag pill
// ─────────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--teal-mid)] bg-[var(--teal-faint)] px-4 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--teal)]">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Meta row
// ─────────────────────────────────────────────────────────────────────
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--border)] py-5">
      <span className="font-mono text-[0.52rem] uppercase tracking-[0.38em] text-[var(--body)]">
        {label}
      </span>
      <span className="font-mono text-[0.75rem] text-[var(--fg)]">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main content
// ─────────────────────────────────────────────────────────────────────
export default function ProjectContent({ project: p }: { project: ProjectData }) {
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const coverRef    = useRef<HTMLDivElement>(null);
  const infoRef     = useRef<HTMLDivElement>(null);
  const galleryRef  = useRef<HTMLDivElement>(null);

  const gallery = p.images?.filter(Boolean) ?? [];

  useEffect(() => {
    // Hero entrance after loader
    const tl = gsap.timeline({ delay: 2.4 });
    tl.fromTo(
      [eyebrowRef.current, headRef.current, metaRef.current],
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(
      canvasRef.current,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      "<0.2"
    );

    // Cover image
    gsap.fromTo(
      coverRef.current,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: coverRef.current, start: "top 82%", toggleActions: "play none none none" },
      }
    );

    // Info section
    gsap.fromTo(
      infoRef.current,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: infoRef.current, start: "top 80%", toggleActions: "play none none none" },
      }
    );

    // Gallery
    if (galleryRef.current) {
      const imgs = galleryRef.current.querySelectorAll("[data-gal]");
      if (imgs.length) {
        gsap.set(imgs, { autoAlpha: 0, y: 32 });
        gsap.to(imgs, {
          autoAlpha: 1, y: 0,
          stagger: 0.10,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: galleryRef.current, start: "top 80%", toggleActions: "play none none none" },
        });
      }
    }
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 0%, rgba(9,9,9,0.28) 68%, rgba(9,9,9,0.60) 100%)",
          }}
        />

        <div className="relative z-10 wrap grid items-center gap-12 lg:grid-cols-2 pt-28 pb-20">
          {/* Left — text */}
          <div>
            <p ref={eyebrowRef} className="eyebrow mb-6" style={{ visibility: "hidden" }}>
              {[p.category, p.year].filter(Boolean).join(" · ")}
            </p>

            <h1
              ref={headRef}
              className="hed text-[5rem] leading-[0.95]"
              style={{ visibility: "hidden" }}
            >
              {p.title}
            </h1>

            <div ref={metaRef} className="mt-8 flex flex-wrap gap-2" style={{ visibility: "hidden" }}>
              {p.tags?.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          </div>

          {/* Right — 3D canvas */}
          <div
            ref={canvasRef}
            className="relative h-[420px] lg:h-[520px]"
            style={{ visibility: "hidden" }}
          >
            <ProjectScene />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--body)]">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
        </div>
      </section>

      {/* ── Cover image ──────────────────────────────────────────── */}
      {p.coverImage && (
        <div ref={coverRef} className="relative w-full overflow-hidden" style={{ visibility: "hidden" }}>
          <div className="relative w-full" style={{ paddingBottom: "42%" }}>
            <Image
              src={p.coverImage}
              alt={p.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
          </div>
        </div>
      )}

      {/* ── Project info ─────────────────────────────────────────── */}
      <section
        className="section-py border-t border-[var(--border)]"
        ref={infoRef}
        style={{ background: "var(--bg)", visibility: "hidden" as const }}
      >
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_340px]">
          {/* Description */}
          <div>
            <p className="eyebrow mb-6">Project overview</p>
            <p className="text-[1.05rem] leading-[1.95] text-[var(--fg)] max-w-2xl">
              {p.description}
            </p>

            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass mt-10 inline-flex"
              >
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">View live site ↗</span>
              </a>
            )}
          </div>

          {/* Metadata sidebar */}
          <div>
            <p className="eyebrow mb-4">Details</p>
            {p.client  && <MetaRow label="Client"   value={p.client}   />}
            {p.year    && <MetaRow label="Year"     value={p.year}     />}
            {p.category && <MetaRow label="Category" value={p.category} />}
            {p.tags?.length > 0 && (
              <div className="pt-6">
                <span className="font-mono text-[0.52rem] uppercase tracking-[0.38em] text-[var(--body)] block mb-4">
                  Built with
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => <Tag key={t} label={t} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section
          className="section-py border-t border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <div className="wrap" ref={galleryRef}>
            <p className="eyebrow mb-10">Gallery</p>
            <div className="grid gap-4 md:grid-cols-2">
              {gallery.map((src, i) => (
                <div
                  key={src}
                  data-gal
                  className={`relative overflow-hidden rounded-[var(--radius)] ${
                    i === 0 ? "md:col-span-2" : ""
                  }`}
                  style={{ paddingBottom: i === 0 ? "44%" : "60%" }}
                >
                  <Image
                    src={src}
                    alt={`${p.title} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Back / Next nav ──────────────────────────────────────── */}
      <section
        className="py-14 border-t border-[var(--border)]"
        style={{ background: "var(--bg)" }}
      >
        <div className="wrap flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--body)] transition-colors hover:text-[var(--teal)]"
          >
            <span className="h-px w-8 bg-current" />
            Back to work
          </Link>

          <Link href="/#contact" className="btn-glass">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Start a project →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
