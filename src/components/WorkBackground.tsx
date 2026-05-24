"use client";

import { useEffect, useRef } from "react";

// ─── types ────────────────────────────────────────────────────────────────────
type Dot = {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
};

type Screen = {
  x: number; y: number;
  vx: number; vy: number;
  w: number; h: number;
  cols: number; rows: number;
  borderAlpha: number;
  gridAlpha: number;
  depth: number; // 0 far → 1 close
};

// ─── canvas helper ────────────────────────────────────────────────────────────
function makeCanvas(canvas: HTMLCanvasElement) {
  const W = () => canvas.width;
  const H = () => canvas.height;

  // ── dots (unused — kept for type compat) ──
  function makeDots(): Dot[] { return []; }

  // ── floating screens ──
  function makeScreen(): Screen {
    const depth = 0.15 + Math.random() * 0.85;        // deeper = smaller + dimmer
    const baseW  = 120 + Math.random() * 260;
    const w = baseW * (0.4 + depth * 0.6);
    const h = w * (0.45 + Math.random() * 0.45);
    return {
      x: Math.random() * (W() + w) - w * 0.5,
      y: Math.random() * (H() + h) - h * 0.5,
      vx: (Math.random() - 0.5) * 0.18 * (1 + depth * 0.5),
      vy: (Math.random() - 0.5) * 0.12 * (1 + depth * 0.5),
      w, h,
      cols: Math.round(3 + Math.random() * 5),
      rows: Math.round(2 + Math.random() * 4),
      borderAlpha: 0.08 + depth * 0.14,
      gridAlpha:   0.025 + depth * 0.05,
      depth,
    };
  }

  function makeScreens(count = 14): Screen[] {
    return Array.from({ length: count }, makeScreen);
  }

  return { W, H, makeDots, makeScreens, makeScreen };
}

// ─── draw ────────────────────────────────────────────────────────────────────
function drawFrame(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  screens: Screen[],
  W: number,
  H: number,
  t: number,
) {
  ctx.clearRect(0, 0, W, H);

  // ── draw screens (back to front by depth) ──
  const sorted = [...screens].sort((a, b) => a.depth - b.depth);
  for (const s of sorted) {
    const { x, y, w, h, cols, rows, borderAlpha, gridAlpha } = s;

    // subtle breathing opacity
    const breathe = 1 + 0.12 * Math.sin(t * 0.4 + s.depth * 5);

    // border
    ctx.strokeStyle = `rgba(58,191,138,${borderAlpha * breathe})`;
    ctx.lineWidth = 0.6;
    ctx.strokeRect(x, y, w, h);

    // inner grid lines
    ctx.strokeStyle = `rgba(58,191,138,${gridAlpha * breathe})`;
    ctx.lineWidth = 0.4;

    const cw = w / cols;
    for (let c = 1; c < cols; c++) {
      ctx.beginPath();
      ctx.moveTo(x + c * cw, y);
      ctx.lineTo(x + c * cw, y + h);
      ctx.stroke();
    }

    const rh = h / rows;
    for (let r = 1; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(x, y + r * rh);
      ctx.lineTo(x + w, y + r * rh);
      ctx.stroke();
    }

    // corner accent — small teal square at top-left
    const ca = 0.18 + depth_val(s) * 0.2;
    ctx.fillStyle = `rgba(58,191,138,${ca * breathe})`;
    ctx.fillRect(x, y, 4, 4);
    ctx.fillRect(x + w - 4, y + h - 4, 4, 4);
  }

}

function depth_val(s: Screen) { return s.depth; }

// ─── tick ────────────────────────────────────────────────────────────────────
function tick(
  dots: Dot[],
  screens: Screen[],
  W: number,
  H: number,
  t: number,
) {
  for (const d of dots) {
    d.x += d.vx; d.y += d.vy;
    if (d.x < -2) d.x = W + 2;
    if (d.x > W + 2) d.x = -2;
    if (d.y < -2) d.y = H + 2;
    if (d.y > H + 2) d.y = -2;
  }

  for (const s of screens) {
    s.x += s.vx; s.y += s.vy;
    // wrap with margin
    const pad = Math.max(s.w, s.h) + 20;
    if (s.x > W + pad) s.x = -pad;
    if (s.x < -pad)    s.x = W + pad;
    if (s.y > H + pad) s.y = -pad;
    if (s.y < -pad)    s.y = H + pad;
  }
  return t + 0.016;
}

// ─── component ───────────────────────────────────────────────────────────────
export default function WorkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;
    const { W, H, makeDots, makeScreens } = makeCanvas(canvas);

    let dots    = makeDots();
    let screens = makeScreens();
    let t = 0;
    let raf: number;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      drawFrame(ctx, dots, screens, W(), H(), t);
      t = tick(dots, screens, W(), H(), t);
    };

    // re-init on resize so counts stay sensible
    const onResize = () => {
      dots    = makeDots();
      screens = makeScreens();
    };
    window.addEventListener("resize", onResize);

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
}
