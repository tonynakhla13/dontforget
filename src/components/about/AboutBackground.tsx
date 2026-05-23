"use client";

/**
 * AboutBackground
 *
 * Full-page fixed layer of large CSS-3D tube / ring shapes that drift
 * with scroll — same wireframe-teal aesthetic as TorusShape / ArmillaryShape
 * but at background scale. Lives at z-0 (behind main z-[1] content).
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   Reusable CSS-3D tube — identical ring technique as TorusShape, but
   parameterised for any width / height / ring density.
───────────────────────────────────────────────────────────────────────── */
function Tube({
  width,
  height,
  perspective,
  spinDuration,
  ringCount = 9,
  reverse = false,
}: {
  width: number;
  height: number;
  perspective: number;
  spinDuration: number;
  ringCount?: number;
  reverse?: boolean;
}) {
  const VLINES = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div style={{ width, height, perspective, perspectiveOrigin: "50% 50%" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          animation: `torus-spin ${spinDuration}s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {/* Horizontal rings — rotateX(78deg) makes them look like cylinder slices */}
        {Array.from({ length: ringCount }, (_, i) => {
          const pct     = (i / (ringCount - 1)) * 100;
          const isEdge  = i === 0 || i === ringCount - 1;
          const distFromEdge = Math.min(i, ringCount - 1 - i);
          const opacity = isEdge ? 0.52 : 0.10 + distFromEdge * 0.03;
          const thick   = isEdge ? "1.5px" : "1px";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top:    `${pct}%`,
                left:   0,
                right:  0,
                height: `${110 / ringCount}%`,
                borderRadius: "50%",
                border: `${thick} solid rgba(58,191,138,${opacity.toFixed(2)})`,
                transform: "rotateX(78deg)",
                transformOrigin: "center center",
                boxShadow: isEdge
                  ? `0 0 12px rgba(58,191,138,${(opacity * 0.5).toFixed(2)})`
                  : "none",
              }}
            />
          );
        })}

        {/* Vertical lines — thin ellipses rotated around Y give the cylinder sides */}
        {VLINES.map((deg) => (
          <div
            key={deg}
            style={{
              position: "absolute",
              inset: "0 44%",
              borderRadius: "50%",
              border: "1px solid rgba(58,191,138,0.06)",
              transform: `rotateY(${deg}deg)`,
              transformOrigin: "center center",
            }}
          />
        ))}

        {/* Inner core glow */}
        <div
          style={{
            position: "absolute",
            inset: "12% 15%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(58,191,138,0.07) 0%, transparent 68%)",
            filter: "blur(14px)",
          }}
        />

        {/* Outer ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow:
              "0 0 60px rgba(58,191,138,0.06), inset 0 0 40px rgba(58,191,138,0.03)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Large flat orbit ring — like a planet ring seen at an angle
───────────────────────────────────────────────────────────────────────── */
function OrbitRing({ size, spinDuration = 60 }: { size: number; spinDuration?: number }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div style={{ width: size, height: size, perspective: size * 1.6 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          animation: `arm-spin ${spinDuration}s linear infinite`,
        }}
      >
        {/* Outer tilt ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(58,191,138,0.42)",
            transform: "rotateX(72deg)",
            boxShadow: "0 0 24px rgba(58,191,138,0.14)",
          }}
        />
        {/* Mid ring */}
        <div
          style={{
            position: "absolute",
            inset: "12%",
            borderRadius: "50%",
            border: "1px solid rgba(58,191,138,0.22)",
            transform: "rotateX(72deg)",
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            inset: "26%",
            borderRadius: "50%",
            border: "1px solid rgba(58,191,138,0.14)",
            transform: "rotateX(72deg)",
          }}
        />
        {/* Equatorial ring (perpendicular) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(58,191,138,0.18)",
            transform: "rotateX(0deg)",
          }}
        />
        {/* Spokes */}
        {spokes.map((deg) => (
          <div
            key={deg}
            style={{
              position: "absolute",
              inset: "0 48%",
              borderRadius: "50%",
              border: "1px solid rgba(58,191,138,0.07)",
              transform: `rotateY(${deg}deg)`,
            }}
          />
        ))}
        {/* Core glow */}
        <div
          style={{
            position: "absolute",
            inset: "20%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 36%, rgba(58,191,138,0.10) 0%, transparent 65%)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main component — GSAP scrub parallax on all shapes
───────────────────────────────────────────────────────────────────────── */
export default function AboutBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tube1Ref     = useRef<HTMLDivElement>(null);
  const tube2Ref     = useRef<HTMLDivElement>(null);
  const ringRef      = useRef<HTMLDivElement>(null);
  const tube3Ref     = useRef<HTMLDivElement>(null);

  /* Each shape: different y travel + scrub speed → true parallax depth */
  useGSAP(() => {
    const st = { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.5 };

    gsap.fromTo(tube1Ref.current, { y: 0   }, { y: -900, ease: "none", scrollTrigger: st });
    gsap.fromTo(tube2Ref.current, { y: 400 }, { y: -600, ease: "none", scrollTrigger: st });
    gsap.fromTo(ringRef.current,  { y: 200, x: 0,  rotation: 0  }, { y: -400, x: -80, rotation: 25, ease: "none", scrollTrigger: st });
    gsap.fromTo(tube3Ref.current, { y: 800 }, { y: -200, ease: "none", scrollTrigger: st });
  }, { dependencies: [] });

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── Tube 1 — left edge, tall, slow ── */}
      <div
        ref={tube1Ref}
        style={{
          position: "absolute",
          left: "-7vw",
          top: "8%",
          opacity: 0.45,
        }}
      >
        <Tube width={220} height={820} perspective={700} spinDuration={52} ringCount={11} />
      </div>

      {/* ── Tube 2 — right edge ── */}
      <div ref={tube2Ref} style={{ position: "absolute", right: "-6vw", top: "0%", opacity: 0.35 }}>
        <Tube width={180} height={680} perspective={600} spinDuration={38} ringCount={9} reverse />
      </div>

      {/* ── Orbit ring ── */}
      <div ref={ringRef} style={{ position: "absolute", right: "6vw", top: "18%", opacity: 0.28 }}>
        <OrbitRing size={360} spinDuration={68} />
      </div>

      {/* ── Tube 3 — bottom-left ── */}
      <div ref={tube3Ref} style={{ position: "absolute", left: "8vw", top: "55%", opacity: 0.22 }}>
        <Tube width={130} height={460} perspective={440} spinDuration={44} ringCount={7} />
      </div>

      {/* ── Ambient glow pools behind the shapes ── */}
      <div
        style={{
          position: "absolute",
          left: "-8%",
          top: "15%",
          width: "30vw",
          height: "50vw",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(58,191,138,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-6%",
          top: "30%",
          width: "28vw",
          height: "45vw",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(58,191,138,0.05) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
