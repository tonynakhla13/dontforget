"use client";

/**
 * KnotBackground
 *
 * A canvas-rendered wireframe (2,3) trefoil torus knot that sits behind
 * all page content, fixed to the viewport. As the user scrolls the about
 * page the knot drifts from section to section (GSAP scrub), grows and
 * shrinks, and rotates continuously. A secondary "breathing" scale runs
 * from the rAF loop so it never feels static.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function KnotBackground() {
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

    /* ── Torus knot (2,3) trefoil geometry ── */
    const KP = 2, KQ = 3;
    const KR = 0.90, Kr = 0.34, TubeR = 0.19;
    const N_PATH = 88;
    const N_RING = 28;
    const N_LONG = 12;

    type V3 = [number, number, number];
    const vadd   = (a: V3, b: V3): V3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
    const vscl   = (a: V3, s: number): V3 => [a[0]*s, a[1]*s, a[2]*s];
    const vcross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const vdot   = (a: V3, b: V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const vnorm  = (a: V3): V3 => { const l = Math.sqrt(vdot(a,a)); return l > 1e-10 ? [a[0]/l,a[1]/l,a[2]/l] : [0,0,1]; };

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

    /* Parallel-transport Frenet frames */
    interface Frame { pt: V3; N: V3; B: V3 }
    const frames: Frame[] = [];
    for (let i = 0; i < N_PATH; i++) {
      frames.push({ pt: knotPt((i/N_PATH)*Math.PI*2), N: [0,0,1], B: [0,0,1] });
    }
    frames[0].N = vnorm(vcross(knotTan(0), [0, 1, 0.4]));
    frames[0].B = vnorm(vcross(knotTan(0), frames[0].N));
    for (let i = 1; i < N_PATH; i++) {
      const pT = knotTan(((i-1)/N_PATH)*Math.PI*2);
      const cT = knotTan((i/N_PATH)*Math.PI*2);
      const axis = vcross(pT, cT);
      const sinA = Math.sqrt(vdot(axis, axis));
      const cosA = vdot(pT, cT);
      if (sinA > 1e-6) {
        const k   = vnorm(axis);
        const ang = Math.atan2(sinA, cosA);
        const c = Math.cos(ang), s = Math.sin(ang);
        const rod = (v: V3): V3 => {
          const d = vdot(k, v), cr = vcross(k, v);
          return [c*v[0]+s*cr[0]+(1-c)*d*k[0], c*v[1]+s*cr[1]+(1-c)*d*k[1], c*v[2]+s*cr[2]+(1-c)*d*k[2]];
        };
        frames[i].N = vnorm(rod(frames[i-1].N));
      } else {
        frames[i].N = frames[i-1].N;
      }
      frames[i].B = vnorm(vcross(cT, frames[i].N));
    }

    /* ── Projection ── */
    function proj3D(pt: V3, W: number, H: number, scale: number, cx: number, cy: number, ry: number, rx: number) {
      let [x, y, z] = pt;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      [x, z] = [x*cy_ + z*sy_, -x*sy_ + z*cy_];
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);
      [y, z] = [y*cx_ - z*sx_, y*sx_ + z*cx_];
      const fov = 3.4, d = fov / (fov + z*0.3);
      return { sx: cx + x*scale*d, sy: cy + y*scale*d, z };
    }

    /* ── Scroll-driven state (GSAP writes into this) ── */
    const state = {
      baseX:  0.65,   // 0–1 normalized viewport position
      baseY:  0.44,
      sScale: 1.00,   // scroll-driven scale multiplier
    };

    /* ── Scroll journey: knot travels page section by section ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start:   "top top",
        end:     "bottom bottom",
        scrub:   2.5,
      },
      defaults: { ease: "none" },
    });

    // Hero → OurStory: slides left and grows
    tl.to(state, { baseX: 0.22, baseY: 0.52, sScale: 1.45, duration: 0.16 }, 0)
    // OurStory → MissionVision: jumps right and shrinks
      .to(state, { baseX: 0.78, baseY: 0.38, sScale: 0.62, duration: 0.14 }, 0.18)
    // MissionVision → TeamSection: drifts center-left, grows large
      .to(state, { baseX: 0.38, baseY: 0.62, sScale: 1.65, duration: 0.18 }, 0.34)
    // TeamSection → Clients: crosses to right, medium
      .to(state, { baseX: 0.74, baseY: 0.42, sScale: 0.78, duration: 0.14 }, 0.54)
    // Clients → Contact: settles center, medium-large
      .to(state, { baseX: 0.52, baseY: 0.55, sScale: 1.25, duration: 0.16 }, 0.70)
    // Contact bottom: moves slightly right, fades small
      .to(state, { baseX: 0.62, baseY: 0.48, sScale: 0.90, duration: 0.14 }, 0.86);

    /* ── rAF loop ── */
    let raf: number, time = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      time += 0.0042;

      const rotY  = time * 0.62;
      const rotX  = 0.28 + Math.sin(time * 0.21) * 0.22;
      // Breathing scale (fast oscillation on top of GSAP scroll scale)
      const breath = 0.88 + Math.sin(time * 0.16) * 0.24;

      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Combine: GSAP scroll position + tiny organic drift
      const driftX = Math.sin(time * 0.28) * 0.035;
      const driftY = Math.cos(time * 0.19) * 0.022;
      const cx = (state.baseX + driftX) * W;
      const cy = (state.baseY + driftY) * H;
      const scale = Math.min(W, H) * 0.30 * state.sScale * breath;

      /* Ring cross-sections */
      const step = Math.max(1, Math.floor(N_PATH / 52));
      for (let i = 0; i < N_PATH; i += step) {
        const fr = frames[i];
        const cPt = proj3D(fr.pt, W, H, scale, cx, cy, rotY, rotX);
        const depth01 = (cPt.z / (KR + Kr) + 1) * 0.5;
        const alpha   = 0.07 + depth01 * 0.28;

        const rp: { sx: number; sy: number }[] = [];
        for (let j = 0; j <= N_RING; j++) {
          const s   = (j / N_RING) * Math.PI * 2;
          const spt = vadd(vadd(fr.pt, vscl(fr.N, Math.cos(s)*TubeR)), vscl(fr.B, Math.sin(s)*TubeR));
          rp.push(proj3D(spt, W, H, scale, cx, cy, rotY, rotX));
        }
        ctx.beginPath();
        ctx.moveTo(rp[0].sx, rp[0].sy);
        for (let k = 1; k < rp.length; k++) ctx.lineTo(rp[k].sx, rp[k].sy);
        ctx.closePath();
        ctx.strokeStyle = `rgba(58,191,138,${Math.max(0.03, Math.min(0.48, alpha))})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      /* Longitudinal lines */
      for (let ls = 0; ls < N_LONG; ls++) {
        const s = (ls / N_LONG) * Math.PI * 2;
        const cs = Math.cos(s), ss = Math.sin(s);
        ctx.beginPath();
        for (let i = 0; i <= N_PATH; i++) {
          const fr  = frames[i % N_PATH];
          const spt = vadd(vadd(fr.pt, vscl(fr.N, cs*TubeR)), vscl(fr.B, ss*TubeR));
          const p   = proj3D(spt, W, H, scale, cx, cy, rotY, rotX);
          if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = "rgba(58,191,138,0.15)";
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      /* Spine */
      ctx.beginPath();
      for (let i = 0; i <= N_PATH; i++) {
        const p = proj3D(frames[i % N_PATH].pt, W, H, scale, cx, cy, rotY, rotX);
        if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = "rgba(58,191,138,0.28)";
      ctx.lineWidth = 1.0;
      ctx.stroke();
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
      style={{ zIndex: 0, opacity: 0.78 }}
    />
  );
}
