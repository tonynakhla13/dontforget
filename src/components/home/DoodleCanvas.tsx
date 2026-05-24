"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── colour palette ──────────────────────────────────────────────────────── */
const PALETTE_LIGHT = [
  "rgba(50,68,56,0.88)",
  "rgba(227,85,35,0.84)",
  "rgba(34,31,26,0.80)",
  "rgba(50,68,56,0.78)",
  "rgba(227,85,35,0.80)",
];
const PALETTE_DARK = [
  "rgba(235,222,206,0.90)",
  "rgba(244,185,5,0.92)",
];
const COLOR_STEP_PX = 130;

/* ── bg colour detection ─────────────────────────────────────────────────── */
function parseRGB(str: string): [number, number, number] | null {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}
function getBgRGB(el: Element): [number, number, number] {
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const p = parseRGB(bg);
      if (p) return p;
    }
    node = node.parentElement;
  }
  return [235, 222, 206];
}
function isDark(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b < 100;
}

/* ── rnd ─────────────────────────────────────────────────────────────────── */
function rnd(n = 1) { return (Math.random() - 0.5) * 2 * n; }

/* ════════════════════════════════════════════════════════════════════════════
   FUNNY BRUSHES — all use quadratic / cubic bezier curves
════════════════════════════════════════════════════════════════════════════ */

/** loopy: big wobbly bezier, ~15% chance of a cartoon loop-de-loop */
function drawLoopy(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth   = 3.5 + Math.random() * 2.5;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  if (Math.random() < 0.15) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const r  = 10 + Math.random() * 16;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx + rnd(14), my - r * 1.5, mx, my - r);
    ctx.arc(mx, my, r, -Math.PI / 2, Math.PI * 1.5, false);
    ctx.quadraticCurveTo(mx + rnd(14), my + rnd(14), x2, y2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x1 + rnd(3), y1 + rnd(3));
    ctx.quadraticCurveTo(
      (x1 + x2) / 2 + rnd(36),
      (y1 + y2) / 2 + rnd(36),
      x2 + rnd(3), y2 + rnd(3),
    );
    ctx.stroke();
  }
  ctx.restore();
}

/** squiggly: multi-step bezier zigzag */
function drawSquiggly(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth   = 3 + Math.random() * 2;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  const steps = 3 + Math.floor(Math.random() * 3);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t  = i / steps;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    ctx.quadraticCurveTo(px + rnd(28), py + rnd(28), px + rnd(5), py + rnd(5));
  }
  ctx.stroke();
  ctx.restore();
}

/** bubbly: fat rounded stroke + occasional blob dot */
function drawBubbly(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 8 + Math.random() * 7;
  ctx.lineCap     = "round";
  ctx.globalAlpha = 0.45 + Math.random() * 0.2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(
    (x1 + x2) / 2 + rnd(22),
    (y1 + y2) / 2 + rnd(22),
    x2, y2,
  );
  ctx.stroke();
  if (Math.random() < 0.22) {
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(
      (x1 + x2) / 2 + rnd(24),
      (y1 + y2) / 2 + rnd(24),
      5 + Math.random() * 9,
      0, Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

/** scribbly: two offset overlapping bezier strokes */
function drawScribbly(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
) {
  const cpx = (x1 + x2) / 2 + rnd(36);
  const cpy = (y1 + y2) / 2 + rnd(36);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap     = "round";
  ctx.lineWidth   = 3 + Math.random() * 2;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(x1 + rnd(2), y1 + rnd(2));
  ctx.quadraticCurveTo(cpx, cpy, x2 + rnd(2), y2 + rnd(2));
  ctx.stroke();
  ctx.lineWidth   = 1.6;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(x1 + 5 + rnd(3), y1 + 4 + rnd(3));
  ctx.quadraticCurveTo(cpx + rnd(8), cpy + rnd(8), x2 + 5 + rnd(3), y2 + 4 + rnd(3));
  ctx.stroke();
  ctx.restore();
}

type Brush = "loopy" | "squiggly" | "bubbly" | "scribbly";

const SECTION_MAP: { selector: string; brush: Brush }[] = [
  { selector: ".kbm-hero",        brush: "scribbly" },
  { selector: ".kbm-services",    brush: "loopy"    },
  { selector: ".kbm-process",     brush: "squiggly" },
  { selector: ".kbm-testimonial", brush: "bubbly"   },
  { selector: ".kbm-blog",        brush: "scribbly" },
  { selector: ".kbm-clients",     brush: "loopy"    },
  { selector: ".kbm-principles",  brush: "squiggly" },
  { selector: ".kbm-footer",      brush: "bubbly"   },
];

function applyBrush(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  brush: Brush,
  color: string,
) {
  switch (brush) {
    case "loopy":    drawLoopy(ctx, x1, y1, x2, y2, color);    break;
    case "squiggly": drawSquiggly(ctx, x1, y1, x2, y2, color); break;
    case "bubbly":   drawBubbly(ctx, x1, y1, x2, y2, color);   break;
    case "scribbly": drawScribbly(ctx, x1, y1, x2, y2, color); break;
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
   Canvas is position:absolute — full page height — so it scrolls with the
   page naturally. Doodles are drawn at page coordinates and stay where drawn.
════════════════════════════════════════════════════════════════════════════ */
export default function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const modeRef = useRef<"draw" | "erase">("draw");

  useEffect(() => {
    modeRef.current = mode;
    document.body.style.cursor = mode === "erase" ? "cell" : "";
    return () => { document.body.style.cursor = ""; };
  }, [mode]);

  const getStyle = useCallback((cx: number, cy: number, colorIdx: number) => {
    const el = document.elementFromPoint(cx, cy);
    const [r, g, b] = el ? getBgRGB(el) : ([235, 222, 206] as [number, number, number]);
    const pal   = isDark(r, g, b) ? PALETTE_DARK : PALETTE_LIGHT;
    const color = pal[colorIdx % pal.length];
    if (el) {
      for (const { selector, brush } of SECTION_MAP) {
        if (el.closest(selector)) return { brush, color };
      }
    }
    return { brush: "scribbly" as Brush, color };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    /* size canvas to full page */
    const syncSize = () => {
      canvas.width  = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    syncSize();

    const ro = new ResizeObserver(syncSize);
    ro.observe(document.body);

    /* state */
    const pts: { x: number; y: number }[] = [];
    let distAccum = 0;
    let colorIdx  = 0;
    let mouseX    = 0;
    let mouseY    = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let idleRaf:   number | null = null;
    let idleAngle  = 0;
    let idleRadius = 0;

    /* idle scratch — draws in page coords */
    function startIdle() {
      if (idleRaf !== null || modeRef.current === "erase") return;
      idleAngle = 0; idleRadius = 0;
      const tick = () => {
        idleAngle  += 0.22 + Math.random() * 0.25;
        idleRadius += 0.5;
        if (idleRadius > 62) idleRadius = Math.random() * 4;
        const { brush, color } = getStyle(mouseX, mouseY, colorIdx);
        const pageY = mouseY + window.scrollY;
        const pr    = Math.max(0, idleRadius - 0.5);
        const nx    = mouseX + Math.cos(idleAngle) * idleRadius + rnd(8);
        const ny    = pageY  + Math.sin(idleAngle) * idleRadius + rnd(8);
        const px    = mouseX + Math.cos(idleAngle - 0.22) * pr;
        const py    = pageY  + Math.sin(idleAngle - 0.22) * pr;
        applyBrush(ctx, px, py, nx, ny, brush, color);
        idleRaf = requestAnimationFrame(tick);
      };
      idleRaf = requestAnimationFrame(tick);
    }
    function stopIdle() {
      if (idleRaf !== null) { cancelAnimationFrame(idleRaf); idleRaf = null; }
    }

    const ERASER_R = 30;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const pageY = e.clientY + window.scrollY;

      stopIdle();
      if (idleTimer) clearTimeout(idleTimer);

      if (modeRef.current === "erase") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(e.clientX, pageY, ERASER_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      /* smooth bezier via midpoint technique */
      pts.push({ x: e.clientX, y: pageY });
      if (pts.length > 4) pts.shift();

      if (pts.length >= 3) {
        const p0   = pts[pts.length - 3];
        const p1   = pts[pts.length - 2];
        const p2   = pts[pts.length - 1];
        const dx   = p2.x - p0.x;
        const dy   = p2.y - p0.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
          distAccum += dist;
          if (distAccum >= COLOR_STEP_PX) { colorIdx++; distAccum = 0; }
          const mid0 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
          const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          const { brush, color } = getStyle(mouseX, mouseY, colorIdx);
          applyBrush(ctx, mid0.x, mid0.y, mid1.x, mid1.y, brush, color);
        }
      }

      idleTimer = setTimeout(startIdle, 600);
    };

    const onLeave = () => {
      stopIdle();
      if (idleTimer) clearTimeout(idleTimer);
      pts.length = 0;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      stopIdle();
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [getStyle]);

  return (
    <>
      {/* Absolute canvas — scrolls with the page, doodles stick to their spot */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          zIndex:        1,
        }}
      />

      {/* Eraser / pen toggle — fixed, always visible */}
      <button
        onClick={() => setMode(m => m === "draw" ? "erase" : "draw")}
        title={mode === "draw" ? "Eraser" : "Pen"}
        aria-label={mode === "draw" ? "Switch to eraser" : "Switch to pen"}
        style={{
          position:       "fixed",
          bottom:         28,
          right:          28,
          zIndex:         9999,
          width:          52,
          height:         52,
          borderRadius:   "50%",
          border:         "2px solid #221F1A",
          background:     mode === "erase" ? "#221F1A" : "#EBDECE",
          color:          mode === "erase" ? "#EBDECE" : "#221F1A",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       22,
          lineHeight:     1,
          boxShadow:      "0 2px 14px rgba(0,0,0,0.18)",
          transition:     "background .2s, color .2s",
          userSelect:     "none",
        }}
      >
        {mode === "draw" ? "✏️" : "🧹"}
      </button>
    </>
  );
}
