"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const NAV_H = 86;

export default function Navbar({ inner = false }: { inner?: boolean }) {
  const primaryRef = useRef<HTMLElement>(null);
  const floatRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* ── Resolve nav links based on current path ── */
  const mode = pathname.startsWith("/focused")   ? "focused"
             : pathname.startsWith("/creative")  ? "creative"
             : pathname.startsWith("/immersive") ? "immersive"
             : null;

  const navLinks = mode
    ? [
        { label: "Work",    href: `/${mode}/work`    },
        { label: "About",   href: `/about`           },
        { label: "Contact", href: `/${mode}/contact` },
      ]
    : [
        { label: "Work",    href: "#work"    },
        { label: "Process", href: "#process" },
        { label: "About",   href: "/about"   },
        { label: "Contact", href: "#contact" },
      ];

  const ctaHref = mode ? `/${mode}/contact` : "#contact";

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
    // Only delay entrance on home pages to sync with Loader.
    // On inner pages (or if Loader already ran), show immediately.
    const isFirstLoad = !sessionStorage.getItem("df_loader_shown");
    const delay = (!inner && isFirstLoad) ? 2.2 : 0;

    gsap.fromTo(primaryRef.current,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay }
    );

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
  }, [inner]);

  return (
    <>
      {/* ── Full-screen menu overlay ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[998] hidden flex-col"
        style={{ background: "var(--bg)", visibility: "hidden" }}
      >
        <div className="wrap flex items-center justify-between" style={{ height: NAV_H }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href={mode ? `/${mode}` : "#"} onClick={() => setMenuOpen(false)}>
            <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 134, width: "auto" }} />
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-[54px] items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.96)] px-7"
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

        <div className="wrap flex items-center justify-between border-t border-[var(--border)] py-6">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">
            © {new Date().getFullYear()} Don&apos;t Forget
          </span>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">
            hello@dontforget.studio
          </span>
        </div>
      </div>

      {/* ── Header A: Primary ── */}
      <header
        ref={primaryRef}
        className="absolute left-0 right-0 top-0 z-[1000] flex items-center"
        style={{ height: NAV_H, visibility: "hidden" }}
      >
        <div className="wrap flex w-full items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href={mode ? `/${mode}` : "#"}>
            <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 134, width: "auto" }} />
          </a>

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

          <Link href={ctaHref} className="btn btn-primary py-2.5 px-5 text-[0.62rem]">
            Let&apos;s talk
          </Link>
        </div>
      </header>

      {/* ── Header B: Floating ── */}
      <aside className="pointer-events-none fixed inset-x-0 top-0 z-[999]">
        <div
          ref={floatRef}
          className="pointer-events-auto"
          style={{ transform: "translateY(-100%)" }}
        >
          <div className="py-[18px]">
            <div className="wrap flex w-full items-center justify-between">
              <Link href={mode ? `/${mode}` : "#"} className="flex shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 134, width: "auto" }} />
              </Link>

              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex h-[54px] items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.96)] px-7 backdrop-blur-xl transition-colors hover:border-[var(--teal-mid)]"
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
                className="flex h-[54px] items-center rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.96)] px-7 backdrop-blur-xl font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
              >
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
