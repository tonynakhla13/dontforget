"use client";

/**
 * MeshWebDevBackground — Playable Snake Game
 *
 * User-controlled 2D canvas snake. Arrow keys / WASD to steer.
 * Score + name saved to localStorage. Top-5 scoreboard on idle screen.
 * Positioned right-half of viewport inside the fixed wrapper from
 * MeshWebDevBackgroundClient (which is now zIndex:2 so clicks land).
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─── grid / canvas ──────────────────────────────────────────────────── */
const COLS = 20;
const ROWS = 20;
const CELL = 22;          // px per cell
const W    = COLS * CELL; // 440 px
const H    = ROWS * CELL; // 440 px

/* ─── game tuning ────────────────────────────────────────────────────── */
const INIT_MS    = 150;
const MIN_MS     = 55;
const SPEED_STEP = 4;
const MAX_SCORES = 8;

/* ─── brand palette — #46AE22 green ─────────────────────────────────── */
const G    = "#46AE22";                    // brand green
const GA14 = "rgba(70,174,34,0.14)";      // faint green (grid dots)
const GA55 = "rgba(70,174,34,0.55)";      // medium green (head glow)
const GA22 = "rgba(70,174,34,0.22)";      // border / subtle
const CR   = "#F4EFE4";                    // cream (food dot)
const DARK = "rgba(5,8,6,0.94)";          // near-black bg

/* ─── types ──────────────────────────────────────────────────────────── */
type Pt   = { x: number; y: number };
type Dir  = { dx: number; dy: number };
type Phase = "idle" | "playing" | "gameover";
interface Entry { name: string; score: number; }

/* ─── helpers ────────────────────────────────────────────────────────── */
const ptKey = (p: Pt) => `${p.x},${p.y}`;
const isOpp = (a: Dir, b: Dir) => a.dx + b.dx === 0 && a.dy + b.dy === 0;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function mkSnake(): Pt[] {
  return [
    { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 },
  ];
}

function mkFood(snake: Pt[]): Pt {
  const used = new Set(snake.map(ptKey));
  for (let i = 0; i < 500; i++) {
    const p: Pt = { x: ~~(Math.random() * COLS), y: ~~(Math.random() * ROWS) };
    if (!used.has(ptKey(p))) return p;
  }
  return { x: 1, y: 1 };
}

/* ─── localStorage ───────────────────────────────────────────────────── */
function loadScores(): Entry[] {
  try { return JSON.parse(localStorage.getItem("df_snake") ?? "[]") as Entry[]; }
  catch { return []; }
}
function saveScore(e: Entry): Entry[] {
  const all = [...loadScores(), e].sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);
  try { localStorage.setItem("df_snake", JSON.stringify(all)); } catch { /**/ }
  return all;
}

/* ─── canvas rendering ───────────────────────────────────────────────── */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") { ctx.roundRect(x, y, w, h, r); }
  else { ctx.rect(x, y, w, h); }
}

function drawScene(ctx: CanvasRenderingContext2D, snake: Pt[], food: Pt, ms: number, dead: boolean) {
  // bg
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // grid dots
  ctx.fillStyle = GA14;
  for (let x = 0; x <= COLS; x++)
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.arc(x * CELL, y * CELL, 0.85, 0, Math.PI * 2);
      ctx.fill();
    }

  // scanline
  const sy = (ms * 0.038) % H;
  const sg = ctx.createLinearGradient(0, sy - 6, 0, sy + 6);
  sg.addColorStop(0, "transparent");
  sg.addColorStop(0.5, "rgba(70,174,34,0.05)");
  sg.addColorStop(1, "transparent");
  ctx.fillStyle = sg;
  ctx.fillRect(0, sy - 6, W, 12);

  // food — pulsing cream dot with glow
  const p = 3.8 + Math.sin(ms * 0.005) * 1.8;
  ctx.shadowColor = "rgba(244,239,228,0.95)";
  ctx.shadowBlur  = p * 4;
  ctx.fillStyle   = CR;
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, p, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // snake
  const R = CELL * 0.28;
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    const fade   = clamp(1 - i / (snake.length * 0.9), 0.15, 1);
    const pad    = isHead ? 1 : 2.5;
    if (isHead) { ctx.shadowColor = GA55; ctx.shadowBlur = 18; }
    ctx.fillStyle = isHead ? G : `rgba(70,174,34,${fade.toFixed(2)})`;
    ctx.beginPath();
    rr(ctx, seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, R);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // death flash
  if (dead) {
    ctx.fillStyle = "rgba(244,60,60,0.1)";
    ctx.fillRect(0, 0, W, H);
  }
}

/* ─── shared styles ──────────────────────────────────────────────────── */
const MONO: React.CSSProperties = {
  fontFamily: "var(--font-space-mono,'Space Mono',monospace)",
};
const BTN: React.CSSProperties = {
  ...MONO,
  fontSize: "11px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: G,
  background: "rgba(70,174,34,0.10)",
  border: `1px solid rgba(70,174,34,0.5)`,
  padding: "10px 26px",
  cursor: "pointer",
  outline: "none",
};
const INPUT: React.CSSProperties = {
  ...MONO,
  fontSize: "12px",
  letterSpacing: "0.05em",
  color: CR,
  background: "rgba(5,8,6,0.85)",
  border: `1px solid rgba(70,174,34,0.4)`,
  padding: "10px 14px",
  outline: "none",
  width: "150px",
};

/* ─── component ──────────────────────────────────────────────────────── */
export default function MeshWebDevBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);

  // mutable game state (no re-renders inside the loop)
  const snakeRef     = useRef<Pt[]>(mkSnake());
  const dirRef       = useRef<Dir>({ dx: 1, dy: 0 });
  const nextDirRef   = useRef<Dir>({ dx: 1, dy: 0 });
  const foodRef      = useRef<Pt>(mkFood(snakeRef.current));
  const deadRef      = useRef(false);
  const scoreRef     = useRef(0);
  const speedRef     = useRef(INIT_MS);
  const lastTickRef  = useRef(0);
  const t0Ref        = useRef(0);

  // react state (UI overlays only)
  const [phase,  setPhase]  = useState<Phase>("idle");
  const [score,  setScore]  = useState(0);
  const [scores, setScores] = useState<Entry[]>([]);
  const [name,   setName]   = useState("");

  // load scores client-side
  useEffect(() => { setScores(loadScores()); }, []);

  /* ── reset ───────────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    const s = mkSnake();
    snakeRef.current   = s;
    dirRef.current     = { dx: 1, dy: 0 };
    nextDirRef.current = { dx: 1, dy: 0 };
    foodRef.current    = mkFood(s);
    deadRef.current    = false;
    scoreRef.current   = 0;
    speedRef.current   = INIT_MS;
    lastTickRef.current = 0;
    t0Ref.current      = 0;
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    reset();
    setPhase("playing");
  }, [reset]);

  /* ── idle / gameover canvas loop (animated scanline + demo snake) ── */
  useEffect(() => {
    if (phase === "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const demo: Pt[] = [
      { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 },
      { x: 7, y: 10 },  { x: 7, y: 11 }, { x: 7, y: 12 },
      { x: 8, y: 12 },  { x: 9, y: 12 },
    ];
    const demoFood: Pt = { x: 14, y: 10 };
    let t0 = 0;
    const loop = (ts: number) => {
      if (!t0) t0 = ts;
      drawScene(ctx, demo, demoFood, ts - t0, false);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  /* ── playing loop ────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (ts: number) => {
      if (!t0Ref.current) { t0Ref.current = ts; lastTickRef.current = ts; }
      const elapsed = ts - t0Ref.current;

      if (!deadRef.current && ts - lastTickRef.current >= speedRef.current) {
        lastTickRef.current = ts;
        dirRef.current = nextDirRef.current;
        const { dx, dy } = dirRef.current;
        const head = snakeRef.current[0];
        const nx = head.x + dx;
        const ny = head.y + dy;

        const hitWall = nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS;
        const hitSelf = !hitWall && snakeRef.current.slice(0, -1).some(s => s.x === nx && s.y === ny);

        if (hitWall || hitSelf) {
          deadRef.current = true;
          setScore(scoreRef.current);
          setTimeout(() => setPhase("gameover"), 700);
        } else {
          const next: Pt = { x: nx, y: ny };
          const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
          const newSnake = [next, ...snakeRef.current];
          if (!ate) newSnake.pop();
          snakeRef.current = newSnake;
          if (ate) {
            scoreRef.current++;
            setScore(scoreRef.current);
            foodRef.current  = mkFood(newSnake);
            speedRef.current = Math.max(MIN_MS, speedRef.current - SPEED_STEP);
          }
        }
      }

      drawScene(ctx, snakeRef.current, foodRef.current, elapsed, deadRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  /* ── keyboard ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "playing") return;
    const MAP: Record<string, Dir> = {
      ArrowUp:    { dx: 0, dy: -1 }, w: { dx: 0, dy: -1 }, W: { dx: 0, dy: -1 },
      ArrowDown:  { dx: 0, dy:  1 }, s: { dx: 0, dy:  1 }, S: { dx: 0, dy:  1 },
      ArrowLeft:  { dx: -1, dy: 0 }, a: { dx: -1, dy: 0 }, A: { dx: -1, dy: 0 },
      ArrowRight: { dx:  1, dy: 0 }, d: { dx:  1, dy: 0 }, D: { dx:  1, dy: 0 },
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = MAP[e.key];
      if (dir && !isOpp(dir, dirRef.current)) { e.preventDefault(); nextDirRef.current = dir; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  /* ── touch swipe ─────────────────────────────────────────────────── */
  const touch0 = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touch0.current = { x: t.clientX, y: t.clientY };
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touch0.current || phase !== "playing") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch0.current.x;
    const dy = t.clientY - touch0.current.y;
    touch0.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    const dir: Dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? { dx: 1, dy: 0 } : { dx: -1, dy: 0 })
      : (dy > 0 ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 });
    if (!isOpp(dir, dirRef.current)) nextDirRef.current = dir;
  }, [phase]);

  /* ── submit score ────────────────────────────────────────────────── */
  const handleSubmit = useCallback(() => {
    const n = name.trim() || "Anonymous";
    const all = saveScore({ name: n, score });
    setScores(all);
    setName("");
    setPhase("idle");
  }, [name, score]);

  /* ── d-pad press (touch / mobile) ───────────────────────────────── */
  const pressDir = useCallback((dir: Dir) => {
    if (phase !== "playing") return;
    if (!isOpp(dir, dirRef.current)) nextDirRef.current = dir;
  }, [phase]);

  /* ── render ──────────────────────────────────────────────────────── */
  return (
    <div
      className="hidden md:block"
      style={{
        position: "absolute",
        left: "53%",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "auto",
        zIndex: 2,
        userSelect: "none",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* HUD header */}
      <div style={{
        ...MONO,
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: G,
        marginBottom: 7,
        opacity: 0.9,
      }}>
        <span>Signal&nbsp;Snake</span>
        <span>Score&nbsp;{String(score).padStart(2, "0")}</span>
      </div>

      {/* canvas + overlays */}
      <div style={{
        position: "relative",
        border: `1px solid ${GA22}`,
        lineHeight: 0,
        boxShadow: `0 0 40px rgba(70,174,34,0.07), inset 0 0 0 1px rgba(70,174,34,0.06)`,
      }}>
        <CropMark pos="tl" /><CropMark pos="tr" />
        <CropMark pos="bl" /><CropMark pos="br" />

        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block" }} />

        {/* idle overlay */}
        {phase === "idle" && (
          <Overlay>
            <p style={{
              ...MONO,
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: G,
              margin: "0 0 20px",
            }}>
              — Signal Snake —
            </p>
            <button
              style={{
                ...BTN,
                fontSize: "13px",
                padding: "14px 48px",
                letterSpacing: "0.3em",
                border: `1px solid rgba(70,174,34,0.7)`,
                background: "rgba(70,174,34,0.12)",
              }}
              onClick={startGame}
            >
              Start&nbsp;Game
            </button>

            {scores.length > 0 && (
              <div style={{ marginTop: 24, width: "100%", padding: "0 28px" }}>
                <p style={{
                  ...MONO,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(70,174,34,0.65)",
                  margin: "0 0 10px",
                  textAlign: "center",
                }}>
                  Leaderboard
                </p>
                {scores.slice(0, 5).map((e, i) => (
                  <div key={i} style={{
                    ...MONO,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    letterSpacing: "0.04em",
                    color: i === 0 ? CR : "rgba(244,239,228,0.6)",
                    padding: "5px 0",
                    borderBottom: "1px solid rgba(70,174,34,0.10)",
                  }}>
                    <span>
                      <span style={{ color: G, marginRight: 10 }}>
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {e.name}
                    </span>
                    <span style={{ color: i === 0 ? G : "inherit" }}>{e.score}</span>
                  </div>
                ))}
              </div>
            )}
          </Overlay>
        )}

        {/* game-over overlay */}
        {phase === "gameover" && (
          <Overlay>
            {/* SIGNAL LOST */}
            <p style={{
              ...MONO,
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,80,80,0.95)",
              margin: "0 0 16px",
            }}>
              — Signal Lost —
            </p>

            {/* big score number */}
            <div style={{
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1,
              color: CR,
              marginBottom: 4,
              fontVariantNumeric: "tabular-nums",
            }}>
              {score}
            </div>

            {/* apples eaten */}
            <p style={{
              ...MONO,
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(244,239,228,0.55)",
              margin: "0 0 24px",
            }}>
              {score === 1 ? "apple eaten" : "apples eaten"}
            </p>

            {/* name prompt */}
            <p style={{
              ...MONO,
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: G,
              margin: "0 0 10px",
            }}>
              Enter your name
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Your name…"
                value={name}
                maxLength={16}
                autoFocus
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
                style={INPUT}
              />
              <button style={BTN} onClick={handleSubmit}>Save</button>
            </div>

            <button
              onClick={startGame}
              style={{
                ...BTN,
                marginTop: 14,
                background: "transparent",
                border: "1px solid rgba(70,174,34,0.18)",
                color: "rgba(244,239,228,0.5)",
                fontSize: "10px",
              }}
            >
              Skip &amp; Retry
            </button>
          </Overlay>
        )}
      </div>

      {/* mobile d-pad */}
      {phase === "playing" && (
        <DPad onPress={pressDir} />
      )}

      {/* controls hint */}
      <div style={{
        ...MONO,
        fontSize: "10px",
        letterSpacing: "0.18em",
        color: "rgba(70,174,34,0.5)",
        textTransform: "uppercase",
        textAlign: "center",
        marginTop: 8,
      }}>
        ← → ↑ ↓ &nbsp;/&nbsp; W A S D
      </div>
    </div>
  );
}

/* ─── sub-components ─────────────────────────────────────────────────── */

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "rgba(5,8,6,0.88)",
    }}>
      {children}
    </div>
  );
}

function HUDLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      fontFamily: "var(--font-space-mono,'Space Mono',monospace)",
      fontSize: "11px",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      margin: 0,
      ...style,
    }}>
      {children}
    </p>
  );
}

function CropMark({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const t = pos[0] === "t", l = pos[1] === "l";
  const s: React.CSSProperties = { position: "absolute", background: GA22 };
  return (
    <>
      <div style={{ ...s, width: 10, height: 1, top: t ? -7 : undefined, bottom: !t ? -7 : undefined, left: l ? -7 : undefined, right: !l ? -7 : undefined }} />
      <div style={{ ...s, width: 1, height: 10, top: t ? -7 : undefined, bottom: !t ? -7 : undefined, left: l ? -7 : undefined, right: !l ? -7 : undefined }} />
    </>
  );
}

function DPad({ onPress }: { onPress: (d: Dir) => void }) {
  const items = [
    { label: "↑", dir: { dx: 0, dy: -1 } as Dir, col: 2, row: 1 },
    { label: "←", dir: { dx: -1, dy: 0 } as Dir, col: 1, row: 2 },
    { label: "↓", dir: { dx: 0, dy:  1 } as Dir, col: 2, row: 2 },
    { label: "→", dir: { dx:  1, dy: 0 } as Dir, col: 3, row: 2 },
  ];
  return (
    <div className="md:hidden" style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,38px)",
      gridTemplateRows: "repeat(2,38px)",
      gap: 4,
      margin: "10px auto 0",
      width: "fit-content",
    }}>
      {items.map(({ label, dir, col, row }) => (
        <button
          key={label}
          onPointerDown={e => { e.preventDefault(); onPress(dir); }}
          style={{
            gridColumn: col, gridRow: row,
            fontFamily: "monospace", fontSize: "1.1rem", color: G,
            background: "rgba(70,174,34,0.08)", border: `1px solid ${GA22}`,
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", outline: "none", borderRadius: 4,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
