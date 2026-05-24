"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
};

function buildParticles(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const particles: Particle[] = [];
  if (!ctx) return particles;

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.max(54, Math.min(width * 0.105, 148))}px Arial Black, Impact, sans-serif`;
  ctx.fillText("DON'T FORGET", width / 2, height / 2);

  const image = ctx.getImageData(0, 0, width, height).data;
  const gap = width < 760 ? 7 : 6;

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = image[(y * width + x) * 4 + 3];
      if (alpha > 90) {
        particles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 80,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.4 + 0.8,
        });
      }
    }
  }

  return particles;
}

export default function ImmersiveFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 99999, y: 99999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(Math.floor(rect.width), Math.floor(rect.height));
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      mouseRef.current.x = 99999;
      mouseRef.current.y = 99999;
    };

    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(83, 230, 178, 0.86)";

      for (const p of particles) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.max(0, 1 - dist / 128);
        const homeX = (p.ox - p.x) * 0.034;
        const homeY = (p.oy - p.y) * 0.034;
        p.vx = (p.vx + homeX + (dx / dist) * force * 2.6) * 0.84;
        p.vy = (p.vy + homeY + (dy / dist) * force * 2.6) * 0.84;
        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = 0.52 + force * 0.38;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + force * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(tick);
    };

    resize();
    tick();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <footer className="relative z-10 overflow-hidden border-t border-[rgba(58,191,138,0.16)] bg-[rgba(3,7,6,0.82)] py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_42%,rgba(58,191,138,0.12),transparent_64%)]" />
      <div className="wrap relative">
        <canvas
          ref={canvasRef}
          className="h-[220px] w-full rounded-[1.25rem] border border-[rgba(58,191,138,0.12)] bg-transparent"
          aria-hidden="true"
        />
        <div className="mt-8 flex flex-col gap-5 border-t border-[rgba(58,191,138,0.12)] pt-6 md:flex-row md:items-center md:justify-between">
          <Link href="/immersive" className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.32em] text-[#F8F5EE]">
            Web development agency
          </Link>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-[#F8F5EE]/58">
            <Link href="/immersive/work" className="transition hover:text-[#53E6B2]">Work</Link>
            <Link href="/immersive/services" className="transition hover:text-[#53E6B2]">Services</Link>
            <Link href="/immersive/contact" className="transition hover:text-[#53E6B2]">Contact</Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
