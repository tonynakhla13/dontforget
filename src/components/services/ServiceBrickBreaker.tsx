"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  status: "ready" | "playing" | "gameover" | "cleared";
  score: number;
  labelIndex: number;
  nextRowAt: number;
  resetAt: number;
  hits: number;
  speedLevel: number;
  flashUntil: number;
};

type ScoreEntry = {
  name: string;
  score: number;
  status: "gameover" | "cleared";
  at: number;
};

type GameResult = {
  score: number;
  status: "gameover" | "cleared";
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
  { fill: "rgba(8, 34, 14, 0.96)", inset: "rgba(70, 209, 42, 0.1)", stroke: "rgba(70, 209, 42, 0.58)", text: "rgba(248, 255, 246, 0.98)" },
  { fill: "rgba(10, 42, 17, 0.96)", inset: "rgba(124, 255, 95, 0.11)", stroke: "rgba(124, 255, 95, 0.5)", text: "rgba(248, 255, 246, 0.98)" },
  { fill: "rgba(6, 28, 13, 0.96)", inset: "rgba(70, 174, 34, 0.13)", stroke: "rgba(70, 174, 34, 0.62)", text: "rgba(248, 255, 246, 0.98)" },
  { fill: "rgba(5, 24, 12, 0.96)", inset: "rgba(184, 255, 224, 0.08)", stroke: "rgba(184, 255, 224, 0.34)", text: "rgba(248, 255, 246, 0.98)" },
];

const PARTICLE_COLORS = ["#46d12a", "#7cff5f", "#46ae22", "#b8ffe0"];
const SCORE_KEY_PREFIX = "df:immersive-stack-scores:";

const WORD_REPLACEMENTS: Record<string, string> = {
  javascript: "JS",
  typescript: "TS",
  wordpress: "WP",
  woocommerce: "Commerce",
  postgresql: "SQL",
  performance: "Speed",
  accessibility: "Access",
  analytics: "Data",
  integrations: "APIs",
  automation: "Auto",
  dashboards: "Dash",
  prototypes: "Proto",
};

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/wordpress/i, "WP"],
  [/content[-\s]?managed|cms/i, "CMS"],
  [/service[-\s]?based/i, "Service"],
  [/custom website|website building/i, "Build"],
  [/landing page/i, "Landing"],
  [/portfolio/i, "Portfolio"],
  [/booking|inquiry/i, "Booking"],
  [/client portal/i, "Portal"],
  [/redesign/i, "Redesign"],
  [/launch/i, "Launch"],
  [/mobile/i, "Mobile"],
  [/first impression|sharper/i, "Sharp"],
  [/conversion/i, "Convert"],
];

const SKIP_WORDS = new Set([
  "a",
  "and",
  "app",
  "apps",
  "based",
  "better",
  "building",
  "company",
  "content",
  "custom",
  "everything",
  "full",
  "managed",
  "pages",
  "service",
  "solutions",
  "that",
  "the",
  "to",
  "web",
  "website",
  "websites",
  "with",
  "without",
]);

function compactBrickLabel(item: string) {
  const phrase = PHRASE_REPLACEMENTS.find(([pattern]) => pattern.test(item));
  if (phrase) return phrase[1];

  const words = item
    .replace(/&/g, " ")
    .replace(/-/g, " ")
    .replace(/[^a-zA-Z0-9.+#]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstMeaningful = words.find(word => !SKIP_WORDS.has(word.toLowerCase())) || words[0] || item;
  const key = firstMeaningful.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return WORD_REPLACEMENTS[key] || firstMeaningful.replace(/[^a-zA-Z0-9.+#-]/g, "").slice(0, 12);
}

function uniqueItems(items: readonly string[]) {
  return Array.from(new Set(items.map(compactBrickLabel).filter(Boolean))).slice(0, 34);
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
  let size = 16;
  ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

  while (size > 12 && ctx.measureText(text.toUpperCase()).width > maxWidth) {
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
  const gameRef = useRef<GameState>({ status: "ready", score: 0, labelIndex: 0, nextRowAt: 0, resetAt: 0, hits: 0, speedLevel: 1, flashUntil: 0 });
  const resultSentRef = useRef(false);
  const restartRef = useRef(() => {});
  const [result, setResult] = useState<GameResult | null>(null);
  const [ready, setReady] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const labels = useMemo(() => uniqueItems([...features, ...tech, ...EXTRA_BRICKS]), [features, tech]);
  const scoreKey = useMemo(() => `${SCORE_KEY_PREFIX}${serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, [serviceTitle]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(scoreKey);
      setLeaderboard(stored ? JSON.parse(stored) : []);
    } catch {
      setLeaderboard([]);
    }
  }, [scoreKey]);

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
      brickH = width < 540 ? 38 : 44;
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
      gameRef.current = { status: "ready", score: 0, labelIndex: 0, nextRowAt: time + 7000, resetAt: 0, hits: 0, speedLevel: 1, flashUntil: 0 };
      resultSentRef.current = false;
      setResult(null);
      setReady(true);
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

    restartRef.current = () => resetGame(performance.now());

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
          color: PARTICLE_COLORS[colorIndex % PARTICLE_COLORS.length],
        });
      }
    };

    const tuneBallSpeed = (multiplier: number) => {
      const ball = ballRef.current;
      const current = Math.hypot(ball.vx, ball.vy) || 1;
      const maxSpeed = width < 540 ? 7.2 : 8.8;
      const next = Math.min(maxSpeed, current * multiplier);
      const ratio = next / current;
      ball.vx *= ratio;
      ball.vy *= ratio;
    };

    const finishGame = (status: "gameover" | "cleared", time: number) => {
      const game = gameRef.current;
      game.status = status;
      game.resetAt = 0;
      if (!resultSentRef.current) {
        resultSentRef.current = true;
        setResult({ score: game.score, status });
      }
      game.flashUntil = time + 900;
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
      ctx.shadowBlur = 5;
      roundedRect(ctx, brick.x, brick.y, brick.w, brick.h, 8);
      ctx.fillStyle = color.fill;
      ctx.fill();
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.shadowBlur = 0;
      roundedRect(ctx, brick.x + 5, brick.y + 5, brick.w - 10, brick.h - 10, 6);
      ctx.fillStyle = shine;
      ctx.fill();

      ctx.strokeStyle = "rgba(248, 255, 246, 0.08)";
      ctx.lineWidth = 1;
      roundedRect(ctx, brick.x + 9, brick.y + 9, brick.w - 18, brick.h - 18, 5);
      ctx.stroke();

      fitText(ctx, brick.label, brick.w - 26);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 5;
      ctx.fillStyle = color.text;
      ctx.fillText(brick.label.toUpperCase(), brick.x + brick.w / 2, brick.y + brick.h / 2 + 1);
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
      gradient.addColorStop(0, "rgba(70, 209, 42, 0.14)");
      gradient.addColorStop(0.55, "rgba(70, 174, 34, 0.04)");
      gradient.addColorStop(1, "rgba(70, 209, 42, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(70, 209, 42, 0.08)";
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
      ctx.fillStyle = "rgba(70, 209, 42, 0.82)";
      ctx.textAlign = "left";
      ctx.fillText("WHAT WE DO / WHAT WE USE", 24, 34);
      ctx.fillStyle = "rgba(248, 245, 238, 0.42)";
      ctx.fillText(serviceTitle.toUpperCase(), 24, 54);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(124, 255, 95, 0.86)";
      ctx.fillText(`SCORE ${game.score}`, width - 24, 34);
      ctx.fillStyle = time < game.flashUntil ? "rgba(124, 255, 95, 0.95)" : "rgba(248, 245, 238, 0.42)";
      ctx.fillText(`SPEED ${game.speedLevel}`, width - 24, 54);

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
          finishGame("gameover", time);
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
            game.hits += 1;
            spawnSplatter(ball.x, ball.y, brick.color);
            const overlapX = Math.min(ball.x + ball.r - brick.x, brick.x + brick.w - (ball.x - ball.r));
            const overlapY = Math.min(ball.y + ball.r - brick.y, brick.y + brick.h - (ball.y - ball.r));
            if (overlapX < overlapY) ball.vx *= -1;
            else ball.vy *= -1;
            if (game.hits % 4 === 0) {
              game.speedLevel += 1;
              game.flashUntil = time + 900;
              tuneBallSpeed(1.1);
              game.score += 2;
            } else {
              tuneBallSpeed(1.018);
            }
            break;
          }
        }

        const alive = bricksRef.current.filter(brick => !brick.gone);
        if (alive.length === 0) {
          game.score += 10;
          finishGame("cleared", time);
        } else if (alive.some(brick => brick.targetY + brick.h > dangerY)) {
          finishGame("gameover", time);
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
      ctx.fillStyle = "rgba(70, 209, 42, 0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(248, 245, 238, 0.28)";
      ctx.stroke();

      ctx.font = "700 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(248, 245, 238, 0.46)";
      ctx.fillText("MOVE YOUR CURSOR", width / 2, height - 24);

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

  const submitScore = () => {
    if (!result) return;
    const name = playerName.trim().slice(0, 16) || "NOX PLAYER";
    const next = [{ name, score: result.score, status: result.status, at: Date.now() }, ...leaderboard]
      .sort((a, b) => b.score - a.score || a.at - b.at)
      .slice(0, 5);
    setLeaderboard(next);
    setPlayerName("");
    setResult(null);
    try {
      window.localStorage.setItem(scoreKey, JSON.stringify(next));
    } catch {}
    restartRef.current();
  };

  const skipScore = () => {
    setPlayerName("");
    setResult(null);
    restartRef.current();
  };

  const startGame = () => {
    const game = gameRef.current;
    game.status = "playing";
    game.nextRowAt = performance.now() + 7000;
    setReady(false);
  };

  return (
    <section data-motion-section className="relative z-10 overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.26),transparent)]" />
      <div className="wrap">
        <div className="grid gap-9 border-y border-[rgba(var(--teal-rgb),0.14)] py-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
          <aside className="relative">
            <div>
                <div className="mb-8 flex items-center gap-4">
                  <span className="font-mono text-[0.52rem] uppercase tracking-[0.32em] text-[var(--teal)]">Stack protocol</span>
                  <span className="h-px flex-1 bg-[rgba(var(--teal-rgb),0.2)]" aria-hidden="true" />
                </div>
                <h2
                  className="hed"
                  style={{ fontSize: "clamp(4.8rem, 7.4vw, 8.6rem)", lineHeight: 0.78 }}
                >
                  Break<br />
                  the<br />
                  <span className="text-[var(--teal)]">stack.</span>
                </h2>
                <p className="mt-8 max-w-[420px] text-[0.95rem] leading-[1.8] text-[var(--body)]">
                  Aim through the service pieces, push the speed higher, then record the run before the stack resets.
                </p>
                <div className="mt-8 grid max-w-[420px] grid-cols-3 border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(0,0,0,0.16)]">
                  <div className="border-r border-[rgba(var(--teal-rgb),0.14)] p-3">
                    <span className="block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[rgba(var(--fg-rgb),0.36)]">Bricks</span>
                    <strong className="mt-2 block font-mono text-[1.1rem] text-[var(--teal)]">{String(labels.length).padStart(2, "0")}</strong>
                  </div>
                  <div className="border-r border-[rgba(var(--teal-rgb),0.14)] p-3">
                    <span className="block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[rgba(var(--fg-rgb),0.36)]">Speed</span>
                    <strong className="mt-2 block font-mono text-[1.1rem] text-[var(--teal)]">RAMP</strong>
                  </div>
                  <div className="p-3">
                    <span className="block font-mono text-[0.46rem] uppercase tracking-[0.22em] text-[rgba(var(--fg-rgb),0.36)]">Reward</span>
                    <strong className="mt-2 block font-mono text-[1.1rem] text-[var(--teal)]">10%</strong>
                  </div>
                </div>
              </div>
          </aside>

          <div
            className="relative overflow-hidden border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(7,10,9,0.44)] shadow-[0_34px_120px_rgba(0,0,0,0.28)]"
            style={{ minHeight: 660 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-center justify-between border-b border-[rgba(var(--teal-rgb),0.12)] bg-[rgba(3,8,6,0.34)] px-5 py-3 backdrop-blur-sm">
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-[var(--teal)]">Service stack arena</span>
              <span className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-[rgba(var(--fg-rgb),0.42)]">Cursor controlled</span>
            </div>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 block"
              style={{ width: "100%", height: "100%" }}
              aria-hidden="true"
            />
            {ready && !result ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center px-5"
                style={{ background: "linear-gradient(135deg, rgba(2, 6, 4, 0.98), rgba(4, 16, 8, 0.97) 52%, rgba(2, 6, 4, 0.99))" }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(var(--teal-rgb),0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.07)_1px,transparent_1px)] bg-[length:44px_44px]" aria-hidden="true" />
                <div
                  className="relative w-full border border-[rgba(var(--teal-rgb),0.42)] bg-[rgba(2,10,5,0.98)] p-8 text-center shadow-[0_30px_110px_rgba(0,0,0,0.62),0_0_48px_rgba(var(--teal-rgb),0.18)]"
                  style={{ maxWidth: 560, backgroundColor: "rgba(2, 10, 5, 0.98)" }}
                >
                  <span className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,var(--teal),transparent)]" aria-hidden="true" />
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.32em] text-[var(--immersive-particles)]">Ready protocol</p>
                  <h3
                    className="hed mt-4"
                    style={{ fontSize: "clamp(4.3rem, 7vw, 7.2rem)", lineHeight: 0.78 }}
                  >
                    Start<br /><span className="text-[var(--teal)]">game.</span>
                  </h3>
                  <div className="mx-auto mt-5 grid max-w-[360px] grid-cols-3 border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(0,0,0,0.28)] text-left">
                    {["Aim", "Break", "Record"].map(item => (
                      <span key={item} className="border-r border-[rgba(var(--teal-rgb),0.12)] px-3 py-2 font-mono text-[0.48rem] uppercase tracking-[0.18em] text-[rgba(var(--fg-rgb),0.56)] last:border-r-0">
                        {item}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={startGame}
                    className="mt-5 w-full border border-[rgba(var(--teal-rgb),0.5)] bg-[rgba(var(--teal-rgb),0.12)] px-5 py-3 font-mono text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--fg)] shadow-[0_0_24px_rgba(var(--teal-rgb),0.16)] transition hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.22)]"
                  >
                    Start protocol
                  </button>
                </div>
              </div>
            ) : null}
            {result ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center px-5"
                style={{ background: "linear-gradient(135deg, rgba(2, 6, 4, 0.98), rgba(4, 16, 8, 0.97) 52%, rgba(2, 6, 4, 0.99))" }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(var(--teal-rgb),0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.07)_1px,transparent_1px)] bg-[length:44px_44px]" aria-hidden="true" />
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    submitScore();
                  }}
                  className="relative w-full border border-[rgba(var(--teal-rgb),0.42)] bg-[rgba(2,10,5,0.98)] p-8 text-center shadow-[0_30px_110px_rgba(0,0,0,0.62),0_0_48px_rgba(var(--teal-rgb),0.18)]"
                  style={{ maxWidth: 560, backgroundColor: "rgba(2, 10, 5, 0.98)" }}
                >
                  <span className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,var(--teal),transparent)]" aria-hidden="true" />
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.32em] text-[var(--immersive-particles)]">
                    {result.status === "cleared" ? "Stack cleared" : "Run ended"}
                  </p>
                  <h3
                    className="hed mt-4"
                    style={{ fontSize: "clamp(4.3rem, 7vw, 7.2rem)", lineHeight: 0.78 }}
                  >
                    {result.status === "cleared" ? "Stack" : "Game"}<br />
                    <span className="text-[var(--teal)]">{result.status === "cleared" ? "cleared." : "over."}</span>
                  </h3>
                  <p className="mt-4 font-mono text-[0.82rem] font-bold uppercase tracking-[0.24em] text-[var(--fg)]">
                    Score <span className="text-[var(--teal)]">{result.score}</span>
                  </p>
                  <label className="mt-5 block text-left">
                    <span className="sr-only">Your name</span>
                    <input
                      value={playerName}
                      onChange={event => setPlayerName(event.target.value)}
                      maxLength={16}
                      autoFocus
                      className="w-full border border-[rgba(var(--teal-rgb),0.32)] bg-[rgba(0,0,0,0.34)] px-4 py-3 text-center font-mono text-[0.76rem] uppercase tracking-[0.2em] text-[var(--fg)] outline-none transition placeholder:text-[rgba(var(--fg-rgb),0.35)] focus:border-[var(--teal)] focus:bg-[rgba(var(--teal-rgb),0.06)]"
                      placeholder="ENTER NAME"
                    />
                  </label>
                  <div className="mt-4 border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(0,0,0,0.22)] p-3 text-left">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-[var(--teal)]">Leaderboard</p>
                      <span className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-[rgba(var(--fg-rgb),0.38)]">Local</span>
                    </div>
                    <div className="space-y-2">
                      {leaderboard.length ? leaderboard.map((entry, index) => (
                        <div key={`${entry.name}-${entry.at}`} className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-[rgba(var(--fg-rgb),0.07)] pb-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[rgba(var(--fg-rgb),0.68)] last:border-b-0 last:pb-0">
                          <span className="text-[var(--teal)]">{String(index + 1).padStart(2, "0")}</span>
                          <span className="truncate">{entry.name}</span>
                          <span>{entry.score}</span>
                        </div>
                      )) : (
                        <p className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[rgba(var(--fg-rgb),0.4)]">No saved runs yet</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full border border-[rgba(var(--teal-rgb),0.5)] bg-[rgba(var(--teal-rgb),0.12)] px-5 py-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--fg)] shadow-[0_0_24px_rgba(var(--teal-rgb),0.16)] transition hover:border-[var(--teal)] hover:bg-[rgba(var(--teal-rgb),0.22)]"
                  >
                    Save score & restart
                  </button>
                  <button
                    type="button"
                    onClick={skipScore}
                    className="mt-3 w-full border border-[rgba(var(--fg-rgb),0.22)] bg-[rgba(0,0,0,0.24)] px-5 py-3 font-mono text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[rgba(var(--fg-rgb),0.68)] transition hover:border-[rgba(var(--teal-rgb),0.34)] hover:text-[var(--fg)]"
                  >
                    Skip & restart
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
