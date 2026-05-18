import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projectCount, teamCount, serviceCount, newInquiries] =
    await Promise.all([
      prisma.project.count(),
      prisma.teamMember.count({ where: { active: true } }),
      prisma.service.count({ where: { active: true } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
    ]);

  const stats = [
    { label: "Projects", value: projectCount, href: "/dashboard/projects", icon: "✦" },
    { label: "Team Members", value: teamCount, href: "/dashboard/team", icon: "⟡" },
    { label: "Services", value: serviceCount, href: "/dashboard/services", icon: "◎" },
    { label: "New Inquiries", value: newInquiries, href: "/dashboard/inquiries", icon: "⊡", highlight: newInquiries > 0 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-zinc-900 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              {stat.highlight && (
                <span className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${stat.highlight ? "text-indigo-400" : "text-white"}`}>
              {stat.value}
            </div>
            <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-zinc-900 border border-white/5 rounded-xl p-6">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/projects/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + New Project
          </Link>
          <Link
            href="/dashboard/team"
            className="bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Add Team Member
          </Link>
          <Link
            href="/dashboard/inquiries"
            className="bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            View Inquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
