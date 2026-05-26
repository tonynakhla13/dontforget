"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useImmersiveTheme, type ImmersiveTheme } from "./useImmersiveTheme";

// ─── Animated Wireframe Wave ──────────────────────────────────────────────────

function WireWave({
  pos,
  rot,
  color,
  opacity,
  spd,
  amp,
}: {
  pos: [number, number, number];
  rot: [number, number, number];
  color: string;
  opacity: number;
  spd: number;
  amp: number;
}) {
  const geo = useMemo(() => new THREE.PlaneGeometry(26, 17, 52, 38), []);
  const base = useMemo(() => {
    const src = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array;
    return new Float32Array(src);
  }, [geo]);
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  useFrame(({ clock }) => {
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const t    = clock.elapsedTime * spd * (reduced.current ? 0.08 : 1);
    for (let i = 0; i < attr.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      attr.setZ(
        i,
        Math.sin(x * 0.36 + t * 0.7)       * amp * 0.7 +
        Math.sin(y * 0.44 + t * 0.52)       * amp * 0.55 +
        Math.sin((x - y) * 0.29 + t * 0.63) * amp * 0.4
      );
    }
    attr.needsUpdate = true;
  });

  return (
    <mesh geometry={geo} position={pos} rotation={rot}>
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

// ─── Glass Sphere ─────────────────────────────────────────────────────────────

function GlassSphere({
  pos,
  r,
  spd,
  fi,
  theme,
}: {
  pos: [number, number, number];
  r: number;
  spd: number;
  fi: number;
  theme: ImmersiveTheme;
}) {
  return (
    <Float speed={spd} rotationIntensity={0.15} floatIntensity={fi}>
      <group position={pos}>
        {/* translucent inner volume */}
        <mesh>
          <sphereGeometry args={[r, 36, 36]} />
          <meshStandardMaterial
            color={theme.accent}
            emissive={theme.accent}
            emissiveIntensity={0.5}
            transparent
            opacity={0.06}
            roughness={0.0}
            metalness={0.7}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>
        {/* wireframe shell */}
        <mesh>
          <sphereGeometry args={[r * 1.012, 18, 18]} />
          <meshBasicMaterial color={theme.accent} wireframe transparent opacity={0.16} />
        </mesh>
        {/* bright inner glow core — blooms strongly */}
        <mesh>
          <sphereGeometry args={[r * 0.28, 10, 10]} />
          <meshStandardMaterial
            color={theme.mint}
            emissive={theme.mint}
            emissiveIntensity={3.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Mouse-parallax Camera Rig ───────────────────────────────────────────────

function CameraRig() {
  const target  = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ camera }) => {
    if (reduced.current) return;
    current.current.x += (target.current.x - current.current.x) * 0.04;
    current.current.y += (target.current.y - current.current.y) * 0.04;
    camera.position.x = current.current.x * 0.6;
    camera.position.y = current.current.y * 0.32 + 0.1;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Full Scene ───────────────────────────────────────────────────────────────

function Scene({ theme }: { theme: ImmersiveTheme }) {
  return (
    <>
      <color attach="background" args={[theme.bg]} />

      {/* Atmosphere lights */}
      <ambientLight intensity={0.35} color={theme.surface} />
      <pointLight position={[-7,  4,  3]} intensity={14} color={theme.accent} distance={24} decay={2} />
      <pointLight position={[ 7, -3,  2]} intensity={9} color={theme.deep} distance={22} decay={2} />
      <pointLight position={[ 0,  2,  5]} intensity={5} color={theme.mint} distance={16} decay={2} />

      {/* Wireframe wave planes at different depths / tilts */}
      <WireWave
        pos={[0, -2.2, -6]}
        rot={[-0.22, 0, 0]}
        color={theme.accent}
        opacity={0.082}
        spd={0.72}
        amp={0.65}
      />
      <WireWave
        pos={[0, -1, -9.5]}
        rot={[-0.12, 0.05, 0]}
        color={theme.deep}
        opacity={0.052}
        spd={0.44}
        amp={0.44}
      />

      {/* Floating glass spheres */}
      <GlassSphere theme={theme} pos={[-4.3,  1.9, -3.5]} r={0.74} spd={1.1} fi={1.4} />
      <GlassSphere theme={theme} pos={[ 4.6, -1.3, -2.8]} r={0.50} spd={1.7} fi={1.2} />
      <GlassSphere theme={theme} pos={[ 2.3,  2.5, -4.6]} r={1.10} spd={0.85} fi={0.9} />
      <GlassSphere theme={theme} pos={[-3.1, -2.3, -3.9]} r={0.37} spd={2.2} fi={1.8} />
      <GlassSphere theme={theme} pos={[ 5.6,  1.6, -5.6]} r={0.62} spd={1.35} fi={1.1} />

      {/* Glowing particle clouds */}
      <Sparkles
        count={110}
        scale={[20, 13, 9]}
        size={2.2}
        speed={0.28}
        opacity={0.55}
        color={theme.accent}
      />
      <Sparkles
        count={45}
        scale={[15, 10, 6]}
        size={3.8}
        speed={0.14}
        opacity={0.28}
        color={theme.mint}
      />

      <CameraRig />

      {/* Bloom post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.95}
          intensity={0.8}
          radius={0.82}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

export default function ImmersiveHeroBG() {
  const theme = useImmersiveTheme();
  const themeKey = `${theme.bg}-${theme.surface}-${theme.accent}-${theme.deep}-${theme.mint}`;

  return (
    <Canvas
      key={themeKey}
      camera={{ position: [0, 0.1, 6.8], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene theme={theme} />
    </Canvas>
  );
}
