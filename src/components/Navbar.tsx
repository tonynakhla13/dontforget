"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const navLinks = ["Work", "Services", "About", "Contact"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { autoAlpha: 0, y: -12 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 2.2 }
    );

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed left-1/2 top-5 z-50 flex w-[min(1360px,calc(100vw-2.5rem))] -translate-x-1/2 items-center justify-between rounded-full border px-5 py-3.5 backdrop-blur-xl transition-all duration-500 ${
        scrolled
          ? "border-white/8 bg-black/75"
          : "border-white/8 bg-black/40"
      }`}
    >
      <a href="#" className="brand-text text-[0.72rem] text-[var(--paper)]">
        DON&apos;T <span className="text-[var(--teal)]">FORGET</span>
      </a>

      <ul className="hidden items-center gap-9 md:flex">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="group relative font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--paper)]"
            >
              {link}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[var(--teal)] transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="btn btn-ghost py-2.5 px-5 text-[0.65rem]"
      >
        Let&apos;s talk
      </a>
    </nav>
  );
}
