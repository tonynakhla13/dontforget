"use client";
import { useEffect, useId, useRef } from "react";

/**
 * The one loader for the whole site.
 *
 * The NOX wordmark walks in from the left — N first, then the rolling O that
 * bumps it, then the X. Used by both the hard-load intro (`SiteIntroLoader`)
 * and every soft navigation / theme switch (`ThemeLoadingExperience`), so the
 * loading moment looks identical in focused, creative and immersive.
 */

const W = "#ffffff";
const G = "#46D12A";

/** Full walk-in takes this long; shorter runs just scale the same timeline. */
export const NOX_LOADER_DEFAULT_SECONDS = 4;

/** Point in the timeline where every letter has landed and the bumps settled. */
export const NOX_LOADER_SETTLED_RATIO = 0.8;

function RollingO({ height }: { height: number }) {
  const id    = useId().replace(/[:]/g, "");
  const pupil = useRef<SVGGElement>(null);
  const scale = useRef<SVGGElement>(null);
  const blink = useRef(false);

  useEffect(() => {
    const OY = 181, R = 28;
    let raf = 0, ang = 0, cx = 0, cy = 0, sy = 1;
    function doBlink() {
      if (blink.current) return; blink.current = true;
      let t = 0, ph = 0;
      const iv = setInterval(() => {
        t++;
        if (ph===0){sy=Math.max(0,1-t/6);if(sy<=0){ph=1;t=0;}}
        else{sy=Math.min(1,t/6);if(sy>=1){clearInterval(iv);blink.current=false;}}
      },16);
    }
    let bt: ReturnType<typeof setTimeout>;
    const sb=()=>{bt=setTimeout(()=>{doBlink();sb();},1200+Math.random()*600);};
    sb();
    const tick=()=>{
      ang+=0.03; cx+=(Math.cos(ang)*R-cx)*0.12; cy+=(Math.sin(ang)*R-cy)*0.12;
      if(!blink.current)sy+=(1-sy)*0.18;
      pupil.current?.setAttribute("transform",`translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
      scale.current?.setAttribute("transform",`translate(0 ${(OY*(1-sy)).toFixed(2)}) scale(1 ${sy.toFixed(4)})`);
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(raf);clearTimeout(bt);};
  },[]);

  return (
    <svg viewBox="430 0 355 362" fill="none" style={{height,width:"auto",display:"block"}}>
      <defs><clipPath id={id}><path d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/></clipPath></defs>
      <path fill={W} d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z"/>
      <g ref={pupil} clipPath={`url(#${id})`}><g ref={scale}>
        <path fill="#000" d="M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z"/>
      </g></g>
    </svg>
  );
}

function LetterN({ height }: { height: number }) {
  return (
    <svg viewBox="0 0 378 362" fill="none" style={{height,width:"auto",display:"block"}}>
      <path fill={W} d="M326.83,361.07v-174.4C311.9,10.26,63.25,14.4,51.98,189.67v171.4H0v-182.39C12.84,12.64,218.29-64.44,331.34,65.21c59.25,67.94,46.42,147.87,45.41,231.35-.25,20.82.7,41.69.64,62.47,0,1.17-.07,1.29-1.09,2.04h-49.47Z"/>
    </svg>
  );
}

function LetterX({ height }: { height: number }) {
  return (
    <svg viewBox="845 0 380 362" fill="none" style={{height,width:"auto",display:"block"}}>
      <path fill={W} d="M912.02,1.25c55.05,59.15,109.74,118.76,163.28,179.22-18.41,23.68-40.14,44.54-60.35,66.64-34.38,37.59-68.37,75.54-102.88,113.01-.85.85-1.9.85-3,1-16.05,2.14-38.93-.72-56.06-.09-1.38.05-8.67,2.44-7.45-.44l162.74-179.91L845.56,1.25h66.47Z"/>
      <polygon fill={G} points="1224.36 1.25 1100.96 136.19 1067.9 101.22 1067.56 98.88 1156.9 1.25 1224.36 1.25"/>
      <path fill={W} d="M1157.9,361.07l-90.38-96.59,32.43-38.36c1.62,0,2.93,1.9,4,3,17.15,17.75,33.13,36.91,49.95,55,21.93,23.6,47.34,47.61,67.45,72.47.66.82,5.13,6.31,1.67,5.34-.53-.15-.88-.87-1.15-.87h-63.97Z"/>
    </svg>
  );
}

export default function NoxLoader({
  durationSeconds = NOX_LOADER_DEFAULT_SECONDS,
  height = 130,
}: {
  /** How long the walk-in takes. The whole timeline scales with it. */
  durationSeconds?: number;
  /** Cap height of the letterforms, in px. */
  height?: number;
}) {
  const d = `${durationSeconds}s`;

  return (
    <div style={{
      position:"absolute",inset:0,background:"#000",
      display:"flex",alignItems:"center",justifyContent:"center",
      overflow:"hidden",
    }}>
      <style>{`
        @keyframes walk-x {
          0%          { transform: translateX(-110vw); }
          37.5%, 100% { transform: translateX(0); }
        }
        @keyframes roll-o {
          0%        { transform: translateX(-110vw) rotate(0deg); }
          55%, 100% { transform: translateX(0) rotate(-720deg); }
        }
        @keyframes walk-n {
          0%          { transform: translateX(-110vw); }
          72.5%, 100% { transform: translateX(0); }
        }
        @keyframes bump-x {
          0%,54%   { transform: translateX(0); }
          57%      { transform: translateX(14px); }
          60%,100% { transform: translateX(0); }
        }
        @keyframes bump-o {
          0%,71%   { transform: translateX(0); }
          74%      { transform: translateX(12px); }
          77%,100% { transform: translateX(0); }
        }
        .ldr-x      { animation: walk-x ${d} cubic-bezier(.22,1,.36,1) forwards; }
        .ldr-o      { animation: roll-o ${d} cubic-bezier(.22,1,.36,1) forwards; }
        .ldr-n      { animation: walk-n ${d} cubic-bezier(.22,1,.36,1) forwards; }
        .ldr-x-bump { animation: bump-x ${d} linear forwards; }
        .ldr-o-bump { animation: bump-o ${d} linear forwards; }
        @media (prefers-reduced-motion: reduce) {
          .ldr-x, .ldr-o, .ldr-n, .ldr-x-bump, .ldr-o-bump {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div style={{display:"flex",alignItems:"center",gap:"clamp(6px,1.2vw,18px)"}}>
        <div className="ldr-n"><LetterN height={height} /></div>
        <div className="ldr-o-bump"><div className="ldr-o"><RollingO height={height} /></div></div>
        <div className="ldr-x-bump"><div className="ldr-x"><LetterX height={height} /></div></div>
      </div>

      {/* green floor glow */}
      <div style={{
        position:"absolute",bottom:"30%",left:"50%",transform:"translateX(-50%)",
        width:"clamp(200px,40vw,480px)",height:40,borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(70,174,34,.18) 0%,transparent 70%)",
        filter:"blur(12px)",pointerEvents:"none",
      }}/>
    </div>
  );
}
