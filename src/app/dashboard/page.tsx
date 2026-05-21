import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projectCount, postCount, teamCount, serviceCount, newInquiries, recentInquiries] =
    await Promise.all([
      prisma.project.count(),
      prisma.post.count(),
      prisma.teamMember.count({ where: { active: true } }),
      prisma.service.count({ where: { active: true } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Projects",      value: projectCount, href: "/dashboard/projects",  icon: "✦", sub: "published work" },
    { label: "Blog Posts",    value: postCount,    href: "/dashboard/posts",     icon: "✍", sub: "articles" },
    { label: "Team Members",  value: teamCount,    href: "/dashboard/team",      icon: "⟡", sub: "active members" },
    { label: "New Inquiries", value: newInquiries, href: "/dashboard/inquiries", icon: "⊡", sub: "awaiting reply", highlight: newInquiries > 0 },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-white/35 text-sm mt-1">Welcome back — here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group relative bg-zinc-900 border rounded-xl p-5 transition-all hover:border-white/10 ${
              stat.highlight ? "border-[#3ABF8A]/30 bg-[#3ABF8A]/[0.04]" : "border-white/[0.06]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-lg leading-none">{stat.icon}</span>
              {stat.highlight && (
                <span className="text-[0.6rem] bg-[#3ABF8A]/15 text-[#3ABF8A] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  New
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 tabular-nums ${stat.highlight ? "text-[#3ABF8A]" : "text-white"}`}>
              {stat.value}
            </div>
            <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{stat.label}</div>
            <div className="text-[0.65rem] text-white/20 mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">Quick actions</h2>
          <div className="space-y-2">
            {[
              { href: "/dashboard/projects/new", label: "New project",     icon: "✦" },
              { href: "/dashboard/posts/new",    label: "Write a post",    icon: "✍" },
              { href: "/dashboard/team",         label: "Add team member", icon: "⟡" },
              { href: "/dashboard/inquiries",    label: "View inquiries",  icon: "⊡", badge: newInquiries > 0 ? newInquiries : null },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{item.icon}</span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[0.6rem] bg-[#3ABF8A]/15 text-[#3ABF8A] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-white/20 group-hover:text-white/40 text-xs transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest">Recent inquiries</h2>
            <Link href="/dashboard/inquiries" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              View all →
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-white/25 py-6 text-center">No new inquiries</p>
          ) : (
            <div className="space-y-2">
              {recentInquiries.map((inq) => (
                <Link
                  key={inq.id}
                  href="/dashboard/inquiries"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3ABF8A]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#3ABF8A] text-xs font-semibold">{inq.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/80 font-medium truncate">{inq.name}</div>
                    <div className="text-xs text-white/35 truncate">{inq.projectType || inq.email}</div>
                  </div>
                  <div className="text-[0.6rem] text-white/25 shrink-0 mt-0.5">
                    {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
