"use client";

/**
 * FooterOrb
 * Full-bleed Three.js canvas for the footer background. A nested wireframe orb
 * sits on the right and continuously sheds green spark particles that stream
 * left across the whole footer — the "shape produces particles that flow in the
 * background". Canvas fits its container (the footer); the loop pauses when the
 * footer is off-screen, and reduced-motion drops the particles.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const G  = 0x46ae22;   // NOX green
const GB = 0x6aee4e;   // bright highlight

function lineMat(color: number, opacity: number) {
  return new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
}
function pointsMat(color: number, opacity: number, size: number) {
  return new THREE.PointsMaterial({
    color, transparent: true, opacity, size,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
}

export default function FooterOrb() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /* ── renderer / scene / camera ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const FOV = 45, CAMZ = 5.4;
    const vfov = THREE.MathUtils.degToRad(FOV);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMZ;

    let halfH = Math.tan(vfov / 2) * CAMZ;
    let halfW = halfH;
    let orbX  = halfW * 0.82;
    let killX = -halfW * 1.12;

    /* ── orb (held by a pivot so it can be placed on the right) ── */
    const orbPivot = new THREE.Group();
    const root = new THREE.Group();
    orbPivot.add(root);
    scene.add(orbPivot);

    const icoWire = (r: number, detail: number, m: THREE.Material) => {
      const geo = new THREE.IcosahedronGeometry(r, detail);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), m);
      geo.dispose();
      return wire;
    };
    const icoDots = (r: number, detail: number, m: THREE.PointsMaterial) => {
      const geo = new THREE.IcosahedronGeometry(r, detail);
      const pts = new THREE.Points(geo, m);
      geo.dispose();
      return pts;
    };

    const outer = icoWire(1.55, 1, lineMat(G, 0.55));
    const mid   = new THREE.Group(); mid.add(icoWire(1.1, 1, lineMat(G, 0.40)));
    const inner = new THREE.Group(); inner.add(icoWire(0.68, 0, lineMat(GB, 0.70)));
    const core  = icoWire(0.28, 2, lineMat(GB, 0.90));
    const dotsOuter = icoDots(1.55, 1, pointsMat(GB, 0.85, 0.038));
    const dotsMid   = icoDots(1.1,  1, pointsMat(G,  0.70, 0.030));
    const dotsInner = icoDots(0.68, 0, pointsMat(GB, 0.95, 0.045));

    const ringGeo = new THREE.TorusGeometry(1.72, 0.006, 4, 90);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: G, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    ring.rotation.x = Math.PI / 2;
    const ring2 = ring.clone();
    ring2.material = (ring.material as THREE.MeshBasicMaterial).clone();
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.20;
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;

    root.add(outer, dotsOuter, mid, dotsMid, inner, core, dotsInner, ring, ring2);

    /* ── particle stream — sheds from the orb, flows left across the footer ── */
    const COUNT = reduce ? 0 : 170;
    const N = Math.max(1, COUNT);
    const pPos  = new Float32Array(N * 3);
    const pVel  = new Float32Array(N * 3);
    const pSize = new Float32Array(N);
    const pLife = new Float32Array(N);

    const spawn = (i: number, atOrb: boolean) => {
      const i3 = i * 3;
      pPos[i3]     = atOrb ? orbX + (Math.random() - 0.5) * 1.0
                           : killX + Math.random() * (orbX - killX);
      pPos[i3 + 1] = (Math.random() - 0.5) * halfH * 1.7;
      pPos[i3 + 2] = (Math.random() - 0.5) * 2.4;
      pVel[i3]     = -(0.28 + Math.random() * 0.5);
      pVel[i3 + 1] = (Math.random() - 0.5) * 0.06;
      pVel[i3 + 2] = (Math.random() - 0.5) * 0.04;
      pSize[i]     = 1.6 + Math.random() * 3.2;
      pLife[i]     = 0;
    };

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aLife", new THREE.BufferAttribute(pLife, 1));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
    const pMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(GB) } },
      vertexShader: /* glsl */`
        attribute float aLife; attribute float aSize; varying float vLife;
        void main() {
          vLife = aLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (300.0 / max(0.001, -mv.z));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        precision mediump float; varying float vLife; uniform vec3 uColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float m = smoothstep(0.5, 0.0, length(uv));
          if (m <= 0.001) discard;
          gl_FragColor = vec4(uColor, m * clamp(vLife, 0.0, 1.0) * 0.55);
        }`,
    });
    const points = new THREE.Points(pGeo, pMat);
    points.frustumCulled = false;
    scene.add(points);

    /* ── fit to container ── */
    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfH = Math.tan(vfov / 2) * CAMZ;
      halfW = halfH * camera.aspect;
      orbX  = halfW * 0.82;
      killX = -halfW * 1.12;
      orbPivot.position.set(orbX, 0, 0);
      orbPivot.scale.setScalar(Math.min(1.05, halfH * 0.42));
    };
    resize();
    for (let i = 0; i < COUNT; i++) spawn(i, false);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    /* ── mouse parallax ── */
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    /* ── loop (paused when off-screen) ── */
    const clock = new THREE.Clock();
    let raf = 0;
    let t = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());
      t += dt;

      outer.rotation.y = t * 0.14; outer.rotation.x = t * 0.07;
      mid.rotation.y   = -t * 0.19; mid.rotation.z = t * 0.09;
      inner.rotation.y = t * 0.27; inner.rotation.x = -t * 0.13;
      core.rotation.x  = t * 0.40; core.rotation.z = -t * 0.31;
      ring.rotation.z  = t * 0.06; ring2.rotation.y = -t * 0.11;

      const tx = mouseRef.current.x * 0.12;
      const ty = -mouseRef.current.y * 0.12;
      root.rotation.y += (tx - root.rotation.y) * 0.06;
      root.rotation.x += (ty - root.rotation.x) * 0.06;
      root.scale.setScalar(1 + Math.sin(t * 0.55) * 0.03);

      /* drift the particle stream left, recycle at the orb, fade at both ends */
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        pPos[i3]     += pVel[i3]     * dt;
        pPos[i3 + 1] += pVel[i3 + 1] * dt;
        pPos[i3 + 2] += pVel[i3 + 2] * dt;
        if (pPos[i3] < killX) spawn(i, true);
        const prog = (orbX - pPos[i3]) / (orbX - killX);          // 0 at orb → 1 at kill
        pLife[i] = Math.max(0, Math.min(1, Math.min(prog / 0.1, (1 - prog) / 0.18)));
      }
      if (COUNT) {
        pGeo.attributes.position.needsUpdate = true;
        pGeo.attributes.aLife.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { clock.getDelta(); tick(); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0 });
    io.observe(wrap);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose?.();
      });
      ringGeo.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
