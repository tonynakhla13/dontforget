"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function WorkDeviceMesh() {
  const stageRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const stage = stageRef.current;
    const mesh = meshRef.current;
    if (!stage || !mesh) return;

    const isFirstLoad = !sessionStorage.getItem("df_loader_shown");
    const delay = isFirstLoad ? 2.35 : 0.05;

    gsap.fromTo(
      stage,
      { autoAlpha: 0, x: 76, scale: 0.97 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 1.15, ease: "expo.out", delay }
    );

    const onMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      const x = mouse.current.x;
      const y = mouse.current.y;
      mesh.style.transform = `translate3d(${x * 16}px, ${y * 10}px, 0) rotateX(${y * -3}deg) rotateY(${x * 6}deg)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 z-[11] hidden overflow-hidden md:block"
      style={{ perspective: 1200, visibility: "hidden" }}
    >
      <div className="absolute inset-0 work-device-ambient" />
      <div
        ref={meshRef}
        className="absolute right-[-2vw] top-1/2 w-[min(58vw,850px)] -translate-y-1/2"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <svg
          viewBox="0 0 920 620"
          className="block h-auto w-full"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="workMeshGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.25 0 0 0 0 0.82 0 0 0 0 0.16 0 0 0 0.85 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="workScreenGlow" x1="130" x2="760" y1="150" y2="470">
              <stop stopColor="#7cff5f" stopOpacity="0.22" />
              <stop offset="0.45" stopColor="#46d12a" stopOpacity="0.08" />
              <stop offset="1" stopColor="#b8ffe0" stopOpacity="0.16" />
            </linearGradient>
            <linearGradient id="workLine" x1="0" x2="920" y1="0" y2="620">
              <stop stopColor="#b8ffe0" stopOpacity="0.36" />
              <stop offset="0.55" stopColor="#46d12a" stopOpacity="0.7" />
              <stop offset="1" stopColor="#7cff5f" stopOpacity="0.28" />
            </linearGradient>
            <pattern id="workGrid" width="34" height="34" patternUnits="userSpaceOnUse">
              <path d="M34 0H0V34" stroke="#46d12a" strokeOpacity="0.16" strokeWidth="1" />
            </pattern>
          </defs>

          <g filter="url(#workMeshGlow)" stroke="url(#workLine)" strokeLinecap="round" strokeLinejoin="round">
            {/* Pipe connector behind the devices */}
            <g opacity="0.46">
              <path d="M88 388 C210 252 372 258 500 334 S702 428 840 276" strokeWidth="14" />
              <path d="M88 388 C210 252 372 258 500 334 S702 428 840 276" strokeWidth="1.4" />
              {Array.from({ length: 18 }).map((_, index) => {
                const x = 92 + index * 44;
                const y = 384 - Math.sin(index * 0.72) * 72;
                return (
                  <ellipse
                    key={`pipe-ring-${index}`}
                    cx={x}
                    cy={y}
                    rx="22"
                    ry="8"
                    transform={`rotate(${-18 + index * 2.2} ${x} ${y})`}
                    strokeWidth="1"
                    opacity={0.38 - index * 0.008}
                  />
                );
              })}
              <path d="M114 420 C234 286 364 304 486 374 S694 474 858 326" strokeWidth="1" opacity="0.46" />
              <path d="M66 354 C198 214 384 214 530 298 S724 378 808 222" strokeWidth="1" opacity="0.38" />
            </g>

            {/* Laptop */}
            <g className="work-device-laptop">
              <path d="M132 160 L626 104 L716 416 L194 484 Z" fill="rgba(4,16,8,0.32)" strokeWidth="2" />
              <path d="M164 188 L604 140 L676 388 L218 446 Z" fill="url(#workScreenGlow)" strokeWidth="1.6" />
              <path d="M218 446 L676 388 L788 456 L276 526 Z" fill="rgba(4,16,8,0.22)" strokeWidth="1.5" />
              <path d="M276 526 L788 456 L740 492 L238 558 Z" strokeWidth="1.2" opacity="0.72" />
              <path d="M334 484 L606 448 L658 470 L380 508 Z" strokeWidth="1" opacity="0.42" />
              <path d="M164 188 H604 M184 236 L624 188 M204 284 L642 236 M224 332 L660 286 M244 380 L678 336" strokeWidth="0.8" opacity="0.32" />
              <path d="M216 182 L276 438 M288 174 L344 430 M360 166 L414 420 M432 158 L486 410 M504 150 L558 400 M576 142 L630 390" strokeWidth="0.8" opacity="0.24" />
              <rect x="264" y="224" width="150" height="48" rx="8" transform="rotate(-6 264 224)" strokeWidth="1" opacity="0.7" />
              <rect x="452" y="204" width="92" height="116" rx="10" transform="rotate(-6 452 204)" strokeWidth="1" opacity="0.55" />
              <path d="M260 340 L592 300" strokeWidth="7" opacity="0.08" />
              <path d="M260 340 L592 300" strokeWidth="1" opacity="0.5" />
            </g>

            {/* Mobile */}
            <g className="work-device-mobile">
              <path d="M660 124 L804 154 Q824 158 828 178 L878 442 Q882 462 862 468 L714 500 Q694 504 690 482 L638 174 Q634 150 660 124 Z" fill="rgba(3,14,8,0.42)" strokeWidth="2" />
              <path d="M674 158 L790 182 Q800 184 802 194 L846 426 Q848 438 836 440 L724 464 Q712 466 710 454 L666 180 Q664 164 674 158 Z" fill="url(#workScreenGlow)" strokeWidth="1.4" />
              <path d="M682 218 L812 246 M692 274 L822 302 M704 330 L832 358" strokeWidth="0.9" opacity="0.36" />
              <path d="M700 172 L740 180" strokeWidth="1.2" opacity="0.62" />
              <circle cx="782" cy="446" r="5" fill="#b8ffe0" fillOpacity="0.54" stroke="none" />
              <rect x="702" y="226" width="86" height="42" rx="8" transform="rotate(11 702 226)" strokeWidth="1" opacity="0.62" />
              <rect x="716" y="302" width="98" height="82" rx="10" transform="rotate(11 716 302)" strokeWidth="1" opacity="0.48" />
            </g>

            {/* Foreground pipe lip */}
            <g opacity="0.58">
              <path d="M156 500 C296 402 414 424 538 478 S760 534 874 432" strokeWidth="11" />
              <path d="M156 500 C296 402 414 424 538 478 S760 534 874 432" strokeWidth="1.2" />
              {Array.from({ length: 13 }).map((_, index) => {
                const x = 160 + index * 58;
                const y = 500 - Math.sin(index * 0.55) * 42;
                return (
                  <ellipse
                    key={`front-ring-${index}`}
                    cx={x}
                    cy={y}
                    rx="18"
                    ry="6"
                    transform={`rotate(${index * 1.8} ${x} ${y})`}
                    strokeWidth="0.9"
                    opacity="0.42"
                  />
                );
              })}
            </g>
          </g>

          <g opacity="0.72">
            <path d="M164 188 L604 140 L676 388 L218 446 Z" fill="url(#workGrid)" />
            <path d="M674 158 L790 182 Q800 184 802 194 L846 426 Q848 438 836 440 L724 464 Q712 466 710 454 L666 180 Q664 164 674 158 Z" fill="url(#workGrid)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
