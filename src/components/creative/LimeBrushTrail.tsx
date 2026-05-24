"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Lime brush-paint trail that follows the cursor.

   Technique:
     • Fixed canvas, pointer-events:none, z-index above content
     • On mousemove → push a timestamped point with velocity
     • Each RAF frame → clear, trim expired points, redraw:
         1. Wide soft outer glow pass
         2. Narrow opaque core stroke
         3. Bright tip dot at cursor
     • Width varies inversely with speed  (slow = thick, fast = thin)
     • Opacity falls off quadratically with age
───────────────────────────────────────────────────────────────────────── */

const LIME    = "168, 253, 2" as const;   // #a8fd02
const LIFE_MS = 800;                       // how long each point lives
const W_MAX   = 18;                        // px — brush width when slow
const W_MIN   = 3;                         // px — brush width when fast
const SPEED_K = 0.35;                      // speed → width damping

interface Pt { x: number; y: number; t: number; speed: number }

export default function LimeBrushTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts       = useRef<Pt[]>([]);
  const prev      = useRef({ x: 0, y: 0 });
  const raf       = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - prev.current.x;
      const dy = e.clientY - prev.current.y;
      pts.current.push({
        x: e.clientX, y: e.clientY,
        t: performance.now(),
        speed: Math.sqrt(dx * dx + dy * dy),
      });
      prev.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      pts.current = pts.current.filter(p => now - p.t < LIFE_MS);
      const p = pts.current;
      if (p.length < 2) return;

      for (let i = 1; i < p.length; i++) {
        const age  = now - p[i - 1].t;
        const life = Math.max(0, 1 - age / LIFE_MS);
        const a    = life * life;                                       // quadratic fade
        const w    = W_MIN + (W_MAX - W_MIN) * Math.max(0, 1 - p[i].speed * SPEED_K / 10);

        /* Soft outer glow */
        ctx.beginPath();
        ctx.moveTo(p[i - 1].x, p[i - 1].y);
        ctx.lineTo(p[i].x, p[i].y);
        ctx.strokeStyle = `rgba(${LIME},${(a * 0.22).toFixed(3)})`;
        ctx.lineWidth   = w * 2.8;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.stroke();

        /* Core stroke */
        ctx.beginPath();
        ctx.moveTo(p[i - 1].x, p[i - 1].y);
        ctx.lineTo(p[i].x, p[i].y);
        ctx.strokeStyle = `rgba(${LIME},${(a * 0.88).toFixed(3)})`;
        ctx.lineWidth   = w;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.stroke();
      }

      /* Bright tip at cursor */
      const last = p[p.length - 1];
      const tipAge  = Math.max(0, 1 - (now - last.t) / LIFE_MS);
      if (tipAge > 0) {
        ctx.beginPath();
        ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LIME},${(tipAge * 0.95).toFixed(3)})`;
        ctx.fill();
        /* tip glow */
        ctx.beginPath();
        ctx.arc(last.x, last.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LIME},${(tipAge * 0.18).toFixed(3)})`;
        ctx.fill();
      }
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9990 }}
    />
  );
}
