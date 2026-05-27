"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { isLocale } from "@/lib/site-routing";
import { LocaleControl } from "@/components/site/SiteControls";
import ImmersiveLogo from "@/components/immersive/ImmersiveLogo";

const NAV_H = 86;
const LANGUAGE_LABELS = {
  language: "Switch language",
  theme: "Switch theme",
  current: "Current",
};

export default function Navbar({ inner = false }: { inner?: boolean }) {
  const primaryRef = useRef<HTMLElement>(null);
  const floatRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();

  /* ── Resolve nav links based on current path ── */
  const segments = pathname.split("/").filter(Boolean);
  const canonicalMode = segments[0] === "en" || segments[0] === "ar" ? segments[1] : null;
  const mode = canonicalMode === "focused" || canonicalMode === "creative" || canonicalMode === "immersive"
             ? canonicalMode
             : pathname.startsWith("/focused")   ? "focused"
             : pathname.startsWith("/creative")  ? "creative"
             : pathname.startsWith("/immersive") ? "immersive"
             : null;
  const canonicalBase = mode && canonicalMode === mode ? `/${segments[0]}/${mode}` : null;

  // On inner pages that aren't mode-prefixed (e.g. /work, /about, /services)
  // use full route links instead of homepage anchor links
  const isInnerPage = !mode && pathname !== "/";
  const localeSegment = segments[0] ?? "";
  const locale = isLocale(localeSegment) ? localeSegment : null;

  const navLinks = mode
    ? canonicalBase ? [
        { label: "Work",     href: `${canonicalBase}/work`     },
        { label: "Services", href: `${canonicalBase}/services` },
        { label: "About",    href: `${canonicalBase}/about`    },
        { label: "Contact",  href: `${canonicalBase}/contact`  },
      ] : [
        { label: "Work",     href: `/${mode}/work`    },
        { label: "Services", href: `/services`        },
        { label: "About",    href: `/about`           },
        { label: "Contact",  href: `/${mode}/contact` },
      ]
    : isInnerPage
    ? [
        { label: "Work",     href: "/work"     },
        { label: "Services", href: "/services" },
        { label: "About",    href: "/about"    },
        { label: "Contact",  href: "/#contact" },
      ]
    : [
        { label: "Work",     href: "/work"     },
        { label: "Services", href: "/services" },
        { label: "Process",  href: "#process"  },
        { label: "About",    href: "/about"    },
        { label: "Contact",  href: "#contact"  },
      ];

  const homeHref = canonicalBase ?? (mode ? `/${mode}` : "/");
  const ctaHref = canonicalBase ? `${canonicalBase}/contact` : mode ? `/${mode}/contact` : isInnerPage ? "/#contact" : "#contact";
  const isImmersive = mode === "immersive";
  const logoSrc = isImmersive ? "/immersive/nokx-studio-logo.svg" : "/dont%20forget%20logo.png";
  const logoAlt = isImmersive ? "NOKX Studio" : "DON'T FORGET";

  /* ── Full-screen overlay animation ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    const linkEls = linksRef.current?.querySelectorAll("a");
    if (!overlay || !linkEls) return;

    if (menuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        linkEls,
        { autoAlpha: 0, yPercent: 40 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.07, duration: 0.55, ease: "power3.out", delay: 0.12 }
      );
    } else {
      gsap.to(overlay, {
        autoAlpha: 0, duration: 0.28, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [menuOpen]);

  /* ── Entrance + scroll-swap ── */
  useEffect(() => {
    gsap.fromTo(primaryRef.current,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    if (isImmersive) {
      const onImmersiveScroll = () => {
        const nextCompact = window.scrollY > 42;
        setCompact(current => current === nextCompact ? current : nextCompact);
      };

      onImmersiveScroll();
      window.addEventListener("scroll", onImmersiveScroll, { passive: true });
      return () => window.removeEventListener("scroll", onImmersiveScroll);
    }

    let lastY   = 0;
    let ticking = false;

    const update = () => {
      const y     = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) { ticking = false; return; }

      const goingDown = delta > 0;
      const atTop     = y < 50;

      gsap.to(primaryRef.current, {
        y: (atTop || goingDown) ? "0%" : "-100%",
        duration: 0.4, ease: "expo.out", overwrite: true,
      });
      gsap.to(floatRef.current, {
        y: (!atTop && !goingDown) ? "0%" : "-100%",
        duration: 0.4, ease: "expo.out", overwrite: true,
      });

      lastY   = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inner, isImmersive]);

  return (
    <>
      {/* ── Full-screen menu overlay ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[998] hidden flex-col"
        style={{ background: "var(--bg)", visibility: "hidden" }}
      >
        <div className="wrap flex items-center justify-between" style={{ height: NAV_H }}>
          <Link href={homeHref} onClick={() => setMenuOpen(false)} aria-label="DON'T FORGET home" className={isImmersive ? "immersive-logo-link" : undefined}>
            {isImmersive ? (
              <ImmersiveLogo />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 134, width: "auto" }} />
              </>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-[54px] items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(var(--surface2-rgb),0.96)] px-7"
          >
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)]">Close</span>
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-px w-[18px] origin-center bg-[var(--fg)]" style={{ transform: "rotate(45deg) translate(4px, 3px)" }} />
              <span className="block h-px w-[18px] origin-center bg-[var(--fg)]" style={{ transform: "rotate(-45deg) translate(4px, -3px)" }} />
            </span>
          </button>
        </div>

        {/* Giant nav links */}
        <div ref={linksRef} className="flex flex-1 flex-col items-center justify-center gap-0">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="hed text-[6.5rem] leading-[1.05] text-[var(--fg)] transition-colors duration-200 hover:text-[var(--teal)]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="wrap flex items-center justify-between gap-4 border-t border-[var(--border)] py-6">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">
            © {new Date().getFullYear()} Don&apos;t Forget
          </span>
          {isImmersive && locale ? (
            <div className="immersive-menu-locale md:hidden">
              <LocaleControl locale={locale} theme="immersive" labels={LANGUAGE_LABELS} />
            </div>
          ) : null}
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">
            hello@dontforget.studio
          </span>
        </div>
      </div>

      {/* ── Header A: Primary ── */}
      <header
        ref={primaryRef}
        className={`${isImmersive ? "fixed" : "absolute"} left-0 right-0 top-0 z-[1000] flex items-center transition-[height,background,border-color,backdrop-filter] duration-500`}
        style={{
          height: isImmersive ? (compact ? 66 : NAV_H) : NAV_H,
          visibility: "hidden",
          background: isImmersive && compact ? "rgba(var(--bg-rgb),0.72)" : "transparent",
          borderBottom: isImmersive && compact ? "1px solid rgba(var(--teal-rgb),0.16)" : "1px solid transparent",
          backdropFilter: isImmersive && compact ? "blur(16px)" : "blur(0px)",
        }}
      >
        <div className="wrap flex w-full items-center justify-between">
          <Link href={homeHref} aria-label="DON'T FORGET home" className={isImmersive ? "immersive-logo-link" : undefined}>
            {isImmersive ? (
              <ImmersiveLogo compact={compact} />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dont%20forget%20logo.png"
                  alt="DON'T FORGET"
                  style={{ height: 134, width: "auto" }}
                />
              </>
            )}
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.slice(0, navLinks.length - 1).map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="relative font-mono text-[0.63rem] uppercase tracking-[0.26em] text-[var(--body)] transition-colors duration-200 hover:text-[var(--fg)] group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--teal)] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className={`${isImmersive ? "md:hidden" : "hidden"} h-11 items-center gap-3 rounded-[8px] border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(var(--surface-rgb),0.7)] px-5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)] backdrop-blur-xl`}
          >
            Menu
          </button>

          <div className="immersive-header-actions">
            {isImmersive && locale ? (
              <div className="immersive-locale-control">
                <LocaleControl
                  locale={locale}
                  theme="immersive"
                  labels={LANGUAGE_LABELS}
                />
              </div>
            ) : null}
            <Link href={ctaHref} className={`btn-glass transition-[transform] duration-500 ${isImmersive && compact ? "scale-[0.94]" : ""}`}>
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face" style={{ padding: "0.48rem 1.1rem", fontSize: "0.78rem" }}>Let&apos;s talk</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Header B: Floating ── */}
      {!isImmersive && <aside className="pointer-events-none fixed inset-x-0 top-0 z-[999]">
        <div
          ref={floatRef}
          className="pointer-events-auto"
          style={{ transform: "translateY(-100%)" }}
        >
          <div className="py-[18px]">
            <div className="wrap flex w-full items-center justify-between">
              <Link href={homeHref} className="flex shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt={logoAlt} style={{ height: 134, width: "auto" }} />
              </Link>

              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex h-[54px] items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(var(--surface2-rgb),0.96)] px-7 backdrop-blur-xl transition-colors hover:border-[var(--teal-mid)]"
              >
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)]">
                  Menu
                </span>
                <span className="flex flex-col gap-[5px]" aria-hidden="true">
                  <span className="block h-px w-[18px] bg-[var(--fg)] transition-all duration-300"
                    style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 3px)" : "none" }} />
                  <span className="block h-px w-[18px] bg-[var(--fg)] transition-all duration-300"
                    style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -3px)" : "none" }} />
                </span>
              </button>

              <Link
                href={ctaHref}
                className="flex h-[54px] items-center rounded-[8px] border border-[var(--border)] bg-[rgba(var(--surface2-rgb),0.96)] px-7 backdrop-blur-xl font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
              >
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </div>
      </aside>}
    </>
  );
}
