"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeStroke(points: THREE.Vector3[], radius: number, material: THREE.Material) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.12);
  const geometry = new THREE.TubeGeometry(curve, 96, radius, 12, false);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), material);
  return { geometry, wire };
}

export default function ServicesPipeHologram() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9.8);

    const group = new THREE.Group();
    scene.add(group);
    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);

    const material = new THREE.LineBasicMaterial({
      color: 0x35c592,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const brightMaterial = new THREE.LineBasicMaterial({
      color: 0x53e6b2,
      transparent: true,
      opacity: 0.105,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const strokes = [
      makeStroke(
        [
          new THREE.Vector3(-1.55, 1.02, 0),
          new THREE.Vector3(-2.45, 0.02, 0.12),
          new THREE.Vector3(-1.55, -1.02, 0),
        ],
        0.22,
        material
      ),
      makeStroke(
        [
          new THREE.Vector3(1.55, 1.02, 0),
          new THREE.Vector3(2.45, 0.02, 0.12),
          new THREE.Vector3(1.55, -1.02, 0),
        ],
        0.22,
        material
      ),
      makeStroke(
        [
          new THREE.Vector3(0.62, 1.36, -0.08),
          new THREE.Vector3(0.08, 0.08, 0.04),
          new THREE.Vector3(-0.58, -1.36, -0.08),
        ],
        0.23,
        brightMaterial
      ),
    ];

    strokes.forEach(({ wire }) => group.add(wire));

    const echoStrokes = strokes.map(({ wire }) => {
      const clone = wire.clone();
      clone.position.set(0.16, -0.14, -0.52);
      clone.scale.setScalar(1.08);
      clone.material = material;
      group.add(clone);
      return clone;
    });

    group.position.set(2.52, -0.02, -0.75);
    group.rotation.set(0.16, -0.22, -0.035);
    group.scale.setScalar(1.52);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", resize);

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onPointerLeave = () => {
      target.set(0, 0);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;
      mouse.lerp(target, 0.055);
      group.rotation.y = -0.22 + Math.sin(time * 0.1) * 0.03 + mouse.x * 0.16;
      group.rotation.x = 0.16 + Math.cos(time * 0.09) * 0.02 - mouse.y * 0.1;
      group.rotation.z = -0.035 + mouse.x * 0.025;
      group.position.x = 2.52 + mouse.x * 0.18;
      group.position.y = -0.02 + mouse.y * 0.12;
      echoStrokes.forEach((wire, index) => {
        wire.position.x = 0.16 + mouse.x * (0.035 + index * 0.012);
        wire.position.y = -0.14 + mouse.y * (0.03 + index * 0.01);
        wire.position.z = -0.52 - Math.sin(time * 0.24 + index) * 0.08;
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      strokes.forEach(({ geometry, wire }) => {
        geometry.dispose();
        wire.geometry.dispose();
      });
      echoStrokes.forEach(wire => wire.geometry.dispose());
      material.dispose();
      brightMaterial.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 opacity-80"
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 82% 72% at 75% 50%, black 0%, black 58%, transparent 88%)",
        maskImage:
          "radial-gradient(ellipse 82% 72% at 75% 50%, black 0%, black 58%, transparent 88%)",
      }}
      aria-hidden="true"
    />
  );
}
