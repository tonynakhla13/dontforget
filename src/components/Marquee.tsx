"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const items = [
  "Brand systems",
  "Digital products",
  "Immersive web",
  "Motion identities",
  "No boring websites",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to(trackRef.current, {
      xPercent: -50, repeat: -1, duration: 22, ease: "none",
    });
    return () => { tween.kill(); };
  }, []);

  const seq = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[var(--border)] py-7"
      style={{ background: "var(--surface)" }}
    >
      <div
        ref={trackRef}
        className="marquee-track hed text-[clamp(1.8rem,3.5vw,3.2rem)] text-[rgba(240,236,227,0.09)]"
      >
        {seq.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            {item}
            <span className="text-[var(--teal)] opacity-50 text-xl">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
