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
  const shellRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50, repeat: -1, duration: 22, ease: "none",
    });

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: shell,
        start: "top 84%",
        once: true,
      },
    });

    intro
      .fromTo(
        shell,
        { autoAlpha: 0, y: -180, scaleY: 0.28, rotate: -2.2 },
        {
          autoAlpha: 1,
          y: 18,
          scaleY: 1.12,
          rotate: 0.8,
          duration: 0.42,
          ease: "power4.in",
        }
      )
      .to(shell, {
        y: 0,
        scaleY: 1,
        rotate: 0,
        duration: 0.34,
        ease: "elastic.out(1, 0.55)",
      });

    return () => {
      tween.kill();
      intro.kill();
    };
  }, []);

  const seq = [...items, ...items];

  return (
    <div
      ref={shellRef}
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
