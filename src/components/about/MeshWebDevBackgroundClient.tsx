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
import type Lenis from "lenis";

const MeshWebDevBackground = dynamic(
  () => import("./MeshWebDevBackground"),
  { ssr: false }
);

const FADE_START = 120; // px scrolled → begin fade
const FADE_END   = 480; // px scrolled → fully hidden

export default function MeshWebDevBackgroundClient() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Direct Lenis scroll listener — bypasses ScrollTrigger timing issues.
    // Lenis fires on every virtual scroll tick so opacity stays in sync.
    const handleScroll = ({ scroll }: { scroll: number }) => {
      const t = Math.min(1, Math.max(0, (scroll - FADE_START) / (FADE_END - FADE_START)));
      el.style.opacity = String(1 - t);
    };

    // Lenis is initialised by <SmoothScroll /> in the same render cycle.
    // Poll briefly in case its useEffect hasn't run yet.
    let lenis = (window as Window & { __lenis?: Lenis })["__lenis"];
    let interval: ReturnType<typeof setInterval> | null = null;

    const attach = (l: Lenis) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (l as any).on("scroll", handleScroll);
      // Trigger once synchronously so initial opacity is correct.
      handleScroll({ scroll: (l as any).actualScroll ?? 0 });
    };

    if (lenis) {
      attach(lenis);
    } else {
      interval = setInterval(() => {
        lenis = (window as Window & { __lenis?: Lenis })["__lenis"];
        if (lenis) {
          clearInterval(interval!);
          interval = null;
          attach(lenis);
        }
      }, 40);
    }

    return () => {
      if (interval) clearInterval(interval);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lenis as any)?.off("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <MeshWebDevBackground />
    </div>
  );
}
