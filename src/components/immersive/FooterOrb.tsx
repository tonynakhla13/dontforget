"use client";

/**
 * FooterOrb
 * Three.js compound wireframe orb — nested icosahedra + vertex particles
 * + mouse-tracked parallax. Renders into a fixed-size canvas.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const G  = 0x46ae22;   // #46AE22 — NOX green
const GB = 0x6aee4e;   // bright highlight
const GD = 0x2d7a15;   // deep inner

function mat(color: number, opacity: number) {
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

export default function FooterOrb({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    /* ── scene / camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.8;

    /* ── group that holds everything ── */
    const root = new THREE.Group();
    scene.add(root);

    /* helper — wireframe icosahedron */
    function icoWire(r: number, detail: number, m: THREE.Material) {
      const geo  = new THREE.IcosahedronGeometry(r, detail);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), m);
      geo.dispose();
      return wire;
    }

    /* helper — vertex dots from icosahedron */
    function icoDots(r: number, detail: number, m: THREE.PointsMaterial) {
      const geo  = new THREE.IcosahedronGeometry(r, detail);
      const pts  = new THREE.Points(geo, m);
      geo.dispose();
      return pts;
    }

    /* ── outer shell ── */
    const outer = icoWire(1.55, 1, mat(G, 0.55));

    /* ── mid shell — counter-rotation ── */
    const mid = new THREE.Group();
    mid.add(icoWire(1.1, 1, mat(G, 0.40)));

    /* ── inner shell ── */
    const inner = new THREE.Group();
    inner.add(icoWire(0.68, 0, mat(GB, 0.70)));

    /* ── core glow — tiny dense icosahedron ── */
    const core = icoWire(0.28, 2, mat(GB, 0.90));

    /* ── vertex particles on each shell ── */
    const dotsOuter = icoDots(1.55, 1, pointsMat(GB, 0.85, 0.038));
    const dotsMid   = icoDots(1.1,  1, pointsMat(G,  0.70, 0.030));
    const dotsInner = icoDots(0.68, 0, pointsMat(GB, 0.95, 0.045));

    /* ── equatorial ring ── */
    const ringGeo  = new THREE.TorusGeometry(1.72, 0.006, 4, 90);
    const ring     = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: G, transparent: true, opacity: 0.45,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    ring.rotation.x = Math.PI / 2;

    /* ── a tilted orbit ring ── */
    const ring2     = ring.clone();
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.20;

    /* ── assemble ── */
    root.add(outer, dotsOuter);
    root.add(mid, dotsMid);
    root.add(inner, core, dotsInner);
    root.add(ring, ring2);

    /* ── mouse parallax ── */
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    /* ── animate ── */
    let raf = 0;
    const clock = new THREE.Clock();

    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      outer.rotation.y  =  t * 0.14;
      outer.rotation.x  =  t * 0.07;

      mid.rotation.y    = -t * 0.19;
      mid.rotation.z    =  t * 0.09;

      inner.rotation.y  =  t * 0.27;
      inner.rotation.x  = -t * 0.13;

      core.rotation.x   =  t * 0.40;
      core.rotation.z   = -t * 0.31;

      ring.rotation.z   =  t * 0.06;
      ring2.rotation.y  = -t * 0.11;

      /* parallax */
      const tx = mouseRef.current.x * 0.12;
      const ty = -mouseRef.current.y * 0.12;
      root.rotation.y += (tx - root.rotation.y) * 0.06;
      root.rotation.x += (ty - root.rotation.x) * 0.06;

      /* breathe */
      const s = 1 + Math.sin(t * 0.55) * 0.03;
      root.scale.setScalar(s);

      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: "block", pointerEvents: "none" }}
    />
  );
}
