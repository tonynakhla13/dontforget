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
  cycleDuration: 10.4,
  lineRevealDelay: 0.22,
  lineRevealDuration: 0.38,
  lineResetDuration: 0.65,
};

type DataRow = { width: number; indent: number; y: number; opacity: number; color: string; rankWidth: number };

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function SEOScreen() {
  const groupRef  = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const lineRefs  = useRef<THREE.Mesh[]>([]);
  const barRefs   = useRef<THREE.Mesh[]>([]);

  const rows = useMemo<DataRow[]>(() => [
    { width: 1.48, indent: 0.22, y: 0.50, opacity: 0.34, color: CONFIG.green,  rankWidth: 0.38 },
    { width: 1.12, indent: 0.22, y: 0.33, opacity: 0.20, color: CONFIG.cream,  rankWidth: 0.26 },
    { width: 1.36, indent: 0.22, y: 0.16, opacity: 0.30, color: CONFIG.green,  rankWidth: 0.44 },
    { width: 0.82, indent: 0.22, y: -0.01, opacity: 0.17, color: CONFIG.cream, rankWidth: 0.18 },
    { width: 1.58, indent: 0.22, y: -0.18, opacity: 0.31, color: CONFIG.green, rankWidth: 0.52 },
    { width: 0.96, indent: 0.22, y: -0.35, opacity: 0.18, color: CONFIG.cream, rankWidth: 0.22 },
    { width: 1.24, indent: 0.22, y: -0.52, opacity: 0.26, color: CONFIG.green, rankWidth: 0.34 },
    { width: 0.68, indent: 0.22, y: -0.69, opacity: 0.15, color: CONFIG.cream, rankWidth: 0.14 },
  ], []);

  const innerLeft = -CONFIG.screenWidth / 2 + 0.34;
  const rankLeft  = CONFIG.screenWidth / 2 - 0.72;

  useFrame((state) => {
    const t     = state.clock.elapsedTime;
    const cycle = t % CONFIG.cycleDuration;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.07;
      groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.03;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.04;
    }

    let activeIdx = 0;
    let activeW   = 0;

    for (let i = 0; i < rows.length; i++) {
      const mesh = lineRefs.current[i];
      const bar  = barRefs.current[i];
      const row  = rows[i];
      if (!mesh) continue;

      const start      = i * CONFIG.lineRevealDelay;
      const reveal     = clamp01((cycle - start) / CONFIG.lineRevealDuration);
      const resetStart = CONFIG.cycleDuration - CONFIG.lineResetDuration;
      const resetFade  = cycle > resetStart ? 1 - clamp01((cycle - resetStart) / CONFIG.lineResetDuration) : 1;
      const progress   = clamp01(reveal) * resetFade;
      const curW       = Math.max(0.001, row.width * progress);

      mesh.scale.x     = curW;
      mesh.position.x  = innerLeft + row.indent + curW / 2;
      (mesh.material as THREE.MeshBasicMaterial).opacity = row.opacity * Math.max(0.08, resetFade);

      if (bar) {
        const barW = Math.max(0.001, row.rankWidth * progress);
        bar.scale.x    = barW;
        bar.position.x = rankLeft + barW / 2;
        (bar.material as THREE.MeshBasicMaterial).opacity = row.opacity * 1.1 * Math.max(0.08, resetFade);
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

      {/* Search bar top */}
      <RoundedBox args={[CONFIG.screenWidth - 0.48, 0.22, 0.04]} radius={0.11} smoothness={6} position={[0.08, 0.82, 0.065]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
      {/* Search icon dot */}
      <mesh position={[1.22, 0.82, 0.1]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.30} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Rank column header */}
      <RoundedBox args={[0.58, 0.06, 0.018]} radius={0.03} smoothness={4} position={[rankLeft + 0.29, 0.66, 0.09]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
      {/* Keyword header */}
      <RoundedBox args={[1.1, 0.06, 0.018]} radius={0.03} smoothness={4} position={[innerLeft + 0.77, 0.66, 0.09]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>

      {/* Data rows */}
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

      {/* Rank bars */}
      {rows.map((row, i) => (
        <RoundedBox
          key={`bar-${i}`}
          ref={(n) => { if (n) barRefs.current[i] = n as THREE.Mesh; }}
          args={[1, 0.052, 0.02]} radius={0.025} smoothness={4}
          position={[rankLeft + 0.001, row.y, 0.09]}
          scale={[0.001, 1, 1]}
        >
          <meshBasicMaterial color={CONFIG.green} transparent opacity={row.opacity * 1.1} depthWrite={false} blending={THREE.AdditiveBlending} />
        </RoundedBox>
      ))}

      {/* Cursor */}
      <RoundedBox ref={cursorRef} args={[0.028, 0.1, 0.02]} radius={0.02} smoothness={4} position={[innerLeft, 0.50, 0.11]}>
        <meshBasicMaterial color={CONFIG.cream} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>

      {/* Bottom accent */}
      <RoundedBox args={[0.88, 0.05, 0.018]} radius={0.025} smoothness={4} position={[0, -0.92, 0.07]}>
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.11} depthWrite={false} blending={THREE.AdditiveBlending} />
      </RoundedBox>
    </group>
  );
}

export default function SEOMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5.1], fov: 43 }} dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated={true} />
          <SEOScreen />
        </Suspense>
      </Canvas>
    </div>
  );
}
