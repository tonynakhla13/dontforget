"use client";

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useImmersiveTheme, type ImmersiveTheme } from "./useImmersiveTheme";

function Core({ theme }: { theme: ImmersiveTheme }) {
  const icoRef  = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (icoRef.current) {
      icoRef.current.rotation.x = state.clock.elapsedTime * 0.14;
      icoRef.current.rotation.y = state.clock.elapsedTime * 0.22;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -state.clock.elapsedTime * 0.10;
      wireRef.current.rotation.y =  state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group position={[1.0, 0, 0]}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        {/* Solid icosahedron — technical / geometric */}
        <mesh ref={icoRef}>
          <icosahedronGeometry args={[0.95, 1]} />
          <MeshDistortMaterial
            color={theme.accent}
            distort={0.14}
            speed={1.8}
            roughness={0.08}
            metalness={0.95}
          />
        </mesh>
        {/* Outer wireframe shell */}
        <mesh ref={wireRef} scale={1.22}>
          <icosahedronGeometry args={[0.95, 1]} />
          <meshBasicMaterial color={theme.accent} wireframe transparent opacity={0.18} />
        </mesh>
      </Float>

      {/* Equatorial torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.88}>
        <torusGeometry args={[1.0, 0.006, 16, 180]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.30} />
      </mesh>

      {/* Tilted accent ring */}
      <mesh rotation={[0.8, 0.4, 0]} scale={2.25}>
        <torusGeometry args={[1.0, 0.004, 16, 180]} />
        <meshBasicMaterial color={theme.fg} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Orbiters({ theme }: { theme: ImmersiveTheme }) {
  const g0 = useRef<THREE.Group>(null);
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const groups = [g0, g1, g2];

  const cfg = [
    { speed: 0.55, rx: 1.5, rz: 0.75, yOff:  0.30, sz: 0.10, teal: true  },
    { speed: 0.38, rx: 2.2, rz: 1.10, yOff: -0.50, sz: 0.13, teal: false },
    { speed: 0.28, rx: 2.8, rz: 1.40, yOff:  0.10, sz: 0.16, teal: true  },
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groups.forEach((ref, i) => {
      if (!ref.current) return;
      const { speed, rx, rz, yOff } = cfg[i];
      const a = t * speed;
      ref.current.position.x = 1.0 + Math.cos(a) * rx;
      ref.current.position.z = Math.sin(a) * rz;
      ref.current.position.y = yOff + Math.sin(t * 0.42 + i) * 0.18;
      ref.current.rotation.x = t * 0.32 * (i + 1);
      ref.current.rotation.y = t * 0.22 * (i + 1);
    });
  });

  return (
    <>
      {groups.map((ref, i) => {
        const { sz, teal } = cfg[i];
        const col = teal ? theme.accent : theme.fg;
        return (
          <group key={i} ref={ref}>
            <mesh>
              <tetrahedronGeometry args={[sz, 0]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={0.38}
                roughness={0.14}
                metalness={0.72}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export default function ServiceScene() {
  const theme = useImmersiveTheme();
  const themeKey = `${theme.bg}-${theme.fg}-${theme.accent}`;

  return (
    <Canvas
      key={themeKey}
      camera={{ position: [0, 0, 5.5], fov: 46 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.62} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color={theme.fg} />
      <pointLight position={[2, 0.5, 3]} intensity={16} distance={9} color={theme.accent} />
      <pointLight position={[-3, -1, 2]} intensity={6}  distance={9} color={theme.fg} />
      <Sparkles
        count={70}
        scale={[7, 5, 4]}
        size={1.0}
        speed={0.28}
        opacity={0.22}
        color={theme.fg}
      />
      <Core theme={theme} />
      <Orbiters theme={theme} />
    </Canvas>
  );
}
