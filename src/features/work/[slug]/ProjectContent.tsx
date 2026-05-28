"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ProjectData } from "./page";

type ResultSlide = { label: string; value: string; note?: string };

function stringsFrom(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function slidesFrom(value: unknown): ResultSlide[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label : null;
    const result = typeof record.value === "string" ? record.value : null;
    if (!label || !result) return [];
    return [{ label, value: result, note: typeof record.note === "string" ? record.note : undefined }];
  });
}

function wordsFrom(value: string | null | undefined) {
  return value?.split(/\s+/).filter(Boolean) ?? [];
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.22em] text-[#b8d8ad]">
      {label}
    </span>
  );
}

function InfoBlock({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string | null }) {
  return (
    <article className="relative flex h-[68vh] w-[min(72vw,760px)] shrink-0 flex-col justify-center overflow-hidden rounded-[2rem] bg-[#0d0f0c]/88 p-10 ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_80px_rgba(0,0,0,0.28)] md:p-14">
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[#8bcf6d]/35 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#5fbf36]/10 blur-3xl" />
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[#7fb967]">{eyebrow}</p>
      <div className="mt-8">
        <h2 className="max-w-[13ch] text-[clamp(2.5rem,4.4vw,5.2rem)] leading-[0.98] text-[#f3f0e8] [text-wrap:balance]">{title}</h2>
        {body ? <p className="mt-8 max-w-[34rem] text-[0.98rem] leading-8 text-[#9d9b92]">{body}</p> : null}
      </div>
    </article>
  );
}

function ListPanel({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return (
    <article className="relative flex h-[68vh] w-[min(78vw,820px)] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0b0d0a]/90 p-10 ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_70px_rgba(0,0,0,0.24)] md:p-12">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#73c453]/45 to-transparent" />
      <div>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[#7fb967]">{eyebrow}</p>
        <h2 className="mt-5 max-w-[12ch] text-[clamp(2.3rem,3.8vw,4.4rem)] leading-[1.02] text-[#f3f0e8] [text-wrap:balance]">{title}</h2>
      </div>
      <div className="grid gap-0">
        {items.map((item, index) => (
          <div key={item} className="grid grid-cols-[3.6rem_1fr] gap-5 border-t border-white/[0.07] py-5">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[#6ec14f]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="max-w-[34rem] text-[1.02rem] leading-8 text-[#e7e2d8]">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ResultPanel({ results }: { results: ResultSlide[] }) {
  return (
    <article className="relative flex h-[68vh] w-[min(84vw,940px)] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-[#10110e]/90 p-10 ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_70px_rgba(0,0,0,0.24)] md:p-12">
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#6ec14f]/10 blur-3xl" />
      <div>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[#7fb967]">Outcomes</p>
        <h2 className="mt-5 text-[clamp(2.5rem,4vw,4.8rem)] leading-none text-[#f3f0e8]">What changed</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {results.map((item) => (
          <div key={item.label} className="border-t border-[#6ec14f]/35 pt-5">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.28em] text-[#88867f]">{item.label}</p>
            <p className="mt-5 text-[clamp(2.4rem,3.8vw,4.4rem)] leading-none text-[#f3f0e8]">{item.value}</p>
            {item.note ? <p className="mt-5 text-[0.95rem] leading-7 text-[#8e8b82]">{item.note}</p> : null}
          </div>
        ))}
      </div>
    </article>
  );
}

function WebsiteFrame({ src, title, index, variant = "dark" }: { src: string; title: string; index: number; variant?: "dark" | "light" }) {
  return (
    <figure className="relative h-[68vh] w-[min(88vw,1080px)] shrink-0 overflow-hidden rounded-[2.35rem] bg-gradient-to-br from-[#faf9f2] via-[#cfd4cb] to-[#6b7268] p-3 shadow-[0_34px_100px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.65)]">
      <div className={`relative h-full overflow-hidden rounded-[1.75rem] ${variant === "light" ? "bg-[#eef1ed]" : "bg-[#070a0f]"}`}>
        <Image src={src} alt={`${title} website screen ${index + 1}`} fill className="object-cover object-center saturate-[0.86] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.025]" sizes="(max-width: 1024px) 88vw, 1080px" priority={index === 0} />
        <div className="absolute inset-x-0 top-0 flex h-12 items-center gap-5 bg-gradient-to-b from-black/45 to-black/0 px-7">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6ec14f] shadow-[0_0_18px_rgba(110,193,79,0.75)]" />
          <span className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-white/64">{title} / screen {String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </figure>
  );
}

export default function ProjectContent({ project }: { project: ProjectData }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const gallery = useMemo(() => {
    const fromGallery = stringsFrom(project.gallery);
    const all = [project.coverImage, ...fromGallery, ...(project.images ?? [])].filter((item): item is string => Boolean(item));
    return Array.from(new Set(all));
  }, [project.coverImage, project.gallery, project.images]);

  const challenges = stringsFrom(project.challengePoints);
  const changes = stringsFrom(project.challengeResponses);
  const results = slidesFrom(project.resultSlides);
  const shortDescription = project.shortDescription ?? project.description;
  const fullDescription = project.fullDescription ?? project.description;
  const serviceTags = project.tags.length ? project.tags : [project.category ?? "Web design"];
  const dnaWords = wordsFrom(project.tagline ?? project.title).slice(0, 5);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal]",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.85, ease: "power3.out", delay: 0.35 }
      );

      gsap.to(track, {
        x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(0, track.scrollWidth - window.innerWidth)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={rootRef} className="relative h-screen overflow-hidden bg-[#070806] pt-24 md:pt-0">
        <style jsx global>{`
          .canonical-theme.preference-immersive {
            display: none;
          }
        `}</style>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_42%,rgba(93,146,66,0.13),transparent_29%),radial-gradient(circle_at_72%_55%,rgba(229,221,200,0.05),transparent_26%),linear-gradient(90deg,#070806,#10130f_44%,#080907)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div
          ref={trackRef}
          className="relative z-10 flex h-screen w-max flex-row items-center gap-[4.8vw] px-[max(5vw,4rem)] pb-0"
        >
          <article className="flex h-screen w-[min(86vw,720px)] shrink-0 flex-col justify-center">
            <p data-reveal className="font-mono text-[0.6rem] uppercase tracking-[0.44em] text-[#78bf5d]">{project.category ?? "Case study"}</p>
            <h1 data-reveal className="hed mt-8 max-w-[8ch] text-[clamp(4.5rem,8.8vw,8rem)] leading-[0.88] text-[#f4f1e8]">{project.title}</h1>
            {shortDescription ? <p data-reveal className="mt-9 max-w-[34rem] text-[1.04rem] leading-8 text-[#d7d1c3]">{shortDescription}</p> : null}
            <div data-reveal className="mt-10 grid max-w-xl grid-cols-2 gap-x-10 gap-y-6">
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Year</p>
                <p className="mt-2 text-[#f0ece3]">{project.year ?? "2025"}</p>
              </div>
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Location</p>
                <p className="mt-2 text-[#f0ece3]">{project.location ?? "Remote"}</p>
              </div>
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Client</p>
                <p className="mt-2 text-[#f0ece3]">{project.client ?? project.title}</p>
              </div>
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Services</p>
                <p className="mt-2 text-[#f0ece3]">{serviceTags.slice(0, 2).join(", ")}</p>
              </div>
            </div>
            {project.liveUrl ? (
              <a data-reveal href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-glass mt-12 w-fit">
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">Launch project</span>
              </a>
            ) : null}
          </article>

          {gallery[0] ? <WebsiteFrame src={gallery[0]} title={project.title} index={0} /> : null}

          <InfoBlock eyebrow="Project DNA" title={project.tagline ?? "Built around trust"} body={fullDescription} />

          {gallery[1] ? <WebsiteFrame src={gallery[1]} title={project.title} index={1} variant="light" /> : null}

          <article className="relative flex h-[68vh] w-[min(78vw,760px)] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0d0f0c]/88 p-10 ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_80px_rgba(0,0,0,0.28)] md:p-12">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[#7fb967]">DNA markers</p>
            <div className="flex flex-wrap gap-3">
              {[...dnaWords, ...serviceTags].slice(0, 10).map((item) => <Tag key={item} label={item} />)}
            </div>
            <p className="max-w-[13ch] text-[clamp(2.7rem,4.3vw,5rem)] leading-[0.98] text-[#f3f0e8] [text-wrap:balance]">
              Clear service paths, human trust signals, and booking moments that stay close without feeling pushy.
            </p>
          </article>

          {challenges.length ? <ListPanel eyebrow="Struggles" title="What was blocking growth" items={challenges} /> : null}

          {gallery[2] ? <WebsiteFrame src={gallery[2]} title={project.title} index={2} /> : null}

          {changes.length ? <ListPanel eyebrow="Use case" title="How the site now works" items={changes} /> : null}

          {results.length ? <ResultPanel results={results} /> : null}

          {gallery.slice(3, 6).map((src, index) => (
            <WebsiteFrame key={src} src={src} title={project.title} index={index + 3} variant={index % 2 ? "light" : "dark"} />
          ))}

          <InfoBlock eyebrow="Extra mile" title="Launch-ready system" body={project.extraMile ?? "The project leaves the team with reusable content patterns, not only a one-off visual refresh."} />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg)] py-14">
        <div className="wrap flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/#work" className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--body)] transition-colors hover:text-[var(--teal)]">
            Back to work
          </Link>
          <Link href="/#contact" className="btn-glass w-fit">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">Start a project</span>
          </Link>
        </div>
      </section>
    </>
  );
}
