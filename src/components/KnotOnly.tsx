"use client";

/**
 * KnotOnly — (3,5) + (4,3) torus knot wireframes
 * Starts very large (overflows viewport), drifts slowly through scroll.
 * Double-pass bloom + travelling light orb.
 * Background sections must stay transparent for the shapes to show through.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function KnotOnly({ opacity = 0.9 }: { opacity?: number }) {
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

    /* ── vec3 helpers ── */
    type V3 = [number, number, number];
    const vadd   = (a: V3, b: V3): V3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
    const vscl   = (a: V3, s: number): V3 => [a[0]*s, a[1]*s, a[2]*s];
    const vcross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const vdot   = (a: V3, b: V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const vnorm  = (a: V3): V3 => { const l = Math.sqrt(vdot(a,a)); return l > 1e-10 ? [a[0]/l,a[1]/l,a[2]/l] : [0,0,1]; };

    function proj(pt: V3, W: number, H: number, scale: number, cx: number, cy: number, ry: number, rx: number) {
      let [x, y, z] = pt;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry); [x, z] = [x*cy_+z*sy_, -x*sy_+z*cy_];
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx); [y, z] = [y*cx_-z*sx_,  y*sx_+z*cx_];
      const fov = 3.4, d = fov / (fov + z * 0.3);
      return { sx: cx + x*scale*d, sy: cy + y*scale*d, z };
    }

    /* ── knot geometry ── */
    interface KnotCfg { KP: number; KQ: number; KR: number; Kr: number; TubeR: number }
    interface Frame { pt: V3; N: V3; B: V3 }

    function buildFrames(cfg: KnotCfg, N: number): Frame[] {
      const { KP, KQ, KR, Kr } = cfg;
      const kpt  = (t: number): V3 => { const phi = KQ*t; return [(KR+Kr*Math.cos(phi))*Math.cos(KP*t),(KR+Kr*Math.cos(phi))*Math.sin(KP*t),Kr*Math.sin(phi)]; };
      const ktan = (t: number): V3 => { const dt=0.002,a=kpt(t-dt),b=kpt(t+dt); return vnorm([b[0]-a[0],b[1]-a[1],b[2]-a[2]]); };
      const frames: Frame[] = [];
      for (let i = 0; i < N; i++) frames.push({ pt: kpt((i/N)*Math.PI*2), N:[0,0,1], B:[0,0,1] });
      frames[0].N = vnorm(vcross(ktan(0), [0,1,0.4]));
      frames[0].B = vnorm(vcross(ktan(0), frames[0].N));
      for (let i = 1; i < N; i++) {
        const pT = ktan(((i-1)/N)*Math.PI*2), cT = ktan((i/N)*Math.PI*2);
        const ax = vcross(pT, cT), sinA = Math.sqrt(vdot(ax,ax)), cosA = vdot(pT,cT);
        if (sinA > 1e-6) {
          const k = vnorm(ax), ang = Math.atan2(sinA, cosA), c = Math.cos(ang), s = Math.sin(ang);
          const rod = (v: V3): V3 => { const d=vdot(k,v),cr=vcross(k,v); return [c*v[0]+s*cr[0]+(1-c)*d*k[0],c*v[1]+s*cr[1]+(1-c)*d*k[1],c*v[2]+s*cr[2]+(1-c)*d*k[2]]; };
          frames[i].N = vnorm(rod(frames[i-1].N));
        } else frames[i].N = frames[i-1].N;
        frames[i].B = vnorm(vcross(cT, frames[i].N));
      }
      return frames;
    }

    /* (3,5) torus knot — 3 lobes, winds 5 times — very different from trefoil */
    /* (4,3) torus knot — 4 lobes, diamond-like structure                      */
    const N_PATH = 150, N_RING = 30, N_LONG = 14;
    const cfgA: KnotCfg = { KP:3, KQ:5, KR:0.86, Kr:0.32, TubeR:0.20 };
    const cfgB: KnotCfg = { KP:4, KQ:3, KR:0.84, Kr:0.28, TubeR:0.17 };
    const framesA = buildFrames(cfgA, N_PATH);
    const framesB = buildFrames(cfgB, N_PATH);

    /* ── draw one knot with bloom + light orb ── */
    function drawKnot(
      frames: Frame[], cfg: KnotCfg,
      W: number, H: number, sc: number, cx: number, cy: number,
      ry: number, rx: number, alpha: number,
      lightT: number
    ) {
      if (alpha < 0.01) return;
      const step = Math.max(1, Math.floor(N_PATH / 70));

      /* ── ring cross-sections (double pass: glow + crisp) ── */
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < N_PATH; i += step) {
          const fr = frames[i];
          const cPt = proj(fr.pt, W, H, sc, cx, cy, ry, rx);
          const d01 = (cPt.z / (cfg.KR + cfg.Kr) + 1) * 0.5;
          const a   = (0.06 + d01 * 0.32) * alpha;
          const rp: { sx: number; sy: number }[] = [];
          for (let j = 0; j <= N_RING; j++) {
            const s = (j / N_RING) * Math.PI * 2;
            const spt = vadd(vadd(fr.pt, vscl(fr.N, Math.cos(s)*cfg.TubeR)), vscl(fr.B, Math.sin(s)*cfg.TubeR));
            rp.push(proj(spt, W, H, sc, cx, cy, ry, rx));
          }
          ctx.beginPath(); ctx.moveTo(rp[0].sx, rp[0].sy);
          for (let k = 1; k < rp.length; k++) ctx.lineTo(rp[k].sx, rp[k].sy);
          ctx.closePath();
          if (pass === 0) {
            ctx.strokeStyle = `rgba(58,191,138,${Math.max(0.01, a * 0.4)})`;
            ctx.lineWidth = 4.5;
          } else {
            ctx.strokeStyle = `rgba(58,191,138,${Math.max(0.02, Math.min(0.55, a))})`;
            ctx.lineWidth = 0.9;
          }
          ctx.stroke();
        }
      }

      /* ── longitudinal lines (double pass) ── */
      for (let pass = 0; pass < 2; pass++) {
        for (let ls = 0; ls < N_LONG; ls++) {
          const s = (ls / N_LONG) * Math.PI * 2, cs = Math.cos(s), ss = Math.sin(s);
          ctx.beginPath();
          for (let i = 0; i <= N_PATH; i++) {
            const fr = frames[i % N_PATH];
            const spt = vadd(vadd(fr.pt, vscl(fr.N, cs*cfg.TubeR)), vscl(fr.B, ss*cfg.TubeR));
            const p = proj(spt, W, H, sc, cx, cy, ry, rx);
            if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
          }
          if (pass === 0) {
            ctx.strokeStyle = `rgba(58,191,138,${0.05 * alpha})`;
            ctx.lineWidth = 3.5;
          } else {
            ctx.strokeStyle = `rgba(58,191,138,${0.15 * alpha})`;
            ctx.lineWidth = 0.7;
          }
          ctx.stroke();
        }
      }

      /* ── centreline (double pass) ── */
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (let i = 0; i <= N_PATH; i++) {
          const p = proj(frames[i % N_PATH].pt, W, H, sc, cx, cy, ry, rx);
          if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        if (pass === 0) {
          ctx.strokeStyle = `rgba(58,191,138,${0.11 * alpha})`;
          ctx.lineWidth = 5.5;
        } else {
          ctx.strokeStyle = `rgba(95,230,170,${0.36 * alpha})`;
          ctx.lineWidth = 1.2;
        }
        ctx.stroke();
      }

      /* ── travelling light orb ── */
      const orbIdx = Math.floor(((lightT % 1 + 1) % 1) * N_PATH);
      const orbPt  = proj(frames[orbIdx].pt, W, H, sc, cx, cy, ry, rx);
      const trailLen = 20;
      for (let t = 0; t < trailLen; t++) {
        const tIdx = ((orbIdx - t + N_PATH) % N_PATH);
        const tPt  = proj(frames[tIdx].pt, W, H, sc, cx, cy, ry, rx);
        const ta   = alpha * (1 - t / trailLen) * 0.52;
        ctx.beginPath();
        ctx.arc(tPt.sx, tPt.sy, 2.0 * (1 - t / trailLen), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,255,200,${ta})`;
        ctx.fill();
      }
      const grd = ctx.createRadialGradient(orbPt.sx, orbPt.sy, 0, orbPt.sx, orbPt.sy, 24);
      grd.addColorStop(0,   `rgba(190,255,225,${0.90 * alpha})`);
      grd.addColorStop(0.22,`rgba(58,255,160,${0.52 * alpha})`);
      grd.addColorStop(0.65,`rgba(58,191,138,${0.14 * alpha})`);
      grd.addColorStop(1,   `rgba(58,191,138,0)`);
      ctx.beginPath();
      ctx.arc(orbPt.sx, orbPt.sy, 24, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    /* ── GSAP scroll states — starts bigger (overflows edge), drifts slowly ── */
    const sA = { bX: 0.62, bY: 0.46, sc: 2.20, al: 1.00 };
    const sB = { bX: 0.28, bY: 0.56, sc: 0.00, al: 0.00 };

    const tl = gsap.timeline({
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 4.5 },
      defaults: { ease: "none" },
    });

    /* Knot A: fills right side → slowly drifts + shrinks as page scrolls */
    tl.to(sA, { bX:0.20, bY:0.52, sc:1.60,             duration:0.22 }, 0.00)
      .to(sA, { bX:0.78, bY:0.36, sc:1.10,             duration:0.24 }, 0.24)
      .to(sA, { bX:0.34, bY:0.60, sc:1.50, al:0.80,    duration:0.22 }, 0.50)
      .to(sA, { bX:0.72, bY:0.44, sc:0.85, al:0.45,    duration:0.16 }, 0.74)
      .to(sA, { bX:0.50, bY:0.52, sc:0.40, al:0.00,    duration:0.10 }, 0.92);

    /* Knot B: enters mid-scroll */
    tl.to(sB, { bX:0.30, bY:0.56, sc:1.55, al:0.80,    duration:0.20 }, 0.36)
      .to(sB, { bX:0.72, bY:0.38, sc:0.95, al:0.68,    duration:0.20 }, 0.58)
      .to(sB, { bX:0.48, bY:0.56, sc:1.45, al:0.78,    duration:0.22 }, 0.80)
      .to(sB, { bX:0.64, bY:0.46, sc:1.15, al:0.70,    duration:0.10 }, 0.94);

    /* ── RAF loop — slow, dreamlike motion ── */
    let raf: number, time = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick); time += 0.0016; // much slower than before
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const base = Math.min(W, H) * 0.52;

      /* Knot A — gentle slow rotation */
      const ryA = time * 0.20, rxA = 0.30 + Math.sin(time * 0.11) * 0.17;
      const brA = 0.92 + Math.sin(time * 0.09) * 0.16;
      const dxA = Math.sin(time * 0.14) * 0.024, dyA = Math.cos(time * 0.10) * 0.015;
      const lightA = (time * 0.08) % 1;
      drawKnot(framesA, cfgA, W, H, base*sA.sc*brA, (sA.bX+dxA)*W, (sA.bY+dyA)*H, ryA, rxA, sA.al, lightA);

      /* Knot B — counter-rotating, slightly different rhythm */
      const ryB = -time * 0.14, rxB = -0.22 + Math.cos(time * 0.09) * 0.14;
      const brB = 0.94 + Math.sin(time * 0.07 + 1.3) * 0.14;
      const dxB = Math.cos(time * 0.12) * 0.020, dyB = Math.sin(time * 0.09) * 0.013;
      const lightB = (time * 0.06 + 0.5) % 1;
      drawKnot(framesB, cfgB, W, H, base*sB.sc*brB, (sB.bX+dxB)*W, (sB.bY+dyB)*H, ryB, rxB, sB.al, lightB);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      tl.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, opacity }}
    />
  );
}
