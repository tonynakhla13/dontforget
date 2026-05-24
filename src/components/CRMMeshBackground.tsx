"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  green: "#3CBE8B",
  cream: "#F4EFE4",
  screenWidth: 3.25,
  screenHeight: 2.15,
  screenDepth: 0.12,
  cycleDuration: 11.0,
  lineRevealDelay: 0.20,
  lineRevealDuration: 0.36,
  lineResetDuration: 0.72,
};

type PipelineRow = { width: number; indent: number; y: number; opacity: number; color: string; stageX: number };

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function CRMScreen() {
  const groupRef  = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const lineRefs  = useRef<THREE.Mesh[]>([]);
  const dotRefs   = useRef<THREE.Mesh[]>([]);

  const rows = useMemo<PipelineRow[]>(() => [
    { width: 1.62, indent: 0.14, y: 0.52, opacity: 0.34, color: CONFIG.green,  stageX:  0.92 },
    { width: 0.94, indent: 0.30, y: 0.35, opacity: 0.19, color: CONFIG.cream,  stageX:  0.44 },
    { width: 1.38, indent: 0.14, y: 0.18, opacity: 0.29, color: CONFIG.green,  stageX:  0.72 },
    { width: 0.72, indent: 0.38, y: 0.01, opacity: 0.16, color: CONFIG.cream,  stageX:  0.22 },
    { width: 1.50, indent: 0.10, y: -0.16, opacity: 0.32, color: CONFIG.green, stageX:  1.08 },
    { width: 1.04, indent: 0.26, y: -0.33, opacity: 0.18, color: CONFIG.cream, stageX:  0.58 },
    { width: 1.20, indent: 0.18, y: -0.50, opacity: 0.27, color: CONFIG.green, stageX:  0.84 },
    { width: 0.60, indent: 0.42, y: -0.67, opacity: 0.14, color: CONFIG.cream, stageX:  0.18 },
  ], []);

  const innerLeft   = -CONFIG.screenWidth / 2 + 0.34;
  const statusLeft  = CONFIG.screenWidth / 2 - 1.32;

  useFrame((state) => {
    const t     = state.clock.elapsedTime;
    const cycle = t % CONFIG.cycleDuration;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.20) * 0.07;
      groupRef.current.rotation.x = Math.cos(t * 0.14) * 0.025;
      groupRef.current.position.y = Math.sin(t * 0.48) * 0.04;
    }

    let activeIdx = 0;
    let activeW   = 0;

    for (let i = 0; i < rows.length; i++) {
      const mesh = lineRefs.current[i];
      const dot  = dotRefs.current[i];
      const row  = rows[i];
      if (!mesh) continue;

      const start      = i * CONFIG.lineRevealDelay;
      const reveal     = clamp01((cycle - start) / CONFIG.lineRevealDuration);
      const resetStart = CONFIG.cycleDuration - CONFIG.lineResetDuration;
      const resetFade  = cycle > resetStart ? 1 - clamp01((cycle - resetStart) / CONFIG.lineResetDuration) : 1;
      const progress   = clamp01(reveal) * resetFade;
      const curW       = Math.max(0.001, row.width * progress);

      mesh.scale.x    = curW;
      mesh.position.x = innerLeft + row.indent + curW / 2;
      (mesh.material as THREE.MeshBasicMaterial).opacity = row.opacity * Math.max(0.08, resetFade);

      if (dot) {
        (dot.material as THREE.MeshBasicMaterial).opacity = row.opacity * 1.4 * Math.max(0.08, resetFade) * progress;
      }

      if (progress > 0 && progress < 1) { activeIdx = i; activeW = curW; }
      else if (progress >= 1)            { activeIdx = i; activeW = row.width; }
    }

    if (cursorRef.current) {
      const row   = rows[activeIdx];
      const blink = Math.sin(t * 8) > 0 ? 1 : 0.18;
      cursorRef.current.position.x = innerLeft + row.indent + activeW + 0.06;
      cursorRef.current.position.y = row.y;
      cursorRef.current.scale.y    = 0.72 + Math.sin(t * 4.5) * 0.05;
      (cursorRef.current.material as THREE.MeshBasicMaterial).opacity = blink * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={1.08}>
      {/* Outer shell */}
      <RoundedBox args={[CONFIG.screenWidth, CONFIG.screenHeight, CONFIG.screenDepth]} radius={0.18} smoothness={6}>
        <meshBasicMaterial color={CONFIG.green} wireframe transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
      {/* Inner glass */}
      <RoundedBox args={[CONFIG.screenWidth - 0.12, CONFIG.screenHeight - 0.12, 0.04]} radius={0.16} smoothness={6} position={[0, 0, 0.045]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>

      {/* Top bar */}
      <RoundedBox args={[CONFIG.screenWidth - 0.24, 0.24, 0.04]} radius={0.08} smoothness={6} position={[0, 0.82, 0.065]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
      {/* Top dots */}
      {[-1.28, -1.12, -0.96].map((x, i) => (
        <mesh key={i} position={[x, 0.82, 0.1]}>
          <sphereGeometry args={[0.04, 14, 14]} />
          <meshBasicMaterial color={i === 0 ? CONFIG.cream : CONFIG.green} transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* Column headers */}
      <RoundedBox args={[1.1, 0.055, 0.018]} radius={0.025} smoothness={4} position={[innerLeft + 0.77, 0.66, 0.09]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.055, 0.018]} radius={0.025} smoothness={4} position={[statusLeft + 0.22, 0.66, 0.09]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>

      {/* Pipeline rows */}
      {rows.map((row, i) => (
        <RoundedBox
          key={i}
          ref={(n) => { if (n) lineRefs.current[i] = n as THREE.Mesh; }}
          args={[1, 0.058, 0.02]} radius={0.025} smoothness={4}
          position={[innerLeft + row.indent + 0.001, row.y, 0.09]}
          scale={[0.001, 1, 1]}
        >
          <meshBasicMaterial color={row.color} transparent opacity={row.opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
        </RoundedBox>
      ))}

      {/* Stage indicator dots */}
      {rows.map((row, i) => (
        <mesh
          key={`dot-${i}`}
          ref={(n) => { if (n) dotRefs.current[i] = n as THREE.Mesh; }}
          position={[statusLeft + row.stageX * 0.18, row.y, 0.1]}
        >
          <sphereGeometry args={[0.032, 10, 10]} />
          <meshBasicMaterial color={CONFIG.green} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* Cursor */}
      <RoundedBox ref={cursorRef} args={[0.028, 0.1, 0.02]} radius={0.02} smoothness={4} position={[innerLeft, 0.52, 0.11]}>
        <meshBasicMaterial color={CONFIG.cream} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>

      {/* Bottom accent */}
      <RoundedBox args={[0.88, 0.05, 0.018]} radius={0.025} smoothness={4} position={[0, -0.92, 0.07]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.11} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
    </group>
  );
}

export default function CRMMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5.1], fov: 43 }} dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated={true} />
          <CRMScreen />
        </Suspense>
      </Canvas>
    </div>
  );
}
