"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* Module-level ref so triggerPageTransition() can be called from anywhere */
let _el: HTMLDivElement | null = null;

/**
 * Fade the page out to black, call `onMidpoint` (navigate), then fade back in.
 * Falls back to an immediate call if the overlay hasn't mounted yet.
 */
export function triggerPageTransition(onMidpoint: () => void) {
  if (!_el) {
    onMidpoint();
    return;
  }
  const el = _el;
  gsap
    .timeline()
    .set(el, { pointerEvents: "all" })
    .fromTo(el, { opacity: 0 }, {
      opacity: 1,
      duration: 0.28,
      ease: "power2.in",
      onComplete: onMidpoint,
    })
    .to(el, { opacity: 0, duration: 0.42, ease: "power2.out", delay: 0.08 })
    .set(el, { pointerEvents: "none" });
}

export default function PageTransitionOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    _el = ref.current;
    return () => { _el = null; };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0d0d0d",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
