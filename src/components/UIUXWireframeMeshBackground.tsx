"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  green: "#3CBE8B",
  greenSoft: "#2F9A71",
  cream: "#F4EFE4",
};

type Vec3 = [number, number, number];

function makeConnectorPositions() {
  const points: Vec3[] = [
    [-0.82, 0.48, 0.03],
    [0.12, 0.55, 0.2],
    [-0.72, -0.34, 0.16],
    [0.42, -0.24, 0.28],
  ];

  const lines: number[] = [];
  const add = (a: Vec3, b: Vec3) => lines.push(...a, ...b);

  add(points[0], points[1]);
  add(points[0], points[2]);
  add(points[1], points[3]);
  add(points[2], points[3]);
  add(points[1], points[2]);

  return new Float32Array(lines);
}

function makeFlowLines() {
  const lines: number[] = [];
  const add = (a: Vec3, b: Vec3) => lines.push(...a, ...b);

  add([-0.22, 0.08, 0.032],  [0.0, 0.08, 0.032]);
  add([0.12, 0.08, 0.032],   [0.34, 0.08, 0.032]);
  add([0.0, 0.08, 0.032],    [0.12, 0.08, 0.032]);
  add([0.12, 0.08, 0.032],   [0.12, -0.14, 0.032]);
  add([0.12, -0.14, 0.032],  [0.34, -0.14, 0.032]);
  add([-0.22, 0.08, 0.032],  [-0.22, -0.14, 0.032]);
  add([-0.22, -0.14, 0.032], [0.0, -0.14, 0.032]);

  return new Float32Array(lines);
}

function WireBox({ position, size, opacity = 0.09, color = CONFIG.green }: { position: Vec3; size: Vec3; opacity?: number; color?: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function GlowBox({ position, size, opacity = 0.02 }: { position: Vec3; size: Vec3; opacity?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={CONFIG.green} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function UIStroke({ position, size, opacity = 0.06 }: { position: Vec3; size: Vec3; opacity?: number; color?: string }) {
  return <GlowBox position={position} size={size} opacity={opacity} />;
}

function Dot({ position, radius = 0.026, opacity = 0.18 }: { position: Vec3; radius?: number; opacity?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 10, 10]} />
      <meshBasicMaterial color={CONFIG.green} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ConnectorLines() {
  const ref = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => makeConnectorPositions(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.02 + (Math.sin(state.clock.elapsedTime * 1.2) + 1) * 0.005;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={CONFIG.greenSoft} transparent opacity={0.02} depthWrite={false} />
    </lineSegments>
  );
}

function CursorPointer() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.position.x = 0.22 + Math.sin(time * 0.9) * 0.055;
    ref.current.position.y = -0.1 + Math.cos(time * 0.72) * 0.035;
  });

  return (
    <group ref={ref} position={[0.22, -0.1, 0.11]} rotation={[0, 0, -0.62]} scale={0.68}>
      <mesh>
        <coneGeometry args={[0.06, 0.22, 3]} />
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.24} depthWrite={false} />
      </mesh>
      <mesh scale={1.55}>
        <coneGeometry args={[0.06, 0.22, 3]} />
        <meshBasicMaterial color={CONFIG.green} wireframe transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MeshCard({ position, size, rotation, delay = 0, children }: { position: Vec3; size: Vec3; rotation: Vec3; delay?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(time * 0.72) * 0.035;
    ref.current.rotation.x = rotation[0] + Math.sin(time * 0.38) * 0.025;
    ref.current.rotation.y = rotation[1] + Math.cos(time * 0.42) * 0.035;
    ref.current.rotation.z = rotation[2] + Math.sin(time * 0.34) * 0.015;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <GlowBox position={[0, 0, -0.012]} size={[size[0] * 1.06, size[1] * 1.06, size[2]]} opacity={0.02} />
      <WireBox position={[0, 0, 0]} size={size} opacity={0.09} />
      <WireBox position={[0, 0, 0.012]} size={[size[0] * 0.92, size[1] * 0.88, size[2] * 0.5]} opacity={0.04} />
      {children}
    </group>
  );
}

function WireframeLayoutCard() {
  return (
    <MeshCard position={[-0.82, 0.48, 0.03]} size={[0.7, 0.48, 0.12]} rotation={[0.16, -0.34, 0.05]} delay={0}>
      <UIStroke position={[-0.18, 0.13, 0.075]}  size={[0.22, 0.08, 0.018]} opacity={0.05} />
      <UIStroke position={[0.11, 0.13, 0.075]}   size={[0.22, 0.08, 0.018]} opacity={0.05} />
      <UIStroke position={[-0.13, -0.04, 0.075]} size={[0.33, 0.12, 0.018]} opacity={0.04} />
      <UIStroke position={[0.17, -0.12, 0.075]}  size={[0.18, 0.06, 0.018]} opacity={0.06} />
      <Dot position={[-0.28, 0.2, 0.08]} radius={0.018} opacity={0.14} />
    </MeshCard>
  );
}

function UserFlowCard() {
  const flowLines = useMemo(() => makeFlowLines(), []);

  return (
    <MeshCard position={[0.12, 0.55, 0.2]} size={[0.82, 0.32, 0.12]} rotation={[-0.1, 0.2, -0.04]} delay={1.1}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flowLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CONFIG.green} transparent opacity={0.09} depthWrite={false} />
      </lineSegments>
      {(
        [
          [-0.22, 0.08, 0.05], [0, 0.08, 0.05], [0.34, 0.08, 0.05],
          [-0.22, -0.14, 0.05], [0.12, -0.14, 0.05], [0.34, -0.14, 0.05],
        ] as Vec3[]
      ).map((pos, i) => (
        <Dot key={i} position={pos} radius={0.026} opacity={0.18} />
      ))}
    </MeshCard>
  );
}

function DesignSystemCard() {
  return (
    <MeshCard position={[-0.72, -0.34, 0.16]} size={[0.58, 0.58, 0.12]} rotation={[0.18, -0.18, 0.08]} delay={2.2}>
      {(
        [
          [-0.16, 0.14, 0.075], [0.05, 0.14, 0.075],
          [-0.16, -0.06, 0.075], [0.05, -0.06, 0.075],
        ] as Vec3[]
      ).map((pos, i) => (
        <GlowBox key={i} position={pos} size={[0.14, 0.14, 0.018]} opacity={i === 0 ? 0.07 : 0.04} />
      ))}
      <UIStroke position={[0.08, -0.23, 0.075]} size={[0.28, 0.04, 0.018]} opacity={0.04} />
    </MeshCard>
  );
}

function InteractionCard() {
  return (
    <MeshCard position={[0.42, -0.24, 0.28]} size={[0.94, 0.36, 0.13]} rotation={[0.12, 0.3, -0.05]} delay={3.2}>
      <UIStroke position={[-0.18, 0.05, 0.085]}  size={[0.38, 0.1, 0.02]}  opacity={0.06} />
      <UIStroke position={[0.25, 0.05, 0.085]}   size={[0.22, 0.1, 0.02]}  opacity={0.04} />
      <UIStroke position={[-0.1, -0.11, 0.085]}  size={[0.56, 0.04, 0.02]} opacity={0.04} />
      <CursorPointer />
    </MeshCard>
  );
}

function UIUXMeshObject() {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(time * 0.42) * 0.025;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.16 + pointer.y * 0.04, 0.04);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, -0.34 + pointer.x * 0.08, 0.04);
  });

  return (
    <group ref={ref} position={[0, 0.04, 0]} rotation={[0.16, -0.34, 0.02]} scale={1.13}>
      <ConnectorLines />
      <WireframeLayoutCard />
      <UserFlowCard />
      <DesignSystemCard />
      <InteractionCard />
    </group>
  );
}

export default function UIUXWireframeMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.15], fov: 43 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated={true} />
          <UIUXMeshObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
