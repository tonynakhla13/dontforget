"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ImmersiveLogo from "@/components/immersive/ImmersiveLogo";
import { pagePath, parseCanonicalPath, themeHome } from "@/lib/site-routing";

const navigation = [
  { page: "work", label: "Work" },
  { page: "services", label: "Services" },
  { page: "about", label: "About" },
  { page: "contact", label: "Contact" },
] as const;

export default function ImmersiveFooter() {
  const pathname = usePathname();
  const route = parseCanonicalPath(pathname);
  const homeHref = route ? themeHome(route.locale, route.theme) : "/immersive";
  const hrefFor = (page: (typeof navigation)[number]["page"]) =>
    route ? pagePath(route.locale, route.theme, page) : `/immersive/${page}`;
  const contactHref = hrefFor("contact");

  return (
    <footer className="relative z-10 overflow-hidden border-t border-[rgba(var(--teal-rgb),0.18)] bg-[var(--bg)] text-[var(--fg)]">
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(var(--teal-rgb),0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.04)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[var(--immersive-particles)] via-[rgba(var(--teal-rgb),0.45)] to-transparent" />
      <div className="pointer-events-none absolute -left-36 top-12 h-80 w-80 rounded-full bg-[rgba(var(--teal-rgb),0.10)] blur-[130px]" />

      <div className="wrap relative py-[clamp(4rem,8vw,7rem)]">
        <div className="grid gap-14 border-b border-[rgba(var(--fg-rgb),0.10)] pb-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-[minmax(18rem,0.85fr)_minmax(30rem,1.15fr)] lg:items-end">
          <div className="flex flex-col gap-10">
            <Link href={homeHref} className="immersive-logo-link immersive-footer-logo inline-flex w-fit" aria-label="DON'T FORGET home">
              <ImmersiveLogo />
            </Link>

            <p className="max-w-[29rem] text-[clamp(0.95rem,1.2vw,1.08rem)] leading-[1.8] text-[var(--body)]">
              Independent digital studio building expressive websites, products, and brand systems with a clear purpose.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="mb-5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.36em] text-[var(--immersive-particles)]">
              Start a project
            </p>
            <h2 className="hed max-w-[700px] text-[clamp(3rem,6.5vw,6.7rem)] leading-[0.87] tracking-[-0.045em]">
              Make it hard<br />to forget.
            </h2>
            <Link href={contactHref} className="btn-glass mt-10 inline-flex">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">
                Let&apos;s talk <span className="btn-glass-arrow">-&gt;</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-b border-[rgba(var(--fg-rgb),0.10)] py-9 md:grid-cols-[1fr_auto] md:items-center">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-9 gap-y-4">
            {navigation.map(({ page, label }) => (
              <Link
                key={page}
                href={hrefFor(page)}
                className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[var(--body)] transition-colors duration-200 hover:text-[var(--immersive-accent)] focus-visible:text-[var(--immersive-accent)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <a
            href="mailto:hello@dontforget.studio"
            className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--fg)] transition-colors duration-200 hover:text-[var(--immersive-accent)]"
          >
            hello@dontforget.studio
          </a>
        </div>

        <div className="flex flex-col gap-4 pt-7 font-mono text-[0.56rem] uppercase tracking-[0.25em] text-[rgba(var(--fg-rgb),0.44)] md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Don&apos;t Forget. All rights reserved.</span>
          <span className="inline-flex items-center gap-3 text-[var(--body)]">
            <span className="h-1.5 w-1.5 bg-[var(--immersive-particles)] shadow-[0_0_12px_var(--immersive-particles)]" aria-hidden="true" />
            Available for selected work
          </span>
        </div>
      </div>
    </footer>
  );
}
