"use client";

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (knotRef.current) {
      knotRef.current.rotation.x = state.clock.elapsedTime * 0.18;
      knotRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * -0.18;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.35;
    }
  });

  return (
    <group position={[1.1, 0.05, 0]}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[0.95, 0.26, 220, 32]} />
          <MeshDistortMaterial
            color="#00C8B0"
            distort={0.22}
            speed={2}
            roughness={0.12}
            metalness={0.92}
          />
        </mesh>
      </Float>

      <mesh ref={ringRef} scale={1.75}>
        <torusGeometry args={[1.05, 0.008, 16, 220]} />
        <meshBasicMaterial color="#F8F3EA" transparent opacity={0.34} />
      </mesh>

      <mesh rotation={[Math.PI / 2.6, 0, 0]} scale={2.5}>
        <torusGeometry args={[1.1, 0.004, 16, 220]} />
        <meshBasicMaterial color="#00C8B0" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Shards() {
  return (
    <>
      {[
        [-1.2, 1.2, -0.4],
        [1.95, 1.1, -0.6],
        [2.3, -1.2, -0.2],
        [-0.3, -1.35, -0.7],
      ].map((position, index) => (
        <Float key={index} speed={1 + index * 0.18} rotationIntensity={1.2} floatIntensity={0.8}>
          <mesh position={position as [number, number, number]} rotation={[0.4, 0.2, 0.8]}>
            <octahedronGeometry args={[0.08 + index * 0.03, 0]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#F8F3EA" : "#00C8B0"}
              emissive={index % 2 === 0 ? "#F8F3EA" : "#00C8B0"}
              emissiveIntensity={0.25}
              roughness={0.22}
              metalness={0.65}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 48 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 3, 5]} intensity={2.6} color="#F8F3EA" />
      <pointLight position={[2.2, 0.5, 3]} intensity={18} distance={8} color="#00C8B0" />
      <pointLight position={[-3, -1, 2]} intensity={7} distance={8} color="#F8F3EA" />
      <Sparkles
        count={80}
        scale={[6, 4, 4]}
        size={1.2}
        speed={0.35}
        opacity={0.28}
        color="#F8F3EA"
      />
      <Core />
      <Shards />
    </Canvas>
  );
}
