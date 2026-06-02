"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

const COUNT = 7600;

function buildAmbientField() {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const band = Math.random();
    const x = band < 0.72 ? Math.random() : Math.random() * 0.78 + 0.11;
    const y = Math.random();
    pos[i * 3] = (x - 0.5) * 20.5;
    pos[i * 3 + 1] = (y - 0.5) * 11.8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 7.8;
  }
  return pos;
}

function buildVelocity() {
  const velocity = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) velocity[i] = 0.4 + Math.random() * 1.5;
  return velocity;
}

const VERT = /* glsl */`
  attribute float aVelocity;

  uniform float uScroll;
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;

  varying float vDepth;

  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.08 * aVelocity + position.y * 0.8) * 0.12;
    pos.y += cos(uTime * 0.1 * aVelocity + position.x * 0.55) * 0.06;
    pos.z += sin(uTime * 0.12 * aVelocity + position.x) * 0.1;
    pos.xy *= mix(1.0, 1.08, smoothstep(0.0, 1.0, uScroll));

    vec2 diff = pos.xy - uMouse;
    float dist = length(diff);
    float rep = smoothstep(1.0, 0.0, dist);
    pos.xy += normalize(diff + 0.001) * rep * 0.16;

    vDepth = pos.z;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * (3.8 / max(-mv.z, 0.5)), 0.55, 3.8);
  }
`;

const FRAG = /* glsl */`
  uniform float uScroll;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.32, 0.5, d);

    vec3 teal = vec3(0.227, 0.749, 0.541);
    vec3 cream = vec3(0.973, 0.953, 0.918);
    vec3 color = mix(teal, cream, clamp(vDepth + 0.5, 0.0, 1.0) * 0.36);

    gl_FragColor = vec4(color, alpha * mix(0.34, 0.22, uScroll));
  }
`;

export default function ServicesDFParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }
    const r = renderer;
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(width, height);
    r.setClearColor(0, 0);
    mount.appendChild(r.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(buildAmbientField(), 3));
    geometry.setAttribute("aVelocity", new THREE.BufferAttribute(buildVelocity(), 1));

    const uniforms = {
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: window.devicePixelRatio * 1.28 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, -1.4);
    points.scale.setScalar(width < 900 ? 0.9 : 1);
    scene.add(points);

    const scrollTween = gsap.to(uniforms.uScroll, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#services",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.8,
      },
    });

    const aspect = width / height;
    const vFov = (55 * Math.PI) / 180;
    const halfHeight = Math.tan(vFov / 2) * camera.position.z;
    const halfWidth = halfHeight * aspect;

    const onMove = (event: MouseEvent) => {
      gsap.to(uniforms.uMouse.value, {
        x: (event.clientX / window.innerWidth - 0.5) * halfWidth * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * halfHeight * 2,
        duration: 0.18,
        overwrite: true,
      });
    };

    const onLeave = () => {
      gsap.to(uniforms.uMouse.value, { x: 9999, y: 9999, duration: 0.5 });
    };

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      r.setSize(nextWidth, nextHeight);
      points.position.set(0, 0, -1.4);
      points.scale.setScalar(nextWidth < 900 ? 0.9 : 1);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    const timer = new THREE.Timer();
    timer.connect(document);
    let frame = 0;
    const tick = (timestamp: number) => {
      frame = requestAnimationFrame(tick);
      timer.update(timestamp);
      uniforms.uTime.value = timer.getElapsed();
      r.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timer.dispose();
      scrollTween.scrollTrigger?.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      r.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(r.domElement)) mount.removeChild(r.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0" />;
}
