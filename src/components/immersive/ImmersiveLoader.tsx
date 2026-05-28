"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import ImmersiveLogo from "./ImmersiveLogo";

// ── Pipe-grid canvas ──────────────────────────────────────────────────────────
type Panel = { x: number; y: number; vx: number; vy: number; w: number; h: number; cols: number; rows: number; opacity: number; phase: number; };
function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function makePanel(W: number, H: number): Panel {
  const depth = rand(0.2, 1.0), w = rand(80, 280) * (0.3 + depth * 0.7), h = w * rand(0.4, 0.7), speed = 0.06 + depth * 0.14;
  return { x: rand(-w, W), y: rand(-h, H), vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed * 0.65, w, h, cols: Math.round(rand(3, 7)), rows: Math.round(rand(2, 5)), opacity: 0.06 + depth * 0.18, phase: Math.random() * Math.PI * 2 };
}
function usePipeGrid(ref: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current; if (!canvas) return;
    const sync = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    sync(); window.addEventListener("resize", sync);
    const ctx = canvas.getContext("2d")!;
    let panels = Array.from({ length: 22 }, () => makePanel(canvas.width, canvas.height));
    let t = 0, raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const p of panels) {
        const a = p.opacity * (0.85 + 0.15 * Math.sin(t * 0.5 + p.phase));
        ctx.strokeStyle = `rgba(58,191,138,${a})`; ctx.lineWidth = 0.7; ctx.strokeRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = `rgba(58,191,138,${a * 0.45})`; ctx.lineWidth = 0.35;
        for (let c = 1; c < p.cols; c++) { ctx.beginPath(); ctx.moveTo(p.x + c * p.w / p.cols, p.y); ctx.lineTo(p.x + c * p.w / p.cols, p.y + p.h); ctx.stroke(); }
        for (let r = 1; r < p.rows; r++) { ctx.beginPath(); ctx.moveTo(p.x, p.y + r * p.h / p.rows); ctx.lineTo(p.x + p.w, p.y + r * p.h / p.rows); ctx.stroke(); }
        ctx.fillStyle = `rgba(58,191,138,${a * 1.4})`; const d = 2.5;
        [[p.x, p.y], [p.x + p.w, p.y], [p.x, p.y + p.h], [p.x + p.w, p.y + p.h]].forEach(([cx, cy]) => ctx.fillRect(cx - d / 2, cy - d / 2, d, d));
        p.x += p.vx; p.y += p.vy;
        const pad = Math.max(p.w, p.h) + 20;
        if (p.x > W + pad) p.x = -pad; if (p.x < -pad) p.x = W + pad;
        if (p.y > H + pad) p.y = -pad; if (p.y < -pad) p.y = H + pad;
      }
      t += 0.016;
    };
    const onResize = () => { panels = Array.from({ length: 22 }, () => makePanel(canvas.width, canvas.height)); };
    window.addEventListener("resize", onResize);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", sync); window.removeEventListener("resize", onResize); };
  }, [active, ref]);
}

// ── Words move within a contained left-side box ───────────────────────────────
const WORDS = ["WE", "MAKE", "GREAT", "THINGS"];

// Box bounds (% of viewport): left third, top portion — above the logo
const BOX = { l: 4, r: 46, t: 6, b: 64 };

function moveInBox(el: HTMLSpanElement, stopAt: number) {
  if (performance.now() > stopAt) return;
  gsap.to(el, {
    left: `${BOX.l + Math.random() * (BOX.r - BOX.l)}%`,
    top:  `${BOX.t + Math.random() * (BOX.b - BOX.t)}%`,
    duration: 0.6 + Math.random() * 0.3,
    ease: "power3.inOut",
    onComplete: () => gsap.delayedCall(0.25 + Math.random() * 0.4, () => moveInBox(el, stopAt)),
  });
}

// ── Eye twitch ────────────────────────────────────────────────────────────────
function startEyeTwitch(logoEl: HTMLElement | null) {
  if (!logoEl) return;
  const px = logoEl.querySelector(".immersive-logo-pupil-x");
  const py = logoEl.querySelector(".immersive-logo-pupil-y");
  if (!px || !py) return;

  function twitch() {
    const dx = (Math.random() - 0.5) * 55;
    const dy = (Math.random() - 0.5) * 26;
    gsap.timeline()
      .to(px, { x: dx, duration: 0.07, ease: "power4.out" }, 0)
      .to(py, { y: dy, duration: 0.07, ease: "power4.out" }, 0)
      .to(px, { x: 0,  duration: 0.55, ease: "elastic.out(1,0.35)" }, 0.07)
      .to(py, { y: 0,  duration: 0.55, ease: "elastic.out(1,0.35)" }, 0.07);
    gsap.delayedCall(0.9 + Math.random() * 1.8, twitch);
  }
  gsap.delayedCall(0.3, twitch);
}

// ── Module flag — skip on soft navigation ────────────────────────────────────
let shownOnThisLoad = false;

// ── Component ─────────────────────────────────────────────────────────────────
export default function ImmersiveLoader() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const wordRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const [phase, setPhase] = useState<"check" | "animate" | "done">("check");

  useEffect(() => {
    if (shownOnThisLoad) { setPhase("done"); }
    else { shownOnThisLoad = true; setPhase("animate"); }
  }, []);

  usePipeGrid(canvasRef, phase === "animate");

  useEffect(() => {
    if (phase !== "animate") return;
    document.body.style.overflow = "hidden";

    const wordEls = wordRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));

    // Place words at starting positions spread within the box
    wordEls.forEach((el, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      gsap.set(el, {
        left:  `${BOX.l + col * (BOX.r - BOX.l) * 0.55 + rand(0, 8)}%`,
        top:   `${BOX.t + row * (BOX.b - BOX.t) * 0.5  + rand(0, 6)}%`,
      });
    });

    const DURATION = 4.6;
    const stopAt   = performance.now() + (DURATION - 1.0) * 1000;
    const counter  = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => { document.body.style.overflow = ""; setPhase("done"); },
    });

    // Counter runs from t = 0 throughout
    tl.to(counter, {
      v: 100,
      duration: DURATION - 0.9,
      ease: "power2.inOut",
      onUpdate() {
        const n = Math.round(counter.v);
        if (counterRef.current) counterRef.current.textContent = `${n}%`;
        if (barRef.current)     barRef.current.style.transform = `scaleX(${n / 100})`;
      },
    }, 0);

    // ① Logo appears FIRST
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
      0
    );

    // ② Words appear in their box area after logo
    tl.fromTo(wordEls,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, stagger: 0.09, duration: 0.5, ease: "back.out(1.5)" },
      0.65
    );

    // ③ Eye twitching + contained word movement starts
    tl.call(() => {
      startEyeTwitch(logoRef.current);
      wordEls.forEach((el, i) => gsap.delayedCall(i * 0.12, () => moveInBox(el, stopAt)));
    }, [], 1.1);

    // ④ Exit
    tl.to(wordEls,         { opacity: 0, duration: 0.28, ease: "power2.in" }, DURATION - 1.1);
    tl.to(logoRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" }, DURATION - 1.0);
    tl.to(rootRef.current, { yPercent: -100, duration: 0.85, ease: "power3.inOut" }, DURATION - 0.88);

    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, [phase]);

  if (phase !== "animate") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 300, background: "#060a08" }}
      aria-hidden="true"
    >
      {/* Pipe-grid canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: "radial-gradient(ellipse 55% 50% at 28% 70%, rgba(58,191,138,0.06) 0%, transparent 65%)",
      }} />

      {/* Words — contained in left-side box, above logo */}
      {WORDS.map((word, i) => (
        <span
          key={word}
          ref={el => { wordRefs.current[i] = el; }}
          className="pointer-events-none select-none absolute"
          style={{
            zIndex: 2,
            opacity: 0,
            fontSize: "clamp(2.8rem, 8vw, 9.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {word}
        </span>
      ))}

      {/* Logo — very large, bottom-left */}
      <div
        ref={logoRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 3,
          opacity: 0,
          bottom: "clamp(1.5rem, 4vh, 2.5rem)",
          left:   "clamp(1.5rem, 3vw, 2.5rem)",
          width:  "clamp(300px, 52vw, 780px)",
        }}
      >
        <ImmersiveLogo />
      </div>

      {/* Counter — bottom-right, independent */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 3,
          bottom: "clamp(1rem, 3vh, 2rem)",
          right:  "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <span
          ref={counterRef}
          className="font-mono tabular-nums"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 11rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#3ABF8A",
          }}
        >
          0%
        </span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ zIndex: 4, height: "1px", background: "rgba(58,191,138,0.08)" }}>
        <div ref={barRef} className="h-full w-full origin-left" style={{ background: "rgba(58,191,138,0.55)", transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
