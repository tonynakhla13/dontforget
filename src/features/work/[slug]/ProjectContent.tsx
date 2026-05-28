"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ProjectData } from "./page";

type ProjectService = { id: string; title: string; slug: string; icon: string | null; shortDescription: string | null };
type ProjectChallenge = {
  title: string;
  problem: string;
  proposedSolutions: { title: string; description: string }[];
  chosenSolutionIndex: number | null;
  chosenReason: string;
};
type ProjectResult = { title: string; description: string; metric?: string; mediaUrl?: string };

function stringsFrom(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function Tag({ label, icon, iconUrl }: { label: string; icon?: string | null; iconUrl?: string | null }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.22em] text-[#b8d8ad]">
      {iconUrl ? (
        <img src={iconUrl} alt="" className="h-3.5 w-3.5 object-contain" decoding="async" />
      ) : icon ? (
        <span className="text-[0.68rem] leading-none" aria-hidden="true">{icon}</span>
      ) : null}
      {label}
    </span>
  );
}

function galleryUrlsFrom(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item];
    if (item && typeof item === "object") {
      const url = (item as Record<string, unknown>).url;
      return typeof url === "string" && url.trim() ? [url] : [];
    }
    return [];
  });
}

function challengesFrom(value: unknown): ProjectChallenge[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const problem = typeof record.problem === "string" ? record.problem.trim() : "";
    const proposedSolutions = Array.isArray(record.proposedSolutions)
      ? record.proposedSolutions.flatMap((solution) => {
          if (!solution || typeof solution !== "object") return [];
          const source = solution as Record<string, unknown>;
          const optionTitle = typeof source.title === "string" ? source.title.trim() : "";
          const description = typeof source.description === "string" ? source.description.trim() : "";
          if (!optionTitle && !description) return [];
          return [{ title: optionTitle || "Proposed option", description }];
        })
      : [];
    if (!title && !problem && !proposedSolutions.length) return [];
    return [{
      title: title || "Project challenge",
      problem,
      proposedSolutions,
      chosenSolutionIndex: typeof record.chosenSolutionIndex === "number" ? record.chosenSolutionIndex : null,
      chosenReason: typeof record.chosenReason === "string" ? record.chosenReason : "",
    }];
  });
}

function normalizedResultsFrom(value: unknown): ProjectResult[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const description = typeof record.description === "string" ? record.description.trim() : "";
    const metric = typeof record.metric === "string" ? record.metric.trim() : "";
    const mediaUrl = typeof record.mediaUrl === "string" ? record.mediaUrl : "";
    if (!title && !description && !metric && !mediaUrl) return [];
    return [{ title: title || "Result", description, metric, mediaUrl }];
  });
}

function ClientGoalsListPanel({ goals }: { goals: string[] }) {
  return (
    <article className="relative flex h-[68vh] w-[min(78vw,820px)] shrink-0 flex-col justify-center overflow-hidden rounded-[2rem] bg-[#0b0d0a]/90 p-10 ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_70px_rgba(0,0,0,0.24)] md:p-12">
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[rgba(var(--teal-rgb),0.10)] blur-3xl" />
      <div className="divide-y divide-white/[0.08]">
        {goals.slice(0, 6).map((goal, index) => (
          <div key={goal} className="grid grid-cols-[3.5rem_1fr] gap-5 py-6">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.28em] text-[var(--teal)]">{String(index + 1).padStart(2, "0")}</p>
            <p className="text-[1.05rem] leading-8 text-[#e7e2d8]">{goal}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function SectionTitlePanel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <article className="flex h-[68vh] w-[min(66vw,720px)] shrink-0 flex-col items-center justify-center">
      <p className="mb-7 font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[var(--teal)]">{eyebrow}</p>
      <div className="flex w-full items-center justify-center gap-5">
        <span className="h-0.5 w-[clamp(2.5rem,7vw,6rem)] rounded-full bg-[var(--teal)]" />
        <h2 className="shrink-0 text-center text-[clamp(2.35rem,4vw,4.6rem)] leading-[0.98] text-[var(--teal)] [text-wrap:balance]">
          {title}
        </h2>
        <span className="h-0.5 w-[clamp(2.5rem,7vw,6rem)] rounded-full bg-[var(--teal)]" />
      </div>
    </article>
  );
}

function ChallengePanel({ challenge, index }: { challenge: ProjectChallenge; index: number }) {
  const chosenIndex = challenge.chosenSolutionIndex;
  return (
    <article className="relative flex h-[76vh] w-[min(94vw,1320px)] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0b0d0a]/92 p-8 ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_70px_rgba(0,0,0,0.28)] md:p-11">
      <div className="flex shrink-0 items-start justify-between gap-8">
        <div>
          <p className="font-mono text-[0.56rem] uppercase tracking-[0.36em] text-[var(--teal)]">Challenge {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-4 max-w-[19ch] text-[clamp(2.1rem,3.1vw,3.8rem)] leading-[0.98] text-[#f3f0e8]">{challenge.title}</h3>
        </div>
        {chosenIndex !== null ? (
          <span className="rounded-full border border-[rgba(var(--teal-rgb),0.40)] bg-[rgba(var(--teal-rgb),0.10)] px-3 py-1.5 font-mono text-[0.54rem] uppercase tracking-[0.24em] text-[var(--teal)]">
            Chosen path
          </span>
        ) : null}
      </div>
      {challenge.problem ? <p className="mt-5 max-w-[64rem] shrink-0 text-[1rem] leading-8 text-[#b9b4a8]">{challenge.problem}</p> : null}
      <div className="mt-7 grid min-h-0 flex-1 auto-rows-fr gap-5 overflow-hidden lg:grid-cols-3">
        {challenge.proposedSolutions.map((solution, solutionIndex) => {
          const selected = chosenIndex === solutionIndex;
          return (
            <div
              key={`${solution.title}-${solutionIndex}`}
              className={`relative min-h-0 overflow-hidden border-t p-5 transition-shadow ${
                selected
                  ? "border-[var(--teal)] bg-[rgba(var(--teal-rgb),0.08)] shadow-[0_0_42px_rgba(var(--teal-rgb),0.24),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "border-white/[0.10] bg-white/[0.025]"
              }`}
            >
              {selected ? <span className="absolute right-4 top-4 rounded-full bg-[rgba(var(--teal-rgb),0.18)] px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[var(--teal)]">Selected</span> : null}
              <p className="font-mono text-[0.54rem] uppercase tracking-[0.28em] text-[#77756e]">Option {String.fromCharCode(65 + solutionIndex)}</p>
              <h4 className="mt-5 max-w-[20rem] text-2xl leading-tight text-[#f3f0e8]">{solution.title}</h4>
              {solution.description ? <p className="mt-5 text-[0.95rem] leading-7 text-[#a7a297]">{solution.description}</p> : null}
            </div>
          );
        })}
      </div>
      {challenge.chosenReason ? <p className="mt-5 shrink-0 border-t border-[rgba(var(--teal-rgb),0.22)] pt-4 text-[0.95rem] leading-7 text-[#d4cfbf]">{challenge.chosenReason}</p> : null}
    </article>
  );
}

function ProjectResultCard({ result, index }: { result: ProjectResult; index: number }) {
  const indexLabel = String(index + 1).padStart(2, "0");
  const hasMetric = Boolean(result.metric);
  const hasReveal = hasMetric || Boolean(result.description);
  return (
    <article className="group relative h-[78vh] w-[min(94vw,1280px)] shrink-0 overflow-hidden rounded-[2.2rem] bg-[#0b0d0a] ring-1 ring-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.32)]">
      {result.mediaUrl ? (
        <Image
          src={result.mediaUrl}
          alt=""
          fill
          className="object-cover object-top saturate-[0.92] transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
          sizes="1280px"
          priority={index === 0}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e110d] via-[#0b0d0a] to-[#0a0c08]" />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050604] via-[#050604]/75 to-transparent" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-3.5rem] left-[-1.5rem] select-none font-mono text-[clamp(14rem,28vw,26rem)] font-light leading-none text-white/[0.06] mix-blend-overlay"
      >
        {indexLabel}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 p-9 md:p-14">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-[var(--teal)]" />
          <p className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[var(--teal)]">Result · {indexLabel}</p>
        </div>

        <h3 className="max-w-[20ch] text-[clamp(2.4rem,4vw,4.8rem)] leading-[0.96] text-[#f3f0e8] [text-wrap:balance] [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
          {result.title}
        </h3>

        {hasReveal ? (
          <div className="grid max-w-[36rem] grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-5 pt-1">
                {hasMetric ? (
                  <div className="inline-flex w-fit items-baseline gap-3 rounded-2xl border border-[rgba(var(--teal-rgb),0.32)] bg-[rgba(var(--teal-rgb),0.10)] px-5 py-3 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_40px_rgba(var(--teal-rgb),0.18)]">
                    <span className="text-[clamp(1.4rem,2.2vw,2rem)] font-light leading-none text-[var(--teal)] [text-shadow:0_0_24px_rgba(var(--teal-rgb),0.5)]">{result.metric}</span>
                  </div>
                ) : null}

                {result.description ? (
                  <p className="text-[1rem] leading-8 text-[#d4cfc1] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">{result.description}</p>
                ) : null}

                <div className="mt-1 flex items-center gap-3 font-mono text-[0.52rem] uppercase tracking-[0.32em] text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] shadow-[0_0_10px_rgba(var(--teal-rgb),0.7)]" />
                  <span>Outcome delivered</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function MediaSection({ media, title }: { media: string[]; title: string }) {
  if (!media.length) return null;
  return (
    <section className="relative bg-[#070806] px-[max(5vw,4rem)] py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex items-center gap-5">
          <span className="h-0.5 w-16 rounded-full bg-[var(--teal)]" />
          <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.42em] text-[var(--teal)]">Media</h2>
          <span className="h-0.5 flex-1 rounded-full bg-[var(--teal)] opacity-55" />
        </div>
        <div className="space-y-10">
          {media.map((src, index) => (
            <figure key={`${src}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0b0d0a]">
              <div className="relative aspect-[16/9] w-full bg-zinc-950">
                <Image src={src} alt={`${title} media ${index + 1}`} fill className="object-cover saturate-[0.9]" sizes="(max-width: 1200px) 90vw, 1100px" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const FIRST_SCREEN_IMAGE = "/uploads/projects/1779936842782-d284d4d0-9e01-41cc-9dbc-3a58d355afbe.png";
const ELIA_STACK_FALLBACK = ["Next.js", "GSAP", "CMS", "Motion Design"];

function WebsiteFrame({
  src,
  title,
  index,
  variant = "dark",
  tall = false,
}: {
  src: string;
  title: string;
  index: number;
  variant?: "dark" | "light";
  tall?: boolean;
}) {
  return (
    <figure data-first-frame={tall ? "true" : undefined} className={`relative h-[68vh] w-[min(88vw,1080px)] shrink-0 overflow-hidden bg-gradient-to-br from-[#faf9f2] via-[#cfd4cb] to-[#6b7268] shadow-[0_34px_100px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.65)] ${tall ? "rounded-[1.55rem] p-1.5" : "rounded-[2.35rem] p-3"}`}>
      <div className={`relative h-full overflow-hidden ${tall ? "rounded-[1.15rem]" : "rounded-[1.75rem]"} ${variant === "light" ? "bg-[#eef1ed]" : "bg-[#070a0f]"}`}>
        {tall ? (
          <img
            data-tall-screen
            src={src}
            alt={`${title} website screen ${index + 1}`}
            className="absolute inset-x-0 top-0 h-auto min-h-full w-full object-top saturate-[0.9]"
            decoding="async"
            onLoad={() => requestAnimationFrame(() => ScrollTrigger.refresh())}
          />
        ) : (
          <Image src={src} alt={`${title} website screen ${index + 1}`} fill className="object-cover object-center saturate-[0.86] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.025]" sizes="(max-width: 1024px) 88vw, 1080px" priority={index === 0} />
        )}
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
    const fromGallery = galleryUrlsFrom(project.gallery);
    const firstVisual = project.useTallImage ? project.tallImage ?? project.heroImage ?? project.coverImage : project.heroImage ?? project.coverImage;
    const all = [firstVisual, project.tallImage, ...fromGallery, ...(project.images ?? [])].filter((item): item is string => Boolean(item));
    return Array.from(new Set(all));
  }, [project.coverImage, project.gallery, project.heroImage, project.images, project.tallImage, project.useTallImage]);

  const clientGoals = stringsFrom(project.clientGoals);
  const normalizedChallenges = challengesFrom(project.challenges);
  const normalizedResults = normalizedResultsFrom(project.results);
  const shortDescription = project.shortDescription ?? project.description;
  const techStack = stringsFrom(project.techStack);
  const connectedServices: ProjectService[] = project.services ?? [];
  const serviceTags = techStack.length
    ? techStack
    : project.slug === "elia-clinic"
      ? ELIA_STACK_FALLBACK
      : project.tags.length
        ? project.tags
        : [project.category ?? "Web design"];
  const firstScreen = project.tallImage ?? (project.slug === "elia-clinic" ? FIRST_SCREEN_IMAGE : gallery[0]);
  const followupGallery = gallery.filter((src) => src !== firstScreen);
  const media = Array.from(new Set([firstScreen, ...followupGallery].filter((item): item is string => Boolean(item))));
  const projectUrl = project.liveUrl ?? project.caseStudyUrl ?? project.githubUrl ?? "";
  const heroServices = connectedServices.length ? connectedServices.map((service) => service.title) : serviceTags;

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

      const firstFrame = root.querySelector<HTMLElement>("[data-first-frame='true']");
      const tallScreen = root.querySelector<HTMLElement>("[data-tall-screen]");

      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => {
            const horizontal = Math.max(0, track.scrollWidth - window.innerWidth);
            const vertical = tallScreen?.parentElement
              ? Math.max(0, tallScreen.offsetHeight - tallScreen.parentElement.clientHeight)
              : 0;
            return `+=${horizontal + vertical}`;
          },
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .to(track, {
          x: () => {
            if (!firstFrame) return 0;
            const centerStop = firstFrame.offsetLeft + firstFrame.offsetWidth / 2 - window.innerWidth / 2;
            return -Math.max(0, Math.min(centerStop, track.scrollWidth - window.innerWidth));
          },
          ease: "none",
          duration: 1.2,
        })
        .to(firstFrame, {
          scale: 1.12,
          boxShadow: "0 0 0 1px rgba(110,193,79,0.62), 0 0 52px rgba(110,193,79,0.42), 0 34px 110px rgba(0,0,0,0.4)",
          ease: "power1.out",
          duration: 0.45,
          transformOrigin: "center center",
        })
        .to(tallScreen, {
          y: () => {
            if (!tallScreen?.parentElement) return 0;
            return -Math.max(0, tallScreen.offsetHeight - tallScreen.parentElement.clientHeight);
          },
          ease: "none",
          duration: 5.4,
        })
        .to(firstFrame, {
          scale: 1,
          boxShadow: "0 34px 100px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.65)",
          ease: "power1.inOut",
          duration: 0.45,
        })
        .to(track, {
          x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 8,
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
            {project.tagline ? (
              <p data-reveal className="mt-6 max-w-[31rem] border-l-2 border-[#6ec14f] pl-5 font-mono text-[0.66rem] uppercase leading-6 tracking-[0.24em] text-[#82d866]">
                {project.tagline}
              </p>
            ) : null}
            {shortDescription ? <p data-reveal className="mt-9 max-w-[34rem] text-[1.04rem] leading-8 text-[#d7d1c3]">{shortDescription}</p> : null}
            <div data-reveal className="mt-10 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Client</p>
                <div className="mt-2 flex items-center gap-3">
                  {project.clientLogo ? (
                    <img
                      src={project.clientLogo}
                      alt=""
                      className="h-7 max-w-[6.5rem] shrink-0 object-contain grayscale saturate-0 opacity-75 contrast-125 brightness-110"
                      decoding="async"
                    />
                  ) : (
                    <p className="text-[#f0ece3]">{project.client ?? project.title}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Location</p>
                <p className="mt-2 text-[#f0ece3]">{project.location ?? "Remote"}</p>
              </div>
              <div>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Year</p>
                <p className="mt-2 text-[#f0ece3]">{project.year ?? "2025"}</p>
              </div>
            </div>
            <div data-reveal className="mt-8 max-w-2xl border-y border-[#6ec14f]/20 py-4">
              <p className="font-mono text-[0.54rem] uppercase tracking-[0.32em] text-[#79bd61]">Services</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {heroServices.slice(0, 6).map((item) => <Tag key={item} label={item} />)}
              </div>
            </div>
            <a data-reveal href={projectUrl} target="_blank" rel="noopener noreferrer" className="btn-glass mt-12 w-fit">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">View project</span>
            </a>
          </article>

          {firstScreen ? <WebsiteFrame src={firstScreen} title={project.title} index={0} tall={!!project.useTallImage || firstScreen === project.tallImage || project.slug === "elia-clinic"} /> : null}

          {clientGoals.length ? <SectionTitlePanel eyebrow="Brief" title="Client Goals" /> : null}

          {clientGoals.length ? <ClientGoalsListPanel goals={clientGoals} /> : null}

          {normalizedChallenges.length ? <SectionTitlePanel eyebrow="Decision path" title="Challenges And Solutions" /> : null}

          {normalizedChallenges.map((challenge, index) => (
            <ChallengePanel key={`${challenge.title}-${index}`} challenge={challenge} index={index} />
          ))}

          {normalizedResults.length ? <SectionTitlePanel eyebrow="Results" title="What we made" /> : null}

          {normalizedResults.map((result, index) => (
            <ProjectResultCard key={`${result.title}-${index}`} result={result} index={index} />
          ))}
        </div>
      </section>

      <MediaSection media={media} title={project.title} />

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
