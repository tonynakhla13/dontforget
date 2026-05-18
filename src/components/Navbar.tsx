"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const NAV_H = 86;

const links = [
  { label: "Work",    href: "#work"    },
  { label: "Process", href: "#process" },
  { label: "About",   href: "#about"   },
];

function LogoMark() {
  return (
    <a href="#" className="flex shrink-0 items-center">
      <div className="flex items-center justify-center rounded-[6px] bg-white px-3 py-[7px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dont%20forget%20logo.png"
          alt="DON'T FORGET"
          style={{ height: 28, width: "auto" }}
        />
      </div>
    </a>
  );
}

function NavLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`hidden items-center gap-8 md:flex ${className}`}>
      {links.map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            className="relative font-mono text-[0.63rem] uppercase tracking-[0.26em] text-[var(--body)] transition-colors duration-200 hover:text-[var(--fg)] group"
          >
            {label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--teal)] transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const primaryRef  = useRef<HTMLElement>(null);
  const floatRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal primary nav after loader
    gsap.fromTo(primaryRef.current,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 2.2 }
    );

    let lastY   = 0;
    let ticking = false;

    const update = () => {
      const y     = window.scrollY;
      const delta = y - lastY;

      // Ignore tiny Lenis inertial noise
      if (Math.abs(delta) < 6) { ticking = false; return; }

      const goingDown = delta > 0;
      const atTop     = y < 50;

      gsap.to(primaryRef.current, {
        y:         (atTop || goingDown) ? "0%" : "-100%",
        duration:  0.4,
        ease:      "expo.out",
        overwrite: true,
      });

      gsap.to(floatRef.current, {
        y:         (!atTop && !goingDown) ? "0%" : "-100%",
        duration:  0.4,
        ease:      "expo.out",
        overwrite: true,
      });

      lastY   = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Header A: Primary — absolute, slides up on scroll-down ── */}
      <header
        ref={primaryRef}
        className="absolute left-0 right-0 top-0 z-[1000] flex items-center"
        style={{ height: NAV_H, visibility: "hidden" }}
      >
        <div className="wrap flex w-full items-center justify-between">
          <LogoMark />
          <NavLinks />
          <a href="#contact" className="btn btn-primary py-2.5 px-5 text-[0.62rem]">
            Let&apos;s talk
          </a>
        </div>
      </header>

      {/* ── Header B: Floating — fixed, drops in on scroll-up ── */}
      <aside
        className="pointer-events-none fixed inset-x-0 top-0 z-[999]"
        style={{ height: NAV_H }}
      >
        <div
          ref={floatRef}
          className="pointer-events-auto"
          style={{ transform: "translateY(-100%)" }}
        >
          {/* Dark backdrop bar */}
          <div
            className="flex items-center border-b border-[var(--border)] backdrop-blur-xl"
            style={{
              height:     NAV_H,
              background: "rgba(9,9,9,0.92)",
            }}
          >
            <div className="wrap flex w-full items-center justify-between gap-4">

              {/* Logo tile — white box */}
              <a
                href="#"
                className="flex shrink-0 items-center justify-center rounded-[5px] bg-white px-3"
                style={{ height: 54 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dont%20forget%20logo.png"
                  alt="DON'T FORGET"
                  style={{ height: 32, width: "auto" }}
                />
              </a>

              {/* Center links */}
              <NavLinks />

              {/* CTA */}
              <a href="#contact" className="btn btn-primary py-2.5 px-5 text-[0.62rem]">
                Let&apos;s talk
              </a>

            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
