"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import {
  createServicePipeHologram,
  disposeServicePipeObject,
  servicePipeShapes,
} from "@/components/services/ServicePipeCardHologram";

export default function ServiceHeroHologram({ serviceId }: { serviceId: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7.2;

    const group = createServicePipeHologram(servicePipeShapes[serviceId] ?? servicePipeShapes.webdev);
    scene.add(group);

    group.rotation.set(-0.12, -0.42, 0.1);
    group.position.set(window.innerWidth < 900 ? 1.0 : 3.05, window.innerWidth < 900 ? 0.15 : 0.02, -0.35);
    group.scale.setScalar(window.innerWidth < 900 ? 1.0 : 1.85);

    const travel = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
      },
    });
    travel
      .to(group.position, { x: -2.6, y: -0.5, z: -1.2, ease: "none" }, 0.22)
      .to(group.scale, { x: 1.0, y: 1.0, z: 1.0, ease: "none" }, 0.22)
      .to(group.rotation, { z: -0.38, ease: "none" }, 0.22)
      .to(group.position, { x: 2.1, y: 0.7, z: -1.8, ease: "none" }, 0.56)
      .to(group.scale, { x: 0.72, y: 0.72, z: 0.72, ease: "none" }, 0.56)
      .to(group.position, { x: -1.2, y: -0.2, z: -2.1, ease: "none" }, 0.82)
      .to(group.scale, { x: 0.56, y: 0.56, z: 0.56, ease: "none" }, 0.82);

    const pointer = { x: 0, y: 0 };
    const updateMouse = (event: MouseEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      group.rotation.x += ((-0.12 + pointer.y * 0.12) - group.rotation.x) * 0.055;
      group.rotation.y += ((-0.42 + pointer.x * 0.18 + Math.sin(t * 0.18) * 0.08) - group.rotation.y) * 0.055;
      group.rotation.z = 0.1 + Math.sin(t * 0.13) * 0.08;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      travel.scrollTrigger?.kill();
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("resize", resize);
      scene.remove(group);
      disposeServicePipeObject(group);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [serviceId]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-85" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_44%,rgba(58,191,138,0.1),transparent_54%)]" />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
