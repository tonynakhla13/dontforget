"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const COUNT = 2800;

function smoothstepValue(value: number) {
  const x = Math.min(Math.max(value, 0), 1);
  return x * x * (3 - 2 * x);
}

// ── canvas helpers ────────────────────────────────────────────────────
function makeCtx(CW: number, CH: number): CanvasRenderingContext2D {
  const cv = document.createElement("canvas");
  cv.width = CW; cv.height = CH;
  return cv.getContext("2d")!;
}

// Draw text with manual letter tracking (spacing between each char)
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  tracking: number
) {
  const chars = text.split("");
  const widths = chars.map(c => ctx.measureText(c).width);
  const totalW = widths.reduce((s, w) => s + w, 0) + tracking * (chars.length - 1);
  let x = centerX - totalW / 2;
  ctx.textAlign = "left";
  chars.forEach((char, i) => {
    ctx.fillText(char, x, centerY);
    x += widths[i] + tracking;
  });
}

// All shapes map to the right half of the viewport, flat (z ≈ 0)
function sampleCanvas(
  ctx: CanvasRenderingContext2D,
  CW: number,
  CH: number,
  step: number
): Float32Array {
  const px = ctx.getImageData(0, 0, CW, CH).data;
  const hits: [number, number][] = [];
  for (let y = 0; y < CH; y += step)
    for (let x = 0; x < CW; x += step)
      if (px[(y * CW + x) * 4 + 3] > 100) hits.push([x, y]);

  for (let i = hits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hits[i], hits[j]] = [hits[j], hits[i]];
  }

  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const [cx, cy] = hits[i % hits.length];
    pos[i * 3]     =  (cx / CW) * 3.8 + 0.22;          // x: 0.22 → 4.02 (wide stage, still inside frame)
    pos[i * 3 + 1] = -((cy / CH) - 0.5) * 4.2 - 0.2;   // y: centered, nudged below navbar
    pos[i * 3 + 2] =  (Math.random() - 0.5) * 0.04;     // z: nearly flat
  }
  return pos;
}

// ── shape 0: WEBSITES ────────────────────────────────────────────────
function buildWebsitesPos(): Float32Array {
  const CW = 1000, CH = 480;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 154px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, "WEBSITES", 405, CH / 2, 8);
  return sampleCanvas(ctx, CW, CH, 6);
}

// ── shape 1: UI/UX ───────────────────────────────────────────────────
function buildUIUXPos(): Float32Array {
  const CW = 1000, CH = 480;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 230px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, "UI/UX", CW / 2, CH / 2, 44);
  return sampleCanvas(ctx, CW, CH, 6);
}

// ── shape 2: APP ─────────────────────────────────────────────────────
function buildAppPos(): Float32Array {
  const CW = 1000, CH = 480;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 270px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, "APP", CW / 2, CH / 2, 72);
  return sampleCanvas(ctx, CW, CH, 6);
}

// ── shape 3: CRM ─────────────────────────────────────────────────────
function buildCRMPos(): Float32Array {
  const CW = 1000, CH = 480;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 270px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, "CRM", CW / 2, CH / 2, 72);
  return sampleCanvas(ctx, CW, CH, 6);
}

// ── shape 4: DON'T FORGET ─────────────────────────────────────────────
function buildLetterPos(): Float32Array {
  const CW = 1000, CH = 500;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 185px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, "DON'T",  CW / 2, CH * 0.27, 34);
  drawTracked(ctx, "FORGET", CW / 2, CH * 0.74, 34);
  return sampleCanvas(ctx, CW, CH, 6);
}

function buildNumberPos(text: string): Float32Array {
  const CW = 1000, CH = 480;
  const ctx = makeCtx(CW, CH);
  ctx.fillStyle = "#fff";
  ctx.font = `900 310px 'Arial Black', Impact, sans-serif`;
  ctx.textBaseline = "middle";
  drawTracked(ctx, text, CW / 2, CH / 2, 34);
  const pos = sampleCanvas(ctx, CW, CH, 6);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] -= 4.1;      // move service numbers to the left side
    pos[i * 3 + 1] -= 1.75; // move service numbers toward the bottom
  }
  return pos;
}

// ── scatter ───────────────────────────────────────────────────────────
function buildScatterPos(): Float32Array {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return pos;
}

// ── blob sphere ───────────────────────────────────────────────────────
function buildBlobPos(): Float32Array {
  const pos  = new Float32Array(COUNT * 3);
  const gold = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const r     = Math.random() < 0.72 ? 1.7 + (Math.random() - 0.5) * 0.35 : Math.random() * 1.4;
    const y     = 1 - (i / (COUNT - 1)) * 2;
    const rad   = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = gold * i;
    pos[i * 3]     = r * rad * Math.cos(theta);
    pos[i * 3 + 1] = r * y * 1.25;
    pos[i * 3 + 2] = r * rad * Math.sin(theta);
  }
  return pos;
}

// ── GLSL ──────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  attribute vec3 aUIUX;
  attribute vec3 aApps;
  attribute vec3 aCRM;
  attribute vec3 aLetters;
  attribute vec3 aScatter;
  attribute vec3 aBlob;
  attribute vec3 aSvc1;
  attribute vec3 aSvc2;
  attribute vec3 aSvc3;
  attribute vec3 aSvc4;
  attribute vec3 aSvc5;
  attribute vec3 aSvc6;

  uniform float uScene;
  uniform float uDotOpacity;
  uniform float uShapeA;
  uniform float uShapeB;
  uniform float uShapeBlend;
  uniform float uNumberBlend;
  uniform vec2  uMouse;
  uniform float uSize;
  uniform float uTime;

  varying float vDepth;

  vec3 getShape(float idx) {
    if (idx < 0.5) return position;
    if (idx < 1.5) return aUIUX;
    if (idx < 2.5) return aApps;
    if (idx < 3.5) return aCRM;
    if (idx < 4.5) return aLetters;
    if (idx < 5.5) return aSvc1;
    if (idx < 6.5) return aSvc2;
    if (idx < 7.5) return aSvc3;
    if (idx < 8.5) return aSvc4;
    if (idx < 9.5) return aSvc5;
    if (idx < 10.5) return aSvc6;
    return aScatter;
  }

  void main() {
    float t1 = clamp(uScene,       0.0, 1.0);
    float t2 = clamp(uScene - 1.0, 0.0, 1.0);

    vec3 heroPos = mix(getShape(uShapeA), getShape(uShapeB), smoothstep(0.0, 1.0, max(uShapeBlend, uNumberBlend)));
    vec3 pos     = mix(mix(heroPos, aScatter, t1), aBlob, t2);

    // Gentle idle drift (hero only)
    float idle = 1.0 - smoothstep(0.0, 0.4, uScene);
    pos.x += sin(uTime * 0.7 + heroPos.y * 4.0) * 0.006 * idle;
    pos.y += cos(uTime * 0.55 + heroPos.x * 3.2) * 0.004 * idle;

    // Blob rotation + breathing
    float blobAmt = smoothstep(0.5, 1.0, t2);
    float angle   = uTime * 0.25 * blobAmt;
    float cosA    = cos(angle), sinA = sin(angle);
    float rx      = pos.x * cosA - pos.z * sinA;
    float rz      = pos.x * sinA + pos.z * cosA;
    pos.x = mix(pos.x, rx, blobAmt);
    pos.z = mix(pos.z, rz, blobAmt);
    pos  *= mix(1.0, 1.0 + sin(uTime * 0.9) * 0.04, blobAmt);

    // Mouse repulsion
    vec2  diff = pos.xy - uMouse;
    float dist = length(diff);
    float rep  = smoothstep(1.3, 0.0, dist);
    pos.xy += normalize(diff + 0.001) * rep * 0.22;

    vDepth = normalize(pos).z;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Flat (constant) size in hero — perspective only for blob
    float szFlat = uSize * 1.25;
    float szPersp = uSize * (3.8 / -mv.z);
    gl_PointSize = mix(szFlat, szPersp, blobAmt);
  }
`;

const FRAG = /* glsl */`
  uniform float uScene;
  uniform float uDotOpacity;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.36, 0.5, d);

    vec3 teal    = vec3(0.227, 0.749, 0.541);
    vec3 scatter = vec3(0.11,  0.34,  0.27);
    vec3 blobFg  = vec3(0.16,  0.55,  0.40);
    vec3 blobBg  = vec3(0.05,  0.05,  0.06);

    float t2     = clamp(uScene - 1.0, 0.0, 1.0);
    float blobD  = vDepth * 0.5 + 0.5;
    vec3  blobCol = mix(blobBg, blobFg, pow(blobD, 1.8));

    vec3  col    = mix(teal, scatter, clamp(uScene, 0.0, 1.0));
    col          = mix(col, blobCol, t2);
    float bright = mix(1.0, 0.62, clamp(uScene, 0.0, 1.0));
    bright       = mix(bright, 1.08, t2 * 0.95);

    gl_FragColor = vec4(col, alpha * bright * uDotOpacity);
  }
`;

export default function DFParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const aspect = W / H;
    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    camera.position.z = 5;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(buildWebsitesPos(), 3));
    geo.setAttribute("aUIUX",    new THREE.BufferAttribute(buildUIUXPos(),    3));
    geo.setAttribute("aApps",    new THREE.BufferAttribute(buildAppPos(),      3));
    geo.setAttribute("aCRM",     new THREE.BufferAttribute(buildCRMPos(),     3));
    geo.setAttribute("aLetters", new THREE.BufferAttribute(buildLetterPos(),  3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(buildScatterPos(), 3));
    geo.setAttribute("aBlob",    new THREE.BufferAttribute(buildBlobPos(),    3));
    geo.setAttribute("aSvc1",    new THREE.BufferAttribute(buildNumberPos("01"), 3));
    geo.setAttribute("aSvc2",    new THREE.BufferAttribute(buildNumberPos("02"), 3));
    geo.setAttribute("aSvc3",    new THREE.BufferAttribute(buildNumberPos("03"), 3));
    geo.setAttribute("aSvc4",    new THREE.BufferAttribute(buildNumberPos("04"), 3));
    geo.setAttribute("aSvc5",    new THREE.BufferAttribute(buildNumberPos("05"), 3));
    geo.setAttribute("aSvc6",    new THREE.BufferAttribute(buildNumberPos("06"), 3));

    const uniforms = {
      uScene:      { value: 0 },
      uShapeA:     { value: 0 },
      uShapeB:     { value: 1 },
      uShapeBlend: { value: 0 },
      uNumberBlend:{ value: 0 },
      uMouse:      { value: new THREE.Vector2(9999, 9999) },
      uSize:       { value: window.devicePixelRatio * 1.65 },
      uTime:       { value: 0 },
      uDotOpacity: { value: 0.82 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const applyHeroLayout = (width: number) => {
      const compact = width < 1180;
      const scale = compact ? 0.92 : 1.26;
      const offsetX = compact ? -0.08 : 0.08;

      points.scale.setScalar(scale);
      points.position.x = offsetX;
    };
    applyHeroLayout(W);

    const aboutShapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x5de7b4,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const aboutShape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.95, 0.42, 180, 24, 2, 5),
      aboutShapeMaterial
    );
    aboutShape.position.set(2.95, -0.95, -1.7);
    aboutShape.rotation.set(0.5, 0.3, 0.12);
    aboutShape.scale.setScalar(1.75);
    scene.add(aboutShape);
    const serviceShapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x5de7b4,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const serviceShape = new THREE.Mesh(
      new THREE.SphereGeometry(2.3, 28, 28),
      serviceShapeMaterial
    );
    serviceShape.position.set(2.95, -0.95, -1.7);
    serviceShape.scale.setScalar(1.55);
    scene.add(serviceShape);
    // ── auto-cycle through 5 shapes ──
    let shapeIdx = 0;
    let cycleTween: gsap.core.Tween | null = null;
    let cycleDelay: gsap.core.Tween | null = null;

    const doTransition = () => {
      const next = (shapeIdx + 1) % 5;
      uniforms.uShapeA.value = shapeIdx;
      uniforms.uShapeB.value = next;
      cycleTween = gsap.fromTo(uniforms.uShapeBlend, { value: 0 }, {
        value: 1,
        duration: next === 4 ? 2.15 : 1.6,
        ease: next === 4 ? "expo.inOut" : "power2.inOut",
        onComplete: () => {
          shapeIdx = next;
          if (shapeIdx === 4) {
            cycleDelay = gsap.delayedCall(3.2, () => {
              uniforms.uShapeA.value = 4;
              uniforms.uShapeB.value = 5;
              cycleTween = gsap.fromTo(uniforms.uShapeBlend, { value: 0 }, {
                value: 1,
                duration: 0.95,
                ease: "power4.in",
                onComplete: () => {
                  uniforms.uShapeA.value = 5;
                  uniforms.uShapeB.value = 0;
                  cycleTween = gsap.fromTo(uniforms.uShapeBlend, { value: 0 }, {
                    value: 1,
                    duration: 1.3,
                    ease: "power3.out",
                    onComplete: () => {
                      shapeIdx = 0;
                      cycleDelay = gsap.delayedCall(3.0, doTransition);
                    },
                  });
                },
              });
            });
            return;
          }

          cycleDelay = gsap.delayedCall(3.0, doTransition);
        },
      });
    };
    cycleDelay = gsap.delayedCall(3.4, doTransition);

    // ── scroll: hero → scatter ──
    const st1 = gsap.to(uniforms.uScene, {
      value: 1, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom 35%", scrub: 2.2 },
    });

    // ── scroll: about → blob ──
    let st2: ReturnType<typeof ScrollTrigger.create> | null = null;
    const aboutEl = document.querySelector("#about");
    if (aboutEl) {
      st2 = ScrollTrigger.create({
        trigger: aboutEl, start: "top 88%", end: "bottom 28%", scrub: 1.8,
        onUpdate(self) {
          const p = self.progress;
          uniforms.uScene.value = 1 + (p < 0.5 ? p * 2 : (1 - p) * 2);
        },
      });
    }

    let st3: ReturnType<typeof ScrollTrigger.create> | null = null;
    const servicesEl = document.querySelector("#services");
    if (servicesEl) {
      st3 = ScrollTrigger.create({
        trigger: servicesEl,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onEnter() {
          cycleTween?.kill();
          cycleDelay?.kill();
        },
        onEnterBack() {
          cycleTween?.kill();
          cycleDelay?.kill();
        },
        onLeaveBack() {
          shapeIdx = 0;
          uniforms.uShapeA.value = 0;
          uniforms.uShapeB.value = 1;
          uniforms.uShapeBlend.value = 0;
          cycleDelay = gsap.delayedCall(3.0, doTransition);
        },
        onUpdate(self) {
          const p = self.progress;
          const adjusted = Math.max(0, p - 0.14) / 0.86;
          const scaled = Math.min(5.999, adjusted * 6);
          const idx = Math.floor(scaled);
          const nextIdx = Math.min(5, idx + 1);
          const local = scaled - idx;
          uniforms.uShapeA.value = 5 + idx;
          uniforms.uShapeB.value = 5 + nextIdx;
          uniforms.uShapeBlend.value = 0;
          uniforms.uNumberBlend.value = Math.min(Math.max((local - 0.18) / 0.64, 0), 1);
          // Keep particles in scatter during the intro slide — first service panel
          // appears at ~8% of services scroll; fade from scatter→number over 0→9%.
          uniforms.uScene.value = Math.max(0, 1 - p / 0.09);
        },
      });
    }

    let st4: ReturnType<typeof ScrollTrigger.create> | null = null;
    const processEl = document.querySelector("#process");
    if (processEl) {
      st4 = ScrollTrigger.create({
        trigger: processEl,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate(self) {
          uniforms.uShapeA.value = 10;
          uniforms.uShapeB.value = 11;
          uniforms.uShapeBlend.value = self.progress;
          uniforms.uNumberBlend.value = 0;
          uniforms.uScene.value = 0;
        },
      });
    }

    const principlesEl = document.querySelector("#principles");

    // ── mouse ──
    const vFov = (55 * Math.PI) / 180;
    const hH   = Math.tan(vFov / 2) * 5;
    const hW   = hH * aspect;

    const onMove = (e: MouseEvent) => {
      gsap.to(uniforms.uMouse.value, {
        x:  (e.clientX / W - 0.5) * hW * 2,
        y: -(e.clientY / H - 0.5) * hH * 2,
        duration: 0.12, overwrite: true,
      });
    };
    const onLeave = () =>
      gsap.to(uniforms.uMouse.value, { x: 9999, y: 9999, duration: 0.6 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      applyHeroLayout(w);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      const shapeA = Math.round(uniforms.uShapeA.value);
      const shapeB = Math.round(uniforms.uShapeB.value);
      const blend = uniforms.uShapeBlend.value;
      const aboutAmt = 0.035 + smoothstepValue(uniforms.uScene.value - 1) * 0.035;
      aboutShape.rotation.x += 0.0008;
      aboutShape.rotation.y += 0.00115;
      aboutShape.rotation.z +=
        (uniforms.uMouse.value.x === 9999 ? 0 : uniforms.uMouse.value.x * 0.00002);
      aboutShape.position.x +=
        ((uniforms.uMouse.value.x === 9999 ? 2.95 : 2.95 + uniforms.uMouse.value.x * 0.08) -
          aboutShape.position.x) *
        0.02;
      aboutShape.position.y +=
        ((uniforms.uMouse.value.y === 9999 ? -0.95 : -0.95 + uniforms.uMouse.value.y * 0.08) -
          aboutShape.position.y) *
        0.02;
      aboutShapeMaterial.opacity = aboutAmt;
      const serviceRect = servicesEl ? (servicesEl as HTMLElement).getBoundingClientRect() : null;
      const serviceVisibility = serviceRect
        ? Math.min(
            Math.max(
              Math.min(
                (window.innerHeight - serviceRect.top) / (window.innerHeight * 0.65),
                serviceRect.bottom / (window.innerHeight * 0.65)
              ),
              0
            ),
            1
          )
        : 0;
      const principlesRect = principlesEl ? (principlesEl as HTMLElement).getBoundingClientRect() : null;
      const principlesVisibility = principlesRect
        ? Math.min(
            Math.max(
              Math.min(
                (window.innerHeight - principlesRect.top) / (window.innerHeight * 0.45),
                principlesRect.bottom / (window.innerHeight * 0.45)
              ),
              0
            ),
            1
          )
        : 0;
      serviceShape.position.x += (0 - serviceShape.position.x) * 0.03;
      serviceShape.position.y += (0 - serviceShape.position.y) * 0.03;
      serviceShape.rotation.x += 0.0007;
      serviceShape.rotation.y += 0.001;
      aboutShapeMaterial.opacity *= 1 - serviceVisibility;
      aboutShapeMaterial.opacity *= 1 - principlesVisibility;
      serviceShapeMaterial.opacity = serviceVisibility * 0.08 * (1 - principlesVisibility);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      cycleTween?.kill();
      cycleDelay?.kill();
      st1.scrollTrigger?.kill();
      st2?.kill();
      st3?.kill();
      st4?.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose(); geo.dispose(); mat.dispose();
      aboutShape.geometry.dispose();
      aboutShapeMaterial.dispose();
      serviceShape.geometry.dispose();
      serviceShapeMaterial.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 0 }}
    />
  );
}
