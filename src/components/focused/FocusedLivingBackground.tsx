"use client";

import { useEffect, useRef } from "react";

type Worm = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  turn: number;
  mood: number;
  toast: number;
  life: number;
};

const GREEN = "70, 209, 42";
const GRID = "70, 174, 34";
const SAYINGS = ["nox", "focus", "signal"];

function makeWorm(width: number, height: number, index: number, count = 1): Worm {
  const angle = (index * 1.83 + Math.random() * Math.PI) % (Math.PI * 2);
  const speed = 0.045 + Math.random() * 0.085;
  const spreadX = ((index * 0.61803398875) % 1) * width;
  const spreadY = ((index / Math.max(1, count)) * 0.82 + ((index * 0.31) % 0.18)) * height;
  return {
    x: Math.max(20, Math.min(width - 20, spreadX + (Math.random() - 0.5) * 90)),
    y: Math.max(20, Math.min(height - 20, spreadY + (Math.random() - 0.5) * 80)),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 12 + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
    turn: Math.random() > 0.5 ? 1 : -1,
    mood: index % SAYINGS.length,
    toast: 0,
    life: Infinity,
  };
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number,
  time: number,
  pointerX: number,
  pointerY: number,
  pointerHeat: number
) {
  const step = Math.round(96 * dpr);
  const offset = (time * 0.004 * dpr) % step;
  const px = pointerX * dpr;
  const py = pointerY * dpr;
  ctx.save();
  ctx.lineWidth = 1 * dpr;
  ctx.strokeStyle = `rgba(${GRID}, 0.045)`;
  ctx.beginPath();

  for (let x = -step + offset; x <= width + step; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = -step + offset; y <= height + step; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  const glow = 0.035 + pointerHeat * 0.07;
  const radius = 210 * dpr;
  const nearX = Math.round(px / step) * step;
  const nearY = Math.round(py / step) * step;

  ctx.strokeStyle = `rgba(${GREEN}, ${glow})`;
  for (let x = nearX - step * 2; x <= nearX + step * 2; x += step) {
    const fade = Math.max(0, 1 - Math.abs(x - px) / radius);
    if (fade <= 0) continue;
    ctx.globalAlpha = fade;
    ctx.beginPath();
    ctx.moveTo(x, Math.max(0, py - radius));
    ctx.lineTo(x, Math.min(height, py + radius));
    ctx.stroke();
  }
  for (let y = nearY - step * 2; y <= nearY + step * 2; y += step) {
    const fade = Math.max(0, 1 - Math.abs(y - py) / radius);
    if (fade <= 0) continue;
    ctx.globalAlpha = fade;
    ctx.beginPath();
    ctx.moveTo(Math.max(0, px - radius), y);
    ctx.lineTo(Math.min(width, px + radius), y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = `rgba(${GREEN}, ${0.045 + pointerHeat * 0.06})`;
  ctx.beginPath();
  ctx.moveTo(Math.max(0, px - radius * 0.42), py);
  ctx.lineTo(Math.min(width, px + radius * 0.42), py);
  ctx.moveTo(px, Math.max(0, py - radius * 0.42));
  ctx.lineTo(px, Math.min(height, py + radius * 0.42));
  ctx.stroke();
  ctx.restore();
}

function drawWorm(ctx: CanvasRenderingContext2D, worm: Worm, dpr: number, time: number) {
  const px = Math.max(6, Math.round(worm.size * dpr));
  const len = 3;
  const angle = Math.atan2(worm.vy, worm.vx);
  const dx = Math.cos(angle) >= 0 ? 1 : -1;
  const dy = Math.sin(angle) >= 0 ? 1 : -1;

  ctx.save();
  ctx.shadowColor = `rgba(${GREEN}, 0.35)`;
  ctx.shadowBlur = px * 0.45;

  for (let i = 0; i < len; i += 1) {
    const x = Math.round(worm.x * dpr - dx * px * i);
    const y = Math.round(worm.y * dpr - dy * px * i);
    ctx.fillStyle = `rgba(${GREEN}, ${0.88 - i * 0.04})`;
    ctx.fillRect(x, y, px, px);
  }

  if (worm.toast > 0) {
    const label = SAYINGS[worm.mood];
    const bx = worm.x * dpr + px * 1.4;
    const by = worm.y * dpr - px * 2.2;
    ctx.shadowBlur = 0;
    ctx.font = `${Math.max(9, 10 * dpr)}px monospace`;
    const bw = ctx.measureText(label).width + 12 * dpr;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.62 * worm.toast})`;
    ctx.fillRect(bx, by, bw, 18 * dpr);
    ctx.strokeStyle = `rgba(${GREEN}, ${0.55 * worm.toast})`;
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, 18 * dpr - 1);
    ctx.fillStyle = `rgba(${GREEN}, ${worm.toast})`;
    ctx.fillText(label, bx + 6 * dpr, by + 12.5 * dpr);
  }

  ctx.restore();
}

function drawBreak(ctx: CanvasRenderingContext2D, x: number, y: number, dpr: number, energy: number, time: number) {
  if (energy <= 0.02) return;
  const px = Math.round(5 * dpr);
  const originX = Math.round(x * dpr);
  const originY = Math.round(y * dpr);
  const arms = [
    [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1],
  ];

  ctx.save();
  ctx.shadowColor = `rgba(${GREEN}, ${0.2 * energy})`;
  ctx.shadowBlur = 9 * dpr * energy;
  arms.forEach(([dx, dy], index) => {
    const length = 3 + ((index + Math.floor(time * 0.006)) % 3);
    for (let i = 1; i <= length; i += 1) {
      const stepX = dx * px * i + (dy ? Math.sin(i + index) * px * 0.6 : 0);
      const stepY = dy * px * i + (dx ? Math.cos(i + index) * px * 0.6 : 0);
      ctx.fillStyle = `rgba(${GREEN}, ${energy * (0.35 - i * 0.035)})`;
      ctx.fillRect(Math.round(originX + stepX), Math.round(originY + stepY), px, px);
    }
  });
  ctx.restore();
}

export default function FocusedLivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let scrollKick = 0;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;
    let pointerHeat = 0;
    let lastPointerMoveTime = performance.now();
    let lastSpawnTime = 0;
    let breakEnergy = 0;
    let obstacles: DOMRect[] = [];
    let worms: Worm[] = [];

    const collectObstacles = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        "a, button, input, textarea, .tk-work-card, .tk-proj-row, .tk-svc-item, .tk-team-card, .tk-reel-frame"
      );
      obstacles = Array.from(nodes)
        .map((node) => node.getBoundingClientRect())
        .filter((rect) => rect.width > 20 && rect.height > 20 && rect.bottom > 0 && rect.top < window.innerHeight);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      width = Math.floor(window.innerWidth * dpr);
      height = Math.floor(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const count = Math.max(10, Math.min(18, Math.floor((window.innerWidth * window.innerHeight) / 68000)));
      worms = Array.from({ length: count }, (_, index) => worms[index] ?? makeWorm(window.innerWidth, window.innerHeight, index, count));
      collectObstacles();
    };

    const spawnAnt = (x: number, y: number, angle: number) => {
      const speed = 0.24 + Math.random() * 0.16;
      worms.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 9 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        turn: Math.random() > 0.5 ? 1 : -1,
        mood: worms.length % SAYINGS.length,
        toast: 0.35,
        life: 900 + Math.random() * 360,
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const dx = event.clientX - pointerX;
      const dy = event.clientY - pointerY;
      const pointerSpeed = Math.hypot(dx, dy);
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerHeat = Math.min(1, pointerHeat + 0.08);
      if (pointerSpeed > 2) {
        lastPointerMoveTime = performance.now();
      }

      worms.forEach((worm, index) => {
        const dist = Math.hypot(worm.x - pointerX, worm.y - pointerY);
        const directHit = dist < 54 || (pointerSpeed > 24 && dist < 115);
        if (directHit) {
          const angle = Math.atan2(worm.y - pointerY, worm.x - pointerX);
          const force = 0.9 + Math.min(pointerSpeed, 90) * 0.018;
          worm.vx = Math.cos(angle) * force + dx * 0.01;
          worm.vy = Math.sin(angle) * force + dy * 0.01;
          worm.turn *= -1;
          worm.mood = (worm.mood + 1 + index) % SAYINGS.length;
          worm.toast = 1;
        } else if (dist < 160) {
          const angle = Math.atan2(worm.y - pointerY, worm.x - pointerX) + (index % 2 ? 0.32 : -0.32);
          const force = (1 - dist / 160) * 0.12;
          worm.vx += Math.cos(angle) * force + dx * 0.0007;
          worm.vy += Math.sin(angle) * force + dy * 0.0007;
        }
      });
    };

    const onScroll = () => {
      const current = window.scrollY;
      scrollKick = Math.max(-54, Math.min(54, current - lastScrollY));
      lastScrollY = current;
      collectObstacles();
    };

    const tick = (time: number) => {
      const dt = Math.min(32, time - lastTime) / 16.67;
      lastTime = time;
      pointerHeat *= 0.94;
      scrollKick *= 0.9;
      const pointerStill = time - lastPointerMoveTime > 650;
      breakEnergy = pointerStill ? Math.min(0.62, breakEnergy + 0.012 * dt) : Math.max(0, breakEnergy - 0.08 * dt);

      if (pointerStill && breakEnergy > 0.5 && time - lastSpawnTime > 620 && worms.length < 24) {
        const base = time * 0.004 + worms.length;
        spawnAnt(pointerX + (Math.random() - 0.5) * 18, pointerY + (Math.random() - 0.5) * 18, base);
        lastSpawnTime = time;
      }

      ctx.clearRect(0, 0, width, height);
      drawBreak(ctx, pointerX, pointerY, dpr, breakEnergy, time);

      worms.forEach((worm, index) => {
        const idleTurn = Math.sin(time * 0.0008 + worm.phase) * 0.004;
        const fastScroll = Math.max(0, Math.abs(scrollKick) - 10);
        const speedBurst = fastScroll * 0.008;
        worm.vx += Math.cos(worm.phase + time * 0.00045) * idleTurn + scrollKick * 0.0002;
        worm.vy += Math.sin(worm.phase + time * 0.00055) * idleTurn + scrollKick * 0.001 + Math.sign(scrollKick) * fastScroll * 0.018;

        const speed = Math.hypot(worm.vx, worm.vy) || 1;
        const maxSpeed = 0.28 + pointerHeat * 0.5 + speedBurst * 2.8;
        if (speed > maxSpeed) {
          worm.vx = (worm.vx / speed) * maxSpeed;
          worm.vy = (worm.vy / speed) * maxSpeed;
        }

        worm.x += worm.vx * dt;
        worm.y += worm.vy * dt;

        const pad = worm.size;
        if (worm.x < -pad || worm.x > window.innerWidth + pad) {
          worm.vx *= -0.92;
          worm.x = Math.max(-pad, Math.min(window.innerWidth + pad, worm.x));
          worm.toast = Math.max(worm.toast, 0.8);
        }
        if (worm.y < -pad || worm.y > window.innerHeight + pad) {
          worm.vy *= -0.92;
          worm.y = Math.max(-pad, Math.min(window.innerHeight + pad, worm.y));
          worm.toast = Math.max(worm.toast, 0.8);
        }

        if (Math.abs(scrollKick) > 10) {
          const rect = obstacles[index % Math.max(1, obstacles.length)];
          const inset = worm.size * 1.6;
          const nextX = worm.x + worm.vx * (2 + Math.abs(scrollKick) * 0.16);
          const nextY = worm.y + worm.vy * (2 + Math.abs(scrollKick) * 0.16);
          if (
            rect &&
            nextX > rect.left - inset &&
            nextX < rect.right + inset &&
            nextY > rect.top - inset &&
            nextY < rect.bottom + inset
          ) {
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const horizontal = Math.abs(worm.x - cx) / rect.width > Math.abs(worm.y - cy) / rect.height;
            const impact = 1 + Math.abs(scrollKick) * 0.045;
            if (horizontal) {
              worm.vx = (worm.x < cx ? -impact : impact);
              worm.vy += (worm.y < cy ? -0.35 : 0.35);
            } else {
              worm.vy = (worm.y < cy ? -impact : impact);
              worm.vx += (worm.x < cx ? -0.35 : 0.35);
            }
            worm.x = Math.max(rect.left - inset, Math.min(rect.right + inset, worm.x));
            worm.y = Math.max(rect.top - inset, Math.min(rect.bottom + inset, worm.y));
            worm.toast = 1;
          }
        }

        worm.toast = Math.max(0, worm.toast - 0.018 * dt);
        worm.life -= Number.isFinite(worm.life) ? dt : 0;
        worm.vx *= 0.993;
        worm.vy *= 0.993;
        drawWorm(ctx, worm, dpr, time);
      });
      worms = worms.filter((worm) => worm.life > 0);

      frame = requestAnimationFrame(tick);
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="focused-living-background"
    />
  );
}
