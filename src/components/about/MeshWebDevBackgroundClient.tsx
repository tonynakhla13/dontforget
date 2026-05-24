"use client";

/**
 * MeshWebDevBackgroundClient
 *
 * Owns the fixed positioning for MeshWebDevBackground and cross-fades it
 * out as the user scrolls through the hero, revealing KnotOnly below.
 *
 * Stacking (all at z-0, DOM order determines visual order):
 *   1. KnotOnly       — first in DOM → behind
 *   2. This wrapper   — second in DOM → in front of KnotOnly
 *   3. <main z-[1]>   — page content, above both
 */

import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const MeshWebDevBackground = dynamic(
  () => import("./MeshWebDevBackground"),
  { ssr: false }
);

export default function MeshWebDevBackgroundClient() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade the entire snake canvas from opaque → invisible as the user
      // scrolls from page-top through the hero (~100vh). KnotOnly (behind)
      // becomes fully visible once the snake is gone.
      gsap.fromTo(
        el,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            // Start fading when "Our Story" section top hits 80% of viewport,
            // finish by the time it reaches 20% — so the snake is fully gone
            // before the section content is in focus.
            trigger: "#our-story",
            start: "top 80%",
            end: "top 20%",
            scrub: 1.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <MeshWebDevBackground />
    </div>
  );
}
