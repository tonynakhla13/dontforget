"use client";

import { useEffect, useRef } from "react";

const RGB = "70,174,34"; // #46ae22

export default function NoxGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentCanvas = ref.current;
    if (!currentCanvas) return;
    const currentContext = currentCanvas.getContext("2d");
    if (!currentContext) return;
    const canvas: HTMLCanvasElement = currentCanvas;
    const ctx: CanvasRenderingContext2D = currentContext;

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      COLS = Math.max(6, Math.round(canvas.width / CELL_TARGET));
    }

    /* ── main draw loop ─────────────────────────────────────────────── */
    function draw() {
      smoothScroll += (rawScroll - smoothScroll) * 0.09;

      const W    = canvas.width;
      const H    = canvas.height;
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
        return 0.18 + t * 0.32;
      }

      /* horizontal lines */
      for (let r = 0; r <= rows; r++) {
        const y0 = r * cell - offY;
        ctx.strokeStyle = `rgba(${RGB},${alpha(Math.max(0, Math.min(H, y0))).toFixed(3)})`;
        ctx.lineWidth   = 0.9;
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
          ctx.lineWidth   = 0.9;
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
    const handleMouseMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };
    const handleScroll = () => {
      rawScroll = window.scrollY;
    };
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="nox-grid-canvas"
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  );
}
