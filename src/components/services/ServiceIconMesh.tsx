"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createServicePipeHologram,
  disposeServicePipeObject,
  type ServicePipeShape,
} from "@/components/services/ServicePipeCardHologram";

export default function ServiceIconMesh({ shape }: { shape: ServicePipeShape }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || 80;
    const H = mount.clientHeight || 80;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene   = new THREE.Scene();
    const camera  = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const group = createServicePipeHologram(shape);
    group.scale.setScalar(0.82);
    scene.add(group);

    let raf    = 0;
    let paused = false;

    const observer = new IntersectionObserver(
      ([entry]) => { paused = !entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(mount);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (paused) return;
      const t = performance.now() * 0.001;
      group.rotation.y = 0.16 + Math.sin(t * 0.22) * 0.22;
      group.rotation.x = -0.08 + Math.cos(t * 0.17) * 0.07;
      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.remove(group);
      disposeServicePipeObject(group);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [shape]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
