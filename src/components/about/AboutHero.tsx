"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   CANVAS PARTICLES — soft teal dust
───────────────────────────────────────────────────────────────────────── */
function ParticleStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d")!;
    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number };
    const W = () => canvas.width, H = () => canvas.height;
    const particles: P[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: 0.18 + Math.random() * 0.35, vy: (Math.random() - 0.5) * 0.08,
      size: 0.6 + Math.random() * 1.1, alpha: 0.04 + Math.random() * 0.13,
      phase: Math.random() * Math.PI * 2,
    }));
    let t = 0, raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick); t += 0.005;
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        p.x += p.vx; p.y += Math.sin(t + p.phase) * 0.14 + p.vy;
        if (p.x > W() + 4) { p.x = -4; p.y = Math.random() * H(); }
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,191,138,${p.alpha})`; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 2, opacity: 0.65 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   WIREFRAME TORUS KNOT — (2,3) trefoil, drifts + breathes across hero
───────────────────────────────────────────────────────────────────────── */
function WireframeKnot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    /* ── Torus knot geometry ── */
    const KP = 2, KQ = 3;            // trefoil (2,3)
    const KR = 0.90, Kr = 0.34;      // torus dimensions (normalised)
    const TubeR = 0.19;              // tube radius
    const N_PATH  = 90;              // points along knot spine
    const N_RING  = 30;              // sides per cross-section circle
    const N_LONG  = 12;              // longitudinal lines along tube surface

    type V3 = [number, number, number];
    const vadd  = (a: V3, b: V3): V3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
    const vscl  = (a: V3, s: number): V3 => [a[0]*s, a[1]*s, a[2]*s];
    const vcross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const vdot  = (a: V3, b: V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const vnorm = (a: V3): V3 => { const l = Math.sqrt(vdot(a,a)); return l > 1e-10 ? [a[0]/l,a[1]/l,a[2]/l] : [0,0,1]; };

    function knotPt(t: number): V3 {
      const phi = KQ * t;
      return [
        (KR + Kr * Math.cos(phi)) * Math.cos(KP * t),
        (KR + Kr * Math.cos(phi)) * Math.sin(KP * t),
        Kr * Math.sin(phi),
      ];
    }
    function knotTan(t: number): V3 {
      const dt = 0.002;
      const a = knotPt(t-dt), b = knotPt(t+dt);
      return vnorm([b[0]-a[0], b[1]-a[1], b[2]-a[2]]);
    }

    /* Parallel-transport Frenet frames for stable orientation */
    interface Frame { pt: V3; N: V3; B: V3 }
    const frames: Frame[] = [];

    for (let i = 0; i < N_PATH; i++) {
      const t = (i / N_PATH) * Math.PI * 2;
      frames.push({ pt: knotPt(t), N: [0,0,1], B: [0,0,1] });
    }
    // Seed first normal (avoid parallel to Z)
    const T0 = knotTan(0);
    frames[0].N = vnorm(vcross(T0, [0, 1, 0.4]));
    frames[0].B = vnorm(vcross(T0, frames[0].N));

    for (let i = 1; i < N_PATH; i++) {
      const prevT = knotTan(((i-1) / N_PATH) * Math.PI * 2);
      const currT = knotTan((i / N_PATH) * Math.PI * 2);
      const axis = vcross(prevT, currT);
      const sinA  = Math.sqrt(vdot(axis, axis));
      const cosA  = vdot(prevT, currT);
      if (sinA > 1e-6) {
        const k = vnorm(axis);
        const ang = Math.atan2(sinA, cosA);
        const c = Math.cos(ang), s = Math.sin(ang);
        const rod = (v: V3): V3 => {
          const d = vdot(k, v);
          const cr = vcross(k, v);
          return [c*v[0]+s*cr[0]+(1-c)*d*k[0], c*v[1]+s*cr[1]+(1-c)*d*k[1], c*v[2]+s*cr[2]+(1-c)*d*k[2]];
        };
        frames[i].N = vnorm(rod(frames[i-1].N));
      } else {
        frames[i].N = frames[i-1].N;
      }
      frames[i].B = vnorm(vcross(currT, frames[i].N));
    }

    /* ── Projection helper ── */
    function proj(pt: V3, W: number, H: number, scale: number, cx: number, cy: number, ry: number, rx: number) {
      let [x, y, z] = pt;
      // Rotate Y
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      [x, z] = [x*cy_ + z*sy_, -x*sy_ + z*cy_];
      // Rotate X
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);
      [y, z] = [y*cx_ - z*sx_, y*sx_ + z*cx_];
      // Soft perspective
      const fov = 3.4;
      const d = fov / (fov + z * 0.3);
      return { sx: cx + x*scale*d, sy: cy + y*scale*d, z };
    }

    /* ── Animation state ── */
    let raf: number, time = 0;
    let posX = 0.64, posY = 0.46;
    let velX = 0.00020, velY = 0.00012;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      time += 0.0045;

      const rotY = time * 0.65;
      const rotX = 0.30 + Math.sin(time * 0.22) * 0.20;
      const scaleBreath = 0.88 + Math.sin(time * 0.17) * 0.24; // breathe 0.64–1.12×

      // Drift — bounces between 15%–85% horizontally, 25%–75% vertically
      posX += velX; posY += velY;
      if (posX > 0.84 || posX < 0.14) velX *= -1;
      if (posY > 0.74 || posY < 0.26) velY *= -1;

      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const scale = Math.min(W, H) * 0.31 * scaleBreath;
      const cx = posX * W, cy = posY * H;

      /* — Ring cross-sections (meridians) — */
      const ringStep = Math.max(1, Math.floor(N_PATH / 55));
      for (let i = 0; i < N_PATH; i += ringStep) {
        const fr = frames[i];
        const cPt = proj(fr.pt, W, H, scale, cx, cy, rotY, rotX);
        // Depth fade: front rings are brighter
        const depth01 = (cPt.z / (KR + Kr) + 1) * 0.5;
        const alpha = 0.08 + depth01 * 0.30;

        const rp: { sx: number; sy: number }[] = [];
        for (let j = 0; j <= N_RING; j++) {
          const s   = (j / N_RING) * Math.PI * 2;
          const spt = vadd(vadd(fr.pt, vscl(fr.N, Math.cos(s)*TubeR)), vscl(fr.B, Math.sin(s)*TubeR));
          rp.push(proj(spt, W, H, scale, cx, cy, rotY, rotX));
        }
        ctx.beginPath();
        ctx.moveTo(rp[0].sx, rp[0].sy);
        for (let k = 1; k < rp.length; k++) ctx.lineTo(rp[k].sx, rp[k].sy);
        ctx.closePath();
        ctx.strokeStyle = `rgba(58,191,138,${Math.max(0.04, Math.min(0.52, alpha))})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      /* — Longitudinal lines (parallels along the tube) — */
      for (let ls = 0; ls < N_LONG; ls++) {
        const s = (ls / N_LONG) * Math.PI * 2;
        const cs = Math.cos(s), ss = Math.sin(s);
        ctx.beginPath();
        for (let i = 0; i <= N_PATH; i++) {
          const fr = frames[i % N_PATH];
          const spt = vadd(vadd(fr.pt, vscl(fr.N, cs*TubeR)), vscl(fr.B, ss*TubeR));
          const p = proj(spt, W, H, scale, cx, cy, rotY, rotX);
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = "rgba(58,191,138,0.18)";
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      /* — Spine (knot path) — */
      ctx.beginPath();
      for (let i = 0; i <= N_PATH; i++) {
        const p = proj(frames[i % N_PATH].pt, W, H, scale, cx, cy, rotY, rotX);
        if (i === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = "rgba(58,191,138,0.32)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    };

    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 3, opacity: 0.80 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────── */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  /* Entrance animation — plays on mount */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(line1Ref.current, { autoAlpha: 0, xPercent: -6 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, 0)
        .fromTo(line2Ref.current, { autoAlpha: 0, xPercent:  6 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, 0.08)
        .fromTo(line3Ref.current, { autoAlpha: 0, y: 40       }, { autoAlpha: 1, y: 0,         duration: 1.0 }, 0.2)
        .fromTo(subRef.current,   { autoAlpha: 0, y: 24       }, { autoAlpha: 1, y: 0,         duration: 0.8 }, 0.4)
        .fromTo(statsRef.current?.children ?? [],
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7 }, 0.55);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "transparent", minHeight: "100dvh" }}>

      {/* Wireframe torus knot — drifts across hero */}
      <WireframeKnot />

      {/* Particle dust — floats in front of knot */}
      <ParticleStream />

      {/* Radial vignette — keeps edges dark */}
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{
        zIndex: 4,
        background: [
          "radial-gradient(ellipse 80% 85% at 50% 50%, transparent 42%, rgba(9,9,9,0.65) 100%)",
          "linear-gradient(to right,  rgba(9,9,9,0.80) 0%, transparent 16%, transparent 84%, rgba(9,9,9,0.80) 100%)",
          "linear-gradient(to bottom, rgba(9,9,9,0.55) 0%, transparent 18%)",
        ].join(","),
      }} />

      {/* Hard bottom fade — clean transition to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
        style={{ height: "24vh", background: "linear-gradient(to bottom, transparent, rgba(9,9,9,0.97))" }} />

      {/* ── Heading block ── */}
      <div className="wrap relative" style={{ zIndex: 10, paddingTop: "clamp(7rem,14vh,11rem)" }}>

        {/* "WE BUILD" */}
        <div ref={line1Ref} style={{ lineHeight: 0.88, overflow: "hidden" }}>
          <h1 className="hed" style={{
            fontSize: "clamp(4rem, 20vw, 22rem)",
            letterSpacing: "-0.02em",
            color: "var(--fg)",
          }}>
            we build
          </h1>
        </div>

        {/* "THINGS" — outline stroke, right-aligned */}
        <div ref={line2Ref} style={{ lineHeight: 0.88, overflow: "hidden", textAlign: "right", marginTop: "-0.04em", position: "relative", zIndex: 12 }}>
          <h1 className="hed" style={{
            fontSize: "clamp(4rem, 20vw, 22rem)",
            letterSpacing: "-0.02em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(240,236,227,0.65)",
          }}>
            things
          </h1>
        </div>

        {/* "unforgettable." — italic teal */}
        <div ref={line3Ref} style={{ overflow: "hidden", marginTop: "-0.02em" }}>
          <h1 className="hed script" style={{
            fontSize: "clamp(2.8rem, 11.5vw, 13rem)",
            letterSpacing: "-0.01em",
            color: "var(--teal)",
            fontStyle: "italic",
          }}>
            unforgettable.
          </h1>
        </div>

        {/* ── Stats ── */}
        <div ref={statsRef} className="relative mt-8 flex items-end justify-between">
          {[
            { value: "14+", label: "projects shipped" },
            { value: "6",   label: "countries served" },
            { value: "3yr", label: "building since '22" },
          ].map(s => (
            <div key={s.label}>
              <p className="hed" style={{ fontSize: "clamp(1.6rem,3vw,2.8rem)", lineHeight: 1, color: "var(--fg)" }}>{s.value}</p>
              <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--body)", marginTop: "0.3rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Sub copy + CTA ── */}
        <div ref={subRef} className="mt-10 flex flex-col items-center gap-7 pb-10 text-center">
          <p className="eyebrow" style={{ letterSpacing: "0.36em" }}>Est. 2022 — Digital Studio</p>

          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1.5 pl-6"
            style={{ background: "rgba(17,17,17,0.65)", backdropFilter: "blur(14px)" }}>
            <span className="text-sm" style={{ color: "var(--body)" }}>Got something worth remembering?</span>
            <a href="#contact" className="rounded-full px-6 py-3 text-sm font-medium transition-colors"
              style={{ background: "var(--teal)", color: "var(--bg)" }}>
              Let&apos;s talk
            </a>
          </div>

          <p className="max-w-md text-[0.9rem] leading-[1.9]" style={{ color: "var(--body)" }}>
            A small studio obsessed with craft, speed, and digital work that makes people stop scrolling.
            Not a factory. Not a freelancer. Something better than both.
          </p>
        </div>

      </div>
    </section>
  );
}
