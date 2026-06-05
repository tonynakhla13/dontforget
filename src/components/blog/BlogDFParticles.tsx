"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GREEN_BRIGHT = 0x46d12a;

export default function BlogDFParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { return; }

    const r = renderer;
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(window.innerWidth, window.innerHeight);
    r.setClearColor(0, 0);
    mount.appendChild(r.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 9);

    /* ── one big TorusKnot, anchored right-center ── */
    const geo  = new THREE.TorusKnotGeometry(2.8, 0.62, 220, 24, 2, 3);
    const mat  = new THREE.MeshBasicMaterial({
      color: GREEN_BRIGHT, wireframe: true, transparent: true, opacity: 0.14,
    });
    const mesh = new THREE.Mesh(geo, mat);

    /* world-x for right side: ~38% of half-width */
    const BASE_X =  3.8;
    const BASE_Y =  0.0;
    mesh.position.set(BASE_X, BASE_Y, 0);
    scene.add(mesh);

    /* velocity for spring physics */
    const vel = new THREE.Vector2(0, 0);

    /* mouse in world space */
    const mouse   = new THREE.Vector2(9999, 9999);
    const camBase = new THREE.Vector3(0, 0, 9);

    function worldBounds() {
      const h = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      return { w: h * camera.aspect, h };
    }

    const onMouseMove = (e: MouseEvent) => {
      const ndx =  (e.clientX / window.innerWidth  - 0.5) * 2;
      const ndy = -(e.clientY / window.innerHeight - 0.5) * 2;
      const { w, h } = worldBounds();
      mouse.set(ndx * w, ndy * h);
      /* camera tilts gently toward mouse */
      camBase.set(ndx * 0.8, ndy * 0.5, 9);
    };

    const onMouseLeave = () => {
      mouse.set(9999, 9999);
      camBase.set(0, 0, 9);
    };

    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      r.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll",     onScroll, { passive: true });
    window.addEventListener("resize",     onResize);

    /* ── render loop ── */
    let raf = 0;
    const clock = new THREE.Clock();

    const SPRING  = 0.018;
    const DAMP    = 0.84;
    const REPEL_R = 5.0;
    const REPEL_F = 0.32;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      /* camera parallax */
      camera.position.x += (camBase.x - camera.position.x) * 0.05;
      camera.position.y += (camBase.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      /* scroll progress 0→1 over one viewport height */
      const scrollP = Math.min(scrollY / window.innerHeight, 1);
      const scrollScale = 1 - scrollP * 0.72;        // shrinks to 28% of original
      mesh.scale.setScalar(scrollScale);
      mat.opacity = 0.14 * (1 - scrollP * 0.7);      // fades out too

      /* gentle float */
      const targetX = BASE_X + scrollP * 1.5;        // drifts further right
      const targetY = BASE_Y + Math.sin(t * 0.32) * 0.35 + scrollP * 3.5; // rises up

      /* spring toward resting position */
      vel.x += (targetX - mesh.position.x) * SPRING;
      vel.y += (targetY - mesh.position.y) * SPRING;

      /* mouse repulsion */
      const dx   = mesh.position.x - mouse.x;
      const dy   = mesh.position.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_R) {
        const force = (1 - dist / REPEL_R) * REPEL_F;
        vel.x += (dx / (dist + 0.001)) * force;
        vel.y += (dy / (dist + 0.001)) * force;
      }

      vel.multiplyScalar(DAMP);
      mesh.position.x += vel.x;
      mesh.position.y += vel.y;

      /* slow continuous rotation, mouse skews it */
      mesh.rotation.x += 0.003 + (mouse.y !== 9999 ? (mouse.y * 0.0008) : 0);
      mesh.rotation.y += 0.005 + (mouse.x !== 9999 ? (mouse.x * 0.0005) : 0);

      r.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll",     onScroll);
      window.removeEventListener("resize",     onResize);
      geo.dispose();
      mat.dispose();
      r.dispose();
      if (mount.contains(r.domElement)) mount.removeChild(r.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
