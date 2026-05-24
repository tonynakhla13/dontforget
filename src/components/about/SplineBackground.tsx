"use client";

/**
 * SplineBackground
 *
 * Full-viewport fixed layer that renders a Spline 3D scene behind all page
 * content. Lives at z-0 (behind main z-[1] content).
 * A thin pointer-events-none overlay sits on top so the canvas can
 * initialise normally while never stealing clicks or scroll.
 */

import dynamic from "next/dynamic";

// Lazy-load the heavy Spline runtime — no SSR needed
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

export default function SplineBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0"
      style={{ zIndex: 0 }}
    >
      {/* Canvas renders with full pointer events so WebGL context can init */}
      <Spline
        scene="https://prod.spline.design/sdtWmiLUhr6BiyBN/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Transparent overlay blocks interaction without touching the canvas */}
      <div className="pointer-events-none absolute inset-0" />
    </div>
  );
}
