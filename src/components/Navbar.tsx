"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const links = [
  { label: "Work",    href: "#work"    },
  { label: "Process", href: "#process" },
  { label: "About",   href: "#about"   },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 group">
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon
          points="14,1.5 25,7.75 25,20.25 14,26.5 3,20.25 3,7.75"
          stroke="#3ABF8A" strokeWidth="1.5" fill="none"
        />
        <circle cx="14" cy="10.5" r="1.8" fill="#3ABF8A" />
        <line x1="14" y1="14" x2="14" y2="19" stroke="#3ABF8A" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--fg)]">
        Don&apos;t <span className="text-[var(--teal)]">Forget</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { autoAlpha: 0, y: -14, xPercent: -50 },
      { autoAlpha: 1, y: 0, xPercent: -50, duration: 1, ease: "power3.out", delay: 2.2 }
    );
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      style={{ left: "50%", transform: "translateX(-50%)" }}
      className={`fixed top-4 z-50 flex w-[min(980px,calc(100vw-1.5rem))] items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? "border-[var(--border)] bg-[rgba(9,9,9,0.88)]"
          : "border-white/[0.05] bg-[rgba(9,9,9,0.55)]"
      }`}
    >
      <Logo />

      <ul className="hidden items-center gap-8 md:flex">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="relative font-mono text-[0.65rem] uppercase tracking-[0.26em] text-[var(--body)] transition-colors duration-200 hover:text-[var(--fg)] group"
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
    </nav>
  );
}
