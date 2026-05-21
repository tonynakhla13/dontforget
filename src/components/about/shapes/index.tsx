// Pure CSS 3D holographic shape components for the /about page.
// No hooks, no GSAP — purely declarative JSX with keyframe animations.

/* ── Shared ring style helper ──────────────────────────────────────────── */
function Ring({
  transform,
  opacity,
  border,
  boxShadow,
  inset = "0",
  style: extraStyle,
}: {
  transform: string;
  opacity: number;
  border: string;
  boxShadow?: string;
  inset?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: "50%",
        border,
        opacity,
        transform,
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        boxShadow,
        ...extraStyle,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ArmillaryShape — gyroscope-like wireframe sphere
   16 elements: 3 great circles, 4 latitude ellipses, 6 meridians,
                1 inner glow, 2 pole dots, 1 outer shell
───────────────────────────────────────────────────────────────────────── */
export function ArmillaryShape() {
  const MERIDIANS = [30, 60, 90, 120, 150, 180];

  return (
    <div
      className="pointer-events-none select-none"
      style={{ width: 660, height: 660, perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      {/* Layer 1 — slow compound spin */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          animation: "arm-spin 36s linear infinite",
        }}
      >
        {/* Layer 2 — secondary wobble */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            animation: "arm-wobble 9s ease-in-out infinite",
          }}
        >
          {/* ── 3 Great-circle rings ── */}
          {/* Equatorial */}
          <Ring
            transform="rotateX(90deg)"
            opacity={0.72}
            border="1.5px solid rgba(58,191,138,0.72)"
            boxShadow="0 0 22px rgba(58,191,138,0.32), 0 0 44px rgba(58,191,138,0.12)"
          />
          {/* Prime meridian */}
          <Ring
            transform="rotateY(0deg)"
            opacity={0.60}
            border="1.5px solid rgba(58,191,138,0.60)"
            boxShadow="0 0 14px rgba(58,191,138,0.18)"
          />
          {/* 90° meridian */}
          <Ring
            transform="rotateY(90deg)"
            opacity={0.52}
            border="1.5px solid rgba(58,191,138,0.52)"
          />

          {/* ── 4 Latitude ellipses ── */}
          {/* +30° north — width = cos(30°) ≈ 86.6% → inset ≈ 6.7% each side */}
          <Ring
            inset="6.7% 6.7%"
            transform="translateY(-16.3%) rotateX(90deg)"
            opacity={0.35}
            border="1px solid rgba(58,191,138,0.35)"
          />
          {/* +60° north — width = cos(60°) = 50% → inset 25% */}
          <Ring
            inset="25% 25%"
            transform="translateY(-27%) rotateX(90deg)"
            opacity={0.22}
            border="1px solid rgba(58,191,138,0.22)"
          />
          {/* -30° south */}
          <Ring
            inset="6.7% 6.7%"
            transform="translateY(16.3%) rotateX(90deg)"
            opacity={0.35}
            border="1px solid rgba(58,191,138,0.35)"
          />
          {/* -60° south */}
          <Ring
            inset="25% 25%"
            transform="translateY(27%) rotateX(90deg)"
            opacity={0.22}
            border="1px solid rgba(58,191,138,0.22)"
          />

          {/* ── 6 Meridian rings ── */}
          {MERIDIANS.map((deg, i) => (
            <Ring
              key={deg}
              transform={`rotateY(${deg}deg)`}
              opacity={0.22 - i * 0.02}
              border="1px solid rgba(58,191,138,0.18)"
            />
          ))}

          {/* ── Inner glow ── */}
          <div
            style={{
              position: "absolute",
              inset: "20%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 36%, rgba(58,191,138,0.22) 0%, rgba(58,191,138,0.06) 42%, transparent 70%)",
            }}
          />

          {/* ── Pole dots ── */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "2%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(58,191,138,0.85)",
              transform: "translateX(-50%)",
              boxShadow: "0 0 10px rgba(58,191,138,0.7)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "96%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(58,191,138,0.65)",
              transform: "translateX(-50%)",
              boxShadow: "0 0 8px rgba(58,191,138,0.5)",
            }}
          />

          {/* ── Outer shell ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(58,191,138,0.14)",
              boxShadow:
                "0 0 120px rgba(58,191,138,0.10), 0 0 60px rgba(58,191,138,0.06), inset 0 0 80px rgba(58,191,138,0.04)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   TorusShape — perspective + rotateX illusion of a torus (donut)
   Used as background decoration in OurStory
───────────────────────────────────────────────────────────────────────── */
export function TorusShape() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{ width: 400, height: 400, perspective: "800px" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          animation: "torus-spin 20s linear infinite",
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(58,191,138,0.22)",
          }}
        />
        {/* Mid ring */}
        <div
          style={{
            position: "absolute",
            inset: "15%",
            borderRadius: "50%",
            border: "1px solid rgba(58,191,138,0.14)",
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            inset: "28%",
            borderRadius: "50%",
            border: "1px solid rgba(58,191,138,0.10)",
          }}
        />
        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(58,191,138,0.08)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DodecaShape — 12-ring approximation of a wireframe dodecahedron
   Used as corner decoration in MissionVision
───────────────────────────────────────────────────────────────────────── */
export function DodecaShape() {
  // Dodecahedral dihedral angle ≈ 63.43°
  const DIHEDRAL = 63.43;
  const ROTATIONS = [0, 72, 144, 216, 288];

  return (
    <div
      className="pointer-events-none select-none"
      style={{ width: 280, height: 280, perspective: "600px" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          animation: "dodeca-spin 45s linear infinite",
        }}
      >
        {/* Equatorial ring */}
        <Ring
          transform="rotateX(0deg)"
          opacity={0.35}
          border="1px solid rgba(58,191,138,0.35)"
        />

        {/* 5 upper-hemisphere rings */}
        {ROTATIONS.map((z, i) => (
          <Ring
            key={`u${z}`}
            transform={`rotateX(${DIHEDRAL}deg) rotateZ(${z}deg)`}
            opacity={0.28 - i * 0.02}
            border="1px solid rgba(58,191,138,0.28)"
          />
        ))}

        {/* 5 lower-hemisphere rings (mirror) */}
        {ROTATIONS.map((z, i) => (
          <Ring
            key={`l${z}`}
            transform={`rotateX(${-DIHEDRAL}deg) rotateZ(${z}deg)`}
            opacity={0.22 - i * 0.02}
            border="1px solid rgba(58,191,138,0.22)"
          />
        ))}

        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: "0 0 30px rgba(58,191,138,0.08)",
          }}
        />
      </div>
    </div>
  );
}
