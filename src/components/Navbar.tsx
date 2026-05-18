"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const navLinks = ["Work", "Services", "About", "Contact"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -18,
      duration: 0.9,
      ease: "power3.out",
    });

    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed left-1/2 top-4 z-50 flex w-[min(1240px,calc(100vw-32px))] -translate-x-1/2 items-center justify-between rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-500 md:px-5 ${
        scrolled
          ? "border-white/10 bg-black/70 backdrop-blur-xl"
          : "border-white/10 bg-black/45"
      }`}
    >
      <a href="#" className="display-text text-lg tracking-tight text-[var(--paper)]">
        dont<span className="text-[var(--teal)]">forget</span>
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="group relative font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-dark)] transition-colors duration-300 hover:text-[var(--paper)]"
            >
              {link}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-[var(--teal)] transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="rounded-full border border-[rgba(0,200,176,0.45)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--paper)] transition-all duration-300 hover:bg-[var(--teal)] hover:text-[var(--ink)]"
      >
        Start
      </a>
    </nav>
  );
}
