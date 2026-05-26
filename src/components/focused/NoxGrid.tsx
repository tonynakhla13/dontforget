"use client";

import { useEffect, useRef } from "react";

const RGB = "70,174,34"; // #46ae22

export default function NoxGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;

    let raf: number;
    let mx = -9999, my = -9999;
    let rawScroll   = window.scrollY;
    let smoothScroll = rawScroll;

    const CELL_TARGET = 82;   // aim for ~82px cells at any screen width
    const MOUSE_R    = 180;   // repel radius px
    const MOUSE_PUSH = 36;    // max repel distance px
    const PARALLAX   = 0.22;  // grid scrolls at 22% of page speed

    let COLS = Math.max(6, Math.round(window.innerWidth / CELL_TARGET));

    /* ── resize ─────────────────────────────────────────────────────── */
    function resize() {
      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;
      COLS = Math.max(6, Math.round(cvs.width / CELL_TARGET));
    }

    /* ── main draw loop ─────────────────────────────────────────────── */
    function draw() {
      smoothScroll += (rawScroll - smoothScroll) * 0.09;

      const W    = cvs.width;
      const H    = cvs.height;
      const cell = W / COLS;
      const rows = Math.ceil(H / cell) + 3;
      const offY = (smoothScroll * PARALLAX) % cell;

      ctx.clearRect(0, 0, W, H);

      /* build distorted intersection points */
      const P: [number, number][][] = [];
      for (let r = 0; r <= rows; r++) {
        P[r] = [];
        for (let c = 0; c <= COLS; c++) {
          let x = c * cell;
          let y = r * cell - offY;
          const dx = x - mx, dy = y - my;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_R && d > 0) {
            const f = Math.pow(1 - d / MOUSE_R, 2) * MOUSE_PUSH;
            x += (dx / d) * f;
            y += (dy / d) * f;
          }
          P[r][c] = [x, y];
        }
      }

      /* alpha: bottom of screen is brighter — sections feel like they're
         rising toward the viewer as you scroll */
      function alpha(y: number) {
        const t = Math.max(0, Math.min(1, y / H));
        return 0.07 + t * 0.13;
      }

      /* horizontal lines */
      for (let r = 0; r <= rows; r++) {
        const y0 = r * cell - offY;
        ctx.strokeStyle = `rgba(${RGB},${alpha(Math.max(0, Math.min(H, y0))).toFixed(3)})`;
        ctx.lineWidth   = 0.55;
        ctx.beginPath();
        P[r].forEach(([x, y], c) => c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.stroke();
      }

      /* vertical lines — drawn segment-by-segment so each segment fades
         correctly based on its vertical position */
      for (let c = 0; c <= COLS; c++) {
        for (let r = 0; r < rows; r++) {
          const [x0, y0] = P[r][c];
          const [x1, y1] = P[r + 1][c];
          const midY = (y0 + y1) * 0.5;
          ctx.strokeStyle = `rgba(${RGB},${alpha(Math.max(0, Math.min(H, midY))).toFixed(3)})`;
          ctx.lineWidth   = 0.55;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    /* ── event listeners ────────────────────────────────────────────── */
    resize();
    window.addEventListener("resize",    resize,                              { passive: true });
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener("scroll",    () => { rawScroll = window.scrollY; }, { passive: true });

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("scroll",    () => {});
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  );
}
