"use client";

import { useMemo, useState } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Elia Clinic",
    category: "Healthcare / digital presence",
    year: "2025",
    summary:
      "A calm, conversion-led medical site with a modular content system and refined motion.",
  },
  {
    title: "Montgab",
    category: "Commerce / product experience",
    year: "2025",
    summary:
      "A tactile storefront balancing product storytelling, speed, and editorial whitespace.",
  },
  {
    title: "180 Degrees",
    category: "Agency / brand platform",
    year: "2026",
    summary:
      "A flexible studio identity translated into web, motion, and campaign surfaces.",
  },
];

export default function Work() {
  const titleRef = useFadeUp();
  const listRef = useFadeUp(0.1);
  const [activeProject, setActiveProject] = useState(projects[0].title);

  const currentProject = useMemo(
    () => projects.find((project) => project.title === activeProject) ?? projects[0],
    [activeProject]
  );

  return (
    <section id="work" className="relative border-y hairline py-24 md:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div ref={titleRef} className="lg:sticky lg:top-32">
          <p className="eyebrow mb-6">Selected work</p>
          <h2 className="display-text text-3xl leading-tight text-[var(--paper)] md:text-5xl">
            Projects shaped to be remembered.
          </h2>

          <div className="mt-10 rounded-[28px] border hairline bg-[linear-gradient(135deg,rgba(248,243,234,0.06),rgba(0,200,176,0.08))] p-5">
            <div className="mb-12 flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-[var(--text-dark)]">
              <span>{currentProject.category}</span>
              <span>{currentProject.year}</span>
            </div>
            <h3 className="display-text text-3xl text-[var(--paper)]">{currentProject.title}</h3>
            <p className="mt-5 max-w-md leading-7 text-[var(--text-dark)]">
              {currentProject.summary}
            </p>
          </div>
        </div>

        <div ref={listRef}>
          {projects.map((project) => {
            const isActive = project.title === activeProject;

            return (
              <button
                key={project.title}
                type="button"
                onMouseEnter={() => setActiveProject(project.title)}
                onFocus={() => setActiveProject(project.title)}
                onClick={() => setActiveProject(project.title)}
                className="group flex w-full items-center justify-between border-t hairline py-7 text-left"
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.26em] text-[var(--text-dark)]">
                    {project.category}
                  </div>
                  <div
                    className={`display-text mt-3 text-3xl transition-all duration-300 md:text-4xl ${
                      isActive
                        ? "translate-x-3 text-[var(--paper)]"
                        : "text-[rgba(248,243,234,0.42)] group-hover:translate-x-3 group-hover:text-[var(--paper)]"
                    }`}
                  >
                    {project.title}
                  </div>
                </div>

                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border font-mono text-sm transition-all duration-300 ${
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
