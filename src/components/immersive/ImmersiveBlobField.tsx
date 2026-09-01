"use client";

/**
 * ImmersiveBlobField — green "lava lamp" background.
 *
 * A fullscreen GLSL metaball field: one big source blob anchored at the bottom
 * sheds chunks that rise upward, merge and split (emergent from the distance
 * field), and recycle at the top. The cursor is a repulsor — the rising stream
 * bends and splits around it. Rendered into a fixed, full-viewport, pointer-
 * events-none canvas behind the page content, at low opacity.
 *
 * Perf: renders at a fraction of native resolution (soft field hides it),
 * pauses when the tab is hidden, and freezes under reduced-motion.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLOR_A = 0x2f7d16;  // deep NOX green
const COLOR_B = 0x55e23a;  // bright NOX green
const MAXB    = 16;        // uniform array size
const CHUNKS  = 12;        // rising chunks (index 1..CHUNKS); index 0 is the source
const SCALE   = 0.55;      // internal render scale

export default function ImmersiveBlobField({ opacity = 0.32 }: { opacity?: number }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.Camera();   // fullscreen quad ignores camera matrices

    const blobVecs = Array.from({ length: MAXB }, () => new THREE.Vector3(0, 0, 0));

    const uniforms = {
      uAspect:  { value: 1 },
      uMouse:   { value: new THREE.Vector3(0.5, 1.4, 0) },   // x,y in [0,1]; z = active
      uBlobs:   { value: blobVecs },
      uColorA:  { value: new THREE.Color(COLOR_A) },
      uColorB:  { value: new THREE.Color(COLOR_B) },
      uOpacity: { value: opacity },
    };

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: false,
      uniforms,
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        uniform float uAspect;
        uniform vec3  uMouse;
        uniform vec3  uBlobs[${MAXB}];
        uniform vec3  uColorA;
        uniform vec3  uColorB;
        uniform float uOpacity;

        void main() {
          vec2 p = vec2(vUv.x * uAspect, vUv.y);
          float field = 0.0;
          for (int i = 0; i < ${MAXB}; i++) {
            float r = uBlobs[i].z;
            if (r <= 0.0) continue;
            vec2 d = p - vec2(uBlobs[i].x * uAspect, uBlobs[i].y);
            field += (r * r) / (dot(d, d) + 0.0002);
          }

          float T = 1.0;
          float mask  = smoothstep(T - 0.45, T + 0.45, field);
          float inten = smoothstep(T, T * 2.4, field);
          vec3  col   = mix(uColorA, uColorB, inten);

          // faint halo where the field is building but below the surface
          float halo = pow(clamp(field / T, 0.0, 1.0), 1.7) * 0.3;
          float a = (mask * 0.85 + halo * (1.0 - mask)) * uOpacity;
          if (a <= 0.001) discard;
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    quad.frustumCulled = false;
    scene.add(quad);

    /* ── blob simulation state ── */
    const baseX = new Float32Array(MAXB);
    const posY  = new Float32Array(MAXB);
    const vel   = new Float32Array(MAXB);
    const rad   = new Float32Array(MAXB);
    const amp   = new Float32Array(MAXB);
    const freq  = new Float32Array(MAXB);
    const phase = new Float32Array(MAXB);

    const spawnChunk = (i: number, spread: boolean) => {
      baseX[i] = 0.5 + (Math.random() - 0.5) * 0.16;
      posY[i]  = spread ? Math.random() * 1.05 : 0.02 + Math.random() * 0.06;
      vel[i]   = 0.045 + Math.random() * 0.06;
      rad[i]   = 0.055 + Math.random() * 0.07;
      amp[i]   = 0.02 + Math.random() * 0.06;
      freq[i]  = 0.3 + Math.random() * 0.6;
      phase[i] = Math.random() * Math.PI * 2;
    };

    // index 0 = big source blob anchored at the bottom
    baseX[0] = 0.5; posY[0] = -0.05; rad[0] = 0.34; vel[0] = 0;
    amp[0] = 0; freq[0] = 0.2; phase[0] = 0;
    for (let i = 1; i <= CHUNKS; i++) spawnChunk(i, true);
    for (let i = CHUNKS + 1; i < MAXB; i++) rad[i] = 0;   // unused → no contribution

    const writeUniforms = (t: number) => {
      // source: gentle wobble + pulse
      const sx = 0.5 + Math.sin(t * 0.22) * 0.03;
      const sr = 0.34 + Math.sin(t * 0.4) * 0.03;
      blobVecs[0].set(sx, -0.05, sr);
      for (let i = 1; i <= CHUNKS; i++) {
        const dispX = baseX[i] + Math.sin(t * freq[i] + phase[i]) * amp[i];
        blobVecs[i].set(dispX, posY[i], rad[i]);
      }
    };

    const updateBlobs = (dt: number, t: number) => {
      const mActive = uniforms.uMouse.value.z > 0.5;
      const mx = uniforms.uMouse.value.x, my = uniforms.uMouse.value.y;
      const R = 0.2, force = 0.5;
      for (let i = 1; i <= CHUNKS; i++) {
        posY[i] += vel[i] * dt;
        const dispX = baseX[i] + Math.sin(t * freq[i] + phase[i]) * amp[i];
        if (mActive) {
          const dx = (dispX - mx) * uniforms.uAspect.value;
          const dy = posY[i] - my;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 1e-4) {
            const f = force * (1 - dist / R) * dt;
            baseX[i] += (dx / dist) / uniforms.uAspect.value * f;
            posY[i]  += (dy / dist) * f;
          }
        }
        if (baseX[i] < 0.05) baseX[i] = 0.05; else if (baseX[i] > 0.95) baseX[i] = 0.95;
        if (posY[i] > 1.15) spawnChunk(i, false);
      }
    };

    const renderFrame = (t: number) => { writeUniforms(t); renderer.render(scene, camera); };

    /* ── sizing ── */
    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      renderer.setSize(Math.round(w * SCALE), Math.round(h * SCALE), false);
      uniforms.uAspect.value = w / h;
    };
    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) renderFrame(0); });
    ro.observe(wrap);

    /* ── mouse ── */
    const onMouse = (e: MouseEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
        1,
      );
    };
    if (!reduce) window.addEventListener("mousemove", onMouse);

    /* ── loop ── */
    const clock = new THREE.Clock();
    let raf = 0;
    let t = 0;
    let onVis: (() => void) | null = null;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());
      t += dt;
      updateBlobs(dt, t);
      renderFrame(t);
    };

    if (reduce) {
      renderFrame(0);   // static green field, no loop
    } else {
      tick();
      onVis = () => {
        if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
        else if (!raf) { clock.getDelta(); tick(); }
      };
      document.addEventListener("visibilitychange", onVis);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      quad.geometry.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [opacity]);

  return (
    <div ref={wrapRef} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
