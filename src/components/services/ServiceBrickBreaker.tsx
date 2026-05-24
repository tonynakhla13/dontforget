"use client";

import { useEffect, useMemo, useRef } from "react";

type Brick = {
  x: number;
  y: number;
  targetY: number;
  w: number;
  h: number;
  label: string;
  gone: boolean;
  color: number;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
};

type GameState = {
  status: "playing" | "gameover" | "cleared";
  score: number;
  labelIndex: number;
  nextRowAt: number;
  resetAt: number;
};

type ServiceBrickBreakerProps = {
  serviceTitle: string;
  features: readonly string[];
  tech: readonly string[];
};

const EXTRA_BRICKS = [
  "Landing pages",
  "Web apps",
  "Dashboards",
  "CMS",
  "Motion",
  "3D web",
  "Next.js",
  "React",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "TypeScript",
  "Tailwind",
  "SEO",
  "Analytics",
  "Conversion",
  "Accessibility",
  "Performance",
  "Integrations",
  "Launch support",
  "Design systems",
  "Prototypes",
  "APIs",
  "Automation",
];

const BRICK_COLORS = [
  { fill: "rgba(8, 50, 34, 0.94)", inset: "rgba(58, 191, 138, 0.11)", stroke: "rgba(118, 255, 202, 0.62)", text: "rgba(248, 255, 252, 0.98)" },
  { fill: "rgba(15, 70, 43, 0.94)", inset: "rgba(101, 214, 150, 0.1)", stroke: "rgba(143, 255, 215, 0.54)", text: "rgba(248, 255, 252, 0.97)" },
  { fill: "rgba(19, 84, 49, 0.91)", inset: "rgba(39, 174, 96, 0.13)", stroke: "rgba(101, 232, 148, 0.56)", text: "rgba(245, 255, 248, 0.97)" },
  { fill: "rgba(7, 60, 56, 0.92)", inset: "rgba(45, 212, 191, 0.09)", stroke: "rgba(112, 242, 210, 0.5)", text: "rgba(245, 255, 252, 0.97)" },
];

function uniqueItems(items: readonly string[]) {
  return Array.from(new Set(items.map(item => item.trim()).filter(Boolean))).slice(0, 34);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let size = 11;
  ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

  while (size > 8 && ctx.measureText(text.toUpperCase()).width > maxWidth) {
    size -= 1;
    ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  }
}

export default function ServiceBrickBreaker({ serviceTitle, features, tech }: ServiceBrickBreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef(0.5);
  const bricksRef = useRef<Brick[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ballRef = useRef<Ball>({ x: 0, y: 0, vx: 3.1, vy: -3.4, r: 8 });
  const gameRef = useRef<GameState>({ status: "playing", score: 0, labelIndex: 0, nextRowAt: 0, resetAt: 0 });
  const labels = useMemo(() => uniqueItems([...features, ...tech, ...EXTRA_BRICKS]), [features, tech]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 5;
    let gap = 8;
    let padX = 24;
    let top = 76;
    let brickW = 120;
    let brickH = 32;
    let raf = 0;
    let lastTime = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layout = () => {
      cols = width < 540 ? 3 : width < 860 ? 4 : 5;
      gap = width < 540 ? 7 : 9;
      padX = width < 540 ? 12 : 24;
      top = width < 540 ? 84 : 78;
      brickW = (width - padX * 2 - gap * (cols - 1)) / cols;
      brickH = width < 540 ? 32 : 36;
    };

    const makeBrick = (label: string, col: number, row: number, fromAbove = false): Brick => ({
      x: padX + col * (brickW + gap),
      y: fromAbove ? top - (brickH + gap) : top + row * (brickH + gap),
      targetY: top + row * (brickH + gap),
      w: brickW,
      h: brickH,
      label,
      gone: false,
      color: (gameRef.current.labelIndex + col + row) % BRICK_COLORS.length,
    });

    const nextLabel = () => {
      const current = gameRef.current.labelIndex;
      gameRef.current.labelIndex = (current + 1) % labels.length;
      return labels[current % labels.length];
    };

    const resetBall = () => {
      ballRef.current = {
        x: width * 0.55,
        y: height - 118,
        vx: width < 540 ? 2.9 : 3.65,
        vy: width < 540 ? -3.25 : -4.05,
        r: width < 540 ? 6.5 : 8,
      };
    };

    const resetGame = (time = performance.now()) => {
      gameRef.current = { status: "playing", score: 0, labelIndex: 0, nextRowAt: time + 7000, resetAt: 0 };
      particlesRef.current = [];
      bricksRef.current = [];

      const startRows = width < 540 ? 3 : 4;
      for (let row = 0; row < startRows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          bricksRef.current.push(makeBrick(nextLabel(), col, row));
        }
      }
      resetBall();
    };

    const dropRow = (time: number) => {
      const alive = bricksRef.current.filter(brick => !brick.gone);
      for (const brick of alive) {
        brick.targetY += brickH + gap;
      }
      const newRow = Array.from({ length: cols }, (_, col) => makeBrick(nextLabel(), col, 0, true));
      bricksRef.current = [...alive, ...newRow];
      gameRef.current.nextRowAt = time + 7200;
    };

    const spawnSplatter = (x: number, y: number, colorIndex: number) => {
      const palette = ["#53e6b2", "#7ff7d0", "#47d07d", "#5fe2be"];
      for (let i = 0; i < 18; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 3.4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1.5 + Math.random() * 3.2,
          color: palette[colorIndex % palette.length],
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(420, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      resetGame();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = Math.min(0.95, Math.max(0.05, (event.clientX - rect.left) / rect.width));
    };

    const drawBrick = (brick: Brick) => {
      if (brick.gone) return;
      const color = BRICK_COLORS[brick.color % BRICK_COLORS.length];
      const shine = ctx.createLinearGradient(brick.x, brick.y, brick.x + brick.w, brick.y + brick.h);
      shine.addColorStop(0, "rgba(255,255,255,0.05)");
      shine.addColorStop(0.5, color.inset);
      shine.addColorStop(1, "rgba(0,0,0,0.08)");

      ctx.save();
      ctx.shadowColor = color.stroke;
      ctx.shadowBlur = 8;
      roundedRect(ctx, brick.x, brick.y, brick.w, brick.h, 12);
      ctx.fillStyle = color.fill;
      ctx.fill();
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      ctx.shadowBlur = 0;
      roundedRect(ctx, brick.x + 4, brick.y + 4, brick.w - 8, brick.h - 8, 9);
      ctx.fillStyle = shine;
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
      ctx.lineWidth = 1;
      roundedRect(ctx, brick.x + 7, brick.y + 7, brick.w - 14, brick.h - 14, 7);
      ctx.stroke();

      fitText(ctx, brick.label, brick.w - 14);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 4;
      ctx.fillStyle = color.text;
      ctx.fillText(brick.label.toUpperCase(), brick.x + brick.w / 2, brick.y + brick.h / 2 + 1);
      ctx.restore();
    };

    const drawOverlay = (title: string, subtitle: string) => {
      ctx.save();
      ctx.fillStyle = "rgba(2, 6, 5, 0.72)";
      ctx.fillRect(0, 0, width, height);
      roundedRect(ctx, width * 0.18, height * 0.32, width * 0.64, 150, 20);
      ctx.fillStyle = "rgba(6, 28, 21, 0.92)";
      ctx.fill();
      ctx.strokeStyle = "rgba(83, 230, 178, 0.42)";
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 38px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(248, 245, 238, 0.94)";
      ctx.fillText(title, width / 2, height * 0.32 + 56);
      ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(83, 230, 178, 0.82)";
      ctx.fillText(subtitle, width / 2, height * 0.32 + 100);
      ctx.restore();
    };

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(1.35, (time - lastTime) / 16.67 || 1);
      lastTime = time;

      const paddleW = Math.min(190, Math.max(92, width * 0.2));
      const paddleH = 12;
      const paddleX = pointerRef.current * (width - paddleW);
      const paddleY = height - 62;
      const dangerY = paddleY - 82;
      const ball = ballRef.current;
      const game = gameRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(5, 8, 7, 0.36)";
      roundedRect(ctx, 0, 0, width, height, 24);
      ctx.fill();

      const gradient = ctx.createRadialGradient(width * 0.52, height * 0.36, 30, width * 0.52, height * 0.36, width * 0.72);
      gradient.addColorStop(0, "rgba(58, 191, 138, 0.13)");
      gradient.addColorStop(0.55, "rgba(58, 191, 138, 0.035)");
      gradient.addColorStop(1, "rgba(58, 191, 138, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(58, 191, 138, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 44) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 44) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(58, 191, 138, 0.8)";
      ctx.textAlign = "left";
      ctx.fillText("WHAT WE DO / WHAT WE USE", 24, 34);
      ctx.fillStyle = "rgba(248, 245, 238, 0.42)";
      ctx.fillText(serviceTitle.toUpperCase(), 24, 54);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(127, 247, 208, 0.78)";
      ctx.fillText(`SCORE ${game.score}`, width - 24, 34);

      if (game.status === "playing" && time > game.nextRowAt) {
        dropRow(time);
      }

      for (const brick of bricksRef.current) {
        brick.x = padX + Math.round((brick.x - padX) / (brickW + gap)) * (brickW + gap);
        brick.w = brickW;
        brick.h = brickH;
        brick.y += (brick.targetY - brick.y) * 0.09 * dt;
        drawBrick(brick);
      }

      for (const particle of particlesRef.current) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 0.045 * dt;
        particle.life -= 0.025 * dt;
        if (particle.life <= 0) continue;
        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      particlesRef.current = particlesRef.current.filter(particle => particle.life > 0);

      if (game.status === "playing" && !reducedMotion) {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
      }

      if (game.status === "playing") {
        if (ball.x - ball.r < 14 || ball.x + ball.r > width - 14) ball.vx *= -1;
        if (ball.y - ball.r < 16) ball.vy = Math.abs(ball.vy);
        if (ball.y - ball.r > height) {
          game.status = "gameover";
          game.resetAt = time + 2600;
        }

        if (
          ball.y + ball.r >= paddleY &&
          ball.y - ball.r <= paddleY + paddleH &&
          ball.x >= paddleX &&
          ball.x <= paddleX + paddleW &&
          ball.vy > 0
        ) {
          const impact = (ball.x - (paddleX + paddleW / 2)) / (paddleW / 2);
          ball.vx = impact * 5.1;
          ball.vy = -Math.abs(ball.vy) - 0.2;
        }

        for (const brick of bricksRef.current) {
          if (brick.gone) continue;
          const hit =
            ball.x + ball.r > brick.x &&
            ball.x - ball.r < brick.x + brick.w &&
            ball.y + ball.r > brick.y &&
            ball.y - ball.r < brick.y + brick.h;

          if (hit) {
            brick.gone = true;
            game.score += 1;
            spawnSplatter(ball.x, ball.y, brick.color);
            const overlapX = Math.min(ball.x + ball.r - brick.x, brick.x + brick.w - (ball.x - ball.r));
            const overlapY = Math.min(ball.y + ball.r - brick.y, brick.y + brick.h - (ball.y - ball.r));
            if (overlapX < overlapY) ball.vx *= -1;
            else ball.vy *= -1;
            break;
          }
        }

        const alive = bricksRef.current.filter(brick => !brick.gone);
        if (alive.length === 0) {
          game.status = "cleared";
          game.score += 10;
          game.resetAt = time + 3200;
        } else if (alive.some(brick => brick.targetY + brick.h > dangerY)) {
          game.status = "gameover";
          game.resetAt = time + 2600;
        }
      }

      ctx.save();
      ctx.shadowColor = "rgba(248, 245, 238, 0.55)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "rgba(248, 245, 238, 0.94)";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      roundedRect(ctx, paddleX, paddleY, paddleW, paddleH, 999);
      ctx.fillStyle = "rgba(58, 191, 138, 0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(248, 245, 238, 0.28)";
      ctx.stroke();

      ctx.font = "700 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(248, 245, 238, 0.46)";
      ctx.fillText("MOVE YOUR CURSOR", width / 2, height - 24);

      if (game.status === "gameover") {
        drawOverlay("GAME OVER", "THE WALL REACHED THE FLOOR");
      }

      if (game.status === "cleared") {
        drawOverlay("10% OFF", "STACK CLEARED - DISCOUNT UNLOCKED");
      }

      if (game.status !== "playing" && game.resetAt && time > game.resetAt) {
        resetGame(time);
      }
    };

    resize();
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
    };
  }, [labels, serviceTitle]);

  return (
    <section data-motion-section className="relative z-10 py-20 md:py-28">
      <div className="wrap grid gap-9 border-y border-[rgba(58,191,138,0.12)] py-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
        <div>
          <p className="eyebrow mb-6">What we do / use</p>
          <h2 className="hed text-[clamp(3rem,6.8vw,7rem)] leading-[0.86]">
            Break the<br />
            <span className="text-[var(--teal)]">stack.</span>
          </h2>
          <p className="mt-8 max-w-[430px] text-[0.95rem] leading-[1.85] text-[var(--body)]">
            A small live wall of what we build and the tools we use. Clear the stack and unlock 10% off.
          </p>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-[rgba(58,191,138,0.16)] bg-[rgba(7,10,9,0.44)] shadow-[0_34px_120px_rgba(0,0,0,0.28)] md:min-h-[620px]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
