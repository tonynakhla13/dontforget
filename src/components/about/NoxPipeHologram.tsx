"use client";

/**
 * NoxPipeHologram
 *
 * Full-screen Three.js wireframe pipe hologram that spells "NOX" —
 * same visual language as ServiceHeroHologram but with custom lettering.
 * Drop it as a fixed-position background behind the about page.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/* ─── palette ────────────────────────────────────────────────────────── */
const GREEN        = 0x46ae22;
const GREEN_BRIGHT = 0x6aee4e;
const GREEN_DEEP   = 0x2d7a15;

/* ─── helpers ────────────────────────────────────────────────────────── */
function v(x: number, y: number, z = 0) {
  return new THREE.Vector3(x, y, z);
}

function makeMat(color: number, opacity: number) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function makeTube(
  points: THREE.Vector3[],
  radius: number,
  mat: THREE.Material,
  closed = false,
) {
  const curve  = new THREE.CatmullRomCurve3(points, closed, "catmullrom", 0.1);
  const tube   = new THREE.TubeGeometry(curve, 80, radius, 10, closed);
  const wire   = new THREE.LineSegments(new THREE.WireframeGeometry(tube), mat);
  tube.dispose();
  return wire;
}

/** Generate oval/ellipse point cloud */
function oval(
  cx: number, cy: number,
  rx: number, ry: number,
  z = 0, n = 40,
): THREE.Vector3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return v(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, z);
  });
}

/* ─── NOX stroke specs ───────────────────────────────────────────────── */
type Stroke = { pts: THREE.Vector3[]; r: number; bright?: boolean; closed?: boolean };

function noxStrokes(): Stroke[] {
  const h = 0.72; // x-height (lowercase)
  return [
    // ── n ────────────────────────────────────────────────────────────
    // Single continuous path: up left leg → arch over top → down right leg
    {
      pts: [
        v(-2.36, -h, 0.06), v(-2.36, h, 0.06),
        v(-1.76, h + 0.24, 0.14),
        v(-1.16, h, 0.06),  v(-1.16, -h, 0.06),
      ],
      r: 0.10, bright: true,
    },

    // ── o ────────────────────────────────────────────────────────────
    { pts: oval(0, 0, 0.60, 0.74, 0.06, 44), r: 0.10, bright: true, closed: true },

    // ── x ────────────────────────────────────────────────────────────
    { pts: [v(1.16, h, 0.06), v(1.76, 0.0, 0.14), v(2.36, -h, 0.06)],  r: 0.10, bright: true }, // TL→BR
    { pts: [v(2.36, h, 0.06), v(1.76, 0.0, 0.14), v(1.16, -h, 0.06)],  r: 0.10, bright: true }, // TR→BL
  ];
}

/* ─── build Three.js group ───────────────────────────────────────────── */
function buildNox() {
  const group  = new THREE.Group();
  const main   = new THREE.Group();
  const echo   = new THREE.Group();

  const mat       = makeMat(GREEN,        0.048);
  const brightMat = makeMat(GREEN_BRIGHT, 0.082);
  const echoMat   = makeMat(GREEN_DEEP,   0.018);
  const echoBMat  = makeMat(GREEN,        0.030);

  echo.position.set(0.14, -0.10, -0.32);
  echo.scale.setScalar(1.038);

  for (const s of noxStrokes()) {
    const m  = s.bright ? brightMat : mat;
    const em = s.bright ? echoBMat  : echoMat;
    main.add(makeTube(s.pts, s.r, m,  s.closed ?? false));
    echo.add(makeTube(s.pts, s.r * 1.04, em, s.closed ?? false));
  }

  group.add(echo);
  group.add(main);
  group.rotation.set(-0.08, 0.16, -0.015);
  return group;
}

function disposeGroup(obj: THREE.Object3D) {
  obj.traverse(child => {
    const ls = child as THREE.LineSegments;
    ls.geometry?.dispose();
    const m = ls.material;
    if (Array.isArray(m)) m.forEach(x => x.dispose());
    else m?.dispose();
  });
}

/* ─── component ──────────────────────────────────────────────────────── */
export default function NoxPipeHologram() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    /* scene + camera */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7.2;

    /* NOX group */
    const group = buildNox();
    scene.add(group);

    const isMobile = window.innerWidth < 900;
    // Center NOX across the full viewport so N sits left, O center, X right
    group.position.set(isMobile ? 0.2 : 0.8, isMobile ? 0.0 : -0.05, -0.35);
    group.scale.setScalar(isMobile ? 0.85 : 1.55);

    /* scroll travel — same as ServiceHeroHologram */
    const travel = gsap.timeline({
      scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 1.4 },
    });
    travel
      .to(group.position, { x: -2.4, y: -0.4, z: -1.2, ease: "none" }, 0.22)
      .to(group.scale,    { x: 1.0, y: 1.0, z: 1.0,   ease: "none" }, 0.22)
      .to(group.rotation, { z: -0.35,                  ease: "none" }, 0.22)
      .to(group.position, { x: 2.0, y: 0.6, z: -1.8,  ease: "none" }, 0.56)
      .to(group.scale,    { x: 0.7, y: 0.7, z: 0.7,   ease: "none" }, 0.56)
      .to(group.position, { x: -1.0, y: -0.2, z: -2.0, ease: "none" }, 0.82)
      .to(group.scale,    { x: 0.52, y: 0.52, z: 0.52, ease: "none" }, 0.82);

    /* mouse parallax */
    const ptr = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      ptr.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      ptr.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    /* resize */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize",    onResize);

    /* render loop */
    const timer = new THREE.Timer();
    timer.connect(document);
    let raf = 0;
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(ts);
      const t = timer.getElapsed();
      group.rotation.x += ((-0.10 + ptr.y * 0.10) - group.rotation.x) * 0.05;
      group.rotation.y += ((-0.28 + ptr.x * 0.16 + Math.sin(t * 0.16) * 0.07) - group.rotation.y) * 0.05;
      group.rotation.z  = -0.015 + Math.sin(t * 0.11) * 0.06;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timer.dispose();
      travel.scrollTrigger?.kill();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      scene.remove(group);
      disposeGroup(group);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_42%,rgba(70,174,34,0.09),transparent_55%)]" />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
