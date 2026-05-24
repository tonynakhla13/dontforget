"use client";

import { useEffect, useRef } from "react";

type Panel = {
  x: number; y: number;
  vx: number; vy: number;
  w: number; h: number;
  cols: number; rows: number;
  opacity: number;
  phase: number; // for breathing
};

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makePanel(W: number, H: number): Panel {
  const depth  = randBetween(0.2, 1.0);
  const w      = randBetween(80, 280) * (0.3 + depth * 0.7);
  const h      = w * randBetween(0.4, 0.7);
  const speed  = 0.06 + depth * 0.14;
  return {
    x: randBetween(-w, W),
    y: randBetween(-h, H),
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed * 0.65,
    w, h,
    cols: Math.round(randBetween(3, 7)),
    rows: Math.round(randBetween(2, 5)),
    opacity: 0.06 + depth * 0.18,
    phase: Math.random() * Math.PI * 2,
  };
}

function makePanels(count: number, W: number, H: number): Panel[] {
  return Array.from({ length: count }, () => makePanel(W, H));
}

export default function MeshGrid({ count = 18 }: { count?: number }) {
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
    let panels = makePanels(count, canvas.width, canvas.height);
    let t = 0;
    let raf: number;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of panels) {
        // breathe
        const alpha = p.opacity * (0.85 + 0.15 * Math.sin(t * 0.5 + p.phase));

        // border
        ctx.strokeStyle = `rgba(58,191,138,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // inner grid
        ctx.strokeStyle = `rgba(58,191,138,${alpha * 0.45})`;
        ctx.lineWidth = 0.35;

        const cw = p.w / p.cols;
        for (let c = 1; c < p.cols; c++) {
          ctx.beginPath();
          ctx.moveTo(p.x + c * cw, p.y);
          ctx.lineTo(p.x + c * cw, p.y + p.h);
          ctx.stroke();
        }

        const rh = p.h / p.rows;
        for (let r = 1; r < p.rows; r++) {
          ctx.beginPath();
          ctx.moveTo(p.x,        p.y + r * rh);
          ctx.lineTo(p.x + p.w,  p.y + r * rh);
          ctx.stroke();
        }

        // corner dots
        ctx.fillStyle = `rgba(58,191,138,${alpha * 1.4})`;
        const d = 2.5;
        ctx.fillRect(p.x - d / 2,           p.y - d / 2,           d, d);
        ctx.fillRect(p.x + p.w - d / 2,     p.y - d / 2,           d, d);
        ctx.fillRect(p.x - d / 2,           p.y + p.h - d / 2,     d, d);
        ctx.fillRect(p.x + p.w - d / 2,     p.y + p.h - d / 2,     d, d);

        // move
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        const pad = Math.max(p.w, p.h) + 20;
        if (p.x >  W + pad) p.x = -pad;
        if (p.x < -pad)     p.x =  W + pad;
        if (p.y >  H + pad) p.y = -pad;
        if (p.y < -pad)     p.y =  H + pad;
      }

      t += 0.016;
    };

    const onResize = () => {
      panels = makePanels(count, canvas.width, canvas.height);
    };
    window.addEventListener("resize", onResize);

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
