"use client";

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const dodRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dodRef.current) {
      dodRef.current.rotation.x = state.clock.elapsedTime * 0.11;
      dodRef.current.rotation.y = state.clock.elapsedTime * 0.17;
      dodRef.current.rotation.z = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <group position={[1.0, 0.1, 0]}>
      <Float speed={1.25} rotationIntensity={0.52} floatIntensity={0.65}>
        {/* Dodecahedron — 12 pentagonal faces, creative/organic feel */}
        <mesh ref={dodRef}>
          <dodecahedronGeometry args={[0.92, 0]} />
          <MeshDistortMaterial
            color="#00C8B0"
            distort={0.11}
            speed={1.4}
            roughness={0.10}
            metalness={0.92}
          />
        </mesh>
      </Float>

      {/* Angled ring A */}
      <mesh rotation={[Math.PI / 3, 0, 0]} scale={2.05}>
        <torusGeometry args={[1.0, 0.006, 16, 200]} />
        <meshBasicMaterial color="#F8F3EA" transparent opacity={0.28} />
      </mesh>

      {/* Angled ring B */}
      <mesh rotation={[0, Math.PI / 4, Math.PI / 5]} scale={1.68}>
        <torusGeometry args={[1.05, 0.004, 16, 200]} />
        <meshBasicMaterial color="#3ABF8A" transparent opacity={0.20} />
      </mesh>
    </group>
  );
}

function Shards() {
  const configs: {
    pos: [number, number, number];
    rot: [number, number, number];
    geo: "dod" | "tet";
    sz: number;
    teal: boolean;
    spd: number;
  }[] = [
    { pos: [-1.5, 1.4, -0.3], rot: [0.5, 0.4, 1.2],  geo: "tet", sz: 0.07, teal: false, spd: 0.90 },
    { pos: [ 2.2, 1.2, -0.5], rot: [1.1, 0.8, 0.6],  geo: "dod", sz: 0.06, teal: true,  spd: 1.05 },
    { pos: [ 2.6,-1.4, -0.2], rot: [0.2, 1.5, 0.9],  geo: "tet", sz: 0.09, teal: false, spd: 0.82 },
    { pos: [-0.5,-1.5, -0.6], rot: [0.8, 0.3, 0.4],  geo: "dod", sz: 0.07, teal: true,  spd: 1.10 },
    { pos: [ 3.3, 0.2, -0.8], rot: [1.4, 0.6, 1.8],  geo: "tet", sz: 0.06, teal: false, spd: 0.96 },
  ];

  return (
    <>
      {configs.map(({ pos, rot, geo, sz, teal, spd }, i) => {
        const col = teal ? "#3ABF8A" : "#F8F3EA";
        return (
          <Float key={i} speed={spd} rotationIntensity={1.35} floatIntensity={0.85}>
            <mesh position={pos} rotation={rot}>
              {geo === "dod" ? (
                <dodecahedronGeometry args={[sz, 0]} />
              ) : (
                <tetrahedronGeometry args={[sz, 0]} />
              )}
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={0.28}
                roughness={0.18}
                metalness={0.72}
              />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

export default function ProjectScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 46 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.62} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#F8F3EA" />
      <pointLight position={[2, 0.5, 3]} intensity={16} distance={9} color="#00C8B0" />
      <pointLight position={[-3, -1, 2]} intensity={6}  distance={9} color="#F8F3EA" />
      <Sparkles
        count={90}
        scale={[8, 5, 4]}
        size={1.1}
        speed={0.26}
        opacity={0.24}
        color="#F8F3EA"
      />
      <Core />
      <Shards />
    </Canvas>
  );
}
