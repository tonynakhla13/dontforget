"use client";

import { useEffect, useRef } from "react";

/**
 * Creative-mode custom cursor
 *
 * • .cc-dot  — 7px lime circle, snaps to cursor instantly
 * • .cc-ring — 30px ink-border circle, lags (lerp 0.10),
 *              squash-stretches toward movement direction,
 *              flips to lime on hover over interactive elements
 */
export default function CreativeCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -500, my = -500;
    let rx = -500, ry = -500;
    let vx = 0,    vy = 0;
    let hovering = false;
    let raf: number;

    /* ── Follow cursor exactly ── */
    const onMove = (e: MouseEvent) => {
      vx = e.clientX - mx;
      vy = e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      }
    };

    /* ── Hover detection ── */
    const SEL = "a, button, [role='button'], input, textarea, select, label, [tabindex]";
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(SEL)) {
        hovering = true;
        dotRef.current?.classList.add("cc--hover");
        ringRef.current?.classList.add("cc--hover");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(SEL)) {
        hovering = false;
        dotRef.current?.classList.remove("cc--hover");
        ringRef.current?.classList.remove("cc--hover");
      }
    };

    /* ── Spring ring + squash-stretch ── */
    const tick = () => {
      raf = requestAnimationFrame(tick);
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;

      const speed   = Math.sqrt(vx * vx + vy * vy);
      const angle   = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretch = hovering ? 1 : Math.min(1.65, 1 + speed * 0.026);
      const squeeze = hovering ? 1 : 1 / stretch;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))` +
          ` rotate(${angle.toFixed(1)}deg)` +
          ` scaleX(${stretch.toFixed(3)}) scaleY(${squeeze.toFixed(3)})`;
      }
    };
    tick();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout",  onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div ref={dotRef} className="cc-dot" aria-hidden />

      {/* Ring */}
      <div ref={ringRef} className="cc-ring" aria-hidden />

      <style>{`
        /* ── Hide system cursor across creative mode ── */
        .creative-mode,
        .creative-mode * { cursor: none !important; }

        /* ── Shared cursor base ── */
        .cc-dot, .cc-ring {
          position: fixed;
          top: 0; left: 0;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }

        /* ── Dot ── */
        .cc-dot {
          width: 7px; height: 7px;
          background: #a8fd02;
          z-index: 99999;
          transition: width .2s, height .2s, background .2s;
        }
        .cc-dot.cc--hover {
          background: rgb(35,31,32);
          width: 10px; height: 10px;
        }

        /* ── Ring ── */
        .cc-ring {
          width: 30px; height: 30px;
          border: 1.5px solid rgb(35,31,32);
          background: transparent;
          z-index: 99998;
          transition: border-color .2s, background .2s, width .22s, height .22s;
        }
        .cc-ring.cc--hover {
          width: 46px; height: 46px;
          border-color: #a8fd02;
          background: rgba(168,253,2,0.10);
        }
      `}</style>
    </>
  );
}
