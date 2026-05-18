"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

const COLORS = [
  "from-emerald-900/40",
  "from-rose-900/40",
  "from-indigo-900/40",
  "from-amber-900/40",
  "from-violet-900/40",
  "from-cyan-900/40",
];

interface Project {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  liveUrl: string | null;
  coverImage: string | null;
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useFadeUp(index * 0.15) as React.RefObject<HTMLDivElement>;
  const color = COLORS[index % COLORS.length];

  return (
    <div
      ref={ref}
      onClick={() => project.liveUrl && window.open(project.liveUrl, "_blank")}
      className={`group flex items-center justify-between p-8 rounded-2xl bg-gradient-to-r ${color} to-transparent border border-white/10 hover:border-white/30 transition-all duration-500 ${project.liveUrl ? "cursor-pointer" : "cursor-default"}`}
    >
      <div>
        {project.category && (
          <p className="text-white/40 text-xs font-mono mb-2">
            {project.category}
          </p>
        )}
        <h3 className="text-white text-3xl font-bold group-hover:text-indigo-300 transition-colors duration-300">
          {project.title}
        </h3>
      </div>
      <div className="flex items-center gap-6">
        {project.year && (
          <span className="text-white/30 text-sm font-mono">{project.year}</span>
        )}
        <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all duration-300">
          →
        </span>
      </div>
    </div>
  );
}

const FALLBACK: Project[] = [
  { id: "1", title: "Elia Clinic", category: "Healthcare · Web Design", year: "2025", liveUrl: null, coverImage: null },
  { id: "2", title: "Montgab", category: "E-commerce · Development", year: "2025", liveUrl: null, coverImage: null },
  { id: "3", title: "180 Degrees", category: "Agency · Branding", year: "2026", liveUrl: null, coverImage: null },
];

export default function Work({ projects }: { projects?: Project[] }) {
  const titleRef = useFadeUp() as React.RefObject<HTMLDivElement>;
  const list = projects && projects.length > 0 ? projects : FALLBACK;

  return (
    <section id="work" className="bg-black py-32 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
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

        <div className="flex flex-col gap-4">
          {list.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
