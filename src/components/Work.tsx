"use client";

import { useMemo, useState } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  year: string | null;
  liveUrl: string | null;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare / digital presence",
    year: "2025",
    description:
      "A calm, conversion-led medical site with a modular content system and refined motion.",
    liveUrl: null,
  },
  {
    id: "montgab",
    title: "Montgab",
    category: "Commerce / product experience",
    year: "2025",
    description:
      "A tactile storefront balancing product storytelling, speed, and editorial whitespace.",
    liveUrl: null,
  },
  {
    id: "180-degrees",
    title: "180 Degrees",
    category: "Agency / brand platform",
    year: "2026",
    description:
      "A flexible studio identity translated into web, motion, and campaign surfaces.",
    liveUrl: null,
  },
];

export default function Work({ projects }: { projects?: Project[] }) {
  const titleRef = useFadeUp();
  const listRef = useFadeUp(0.1);
  const list = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const [activeProjectId, setActiveProjectId] = useState(list[0]?.id);

  const currentProject = useMemo(
    () => list.find((project) => project.id === activeProjectId) ?? list[0],
    [activeProjectId, list]
  );

  if (!currentProject) return null;

  return (
    <section
      id="work"
      className="relative flex min-h-screen scroll-mt-28 items-center border-y hairline py-[var(--section-space)]"
    >
      <div className="section-shell grid gap-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-32">
        <div ref={titleRef} className="lg:sticky lg:top-32">
          <p className="eyebrow mb-6">Selected work</p>
          <h2 className="display-text max-w-2xl text-4xl leading-[0.98] text-[var(--paper)] md:text-6xl">
            Projects shaped to be remembered.
          </h2>

          <div className="mt-16 rounded-[32px] border hairline bg-[linear-gradient(135deg,rgba(248,243,234,0.06),rgba(0,200,176,0.08))] p-8 md:p-10">
            <div className="mb-12 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.25em] text-[var(--text-dark)]">
              <span>{currentProject.category ?? "Selected project"}</span>
              <span>{currentProject.year ?? "—"}</span>
            </div>
            <h3 className="display-text text-4xl text-[var(--paper)]">
              {currentProject.title}
            </h3>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--text-dark)]">
              {currentProject.description ??
                "A carefully built digital experience with room for story, speed, and motion."}
            </p>
          </div>
        </div>

        <div ref={listRef} className="pt-2">
          {list.map((project) => {
            const isActive = project.id === currentProject.id;

            return (
              <button
                key={project.id}
                type="button"
                onMouseEnter={() => setActiveProjectId(project.id)}
                onFocus={() => setActiveProjectId(project.id)}
                onClick={() => {
                  setActiveProjectId(project.id);
                  if (project.liveUrl) window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                }}
                className="group flex w-full items-center justify-between border-t hairline py-12 text-left"
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.26em] text-[var(--text-dark)]">
                    {project.category ?? "Selected project"}
                  </div>
                  <div
                    className={`display-text mt-4 text-4xl transition-all duration-300 md:text-5xl ${
                      isActive
                        ? "translate-x-3 text-[var(--paper)]"
                        : "text-[rgba(248,243,234,0.42)] group-hover:translate-x-3 group-hover:text-[var(--paper)]"
                    }`}
                  >
                    {project.title}
                  </div>
                </div>

                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full border font-mono text-sm transition-all duration-300 ${
                    isActive
                      ? "border-[var(--teal)] text-[var(--teal)]"
                      : "border-white/15 text-[var(--text-dark)] group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]"
                  }`}
                >
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
