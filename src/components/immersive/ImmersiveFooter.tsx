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

const footerLinks = [
  { href: "/immersive/work", label: "Work" },
  { href: "/immersive/services", label: "Services" },
  { href: "/immersive/about", label: "About" },
  { href: "/immersive/contact", label: "Contact" },
];

const signalPanels = [
  { label: "Build Mode", value: "Strategy / Design / Dev" },
  { label: "Launch Window", value: "2-6 week sprints" },
  { label: "Core Output", value: "Websites that feel alive" },
];

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
    <footer className="relative z-10 overflow-hidden border-t border-[rgba(var(--teal-rgb),0.2)] bg-[var(--bg)] py-16 text-[var(--fg)]">
      <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(var(--teal-rgb),0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent" />
      <div className="wrap relative">
        <div className="mb-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-[rgba(var(--teal-rgb),0.25)] bg-[rgba(var(--teal-rgb),0.08)] px-3 py-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.28em] text-[var(--immersive-mint)]">
              <span aria-hidden="true" className="h-2 w-2 bg-[var(--teal)] shadow-[0_0_18px_rgba(var(--teal-rgb),0.9)]" />
              Signal locked
            </div>
            <h2 className="hed max-w-[820px] text-[clamp(2.6rem,8vw,7.5rem)] leading-[0.86]">
              Build the future. Keep the humans.
            </h2>
          </div>
          <p className="max-w-[520px] font-mono text-xs uppercase leading-7 tracking-[0.2em] text-[rgba(var(--fg-rgb),0.62)] lg:justify-self-end">
            Digital systems, launch-ready sites, and interfaces with enough polish to make the robots ask who your designer is.
          </p>
        </div>

        <canvas
          ref={canvasRef}
          className="h-[220px] w-full border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(var(--surface-rgb),0.54)] shadow-[0_0_80px_rgba(var(--teal-rgb),0.08)]"
          aria-hidden="true"
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {signalPanels.map((panel) => (
            <div
              key={panel.label}
              className="border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(var(--teal-rgb),0.055)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <p className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.3em] text-[var(--teal)]">
                {panel.label}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--fg)]">
                {panel.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 border-y border-[rgba(var(--teal-rgb),0.14)] py-8 lg:grid-cols-[0.8fr_1fr_0.8fr] lg:items-center">
          <Link href="/immersive" className="group inline-flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/immersive/nokx-studio-logo.svg" alt="NOKX Studio" className="h-auto w-[clamp(128px,16vw,190px)]" />
            <span className="mt-3 block font-mono text-[0.56rem] uppercase tracking-[0.26em] text-[var(--immersive-warm)] transition group-hover:text-[var(--teal)]">
              web development agency
            </span>
          </Link>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-[rgba(var(--fg-rgb),0.62)] lg:justify-center">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--teal)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/immersive/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[rgba(var(--teal-rgb),0.35)] bg-[var(--teal)] px-5 font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-[var(--bg)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(var(--teal-rgb),0.24)]"
            >
              Start
            </Link>
            <Link
              href="/immersive/work"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[rgba(var(--fg-rgb),0.16)] px-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--fg)] transition hover:border-[var(--immersive-warm)] hover:text-[var(--immersive-warm)]"
            >
              Proof
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[rgba(var(--fg-rgb),0.45)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Don&apos;t Forget. Future-resistant pixels.</span>
          <span className="text-[var(--immersive-warm)] opacity-85">
            Punch line: if the footer starts floating, it&apos;s not a bug. It&apos;s applying for NASA.
          </span>
        </div>
      </div>
    </footer>
  );
}
