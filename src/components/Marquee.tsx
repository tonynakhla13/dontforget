"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const items = ["Brand systems", "Digital products", "Immersive web", "Motion identities"];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: 18,
      ease: "none",
    });

    return () => {
      tween.kill();
    };
  }, []);

  const sequence = [...items, ...items];

  return (
    <section aria-hidden="true" className="overflow-hidden border-b hairline py-10 md:py-12">
      <div ref={trackRef} className="marquee-track display-text text-4xl text-[rgba(248,243,234,0.18)] md:text-6xl">
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-12">
            {item}
            <span className="text-[var(--teal)]">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
