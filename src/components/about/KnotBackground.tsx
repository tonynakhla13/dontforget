"use client";

/**
 * KnotBackground — two independently-travelling wireframe knots behind the
 * entire about page.  Knot A = trefoil (2,3), Knot B = cinquefoil (2,5).
 * GSAP scrub moves + scales them across sections; canvas rAF adds breathing
 * and rotation so they're always alive even when you're not scrolling.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function KnotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    /* ── Vec3 helpers ── */
    type V3 = [number, number, number];
    const vadd   = (a:V3,b:V3):V3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    const vscl   = (a:V3,s:number):V3 => [a[0]*s,a[1]*s,a[2]*s];
    const vcross = (a:V3,b:V3):V3 => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const vdot   = (a:V3,b:V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const vnorm  = (a:V3):V3 => { const l=Math.sqrt(vdot(a,a)); return l>1e-10?[a[0]/l,a[1]/l,a[2]/l]:[0,0,1]; };

    interface KnotCfg { KP:number; KQ:number; KR:number; Kr:number; TubeR:number }
    interface Frame   { pt:V3; N:V3; B:V3 }

    /* Build parallel-transport frames once per knot type */
    function buildFrames(cfg:KnotCfg, N:number): Frame[] {
      const {KP,KQ,KR,Kr} = cfg;
      const pt = (t:number):V3 => {
        const phi=KQ*t;
        return [(KR+Kr*Math.cos(phi))*Math.cos(KP*t),(KR+Kr*Math.cos(phi))*Math.sin(KP*t),Kr*Math.sin(phi)];
      };
      const tan = (t:number):V3 => {
        const dt=0.002,a=pt(t-dt),b=pt(t+dt);
        return vnorm([b[0]-a[0],b[1]-a[1],b[2]-a[2]]);
      };
      const frames:Frame[] = [];
      for (let i=0;i<N;i++) frames.push({pt:pt((i/N)*Math.PI*2),N:[0,0,1],B:[0,0,1]});
      frames[0].N=vnorm(vcross(tan(0),[0,1,0.4]));
      frames[0].B=vnorm(vcross(tan(0),frames[0].N));
      for (let i=1;i<N;i++) {
        const pT=tan(((i-1)/N)*Math.PI*2), cT=tan((i/N)*Math.PI*2);
        const axis=vcross(pT,cT); const sinA=Math.sqrt(vdot(axis,axis)), cosA=vdot(pT,cT);
        if (sinA>1e-6) {
          const k=vnorm(axis), ang=Math.atan2(sinA,cosA), c=Math.cos(ang), s=Math.sin(ang);
          const rod=(v:V3):V3 => { const d=vdot(k,v),cr=vcross(k,v); return [c*v[0]+s*cr[0]+(1-c)*d*k[0],c*v[1]+s*cr[1]+(1-c)*d*k[1],c*v[2]+s*cr[2]+(1-c)*d*k[2]]; };
          frames[i].N=vnorm(rod(frames[i-1].N));
        } else frames[i].N=frames[i-1].N;
        frames[i].B=vnorm(vcross(cT,frames[i].N));
      }
      return frames;
    }

    const N_PATH=90, N_RING=28, N_LONG=11;

    const cfgA:KnotCfg = {KP:2,KQ:3,KR:0.90,Kr:0.34,TubeR:0.19}; // trefoil
    const cfgB:KnotCfg = {KP:2,KQ:5,KR:0.88,Kr:0.28,TubeR:0.15}; // cinquefoil

    const framesA = buildFrames(cfgA, N_PATH);
    const framesB = buildFrames(cfgB, N_PATH);

    /* Projection */
    function proj(pt:V3,W:number,H:number,sc:number,cx:number,cy:number,ry:number,rx:number) {
      let [x,y,z]=pt;
      const cy_=Math.cos(ry),sy_=Math.sin(ry); [x,z]=[x*cy_+z*sy_,-x*sy_+z*cy_];
      const cx_=Math.cos(rx),sx_=Math.sin(rx); [y,z]=[y*cx_-z*sx_,y*sx_+z*cx_];
      const fov=3.4,d=fov/(fov+z*0.3);
      return {sx:cx+x*sc*d,sy:cy+y*sc*d,z};
    }

    /* Draw one knot */
    function drawKnot(frames:Frame[],cfg:KnotCfg,W:number,H:number,sc:number,cx:number,cy:number,ry:number,rx:number,alpha:number) {
      if (alpha<0.01) return;
      const step=Math.max(1,Math.floor(N_PATH/52));
      // Rings
      for (let i=0;i<N_PATH;i+=step) {
        const fr=frames[i];
        const cPt=proj(fr.pt,W,H,sc,cx,cy,ry,rx);
        const d01=(cPt.z/(cfg.KR+cfg.Kr)+1)*0.5;
        const a=(0.06+d01*0.30)*alpha;
        const rp:{sx:number;sy:number}[]=[];
        for (let j=0;j<=N_RING;j++) {
          const s=(j/N_RING)*Math.PI*2;
          const spt=vadd(vadd(fr.pt,vscl(fr.N,Math.cos(s)*cfg.TubeR)),vscl(fr.B,Math.sin(s)*cfg.TubeR));
          rp.push(proj(spt,W,H,sc,cx,cy,ry,rx));
        }
        ctx.beginPath(); ctx.moveTo(rp[0].sx,rp[0].sy);
        for (let k=1;k<rp.length;k++) ctx.lineTo(rp[k].sx,rp[k].sy);
        ctx.closePath();
        ctx.strokeStyle=`rgba(58,191,138,${Math.max(0.02,Math.min(0.52,a))})`; ctx.lineWidth=0.85; ctx.stroke();
      }
      // Longitudinals
      for (let ls=0;ls<N_LONG;ls++) {
        const s=(ls/N_LONG)*Math.PI*2, cs=Math.cos(s), ss=Math.sin(s);
        ctx.beginPath();
        for (let i=0;i<=N_PATH;i++) {
          const fr=frames[i%N_PATH];
          const spt=vadd(vadd(fr.pt,vscl(fr.N,cs*cfg.TubeR)),vscl(fr.B,ss*cfg.TubeR));
          const p=proj(spt,W,H,sc,cx,cy,ry,rx);
          if(i===0) ctx.moveTo(p.sx,p.sy); else ctx.lineTo(p.sx,p.sy);
        }
        ctx.strokeStyle=`rgba(58,191,138,${0.14*alpha})`; ctx.lineWidth=0.65; ctx.stroke();
      }
      // Spine
      ctx.beginPath();
      for (let i=0;i<=N_PATH;i++) {
        const p=proj(frames[i%N_PATH].pt,W,H,sc,cx,cy,ry,rx);
        if(i===0) ctx.moveTo(p.sx,p.sy); else ctx.lineTo(p.sx,p.sy);
      }
      ctx.strokeStyle=`rgba(58,191,138,${0.28*alpha})`; ctx.lineWidth=1.0; ctx.stroke();
    }

    /* ── GSAP-driven scroll state ── */
    // Knot A: trefoil, starts on the right (hero), travels the full page
    const sA = { bX:0.72, bY:0.44, sc:1.00, al:1.00 };
    // Knot B: cinquefoil, hidden at start, emerges mid-page
    const sB = { bX:0.30, bY:0.55, sc:0.00, al:0.00 };

    const tl = gsap.timeline({
      scrollTrigger: { trigger:document.body, start:"top top", end:"bottom bottom", scrub:2.5 },
      defaults: { ease:"none" },
    });

    // Knot A journey: right (hero) → left (story) → right (mission) → left (team) → fades
    tl.to(sA,{bX:0.18,bY:0.50,sc:1.50,            duration:0.17},0.00)
      .to(sA,{bX:0.76,bY:0.36,sc:0.62,            duration:0.15},0.19)
      .to(sA,{bX:0.32,bY:0.60,sc:1.60,al:0.80,    duration:0.17},0.36)
      .to(sA,{bX:0.72,bY:0.40,sc:0.75,al:0.45,    duration:0.14},0.55)
      .to(sA,{bX:0.50,bY:0.52,sc:0.50,al:0.00,    duration:0.09},0.71);

    // Knot B journey: emerges center-left (team) → moves right (clients) → settles (contact)
    tl.to(sB,{bX:0.28,bY:0.54,sc:1.25,al:0.85,    duration:0.15},0.35)
      .to(sB,{bX:0.74,bY:0.38,sc:0.72,al:0.60,    duration:0.15},0.52)
      .to(sB,{bX:0.46,bY:0.54,sc:1.35,al:0.82,    duration:0.18},0.69)
      .to(sB,{bX:0.62,bY:0.46,sc:1.00,al:0.70,    duration:0.10},0.89);

    /* ── rAF loop ── */
    let raf:number, time=0;

    const tick = () => {
      raf=requestAnimationFrame(tick); time+=0.0042;
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);
      const base=Math.min(W,H)*0.30;

      // Knot A — trefoil, spins clockwise
      const ryA=time*0.64, rxA=0.28+Math.sin(time*0.20)*0.21;
      const brA=0.87+Math.sin(time*0.16)*0.24;
      const dxA=Math.sin(time*0.27)*0.032, dyA=Math.cos(time*0.18)*0.020;
      drawKnot(framesA,cfgA,W,H, base*sA.sc*brA, (sA.bX+dxA)*W,(sA.bY+dyA)*H, ryA,rxA, sA.al);

      // Knot B — cinquefoil, counter-rotates
      const ryB=-time*0.46, rxB=-0.24+Math.cos(time*0.17)*0.18;
      const brB=0.90+Math.sin(time*0.13+1.3)*0.22;
      const dxB=Math.cos(time*0.23)*0.028, dyB=Math.sin(time*0.16)*0.018;
      drawKnot(framesB,cfgB,W,H, base*sB.sc*brB, (sB.bX+dxB)*W,(sB.bY+dyB)*H, ryB,rxB, sB.al);
    };

    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); tl.kill(); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0"
      style={{ zIndex:0, opacity:0.80 }} />
  );
}
