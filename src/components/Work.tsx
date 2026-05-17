"use client";

import { useRef } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Elia Clinic",
    category: "Healthcare · Web Design",
    year: "2025",
    color: "from-emerald-900/40",
  },
  {
    title: "Montgab",
    category: "E-commerce · Development",
    year: "2025",
    color: "from-rose-900/40",
  },
  {
    title: "180 Degrees",
    category: "Agency · Branding",
    year: "2026",
    color: "from-indigo-900/40",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useFadeUp(index * 0.15) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={ref}
      className={`group flex items-center justify-between p-8 rounded-2xl bg-gradient-to-r ${project.color} to-transparent border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer`}
    >
      <div>
        <p className="text-white/40 text-xs font-mono mb-2">{project.category}</p>
        <h3 className="text-white text-3xl font-bold group-hover:text-indigo-300 transition-colors duration-300">
          {project.title}
        </h3>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-white/30 text-sm font-mono">{project.year}</span>
        <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all duration-300">
          →
        </span>
      </div>
    </div>
  );
}

export default function Work() {
  const titleRef = useFadeUp() as React.RefObject<HTMLDivElement>;

  return (
    <section id="work" className="bg-black py-32 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-20 flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest mb-4">
              Selected Work
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-white">
              Projects we&apos;re
              <br />
              <span className="text-white/30">proud of</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="text-white/50 hover:text-white text-sm underline underline-offset-4 transition-colors"
          >
            Start your project →
          </a>
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
