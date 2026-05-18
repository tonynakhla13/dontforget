import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectActions from "@/components/dashboard/ProjectActions";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-12 text-center">
          <p className="text-white/40 mb-4">No projects yet</p>
          <Link
            href="/dashboard/projects/new"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Project
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Client
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Year
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project: typeof projects[0]) => (
                <tr
                  key={project.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white text-sm">
                      {project.title}
                    </div>
                    {project.category && (
                      <div className="text-white/40 text-xs mt-0.5">
                        {project.category}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {project.client ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {project.year ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "PUBLISHED"
                          ? "bg-emerald-600/20 text-emerald-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {project.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ProjectActions id={project.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
