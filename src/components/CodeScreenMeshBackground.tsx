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

  cycleDuration: 9.2,
  lineRevealDelay: 0.28,
  lineRevealDuration: 0.45,
  lineResetDuration: 0.7,
};

type CodeLine = {
  width: number;
  indent: number;
  y: number;
  opacity: number;
  color: string;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}



function TypingScreen() {
  const groupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const lineRefs = useRef<THREE.Mesh[]>([]);

  const codeLines = useMemo<CodeLine[]>(
    () => [
      { width: 1.55, indent: 0.06, y: 0.54, opacity: 0.36, color: CONFIG.green },
      { width: 1.08, indent: 0.28, y: 0.37, opacity: 0.20, color: CONFIG.cream },
      { width: 1.34, indent: 0.18, y: 0.20, opacity: 0.30, color: CONFIG.green },
      { width: 0.78, indent: 0.40, y: 0.03, opacity: 0.17, color: CONFIG.cream },
      { width: 1.62, indent: 0.10, y: -0.14, opacity: 0.33, color: CONFIG.green },
      { width: 0.92, indent: 0.34, y: -0.31, opacity: 0.18, color: CONFIG.cream },
      { width: 1.22, indent: 0.20, y: -0.48, opacity: 0.28, color: CONFIG.green },
      { width: 0.66, indent: 0.46, y: -0.65, opacity: 0.16, color: CONFIG.cream },
    ],
    []
  );

  const innerLeft = -CONFIG.screenWidth / 2 + 0.34;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = t % CONFIG.cycleDuration;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.24) * 0.08;
      groupRef.current.rotation.x = Math.cos(t * 0.17) * 0.03;
      groupRef.current.position.y = Math.sin(t * 0.55) * 0.04;
    }

    let activeLineIndex = 0;
    let activeLineWidth = 0;

    for (let i = 0; i < codeLines.length; i += 1) {
      const mesh = lineRefs.current[i];
      const line = codeLines[i];
      if (!mesh) continue;

      const start = i * CONFIG.lineRevealDelay;
      const reveal = clamp01((cycle - start) / CONFIG.lineRevealDuration);

      const resetStart = CONFIG.cycleDuration - CONFIG.lineResetDuration;
      const resetFade =
        cycle > resetStart ? 1 - clamp01((cycle - resetStart) / CONFIG.lineResetDuration) : 1;

      const progress = clamp01(reveal) * resetFade;
      const currentWidth = Math.max(0.001, line.width * progress);

      mesh.scale.x = currentWidth;
      mesh.position.x = innerLeft + line.indent + currentWidth / 2;

      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = line.opacity * Math.max(0.08, resetFade);

      if (progress > 0 && progress < 1) {
        activeLineIndex = i;
        activeLineWidth = currentWidth;
      } else if (progress >= 1) {
        activeLineIndex = i;
        activeLineWidth = line.width;
      }
    }

    if (cursorRef.current) {
      const line = codeLines[activeLineIndex];
      const blink = Math.sin(t * 8) > 0 ? 1 : 0.18;

      cursorRef.current.position.x = innerLeft + line.indent + activeLineWidth + 0.06;
      cursorRef.current.position.y = line.y;
      cursorRef.current.scale.y = 0.72 + Math.sin(t * 4.5) * 0.05;

      const mat = cursorRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = blink * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={1.08}>
      <RoundedBox
        args={[CONFIG.screenWidth, CONFIG.screenHeight, CONFIG.screenDepth]}
        radius={0.18}
        smoothness={6}
      >
        <meshBasicMaterial
          color={CONFIG.green}
          wireframe={true}
          transparent={true}
          opacity={0.10}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      <RoundedBox
        args={[CONFIG.screenWidth - 0.12, CONFIG.screenHeight - 0.12, 0.04]}
        radius={0.16}
        smoothness={6}
        position={[0, 0, 0.045]}
      >
        <meshBasicMaterial
          color={CONFIG.green}
          transparent={true}
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      <RoundedBox
        args={[CONFIG.screenWidth - 0.24, 0.24, 0.04]}
        radius={0.08}
        smoothness={6}
        position={[0, 0.82, 0.065]}
      >
        <meshBasicMaterial
          color={CONFIG.green}
          transparent={true}
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      {[-1.28, -1.12, -0.96].map((x, i) => (
        <mesh key={i} position={[x, 0.82, 0.1]}>
          <sphereGeometry args={[0.04, 14, 14]} />
          <meshBasicMaterial
            color={i === 0 ? CONFIG.cream : CONFIG.green}
            transparent={true}
            opacity={0.28}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <RoundedBox
        args={[1.28, 0.07, 0.02]}
        radius={0.04}
        smoothness={4}
        position={[-0.12, 0.82, 0.09]}
      >
        <meshBasicMaterial
          color={CONFIG.green}
          transparent={true}
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      {codeLines.map((line, index) => (
        <RoundedBox
          key={index}
          ref={(node) => {
            if (node) lineRefs.current[index] = node as THREE.Mesh;
          }}
          args={[1, 0.062, 0.02]}
          radius={0.03}
          smoothness={4}
          position={[innerLeft + line.indent + 0.001, line.y, 0.09]}
          scale={[0.001, 1, 1]}
        >
          <meshBasicMaterial
            color={line.color}
            transparent={true}
            opacity={line.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </RoundedBox>
      ))}

      <RoundedBox
        ref={cursorRef}
        args={[0.028, 0.1, 0.02]}
        radius={0.02}
        smoothness={4}
        position={[innerLeft, 0.54, 0.11]}
      >
        <meshBasicMaterial
          color={CONFIG.cream}
          transparent={true}
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.88, 0.05, 0.018]}
        radius={0.025}
        smoothness={4}
        position={[0, -0.92, 0.07]}
      >
        <meshBasicMaterial
          color={CONFIG.green}
          transparent={true}
          opacity={0.11}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>
    </group>
  );
}

function Scene() {
  return (
    <>
      <TypingScreen />
    </>
  );
}

export default function CodeScreenMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.1], fov: 43 }}
        dpr={[1, 1.65]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated={true} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
