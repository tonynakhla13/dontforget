"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

// Load Three.js scene only on client
const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(headingRef.current, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    })
      .from(
        subRef.current,
        { y: 40, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.7"
      )
      .from(
        ctaRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Three.js Background */}
      <div className="absolute inset-0 opacity-70">
        <HeroScene />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <h1
          ref={headingRef}
          className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6"
        >
          We Build
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Digital
          </span>
          <br />
          Experiences
        </h1>

        <p
          ref={subRef}
          className="text-white/60 text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
        >
          A creative web agency that crafts fast, beautiful, and memorable
          digital products — from strategy to launch.
        </p>

        <div ref={ctaRef} className="flex gap-4 flex-wrap">
          <a
            href="#work"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            See Our Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border border-white/30 text-white rounded-full font-semibold hover:border-white/70 transition-all duration-300"
          >
            Get a Quote
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
        <span>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
