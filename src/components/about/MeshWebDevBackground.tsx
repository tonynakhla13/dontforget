"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  background: "#020807",
  teal: "#13d9aa",
  tealSoft: "#0a8f73",
  meshOpacity: 0.15,
  panelOpacity: 0.1,
  particleOpacity: 0.78,
  particleCount: 2600,
  starCount: 850,
  particleSize: 0.012,
  speed: 0.09,
  parallax: 0.38,
};

type Vec3 = [number, number, number];

type BrowserLine = {
  x: number;
  y: number;
  width: number;
  opacity: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeFloat32Buffer(values: number[]) {
  return new Float32Array(values);
}

function makeLinePositions(points: Vec3[]) {
  return makeFloat32Buffer(points.flat());
}

function makeBrowserLines(
  count: number,
  options: { startY: number; stepY: number; minWidth: number; maxWidth: number }
): BrowserLine[] {
  return Array.from({ length: count }, (_, index): BrowserLine => ({
    x: randomBetween(-0.18, 0.1),
    y: options.startY - index * options.stepY,
    width: randomBetween(options.minWidth, options.maxWidth),
    opacity: randomBetween(0.2, 0.65),
  }));
}

function makeParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const o = i * 3;
    if (Math.random() > 0.38) {
      positions[o]     = randomBetween(0.2, 3.3);
      positions[o + 1] = randomBetween(-1.15, 1.25);
      positions[o + 2] = randomBetween(-1.25, 0.9);
    } else {
      positions[o]     = randomBetween(-3.2, 3.6);
      positions[o + 1] = randomBetween(-1.8, 1.7);
      positions[o + 2] = randomBetween(-1.8, 1.2);
    }
  }
  return positions;
}

function makeStarPositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const o = i * 3;
    positions[o]     = randomBetween(-4.5, 4.5);
    positions[o + 1] = randomBetween(-2.3, 2.3);
    positions[o + 2] = randomBetween(-3.2, -1.4);
  }
  return positions;
}

function makeFlowingMeshData() {
  const cols = 52, rows = 18;
  const sX = 0.145, sY = 0.11;
  const x0 = -cols * sX * 0.5, y0 = -rows * sY * 0.5;

  const grid: THREE.Vector3[][] = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => new THREE.Vector3(
      x0 + x * sX + Math.sin(y * 0.55) * 0.18,
      y0 + y * sY,
      Math.sin(x * 0.35) * 0.22 + Math.cos(y * 0.62) * 0.16
    ))
  );

  const lineValues: number[] = [];
  const pointValues: number[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const p = grid[y][x];
      pointValues.push(p.x, p.y, p.z);
      if (x < cols - 1) {
        const n = grid[y][x + 1];
        lineValues.push(p.x, p.y, p.z, n.x, n.y, n.z);
      }
      if (y < rows - 1 && Math.random() > 0.18) {
        const n = grid[y + 1][x];
        lineValues.push(p.x, p.y, p.z, n.x, n.y, n.z);
      }
      if (x < cols - 1 && y < rows - 1 && Math.random() > 0.72) {
        const n = grid[y + 1][x + 1];
        lineValues.push(p.x, p.y, p.z, n.x, n.y, n.z);
      }
    }
  }

  return {
    linePositions: makeFloat32Buffer(lineValues),
    pointPositions: makeFloat32Buffer(pointValues),
  };
}

function SegmentLine({
  points,
  opacity = 0.55,
  color = CONFIG.teal,
}: {
  points: Vec3[];
  opacity?: number;
  color?: string;
}) {
  const positions = useMemo(() => makeLinePositions(points), [points]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function BrowserPanel() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const codeLines = useMemo(
    () => makeBrowserLines(24, { startY: 0.78, stepY: 0.07, minWidth: 0.35, maxWidth: 1.1 }),
    []
  );

  const sidebarLines = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => ({
        y: 0.75 - i * 0.115,
        width: randomBetween(0.28, 0.62),
        opacity: randomBetween(0.2, 0.5),
      })),
    []
  );

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += delta * CONFIG.speed;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -0.08 + pointer.y * CONFIG.parallax * 0.22, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0.02 - pointer.x * CONFIG.parallax * 0.12, 0.04);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.055;
  });

  return (
    <group ref={groupRef} position={[1.55, 0.15, -0.8]} rotation={[-0.06, -0.33, 0.04]} scale={1.04}>
      <mesh>
        <boxGeometry args={[3.75, 2.35, 0.045, 18, 12, 1]} />
        <meshBasicMaterial color={CONFIG.teal} wireframe transparent opacity={CONFIG.meshOpacity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, -0.012]}>
        <boxGeometry args={[3.65, 2.25, 0.012]} />
        <meshBasicMaterial color={CONFIG.tealSoft} transparent opacity={0.025} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.93, 0.04]}>
        <boxGeometry args={[3.55, 0.24, 0.035, 12, 2, 1]} />
        <meshBasicMaterial color={CONFIG.teal} wireframe transparent opacity={0.24} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {([-1.62, -1.48, -1.34] as number[]).map((x) => (
        <mesh key={x} position={[x, 0.94, 0.09]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <meshBasicMaterial color={CONFIG.teal} transparent opacity={0.75} depthWrite={false} />
        </mesh>
      ))}

      <mesh position={[-0.15, 0.94, 0.075]}>
        <boxGeometry args={[1.55, 0.055, 0.02]} />
        <meshBasicMaterial color={CONFIG.teal} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[-1.28, -0.12, 0.045]}>
        <boxGeometry args={[0.62, 1.82, 0.025, 6, 10, 1]} />
        <meshBasicMaterial color={CONFIG.teal} wireframe transparent opacity={CONFIG.panelOpacity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {sidebarLines.map((line, i) => (
        <mesh key={i} position={[-1.45 + line.width / 2, line.y - 0.2, 0.095]}>
          <boxGeometry args={[line.width, 0.012, 0.012]} />
          <meshBasicMaterial color={CONFIG.teal} transparent opacity={line.opacity} depthWrite={false} />
        </mesh>
      ))}

      <mesh position={[-0.24, -0.12, 0.04]}>
        <boxGeometry args={[1.35, 1.82, 0.025, 10, 10, 1]} />
        <meshBasicMaterial color={CONFIG.teal} wireframe transparent opacity={0.13} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {codeLines.map((line, i) => (
        <mesh key={i} position={[-0.82 + line.x + line.width / 2, line.y - 0.22, 0.095]}>
          <boxGeometry args={[line.width, 0.012, 0.012]} />
          <meshBasicMaterial color={CONFIG.teal} transparent opacity={line.opacity} depthWrite={false} />
        </mesh>
      ))}

      <mesh position={[1.04, 0.22, 0.047]}>
        <boxGeometry args={[1.15, 1.02, 0.025, 8, 8, 1]} />
        <meshBasicMaterial color={CONFIG.teal} wireframe transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <group position={[1.04, 0.3, 0.12]} scale={0.72}>
        <SegmentLine opacity={0.78} points={[[-0.42, 0.12, 0], [-0.72, -0.1, 0], [-0.42, -0.32, 0]]} />
        <SegmentLine opacity={0.78} points={[[0.42, 0.12, 0], [0.72, -0.1, 0], [0.42, -0.32, 0]]} />
        <SegmentLine opacity={0.72} points={[[-0.06, -0.42, 0], [0.16, 0.22, 0]]} />
      </group>

      {([0.12, -0.38, -0.74] as number[]).map((y, i) => (
        <group key={i} position={[0.74, y - 0.45, 0.08]}>
          <mesh>
            <boxGeometry args={[0.24, 0.17, 0.018]} />
            <meshBasicMaterial color={CONFIG.teal} transparent opacity={0.23} depthWrite={false} />
          </mesh>
          <mesh position={[0.42, 0.04, 0]}>
            <boxGeometry args={[0.48, 0.018, 0.012]} />
            <meshBasicMaterial color={CONFIG.teal} transparent opacity={0.35} depthWrite={false} />
          </mesh>
          <mesh position={[0.35, -0.045, 0]}>
            <boxGeometry args={[0.34, 0.012, 0.012]} />
            <meshBasicMaterial color={CONFIG.teal} transparent opacity={0.25} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FlowingMesh() {
  const linesRef  = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { linePositions, pointPositions } = useMemo(() => makeFlowingMeshData(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (linesRef.current)  { linesRef.current.rotation.y  = Math.sin(t * 0.18) * 0.08; linesRef.current.position.y  = Math.sin(t * 0.45) * 0.035; }
    if (pointsRef.current) { pointsRef.current.rotation.y = Math.sin(t * 0.14) * 0.08; pointsRef.current.position.y = Math.sin(t * 0.48) * 0.035; }
  });

  return (
    <group position={[1.0, -1.05, -0.2]} rotation={[-0.66, -0.08, 0.04]} scale={[1.18, 0.95, 1]}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CONFIG.tealSoft} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={CONFIG.teal} size={0.013} transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => makeParticlePositions(CONFIG.particleCount), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.12) * 0.08;
    ref.current.rotation.x = Math.cos(t * 0.1)  * 0.035;
  });

  return (
    <points ref={ref} position={[0.65, 0.05, -0.55]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={CONFIG.teal} size={CONFIG.particleSize} transparent opacity={CONFIG.particleOpacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function BackgroundStars() {
  const positions = useMemo(() => makeStarPositions(CONFIG.starCount), []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={CONFIG.tealSoft} size={0.006} transparent opacity={0.28} depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={[CONFIG.background]} />
      <fog attach="fog" args={[CONFIG.background, 4.2, 9]} />
      <BackgroundStars />
      <FlowingMesh />
      <ParticleCloud />
      <BrowserPanel />
    </>
  );
}

export default function MeshWebDevBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#020807]" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 43 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <Scene />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 78% 42%, rgba(19,217,170,0.15), transparent 32%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 6% 8%, rgba(19,217,170,0.14), transparent 22%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.78), rgba(0,0,0,0.34), rgba(0,0,0,0.12))" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, transparent, rgba(0,0,0,0.55))" }} />
    </div>
  );
}
