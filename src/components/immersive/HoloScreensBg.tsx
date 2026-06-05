"use client";

/**
 * HoloScreensBg
 * Floating holographic screens — different sizes, opacities, depths.
 * Canvas 2D, fixed fullscreen, pointer-events none.
 * Uses NOX green #46AE22 (rgb 70,174,34).
 * Do NOT edit MeshGrid — this is a separate component.
 */

import { useEffect, useRef } from "react";

const G = "70,174,34"; // NOX green

type Screen = {
  x: number; y: number;
  vx: number; vy: number;
  w: number; h: number;
  cols: number; rows: number;
  opacity: number;
  phase: number;
  scanY: number;        // current scan-line Y position (0..1)
  scanSpeed: number;    // scan sweep speed
  hasBars: boolean;     // decorative data-bar row
  flickerPhase: number; // slight flicker offset
  depth: number;        // 0..1 (closer = brighter)
};

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function makeScreen(W: number, H: number): Screen {
  const depth = rnd(0.15, 1.0);
  const w     = rnd(70, 320) * (0.3 + depth * 0.7);
  // holographic screens tend toward wide ratios
  const ratio = rnd(0.28, 0.65);
  const h     = w * ratio;
  const speed = 0.04 + depth * 0.10;
  return {
    x: rnd(-w, W), y: rnd(-h, H),
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed * 0.55,
    w, h,
    cols: Math.round(rnd(3, 8)),
    rows: Math.round(rnd(2, 5)),
    opacity: 0.04 + depth * 0.22,
    phase: Math.random() * Math.PI * 2,
    scanY: Math.random(),
    scanSpeed: rnd(0.003, 0.010),
    hasBars: Math.random() > 0.55,
    flickerPhase: Math.random() * 100,
    depth,
  };
}

function makeScreens(count: number, W: number, H: number): Screen[] {
  return Array.from({ length: count }, () => makeScreen(W, H));
}

function drawScreen(ctx: CanvasRenderingContext2D, s: Screen, t: number) {
  const flicker = 1 - 0.07 * Math.sin(t * 13.7 + s.flickerPhase);
  const breath  = 0.82 + 0.18 * Math.sin(t * 0.55 + s.phase);
  const alpha   = s.opacity * breath * flicker;

  ctx.save();

  // ── outer border ──
  ctx.strokeStyle = `rgba(${G},${alpha})`;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(s.x, s.y, s.w, s.h);

  // ── corner brackets (L-shapes) ──
  const bk = Math.min(s.w, s.h) * 0.18;
  ctx.strokeStyle = `rgba(${G},${Math.min(1, alpha * 1.9)})`;
  ctx.lineWidth = 1.1;
  const corners = [
    [s.x,       s.y,       1,  1],
    [s.x + s.w, s.y,      -1,  1],
    [s.x,       s.y + s.h, 1, -1],
    [s.x + s.w, s.y + s.h,-1, -1],
  ] as [number, number, number, number][];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * bk, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * bk);
    ctx.stroke();
  }

  // ── inner grid ──
  ctx.strokeStyle = `rgba(${G},${alpha * 0.38})`;
  ctx.lineWidth = 0.35;
  const cw = s.w / s.cols;
  for (let c = 1; c < s.cols; c++) {
    ctx.beginPath();
    ctx.moveTo(s.x + c * cw, s.y);
    ctx.lineTo(s.x + c * cw, s.y + s.h);
    ctx.stroke();
  }
  const rh = s.h / s.rows;
  for (let r = 1; r < s.rows; r++) {
    ctx.beginPath();
    ctx.moveTo(s.x,       s.y + r * rh);
    ctx.lineTo(s.x + s.w, s.y + r * rh);
    ctx.stroke();
  }

  // ── sweep scan line ──
  const scanAbsY = s.y + s.scanY * s.h;
  const scanGrad = ctx.createLinearGradient(s.x, scanAbsY - 3, s.x, scanAbsY + 3);
  scanGrad.addColorStop(0,   `rgba(${G},0)`);
  scanGrad.addColorStop(0.5, `rgba(${G},${Math.min(1, alpha * 3.2)})`);
  scanGrad.addColorStop(1,   `rgba(${G},0)`);
  ctx.fillStyle = scanGrad;
  ctx.fillRect(s.x, scanAbsY - 3, s.w, 6);

  // ── decorative data bars (bottom row, some screens only) ──
  if (s.hasBars && s.h > 45) {
    const barZone = s.y + s.h - rh + 4;
    const barH    = rh - 8;
    const barW    = cw * 0.55;
    for (let c = 0; c < s.cols; c++) {
      const fill = 0.2 + 0.7 * Math.abs(Math.sin(t * 0.4 + c * 0.9 + s.phase));
      ctx.fillStyle = `rgba(${G},${alpha * 0.55})`;
      ctx.fillRect(s.x + c * cw + (cw - barW) / 2, barZone + barH * (1 - fill), barW, barH * fill);
    }
  }

  // ── corner dots ──
  ctx.fillStyle = `rgba(${G},${Math.min(1, alpha * 2.2)})`;
  const d = 2.4;
  [
    [s.x, s.y], [s.x + s.w, s.y],
    [s.x, s.y + s.h], [s.x + s.w, s.y + s.h],
  ].forEach(([px, py]) => ctx.fillRect(px - d / 2, py - d / 2, d, d));

  ctx.restore();

  // advance scan
  s.scanY += s.scanSpeed;
  if (s.scanY > 1) s.scanY = 0;
}

export default function HoloScreensBg({ count = 22 }: { count?: number }) {
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

    const ctx  = canvas.getContext("2d")!;
    let screens = makeScreens(count, canvas.width, canvas.height);
    let t = 0, raf = 0;

    const onResize = () => { screens = makeScreens(count, canvas.width, canvas.height); };
    window.addEventListener("resize", onResize);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // sort by depth so deeper (smaller) screens are drawn first
      screens.sort((a, b) => a.depth - b.depth);

      for (const s of screens) {
        drawScreen(ctx, s, t);

        s.x += s.vx;
        s.y += s.vy;
        const pad = Math.max(s.w, s.h) + 20;
        if (s.x >  W + pad) s.x = -pad;
        if (s.x < -pad)     s.x =  W + pad;
        if (s.y >  H + pad) s.y = -pad;
        if (s.y < -pad)     s.y =  H + pad;
      }

      t += 0.016;
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
