"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Torus } from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  green: "#3CBE8B",
  greenSoft: "#2F9A71",
};

type Vec3 = [number, number, number];

function makeCartLines() {
  const lines: number[] = [];
  const add = (a: Vec3, b: Vec3) => lines.push(...a, ...b);

  add([-0.62, 0.45, 0], [-0.48, 0.15, 0]);
  add([-0.48, 0.15, 0], [0.34, 0.15, 0]);
  add([0.34, 0.15, 0],  [0.48, 0.46, 0]);
  add([0.48, 0.46, 0],  [-0.62, 0.45, 0]);

  add([-0.3, 0.45, 0],  [-0.2, 0.15, 0]);
  add([-0.02, 0.45, 0], [0.02, 0.15, 0]);
  add([0.24, 0.45, 0],  [0.22, 0.15, 0]);

  add([-0.8, 0.66, 0],  [-0.62, 0.45, 0]);
  add([-0.8, 0.66, 0],  [-1.05, 0.66, 0]);

  add([-0.34, 0.15, 0], [-0.22, -0.02, 0]);
  add([0.28, 0.15, 0],  [0.18, -0.02, 0]);

  return new Float32Array(lines);
}

function CurvedCart3D() {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(() => makeCartLines(), []);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.04;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.18 + pointer.y * 0.05, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.45 + pointer.x * 0.09, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.04, 0.04);
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} rotation={[0.18, -0.45, 0.04]} scale={1.25}>
      {/* Main basket wireframe */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CONFIG.green} transparent={true} opacity={0.20} depthWrite={false} />
      </lineSegments>

      {/* Back depth copy */}
      <group position={[0, 0, -0.18]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lines, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={CONFIG.green} transparent={true} opacity={0.07} depthWrite={false} />
        </lineSegments>
      </group>

      {/* Depth connectors */}
      {(
        [
          [-0.62, 0.45, 0],
          [0.48, 0.46, 0],
          [-0.22, -0.02, 0],
          [0.18, -0.02, 0],
        ] as Vec3[]
      ).map((p, i) => (
        <lineSegments key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([p[0], p[1], p[2], p[0], p[1], -0.18]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={CONFIG.greenSoft} transparent={true} opacity={0.06} depthWrite={false} />
        </lineSegments>
      ))}

      {/* Wheels */}
      <group position={[-0.22, -0.07, 0]}>
        <Torus args={[0.09, 0.018, 10, 24]}>
          <meshBasicMaterial color={CONFIG.green} transparent={true} opacity={0.17} depthWrite={false} />
        </Torus>
      </group>
      <group position={[0.2, -0.07, 0]}>
        <Torus args={[0.09, 0.018, 10, 24]}>
          <meshBasicMaterial color={CONFIG.green} transparent={true} opacity={0.17} depthWrite={false} />
        </Torus>
      </group>

      {/* Handle curve accent */}
      <mesh position={[-0.98, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.01, 8, 18, Math.PI]} />
        <meshBasicMaterial color={CONFIG.greenSoft} transparent={true} opacity={0.09} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function EcommerceMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 43 }}
        dpr={[1, 1.35]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated={true} />
          <CurvedCart3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
