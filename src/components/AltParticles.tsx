"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─────────────────────────────────────────────────────────────────────
// Particle counts
// ─────────────────────────────────────────────────────────────────────
const COUNT = 2100;

// ── Double helix (services) ───────────────────────────────────────────
// Two anti-parallel DNA-like strands spiraling up the Y axis.
function buildHelixPos(): Float32Array {
  const pos  = new Float32Array(COUNT * 3);
  const half = COUNT / 2;
  for (let i = 0; i < COUNT; i++) {
    const strand = i < half ? 0 : 1;
    const t      = (i % half) / half;
    const turns  = 3.5;
    const angle  = t * Math.PI * 2 * turns + (strand === 1 ? Math.PI : 0);
    const r      = 1.62 + (Math.random() - 0.5) * 0.14;
    const h      = 5.0;
    pos[i * 3]     = r * Math.cos(angle);
    pos[i * 3 + 1] = t * h - h / 2 + (Math.random() - 0.5) * 0.10;
    pos[i * 3 + 2] = r * Math.sin(angle);
  }
  return pos;
}

// ── Logarithmic 3-arm spiral galaxy (portfolio) ───────────────────────
// Three arms each curling outward; disk tilted for perspective.
function buildGalaxyPos(): Float32Array {
  const pos    = new Float32Array(COUNT * 3);
  const perArm = Math.floor(COUNT / 3);
  for (let i = 0; i < COUNT; i++) {
    const arm    = Math.floor(i / perArm);
    const t      = Math.pow((i % perArm) / perArm, 0.55); // bias outward
    const spin   = t * Math.PI * 5.2;
    const armOff = (arm / 3) * Math.PI * 2;
    const scatter = (Math.random() - 0.5) * 0.6 * (1 - t * 0.55);
    const angle  = spin + armOff + scatter;
    const r      = t * 4.0 + 0.25;
    pos[i * 3]     = r * Math.cos(angle);
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.42 * (1 - t * 0.60);
    pos[i * 3 + 2] = r * Math.sin(angle);
  }
  return pos;
}

// ── Per-particle strand/arm index (0.0 / 1.0 / 2.0) ──────────────────
function buildStrandAttr(mode: "helix" | "galaxy"): Float32Array {
  const attr = new Float32Array(COUNT);
  if (mode === "helix") {
    const half = COUNT / 2;
    for (let i = 0; i < COUNT; i++) attr[i] = i < half ? 0.0 : 1.0;
  } else {
    const perArm = Math.floor(COUNT / 3);
    for (let i = 0; i < COUNT; i++) attr[i] = Math.floor(i / perArm);
  }
  return attr;
}

// ── Wide scatter (dissolve target on scroll) ──────────────────────────
function buildScatterPos(): Float32Array {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 24;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 11;
  }
  return pos;
}

// ─────────────────────────────────────────────────────────────────────
// GLSL — vertex
// ─────────────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  attribute vec3  aScatter;
  attribute float aStrand;   // 0, 1, 2

  uniform float uScroll;     // 0 = shape, 1 = scattered
  uniform vec2  uMouse;
  uniform float uSize;
  uniform float uTime;

  varying float vStrand;
  varying float vDepth;

  void main() {
    // Rotate shape slowly around Y before scatter kicks in
    float rotAmt = 1.0 - smoothstep(0.0, 0.65, uScroll);
    float angle  = uTime * 0.14 * rotAmt;
    float cosA   = cos(angle);
    float sinA   = sin(angle);

    vec3 sh;
    sh.x = position.x * cosA - position.z * sinA;
    sh.y = position.y;
    sh.z = position.x * sinA + position.z * cosA;

    // Idle drift (per-strand phase offset)
    sh.y += sin(uTime * 0.48 + aStrand * 2.094) * 0.016 * rotAmt;

    // Blend toward scatter as user scrolls
    vec3 pos = mix(sh, aScatter, smoothstep(0.0, 1.0, uScroll));

    // Mouse repulsion
    vec2  diff = pos.xy - uMouse;
    float dist = length(diff);
    float rep  = smoothstep(1.1, 0.0, dist);
    pos.xy    += normalize(diff + 0.001) * rep * 0.16;

    vStrand = aStrand;
    vDepth  = pos.z;

    vec4 mv    = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective-correct sizing, clamped so distant particles aren't invisible
    float sz = uSize * (5.5 / max(-mv.z, 0.5));
    gl_PointSize = clamp(sz, 0.8, 12.0);
  }
`;

// ─────────────────────────────────────────────────────────────────────
// GLSL — fragment
// ─────────────────────────────────────────────────────────────────────
const FRAG = /* glsl */`
  uniform float uScroll;
  uniform float uMode;   // 0.0 = helix, 1.0 = galaxy

  varying float vStrand;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Soft circular dot
    float alpha = 1.0 - smoothstep(0.30, 0.50, d);
    alpha *= 1.0 - uScroll * 0.78;   // fade out as scattered

    vec3 teal  = vec3(0.227, 0.749, 0.541);   // #3ABF8A
    vec3 cream = vec3(0.973, 0.953, 0.918);   // #F8F3EA
    vec3 mid   = vec3(0.16,  0.55,  0.40);    // deeper teal

    // Helix: strand 0 → teal, strand 1 → cream
    float helixBlend  = clamp(vStrand, 0.0, 1.0);

    // Galaxy: arm 0 → teal, arm 1 → mid, arm 2 → cream; depth-modulated
    float depthNorm   = clamp(vDepth / 3.8 + 0.5, 0.0, 1.0);
    float armBlend    = clamp(vStrand / 2.0, 0.0, 1.0);
    float galaxyBlend = mix(armBlend, depthNorm, 0.55);

    float blend = mix(helixBlend, galaxyBlend, uMode);
    vec3  col   = mix(teal, cream, blend);
    // Arms 0/2 teal; arm 1 gets a slightly warmer mid hue in galaxy mode
    col = mix(col, mid, uMode * (1.0 - abs(blend * 2.0 - 1.0)) * 0.4);

    gl_FragColor = vec4(col, alpha * 0.70);
  }
`;

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────
export default function AltParticles({ mode }: { mode: "helix" | "galaxy" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scn    = new THREE.Scene();
    const aspect = W / H;
    const cam    = new THREE.PerspectiveCamera(52, aspect, 0.1, 100);
    cam.position.z = 5.5;

    const positions = mode === "helix" ? buildHelixPos() : buildGalaxyPos();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(buildScatterPos(), 3));
    geo.setAttribute("aStrand",  new THREE.BufferAttribute(buildStrandAttr(mode), 1));

    const uniforms = {
      uScroll: { value: 0 },
      uMouse:  { value: new THREE.Vector2(9999, 9999) },
      uSize:   { value: window.devicePixelRatio * 1.55 },
      uTime:   { value: 0 },
      uMode:   { value: mode === "helix" ? 0.0 : 1.0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite:  false,
    });

    const pts = new THREE.Points(geo, mat);

    if (mode === "helix") {
      pts.scale.setScalar(0.80);
      pts.position.set(0.2, 0, 0);
    } else {
      // Galaxy: tilt so we see depth in the disk
      pts.rotation.x = -0.38;
      pts.scale.setScalar(0.55);
      pts.position.set(0, -0.15, 0);
    }

    scn.add(pts);

    // Scroll → scatter over the first ~60% of the page height
    const st = gsap.to(uniforms.uScroll, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end:   "60% top",
        scrub: 2.0,
      },
    });

    // Mouse repulsion
    const vFov = (52 * Math.PI) / 180;
    const hH   = Math.tan(vFov / 2) * 5.5;
    const hW   = hH * aspect;

    const onMove = (e: MouseEvent) => {
      gsap.to(uniforms.uMouse.value, {
        x:  (e.clientX / W - 0.5) * hW * 2,
        y: -(e.clientY / H - 0.5) * hH * 2,
        duration: 0.12,
        overwrite: true,
      });
    };
    const onLeave = () =>
      gsap.to(uniforms.uMouse.value, { x: 9999, y: 9999, duration: 0.6 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const timer = new THREE.Timer();
    timer.connect(document);
    let raf: number;
    const tick = (timestamp: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(timestamp);
      uniforms.uTime.value = timer.getElapsed();
      renderer.render(scn, cam);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timer.dispose();
      st.scrollTrigger?.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [mode]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 0 }}
    />
  );
}
