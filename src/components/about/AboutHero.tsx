"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   CANVAS PARTICLES
───────────────────────────────────────────────────────────────────────── */
function ParticleStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d")!;
    type P = {x:number;y:number;vx:number;vy:number;size:number;alpha:number;phase:number};
    const W=()=>canvas.width, H=()=>canvas.height;
    const particles:P[] = Array.from({length:100},()=>({
      x:Math.random()*W(), y:Math.random()*H(),
      vx:0.14+Math.random()*0.28, vy:(Math.random()-0.5)*0.06,
      size:0.5+Math.random()*0.9, alpha:0.03+Math.random()*0.11,
      phase:Math.random()*Math.PI*2,
    }));
    let t=0, raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick); t+=0.005;
      ctx.clearRect(0,0,W(),H());
      for (const p of particles) {
        p.x+=p.vx; p.y+=Math.sin(t+p.phase)*0.12+p.vy;
        if(p.x>W()+4){p.x=-4;p.y=Math.random()*H();}
        if(p.y<0)p.y=H(); if(p.y>H())p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(58,191,138,${p.alpha})`; ctx.fill();
      }
    };
    tick();
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" style={{zIndex:2,opacity:0.55}} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO — two-column: text left / shape right
───────────────────────────────────────────────────────────────────────── */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(line1Ref.current, {autoAlpha:0,xPercent:-5},{autoAlpha:1,xPercent:0,duration:1.0},0)
        .fromTo(line2Ref.current, {autoAlpha:0,xPercent:-4},{autoAlpha:1,xPercent:0,duration:1.0},0.06)
        .fromTo(line3Ref.current, {autoAlpha:0,x:-30      },{autoAlpha:1,x:0,        duration:0.9},0.14)
        .fromTo(statsRef.current?.children??[],{autoAlpha:0,y:18},{autoAlpha:1,y:0,stagger:0.09,duration:0.6},0.32)
        .fromTo(ctaRef.current,   {autoAlpha:0,y:16       },{autoAlpha:1,y:0,        duration:0.7},0.44)
        .fromTo(rightRef.current, {autoAlpha:0,scale:0.92 },{autoAlpha:1,scale:1,    duration:1.4},0.10);
    }, sectionRef);
    return ()=>ctx.revert();
  },[]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background:"transparent", minHeight:"100dvh", display:"flex", alignItems:"center" }}
    >
      <ParticleStream />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden style={{
        background:[
          "radial-gradient(ellipse 70% 80% at 50% 50%, transparent 35%, rgba(9,9,9,0.55) 100%)",
          "linear-gradient(to right, rgba(9,9,9,0.70) 0%, transparent 14%, transparent 86%, rgba(9,9,9,0.70) 100%)",
          "linear-gradient(to bottom, rgba(9,9,9,0.45) 0%, transparent 14%)",
        ].join(","),
      }}/>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
        style={{height:"20vh",background:"linear-gradient(to bottom,transparent,rgba(9,9,9,0.97))"}}/>

      {/* ── Two-column grid ── */}
      <div className="wrap relative z-10 w-full"
        style={{paddingTop:"clamp(4rem,8vh,7rem)",paddingBottom:"clamp(3rem,6vh,5rem)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(2rem,5vw,6rem)",alignItems:"center"}}>

          {/* LEFT — text */}
          <div ref={textRef}>
            {/* Eyebrow */}
            <p className="eyebrow mb-5" style={{letterSpacing:"0.34em"}}>Est. 2022 — Digital Studio</p>

            {/* Heading stack */}
            <div style={{lineHeight:0.88,overflow:"hidden",marginBottom:"0.02em"}}>
              <div ref={line1Ref}>
                <h1 className="hed" style={{fontSize:"clamp(3rem,10vw,11rem)",letterSpacing:"-0.025em",color:"var(--fg)"}}>
                  we build
                </h1>
              </div>
            </div>

            <div style={{lineHeight:0.88,overflow:"hidden",marginBottom:"0.02em"}}>
              <div ref={line2Ref}>
                <h1 className="hed" style={{
                  fontSize:"clamp(3rem,10vw,11rem)",letterSpacing:"-0.025em",
                  color:"transparent",WebkitTextStroke:"1.5px rgba(240,236,227,0.55)",
                }}>
                  things
                </h1>
              </div>
            </div>

            <div style={{overflow:"hidden"}}>
              <div ref={line3Ref}>
                <h1 className="hed script" style={{
                  fontSize:"clamp(2rem,6.5vw,7.5rem)",letterSpacing:"-0.01em",
                  color:"var(--teal)",fontStyle:"italic",
                }}>
                  unforgettable.
                </h1>
              </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="mt-8 flex items-end gap-8">
              {[
                {value:"14+",label:"projects shipped"},
                {value:"6",  label:"countries served"},
                {value:"3yr",label:"since '22"},
              ].map(s=>(
                <div key={s.label}>
                  <p className="hed" style={{fontSize:"clamp(1.4rem,2.2vw,2.2rem)",lineHeight:1,color:"var(--fg)"}}>{s.value}</p>
                  <p style={{fontFamily:"var(--font-mono-next)",fontSize:"0.48rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"var(--body)",marginTop:"0.25rem"}}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="mt-8 flex items-center gap-4">
              <a href="#contact" className="rounded-full px-6 py-3 text-sm font-medium"
                style={{background:"var(--teal)",color:"var(--bg)"}}>
                Let&apos;s talk
              </a>
              <span style={{fontSize:"0.82rem",color:"var(--body)"}}>
                Got something worth remembering?
              </span>
            </div>
          </div>

          {/* RIGHT — decorative frame (KnotBackground shines through) */}
          <div ref={rightRef} className="hidden md:flex items-center justify-center" style={{position:"relative"}}>
            <div style={{
              position:"relative",
              width:"min(42vw,480px)",
              aspectRatio:"1",
            }}>
              {/* Outer orbit ring */}
              <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(58,191,138,0.12)"}}/>
              <div style={{position:"absolute",inset:"12%",borderRadius:"50%",border:"1px solid rgba(58,191,138,0.07)"}}/>
              <div style={{position:"absolute",inset:"26%",borderRadius:"50%",border:"1px solid rgba(58,191,138,0.05)"}}/>

              {/* Corner label — top-right */}
              <div style={{position:"absolute",top:"8%",right:"4%",textAlign:"right"}}>
                <p style={{fontFamily:"var(--font-mono-next)",fontSize:"0.40rem",letterSpacing:"0.44em",textTransform:"uppercase",color:"var(--teal)",opacity:0.50}}>Studio</p>
                <p style={{fontFamily:"var(--font-mono-next)",fontSize:"0.36rem",letterSpacing:"0.36em",textTransform:"uppercase",color:"var(--body)",opacity:0.30,marginTop:"0.2rem"}}>Digital</p>
              </div>

              {/* Corner label — bottom-left */}
              <div style={{position:"absolute",bottom:"8%",left:"4%"}}>
                <p style={{fontFamily:"var(--font-mono-next)",fontSize:"0.36rem",letterSpacing:"0.36em",textTransform:"uppercase",color:"var(--body)",opacity:0.25}}>Since 2022</p>
              </div>

              {/* Cross-hairs */}
              <div style={{position:"absolute",top:"50%",left:"10%",right:"10%",height:1,background:"rgba(58,191,138,0.06)",transform:"translateY(-50%)"}}/>
              <div style={{position:"absolute",left:"50%",top:"10%",bottom:"10%",width:1,background:"rgba(58,191,138,0.06)",transform:"translateX(-50%)"}}/>

              {/* Center dot */}
              <div style={{position:"absolute",top:"50%",left:"50%",width:6,height:6,borderRadius:"50%",background:"var(--teal)",opacity:0.35,transform:"translate(-50%,-50%)",boxShadow:"0 0 14px rgba(58,191,138,0.5)"}}/>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
