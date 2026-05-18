"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
      },
    });

    // Count from 0 to 100
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate() {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.val)).padStart(2, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${counter.val / 100})`;
      },
    })
    // Slide words up
    .to(wordRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: "power3.in",
    }, "-=0.1")
    // Wipe the whole loader up
    .to(el, {
      yPercent: -100,
      duration: 0.9,
      ease: "power3.inOut",
    }, "-=0.2")
    // Reveal page content
    .from("main > *:not(.noise-layer)", {
      autoAlpha: 0,
      y: 24,
      stagger: 0.06,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.5");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--ink)]"
      aria-hidden="true"
    >
      {/* Brand name */}
      <div className="overflow-hidden">
        <div ref={wordRef} className="brand-text text-2xl text-[var(--paper)] md:text-3xl">
          DON&apos;T <span className="text-[var(--teal)]">FORGET</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-12 h-px w-48 overflow-hidden bg-white/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-[var(--teal)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Counter */}
      <span
        ref={countRef}
        className="mt-4 font-mono text-xs tabular-nums tracking-[0.3em] text-[var(--text-muted)]"
      >
        00
      </span>
    </div>
  );
}
