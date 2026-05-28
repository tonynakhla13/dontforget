"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard",           label: "Overview",        icon: "◈" },
  { href: "/dashboard/projects",  label: "Projects",        icon: "✦" },
  { href: "/dashboard/clients",   label: "Client Library",  icon: "⟡" },
  { href: "/dashboard/tech",      label: "Tech Library",    icon: "◎" },
  { href: "/dashboard/posts",     label: "Blog",            icon: "✍" },
  { href: "/dashboard/team",      label: "Team",            icon: "⊟" },
  { href: "/dashboard/services",  label: "Services",        icon: "❖" },
  { href: "/dashboard/contact",   label: "Contact Page",    icon: "✉" },
  { href: "/dashboard/inquiries", label: "Inquiries",       icon: "⊡" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-zinc-900/80 border-r border-white/[0.06] flex flex-col min-h-screen shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 28, width: "auto" }} />
        <span className="block text-white/25 text-[0.6rem] font-mono uppercase tracking-widest mt-2.5">
          Dashboard
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#3ABF8A]/12 text-[#3ABF8A] font-medium"
                  : "text-white/45 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
        >
          <span className="text-xs">↗</span>
          View site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors text-left"
        >
          <span>⇥</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
