"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Loader() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const numRef   = useRef<HTMLSpanElement>(null);
  const tagRef   = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => { document.body.style.overflow = ""; setDone(true); },
    });

    const counter = { v: 0 };

    tl.to(counter, {
      v: 100,
      duration: 1.75,
      ease: "power2.inOut",
      onUpdate() {
        const n = Math.round(counter.v);
        if (numRef.current)  numRef.current.textContent  = String(n).padStart(3, "0");
        if (barRef.current)  barRef.current.style.transform = `scaleX(${n / 100})`;
      },
    })
    .to(tagRef.current, { yPercent: -110, duration: 0.6, ease: "power3.in" }, "-=0.1")
    .to(rootRef.current, { yPercent: -100, duration: 0.85, ease: "power3.inOut" }, "-=0.15")
    .from("main > *:not(.noise):not(script)", {
      autoAlpha: 0, y: 18, stagger: 0.055, duration: 0.6, ease: "power3.out",
    }, "-=0.45");

    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg)]"
      aria-hidden="true"
    >
      <div className="overflow-hidden">
        <div ref={tagRef} className="flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1.5 25,7.75 25,20.25 14,26.5 3,20.25 3,7.75"
              stroke="#3ABF8A" strokeWidth="1.5" fill="none" />
            <circle cx="14" cy="10.5" r="1.8" fill="#3ABF8A" />
            <line x1="14" y1="14" x2="14" y2="19" stroke="#3ABF8A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--fg)]">
            Don&apos;t <span className="text-[var(--teal)]">Forget</span>
          </span>
        </div>
      </div>

      <div className="mt-14 h-px w-48 overflow-hidden bg-white/[0.07]">
        <div ref={barRef} className="h-full w-full origin-left bg-[var(--teal)]" style={{ transform: "scaleX(0)" }} />
      </div>

      <span ref={numRef} className="mt-4 font-mono text-[0.58rem] tabular-nums tracking-[0.42em] text-[var(--body)]">
        000
      </span>
    </div>
  );
}
