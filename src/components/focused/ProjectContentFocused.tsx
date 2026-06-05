"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { NoxNavbar, NoxFooter, TK, SANS, DISPLAY } from "./NoxShared";
import type { ProjectData } from "@/features/work/[slug]/page";

/* ── focused (NOX) tokens ───────────────────────────────────────────── */
const C = {
  bg:          TK.ink,
  panel:       "#0a0e0c",
  panelSoft:   "#0e1410",
  border:      "rgba(255,255,255,0.09)",
  text:        TK.paper,
  muted:       "rgba(255,255,255,0.55)",
  faint:       "rgba(255,255,255,0.35)",
  accent:      TK.green,
  accentHot:   TK.greenHot,
  accentRgb:   "70,174,34",
} as const;

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

function Tag({ label, icon, iconUrl }: { label: string; icon?: string | null; iconUrl?: string | null }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3.5 py-1.5"
      style={{
        fontFamily: SANS,
        fontSize: "0.56rem",
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: C.accent,
        border: `1px solid rgba(${C.accentRgb},0.45)`,
        background: `rgba(${C.accentRgb},0.08)`,
      }}
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt="" className="h-3.5 w-3.5 object-contain" decoding="async" />
      ) : icon ? (
        <span className="text-[0.68rem] leading-none" aria-hidden="true">{icon}</span>
      ) : null}
      {label}
    </span>
  );
}

function ClientGoalsListPanel({ goals }: { goals: string[] }) {
  return (
    <article
      className="relative flex h-[68vh] w-[min(78vw,820px)] shrink-0 flex-col justify-center overflow-hidden p-10 md:p-12"
      style={{ background: C.panel, border: `1px solid rgba(${C.accentRgb},0.45)`, boxShadow: `0 0 0 1px ${C.bg}, -10px 10px 0 rgba(${C.accentRgb},0.22)` }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {goals.slice(0, 6).map((goal, index) => (
          <div key={goal} className="grid grid-cols-[3.5rem_1fr] gap-5 py-6" style={{ borderTop: index === 0 ? "none" : `1px solid ${C.border}` }}>
            <p style={{ fontFamily: SANS, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.28em", color: C.accent, fontWeight: 600 }}>
              {String(index + 1).padStart(2, "0")}
            </p>
            <p style={{ fontFamily: SANS, fontSize: "1.05rem", lineHeight: 1.6, color: C.text }}>{goal}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function SectionTitlePanel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <article className="flex h-[68vh] w-[min(66vw,720px)] shrink-0 flex-col items-center justify-center">
      <p className="mb-7" style={{ fontFamily: SANS, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.42em", color: C.accent, fontWeight: 600 }}>
        {eyebrow}
      </p>
      <div className="flex w-full items-center justify-center gap-5">
        <span className="h-0.5 w-[clamp(2.5rem,7vw,6rem)] rounded-full" style={{ background: C.accent }} />
        <h2
          className="shrink-0 text-center text-[clamp(1.6rem,2.6vw,3rem)] leading-[1.02] [text-wrap:balance]"
          style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, color: C.text, letterSpacing: "-0.03em" }}
        >
          {title}
        </h2>
        <span className="h-0.5 w-[clamp(2.5rem,7vw,6rem)] rounded-full" style={{ background: C.accent }} />
      </div>
    </article>
  );
}

function ChallengePanel({ challenge, index }: { challenge: ProjectChallenge; index: number }) {
  const chosenIndex = challenge.chosenSolutionIndex;
  return (
    <article
      className="relative flex h-[76vh] w-[min(94vw,1320px)] shrink-0 flex-col overflow-hidden p-8 md:p-11"
      style={{ background: C.panel, border: `1px solid rgba(${C.accentRgb},0.45)`, boxShadow: `0 0 0 1px ${C.bg}, -10px 10px 0 rgba(${C.accentRgb},0.22)` }}
    >
      <div className="flex shrink-0 items-start justify-between gap-8">
        <div>
          <p style={{ fontFamily: SANS, fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.36em", color: C.accent, fontWeight: 600 }}>
            Challenge {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-4 max-w-[19ch] text-[clamp(2.1rem,3.1vw,3.8rem)] leading-[0.98]" style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, color: C.text, letterSpacing: "-0.03em" }}>
            {challenge.title}
          </h3>
        </div>
        {chosenIndex !== null ? (
          <span
            className="px-3 py-1.5"
            style={{ fontFamily: SANS, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.24em", color: "#000", border: `1px solid ${C.accent}`, background: C.accent, fontWeight: 700 }}
          >
            Chosen path
          </span>
        ) : null}
      </div>
      {challenge.problem ? (
        <p className="mt-5 max-w-[64rem] shrink-0 text-[1rem] leading-8" style={{ fontFamily: SANS, color: C.muted }}>
          {challenge.problem}
        </p>
      ) : null}
      <div className="mt-7 grid min-h-0 flex-1 auto-rows-fr gap-5 overflow-hidden lg:grid-cols-3">
        {challenge.proposedSolutions.map((solution, solutionIndex) => {
          const selected = chosenIndex === solutionIndex;
          return (
            <div
              key={`${solution.title}-${solutionIndex}`}
              className="relative min-h-0 overflow-hidden p-5"
              style={
                selected
                  ? { border: `1px solid ${C.accent}`, background: `rgba(${C.accentRgb},0.14)`, boxShadow: `inset 0 0 0 1px rgba(${C.accentRgb},0.4)` }
                  : { border: `1px solid rgba(255,255,255,0.14)`, background: "rgba(255,255,255,0.02)" }
              }
            >
              {selected ? (
                <span className="absolute right-4 top-4 px-2.5 py-1" style={{ fontFamily: SANS, fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "#000", background: C.accent, fontWeight: 700 }}>
                  Selected
                </span>
              ) : null}
              <p style={{ fontFamily: SANS, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.28em", color: C.faint }}>
                Option {String.fromCharCode(65 + solutionIndex)}
              </p>
              <h4 className="mt-5 max-w-[20rem] text-2xl leading-tight" style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, color: C.text }}>{solution.title}</h4>
              {solution.description ? (
                <p className="mt-5 text-[0.95rem] leading-7" style={{ fontFamily: SANS, color: C.muted }}>{solution.description}</p>
              ) : null}
            </div>
          );
        })}
      </div>
      {challenge.chosenReason ? (
        <p className="mt-5 shrink-0 pt-4 text-[0.95rem] leading-7" style={{ fontFamily: SANS, color: C.text, borderTop: `1px solid rgba(${C.accentRgb},0.22)` }}>
          {challenge.chosenReason}
        </p>
      ) : null}
    </article>
  );
}

function ProjectResultCard({ result, index }: { result: ProjectResult; index: number }) {
  const indexLabel = String(index + 1).padStart(2, "0");
  const hasMetric = Boolean(result.metric);
  const hasReveal = hasMetric || Boolean(result.description);
  return (
    <article
      className="group relative h-[78vh] w-[min(94vw,1280px)] shrink-0 overflow-hidden"
      style={{ border: `1px solid rgba(${C.accentRgb},0.45)`, background: C.panel, boxShadow: `-10px 10px 0 rgba(${C.accentRgb},0.22)` }}
    >
      {result.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.mediaUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0e110d,#0a0c08)" }} />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{ background: "linear-gradient(to top, #050604, rgba(5,6,4,0.75), transparent)" }} />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-3.5rem] left-[-1.5rem] select-none text-[clamp(14rem,28vw,26rem)] font-light leading-none"
        style={{ fontFamily: DISPLAY, color: "rgba(255,255,255,0.06)", mixBlendMode: "overlay" }}
      >
        {indexLabel}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 p-9 md:p-14">
        <div className="flex items-center gap-4">
          <span className="h-px w-10" style={{ background: C.accent }} />
          <p style={{ fontFamily: SANS, fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.42em", color: C.accent }}>
            Result · {indexLabel}
          </p>
        </div>

        <h3
          className="max-w-[20ch] text-[clamp(2.4rem,4vw,4.8rem)] leading-[0.96] [text-wrap:balance]"
          style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", textShadow: "0 2px 28px rgba(0,0,0,0.75)" }}
        >
          {result.title}
        </h3>

        {hasReveal ? (
          <div className="grid max-w-[36rem] grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-5 pt-1">
                {hasMetric ? (
                  <div className="inline-flex w-fit items-baseline gap-3 px-5 py-3" style={{ border: `1px solid ${C.accent}`, background: `rgba(${C.accentRgb},0.14)` }}>
                    <span className="text-[clamp(1.4rem,2.2vw,2rem)] font-light leading-none" style={{ fontFamily: DISPLAY, fontStyle: "italic", color: C.accent }}>{result.metric}</span>
                  </div>
                ) : null}

                {result.description ? (
                  <p className="text-[1rem] leading-8" style={{ fontFamily: SANS, color: "rgba(255,255,255,0.84)", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>{result.description}</p>
                ) : null}

                <div className="mt-1 flex items-center gap-3" style={{ fontFamily: SANS, fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.32em", color: "rgba(255,255,255,0.55)" }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.accent }} />
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
    <section className="relative px-[clamp(1.5rem,4vw,3.5rem)] py-24" style={{ background: "#070806" }}>
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex items-center gap-5">
          <span className="h-0.5 w-16 rounded-full" style={{ background: C.accent }} />
          <h2 style={{ fontFamily: SANS, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.42em", color: C.accent }}>Media</h2>
          <span className="h-0.5 flex-1 rounded-full" style={{ background: C.accent, opacity: 0.55 }} />
        </div>
        <div className="space-y-10">
          {media.map((src, index) => (
            <figure key={`${src}-${index}`} className="overflow-hidden" style={{ border: `1px solid rgba(${C.accentRgb},0.35)`, background: "#0b0d0a" }}>
              <div className="relative aspect-[16/9] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${title} media ${index + 1}`} className="absolute inset-0 h-full w-full object-cover" />
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
  tall = false,
}: {
  src: string;
  title: string;
  index: number;
  tall?: boolean;
}) {
  return (
    <figure
      data-first-frame={tall ? "true" : undefined}
      className="relative h-[68vh] w-[min(88vw,1080px)] shrink-0 overflow-hidden p-2"
      style={{
        background: C.panel,
        border: `1px solid rgba(${C.accentRgb},0.55)`,
        boxShadow: `-14px 14px 0 rgba(${C.accentRgb},0.28)`,
      }}
    >
      <div className="relative h-full overflow-hidden" style={{ background: "#070a0f", border: `1px solid ${C.border}` }}>
        {tall ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            data-tall-screen
            src={src}
            alt={`${title} website screen ${index + 1}`}
            className="absolute inset-x-0 top-0 h-auto min-h-full w-full object-top"
            decoding="async"
            onLoad={() => requestAnimationFrame(() => ScrollTrigger.refresh())}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${title} website screen ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.025]"
          />
        )}
        <div className="absolute inset-x-0 top-0 flex h-12 items-center gap-5 px-7" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.accent, boxShadow: `0 0 18px rgba(${C.accentRgb},0.75)` }} />
          <span style={{ fontFamily: SANS, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.32em", color: "rgba(255,255,255,0.64)" }}>
            {title} / screen {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </figure>
  );
}

function CtaButton({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 10,
    background: C.accent, color: "#000",
    fontFamily: SANS, fontWeight: 700, fontSize: "0.76rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    textDecoration: "none",
    padding: "0.95rem 2rem", transition: "background 180ms, transform 200ms",
    width: "fit-content",
  };
  const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = C.accentHot; e.currentTarget.style.transform = "translateY(-2px)"; };
  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "none"; };
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</a>;
  }
  return <Link href={href} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</Link>;
}

export default function ProjectContentFocused({ project }: { project: ProjectData }) {
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
      const refresh = () => ScrollTrigger.refresh();
      const refreshFrame = requestAnimationFrame(refresh);
      window.addEventListener("load", refresh, { once: true });

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
          boxShadow: `0 0 0 1px rgba(${C.accentRgb},0.62), 0 0 52px rgba(${C.accentRgb},0.42), 0 34px 110px rgba(0,0,0,0.4)`,
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
          boxShadow: `-14px 14px 0 rgba(${C.accentRgb},0.28)`,
          ease: "power1.inOut",
          duration: 0.45,
        })
        .to(track, {
          x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 8,
        });

      return () => {
        cancelAnimationFrame(refreshFrame);
        window.removeEventListener("load", refresh);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: SANS }}>
      <NoxNavbar active="work" />

      <main className="relative overflow-x-clip">
        <section id="hero" ref={rootRef} className="relative h-screen overflow-hidden" style={{ background: C.bg }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.038) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
          />

          <div ref={trackRef} className="relative z-10 flex h-screen w-max flex-row items-center gap-[4.8vw] px-[clamp(1.5rem,4vw,3.5rem)] pb-0">
            <article className="flex h-screen w-[min(82vw,760px)] shrink-0 flex-col justify-center pb-10 pt-[clamp(5rem,11vh,8rem)]">
              <p data-reveal style={{ fontFamily: SANS, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.44em", color: C.accent, fontWeight: 600 }}>
                {project.category ?? "Case study"}
              </p>
              <h1
                data-reveal
                className="mt-5 max-w-[12ch] text-[clamp(3.6rem,6.8vw,6rem)] leading-[0.9]"
                style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 700, color: C.text, letterSpacing: "-0.03em" }}
              >
                {project.title}
              </h1>
              {project.tagline ? (
                <p
                  data-reveal
                  className="mt-5 max-w-[31rem] pl-5"
                  style={{ fontFamily: SANS, fontSize: "0.64rem", textTransform: "uppercase", lineHeight: 1.6, letterSpacing: "0.24em", color: C.accent, borderLeft: `2px solid ${C.accent}` }}
                >
                  {project.tagline}
                </p>
              ) : null}
              {shortDescription ? (
                <p data-reveal className="mt-7 max-w-[35rem] text-[1rem] leading-8" style={{ fontFamily: SANS, color: C.muted }}>
                  {shortDescription}
                </p>
              ) : null}
              <div data-reveal className="mt-7 grid max-w-[48rem] grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Client", node: project.clientLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.clientLogo} alt="" className="h-7 max-w-[6.5rem] shrink-0 object-contain" style={{ filter: "grayscale(1) brightness(1.4)" }} decoding="async" />
                  ) : (
                    <p style={{ color: C.text }}>{project.client ?? project.title}</p>
                  ) },
                  { label: "Location", node: <p style={{ color: C.text }}>{project.location ?? "Remote"}</p> },
                  { label: "Year", node: <p style={{ color: C.text }}>{project.year ?? "2025"}</p> },
                ].map((cell) => (
                  <div key={cell.label} className="min-h-[6rem] p-4" style={{ border: `1px solid rgba(255,255,255,0.14)`, background: "rgba(255,255,255,0.02)" }}>
                    <p style={{ fontFamily: SANS, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.32em", color: C.accent, fontWeight: 600 }}>{cell.label}</p>
                    <div className="mt-2 flex items-center gap-3">{cell.node}</div>
                  </div>
                ))}
              </div>
              <div data-reveal className="mt-5 max-w-[48rem] p-4" style={{ border: `1px solid rgba(${C.accentRgb},0.45)`, background: `rgba(${C.accentRgb},0.06)` }}>
                <p style={{ fontFamily: SANS, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.32em", color: C.accent, fontWeight: 600 }}>Services</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {heroServices.slice(0, 6).map((item) => <Tag key={item} label={item} />)}
                </div>
              </div>
              {projectUrl ? (
                <div data-reveal className="mt-8">
                  <CtaButton href={projectUrl} external>View project →</CtaButton>
                </div>
              ) : null}
            </article>

            {firstScreen ? (
              <WebsiteFrame
                src={firstScreen}
                title={project.title}
                index={0}
                tall={!!project.useTallImage || firstScreen === project.tallImage || project.slug === "elia-clinic"}
              />
            ) : null}

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

        <section className="py-14" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-[clamp(1.5rem,4vw,3.5rem)] sm:flex-row sm:items-center sm:justify-between">
            <Link href="/focused/work" style={{ fontFamily: SANS, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.28em", color: C.muted }}>
              ← Back to work
            </Link>
            <CtaButton href="/focused/contact">Start a project →</CtaButton>
          </div>
        </section>
      </main>

      <NoxFooter />
    </div>
  );
}
