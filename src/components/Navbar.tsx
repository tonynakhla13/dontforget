"use client";

import { useEffect, useRef, useState } from "react";
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

export default function Navbar() {
  const primaryRef = useRef<HTMLElement>(null);
  const floatRef   = useRef<HTMLDivElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  useEffect(() => {
    gsap.fromTo(primaryRef.current,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 2.2 }
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
        y:        (atTop || goingDown) ? "0%" : "-100%",
        duration: 0.4, ease: "expo.out", overwrite: true,
      });
      gsap.to(floatRef.current, {
        y:        (!atTop && !goingDown) ? "0%" : "-100%",
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
  }, []);

  return (
    <>
      {/* ── Header A: Primary — absolute, inline links ── */}
      <header
        ref={primaryRef}
        className="absolute left-0 right-0 top-0 z-[1000] flex items-center"
        style={{ height: NAV_H, visibility: "hidden" }}
      >
        <div className="wrap flex w-full items-center justify-between">
          <LogoMark />

          <ul className="hidden items-center gap-8 md:flex">
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

          <a href="#contact" className="btn btn-primary py-2.5 px-5 text-[0.62rem]">
            Let&apos;s talk
          </a>
        </div>
      </header>

      {/* ── Header B: Floating — three independent pills ── */}
      <aside className="pointer-events-none fixed inset-x-0 top-0 z-[999]">
        <div
          ref={floatRef}
          className="pointer-events-auto"
          style={{ transform: "translateY(-100%)" }}
        >
          <div className="py-[18px]">
            <div className="wrap flex w-full items-center justify-between">

              {/* Pill 1 — Logo white tile */}
              <a
                href="#"
                className="flex shrink-0 items-center justify-center rounded-[8px] bg-white px-4"
                style={{ height: 54 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dont%20forget%20logo.png"
                  alt="DON'T FORGET"
                  style={{ height: 30, width: "auto" }}
                />
              </a>

              {/* Pill 2 — MENU + hamburger */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex h-[54px] items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.96)] px-7 backdrop-blur-xl transition-colors hover:border-[var(--teal-mid)]"
                >
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)]">
                    Menu
                  </span>
                  <span className="flex flex-col gap-[5px]" aria-hidden="true">
                    <span
                      className="block h-px bg-[var(--fg)] transition-all duration-300"
                      style={{ width: 18, transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }}
                    />
                    <span
                      className="block h-px bg-[var(--fg)] transition-all duration-300"
                      style={{ width: 18, transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }}
                    />
                  </span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 min-w-[160px] rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.98)] py-2 backdrop-blur-xl">
                    {links.map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-3.5 font-mono text-[0.63rem] uppercase tracking-[0.26em] text-[var(--body)] transition-colors hover:text-[var(--teal)]"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Pill 3 — LET'S TALK */}
              <a
                href="#contact"
                className="flex h-[54px] items-center rounded-[8px] border border-[var(--border)] bg-[rgba(14,14,14,0.96)] px-7 backdrop-blur-xl font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
              >
                Let&apos;s talk
              </a>

            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
