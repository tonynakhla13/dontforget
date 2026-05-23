"use client";

/**
 * KnotBackground
 *
 * Three canvas layers share one fixed <canvas>:
 *  1. Text mesh  — "DON'T FORGET" sampled from offscreen canvas → 3-D wireframe
 *  2. Knot A     — trefoil  (2,3), travels right→left→right as you scroll
 *  3. Knot B     — cinquefoil (2,5), fades in midway and counter-travels
 *
 * No Framer Motion. GSAP scrub drives scroll-based position / scale / alpha.
 * Canvas rAF adds continuous rotation and breathing.
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

    /* ────────────────────────────────────────────
       VEC3 HELPERS
    ──────────────────────────────────────────── */
    type V3 = [number, number, number];
    const vadd   = (a:V3,b:V3):V3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    const vscl   = (a:V3,s:number):V3 => [a[0]*s,a[1]*s,a[2]*s];
    const vcross = (a:V3,b:V3):V3 => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const vdot   = (a:V3,b:V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const vnorm  = (a:V3):V3 => { const l=Math.sqrt(vdot(a,a)); return l>1e-10?[a[0]/l,a[1]/l,a[2]/l]:[0,0,1]; };

    /* Shared projection — rotates around Y then X, then perspective */
    function proj(
      pt:V3, W:number,H:number,
      scale:number, cx:number, cy:number,
      ry:number, rx:number
    ) {
      let [x,y,z]=pt;
      const cy_=Math.cos(ry),sy_=Math.sin(ry); [x,z]=[x*cy_+z*sy_,-x*sy_+z*cy_];
      const cx_=Math.cos(rx),sx_=Math.sin(rx); [y,z]=[y*cx_-z*sx_,y*sx_+z*cx_];
      const fov=3.4, d=fov/(fov+z*0.3);
      return {sx:cx+x*scale*d, sy:cy+y*scale*d, z};
    }

    /* ────────────────────────────────────────────
       1. TEXT MESH — "DON'T FORGET"
    ──────────────────────────────────────────── */
    const OFF_W=1400, OFF_H=340;
    const offscreen = document.createElement("canvas");
    offscreen.width=OFF_W; offscreen.height=OFF_H;
    const oc=offscreen.getContext("2d")!;

    // Render text to sample from — use heaviest weight available
    oc.fillStyle="#ffffff";
    oc.textAlign="center";
    oc.textBaseline="middle";

    // Try to match the site's heading font; fall back to system bold
    oc.font = `900 138px "Arial Black", "Arial Bold", Gadget, sans-serif`;
    oc.fillText("DON'T",  OFF_W/2, OFF_H*0.28);
    oc.fillText("FORGET", OFF_W/2, OFF_H*0.75);

    const imgData = oc.getImageData(0,0,OFF_W,OFF_H).data;

    const textPts: V3[] = [];
    const STRIDE=9;
    for (let y=0;y<OFF_H;y+=STRIDE) {
      for (let x=0;x<OFF_W;x+=STRIDE) {
        if (imgData[(y*OFF_W+x)*4+3]>100) {
          textPts.push([
            (x/OFF_W - 0.5)*3.4,           // x: -1.7 → 1.7
            (y/OFF_H - 0.5)*0.82,           // y: -0.41 → 0.41
            (Math.random()-0.5)*0.18,        // z: tiny depth
          ]);
        }
      }
    }

    // Build mesh pairs via spatial grid (O(n) instead of O(n²))
    const CELL=0.14;
    const grid=new Map<string,number[]>();
    textPts.forEach((p,i)=>{
      const gx=Math.floor(p[0]/CELL), gy=Math.floor(p[1]/CELL);
      const k=`${gx},${gy}`;
      if(!grid.has(k))grid.set(k,[]);
      grid.get(k)!.push(i);
    });

    const THRESH=0.19;
    const textPairs:[number,number][]=[];
    textPts.forEach((p,i)=>{
      const gx=Math.floor(p[0]/CELL), gy=Math.floor(p[1]/CELL);
      for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) {
        for(const j of (grid.get(`${gx+dx},${gy+dy}`)??[])) {
          if(j<=i) continue;
          const d2=(p[0]-textPts[j][0])**2+(p[1]-textPts[j][1])**2;
          if(d2<THRESH*THRESH) textPairs.push([i,j]);
        }
      }
    });

    function drawText(W:number,H:number,rotY:number,globalAlpha:number) {
      if(globalAlpha<0.01||!textPts.length) return;

      // Scale so text spans ~76% of viewport width
      const scale=W*0.40;
      const cx=W/2, cy=H/2;

      // Project all points once per frame
      const pp=textPts.map(p=>proj(p,W,H,scale,cx,cy,rotY,0.0));

      // Lines — single path for performance
      ctx.beginPath();
      for(const [i,j] of textPairs) {
        ctx.moveTo(pp[i].sx,pp[i].sy);
        ctx.lineTo(pp[j].sx,pp[j].sy);
      }
      ctx.strokeStyle=`rgba(58,191,138,${(0.13*globalAlpha).toFixed(3)})`;
      ctx.lineWidth=0.55;
      ctx.stroke();

      // Dots — single path
      ctx.beginPath();
      for(const p of pp) {
        const a=0.12+(p.z*1.2+0.5)*0.28;
        ctx.moveTo(p.sx+1,p.sy);
        ctx.arc(p.sx,p.sy,1.1,0,Math.PI*2);
      }
      ctx.fillStyle=`rgba(58,191,138,${(0.40*globalAlpha).toFixed(3)})`;
      ctx.fill();
    }

    /* ────────────────────────────────────────────
       2 & 3. TORUS KNOTS
    ──────────────────────────────────────────── */
    interface KnotCfg{KP:number;KQ:number;KR:number;Kr:number;TubeR:number}
    interface Frame{pt:V3;N:V3;B:V3}

    function buildFrames(cfg:KnotCfg,N:number):Frame[]{
      const{KP,KQ,KR,Kr}=cfg;
      const kpt=(t:number):V3=>{const phi=KQ*t;return[(KR+Kr*Math.cos(phi))*Math.cos(KP*t),(KR+Kr*Math.cos(phi))*Math.sin(KP*t),Kr*Math.sin(phi)];};
      const ktan=(t:number):V3=>{const dt=0.002,a=kpt(t-dt),b=kpt(t+dt);return vnorm([b[0]-a[0],b[1]-a[1],b[2]-a[2]]);};
      const frames:Frame[]=[];
      for(let i=0;i<N;i++) frames.push({pt:kpt((i/N)*Math.PI*2),N:[0,0,1],B:[0,0,1]});
      frames[0].N=vnorm(vcross(ktan(0),[0,1,0.4]));
      frames[0].B=vnorm(vcross(ktan(0),frames[0].N));
      for(let i=1;i<N;i++){
        const pT=ktan(((i-1)/N)*Math.PI*2),cT=ktan((i/N)*Math.PI*2);
        const ax=vcross(pT,cT),sinA=Math.sqrt(vdot(ax,ax)),cosA=vdot(pT,cT);
        if(sinA>1e-6){
          const k=vnorm(ax),ang=Math.atan2(sinA,cosA),c=Math.cos(ang),s=Math.sin(ang);
          const rod=(v:V3):V3=>{const d=vdot(k,v),cr=vcross(k,v);return[c*v[0]+s*cr[0]+(1-c)*d*k[0],c*v[1]+s*cr[1]+(1-c)*d*k[1],c*v[2]+s*cr[2]+(1-c)*d*k[2]];};
          frames[i].N=vnorm(rod(frames[i-1].N));
        } else frames[i].N=frames[i-1].N;
        frames[i].B=vnorm(vcross(cT,frames[i].N));
      }
      return frames;
    }

    const N_PATH=90,N_RING=28,N_LONG=11;
    const cfgA:KnotCfg={KP:2,KQ:3,KR:0.90,Kr:0.34,TubeR:0.19};
    const cfgB:KnotCfg={KP:2,KQ:5,KR:0.88,Kr:0.28,TubeR:0.15};
    const framesA=buildFrames(cfgA,N_PATH);
    const framesB=buildFrames(cfgB,N_PATH);

    function drawKnot(
      frames:Frame[],cfg:KnotCfg,
      W:number,H:number,sc:number,cx:number,cy:number,
      ry:number,rx:number,alpha:number
    ){
      if(alpha<0.01) return;
      const step=Math.max(1,Math.floor(N_PATH/52));
      for(let i=0;i<N_PATH;i+=step){
        const fr=frames[i];
        const cPt=proj(fr.pt,W,H,sc,cx,cy,ry,rx);
        const d01=(cPt.z/(cfg.KR+cfg.Kr)+1)*0.5;
        const a=(0.06+d01*0.30)*alpha;
        const rp:{sx:number;sy:number}[]=[];
        for(let j=0;j<=N_RING;j++){
          const s=(j/N_RING)*Math.PI*2;
          const spt=vadd(vadd(fr.pt,vscl(fr.N,Math.cos(s)*cfg.TubeR)),vscl(fr.B,Math.sin(s)*cfg.TubeR));
          rp.push(proj(spt,W,H,sc,cx,cy,ry,rx));
        }
        ctx.beginPath();ctx.moveTo(rp[0].sx,rp[0].sy);
        for(let k=1;k<rp.length;k++) ctx.lineTo(rp[k].sx,rp[k].sy);
        ctx.closePath();
        ctx.strokeStyle=`rgba(58,191,138,${Math.max(0.02,Math.min(0.52,a))})`;
        ctx.lineWidth=0.85;ctx.stroke();
      }
      for(let ls=0;ls<N_LONG;ls++){
        const s=(ls/N_LONG)*Math.PI*2,cs=Math.cos(s),ss=Math.sin(s);
        ctx.beginPath();
        for(let i=0;i<=N_PATH;i++){
          const fr=frames[i%N_PATH];
          const spt=vadd(vadd(fr.pt,vscl(fr.N,cs*cfg.TubeR)),vscl(fr.B,ss*cfg.TubeR));
          const p=proj(spt,W,H,sc,cx,cy,ry,rx);
          if(i===0)ctx.moveTo(p.sx,p.sy);else ctx.lineTo(p.sx,p.sy);
        }
        ctx.strokeStyle=`rgba(58,191,138,${0.14*alpha})`;ctx.lineWidth=0.65;ctx.stroke();
      }
      ctx.beginPath();
      for(let i=0;i<=N_PATH;i++){
        const p=proj(frames[i%N_PATH].pt,W,H,sc,cx,cy,ry,rx);
        if(i===0)ctx.moveTo(p.sx,p.sy);else ctx.lineTo(p.sx,p.sy);
      }
      ctx.strokeStyle=`rgba(58,191,138,${0.28*alpha})`;ctx.lineWidth=1.0;ctx.stroke();
    }

    /* ────────────────────────────────────────────
       GSAP SCROLL STATES
    ──────────────────────────────────────────── */
    // Text mesh
    const sTxt = { alpha: 0.55 };           // stays at fixed center

    // Knot A — trefoil
    const sA = { bX:0.72,bY:0.44,sc:1.00,al:1.00 };
    // Knot B — cinquefoil
    const sB = { bX:0.30,bY:0.55,sc:0.00,al:0.00 };

    const tl = gsap.timeline({
      scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:2.5},
      defaults:{ease:"none"},
    });

    // Text fades slightly as you scroll (stays legible but not overwhelming)
    tl.to(sTxt,{alpha:0.35,duration:0.50},0.00)
      .to(sTxt,{alpha:0.45,duration:0.50},0.50);

    // Knot A
    tl.to(sA,{bX:0.18,bY:0.50,sc:1.50,            duration:0.17},0.00)
      .to(sA,{bX:0.76,bY:0.36,sc:0.62,            duration:0.15},0.19)
      .to(sA,{bX:0.32,bY:0.60,sc:1.60,al:0.75,    duration:0.17},0.36)
      .to(sA,{bX:0.72,bY:0.40,sc:0.75,al:0.40,    duration:0.14},0.55)
      .to(sA,{bX:0.50,bY:0.52,sc:0.45,al:0.00,    duration:0.09},0.71);

    // Knot B
    tl.to(sB,{bX:0.28,bY:0.54,sc:1.25,al:0.82,    duration:0.15},0.35)
      .to(sB,{bX:0.74,bY:0.38,sc:0.72,al:0.58,    duration:0.15},0.52)
      .to(sB,{bX:0.46,bY:0.54,sc:1.35,al:0.78,    duration:0.18},0.69)
      .to(sB,{bX:0.62,bY:0.46,sc:1.00,al:0.68,    duration:0.10},0.89);

    /* ────────────────────────────────────────────
       RAF LOOP
    ──────────────────────────────────────────── */
    let raf:number, time=0;

    const tick=()=>{
      raf=requestAnimationFrame(tick); time+=0.0042;
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);
      const base=Math.min(W,H)*0.30;

      /* — Text mesh (always centered, very slow Y rotation) — */
      drawText(W,H, time*0.04, sTxt.alpha);

      /* — Knot A — trefoil */
      const ryA=time*0.64, rxA=0.28+Math.sin(time*0.20)*0.21;
      const brA=0.87+Math.sin(time*0.16)*0.24;
      const dxA=Math.sin(time*0.27)*0.032, dyA=Math.cos(time*0.18)*0.020;
      drawKnot(framesA,cfgA,W,H, base*sA.sc*brA, (sA.bX+dxA)*W,(sA.bY+dyA)*H, ryA,rxA, sA.al);

      /* — Knot B — cinquefoil, counter-rotates */
      const ryB=-time*0.46, rxB=-0.24+Math.cos(time*0.17)*0.18;
      const brB=0.90+Math.sin(time*0.13+1.3)*0.22;
      const dxB=Math.cos(time*0.23)*0.028, dyB=Math.sin(time*0.16)*0.018;
      drawKnot(framesB,cfgB,W,H, base*sB.sc*brB, (sB.bX+dxB)*W,(sB.bY+dyB)*H, ryB,rxB, sB.al);
    };

    tick();
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      tl.kill();
    };
  },[]);

  return (
    <canvas ref={canvasRef} aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{zIndex:0,opacity:0.82}}/>
  );
}
