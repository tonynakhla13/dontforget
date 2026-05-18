"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "◈" },
  { href: "/dashboard/projects", label: "Projects", icon: "✦" },
  { href: "/dashboard/team", label: "Team", icon: "⟡" },
  { href: "/dashboard/services", label: "Services", icon: "◎" },
  { href: "/dashboard/contact", label: "Contact Page", icon: "✉" },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: "⊡" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-56 bg-zinc-900 border-r border-white/5 flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-white/5">
        <span className="text-white font-semibold tracking-tight text-sm">
          dontforget.
        </span>
        <span className="block text-white/30 text-xs mt-0.5">Dashboard</span>
      </div>

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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors text-left"
        >
          <span>⇥</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
