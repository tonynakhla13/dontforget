"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

const COUNT = 6200;

const VERT = /* glsl */ `
  attribute float aSeed;
  attribute vec3 aDrift;

  uniform float uTime;
  uniform float uScroll;
  uniform float uSize;
  uniform vec2 uMouse;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec3 pos = position;
    float spread = 1.0 + uScroll * 0.42;

    pos.xy *= spread;
    pos.z *= 1.0 + uScroll * 0.9;
    pos += aDrift * sin(uTime * 0.18 + aSeed * 8.0) * 0.18;
    pos.x += sin(uTime * 0.28 + position.y * 0.9 + aSeed * 6.283) * 0.05;
    pos.y += cos(uTime * 0.22 + position.x * 0.7 + aSeed * 4.2) * 0.035;

    vec2 diff = pos.xy - uMouse;
    float dist = length(diff);
    float push = smoothstep(1.18, 0.0, dist);
    pos.xy += normalize(diff + 0.001) * push * 0.34;

    vSeed = aSeed;
    vDepth = pos.z;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * (4.6 / max(-mv.z, 0.55)) * mix(0.68, 1.35, aSeed), 0.55, 4.2);
  }
`;

const FRAG = /* glsl */ `
  varying float vSeed;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.05, 0.5, d);
    float haze = 1.0 - smoothstep(0.22, 0.5, d);

    vec3 teal = vec3(0.227, 0.749, 0.541);
    vec3 green = vec3(0.18, 0.95, 0.62);
    vec3 cream = vec3(0.973, 0.953, 0.918);
    vec3 color = mix(teal, green, smoothstep(0.22, 0.82, vSeed));
    color = mix(color, cream, smoothstep(0.72, 1.0, vSeed) * 0.35);
    color *= mix(0.48, 1.0, clamp(vDepth * 0.2 + 0.55, 0.0, 1.0));

    gl_FragColor = vec4(color, core * 0.34 + haze * 0.1);
  }
`;

function makeScatter() {
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const drift = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const edgeBias = Math.pow(Math.random(), 0.78);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.25 + edgeBias * 1.08;
    const wide = Math.random() < 0.62 ? 1.18 : 1.62;

    positions[i * 3] = Math.cos(angle) * radius * 8.8 * wide + (Math.random() - 0.5) * 6.4;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 4.8 + (Math.random() - 0.5) * 3.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8.8;

    seeds[i] = Math.random();
    drift[i * 3] = (Math.random() - 0.5) * 0.7;
    drift[i * 3 + 1] = (Math.random() - 0.5) * 0.48;
    drift[i * 3 + 2] = (Math.random() - 0.5) * 0.42;
  }

  return { positions, seeds, drift };
}

export default function ServiceDetailParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6.4;

    const scatter = makeScatter();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(scatter.positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(scatter.seeds, 1));
    geometry.setAttribute("aDrift", new THREE.BufferAttribute(scatter.drift, 3));

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSize: { value: window.devicePixelRatio * 1.15 },
      uMouse: { value: new THREE.Vector2(999, 999) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.position.z = -1.6;
    scene.add(points);

    const scrollTween = gsap.to(uniforms.uScroll, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    const vFov = (55 * Math.PI) / 180;
    const updateMouse = (event: MouseEvent) => {
      const aspect = window.innerWidth / window.innerHeight;
      const halfHeight = Math.tan(vFov / 2) * camera.position.z;
      const halfWidth = halfHeight * aspect;
      gsap.to(uniforms.uMouse.value, {
        x: (event.clientX / window.innerWidth - 0.5) * halfWidth * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * halfHeight * 2,
        duration: 0.18,
        overwrite: true,
      });
    };

    const leaveMouse = () => gsap.to(uniforms.uMouse.value, { x: 999, y: 999, duration: 0.5 });

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uSize.value = window.devicePixelRatio * 1.15;
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("mouseleave", leaveMouse);
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      uniforms.uTime.value = clock.getElapsedTime();
      points.rotation.y = Math.sin(uniforms.uTime.value * 0.08) * 0.035;
      points.rotation.x = Math.cos(uniforms.uTime.value * 0.06) * 0.018;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      scrollTween.scrollTrigger?.kill();
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("mouseleave", leaveMouse);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
      aria-hidden="true"
    />
  );
}
