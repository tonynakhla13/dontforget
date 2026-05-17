"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const navLinks = ["Work", "Services", "About", "Contact"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Animate nav in on load
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Track scroll for background blur
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 px-8 py-5 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-black/60 backdrop-blur-md border-b border-white/10" : ""
      }`}
    >
      {/* Logo */}
      <a href="#" className="text-white font-bold text-xl tracking-tight">
        don<span className="text-indigo-400">forget</span>
      </a>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-white/70 hover:text-white text-sm tracking-wide transition-colors duration-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        className="hidden md:block px-5 py-2 rounded-full border border-indigo-500 text-indigo-400 text-sm hover:bg-indigo-500 hover:text-white transition-all duration-300"
      >
        Let&apos;s Talk
      </a>
    </nav>
  );
}
